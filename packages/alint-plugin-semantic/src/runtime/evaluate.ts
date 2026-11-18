import type { SemanticRuleOptions } from "../config";
import type { ProviderResolver } from "../registry";
import type { SemanticResult, SemanticStatus } from "../types";
import { effectiveStatus, shouldReport } from "./normalize";

export interface SemanticDecision {
  readonly report: boolean;
  readonly status: SemanticStatus;
  readonly result: SemanticResult;
}

export const evaluateSemantic = async (input: {
  readonly resolve: ProviderResolver;
  readonly options: SemanticRuleOptions;
  readonly content: string;
  readonly signal?: AbortSignal;
}): Promise<SemanticDecision> => {
  const provider = input.resolve(input.options.provider);

  const result = await provider.evaluate({
    model: input.options.model,
    instruction: input.options.instruction,
    content: input.content,
    signal: input.signal,
  });

  const status = effectiveStatus(result, input.options.threshold);

  return { report: shouldReport(status, input.options.onUncertain), status, result };
};
