"""Run against a signed-in gstack browser; no credentials or test content needed."""
import json
import os
from pathlib import Path
import subprocess
import time

# Regression: CMS-001 — Presentation could not connect to the draft frontend.
# Found by /qa on 2026-11-02.
# Report: .gstack/qa-reports/qa-report-circulox-preview-vercel-app-2026-11-02.md
browser = os.environ.get("GSTACK_BROWSE", str(Path.home() / ".codex/skills/gstack/browse/dist/browse"))
base = os.environ.get("CMS_TEST_URL", "https://circulox-preview.vercel.app")

def run(*args):
    result = subprocess.run(["rtk", "proxy", browser, *args], capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(result.stderr or result.stdout)
    return result.stdout

def check(expression):
    output = run("js", f'(()=>{{if(!({expression}))throw new Error("CMS assertion failed");return "PASS"}})()')
    assert "PASS" in output

run("frame", "main")
run("viewport", "1440x900")
run("goto", base + "/studio/presentation")
for attempt in range(20):
    status = run("js", 'JSON.stringify({ready:!!document.querySelector("iframe") && !!document.querySelector("input[type=checkbox]:checked"),failed:document.body.innerText.includes("Unable to connect")})')
    if '"ready":true' in status:
        break
    time.sleep(1)
else:
    raise AssertionError("Presentation did not connect; check sign-in and draft preview configuration")
check('!document.body.innerText.includes("Unable to connect")')
run("frame", "iframe")
check('document.body.innerText.includes("Private draft preview")')
run("frame", "main")
for width, height in [(390, 844), (1440, 900)]:
    run("viewport", f"{width}x{height}")
    run("goto", base + "/studio/structure")
    run("wait", 'button[aria-label="Create new document"]')
    check('document.body.innerText.includes("Publishing") && !document.body.innerText.includes("tool crashed")')
    check("document.documentElement.scrollWidth <= innerWidth")
run("goto", base + "/api/draft-mode/disable")
check('!document.body.innerText.includes("Private draft preview")')
print("PASS: authenticated Presentation handshake, private preview, mobile/desktop Studio, exit preview")
