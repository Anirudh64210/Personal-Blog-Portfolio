#!/usr/bin/env python3
"""Exports GIFs and PNGs from src/engine.js with nearest-neighbor scaling only.

Needs Node and Pillow (pip install pillow). Run from the package root:
    python3 scripts/export_assets.py [out_dir]

Writes:
  readme/   animated GIFs per state and a full visit loop, at 4x and 8x, plus 8x PNG stills
  profile/  square bust avatars (512, 1024, 2048) on solid colors and transparent, full-body PNGs
  sheets/   1x sprite sheets (one row of frames per state) with a frames.json index
"""
import json, os, subprocess, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'assets'))
TICK_MS = 125

def node_frames(requests):
    """requests: list of [mood, t]. Returns list of 2D grids of '#RRGGBB' or None."""
    js = ("const A=require(%s);const req=JSON.parse(require('fs').readFileSync(0,'utf8'));"
          "process.stdout.write(JSON.stringify({W:A.W,H:A.H,LOOPS:A.LOOPS,MOODS:A.MOODS,"
          "frames:req.map(([m,t])=>A.build(m,t).c.map(r=>r.map(c=>c?(A.PAL[c]||c):null)))}))") % json.dumps(os.path.join(ROOT, 'src', 'engine.js'))
    out = subprocess.run(['node', '-e', js], input=json.dumps(requests).encode(), capture_output=True, check=True)
    return json.loads(out.stdout)

META = node_frames([])
W, H, LOOPS, MOODS = META['W'], META['H'], META['LOOPS'], META['MOODS']

def to_image(grid):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); px = im.load()
    for y, row in enumerate(grid):
        for x, c in enumerate(row):
            if c: px[x, y] = (int(c[1:3], 16), int(c[3:5], 16), int(c[5:7], 16), 255)
    return im

def pixels(im):
    f = getattr(im, 'get_flattened_data', None)
    return list(f() if f else im.getdata())

def up(im, s): return im.resize((im.width * s, im.height * s), Image.NEAREST)

def save_gif(frames, path, scale):
    """frames: list of RGBA images at 1x. Exact palette, 1-bit transparency, merged duplicate frames."""
    colors = []
    for f in frames:
        for c in pixels(f):
            if c[3] == 255 and c[:3] not in colors: colors.append(c[:3])
    assert len(colors) <= 255, 'too many colors for GIF'
    pal = [(0, 0, 0)] + colors                     # index 0 = transparent
    lut = {c: i + 1 for i, c in enumerate(colors)}
    flat = [v for c in pal for v in c] + [0] * (768 - 3 * len(pal))
    seq, durs = [], []
    for f in frames:
        p = Image.new('P', f.size); p.putpalette(flat)
        p.putdata([lut[c[:3]] if c[3] == 255 else 0 for c in pixels(f)])
        p = up(p, scale)
        if seq and pixels(seq[-1]) == pixels(p): durs[-1] += TICK_MS
        else: seq.append(p); durs.append(TICK_MS)
    for p in seq: p.info['transparency'] = 0
    seq[0].save(path, save_all=True, append_images=seq[1:], duration=durs, loop=0,
                transparency=0, disposal=2, optimize=False)

def run():
    os.makedirs(OUT, exist_ok=True)
    for d in ('readme', 'profile', 'sheets'): os.makedirs(os.path.join(OUT, d), exist_ok=True)
    reqs = {m: [[m, t] for t in range(LOOPS[m] if m != 'awake' else 12)] for m in MOODS}
    visit = [['sleep', t] for t in range(32)] + [['awake', t] for t in range(8)] + [['hello', t] for t in range(32)] + [['work', t] for t in range(64)]
    flat = [r for m in MOODS for r in reqs[m]] + visit
    grids = node_frames(flat)['frames']
    i = 0; frames = {}
    for m in MOODS:
        n = len(reqs[m]); frames[m] = [to_image(g) for g in grids[i:i + n]]; i += n
    frames['visit'] = [to_image(g) for g in grids[i:]]

    # README: GIFs and stills
    for name, fr in frames.items():
        for s in (4, 8): save_gif(fr, os.path.join(OUT, 'readme', f'{name}@{s}x.gif'), s)
        if name != 'visit': up(fr[0], 8).save(os.path.join(OUT, 'readme', f'{name}@8x.png'))

    # sprite sheets at 1x
    index = {}
    for m in MOODS:
        fr = frames[m]; sheet = Image.new('RGBA', (W * len(fr), H), (0, 0, 0, 0))
        for k, f in enumerate(fr): sheet.paste(f, (k * W, 0))
        sheet.save(os.path.join(OUT, 'sheets', f'{m}.png'))
        index[m] = {'frames': len(fr), 'frameWidth': W, 'frameHeight': H, 'msPerFrame': TICK_MS, 'loops': m != 'awake'}
    with open(os.path.join(OUT, 'sheets', 'frames.json'), 'w') as fh: json.dump(index, fh, indent=1)

    # profile: 32 x 32 bust from the idle frame, head centered, circle-safe
    idle = frames['idle'][0]
    bust = idle.crop((7, 3, 39, 35))
    bgs = {'cream': (239, 232, 222), 'sky': (207, 221, 238), 'sage': (213, 226, 208), 'sand': (233, 213, 188)}
    for size in (512, 1024, 2048):
        s = size // 32
        up(bust, s).save(os.path.join(OUT, 'profile', f'avatar-transparent-{size}.png'))
        for name, rgb in bgs.items():
            bg = Image.new('RGBA', bust.size, rgb + (255,)); bg.alpha_composite(bust)
            up(bg, s).convert('RGB').save(os.path.join(OUT, 'profile', f'avatar-{name}-{size}.png'))
    for m in ('idle', 'hello'):
        for s in (16, 32): up(frames[m][0], s).save(os.path.join(OUT, 'profile', f'fullbody-{m}-{W*s}x{H*s}.png'))
    print('exported to', OUT)

if __name__ == '__main__':
    run()
