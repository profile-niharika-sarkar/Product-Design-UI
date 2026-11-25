import copy
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import score  # noqa: E402

RUBRIC = score.load_json(ROOT / "rubric" / "rubric.json")
BRADBURY = score.load_json(ROOT / "evals" / "cases" / "bradbury-2026-03" / "scoresheet.json")


def sheet_all(level):
    ev = [{"element": "h1", "quote": "Example headline"}]
    return {"site": {"name": "t"}, "criteria": {c["id"]: {"level": level, "evidence": ev} for c in RUBRIC["criteria"]}, "findings": []}


class RubricTest(unittest.TestCase):
    def test_weights_sum_to_100(self):
        self.assertEqual(sum(c["weight"] for c in RUBRIC["criteria"]), 100)
        for cat in RUBRIC["categories"]:
            self.assertEqual(sum(c["weight"] for c in RUBRIC["criteria"] if c["category"] == cat["id"]), cat["weight"])

    def test_every_criterion_has_pass_and_fail_sentence(self):
        for c in RUBRIC["criteria"]:
            self.assertTrue(c["pass"].endswith("."), c["id"])
            self.assertTrue(c["fail"].endswith("."), c["id"])

    def test_v1_history_sums_to_100(self):
        v1 = score.load_json(ROOT / "rubric" / "history" / "rubric-v1.json")
        self.assertEqual(sum(c["weight"] for c in v1["criteria"]), 100)


class ScoreTest(unittest.TestCase):
    def test_bounds(self):
        self.assertEqual(score.compute(sheet_all(4), RUBRIC)["overall"], 100)
        self.assertEqual(score.compute(sheet_all(0), RUBRIC)["overall"], 0)
        self.assertEqual(score.compute(sheet_all(2), RUBRIC)["overall"], 50)

    def test_na_redistributes_within_category(self):
        s = sheet_all(4)
        s["criteria"]["ux.navigation"] = {"na": "landing page"}
        res = score.compute(s, RUBRIC)
        self.assertEqual(res["overall"], 100)
        self.assertEqual(res["categories"]["ux"], 100)

    def test_bradbury_benchmark_score(self):
        res = score.compute(BRADBURY, RUBRIC)
        self.assertEqual(res["overall"], 48)
        self.assertEqual(res["categories"], {"ux": 43, "seo": 35, "content": 61, "trust": 60})
        self.assertEqual(res["band"], "Needs significant improvement")

    def test_round_half_up(self):
        self.assertEqual(score.rhu(47.5), 48)
        self.assertEqual(score.rhu(42.25), 42)


class EvidenceRuleTest(unittest.TestCase):
    def test_finding_without_evidence_is_rejected(self):
        s = copy.deepcopy(BRADBURY)
        s["findings"][0]["evidence"] = []
        errors, _ = score.validate(s, RUBRIC)
        self.assertTrue(any("no evidence" in e for e in errors))

    def test_vague_evidence_is_rejected(self):
        s = copy.deepcopy(BRADBURY)
        s["findings"][0]["evidence"] = [{"element": "the site"}]
        errors, _ = score.validate(s, RUBRIC)
        self.assertTrue(any("too vague" in e for e in errors))

    def test_criterion_without_evidence_is_rejected(self):
        s = copy.deepcopy(BRADBURY)
        s["criteria"]["seo.headings"]["evidence"] = [{"page": "/"}]
        errors, _ = score.validate(s, RUBRIC)
        self.assertTrue(any("seo.headings" in e for e in errors))

    def test_missing_criterion_is_rejected(self):
        s = copy.deepcopy(BRADBURY)
        del s["criteria"]["ux.primary_cta"]
        errors, _ = score.validate(s, RUBRIC)
        self.assertTrue(any("ux.primary_cta: missing" in e for e in errors))

    def test_low_score_without_finding_warns(self):
        s = copy.deepcopy(BRADBURY)
        s["findings"] = [f for f in s["findings"] if f["criterion"] != "seo.structured_data"]
        _, warnings = score.validate(s, RUBRIC)
        self.assertTrue(any("seo.structured_data" in w for w in warnings))


class ReportTest(unittest.TestCase):
    def test_report_sections_and_top5(self):
        res = score.compute(BRADBURY, RUBRIC)
        md = score.render_report(BRADBURY, RUBRIC, res)
        for heading in ("## Score: 48/100", "## Top 5 blockers", "## Fix plan by effort and impact", "## Quick wins", "## Full fix plan", "## Scorecard"):
            self.assertIn(heading, md)
        top = score.rank_findings(BRADBURY, res)[:3]
        self.assertEqual({f["severity"] for f in top}, {"critical"})

    def test_off_rubric_findings_excluded(self):
        res = score.compute(BRADBURY, RUBRIC)
        ids = [f["id"] for f in score.rank_findings(BRADBURY, res)]
        self.assertNotIn("F19", ids)


if __name__ == "__main__":
    unittest.main()
