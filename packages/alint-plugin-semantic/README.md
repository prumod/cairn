# @cairn/alint-plugin-semantic

Alint rules that ask an LLM provider whether a file, function, or document breaks a written instruction. Each rule chooses its own provider and model, so one lint run can use more than one provider.

## Rules

| Rule ID             | Evaluates                                                                   | Diagnostic location                           |
| ------------------- | --------------------------------------------------------------------------- | --------------------------------------------- |
| `semantic/file`     | The whole file, as text                                                     | File level                                    |
| `semantic/function` | The source text of each function                                            | The function's location, as reported by Alint |
| `semantic/document` | The whole file, as plain text (for prose such as `.md`, `.mdx`, `.feature`) | File level                                    |

The plugin never invents a line number. A file-level or document diagnostic has no line. A function diagnostic uses the location Alint gives for that function.

## Options

Every rule takes the same options. Credentials never go in options. They come from environment variables.

| Option             | Required | Default  | Meaning                                                                                                                                              |
| ------------------ | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provider`         | yes      | none     | `openrouter`, `typesafe`, or `cloudflare`                                                                                                            |
| `model`            | yes      | none     | Model ID for that provider. See [Providers](#providers).                                                                                             |
| `instruction`      | yes      | none     | The rule the content must follow, for example `The document never promises an unreleased date.` The provider rates how likely the content breaks it. |
| `violationMessage` | yes      | none     | The message reported for each violation                                                                                                              |
| `threshold`        | no       | `0.85`   | Lowest confidence (0 to 1) that counts as a clear pass or violation. A weaker answer becomes `uncertain`.                                            |
| `onUncertain`      | no       | `ignore` | `ignore` drops uncertain answers. `report` reports them as diagnostics.                                                                              |

An invalid option fails the run with exit code 2.

Each diagnostic carries `provider`, `model`, `status`, and `confidence` as evidence. It never carries a credential.

## Providers

| Provider ID  | Required environment variables                  | Optional environment variables                   | Default API URL                        | Model check                                                                                                                                    |
| ------------ | ----------------------------------------------- | ------------------------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `openrouter` | `OPENROUTER_API_KEY`                            | `OPENROUTER_API_URL`                             | `https://openrouter.ai/api/v1`         | None in the plugin. The API rejects a model it does not know.                                                                                  |
| `typesafe`   | `TYPESAFE_API_KEY`                              | `TYPESAFE_API_URL`                               | `https://api.typesafe.ai/v1`           | The model must appear in the provider's model list. The plugin fetches that list once per process. A failed fetch is retried on the next call. |
| `cloudflare` | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` | `CLOUDFLARE_AI_GATEWAY_ID`, `CLOUDFLARE_API_URL` | `https://api.cloudflare.com/client/v4` | The model must be `clef` or `clef-flash`.                                                                                                      |

Notes:

- A variable that is missing or blank stops the run with exit code 2, and the error names the variable.
- The plugin reads a provider's variables only when a rule selects that provider. A rule set that uses one provider needs only that provider's variables.
- When `CLOUDFLARE_AI_GATEWAY_ID` is set, each Cloudflare request sends it in the `cf-aig-gateway-id` header.
- A `*_API_URL` variable changes the base URL. Use it to point at a compatible proxy.

## Credentials

Copy `.env.example` at the repository root to `.env`, then fill in the values you need. `.env` is git-ignored. Bun loads `.env` automatically for `bun run` scripts.

## Running

Enable a rule in `alint.config.ts` by setting its level and options:

```ts
import { defineConfig } from "@alint-js/cli";
import semanticPlugin from "@cairn/alint-plugin-semantic";

export default defineConfig([
  {
    files: ["docs/**/*.md"],
    plugins: { semantic: semanticPlugin },
    rules: {
      "semantic/document": [
        "error",
        {
          provider: "cloudflare",
          model: "clef-flash",
          instruction: "The document never promises an unreleased date.",
          violationMessage: "The document promises an unreleased date.",
        },
      ],
    },
  },
]);
```

Then run:

```sh
bun run lint:semantic
```

The root `alint.config.ts` sets all three semantic rules to `off`, so this command makes no provider call until you enable a rule there.

### One entry per rule ID per file

Use the same rule ID in several config entries only when their `files` globs do not overlap. Each file then gets the options of the entry that matches it, so `semantic/file` can use one provider for `a/**` and another for `b/**`. When two entries match the same file, Alint merges them and one set of options takes effect. A single file therefore gets at most one `semantic/file`, one `semantic/function`, and one `semantic/document` rule.

## Tests

This package has no automated tests. The repository keeps only tests bound to a `.feature` scenario (see `TESTING.md`). A suite of 94 tests passed before it was deleted. It covered each adapter, each rule, retries, and a run of the real Alint CLI against a local stub. It was never committed.

## Resilience and cache

- **Retries.** A call that fails with a retryable error (a timeout, a rate limit, or a network or server error) is retried twice. The waits are 500 ms, then 1000 ms. Authentication, invalid-request, unknown-model, and cancelled errors fail at once.
- **Timeout.** Each provider call times out after 30 seconds.
- **Concurrency.** At most 4 calls to one provider run at once.
- **Cache.** The plugin keeps no cache of its own. Alint's cache (`.alintcache`, off with `--no-cache`) reuses answers. Its key includes the rule options, so a different provider, model, or instruction is evaluated again.

## Documents

The plugin sends each whole file in one request. It has no size limit and does not split files into chunks yet, so a very large file costs one large request. PDF and DOCX files are not supported. Their support is deferred.

## Adding a provider

1. Add the ID to `PROVIDER_IDS` in `src/types.ts`. The option schema picks it up.
2. Write an adapter in `src/providers/<id>.ts` that returns a `SemanticProvider`. Its `evaluate` method maps each failure to a `SemanticProviderError` with the right `kind` and `retryable` value. Never put a credential in an error message.
3. Add an entry to the registry in `createBuiltInProviders` in `src/providers/compose.ts`. Read required credentials with `requireCredential` and optional settings with `optionalSetting`.
4. Run one real lint with your credentials to check it, since no test covers it.

## Verification status

- **TypeSafe:** verified live with `jev-latest` and `jev-preview`. A file with a hardcoded password was reported as a violation (confidence 0.99). A clean file passed (0.98). A second `alint` run reused Alint's cache (`cached: true`). `semantic/function` reported only the leaking function, at Alint's location for it. `semantic/document` reported only the Markdown file that promised a release date.
- **OpenRouter and Cloudflare:** not called live. They share the code that phrases the rule as a yes/no question where yes means a violation, but their answers are unconfirmed.
- The plugin sends the rule as a question: `Does the content violate the following rule?`. A provider answers the question text it receives, so a bare rule such as "must not contain a password" made yes mean "satisfied" and inverted every result.
