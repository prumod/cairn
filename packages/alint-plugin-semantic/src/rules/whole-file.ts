import { defineRule, type FileTarget } from "@alint-js/plugin";
import { semanticRuleOptions } from "../config";
import type { ProviderResolver } from "../registry";
import { evaluateSemantic } from "../runtime/evaluate";

/**
 * Judges the whole text of each file the rule receives. The provider answers for the whole file
 * and gives no location, so every diagnostic is file-level.
 */
export const createWholeFileRule = (resolve: ProviderResolver) =>
  defineRule({
    options: [semanticRuleOptions],
    create: (ctx) => ({
      async onTargetFile(target: FileTarget) {
        const [options] = ctx.options;
        const file = await ctx.src.readFile(target.file);

        const decision = await evaluateSemantic({
          resolve,
          options,
          content: file.text,
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
