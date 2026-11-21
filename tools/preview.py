# Planche de presentation d'un perso : poses cles agrandies + perso dans le decor.
# usage: python preview.py <cle_meta> <sortie.png> [anims...]
import sys, json, os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'game', 'assets')
key, out = sys.argv[1], sys.argv[2]
meta = json.load(open(os.path.join(A, 'meta.json')))
m = meta[key]
sheet = Image.open(os.path.join(A, m['img'])).convert('RGBA')
anims = sys.argv[3:] or list(m['anims'].keys())
fw, fh = m['fw'], m['fh']
frames = []
for an in anims:
    s, n = m['anims'][an]
    frames.append((an, sheet.crop(((s + n - 1) * fw, 0, (s + n) * fw, fh))))
S = 3
cols = len(frames)
lineup = Image.new('RGBA', (cols * fw * S, fh * S + 18), (24, 14, 52, 255))
d = ImageDraw.Draw(lineup)
for i, (an, fr) in enumerate(frames):
    big = fr.resize((fw * S, fh * S), Image.NEAREST)
    lineup.paste(big, (i * fw * S, 0), big)
    d.text((i * fw * S + 6, fh * S + 4), an, fill=(56, 242, 255, 255))
# dans le decor (echelle de jeu x3)
bg = Image.open(os.path.join(A, 'kleber.png')).convert('RGBA')
scene = Image.new('RGBA', (384, 216), (20, 18, 60, 255))
scene.paste(bg.crop((0, 0, 384, 216)), (0, 0), bg.crop((0, 0, 384, 216)))
ax, ay = m['anchor']
for i, (an, fr) in enumerate(frames[:4]):
    x, y = 70 + i * 80, 196 - (i % 2) * 22
    scene.paste(fr, (int(x - ax), int(y - ay)), fr)
scene = scene.resize((384 * S, 216 * S), Image.NEAREST)
W = max(lineup.width, scene.width)
out_img = Image.new('RGBA', (W, lineup.height + scene.height), (10, 8, 30, 255))
out_img.paste(lineup, (0, 0))
out_img.paste(scene, (0, lineup.height))
out_img.convert('RGB').save(out)
print(out, out_img.size)
