import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import collect  # noqa: E402

HTML = (ROOT / "tests" / "fixtures" / "sample.html").read_text(encoding="utf-8")


class CollectTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ev = collect.analyse(HTML, "https://acme.test/")

    def test_meta(self):
        self.assertEqual(self.ev["title"]["text"], "Acme Consulting")
        self.assertEqual(self.ev["meta_description"]["length"], 0)
        self.assertEqual(self.ev["lang"], "en")
        self.assertIn("bolt.new", self.ev["og"]["og:image"])
        self.assertEqual(self.ev["jsonld_types"], ["Organization"])

    def test_duplicate_h1_and_word_spacing(self):
        self.assertEqual(self.ev["headings"]["counts"]["h1"], 2)
        self.assertEqual(self.ev["headings"]["h1"][0], "Grow Faster")
        self.assertIn("grow faster", self.ev["headings"]["duplicates"])

    def test_ctas_and_link_kinds(self):
        ctas = {c["text"]: c["kind"] for c in self.ev["ctas"]}
        self.assertEqual(ctas["Discover Your Readiness"], "external")
        self.assertEqual(ctas["Let's Go!"], "anchor")
        nav = {n["text"]: n["kind"] for n in self.ev["nav"]}
        self.assertEqual(nav, {"About": "anchor", "Services": "internal"})

    def test_image_alt_classification(self):
        self.assertEqual(self.ev["images"]["counts"], {"filename": 1, "stock-like": 1, "missing": 1, "ok": 1})

    def test_stats_source_detection(self):
        stats = {s["value"]: s["source_nearby"] for s in self.ev["stats"]}
        self.assertIn("92%", stats)
        self.assertTrue(stats["40%"])

    def test_trust_and_maintenance_signals(self):
        self.assertTrue(self.ev["copyright"]["outdated"])
        self.assertEqual(self.ev["social_links"], ["LinkedIn"])
        self.assertEqual(self.ev["legal_links"], ["Privacy policy"])
        self.assertEqual(self.ev["contact"]["mailto"], ["hi@acme.test"])
        self.assertIn("Lorem ipsum", self.ev["placeholders"])
        self.assertIn("Cal.com", self.ev["embeds"]["iframes_or_scripts"])

    def test_form_labels(self):
        self.assertEqual(self.ev["forms"][0]["unlabeled"], 1)

    def test_text_mode(self):
        ev = collect.from_text("We delivered 92% adoption. © 2024 Acme. Posted March 3, 2026.")
        self.assertEqual(ev["stats"][0]["value"], "92%")
        self.assertTrue(ev["copyright"]["outdated"])
        self.assertIn("alt text", ev["not_observable"])


if __name__ == "__main__":
    unittest.main()
