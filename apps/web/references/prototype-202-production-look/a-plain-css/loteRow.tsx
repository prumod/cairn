import type { LoteRowData } from "../data";
import "./loteRow.css";

export function LoteRow({ lote }: { lote: LoteRowData }) {
  const rowClass = lote.selected ? "lote-row lote-row--selected" : "lote-row";

  return (
    <div className={rowClass} role="option" aria-selected={lote.selected}>
      <span className="lote-row__check" aria-hidden="true">
        ✓
      </span>
      <div>
        <div className="lote-row__title">{lote.title}</div>
        <div className="lote-row__sub">
          {lote.categoria} · {lote.entidade}
        </div>
      </div>
      <div className="lote-row__side">
        <span className="lote-row__valor">{lote.valor}</span>
        <span className="lote-row__prazo">
          {lote.prazo ? (
            <span className="lote-row__prazo-date">{lote.prazo}</span>
          ) : (
            "consta da plataforma"
          )}
          {lote.due && <span className={`due due--${lote.due.tone}`}>{lote.due.label}</span>}
        </span>
      </div>
    </div>
  );
}
