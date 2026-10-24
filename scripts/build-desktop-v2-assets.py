#!/usr/bin/env python3
"""Desktop v2 (Drive redesign) image derivatives -> img/d2-*.jpg.

Every crop box below was measured by template-matching the photo region of
design-ref/desktop-v2/*@2x.png (2881px artboards = 1440 CSS px @2x; boxes noted in
artboard px) against the original source (normalised cross-correlation score noted),
so each derivative reproduces the mockup's composition at desktop resolution.
Sources are limited to img/photos-v2/* originals, the mobile v2 derivatives and the
existing img/desktop/*.webp assets where the mockup shows that exact photograph.
Nothing here overwrites a file used by mobile.

Run sequentially: python3 scripts/build-desktop-v2-assets.py [--verify]
(--verify re-scores every derivative against its artboard region; needs design-ref/.)
"""
from PIL import Image, ImageOps, ImageCms, ImageFilter
import io
import os
import sys
import numpy as np

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, 'img')
V2 = os.path.join(IMG, 'photos-v2')
DK = os.path.join(IMG, 'desktop')
REF = os.path.join(ROOT, 'design-ref', 'desktop-v2')

SRGB = ImageCms.createProfile('sRGB')
_cache = {}


def open_src(path, rot=0, mirror=False):
    key = (path, rot, mirror)
    if key in _cache:
        return _cache[key]
    _cache.clear()  # one large original in memory at a time
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
    if mirror:
        im = ImageOps.mirror(im)
    if rot:
        im = im.rotate(rot, expand=True, resample=Image.BICUBIC)
    _cache[key] = im
    return im


def grade(im, g):
    """per-channel tone match to the artboard: move each channel's mean/std to the
    values measured on the artboard's graded photo"""
    if not g:
        return im
    a = np.asarray(im, np.float32)
    for c, (mean, std) in enumerate(g):
        ch = a[..., c]
        a[..., c] = (ch - ch.mean()) * (std / max(1.0, ch.std())) + mean
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def crop_padded(im, box):
    """crop; where the artboard frames wider than the photograph (plain studio backdrop),
    extend the backdrop by edge replication, softened so no streaks show."""
    x0, y0, x1, y1 = box
    if x0 >= 0 and y0 >= 0 and x1 <= im.width and y1 <= im.height:
        return im.crop(box)
    a = np.asarray(im)
    pl, pt = max(0, -x0), max(0, -y0)
    pr, pb = max(0, x1 - im.width), max(0, y1 - im.height)
    p = np.pad(a, ((pt, pb), (pl, pr), (0, 0)), mode='edge')
    out = Image.fromarray(p)
    soft = out.filter(ImageFilter.GaussianBlur(40))
    mask = Image.new('L', out.size, 255)
    mask.paste(0, (pl, pt, pl + im.width, pt + im.height))
    mask = mask.filter(ImageFilter.GaussianBlur(12))
    out = Image.composite(soft, out, mask)
    return out.crop((x0 + pl, y0 + pt, x1 + pl, y1 + pt))


def save(im, out, width, q=86):
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(os.path.join(IMG, out), quality=q, optimize=True, progressive=True)
    print(f'  {out:26s} {im.width}x{im.height}')
    return im


# name: (source, crop box in source px, output width, artboard, artboard box @2x, ncc, extra)
# output width = 2x the CSS width on the 1440 artboard, capped at the source's native pixels.
JOBS = [
    # === Home (Home@2x.png) ===
    ('d2-home-hero.jpg', f'{V2}/2560dpi.png', (0, 1466, 2560, 4710), 2560, 'Home', (0, 0, 2881, 3651), .994, {}),
    ('d2-home-purse.jpg', f'{DK}/purse-editorial.webp', (0, 0, 2394, 3192), 1114, 'Home', (243, 3894, 1356, 5378), .999, {}),
    ('d2-home-bookmark.jpg', f'{V2}/WRM3172-Edit.jpg', (637, 1181, 5511, 6849), 1276, 'Home', (1379, 3894, 2655, 5378), .984, {}),
    # the artboard sets the tote smaller than the frame: core (tote) region 480,5600-2400,7180
    # matched at ncc .952, scale 3.8623; the black backdrop is extended to the full-bleed band.
    ('d2-home-tote.jpg', f'{V2}/WRM3221-Edit.jpg', (-1483, -185, 9644, 6161), 2880, 'Home', (0, 5552, 2881, 7195), .952, {'gain': 0.92}),
    # gallery (Photo by Michelle Min): only exists in the cleaned mobile derivative
    ('d2-home-gallery.jpg', f'{IMG}/m2-home-gallery.jpg', (0, 153, 1200, 1584), 1200, 'Home', (1469, 7361, 2881, 9045), .972, {}),
    ('d2-home-mood.jpg', f'{V2}/IMG_4241.jpg', (31, 293, 4032, 1986), 1250, 'Home', (816, 9742, 2066, 10271), .955, {'gain': 0.6}),
    # === Shop (SHOP@2x.png) ===
    # Salmon Purse master: the high-res shop-purse-flat.webp (1512x2016), whole frame
    ('d2-shop-purse.jpg', f'{DK}/shop-purse-flat.webp', (0, 0, 1512, 2016), 1044, 'SHOP', (300, 458, 996, 1386), .935, {'gain': 1.13}),
    ('d2-shop-dyedbag.jpg', f'{DK}/world-dyed-bag.webp', (26, 0, 2249, 2913), 1466, 'SHOP', (1414, 0, 2881, 1922), .932, {'gain': 1.07}),
    ('d2-shop-bookmark.jpg', f'{V2}/WRM3172-Edit.jpg', (2956, 471, 6908, 5435), 1414, 'SHOP', (0, 1922, 1414, 3698), .985, {'rot': 90}),
    # only copy of the bookmark-on-book photograph in the repo (540x676); flagged as low-res
    ('d2-shop-bookbm.jpg', f'{DK}/shop-bookmark-book.webp', (0, 0, 540, 676), 540, 'SHOP', (1785, 2386, 2482, 3259), .967, {}),
    # only copy of the amber tote photograph in the repo (1400x857); flagged as 1x
    ('d2-shop-tote.jpg', f'{DK}/tote.webp', (8, 5, 1400, 853), 1392, 'SHOP', (0, 4112, 2876, 5864), .991, {}),
    ('d2-shop-c-purse.jpg', f'{V2}/2560dpi.png', (0, 1466, 2560, 4707), 730, 'SHOP', (70, 6456, 800, 7380), .969, {}),
    ('d2-shop-c-bookmark.jpg', f'{V2}/WRM3172-Edit.jpg', (2962, 471, 6912, 5416), 738, 'SHOP', (822, 6456, 1560, 7380), .987, {'rot': 90}),
    ('d2-shop-c-tote.jpg', f'{V2}/WRM3221-Edit.jpg', (0, 0, 8256, 6182), 1234, 'SHOP', (1580, 6456, 2814, 7380), .998, {}),
    # === Product detail (Salmon Purse / Bookmark / Algae Tote @2x.png) ===
    ('d2-pd-purse-1.jpg', f'{V2}/Ecomm.jpg', (253, 483, 2781, 3793), 1440, 'Salmon Purse', (0, 0, 1440, 1886), .976, {}),
    # photo 2 (three-quarter view on white, 0,1888-1440,3808) has no source in the repo: omitted
    ('d2-pd-purse-3.jpg', f'{DK}/purse-grain.webp', (0, 0, 2400, 1797), 1440, 'Salmon Purse', (0, 3820, 1440, 4898), .996, {}),
    ('d2-pd-purse-4.jpg', f'{DK}/purse-corner.webp', (0, 0, 2389, 3199), 1440, 'Salmon Purse', (0, 4898, 1440, 6826), .995, {}),
    ('d2-pd-purse-5.jpg', f'{V2}/IMG_9859.jpg', (0, 45, 2937, 3619), 1440, 'Salmon Purse', (0, 6826, 1440, 8578), .987, {}),
    # only copy of the bookmark-on-open-book photograph (1400x963); flagged as 1x
    ('d2-pd-bm-1.jpg', f'{DK}/bookmark-book.webp', (0, 108, 1400, 963), 1400, 'Bookmark', (0, 0, 2881, 1760), .970, {}),
    ('d2-pd-bm-2.jpg', f'{V2}/WRM3172-Edit.jpg', (614, 1152, 5524, 6849), 1434, 'Bookmark', (0, 1760, 1434, 3424), .993, {}),
    # the artboard uses this original mirrored (ncc .968 mirrored vs <.21 as shot)
    ('d2-pd-bm-3.jpg', f'{V2}/IMG_3794.jpg', (22, 34, 3024, 4032), 1434, 'Bookmark', (0, 3424, 1434, 5334), .968, {'mirror': True}),
    ('d2-pd-tote-1.jpg', f'{DK}/tote.webp', (0, 0, 849, 1400), 849, 'Algae Tote', (0, 0, 1448, 2388), .992, {'rot': -90, 'gain': 1.43}),
    ('d2-pd-tote-2.jpg', f'{V2}/WRM3221-Edit.jpg', (0, 75, 8256, 6153), 1448, 'Algae Tote', (0, 2388, 1448, 3454), .997, {}),
    # === About Materials (Mateiral Story@2x.png) ===
    ('d2-mat-fish.jpg', f'{DK}/purse-grain.webp', (317, 27, 1703, 1759), 1386, 'Mateiral Story', (0, 0, 1440, 1800), .887, {'gain': 0.9}),
    # the artboard grades this sheet dark olive; box aligned on the two stitch lines (ncc .58,
    # grading is non-linear), tone matched by mean/std per channel
    ('d2-mat-algae.jpg', f'{V2}/WRM3266-Edit.jpg', (720, 3269, 4180, 7592), 1440, 'Mateiral Story', (1440, 0, 2881, 1800), .582, {'grade': 'algae'}),
    # === Material stories ===
    ('d2-fish-hero.jpg', f'{V2}/IMG_4585.jpg', (106, 409, 3019, 4031), 1444, 'Fish Leather Mateiral Story', (0, 0, 1444, 1796), .977, {'gain': 0.69}),
    # only copy of the Ainu archive photograph (370x345); flagged as 1x
    ('d2-fish-ainu.jpg', f'{DK}/fish-ainu-design-crop.webp', (16, 22, 364, 273), 348, 'Fish Leather Mateiral Story', (422, 2242, 1132, 2752), .963, {}),
    ('d2-fish-p-tote.jpg', f'{V2}/WRM3221-Edit.jpg', (0, 0, 8216, 6192), 1218, 'Fish Leather Mateiral Story', (194, 3848, 1412, 4766), .964, {'gain': 0.71}),
    ('d2-fish-p-algae.jpg', f'{V2}/WRM3266-Edit.jpg', (743, 3068, 4295, 5635), 1270, 'Fish Leather Mateiral Story', (1446, 3848, 2716, 4766), .615, {'grade': 'algae'}),
    ('d2-algae-hero.jpg', f'{V2}/IMG_0611.jpg', (34, 11, 3011, 3746), 1428, 'Algae Material Story', (0, 0, 1428, 1792), .987, {}),
    ('d2-algae-p-tote.jpg', f'{V2}/WRM3221-Edit.jpg', (75, 0, 8256, 6192), 1218, 'Algae Material Story', (244, 4292, 1462, 5212), .972, {'gain': 0.71}),
    ('d2-algae-p-fish.jpg', f'{DK}/purse-grain.webp', (329, 494, 1535, 1364), 1206, 'Algae Material Story', (1490, 4292, 2764, 5212), .893, {'gain': 0.9}),
    # === WRM World (WRM WORLD@2x.png) ===
    # only copy of the crocheted bag photograph (703x898); flagged as low-res
    ('d2-world-crochet.jpg', f'{DK}/world-clear-bag.webp', (103, 0, 702, 898), 599, 'WRM WORLD', (0, 0, 1230, 1844), .957, {}),
    ('d2-world-samples.jpg', f'{IMG}/mobile-world-original.png', (376, 435, 1163, 1482), 666, 'WRM WORLD', (1818, 526, 2484, 1412), .981, {}),
    ('d2-world-dye.jpg', f'{DK}/world-dye.webp', (0, 0, 2392, 2974), 1448, 'WRM WORLD', (0, 1844, 1448, 3644), .992, {}),
    # only copy of the fish-jar photograph is inside the previous World artwork; flagged as 1x
    ('d2-world-vase.jpg', f'{IMG}/mobile-world-original.png', (381, 2912, 1065, 3771), 684, 'WRM WORLD', (1448, 1844, 2881, 3644), .996, {}),
    # the wallpaper panel with its pinned pieces (Wiener Werkstatte page, note, weaving) is one
    # photographed arrangement; the whole frame maps onto artboard 84,3842 at scale .9132
    ('d2-world-wall.jpg', f'{DK}/world-history.webp', (0, 0, 2400, 1895), 2400, 'WRM WORLD', (84, 3842, 2712, 5917), .997, {}),
    ('d2-world-wire.jpg', f'{DK}/world-wire.webp', (0, 0, 2400, 1483), 2400, 'WRM WORLD', (0, 6044, 2881, 7824), .998, {}),
    ('d2-world-back.jpg', f'{V2}/WRM3221-Edit.jpg', (0, 0, 8256, 6178), 1216, 'WRM WORLD', (1596, 8314, 2812, 9224), .987, {'gain': 0.71}),
]
# LEARN MORE tile: fish grain (left) + algae sheet (right) side by side, as on the artboard
LEARN = [
    (f'{DK}/purse-grain.webp', (318, 19, 1708, 1751), 'WRM WORLD', (70, 8314, 800, 9224), .919, {}),
    (f'{V2}/WRM3266-Edit.jpg', (1312, 4870, 3498, 7611), 'WRM WORLD', (800, 8314, 1526, 9224), .654, {'grade': 'algae'}),
]
# artboard tone of the graded algae sheet: (mean, std) per RGB channel, measured on the
# Mateiral Story / Fish Leather story / WRM World panels (all three carry the same grade)
GRADES = {'algae': [(105.0, 10.0), (99.0, 10.0), (86.0, 10.5)]}


def build_one(src, box, extra):
    im = open_src(src, extra.get('rot', 0), extra.get('mirror', False))
    out = grade(crop_padded(im, box), GRADES.get(extra.get('grade')))
    if extra.get('gain'):  # artboard exposure (mean RGB ratio artboard / source, see --verify)
        out = out.point(lambda v: min(255, round(v * extra['gain'])))
    return out


def build():
    for out, src, box, width, *_ , extra in JOBS:
        save(build_one(src, box, extra), out, width)
    parts = [build_one(src, box, extra) for src, box, _, _, _, extra in LEARN]
    h = 910
    parts = [p.resize((round(p.width * h / p.height), h), Image.LANCZOS) for p in parts]
    sheet = Image.new('RGB', (730 + 726, h))
    sheet.paste(parts[0].resize((730, h), Image.LANCZOS), (0, 0))
    sheet.paste(parts[1].resize((726, h), Image.LANCZOS), (730, 0))
    save(sheet, 'd2-world-learn.jpg', 1456)
    # header logo: the desktop mockups draw a different WRM script than wrm-logo-dark.png;
    # this is the mockup's own logo artwork (black on transparent in FAQ@2x.png)
    if os.path.exists(f'{REF}/FAQ@2x.png'):
        a = np.array(Image.open(f'{REF}/FAQ@2x.png').crop((1370, 28, 1510, 151)))
        logo = np.zeros_like(a); logo[..., 3] = a[..., 3]
        Image.fromarray(logo).save(f'{IMG}/d2-logo.png', optimize=True)
        print('  d2-logo.png                140x123')


def verify():
    """re-score each derivative against its artboard region (NCC on grey, and tone ratio)"""
    boards = {}
    for out, src, box, width, board, abox, ncc, extra in JOBS:
        if board not in boards:
            boards.clear()
            im = Image.open(f'{REF}/{board}@2x.png').convert('RGBA')
            bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im)
            boards[board] = bg.convert('RGB')
        m = boards[board].crop(abox)
        d = Image.open(os.path.join(IMG, out)).convert('RGB').resize(m.size, Image.BILINEAR)
        A = np.asarray(m.resize((256, round(256 * m.height / m.width))), np.float32)
        B = np.asarray(d.resize((256, round(256 * m.height / m.width))), np.float32)
        ga, gb = A.mean(2) - A.mean(), B.mean(2) - B.mean()
        score = float((ga * gb).sum() / np.sqrt((ga ** 2).sum() * (gb ** 2).sum()))
        tone = (A.reshape(-1, 3).mean(0) / np.maximum(1, B.reshape(-1, 3).mean(0))).round(2)
        print(f'  {out:26s} ncc(recorded) {ncc:.3f}  ncc(derivative) {score:.3f}  tone artboard/derivative {tone}')


if __name__ == '__main__':
    verify() if '--verify' in sys.argv else build()
