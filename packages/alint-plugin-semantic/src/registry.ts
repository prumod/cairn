import type { ProviderDefinition } from "./providers/types";
import type { ProviderId, SemanticProvider } from "./types";

export type ProviderRegistry = Readonly<Partial<Record<ProviderId, ProviderDefinition>>>;

export type ProviderResolver = (id: ProviderId) => SemanticProvider;

/**
 * Returns one provider instance per id, created on first use and reused by every rule that
 * selects it.
 */
export const createProviderResolver = (registry: ProviderRegistry): ProviderResolver => {
  const instances = new Map<ProviderId, SemanticProvider>();

  return (id) => {
    const existing = instances.get(id);

    if (existing !== undefined) return existing;

    const definition = registry[id];

    if (definition === undefined) {
      throw new Error(`Semantic provider "${id}" is not registered.`);
    }

    const provider = definition.create();
    instances.set(id, provider);

    return provider;
  };
};
