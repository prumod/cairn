import { CloudflareClient, CloudflareDecisionModel } from "@effect/ai-cloudflare";
import * as Effect from "effect/Effect";
import * as FetchHttpClient from "effect/http/FetchHttpClient";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import type { SemanticProvider } from "../types";
import { createDecisionProvider, DEFAULT_TIMEOUT_MS } from "./decision";
import { unknownModelError } from "./errors";

/** The Clef models that the installed `@effect/ai-cloudflare` package exposes. */
export const CLOUDFLARE_MODELS = ["clef", "clef-flash"] as const;

export interface CloudflareSettings {
  readonly accountId: string;
  readonly apiKey: string;
  readonly gatewayId?: string | undefined;
  /** Overrides the package default, `https://api.cloudflare.com/client/v4`. */
  readonly apiUrl?: string | undefined;
}

export const createCloudflareProvider = (settings: CloudflareSettings): SemanticProvider => {
  const clientLayer = CloudflareClient.layer({
    accountId: settings.accountId,
    apiKey: Redacted.make(settings.apiKey),
    gatewayId: settings.gatewayId,
    apiUrl: settings.apiUrl,
  }).pipe(Layer.provide(FetchHttpClient.layer));

  return createDecisionProvider({
    id: "cloudflare",
    timeoutMs: DEFAULT_TIMEOUT_MS,
    layerFor: (model) => CloudflareDecisionModel.layer({ model }).pipe(Layer.provide(clientLayer)),
    checkModel: (model) =>
      CLOUDFLARE_MODELS.some((known) => known === model)
        ? Effect.void
        : Effect.fail(unknownModelError("cloudflare", model)),
  });
};
