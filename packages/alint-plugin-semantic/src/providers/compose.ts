import type { ProviderRegistry } from "../registry";
import type { ProviderId } from "../types";
import { createCloudflareProvider } from "./cloudflare";
import { SemanticProviderError } from "./errors";
import { createOpenRouterProvider } from "./openrouter";
import { createTypeSafeProvider } from "./typesafe";

/** Environment variables, read by name. Credentials come only from here, never from rule options. */
export type Environment = Readonly<Partial<Record<string, string>>>;

const requireCredential = (env: Environment, name: string, provider: ProviderId): string => {
  const value = env[name]?.trim();

  if (value === undefined || value === "") {
    throw new SemanticProviderError({
      provider,
      kind: "missing-credentials",
      retryable: false,
      message: `Set ${name} to use the "${provider}" semantic provider.`,
    });
  }

  return value;
};

const optionalSetting = (env: Environment, name: string): string | undefined => {
  const value = env[name]?.trim();

  return value === undefined || value === "" ? undefined : value;
};

/**
 * Builds the providers the plugin ships with. Each `create` reads its environment when the
 * first rule selects that provider, so a rule set that uses one provider needs only that
 * provider's variables.
 */
export const createBuiltInProviders = (env: Environment): ProviderRegistry => ({
  openrouter: {
    id: "openrouter",
    create: () =>
      createOpenRouterProvider({
        apiKey: requireCredential(env, "OPENROUTER_API_KEY", "openrouter"),
        apiUrl: optionalSetting(env, "OPENROUTER_API_URL"),
      }),
  },
  typesafe: {
    id: "typesafe",
    create: () =>
      createTypeSafeProvider({
        apiKey: requireCredential(env, "TYPESAFE_API_KEY", "typesafe"),
        apiUrl: optionalSetting(env, "TYPESAFE_API_URL"),
      }),
  },
  cloudflare: {
    id: "cloudflare",
    create: () =>
      createCloudflareProvider({
        accountId: requireCredential(env, "CLOUDFLARE_ACCOUNT_ID", "cloudflare"),
        apiKey: requireCredential(env, "CLOUDFLARE_API_TOKEN", "cloudflare"),
        gatewayId: optionalSetting(env, "CLOUDFLARE_AI_GATEWAY_ID"),
        apiUrl: optionalSetting(env, "CLOUDFLARE_API_URL"),
      }),
  },
});
