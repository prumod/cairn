import type { ProviderResolver } from "../registry";
import { createWholeFileRule } from "./whole-file";

/**
 * Evaluates the text of a prose document against the rule's instruction. Documents such as
 * Markdown (`.md`, `.mdx`) and Gherkin (`.feature`) are read as plain text, so no parser runs.
 */
export const createSemanticDocumentRule = (resolve: ProviderResolver) =>
  createWholeFileRule(resolve);
