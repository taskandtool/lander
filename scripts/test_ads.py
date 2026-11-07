"""The ad scripts: help, bad input, and that an ad must name a real lander page. python3 scripts/test_ads.py"""
import os, shutil, subprocess, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
AD = """---
kind: ad
platform: meta
format: testimonial
angle: speed
hook: offer
awareness: most
status: draft
claims: []
files: []
{landing}
url: ""
copy:
  headline: "A clean car"
  primary_text: "A clean car."
  cta: "Get Quote"
---

## Idea
An idea.
"""


def run(app, *args):
    return subprocess.run([sys.executable, os.path.join(app, "scripts", args[0]), *args[1:]], capture_output=True, text=True)


class Scripts(unittest.TestCase):
    def test_help_and_misuse(self):
        for script in ("check.py", "preview.py"):
            for flag in ("--help", "-h"):
                r = run(APP, script, flag)
                self.assertEqual(r.returncode, 0, script)
                self.assertTrue(r.stdout.strip(), script)
            r = run(APP, script, "--nope")
            self.assertEqual(r.returncode, 2, script)
            self.assertEqual(r.stdout, "", script)
            self.assertIn("Try:", r.stderr, script)

    def test_a_missing_folder_fails(self):
        r = run(APP, "check.py", "2020-01-01-nothing")
        self.assertEqual(r.returncode, 1)
        self.assertIn("Try:", r.stderr)

    def test_an_ad_names_a_real_page(self):
        with tempfile.TemporaryDirectory() as t:
            app = os.path.join(t, "app")
            os.makedirs(app)
            shutil.copytree(os.path.join(APP, "scripts"), os.path.join(app, "scripts"), ignore=shutil.ignore_patterns("__pycache__"))
            shutil.copytree(os.path.join(APP, "specs"), os.path.join(app, "specs"))
            shutil.copytree(os.path.join(APP, ".claude"), os.path.join(app, ".claude"), ignore=shutil.ignore_patterns("node_modules"))
            for d in ("brand", "public"):
                shutil.copytree(os.path.join(APP, d), os.path.join(app, d))
            os.makedirs(os.path.join(app, "src"))
            shutil.copy(os.path.join(APP, "src", "offer.ts"), os.path.join(app, "src", "offer.ts"))
            d = os.path.join(app, "creatives", "2026-01-01-test")
            os.makedirs(d)
            path = os.path.join(d, "creative.md")
            for landing, ok in (("", False), ("landing: /nope", False), ("landing: /offer", True)):
                with open(path, "w", encoding="utf-8") as fh:
                    fh.write(AD.format(landing=landing))
                r = run(app, "check.py", "2026-01-01-test")
                self.assertEqual("landing" in r.stderr, not ok, landing or "no landing")


if __name__ == "__main__":
    unittest.main()
