#!/usr/bin/env python3
"""Mobile v2 (Drive redesign) image derivatives.

Every crop box below was measured by template-matching the matching photo region
of design-ref/mobile-v2/*@2x.png (751px artboards) against the original source
(NCC score noted), so each derivative reproduces the mockup's composition.
Sources are limited to img/photos-v2/* originals and assets already in img/.
Run sequentially: python3 scripts/build-mobile-v2-assets.py
"""
from PIL import Image, ImageOps, ImageFilter, ImageCms
import io
import numpy as np
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'img')
V2 = os.path.join(IMG, 'photos-v2')


SRGB = ImageCms.createProfile('sRGB')


def open_src(path, rot=0):
    im = ImageOps.exif_transpose(Image.open(path))
    icc = im.info.get('icc_profile')
    if icc and 'sRGB' not in ImageCms.getProfileDescription(ImageCms.ImageCmsProfile(io.BytesIO(icc))):
        # iPhone originals are Display P3; the derivatives are untagged web JPEGs (sRGB)
        im = ImageCms.profileToProfile(im.convert('RGB'), ImageCms.ImageCmsProfile(io.BytesIO(icc)), SRGB,
                                       renderingIntent=ImageCms.Intent.PERCEPTUAL, outputMode='RGB')
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, 'white')
        bg.paste(im, mask=im.split()[3])
        im = bg
    im = im.convert('RGB')
    if rot:
        im = im.rotate(rot, expand=True, resample=Image.BICUBIC)
    return im


def save(im, out, width, q=86):
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(os.path.join(IMG, out), quality=q, optimize=True, progressive=True)
    print(f'  {out:28s} {im.width}x{im.height}')


def extract(src, box, out, width, rot=0, q=86, gain=1.0):
    im = open_src(src, rot)
    if gain != 1.0:  # match the artboard's photo grading (mean RGB ratio measured mockup / source)
        im = im.point(lambda v: min(255, round(v * gain)))
    x0, y0, x1, y1 = box
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(im.width, x1), min(im.height, y1)
    save(im.crop((x0, y0, x1, y1)), out, width, q)


print('=== Home (HOME@2x.png) ===')
# hero 0,0-751,1389  <- 2560dpi.png  ncc .983  scale 3.164
extract(f'{V2}/2560dpi.png', (184, 320, 2560, 4715), 'm2-home-hero.jpg', 1200)
# purse inset 52,1503-710,2380  <- desktop/purse-editorial.webp (whole frame) ncc .988
extract(f'{IMG}/desktop/purse-editorial.webp', (0, 0, 2400, 3192), 'm2-home-purse.jpg', 1100)
# bookmark 55,2434-705,3190  <- WRM3172-Edit.jpg  ncc .957  scale 7.44
extract(f'{V2}/WRM3172-Edit.jpg', (641, 1204, 5478, 6830), 'm2-home-bookmark.jpg', 1100)
# tote 45,3243-704,3727  <- WRM3221-Edit.jpg  ncc .977  scale 12.44
extract(f'{V2}/WRM3221-Edit.jpg', (42, 16, 8237, 6034), 'm2-home-tote.jpg', 1100)
# moodboard 21,5145-729,5445  <- IMG_4241.jpg  ncc .890  scale 5.59
extract(f'{V2}/IMG_4241.jpg', (56, 299, 4012, 1975), 'm2-home-mood.jpg', 1100)

# gallery 0,3789-751,4944 (Photo by Michelle Min). The only copy of this photo in the
# repo is inside the previous home artwork, where old copy is set over it. The new
# copy is real HTML, so remove the old lettering by diffusion fill + matched grain.
im = open_src(f'{IMG}/mobile-home-original.png')
a = np.array(im).astype(float)
y0, y1 = 7380, 8100
reg = a[y0:y1].copy()
mask = np.zeros(reg.shape[:2], bool)
mn = reg.min(axis=2)
for b0, b1 in [(7429, 7532), (7604, 7707), (7779, 7872), (8037, 8060)]:
    sl = slice(b0 - y0 - 8, b1 - y0 + 9)
    mask[sl] |= mn[sl] > 95
mask = np.array(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))) > 0
out = reg.copy()
for _ in range(1500):
    s = np.zeros_like(out)
    s[1:] += out[:-1]; s[:-1] += out[1:]; s[:, 1:] += out[:, :-1]; s[:, :-1] += out[:, 1:]
    out[mask] = (s / 4)[mask]
rng = np.random.default_rng(7)
out[mask] += rng.normal(0, 5.5, out[mask].shape)
a[y0:y1] = out
im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
save(im.crop((0, 5790, 1563, 8219)), 'm2-home-gallery.jpg', 1200)

print('=== Shop (SHOP@2x.png) ===')
# purse 25,163-725,1095  <- desktop/shop-purse-flat.webp (whole frame) ncc .992
extract(f'{IMG}/desktop/shop-purse-flat.webp', (0, 0, 536, 716), 'm2-shop-purse.jpg', 1100, q=90)
# bookmark 25,1241-725,2120  <- WRM3172-Edit.jpg rotated 90  ncc .988  scale 5.65
extract(f'{V2}/WRM3172-Edit.jpg', (2954, 468, 6910, 5435), 'm2-shop-bookmark.jpg', 1100, rot=90)
# tote 20,2282-731,2816  <- WRM3221-Edit.jpg  ncc .990  scale 11.55 (clamped to frame)
extract(f'{V2}/WRM3221-Edit.jpg', (43, 27, 8252, 6192), 'm2-shop-tote.jpg', 1100)

print('=== Product detail (Purse / Bookmark / Algae_Tote @2x.png) ===')
# purse 0,135-751,1102  <- Ecomm.jpg  ncc .966  scale 3.52
extract(f'{V2}/Ecomm.jpg', (177, 184, 2821, 3588), 'm2-pd-purse.jpg', 1200, gain=0.906)
# bookmark 66,275-690,998  <- WRM3172-Edit.jpg  ncc .981  scale 8.11
extract(f'{V2}/WRM3172-Edit.jpg', (490, 1092, 5550, 6954), 'm2-pd-bookmark.jpg', 1100)
# tote 0,0-751,1232  <- desktop/tote.webp rotated -90  ncc .988  scale 1.12
extract(f'{IMG}/desktop/tote.webp', (4, 18, 843, 1395), 'm2-pd-tote.jpg', 1200, rot=-90, q=90, gain=1.435)

print('=== About Materials stories ===')
# fish hero 0,0-751,846  <- IMG_4585.jpg  ncc .913  scale 3.51
extract(f'{V2}/IMG_4585.jpg', (205, 458, 2843, 3430), 'm2-mat-fish-hero.jpg', 1200)
# algae hero 0,0-751,846  <- IMG_0611.jpg  ncc .955  scale 3.51
extract(f'{V2}/IMG_0611.jpg', (188, 395, 2827, 3368), 'm2-mat-algae-hero.jpg', 1200)
# VIEW COLLECTION tile 24,2636-368,3105  <- 2560dpi.png  ncc .858  scale 6.94
extract(f'{V2}/2560dpi.png', (147, 1300, 2534, 4555), 'm2-tile-purse.jpg', 700)
# EXPLORE ALGAE tile 384,2636-730,3105  <- WRM3266-Edit.jpg (stitch line) scale 9.37
extract(f'{V2}/WRM3266-Edit.jpg', (1127, 3471, 4369, 7866), 'm2-tile-algae.jpg', 700)
# EXPLORE FISH LEATHER tile 384,3078-730,3548  <- desktop/purse-grain.webp  ncc .814
extract(f'{IMG}/desktop/purse-grain.webp', (460, 183, 1551, 1665), 'm2-tile-fish.jpg', 700)

print('=== WRM World (WRM_WORLD@2x.png) ===')
# Pieces are the same photographs, at the same scale, as the previous full-resolution
# World artwork (mobile-world-original.png, 1564 wide = 2.0826 x the 751 artboard).
# Each crop maps exactly onto its measured box in the new artboard.
W = f'{IMG}/mobile-world-original.png'
world = open_src(W)
S = 1564 / 751


def wcrop(newbox, ref_new, ref_src, out, width=None, scale=S):
    """crop the source region corresponding to newbox, given one matched pair
    ref_new (x,y in artboard) <-> ref_src (x,y in source) and the scale."""
    nx0, ny0, nx1, ny1 = newbox
    rx, ry = ref_new; sx, sy = ref_src
    box = (round(sx + (nx0 - rx) * scale), round(sy + (ny0 - ry) * scale),
           round(sx + (nx1 - rx) * scale), round(sy + (ny1 - ry) * scale))
    save(world.crop(box), out, width or round((nx1 - nx0) * 3.2))
    return box


# top: Ocean outline + crochet samples are unchanged from the previous artwork (0-834).
# The old artwork has the nav icons painted in; the live header is HTML, so erase them.
top = np.array(world.crop((0, 0, 1564, 1738))).astype(float)  # stops above the old white yarn frame
g = top.mean(axis=2)


def curve_x(rows, x0, x1):
    """x positions of outline strokes crossing the given rows within x0..x1"""
    out = []
    for r in rows:
        xs = np.nonzero(g[r, x0:x1] < 130)[0] + x0
        if len(xs):
            # split into strokes
            groups = np.split(xs, np.nonzero(np.diff(xs) > 2)[0] + 1)
            out.append([gr.mean() for gr in groups])
    return out


# hamburger bars (rows 94-98, 123-126, 151-155; x 70-152). The Ocean outline crosses
# each bar diagonally, so keep a +-4px corridor along the stroke (interpolated from the
# rows just above/below the bar) and replace the rest with the paper directly above.
for r0, r1 in ((94, 98), (123, 126), (151, 155)):
    above = curve_x([r0 - 3], 30, 170)[0]
    below = curve_x([r1 + 3], 30, 170)[0]
    pairs = [(a, min(below, key=lambda b: abs(b - a))) for a in above]
    for r in range(r0 - 1, r1 + 2):
        t = (r - (r0 - 3)) / ((r1 + 3) - (r0 - 3))
        keep = [a + (b - a) * t for a, b in pairs]
        for x in range(66, 157):
            if any(abs(x - k) <= 4 for k in keep):
                continue
            top[r, x] = top[r - 9, x] if g[r - 9, x] > 150 else top[r + 9, x]
# cart icon: clean paper patch of the same size from the empty band to its left
top[55:235, 1370:1525] = top[55:235, 1120:1275]
# logo: erase dark pixels right of the outline's inner stroke (fitted from rows clear of
# the logo); the live HTML logo is drawn over this exact spot.
ys, xs = [], []
for r in list(range(0, 55)) + list(range(205, 260)):
    c = curve_x([r], 640, 760)
    if c and c[0]:
        ys.append(r); xs.append(max(c[0]))
fit = np.polyfit(ys, xs, 2)
for r in range(50, 210):
    cx = np.polyval(fit, r)
    for x in range(int(cx) + 5, 880):
        if g[r, x] < 200:
            top[r, x] = top[r, x - 260] if g[r, x - 260] > 150 else top[r, x + 260]
save(Image.fromarray(np.clip(top, 0, 255).astype(np.uint8)), 'm2-world-top.jpg', 1200)

# section 2 (artboard 845-1277): charcoal yarn, research note, dyed bag
wcrop((62, 957, 305, 1199), (62, 957), (133 - 0, 1995), 'm2-world-yarn.jpg')
wcrop((349, 1002, 483, 1168), (349, 1003), (709, 2078), 'm2-world-note.jpg')
wcrop((406, 845, 751, 1277), (483, 846), (999, 1765), 'm2-world-dyedbag.jpg')
# vase 183,1398-512,1810
wcrop((183, 1398, 512, 1810), (183, 1398), (378, 2908), 'm2-world-vase.jpg')
# wallpaper section: no clean wallpaper original exists in the sources, so this keeps
# the previous artwork's real composite (wallpaper + Wiener Werkstatte photo + note +
# weaving) rather than fabricating wallpaper. Flagged in the implementation report.
# trimmed to the new panel box (35..714 x 1899..2588) keeping every baked piece whole
save(world.crop((73, 4038, 1487, 5473)), 'm2-world-wallpaper.jpg', 1400)
# section 5 (artboard 2764-3239): crochet purse, red photo, sticky note, Calder
wcrop((0, 2764, 347, 3239), (0, 2764), (0, 5757), 'm2-world-purse.jpg')
wcrop((289, 2810, 463, 3034), (289, 2810), (603, 5859), 'm2-world-red.jpg')
wcrop((316, 3057, 446, 3190), (316, 3057), (657, 6370), 'm2-world-sticky.jpg')
wcrop((403, 2764, 751, 3239), (463, 2764), (958, 5754), 'm2-world-calder.jpg')
# LEARN MORE tiles 0,3362-380,3591 (fish grain) and 380,3362-751,3591 (algae sheet)
extract(f'{IMG}/desktop/purse-grain.webp', (304, 900, 1694, 1738), 'm2-world-tex-fish.jpg', 700)
extract(f'{V2}/WRM3266-Edit.jpg', (1713, 3229, 5332, 5463), 'm2-world-tex-algae.jpg', 700)
print('done')
