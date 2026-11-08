import type { LoteRowData } from "../data";

const dueTone = {
  normal: "text-muted",
  soon: "text-amber font-semibold",
  past: "text-muted italic",
};

export function LoteRow({ lote }: { lote: LoteRowData }) {
  return (
    <div
      role="option"
      aria-selected={lote.selected}
      className={`group relative grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-x-3.5 gap-y-1 border-b border-line py-2 pr-2.5 pl-[34px] ${
        lote.selected ? "bg-accent-soft shadow-[inset_3px_0_0_var(--accent)]" : "hover:bg-panel2"
      }`}
    >
      <span
        aria-hidden="true"
        className="invisible absolute top-2.5 left-[11px] grid size-[15px] place-items-center rounded bg-accent text-[11px] leading-none font-bold text-onaccent group-aria-selected:visible"
      >
        ✓
      </span>
      <div>
        <div className="font-semibold">{lote.title}</div>
        <div className="text-[11.5px] text-muted">
          {lote.categoria} · {lote.entidade}
        </div>
      </div>
      <div className="flex flex-col items-end gap-px text-xs whitespace-nowrap">
        <span className="text-[13px] font-semibold tabular-nums">{lote.valor}</span>
        <span className="text-[11.5px] text-muted">
          {lote.prazo ? <span className="font-mono">{lote.prazo}</span> : "consta da plataforma"}
          {lote.due && (
            <span
              className={`ml-2 inline-block min-w-[54px] text-right text-[11px] ${dueTone[lote.due.tone]}`}
            >
              {lote.due.label}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
