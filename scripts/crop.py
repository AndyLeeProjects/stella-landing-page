#!/usr/bin/env python3
"""Extract clean product images from mobile mockups (1564px wide source)
and trim any residual white/cream borders. Gives pixel-faithful crops."""
from PIL import Image, ImageOps
import os

SRC = "/Users/andylee/Downloads/drive-download-20260903T012212Z-1-001/"
OUT = "/Users/andylee/orca/projects/stella-landing-page/img/"
os.makedirs(OUT, exist_ok=True)

def extract(src, box, out, max_w=1400, q=88):
    im = Image.open(SRC + src).convert("RGB").crop(box)
    if im.width > max_w:
        im = im.resize((max_w, int(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(OUT + out, quality=q, optimize=True, progressive=True)
    print(f"  {out:28s} {im.size[0]}x{im.size[1]}  from {src} box={box}")

def trim_edges(path, tol=215):
    """Strip light borders; tol=215 keeps dark grime but strips near-white."""
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()
    left, top, right, bottom = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if r < tol or g < tol or b < tol:
                if x < left: left = x
                if y < top: top = y
                if x > right: right = x
                if y > bottom: bottom = y
    if left > right:
        print(f"    WARNING: {os.path.basename(path)} is all-bright, not trimming")
        return
    left = max(0, left - 1); top = max(0, top - 1)
    right = min(w - 1, right + 1); bottom = min(h - 1, bottom + 1)
    cropped = im.crop((left, top, right + 1, bottom + 1))
    cropped.save(path, quality=88, optimize=True, progressive=True)
    print(f"    trimmed -> {cropped.size[0]}x{cropped.size[1]} (was {w}x{h})")

print("=== Product images ===")
# purse-light: from mobile_Purse.png (product detail page). Box excludes the
# header, breadcrumb text (ends ~y=190) and the "Salmon Purse" title below
# the photo (starts ~y=2430). Photo region only.
extract("mobile_Purse.png", (0, 390, 1564, 2420), "purse-light.jpg")
trim_edges(OUT + "purse-light.jpg")

# purse-dark: from mobile_Product List Page.png (first product, Salmon Purse).
# The hero image is at top with the dark background bag; bottom bound stops
# before the "Salmon Bag" title/caption text.
extract("mobile_Product List Page.png", (30, 300, 1534, 2420), "purse-dark.jpg")
trim_edges(OUT + "purse-dark.jpg")

# bookmark-blue: from mobile_SHOP.png second product section.
extract("mobile_SHOP.png", (0, 3640, 1564, 5540), "bookmark-blue.jpg")
trim_edges(OUT + "bookmark-blue.jpg")

# bookmark-detail: from mobile_Bookmark.png.
extract("mobile_Bookmark.png", (0, 520, 1564, 2330), "bookmark-detail.jpg")
trim_edges(OUT + "bookmark-detail.jpg")

# algae-tote: from mobile_SHOP.png third product.
extract("mobile_SHOP.png", (0, 6340, 1564, 7530), "algae-tote.jpg")
trim_edges(OUT + "algae-tote.jpg")

print("\n=== Editorial imagery ===")
extract("mobile_HOME.png", (0, 300, 1563, 2560), "moodboard.jpg")
extract("mobile_HOME.png", (0, 2610, 1563, 5250), "ocean-scales.jpg")
extract("mobile_HOME.png", (0, 5500, 1563, 6450), "materials-pair.jpg")
extract("mobile_About Material-08.png", (0, 374, 1564, 1138), "fish-leather-hero.jpg")
extract("mobile_About Material-08.png", (0, 1140, 1564, 2700), "algae-hero.jpg")

print("\n=== OG image ===")
# Re-extract og.jpg from moodboard or create a clean composite
# The og.jpg needs to represent the brand — crop from moodboard
extract("mobile_HOME.png", (0, 300, 1563, 2200), "og.jpg")
trim_edges(OUT + "og.jpg")

print("\n=== Texture ===")
# texture.jpg is the paper grain background — keep full frame, but trim any
# embedded white border if present
trim_edges(OUT + "texture.jpg", tol=220)

print("\n=== Wordmark → transparent PNG ===")
im = Image.open(SRC + "mobile_Bookmark.png").convert("L").crop((40, 4540, 1524, 4740))
alpha = ImageOps.invert(im).point(lambda v: 0 if v < 60 else min(255, int((v - 60) * 1.6)))
wm = Image.new("RGBA", im.size, (28, 26, 23, 0))
wm.putalpha(alpha)
bbox = alpha.getbbox()
wm = wm.crop(bbox)
wm.save(OUT + "wordmark.png", optimize=True)
print(f"  wordmark.png                 {wm.size[0]}x{wm.size[1]}")
