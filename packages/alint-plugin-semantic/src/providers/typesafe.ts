import { TypeSafeClient, TypeSafeDecisionModel } from "@effect/ai-typesafe";
import type * as AiError from "effect/ai/AiError";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as FetchHttpClient from "effect/http/FetchHttpClient";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import type { SemanticProvider } from "../types";
import { createDecisionProvider, DEFAULT_TIMEOUT_MS } from "./decision";
import { unknownModelError } from "./errors";

export interface TypeSafeSettings {
  readonly apiKey: string;
  /** Overrides the package default, `https://api.typesafe.ai/v1`. */
  readonly apiUrl?: string | undefined;
}

type ModelCatalog = Exit.Exit<ReadonlySet<string>, AiError.AiError>;

/**
 * Builds a provider that checks each model against TypeSafe's model list before deciding. The
 * list is fetched once and shared by every rule of this provider. A failed fetch is not kept, so
 * the next evaluation fetches again.
 */
export const createTypeSafeProvider = (settings: TypeSafeSettings): SemanticProvider => {
  const clientLayer = TypeSafeClient.layer({
    apiKey: Redacted.make(settings.apiKey),
    apiUrl: settings.apiUrl,
  }).pipe(Layer.provide(FetchHttpClient.layer));

  const listModelNames = Effect.gen(function* () {
    const client = yield* TypeSafeClient.TypeSafeClient;
    const response = yield* client.listModels();

    return new Set(response.models.map((model) => model.name));
  }).pipe(Effect.provide(clientLayer));

  let catalog: Promise<ModelCatalog> | undefined;

  const loadCatalog = (): Promise<ModelCatalog> => {
    if (catalog === undefined) {
      catalog = Effect.runPromiseExit(listModelNames).then((exit) => {
        if (Exit.isFailure(exit)) catalog = undefined;

        return exit;
      });
    }

    return catalog;
  };

  const checkModel = (model: string) =>
    Effect.promise(() => loadCatalog()).pipe(
      Effect.flatMap((exit) =>
        Exit.isSuccess(exit) ? Effect.succeed(exit.value) : Effect.failCause(exit.cause),
      ),
      Effect.flatMap((names) =>
        names.has(model) ? Effect.void : Effect.fail(unknownModelError("typesafe", model)),
      ),
    );

  return createDecisionProvider({
    id: "typesafe",
    timeoutMs: DEFAULT_TIMEOUT_MS,
    layerFor: (model) => TypeSafeDecisionModel.layer({ model }).pipe(Layer.provide(clientLayer)),
    checkModel,
  });
};
