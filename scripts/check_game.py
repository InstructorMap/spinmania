#!/usr/bin/env python3
"""Offline integrity check for El Oráculo assets and embedded JavaScript."""
from pathlib import Path
import re
import subprocess
import tempfile

root = Path("app/src/main/assets")
signs = "aries tauro geminis cancer leo virgo libra escorpio sagitario capricornio acuario piscis".split()
errors = []
for sign in signs:
    if not (root / f"capitulo-{sign}.html").is_file():
        errors.append(f"Missing chapter: {sign}")
for html in root.glob("*.html"):
    text = html.read_text(encoding="utf-8")
    for path in re.findall(r"""(?:href|src)=["']([^"']+)["']""", text):
        if path.startswith(("http:", "https:", "#", "mailto:", "data:")):
            continue
        target = path.split("?")[0].split("#")[0]
        if target and not target.endswith("/") and not (root / target).is_file():
            errors.append(f"{html.name}: missing {path}")
    for i, script in enumerate(re.findall(r"<script(?:\\s[^>]*)?>(.*?)</script>", text, re.S | re.I)):
        with tempfile.NamedTemporaryFile(mode="w", suffix=".js", encoding="utf-8") as tmp:
            tmp.write(script)
            tmp.flush()
            check = subprocess.run(["node", "--check", tmp.name], capture_output=True, text=True)
            if check.returncode:
                errors.append(f"{html.name} script {i}: {check.stderr[-500:]}")
for js in root.glob("*.js"):
    check = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
    if check.returncode:
        errors.append(f"{js.name}: {check.stderr[-500:]}")
if errors:
    raise SystemExit("\n".join(errors))
print(f"Validated {len(list(root.glob('*.html')))} HTML screens and 12 chapters")
