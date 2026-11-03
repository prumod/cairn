# PDF text extraction in a Cloudflare Worker

**Research date:** 2026-11-03  
**Issue:** [prumod/cairn#150](https://github.com/prumod/cairn/issues/150)  
**Scope:** Which option can extract the line-labelled text («Label: value») of a Diário da República announcement PDF inside a Worker, within Workers limits. One PDF was tested locally and in a local workerd runtime. Other announcements, and the deployed Worker, are not tested.

## Finding

Use [unpdf](https://github.com/unjs/unpdf) `2.1.0` (MIT), which bundles a serverless build of Mozilla's PDF.js. In the test, it preserved every «Label: value» line of the sample PDF, and it ran in a local workerd runtime with output identical to Node. Run it only on a Workers **Paid** plan: a local Node run used about 310–330 ms of CPU for four pages, far above the Free plan's 10 ms per request. Put a size cap and a timeout around every call.

Fallback, not tested: Workers AI `toMarkdown` also documents PDF input, but it has no local runtime and needs a Cloudflare account to test. The PDF is untagged, so its output would be the page text as-is.

## Confirmed by the test

Input: `https://files.diariodarepublica.pt/cp_hora/2026/11/213/419976724.pdf`, one download, 83,363 bytes, 4 pages (Município de Cascais, procedimento n.º 26429/2026). Reference: `pdftotext -layout` on the same file.

- **Label lines preserved:** unpdf output has 82 «Label: value» lines, the same 82 as the reference, with 0 missing. The probes you named match exactly, for example `Concelho: Cascais`, `Vocabulário Principal: 45300000 - Instalações em edifícios`, `Preço base s/IVA: 312.190,34 EUR`, and `Prazo para apresentação das propostas: 02-12-2026 23:59`.
- **Value wraps to an unlabelled line:** the value of `Designação do contrato:` wraps onto a line with no label, `Munícipio`. A parser must attach such a line to the previous label's value.
- **Heading without a colon:** `Objeto principal` sits alone on its own line, and the label `Vocabulário Principal:` follows it. Treat colon-less lines as headings, not as values.
- **Letter-spaced heading:** `Link para acesso às peças do concurso (URL):` appears as `L i n k p a r a a c e s s o à s p e ç a s d o c o n c u r s o ( U R L ) :`. `pdftotext` produces the same spacing. Normalise it before matching a label.
- **Page furniture:** `Anúncio de procedimento n.º 26429/2026`, `2.ª série`, and `N.º 213` repeat at page boundaries. The parser must drop them.
- **Encryption:** the PDF has an owner password only (`print:yes copy:yes change:no`). PDF.js opened it with no password.

Timing, from `scratch/test/unpdf-test.mjs` (Node 24.22.0, Linux, three separate processes):

| Run | Extraction CPU (ms) | Extraction wall (ms) | RSS before → after (MB) |
|---|---|---|---|
| 1 | 312.2 | 171.9 | 49.8 → 94.7 |
| 2 | 324.2 | 163.5 | 49.5 → 94.4 |
| 3 | 311.8 | 161.1 | 49.4 → 91.7 |

These are Node figures, not Workers CPU figures. They establish the order of magnitude only.

workerd run (miniflare 4.20260730.0, workerd 1.20260730.1, bundle from esbuild): first request 153 ms wall, second 27 ms wall. The output was identical to the Node output.

**Caller buffer is detached.** `extractText` transfers the input `ArrayBuffer` to PDF.js. Reproduced in Node: `byteLength` went from 83363 to 0, and `buffer.detached` went from `false` to `true`. Any code that uses the bytes after extraction (for example, storing them) must pass `data.slice()`.

## Platform limits

From the Cloudflare Workers limits page, [source](https://developers.cloudflare.com/workers/platform/limits/index.md):

- **CPU time:** Free is 10 ms per HTTP request. Paid is 5 min maximum, with a default of 30 s, set through `limits.cpu_ms` ([CPU time](https://developers.cloudflare.com/workers/platform/limits/#cpu-time)).
- **Memory:** 128 MB per isolate, including the JavaScript heap and WebAssembly ([Memory](https://developers.cloudflare.com/workers/platform/limits/#memory)).
- **Worker size:** 64 MiB uncompressed. The page says "There is no compressed size limit" ([Worker size](https://developers.cloudflare.com/workers/platform/limits/#worker-size)). The test bundle was 1,632,463 bytes minified, 511,040 bytes gzipped.

The repo's `packages/infra/alchemy.run.ts` sets `compatibility: { date: "2026-10-09", flags: [] }`. The test ran without `nodejs_compat` and passed. The local workerd only accepts compatibility dates up to 2026-08-06, so the test used that date instead. Re-check on the repo's date before deploying.

The repo does not show which Cloudflare plan the Worker uses. Confirm that before relying on the CPU budget.

## Candidates

| Option | Verdict | Evidence |
|---|---|---|
| **unpdf 2.1.0** | Recommended | Serverless PDF.js build for Workers ([README](https://github.com/unjs/unpdf)). Bundles PDF.js v6.4.299 and works in Node 24+, Bun, browsers, and serverless ([README](https://github.com/unjs/unpdf#readme)). Tested: labels preserved, runs in workerd. npm: [unpdf 2.1.0](https://registry.npmjs.org/unpdf/2.1.0), MIT, `engines.node >=24`. |
| pdfjs-dist 6.x directly | Not chosen | Same PDF.js engine. Its Node path uses a worker file that Workers cannot load; unpdf inlines that worker ([README, "How it works"](https://github.com/unjs/unpdf#how-it-works)). Not tested on its own. |
| pdf-parse 2.4.5 | Rejected | Depends on `@napi-rs/canvas` (native bindings) and `pdfjs-dist`; `engines` is Node 20/22 only ([npm](https://registry.npmjs.org/pdf-parse/2.4.5)). Workers run V8 isolates, and the docs point to WebAssembly for compiled code ([How Workers works](https://developers.cloudflare.com/workers/reference/how-workers-works/), [WebAssembly](https://developers.cloudflare.com/workers/runtime-apis/webassembly/)). Inference from these sources, not tested. |
| Workers AI `toMarkdown` | Fallback, not tested | PDF is documented ([How it works, PDFs](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/how-it-works/#pdfs)). Untagged PDFs go through "as-is" page text. Options: [PDF](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/conversion-options/#pdf). Free for most conversions ([overview](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/)). Needs the `env.AI` binding, so untestable locally without an account. |
| Browser Rendering | Not recommended | The [pricing page](https://developers.cloudflare.com/browser-rendering/platform/pricing/) bills browser hours only. It does not document PDF-to-text. |
| External extraction service | Not evaluated | Adds a third party and a network hop. Not needed for a result that unpdf already produced. |

## Requirements for the parser

1. Normalise whitespace. Collapse runs of spaces, and join single letters separated by spaces (only the `L i n k` heading needed this).
2. Treat a line with `Label: value` as a field. Treat a colon-less line as a heading.
3. Attach an unlabelled line to the previous field's value (the `Munícipio` case).
4. Drop page furniture: lines matching the publication name, the series, and the issue number.
5. Pass `data.slice()` to `extractText`, or keep the original bytes elsewhere.
6. Cap PDF size and race extraction against a timeout. The unpdf README says parsing runs on the event loop with no worker, and that resource limits are the caller's job.

## Not verified

- **Workers CPU and memory:** not measured in a deployed Worker or under workerd's CPU accounting. The 128 MB isolate limit has not been tested. Node's RSS rose to about 95 MB for this PDF; RSS is not the isolate heap.
- **Other PDFs:** one announcement only. Multi-column or table-heavy notices may order lines differently.
- **`toMarkdown`:** not run. Output format and cost are unknown.
- **Repo compatibility date:** the local runtime cannot run 2026-10-09.

## Reproduce

Scratch files, not committed. Directory: `scratchpad/test` (Node harness: `unpdf-test.mjs`, `compare.mjs`, `detach-check.mjs`) and `scratchpad/workerd` (workerd harness: `src/worker.mjs`, `run-workerd-noflags.mjs`). Scratchpad root: `/tmp/claude-1000/-home-tiago--t3-worktrees-cairn-web-t3-b2b06db6/e7196a3b-650e-44d1-97b3-1a6a86c86312/scratchpad`.

```sh
curl -sSL -A "Mozilla/5.0 (X11; Linux x86_64) cairn-research/1.0" -o announcement.pdf \
  https://files.diariodarepublica.pt/cp_hora/2026/11/213/419976724.pdf
pdftotext -layout announcement.pdf ref-layout.txt
npm install --ignore-scripts unpdf@2.1.0 pdfjs-dist@6.4.299
node unpdf-test.mjs announcement.pdf unpdf-out.txt
node compare.mjs ref-layout.txt unpdf-out.txt
```
