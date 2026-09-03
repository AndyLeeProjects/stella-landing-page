"""Crop clean assets from the mobile mockups (1564px wide)."""
from PIL import Image, ImageOps
import os

SRC = "/Users/andylee/Downloads/drive-download-20260903T012212Z-1-001/"
OUT = "/Users/andylee/orca/projects/stella-landing-page/img/"
os.makedirs(OUT, exist_ok=True)

def crop(src, box, out, max_w=1400, q=86):
    im = Image.open(SRC + src).convert("RGB").crop(box)
    if im.width > max_w:
        im = im.resize((max_w, int(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(OUT + out, quality=q, optimize=True, progressive=True)
    print(f"{out:28s} {im.size}")

# Products (clean, no baked text)
crop("mobile_Product List Page.png", (60, 340, 1504, 2500), "purse-dark.jpg")
crop("mobile_SHOP.png",              (0, 3640, 1564, 5540),  "bookmark-blue.jpg")
crop("mobile_Purse.png",             (0, 400, 1564, 2240),   "purse-light.jpg")
crop("mobile_Bookmark.png",          (0, 520, 1564, 2330),   "bookmark-detail.jpg")
# Algae tote only exists with baked labels — keep as-is
crop("mobile_SHOP.png",              (0, 6340, 1564, 7530),  "algae-tote.jpg")

# Editorial imagery
crop("mobile_HOME.png", (0, 300, 1563, 2560),  "moodboard.jpg")      # quote baked (WRM World hero)
crop("mobile_HOME.png", (0, 2610, 1563, 5250), "ocean-scales.jpg")   # CHAPTER I / Ocean baked
crop("mobile_HOME.png", (0, 5500, 1563, 6450), "materials-pair.jpg") # caption cropped out
crop("mobile_About Material-08.png", (0, 374, 1564, 1138),  "fish-leather-hero.jpg")
crop("mobile_About Material-08.png", (0, 1140, 1564, 2700), "algae-hero.jpg")

# Wordmark → transparent PNG (dark ink on paper → alpha)
im = Image.open(SRC + "mobile_Bookmark.png").convert("L").crop((40, 4540, 1524, 4740))
alpha = ImageOps.invert(im).point(lambda v: 0 if v < 60 else min(255, int((v - 60) * 1.6)))
wm = Image.new("RGBA", im.size, (28, 26, 23, 0))
wm.putalpha(alpha)
bbox = alpha.getbbox()
wm = wm.crop(bbox)
wm.save(OUT + "wordmark.png", optimize=True)
print(f"{'wordmark.png':28s} {wm.size}")

# Downscale live paper texture
tx = Image.open(OUT + "texture.jpg").convert("RGB").resize((1400, 1400), Image.LANCZOS)
tx.save(OUT + "texture.jpg", quality=80, optimize=True)
print("texture.jpg", tx.size)
