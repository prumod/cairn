import { definePlugin } from "@alint-js/plugin";
import { createBuiltInProviders } from "./providers/compose";
import { createProviderResolver, type ProviderRegistry } from "./registry";
import { createResilientResolver } from "./runtime/resilient-resolver";
import { createSemanticDocumentRule } from "./rules/semantic-document";
import { createSemanticFileRule } from "./rules/semantic-file";
import { createSemanticFunctionRule } from "./rules/semantic-function";

export const createSemanticPlugin = (providers: ProviderRegistry) => {
  const resolve = createResilientResolver(createProviderResolver(providers));

  return definePlugin({
    rules: {
      document: createSemanticDocumentRule(resolve),
      file: createSemanticFileRule(resolve),
      function: createSemanticFunctionRule(resolve),
    },
  });
};

export default createSemanticPlugin(createBuiltInProviders(process.env));
