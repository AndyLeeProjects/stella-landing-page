#!/usr/bin/env python3
"""Robust border trim: uses row/column AVERAGE brightness (not single-pixel
threshold) to avoid false content from JPEG noise. Trims cream/white mat
borders left over from mockup compositing."""
import numpy as np
from PIL import Image
import os

IMG = "/Users/andylee/orca/projects/stella-landing-page/img"

def trim_by_row_avg(path, avg_tol=205, frac_tol=0.85):
    """A row/col is 'border' if the FRACTION of bright pixels (>avg_tol) exceeds frac_tol."""
    im = Image.open(path).convert("RGB")
    arr = np.array(im).astype(int)
    h, w, _ = arr.shape
    brightness = arr.mean(axis=2)  # HxW
    is_bright = brightness > avg_tol

    row_bright_frac = is_bright.mean(axis=1)  # per row
    col_bright_frac = is_bright.mean(axis=0)  # per col

    content_rows = np.where(row_bright_frac < frac_tol)[0]
    content_cols = np.where(col_bright_frac < frac_tol)[0]

    if len(content_rows) == 0 or len(content_cols) == 0:
        print(f"  {os.path.basename(path)}: no content found, skipping")
        return

    top, bottom = content_rows[0], content_rows[-1]
    left, right = content_cols[0], content_cols[-1]

    if (top, left, bottom, right) == (0, 0, h - 1, w - 1):
        print(f"  {os.path.basename(path)}: no border detected")
        return

    top = max(0, top - 1); bottom = min(h - 1, bottom + 1)
    left = max(0, left - 1); right = min(w - 1, right + 1)
    cropped = im.crop((left, top, right + 1, bottom + 1))
    cropped.save(path, quality=90, optimize=True, progressive=True)
    print(f"  {os.path.basename(path):30s} {w}x{h} -> {cropped.size[0]}x{cropped.size[1]}  "
          f"(trimmed to {left},{top}-{right},{bottom})")

targets = [
    "purse-light.jpg", "purse-dark.jpg", "bookmark-blue.jpg", "bookmark-detail.jpg",
    "fish-fig.jpg", "materials-pair.jpg", "ocean-scales.jpg", "og.jpg",
    "moodboard.jpg", "algae-hero.jpg", "fish-leather-hero.jpg", "algae-tote.jpg",
]
for t in targets:
    p = os.path.join(IMG, t)
    if os.path.exists(p):
        trim_by_row_avg(p)
