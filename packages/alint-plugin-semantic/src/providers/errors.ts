import type * as AiError from "effect/ai/AiError";
import * as Schema from "effect/Schema";
import { PROVIDER_IDS, type ProviderId } from "../types";

export const PROVIDER_ERROR_KINDS = [
  "missing-credentials",
  "authentication",
  "rate-limited",
  "quota-exhausted",
  "invalid-request",
  "provider-unavailable",
  "provider-error",
  "unknown-model",
  "timeout",
  "cancelled",
] as const;

export type ProviderErrorKind = (typeof PROVIDER_ERROR_KINDS)[number];

/**
 * A provider call failed. Messages name the provider, model and error kind only. They never
 * include credentials or raw provider text.
 */
export class SemanticProviderError extends Schema.TaggedError<SemanticProviderError>()(
  "SemanticProviderError",
  {
    provider: Schema.Literals(PROVIDER_IDS),
    kind: Schema.Literals(PROVIDER_ERROR_KINDS),
    retryable: Schema.Boolean,
    message: Schema.String,
  },
) {}

const kindForReason = (tag: string): ProviderErrorKind => {
  switch (tag) {
    case "AuthenticationError":
      return "authentication";
    case "RateLimitError":
      return "rate-limited";
    case "QuotaExhaustedError":
      return "quota-exhausted";
    case "InvalidRequestError":
      return "invalid-request";
    case "NetworkError":
    case "InternalProviderError":
      return "provider-unavailable";
    default:
      return "provider-error";
  }
};

export const providerErrorFromAi = (input: {
  readonly provider: ProviderId;
  readonly model: string;
  readonly error: AiError.AiError;
}): SemanticProviderError => {
  const { reason } = input.error;

  return new SemanticProviderError({
    provider: input.provider,
    kind: kindForReason(reason._tag),
    retryable: reason.isRetryable,
    message: `Semantic provider "${input.provider}" failed for model "${input.model}" with ${reason._tag}.`,
  });
};

export const timeoutError = (provider: ProviderId, model: string, timeoutMs: number) =>
  new SemanticProviderError({
    provider,
    kind: "timeout",
    retryable: true,
    message: `Semantic provider "${provider}" did not answer model "${model}" within ${timeoutMs} ms.`,
  });

export const unknownModelError = (provider: ProviderId, model: string) =>
  new SemanticProviderError({
    provider,
    kind: "unknown-model",
    retryable: false,
    message: `Semantic provider "${provider}" does not offer model "${model}".`,
  });

export const cancelledError = (provider: ProviderId, model: string) =>
  new SemanticProviderError({
    provider,
    kind: "cancelled",
    retryable: false,
    message: `Semantic provider "${provider}" was cancelled while evaluating model "${model}".`,
  });
