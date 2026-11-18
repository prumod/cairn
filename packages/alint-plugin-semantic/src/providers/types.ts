import type { ProviderId, SemanticProvider } from "../types";

/**
 * How one provider plugs into the registry. Adding a provider means adding one definition and
 * one `ProviderId`; semantic rules never change.
 */
export interface ProviderDefinition {
  readonly id: ProviderId;
  readonly create: () => SemanticProvider;
}
