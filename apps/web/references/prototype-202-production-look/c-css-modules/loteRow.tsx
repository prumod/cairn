import type { LoteRowData } from "../data";
import styles from "./loteRow.module.css";

export function LoteRow({ lote }: { lote: LoteRowData }) {
  const rowClass = lote.selected ? `${styles.row} ${styles.selected}` : styles.row;

  return (
    <div className={rowClass} role="option" aria-selected={lote.selected}>
      <span className={styles.check} aria-hidden="true">
        ✓
      </span>
      <div>
        <div className={styles.title}>{lote.title}</div>
        <div className={styles.sub}>
          {lote.categoria} · {lote.entidade}
        </div>
      </div>
      <div className={styles.side}>
        <span className={styles.valor}>{lote.valor}</span>
        <span className={styles.prazo}>
          {lote.prazo ? <span className={styles.date}>{lote.prazo}</span> : "consta da plataforma"}
          {lote.due && (
            <span
              className={`${styles.due} ${lote.due.tone === "normal" ? "" : styles[lote.due.tone]}`}
            >
              {lote.due.label}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
