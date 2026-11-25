#!/usr/bin/env python3
"""Score a UX audit scoresheet against the rubric and render the report.

Usage:
  score.py validate SCORESHEET [--rubric RUBRIC]
  score.py score    SCORESHEET [--rubric RUBRIC]            # prints JSON scores
  score.py report   SCORESHEET [-o report.md] [--csv fix-plan.csv] [--rubric RUBRIC]
  score.py rubric-md [--rubric RUBRIC] [-o RUBRIC.md]

Standard library only. The model does the judging (levels 0-4 with
evidence); this script does the arithmetic, the evidence rule and the layout,
so two runs over the same judgments always give the same report.
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_RUBRIC = ROOT / "rubric" / "rubric.json"

SEVERITIES = ["critical", "high", "medium", "low"]
IMPACTS = ["high", "medium", "low"]
EFFORTS = {"S": "Small (2 hours or less)", "M": "Medium (2 days or less)", "L": "Large (more than 2 days)"}
CONFIDENCE = ["high", "medium", "low"]
BANDS = [
    (85, "Excellent"),
    (70, "Good"),
    (55, "Needs improvement"),
    (40, "Needs significant improvement"),
    (0, "Critical"),
]
# Evidence that only says something like this is not evidence.
VAGUE = {"the site", "the page", "website", "homepage", "general", "overall", "n/a", "none", "various", "throughout"}


def rhu(x: float, places: int = 0) -> float:
    q = Decimal(1).scaleb(-places)
    return float(Decimal(str(x)).quantize(q, rounding=ROUND_HALF_UP))


def band(score: float) -> str:
    for floor, label in BANDS:
        if score >= floor:
            return label
    return BANDS[-1][1]


def load_json(path: str | Path) -> dict:
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


# --------------------------------------------------------------------------- validation

def evidence_problems(ev, where: str) -> list[str]:
    """Every finding must cite the page element or text it came from."""
    errs = []
    if not isinstance(ev, list) or not ev:
        return [f"{where}: no evidence; cite the page element or text it came from"]
    for i, item in enumerate(ev):
        if not isinstance(item, dict):
            errs.append(f"{where}: evidence[{i}] must be an object with 'element' and/or 'quote'")
            continue
        element = str(item.get("element", "")).strip()
        quote = str(item.get("quote", "")).strip()
        if not element and not quote:
            errs.append(f"{where}: evidence[{i}] needs an 'element' (selector, tag, URL, filename) or a verbatim 'quote'")
            continue
        text = (element + " " + quote).strip().lower()
        if len(text) < 4 or text in VAGUE:
            errs.append(f"{where}: evidence[{i}] is too vague ({text!r}); name the element or quote the text")
    return errs


def validate(sheet: dict, rubric: dict) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    crit_by_id = {c["id"]: c for c in rubric["criteria"]}
    scored = sheet.get("criteria", {})

    if not sheet.get("site", {}).get("url") and not sheet.get("site", {}).get("name"):
        errors.append("site: needs at least a url or a name")

    for cid in crit_by_id:
        if cid not in scored:
            errors.append(f"criteria.{cid}: missing; every rubric criterion must be scored or marked na")
    for cid, entry in scored.items():
        if cid not in crit_by_id:
            warnings.append(f"criteria.{cid}: not in rubric v{rubric.get('version')}; ignored")
            continue
        if "na" in entry:
            if not str(entry["na"]).strip():
                errors.append(f"criteria.{cid}: 'na' needs a reason")
            continue
        level = entry.get("level")
        if not isinstance(level, int) or isinstance(level, bool) or not 0 <= level <= 4:
            errors.append(f"criteria.{cid}: level must be an integer 0-4 (got {level!r})")
        conf = entry.get("confidence", "high")
        if conf not in CONFIDENCE:
            errors.append(f"criteria.{cid}: confidence must be one of {CONFIDENCE}")
        errors += evidence_problems(entry.get("evidence"), f"criteria.{cid}")

    finding_crits = set()
    seen_ids = set()
    for i, f in enumerate(sheet.get("findings", [])):
        where = f"findings[{i}]({f.get('id', '?')})"
        if f.get("id") in seen_ids:
            errors.append(f"{where}: duplicate id")
        seen_ids.add(f.get("id"))
        cid = f.get("criterion")
        if cid not in crit_by_id:
            if cid in scored:
                warnings.append(f"{where}: criterion {cid!r} not in this rubric version; finding kept unscored")
            else:
                errors.append(f"{where}: unknown criterion {cid!r}")
        finding_crits.add(cid)
        for key, allowed in (("severity", SEVERITIES), ("impact", IMPACTS), ("effort", list(EFFORTS))):
            if f.get(key) not in allowed:
                errors.append(f"{where}: {key} must be one of {allowed} (got {f.get(key)!r})")
        for key in ("title", "fix", "owner"):
            if not str(f.get(key, "")).strip():
                errors.append(f"{where}: '{key}' is required")
        errors += evidence_problems(f.get("evidence"), where)
        entry = scored.get(cid, {})
        if f.get("severity") == "critical" and isinstance(entry.get("level"), int) and entry["level"] >= 3:
            warnings.append(f"{where}: critical finding on a criterion scored {entry['level']}/4; check the level")

    for cid, entry in scored.items():
        if cid in crit_by_id and isinstance(entry.get("level"), int) and entry["level"] <= 1 and cid not in finding_crits:
            warnings.append(f"criteria.{cid}: scored {entry['level']}/4 but has no finding; add one so it reaches the fix plan")

    for i, s in enumerate(sheet.get("strengths", [])):
        errors += evidence_problems(s.get("evidence"), f"strengths[{i}]")

    return errors, warnings


# --------------------------------------------------------------------------- scoring

def compute(sheet: dict, rubric: dict) -> dict:
    scored = sheet["criteria"]
    cats = {c["id"]: {**c, "earned": 0.0, "available": 0.0, "criteria": []} for c in rubric["categories"]}
    for c in rubric["criteria"]:
        entry = scored.get(c["id"], {})
        row = {"id": c["id"], "name": c["name"], "weight": c["weight"], "category": c["category"]}
        if "na" in entry:
            row.update(level=None, na=entry["na"], points=None, lost=0.0)
        else:
            lvl = entry["level"]
            row.update(level=lvl, points=c["weight"] * lvl / 4, confidence=entry.get("confidence", "high"))
        cats[c["category"]]["criteria"].append(row)

    overall = 0.0
    for cat in cats.values():
        live = [r for r in cat["criteria"] if r["level"] is not None]
        live_weight = sum(r["weight"] for r in live)
        scale = cat["weight"] / live_weight if live_weight else 0
        for r in live:
            # N/A rule: redistribute the category weight pro rata across live criteria.
            r["effective_weight"] = r["weight"] * scale
            r["points"] = r["effective_weight"] * r["level"] / 4
            r["lost"] = r["effective_weight"] - r["points"]
        cat["earned"] = sum(r["points"] for r in live)
        cat["score"] = 100 * cat["earned"] / cat["weight"] if cat["weight"] else 0
        overall += cat["earned"]

    overall_r = rhu(overall)
    lost_by_crit = {r["id"]: r["lost"] for cat in cats.values() for r in cat["criteria"]}
    return {
        "rubric_version": rubric.get("version"),
        "overall": overall_r,
        "overall_exact": round(overall, 2),
        "band": band(overall_r),
        "categories": {k: rhu(v["score"]) for k, v in cats.items()},
        "category_detail": cats,
        "lost_by_criterion": lost_by_crit,
    }


def rank_findings(sheet: dict, result: dict) -> list[dict]:
    lost = result["lost_by_criterion"]
    sev = {s: i for i, s in enumerate(SEVERITIES)}
    imp = {s: i for i, s in enumerate(IMPACTS)}
    eff = {"S": 0, "M": 1, "L": 2}
    # Findings tied to a criterion outside this rubric version are not scored or reported.
    return sorted(
        [f for f in sheet.get("findings", []) if f.get("criterion") in lost],
        # severity, then business impact, then rubric points at stake, then cheapest first
        key=lambda f: (sev.get(f["severity"], 9), imp.get(f["impact"], 9), -lost.get(f["criterion"], 0), eff.get(f["effort"], 9)),
    )


def quadrant(f: dict) -> str:
    high_impact = f["impact"] in ("high", "medium")
    if f["effort"] == "S" and high_impact:
        return "Quick wins"
    if f["impact"] == "high":
        return "Major projects"
    if f["effort"] == "S":
        return "Fill-ins"
    return "Later / reconsider"


# --------------------------------------------------------------------------- rendering

def fmt_ev(ev: list[dict], limit: int = 2) -> str:
    parts = []
    for item in ev[:limit]:
        el = str(item.get("element", "")).strip()
        q = str(item.get("quote", "")).strip()
        page = str(item.get("page", "")).strip()
        s = ""
        if el:
            s += f"`{el}`"
        if q:
            s += (" " if s else "") + f"\"{q}\""
        if page and page not in ("/",):
            s += f" ({page})"
        parts.append(s)
    more = f" +{len(ev) - limit} more" if len(ev) > limit else ""
    return "; ".join(parts) + more


def md_cell(s: str) -> str:
    return str(s).replace("|", "\\|").replace("\n", " ")


def bar(score: float, width: int = 20) -> str:
    filled = int(rhu(score / 100 * width))
    return "█" * filled + "░" * (width - filled)


def render_report(sheet: dict, rubric: dict, result: dict) -> str:
    site = sheet.get("site", {})
    ranked = rank_findings(sheet, result)
    crit_by_id = {c["id"]: c for c in rubric["criteria"]}
    cat_names = {c["id"]: c["name"] for c in rubric["categories"]}
    out = []
    w = out.append

    w(f"# UX audit: {site.get('name') or site.get('url')}")
    w("")
    meta = [f"**URL:** {site.get('url', 'n/a')}", f"**Audited:** {site.get('audited_at', 'n/a')}",
            f"**Input:** {site.get('input_mode', 'n/a')}", f"**Rubric:** v{result['rubric_version']}"]
    w(" · ".join(meta))
    if site.get("pages_reviewed"):
        w("")
        w("**Pages reviewed:** " + ", ".join(site["pages_reviewed"]))
    w("")
    w(f"## Score: {int(result['overall'])}/100 ({result['band']})")
    w("")
    if sheet.get("summary"):
        w(sheet["summary"])
        w("")
    w("| Category | Weight | Score | |")
    w("|---|---:|---:|---|")
    for cid, cat in result["category_detail"].items():
        sc = result["categories"][cid]
        w(f"| {cat['name']} | {cat['weight']} | {int(sc)}/100 | `{bar(sc)}` |")
    w("")

    w("## Top 5 blockers")
    w("")
    if not ranked:
        w("_No findings recorded._")
    for i, f in enumerate(ranked[:5], 1):
        lost = result["lost_by_criterion"].get(f["criterion"], 0)
        w(f"**{i}. {f['title']}** · {f['severity'].upper()} · costs {rhu(lost, 1)} pts on *{crit_by_id.get(f['criterion'], {}).get('name', f['criterion'])}*")
        w("")
        w(f"- Evidence: {fmt_ev(f['evidence'], 3)}")
        if f.get("why"):
            w(f"- Why it matters: {f['why']}")
        w(f"- Fix: {f['fix']} (effort {f['effort']}, owner {f['owner']})")
        w("")

    w("## Fix plan by effort and impact")
    w("")
    w("Effort: S = 2 hours or less, M = 2 days or less, L = more than 2 days.")
    w("")
    groups: dict[str, list] = {}
    for f in ranked:
        groups.setdefault(quadrant(f), []).append(f)
    w("| | Low effort (S) | Higher effort (M/L) |")
    w("|---|---|---|")
    def names(q):
        return "<br>".join(f"{f['id']} {md_cell(f['title'])}" for f in groups.get(q, [])) or "—"
    w(f"| **Higher impact** | **Quick wins**<br>{names('Quick wins')} | **Major projects**<br>{names('Major projects')} |")
    w(f"| **Lower impact** | **Fill-ins**<br>{names('Fill-ins')} | **Later / reconsider**<br>{names('Later / reconsider')} |")
    w("")

    w("## Quick wins")
    w("")
    qw = groups.get("Quick wins", [])
    if not qw:
        w("_None: every high-impact fix needs more than 2 hours._")
    for f in qw:
        w(f"- [ ] **{f['title']}**: {f['fix']} ({f['owner']})")
    w("")

    w("## Full fix plan")
    w("")
    w("| ID | Issue | Evidence | Severity | Effort | Impact | Recommended fix | Owner |")
    w("|---|---|---|---|---|---|---|---|")
    for f in ranked:
        w(f"| {f['id']} | {md_cell(f['title'])} | {md_cell(fmt_ev(f['evidence']))} | {f['severity']} | {f['effort']} | {f['impact']} | {md_cell(f['fix'])} | {f['owner']} |")
    w("")

    w("## Scorecard")
    w("")
    for cid, cat in result["category_detail"].items():
        w(f"### {cat['name']}: {int(result['categories'][cid])}/100")
        w("")
        w("| Criterion | Weight | Level | Points | Evidence |")
        w("|---|---:|---:|---:|---|")
        for r in cat["criteria"]:
            entry = sheet["criteria"].get(r["id"], {})
            if r["level"] is None:
                w(f"| {r['name']} | {r['weight']} | n/a | — | {md_cell(entry.get('na', ''))} |")
                continue
            conf = "" if r.get("confidence", "high") == "high" else f" ({r['confidence']} confidence)"
            w(f"| {r['name']} | {r['weight']} | {r['level']}/4{conf} | {rhu(r['points'], 1)} | {md_cell(fmt_ev(entry.get('evidence', []), 2))} |")
        w("")

    if sheet.get("strengths"):
        w("## Strengths to keep")
        w("")
        for s in sheet["strengths"]:
            w(f"- **{s['title']}**: {fmt_ev(s['evidence'], 2)}")
        w("")

    low = [(cid, e) for cid, e in sheet["criteria"].items() if e.get("confidence") == "low" and cid in crit_by_id]
    if low or sheet.get("limitations"):
        w("## Limitations")
        w("")
        for lim in sheet.get("limitations", []):
            w(f"- {lim}")
        for cid, e in low:
            w(f"- *{crit_by_id[cid]['name']}* scored with low confidence: {e.get('rationale', 'evidence incomplete')}")
        w("")

    w("---")
    w(f"Generated by ux-audit-agent with rubric v{result['rubric_version']}. Scores are a weighted sum of 26 criteria "
      "(levels 0-4); every finding cites the element or text it came from.")
    return "\n".join(out) + "\n"


def write_csv(sheet: dict, result: dict, path: str) -> None:
    ranked = rank_findings(sheet, result)
    with open(path, "w", newline="", encoding="utf-8") as fh:
        wr = csv.writer(fh)
        wr.writerow(["id", "issue", "evidence", "page", "criterion", "severity", "effort", "impact", "quadrant", "recommended_fix", "owner"])
        for f in ranked:
            pages = ", ".join(sorted({e.get("page", "") for e in f["evidence"] if e.get("page")}))
            wr.writerow([f["id"], f["title"], fmt_ev(f["evidence"], 5), pages, f["criterion"], f["severity"],
                         f["effort"], f["impact"], quadrant(f), f["fix"], f["owner"]])


def render_rubric_md(rubric: dict) -> str:
    out = [f"# {rubric['name']} v{rubric['version']}", ""]
    if rubric.get("calibrated_against"):
        out += [f"Calibrated against: {rubric['calibrated_against']}.", ""]
    out += ["Four categories, 26 criteria. The criterion weights sum to 100, so the overall score is the sum of points earned.", "",
            "**Scoring each criterion (levels 0-4):**", ""]
    for k, v in rubric["scale"]["levels"].items():
        out.append(f"- **{k}**: {v}")
    out += ["", f"Points = {rubric['scale']['points_formula'].split('=')[1].strip()}. {rubric['scale']['na_rule']}", "",
            "**Score bands:** " + ", ".join(f"{f}+ {l}" for f, l in BANDS[:-1]) + f", below {BANDS[-2][0]} {BANDS[-1][1]}", ""]
    out += ["| Category | Weight |", "|---|---:|"]
    for c in rubric["categories"]:
        out.append(f"| {c['name']} | {c['weight']} |")
    out.append("")
    for cat in rubric["categories"]:
        out += [f"## {cat['name']} ({cat['weight']} pts)", "", "| ID | Criterion | Wt | Pass looks like | Fail looks like | Blocker class |", "|---|---|---:|---|---|---|"]
        for c in rubric["criteria"]:
            if c["category"] == cat["id"]:
                out.append(f"| `{c['id']}` | {c['name']} | {c['weight']} | {md_cell(c['pass'])} | {md_cell(c['fail'])} | {c['blocker_class']} |")
        out.append("")
    return "\n".join(out)


# --------------------------------------------------------------------------- CLI

def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=["validate", "score", "report", "rubric-md"])
    ap.add_argument("scoresheet", nargs="?")
    ap.add_argument("--rubric", default=str(DEFAULT_RUBRIC))
    ap.add_argument("-o", "--out")
    ap.add_argument("--csv")
    ap.add_argument("--strict", action="store_true", help="treat warnings as errors")
    a = ap.parse_args(argv)
    rubric = load_json(a.rubric)

    if a.command == "rubric-md":
        text = render_rubric_md(rubric)
        if a.out:
            Path(a.out).write_text(text, encoding="utf-8")
        else:
            print(text)
        return 0

    if not a.scoresheet:
        ap.error("scoresheet is required")
    sheet = load_json(a.scoresheet)
    errors, warnings = validate(sheet, rubric)
    for wmsg in warnings:
        print(f"warning: {wmsg}", file=sys.stderr)
    for e in errors:
        print(f"error: {e}", file=sys.stderr)
    if errors or (a.strict and warnings):
        print(f"{len(errors)} error(s), {len(warnings)} warning(s): scoresheet rejected", file=sys.stderr)
        return 1
    if a.command == "validate":
        print(f"ok: {len(sheet.get('findings', []))} findings, {len(warnings)} warning(s)")
        return 0

    result = compute(sheet, rubric)
    if a.command == "score":
        print(json.dumps({k: result[k] for k in ("rubric_version", "overall", "overall_exact", "band", "categories")}, indent=2))
        return 0

    report = render_report(sheet, rubric, result)
    if a.out:
        Path(a.out).write_text(report, encoding="utf-8")
        print(f"wrote {a.out} ({int(result['overall'])}/100, {result['band']})")
    else:
        print(report)
    if a.csv:
        write_csv(sheet, result, a.csv)
        print(f"wrote {a.csv}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
