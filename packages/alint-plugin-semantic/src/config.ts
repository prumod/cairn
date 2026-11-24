import * as v from "valibot";
import { PROVIDER_IDS } from "./types";

/**
 * Options that every semantic rule accepts. Each rule chooses its own provider and model.
 * Credentials never appear here; they come from the environment.
 */
export const semanticRuleOptions = v.object({
  provider: v.picklist(PROVIDER_IDS),
  model: v.pipe(v.string(), v.trim(), v.minLength(1)),
  instruction: v.pipe(v.string(), v.trim(), v.minLength(1)),
  violationMessage: v.pipe(v.string(), v.trim(), v.minLength(1)),
  threshold: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(1)), 0.85),
  onUncertain: v.optional(v.picklist(["ignore", "report"]), "ignore"),
});

export type SemanticRuleOptions = v.InferOutput<typeof semanticRuleOptions>;
