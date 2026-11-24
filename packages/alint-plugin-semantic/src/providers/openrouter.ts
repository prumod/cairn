import { OpenRouterClient, OpenRouterDecisionModel } from "@effect/ai-openrouter";
import * as FetchHttpClient from "effect/http/FetchHttpClient";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import type { SemanticProvider } from "../types";
import { createDecisionProvider, DEFAULT_TIMEOUT_MS } from "./decision";

export interface OpenRouterSettings {
  readonly apiKey: string;
  /** Overrides the package default, `https://openrouter.ai/api/v1`. */
  readonly apiUrl?: string | undefined;
}

export const createOpenRouterProvider = (settings: OpenRouterSettings): SemanticProvider => {
  const clientLayer = OpenRouterClient.layer({
    apiKey: Redacted.make(settings.apiKey),
    apiUrl: settings.apiUrl,
  }).pipe(Layer.provide(FetchHttpClient.layer));

  return createDecisionProvider({
    id: "openrouter",
    timeoutMs: DEFAULT_TIMEOUT_MS,
    layerFor: (model) => OpenRouterDecisionModel.layer({ model }).pipe(Layer.provide(clientLayer)),
  });
};
