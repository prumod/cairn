export const PROVIDER_IDS = ["openrouter", "typesafe", "cloudflare"] as const;

export type ProviderId = (typeof PROVIDER_IDS)[number];

export type SemanticStatus = "pass" | "violation" | "uncertain";

export interface SemanticEvaluation {
  readonly model: string;
  readonly instruction: string;
  readonly content: string;
  readonly signal?: AbortSignal;
}

/**
 * The normalized answer of one provider call. `confidence` is in 0..1 when the provider gives
 * one. Providers never add explanations, line numbers or fixes that they did not return.
 */
export interface SemanticResult {
  readonly status: SemanticStatus;
  readonly confidence?: number;
  readonly provider: ProviderId;
  readonly model: string;
}

export interface SemanticProvider {
  evaluate(input: SemanticEvaluation): Promise<SemanticResult>;
}
