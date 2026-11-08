// PROTOTYPE — throwaway. Shows one lote row styled three ways, light and dark, with its source.
import { renderToStaticMarkup } from "react-dom/server";
import "./tokens.css";
import "./b-tailwind/tailwind.css";
import { LOTES } from "./data";
import { LoteRow as RowA } from "./a-plain-css/loteRow";
import { LoteRow as RowB } from "./b-tailwind/loteRow";
import { LoteRow as RowC } from "./c-css-modules/loteRow";
import srcA from "./a-plain-css/loteRow.tsx?raw";
import cssA from "./a-plain-css/loteRow.css?raw";
import srcB from "./b-tailwind/loteRow.tsx?raw";
import cssB from "./b-tailwind/tailwind.css?raw";
import srcC from "./c-css-modules/loteRow.tsx?raw";
import cssC from "./c-css-modules/loteRow.module.css?raw";

const VARIANTS = [
  {
    key: "A",
    name: "Tokens + plain CSS per component",
    Row: RowA,
    files: [
      { name: "loteRow.tsx", text: srcA },
      { name: "loteRow.css", text: cssA },
    ],
  },
  {
    key: "B",
    name: "Tailwind v4 utilities over the same tokens",
    Row: RowB,
    files: [
      { name: "loteRow.tsx", text: srcB },
      { name: "tailwind.css (once per app)", text: cssB },
    ],
  },
  {
    key: "C",
    name: "Tokens + CSS Modules per component",
    Row: RowC,
    files: [
      { name: "loteRow.tsx", text: srcC },
      { name: "loteRow.module.css", text: cssC },
    ],
  },
];

function Panel({ theme, Row }: { theme: "light" | "dark"; Row: typeof RowA }) {
  return (
    <div className="pv-panel" data-theme={theme}>
      <div className="pv-label">{theme === "light" ? "Claro" : "Escuro"}</div>
      <div className="pv-grp">
        <span>Leiria</span>
        <span>3 lotes</span>
      </div>
      <div role="listbox" aria-label="Lotes">
        {LOTES.slice(0, 3).map((lote) => (
          <Row key={lote.id} lote={lote} />
        ))}
      </div>
    </div>
  );
}

function Page() {
  return (
    <main className="pv">
      <h1>How production expresses final-visual's look — one lote row, three ways</h1>
      <p className="pv-note">
        Same tokens (final-visual's <code>:root</code> block, unchanged) under all three. Rows:
        prazo amanhã (amber), selected, prazo terminado. (Data has a fourth case, «consta da
        plataforma», left out of the preview for size.) Hover a row.
      </p>
      {VARIANTS.map(({ key, name, Row, files }) => (
        <section key={key} className="pv-variant">
          <h2>
            {key} · {name}
          </h2>
          <div className="pv-pair">
            <Panel theme="light" Row={Row} />
            <Panel theme="dark" Row={Row} />
          </div>
          <div className="pv-src">
            {files.map((f) => {
              const lines = f.text.trimEnd().split("\n");
              const shown = lines.slice(0, 26);

              return (
                <figure key={f.name}>
                  <figcaption>
                    {f.name} · {lines.length} lines
                    {shown.length < lines.length && ` (first ${shown.length} shown)`}
                  </figcaption>
                  <pre>{shown.join("\n")}</pre>
                </figure>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}

export const render = () => renderToStaticMarkup(<Page />);
