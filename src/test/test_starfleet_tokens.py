"""Drift test for the Starfleet design tokens. Written by the design-sync skill; do not edit.

The tokens come one way only: from the design system's Claude Design artifact, through a
design-sync run. This test fails when tokens.json was edited by hand, when a generated file
no longer matches what the generator makes from it, or when a contrast pair fails.
Fix: re-run the design-sync skill (never edit tokens.json, tokens.css or the inlined block).

Runs under pytest or `python -m unittest`. Standard library only.
"""
import json
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
MANIFEST = HERE / "../design-system/starfleet/design-sync.json"
sys.path.insert(0, str(HERE))
import design_tokens as dt  # noqa: E402


class DesignTokensTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        cls.root = MANIFEST.parent
        cls.tokens = dt.load(cls.root / "tokens.json")

    def test_tokens_json_is_verbatim(self):
        self.assertEqual(dt.sha256_file(self.root / "tokens.json"), self.manifest["sha256"],
                         "tokens.json differs from the synced artifact copy")

    def test_tokens_are_valid(self):
        self.assertEqual(dt.validate(self.tokens), [])

    def test_generated_css_matches(self):
        css = dt.generate_css(self.tokens, prefers_dark=self.manifest.get("prefers_dark", False))
        for out in self.manifest["outputs"]:
            path = self.root / out["path"]
            text = path.read_text(encoding="utf-8")
            got = text if out["kind"] == "css" else dt.extract_block(text)
            self.assertIsNotNone(got, f"{path}: design-sync markers missing")
            self.assertEqual(got, css, f"{path} differs from the generator output")

    def test_contrast(self):
        c = self.manifest.get("contrast", {})
        rows = dt.contrast_report(self.tokens, pairs=c.get("pairs", []), base=c.get("base", "background"),
                                  minimum=c.get("min", 4.5), waive=c.get("waive", []), auto=c.get("auto", True))
        self.assertEqual(dt.contrast_failures(rows), [])


if __name__ == "__main__":
    unittest.main()
