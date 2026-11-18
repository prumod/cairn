import * as AiError from "effect/ai/AiError";
import * as Decision from "effect/ai/Decision";
import * as DecisionModel from "effect/ai/DecisionModel";
import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import type * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import type { ProviderId, SemanticEvaluation, SemanticProvider, SemanticResult } from "../types";
import {
  cancelledError,
  providerErrorFromAi,
  type SemanticProviderError,
  timeoutError,
} from "./errors";

export const DEFAULT_TIMEOUT_MS = 30_000;

const SemanticInput = Schema.Struct({ content: Schema.String });

/**
 * Phrases the rule as a yes/no question where yes means a violation. A provider answers the
 * question text it receives, so the bare rule would make yes mean "the rule is satisfied".
 */
const violationQuestion = (instruction: string): string =>
  `Does the content violate the following rule? Answer yes only if it does.\n\nRule: ${instruction}`;

/**
 * One probability decision: the provider estimates how likely the content violates the rule's
 * instruction. The `violation` key names the answer that `resultFromProbability` reads.
 */
const violationDecision = (instruction: string) =>
  Decision.make({
    input: SemanticInput,
    decisions: {
      violation: Decision.probability({
        instructions: violationQuestion(instruction),
        criteria: {
          false: "The content follows the instruction.",
          true: "The content violates the instruction.",
        },
      }),
    },
  });

/**
 * Turns the probability of a violation into a status. `confidence` is the probability of the
 * status that was chosen, so a 0.5 tie becomes `violation` with confidence 0.5.
 */
export const resultFromProbability = (
  probability: number,
  provider: ProviderId,
  model: string,
): SemanticResult => {
  const violated = probability >= 0.5;

  return {
    status: violated ? "violation" : "pass",
    confidence: violated ? probability : 1 - probability,
    provider,
    model,
  };
};

export interface DecisionProviderOptions {
  readonly id: ProviderId;
  readonly timeoutMs: number;
  /** Builds the decision service for one model. Credentials and HTTP are already provided. */
  readonly layerFor: (model: string) => Layer.Layer<DecisionModel.DecisionModel>;
  /**
   * Fails when the provider does not offer the model. Runs before each decision and shares its
   * timeout and cancellation. Omit it when the provider cannot check model identifiers.
   */
  readonly checkModel?: (
    model: string,
  ) => Effect.Effect<void, AiError.AiError | SemanticProviderError>;
}

const decide = Effect.fnUntraced(
  function* (options: DecisionProviderOptions, input: SemanticEvaluation) {
    if (options.checkModel !== undefined) yield* options.checkModel(input.model);

    const response = yield* DecisionModel.decide(violationDecision(input.instruction), {
      input: { content: input.content },
    });

    return resultFromProbability(response.answers.violation.probability, options.id, input.model);
  },
  (effect, options, input) =>
    effect.pipe(
      Effect.provide(options.layerFor(input.model)),
      Effect.timeoutOrElse({
        duration: options.timeoutMs,
        orElse: () => Effect.fail(timeoutError(options.id, input.model, options.timeoutMs)),
      }),
      Effect.mapError((error) =>
        AiError.isAiError(error)
          ? providerErrorFromAi({ provider: options.id, model: input.model, error })
          : error,
      ),
    ),
);

const runDecision = async (
  options: DecisionProviderOptions,
  input: SemanticEvaluation,
): Promise<SemanticResult> => {
  const exit = await Effect.runPromiseExit(decide(options, input), { signal: input.signal });

  if (Exit.isSuccess(exit)) return exit.value;

  if (input.signal?.aborted === true) throw cancelledError(options.id, input.model);

  const failure = Cause.findErrorOption(exit.cause);

  if (Option.isSome(failure)) throw failure.value;

  throw Cause.squash(exit.cause);
};

/** Wraps a decision service as a semantic provider. Each provider adapter supplies its layers. */
export const createDecisionProvider = (options: DecisionProviderOptions): SemanticProvider => ({
  evaluate: (input) => runDecision(options, input),
});
