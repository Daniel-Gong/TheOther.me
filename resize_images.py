#!/usr/bin/env python3
"""Temporary script to resize images to 768×1024px."""

from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip install Pillow")
    raise

TARGET_SIZE = (2064, 2752)

# Images in Cursor project assets (or workspace assets/)
ASSETS = Path.home() / ".cursor" / "projects" / "Users-dongyu-Documents-TheOther-me-TheOther-me" / "assets"
OUTPUT_DIR = Path(__file__).parent / "assets" / "resized"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

IMAGES = [
    "IMG_0262-9c188ef1-ab98-4b08-be47-c5ccb2dca3c4.png",
    "IMG_0261-ad0b74e7-a38e-4560-9905-d06ae3a18761.png",
    "IMG_0263-eab1e976-7141-48a8-b90b-6bb0823d00db.png",
    "IMG_0260-caa94eb8-f68a-4529-babe-cad65f55500e.png",
    "IMG_0265-4b2ec6c3-3d20-417b-af42-3af22527d336.png",
    "IMG_12678ADCCA04-1-365e2a4c-90eb-4014-b3c3-a3797efa00bf.png",
]


def main():
    for name in IMAGES:
        src = ASSETS / name
        if not src.exists():
            src = Path(__file__).parent / "assets" / name
        if not src.exists():
            print(f"Skip (not found): {name}")
            continue
        img = Image.open(src)
        img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        out = OUTPUT_DIR / name
        img.save(out, "PNG", optimize=True)
        print(f"Resized: {name} -> {out}")


if __name__ == "__main__":
    main()
