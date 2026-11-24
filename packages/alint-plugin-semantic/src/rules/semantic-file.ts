import type { ProviderResolver } from "../registry";
import { createWholeFileRule } from "./whole-file";

/** Evaluates the whole content of each file against the rule's instruction. */
export const createSemanticFileRule = (resolve: ProviderResolver) => createWholeFileRule(resolve);
