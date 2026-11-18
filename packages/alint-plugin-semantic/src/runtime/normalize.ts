import type { SemanticResult, SemanticStatus } from "../types";

/**
 * Turns a provider answer into the status a rule acts on. A `pass` or `violation` below the
 * threshold is `uncertain`, so a weak answer never counts as a clear result.
 */
export const effectiveStatus = (result: SemanticResult, threshold: number): SemanticStatus => {
  if (result.confidence === undefined) return result.status;

  if (!Number.isFinite(result.confidence) || result.confidence < 0 || result.confidence > 1) {
    throw new RangeError(
      `Semantic provider "${result.provider}" returned a confidence outside 0..1.`,
    );
  }

  if (result.status === "uncertain") return "uncertain";

  return result.confidence >= threshold ? result.status : "uncertain";
};

export const shouldReport = (status: SemanticStatus, onUncertain: "ignore" | "report"): boolean => {
  if (status === "violation") return true;

  if (status === "uncertain") return onUncertain === "report";

  return false;
};
