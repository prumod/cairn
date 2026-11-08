"""Parse DR Parte L empreitada anúncio texts into lote records and compare each alteração
with the anúncio version it alters.

Usage: python3 -I lote_compare.py <scratch_dir>
Reads  <scratch>/text/*.txt            (census anúncios and alterações, pdftotext -layout)
       <scratch>/text-originals/*.txt  (anúncios altered but outside the census window)
       <scratch>/work/alteracoes.tsv   (alteração_id, altered_id, date, anúncio number)
Writes <scratch>/work/docs.tsv, <scratch>/work/lote_entries.tsv, <scratch>/work/lote_pairs.tsv
and prints the counts used in the findings.
"""
import collections
import csv
import glob
import os
import re
import sys

SCR = sys.argv[1]
WORK = os.path.join(SCR, "work")
CENSUS_DIR = os.path.join(SCR, "text")
ORIG_DIR = os.path.join(SCR, "text-originals")

NOISE = re.compile(r"\s*Anúncio de procedimento n\.º\s*\d+/\d{4}\s*")
BARE = re.compile(r"^\d{1,3}$|^\d{9}$|^2\.ª série$|^N\.º \d+$|^\d{2}-\d{2}-\d{4}$")
SECTION = re.compile(r"^(\d{1,2}) - (.+)$")
LOT_LOCATION = ["País", "NUT III", "Distrito", "Concelho", "Freguesia", "Localidade"]


def read_lines(path):
    with open(path, encoding="utf-8") as f:
        return f.read().split("\n")


def clean(raw):
    line = NOISE.sub(" ", raw)
    return re.sub(r"\s+", " ", line).strip()


def content_lines(raw_lines):
    """Cleaned lines minus page footers. Footers are right-aligned (indent >= 10 in the layout
    text); a bare number at column 0 is lote text that wrapped, e.g. 'Lote' then '1'."""
    out = []
    for raw in raw_lines:
        line = clean(raw)
        if BARE.match(line) and len(raw) - len(raw.lstrip()) >= 10:
            continue
        out.append(line)
    return out


def discover_labels(all_docs):
    """Labels are the text before a colon at a line start, seen in at least 3 documents."""
    cnt = collections.Counter()
    for lines in all_docs:
        seen = set()
        for raw in lines:
            m = re.match(r"^\s*([^:]{1,70}?):(\s|$)", raw)
            if m:
                seen.add(m.group(1).strip())
        cnt.update(seen)
    return [k for k, v in cnt.items() if v >= 3]


def logical_fields(lines, labels, heads):
    alt = "|".join(re.escape(x) for x in sorted(labels, key=len, reverse=True))
    lab_re = re.compile(r"^(" + alt + r"):(?:\s+|$)(.*)$")
    fields = []
    section = None
    cur = None
    for raw in lines:
        line = raw
        if not line:
            continue
        if line in heads:
            m = SECTION.match(line)
            section = int(m.group(1))
            cur = None
            fields.append({"label": None, "value": line, "section": section, "head": True})
            continue
        m = lab_re.match(line)
        if m:
            cur = {"label": m.group(1), "value": m.group(2).strip(), "section": section, "head": False}
            fields.append(cur)
            continue
        if cur is not None:
            cur["value"] = (cur["value"] + " " + line).strip()
    return fields


def lot_entries(fields):
    """Entries of the 'Lotes:' list (section 5). Ends at the next heading."""
    ents = []
    in_list = False
    cur = None
    for f in fields:
        if f["head"]:
            if in_list:
                break
            continue
        if not in_list:
            if f["label"] == "Lotes":
                in_list = True
            continue
        lab, v = f["label"], f["value"]
        if lab == "Nº":
            cur = {"nid": v, "desc": None, "valor": None, "cpv": None}
            ents.append(cur)
        elif lab == "Descrição do Lote":
            if cur is None or cur["desc"] is not None:
                cur = {"nid": None, "desc": None, "valor": None, "cpv": None}
                ents.append(cur)
            cur["desc"] = v
        elif lab == "Preço base s/IVA":
            if cur is None:
                cur = {"nid": None, "desc": None, "valor": None, "cpv": None}
                ents.append(cur)
            if cur["valor"] is None:
                cur["valor"] = v
        elif lab == "Vocabulário Principal":
            if cur is None:
                cur = {"nid": None, "desc": None, "valor": None, "cpv": None}
                ents.append(cur)
            if cur["cpv"] is None:
                cur["cpv"] = v
    for e in ents:
        e["valor"] = trim_leak(e["valor"])
        e["cpv"] = trim_leak(e["cpv"])
        e["desc"] = trim_leak(e["desc"])
    return ents


def lot_blocks(fields):
    """Fields after 'Identificador do Lote:' keyed by (section, LOT id)."""
    blocks = collections.defaultdict(lambda: collections.defaultdict(list))
    ids = None
    for f in fields:
        if f["head"]:
            ids = None
            continue
        if f["label"] == "Identificador do Lote":
            ids = re.findall(r"LOT-\d+", f["value"])
            continue
        if ids and f["label"]:
            for i in ids:
                blocks[(f["section"], i)][f["label"]].append(f["value"])
    return blocks


def flag_from(raw_text):
    """'Procedimento com lotes? Sim' has no colon, so it is read from the joined text."""
    m = re.search(r"Procedimento com lotes\? (Sim|Não)", re.sub(r"\s+", " ", raw_text))
    return m.group(1) if m else None


def trim_leak(v):
    """Layout text puts the next label on the same line; cut the value there."""
    if v is None:
        return None
    return re.split(r" Classificação CPV| Procedimento com lotes\?", v)[0].strip()


def norm_cpv(s):
    m = re.match(r"\s*(\d{8})", s or "")
    return m.group(1) if m else None


def norm_place(s):
    """Set of location tokens: the layout repeats one lote's locations in a different order
    across versions, and some codes carry a name suffix (PT185 - Lezíria do Tejo)."""
    if not s:
        return None
    return " / ".join(sorted(part.split(" - ")[0].strip() for part in s.split(" / ")))


def norm(s):
    if s is None:
        return None
    return re.sub(r"\s+", " ", s).strip(" .;").upper()


def field_value(fields, label):
    for f in fields:
        if f["label"] == label:
            return f["value"]
    return None


def all_lot_ids(fields):
    ids = []
    for f in fields:
        if f["label"] == "Identificador do Lote":
            ids += re.findall(r"LOT-\d+", f["value"])
    return sorted(set(ids))


def analyse(path, labels, heads):
    lines = content_lines(read_lines(path))
    fields = logical_fields(lines, labels, heads)
    raw_text = "\n".join(read_lines(path))
    n_nid_lines = sum(1 for l in lines if re.match(r"^Nº: LOT-\d+$", l))
    ents = lot_entries(fields)
    blocks = lot_blocks(fields)
    for e in ents:
        e["place"] = None
        e["prazo"] = None
        if e["nid"]:
            b9 = blocks.get((9, e["nid"]), {})
            parts = []
            for lab in LOT_LOCATION:
                parts += b9.get(lab, [])
            e["place"] = " / ".join(parts) if parts else None
            b10 = blocks.get((10, e["nid"]), {})
            pz = b10.get("Prazo de execução do contrato", [])
            e["prazo"] = " / ".join(pz) if pz else None
    m_alt = re.search(
        r"Alteração do Anúncio de procedimento n\.º (\d+/\d{4}), de (\d{4}-\d{2}-\d{2}), com o ID (\d+)",
        raw_text,
    )
    doc = {
        "id": os.path.basename(path)[:-4],
        "flag": flag_from(raw_text),
        "ents": ents,
        "ids_blocks": all_lot_ids(fields),
        "is_alt": m_alt is not None,
        "n_nid_lines": n_nid_lines,
        "alt_of_number": m_alt.group(1) if m_alt else None,
        "alt_of_date": m_alt.group(2) if m_alt else None,
        "alt_of_id": m_alt.group(3) if m_alt else None,
        "motivo": field_value(fields, "Motivo da Alteração"),
        "secoes": field_value(fields, "Identificador das Secções Alteradas do Anúncio Anterior"),
        "versao": field_value(fields, "Identificador da Versão do Anúncio a Alterar"),
        "descricao": field_value(fields, "Descrição das Alterações"),
        "docs_changed": field_value(fields, "Alteração dos Documentos do Concurso"),
        "blocks": blocks,
        "fields": fields,
    }
    return doc



def compare(O, A):
    """Compare an altered anúncio (O) with its alteração (A), a full restated version."""
    r = {}
    oe, ae = O["ents"], A["ents"]
    r["n_O"], r["n_A"] = len(oe), len(ae)
    r["count_changed"] = int(len(oe) != len(ae))
    r["nids_O"] = "|".join(e["nid"] or "-" for e in oe)
    r["nids_A"] = "|".join(e["nid"] or "-" for e in ae)
    r["nid_set_changed"] = int(sorted(x["nid"] or "-" for x in oe) != sorted(x["nid"] or "-" for x in ae))
    # match by number (what a LOT id match would do)
    num_O = {e["nid"]: e for e in oe if e["nid"]}
    num_A = {e["nid"]: e for e in ae if e["nid"]}
    common = sorted(set(num_O) & set(num_A))
    r["num_common"] = len(common)
    r["num_desc_differs"] = sum(1 for n in common if norm(num_O[n]["desc"]) != norm(num_A[n]["desc"]))
    r["num_valor_differs"] = sum(1 for n in common if norm(num_O[n]["valor"]) != norm(num_A[n]["valor"]))
    r["num_cpv_differs"] = sum(1 for n in common if norm_cpv(num_O[n]["cpv"]) != norm_cpv(num_A[n]["cpv"]))
    r["num_place_differs"] = sum(1 for n in common if norm_place(num_O[n]["place"]) != norm_place(num_A[n]["place"]))
    r["num_prazo_differs"] = sum(1 for n in common if norm(num_O[n]["prazo"]) != norm(num_A[n]["prazo"]))
    # match by normalised description (what an identity by title would do)
    key_O = collections.defaultdict(list)
    key_A = collections.defaultdict(list)
    for e in oe:
        key_O[norm(e["desc"])].append(e)
    for e in ae:
        key_A[norm(e["desc"])].append(e)
    r["dup_desc_O"] = sum(1 for k, v in key_O.items() if k and len(v) > 1)
    r["dup_desc_A"] = sum(1 for k, v in key_A.items() if k and len(v) > 1)
    kc = sorted(k for k in set(key_O) & set(key_A) if k)
    r["desc_matched"] = len(kc)
    r["desc_renumbered"] = sum(
        1 for k in kc if key_O[k][0]["nid"] != key_A[k][0]["nid"]
    )
    r["desc_valor_differs"] = sum(1 for k in kc if norm(key_O[k][0]["valor"]) != norm(key_A[k][0]["valor"]))
    r["desc_cpv_differs"] = sum(1 for k in kc if norm_cpv(key_O[k][0]["cpv"]) != norm_cpv(key_A[k][0]["cpv"]))
    r["desc_place_differs"] = sum(1 for k in kc if norm_place(key_O[k][0]["place"]) != norm_place(key_A[k][0]["place"]))
    r["desc_prazo_differs"] = sum(1 for k in kc if norm(key_O[k][0]["prazo"]) != norm(key_A[k][0]["prazo"]))
    r["desc_dropped"] = sum(1 for k in set(key_O) - set(key_A) if k)
    r["desc_added"] = sum(1 for k in set(key_A) - set(key_O) if k)
    r["nodesc_O"] = sum(1 for e in oe if not e["desc"])
    r["nodesc_A"] = sum(1 for e in ae if not e["desc"])
    r["nonid_O"] = sum(1 for e in oe if not e["nid"])
    r["nonid_A"] = sum(1 for e in ae if not e["nid"])
    # lote identity changed in any way a human reader would notice
    r["any_lote_change"] = int(
        bool(r["count_changed"] or r["num_desc_differs"] or r["desc_renumbered"] or r["desc_dropped"]
             or r["desc_added"] or r["desc_valor_differs"] or r["desc_cpv_differs"]
             or r["desc_place_differs"] or r["desc_prazo_differs"] or r["num_valor_differs"]
             or r["num_cpv_differs"] or r["num_place_differs"] or r["num_prazo_differs"])
    )
    return r


def short(s, n=160):
    if s is None:
        return ""
    s = re.sub(r"\s+", " ", s)
    return s if len(s) <= n else s[: n - 1] + "…"


def main():
    labels_src = []
    doc_paths = sorted(glob.glob(os.path.join(CENSUS_DIR, "*.txt")))
    orig_paths = sorted(glob.glob(os.path.join(ORIG_DIR, "*.txt")))
    for p in doc_paths + orig_paths:
        labels_src.append(read_lines(p))
    labels = discover_labels(labels_src)
    head_counts = collections.Counter()
    for lines in labels_src:
        head_counts.update(set(clean(x) for x in lines if SECTION.match(clean(x))))
    heads = {k for k, v in head_counts.items() if v >= 20 and SECTION.match(k)}
    print("section headings:", len(heads))

    docs = {}
    for p in doc_paths:
        d = analyse(p, labels, heads)
        d["source"] = "census"
        docs[d["id"]] = d
    for p in orig_paths:
        d = analyse(p, labels, heads)
        d["source"] = "original-outside-census"
        docs[d["id"]] = d

    # docs.tsv: one row per document
    with open(os.path.join(WORK, "docs.tsv"), "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter="\t", lineterminator="\n")
        w.writerow(["id", "source", "is_alteracao", "lotes_flag", "n_lote_entries", "nids",
                    "n_entries_without_nid", "n_entries_without_desc", "block_ids", "alt_of_id"])
        for k in sorted(docs):
            d = docs[k]
            w.writerow([k, d["source"], int(d["is_alt"]), d["flag"], len(d["ents"]),
                        "|".join(e["nid"] or "-" for e in d["ents"]),
                        sum(1 for e in d["ents"] if not e["nid"]),
                        sum(1 for e in d["ents"] if not e["desc"]),
                        "|".join(d["ids_blocks"]), d["alt_of_id"] or ""])

    with open(os.path.join(WORK, "lote_entries.tsv"), "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter="\t", lineterminator="\n")
        w.writerow(["doc", "is_alteracao", "idx", "nid", "desc", "valor", "cpv", "place", "prazo"])
        for k in sorted(docs):
            d = docs[k]
            for i, e in enumerate(d["ents"], 1):
                w.writerow([k, int(d["is_alt"]), i, e["nid"] or "", e["desc"] or "",
                            e["valor"] or "", e["cpv"] or "", e["place"] or "", e["prazo"] or ""])

    # pairs: each alteração against the anúncio id it names
    pairs_rows = []
    tsv_window = read_rows(os.path.join(WORK, "alteracoes.tsv"))
    tsv_chain = read_rows(os.path.join(WORK, "alteracoes_chain.tsv"))
    window_ids = {r[0] for r in tsv_window}
    tsv = tsv_window + tsv_chain
    header_mismatch = []
    for alt_id, altered_id, date, number in tsv:
        A = docs.get(alt_id)
        O = docs.get(altered_id)
        if A is None or O is None:
            print("MISSING", alt_id, altered_id, A is not None, O is not None)
            continue
        if A["alt_of_id"] != altered_id:
            header_mismatch.append((alt_id, altered_id, A["alt_of_id"]))
        r = compare(O, A)
        row = {
            "alt_id": alt_id,
            "frame": "window" if alt_id in window_ids else "chain",
            "orig_id": altered_id,
            "orig_source": O["source"],
            "date_alt_names": A["alt_of_date"],
            "number_alt_names": A["alt_of_number"],
            "flag_O": O["flag"],
            "flag_A": A["flag"],
            **r,
            "motivo": A["motivo"] or "",
            "secoes": A["secoes"] or "",
            "docs_changed": A["docs_changed"] or "",
            "descricao": re.sub(r"\s+", " ", A["descricao"] or "").strip(),
        }
        pairs_rows.append(row)

    cols = list(pairs_rows[0].keys())
    with open(os.path.join(WORK, "lote_pairs.tsv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols, delimiter="\t", lineterminator="\n")
        w.writeheader()
        w.writerows(pairs_rows)

    bad = [(k, len(d["ents"]), d["n_nid_lines"], d["ids_blocks"]) for k, d in docs.items()
           if d["flag"] == "Sim" and (len(d["ents"]) != d["n_nid_lines"] or
                                       sorted(e["nid"] or "-" for e in d["ents"]) != sorted(d["ids_blocks"]))]
    print("lote-list validation mismatches (entries vs 'Nº: LOT' lines vs block ids):", len(bad))
    for b in bad[:12]:
        print("   ", b[0], "entries", b[1], "Nº lines", b[2], "block ids", b[3][:6])
    print("documents parsed:", len(docs), "census:", sum(1 for d in docs.values() if d["source"] == "census"),
          "originals:", sum(1 for d in docs.values() if d["source"] != "census"))
    print("alterações:", sum(1 for d in docs.values() if d["is_alt"]),
          "header-vs-tsv mismatches:", header_mismatch)
    print("pairs:", len(pairs_rows))
    tot = lambda k: sum(r[k] for r in pairs_rows)
    cnt = lambda k: sum(1 for r in pairs_rows if r[k])
    print("flag O/A (Sim):", sum(1 for r in pairs_rows if r["flag_O"] == "Sim"),
          sum(1 for r in pairs_rows if r["flag_A"] == "Sim"))
    print("pairs with lotes on either side:", sum(1 for r in pairs_rows if r["flag_O"] == "Sim" or r["flag_A"] == "Sim"))
    print("count_changed:", cnt("count_changed"), " nid_set_changed:", cnt("nid_set_changed"))
    print("num_common total:", tot("num_common"), " num_desc_differs:", tot("num_desc_differs"),
          " pairs with any:", sum(1 for r in pairs_rows if r["num_desc_differs"]))
    print("num_valor_differs:", tot("num_valor_differs"), " num_cpv_differs:", tot("num_cpv_differs"),
          " num_place_differs:", tot("num_place_differs"), " num_prazo_differs:", tot("num_prazo_differs"))
    print("desc_matched:", tot("desc_matched"), " desc_renumbered:", tot("desc_renumbered"),
          " pairs renumbered:", cnt("desc_renumbered"))
    print("desc_dropped:", tot("desc_dropped"), " desc_added:", tot("desc_added"))
    print("desc valor/cpv/place/prazo differs:", tot("desc_valor_differs"), tot("desc_cpv_differs"),
          tot("desc_place_differs"), tot("desc_prazo_differs"))
    print("pairs with any lote change:", cnt("any_lote_change"))
    print("nonid entries O/A:", tot("nonid_O"), tot("nonid_A"), " nodesc O/A:", tot("nodesc_O"), tot("nodesc_A"))
    print("dup desc O/A:", tot("dup_desc_O"), tot("dup_desc_A"))
    print("secoes counts:")
    for k, v in collections.Counter(r["secoes"] for r in pairs_rows).most_common():
        print("   ", v, short(k, 120))
    print("motivo counts:")
    for k, v in collections.Counter(r["motivo"] for r in pairs_rows).most_common():
        print("   ", v, short(k, 120))


def read_rows(path):
    with open(path, encoding="utf-8") as f:
        rows = [line.rstrip("\n").split("\t") for line in f if line.strip()]
    return [r for r in rows if len(r) >= 3 and r[0].isdigit()]


if __name__ == "__main__":
    main()
