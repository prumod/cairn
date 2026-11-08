export type LoteRowData = {
  id: string;
  title: string;
  categoria: string;
  entidade: string;
  valor: string;
  prazo: string | null; // "dd/mm/aaaa hh:mm", or null = «consta da plataforma»
  due: { label: string; tone: "normal" | "soon" | "past" } | null;
  selected: boolean;
};

export const LOTES: LoteRowData[] = [
  {
    id: "1",
    title: "Requalificação da Escola Básica de Marrazes",
    categoria: "Edifícios",
    entidade: "Município de Leiria",
    valor: "412 000 €",
    prazo: "28/10/2026 17:00",
    due: { label: "amanhã", tone: "soon" },
    selected: false,
  },
  {
    id: "2",
    title: "Pavimentação da EM 543 entre Batalha e Golpilheira",
    categoria: "Vias de comunicação",
    entidade: "Município da Batalha",
    valor: "1 280 500 €",
    prazo: "12/11/2026 23:59",
    due: { label: "em 16 dias", tone: "normal" },
    selected: true,
  },
  {
    id: "3",
    title: "Arranjo do largo da igreja de Pataias",
    categoria: "Espaços públicos",
    entidade: "Junta de Freguesia de Pataias",
    valor: "86 900 €",
    prazo: "20/10/2026 17:00",
    due: { label: "terminou", tone: "past" },
    selected: false,
  },
  {
    id: "4",
    title: "Reabilitação do mercado municipal",
    categoria: "Edifícios",
    entidade: "Município de Pombal",
    valor: "655 000 €",
    prazo: null,
    due: null,
    selected: false,
  },
];
