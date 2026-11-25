#!/usr/bin/env python3
"""Regression evals for the UX audit agent.

  run_evals.py                                  check the stored scoresheets
  run_evals.py --candidate m21-agency=new.json  check a fresh agent run against that case's expectations
  run_evals.py --rubric ../rubric/history/rubric-v1.json   re-run every case under another rubric version

Checks per case:
  1. the scoresheet passes validation (including "every finding cites its evidence")
  2. overall and category scores sit inside the stored ranges
  3. every must-find blocker is present (criterion + keyword), and inside the top N where one is set
  4. benchmark cases only: the overall score is within tolerance of the manual audit
Exits 1 if any check fails.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "tools"))
import score  # noqa: E402


def find_blocker(spec: dict, ranked: list[dict]) -> int | None:
    """1-based rank of the first finding that matches the spec, else None."""
    kws = [k.lower() for k in spec["keywords"]]
    for i, f in enumerate(ranked, 1):
        if f["criterion"] not in spec["criteria"]:
            continue
        hay = " ".join([f["title"], f.get("fix", ""), f.get("why", "")] +
                       [f"{e.get('element', '')} {e.get('quote', '')}" for e in f["evidence"]]).lower()
        if any(k in hay for k in kws):
            return i
    return None


def run_case(name: str, exp: dict, sheet_path: Path, rubric: dict) -> tuple[list[tuple[str, bool, str]], dict | None]:
    checks: list[tuple[str, bool, str]] = []
    sheet = score.load_json(sheet_path)
    errors, _ = score.validate(sheet, rubric)
    checks.append(("valid scoresheet + evidence rule", not errors, f"{len(errors)} error(s)" + (f": {errors[0]}" if errors else "")))
    if errors:
        return checks, None
    res = score.compute(sheet, rubric)

    lo, hi = exp["overall"]
    checks.append(("overall in range", lo <= res["overall"] <= hi, f"{res['overall']:.0f} in [{lo}, {hi}]"))
    for cat, (clo, chi) in exp.get("categories", {}).items():
        v = res["categories"][cat]
        checks.append((f"{cat} in range", clo <= v <= chi, f"{v:.0f} in [{clo}, {chi}]"))

    ranked = score.rank_findings(sheet, res)
    for spec in exp.get("must_find", []):
        pos = find_blocker(spec, ranked)
        limit = spec.get("in_top")
        ok = pos is not None and (limit is None or pos <= limit)
        where = "missing" if pos is None else f"rank {pos}" + (f" (needs top {limit})" if limit else "")
        checks.append((f"finds {spec['id']}", ok, where))

    bm = exp.get("benchmark")
    if bm:
        diff = res["overall"] - bm["overall"]
        checks.append(("benchmark overall", abs(diff) <= bm["tolerance"],
                       f"agent {res['overall']:.0f} vs manual {bm['overall']} (diff {diff:+.0f}, tolerance ±{bm['tolerance']})"))
        for cat, manual in bm.get("categories", {}).items():
            d = res["categories"][cat] - manual
            checks.append((f"benchmark {cat}", abs(d) <= bm["category_tolerance"],
                           f"agent {res['categories'][cat]:.0f} vs manual {manual} (diff {d:+.0f}, tolerance ±{bm['category_tolerance']})"))
    return checks, res


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--expected", default=str(HERE / "expected.json"))
    ap.add_argument("--rubric", default=str(score.DEFAULT_RUBRIC))
    ap.add_argument("--candidate", action="append", default=[], metavar="CASE=PATH")
    ap.add_argument("--case", action="append", default=[], help="run only these cases")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    a = ap.parse_args(argv)

    expected = score.load_json(a.expected)["cases"]
    rubric = score.load_json(a.rubric)
    overrides = dict(c.split("=", 1) for c in a.candidate)
    names = a.case or list(expected)

    failed = 0
    summary = {}
    for name in names:
        exp = expected[name]
        path = Path(overrides[name]) if name in overrides else HERE / exp["scoresheet"]
        checks, res = run_case(name, exp, path, rubric)
        bad = [c for c in checks if not c[1]]
        failed += bool(bad)
        summary[name] = {"passed": not bad, "overall": res and res["overall"], "checks": [{"check": c, "ok": ok, "detail": d} for c, ok, d in checks]}
        if not a.json:
            head = f"{'PASS' if not bad else 'FAIL'}  {name}  ({path.name}, rubric v{rubric['version']})"
            print(head)
            for c, ok, d in checks:
                print(f"   {'✓' if ok else '✗'} {c:<34} {d}")
            print()
    if a.json:
        print(json.dumps(summary, indent=2))
    else:
        print(f"{len(names) - failed}/{len(names)} cases passed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
