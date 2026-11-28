"""Writes resized copies of the larger site photos to public/img/r/<name>-<width>.webp and a
manifest (src/data/responsive.json) the site uses to build srcset. Originals are untouched.
Re-run after adding or replacing photos:  python scripts/responsive-images.py"""
import json
import os
from PIL import Image

SRC = "public/img"
OUT = "public/img/r"
WIDTHS = (640, 1280, 1920)
MIN_BYTES = 40_000  # small images aren't worth variants

os.makedirs(OUT, exist_ok=True)
manifest = {}
for name in sorted(os.listdir(SRC)):
    path = os.path.join(SRC, name)
    if not name.endswith(".webp") or not os.path.isfile(path) or os.path.getsize(path) < MIN_BYTES:
        continue
    im = Image.open(path)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")
    stem = name[:-5]
    made = []
    for w in WIDTHS:
        if im.width <= w:
            continue
        h = round(im.height * w / im.width)
        out = os.path.join(OUT, f"{stem}-{w}.webp")
        im.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=80, method=6)
        made.append(w)
    if made:
        manifest[f"/img/{name}"] = {"w": im.width, "variants": made}
        print(f"{name:28} {im.width}px  ->  {made}")

with open("src/data/responsive.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=1, sort_keys=True)
print(f"{len(manifest)} images")
