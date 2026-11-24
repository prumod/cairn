import { defineRule, type FunctionTarget } from "@alint-js/plugin";
import { semanticRuleOptions } from "../config";
import type { ProviderResolver } from "../registry";
import { evaluateSemantic } from "../runtime/evaluate";

/**
 * Evaluates the source of each function that Alint extracts. The rule reads the function's range
 * from the file and reports at the location Alint gives, so it never parses code itself.
 */
export const createSemanticFunctionRule = (resolve: ProviderResolver) =>
  defineRule({
    languages: "any",
    options: [semanticRuleOptions],
    create: (ctx) => ({
      async onTargetFunction(target: FunctionTarget) {
        const [options] = ctx.options;

        if (target.range === undefined) {
          throw new Error(
            `Alint gave no source range for the function "${target.name ?? "(unnamed)"}" in ${target.file.path}.`,
          );
        }

        const file = await ctx.src.readFile(target.file);
        const source = ctx.src.sliceRange(file, target.range);

        const decision = await evaluateSemantic({
          resolve,
          options,
          content: source.text,
          signal: ctx.signal,
        });

        ctx.logger.debug(`${ctx.id} evaluated`, {
          provider: options.provider,
          model: options.model,
          status: decision.status,
        });

        if (!decision.report) return;

        ctx.report({
          filePath: target.file.path,
          loc: target.loc ?? source.loc,
          message: options.violationMessage,
          evidence: {
            provider: options.provider,
            model: options.model,
            status: decision.status,
            confidence: decision.result.confidence,
          },
        });
      },
    }),
  });
