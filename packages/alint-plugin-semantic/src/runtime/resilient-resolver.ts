import { SemanticProviderError } from "../providers/errors";
import type { ProviderResolver } from "../registry";
import type { ProviderId, SemanticProvider, SemanticResult } from "../types";

export interface ResilienceSettings {
  /** Retries after the first attempt. Only retryable failures are retried. */
  readonly retries: number;
  /** The wait before the first retry. Each later retry waits twice as long as the one before. */
  readonly retryDelayMs: number;
  /** Provider calls allowed in flight at once, for each provider. */
  readonly concurrency: number;
}

export const DEFAULT_RESILIENCE: ResilienceSettings = {
  retries: 2,
  retryDelayMs: 500,
  concurrency: 4,
};

const wait = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((done) => {
    if (signal?.aborted === true) return done();

    const timer = setTimeout(done, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        done();
      },
      { once: true },
    );
  });

const attemptWithRetries = async (
  attempt: () => Promise<SemanticResult>,
  settings: ResilienceSettings,
  signal: AbortSignal | undefined,
): Promise<SemanticResult> => {
  for (let retry = 0; ; retry++) {
    try {
      return await attempt();
    } catch (error) {
      const canRetry =
        retry < settings.retries &&
        error instanceof SemanticProviderError &&
        error.retryable &&
        signal?.aborted !== true;

      if (!canRetry) throw error;

      await wait(settings.retryDelayMs * 2 ** retry, signal);
    }
  }
};

/**
 * Admits at most `slots` tasks at once. A freed slot passes straight to the next waiting task,
 * so a newcomer can never take it first.
 */
const createLimiter = (slots: number) => {
  let busy = 0;
  const queue: Array<() => void> = [];

  const release = () => {
    const next = queue.shift();

    if (next === undefined) busy -= 1;
    else next();
  };

  return async <T>(task: () => Promise<T>): Promise<T> => {
    if (busy < slots) busy += 1;
    else await new Promise<void>((admit) => queue.push(admit));

    try {
      return await task();
    } finally {
      release();
    }
  };
};

/**
 * Wraps a resolver so every provider it returns retries retryable failures and limits its
 * calls in flight. Alint's own cache reuses answers, so this wrapper keeps none.
 */
export const createResilientResolver = (
  resolve: ProviderResolver,
  settings: ResilienceSettings = DEFAULT_RESILIENCE,
): ProviderResolver => {
  const providers = new Map<ProviderId, SemanticProvider>();

  return (id) => {
    const existing = providers.get(id);

    if (existing !== undefined) return existing;

    const inner = resolve(id);
    const admit = createLimiter(settings.concurrency);

    const provider: SemanticProvider = {
      async evaluate(input) {
        return admit(() => attemptWithRetries(() => inner.evaluate(input), settings, input.signal));
      },
    };

    providers.set(id, provider);

    return provider;
  };
};
