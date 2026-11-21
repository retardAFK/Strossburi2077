# Décor Port du Rhin 2026 (niveau 3, le Promoteur) d'après la photo de Maxime : ancien moulin-entrepôt en pierre
# (tour carrée à toit pyramidal, grandes arcades), silos béton, bâtiment en bardage rouge à bande jaune, grue jaune,
# convoyeurs, quai de béton et bassin. BlingCo : bâche « LOFTS », préfabriqués empilés, palissade de chantier.
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\decor_port_rhin.py", encoding="utf-8").read())
import importlib, sys, os, math
import bpy
ROOT3 = r"C:\Users\mbarbe\dev\Stras3000"
sys.path.insert(0, os.path.join(ROOT3, "tools"))
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

SHEET_DIR = os.path.join(ROOT3, "tools", "blender", "out")
s3k_lib.PATTERNS['pierre'] = [[('#8a7e66' if (y % 4 == 0 or (x + (y // 4) * 3) % 6 == 0) else '#a09478') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['eau_rhin'] = [[('#4a6a7a' if (y % 6 == 0 and x % 5 < 2) else '#2a3e4a') for x in range(16)] for y in range(16)]
STONE, ROOF, CONC, SILO, RED, YEL, GOLD = 'tex:pierre', '#5a3a2e', '#8a8a84', '#b8b8b2', '#8a1a22', '#f0c020', '#ffc040'


def port(b):
    r = b.piv('port_rhin')
    b.part('box', (30, 8, 0.1), (0, -7, -1.0), 'tex:eau_rhin', r)                          # bassin
    b.part('box', (30, 1.2, 1.4), (0, -2.6, -0.3), '#7a7a72', r)                           # mur de quai
    for x in range(-14, 15, 3):
        b.part('box', (0.15, 0.1, 1.2), (x, -3.22, -0.4), '#3a3a34', r)                       # échelles de quai
    b.part('box', (30, 12, 0.1), (0, 4, 0.4), '#6a6a62', r)                                 # terre-plein
    # moulin : tour carrée + nef à arcades
    m = b.piv('moulin', (-7, 3, 0.45), r)
    b.part('box', (3.2, 3.2, 9), (0, 0, 4.5), STONE, m)
    b.part('cone', (4.6, 4.6, 1.6), (0, 0, 9.8), ROOF, m, seg=4, rot=(0, 0, 45))
    b.part('box', (3.4, 3.4, 0.3), (0, 0, 9.0), '#7a6e58', m)
    for z in (2.5, 5.0, 7.3):
        for x in (-0.8, 0.8):
            b.part('box', (0.4, 0.05, 1.0), (x, -1.62, z), '#2a2420', m)                       # fenêtres hautes
    b.part('box', (1.8, 0.05, 2.6), (0, -1.62, 6.0), '#2a2420', m)                            # grande arcade
    nef = b.piv('nef', (-1.5, 3.2, 0.45), r)
    b.part('box', (9, 4.5, 6.5), (0, 0, 3.25), STONE, nef)
    b.part('prism', (9.2, 4.8, 1.0), (0, 0, 7.0), ROOF, nef)
    for x in range(-4, 5, 1):
        b.part('box', (0.7, 0.05, 2.4), (x * 0.95, -2.27, 4.2), '#6e6450', nef)               # arcades aveugles
    # silos + bâtiment rouge à bande jaune
    for i, x in enumerate((6.5, 8.0, 9.5, 11.0)):
        b.part('cyl', (1.5, 1.5, 12), (x, 4.2, 6.4), SILO, r, seg=12)
    b.part('box', (0.3, 0.3, 13.5), (5.6, 3.2, 7.2), '#5a5a5a', r)                            # gaine d'escalier
    b.part('box', (3.2, 3.0, 5.5), (4.2, 2.0, 3.2), RED, r)
    b.part('box', (0.3, 0.06, 5.5), (4.9, 0.48, 3.2), YEL, r)                                  # bande jaune
    # convoyeurs + grue jaune + bloc béton central
    b.part('box', (4.5, 4.0, 4.2), (1.6, 1.5, 2.55), CONC, r)
    b.part('box', (10, 0.5, 0.4), (-1.5, 1.2, 6.4), '#6a6a72', r, rot=(0, 8, 0))               # convoyeur
    b.part('box', (6, 0.4, 0.35), (5.5, 1.0, 6.0), '#6a6a72', r)
    gr = b.piv('grue', (0.6, -0.8, 0.45), r)
    b.part('box', (1.0, 1.0, 3.8), (0, 0, 1.9), YEL, gr)
    b.part('box', (0.25, 0.25, 4.5), (1.4, 0, 4.6), '#a0a0a8', gr, rot=(0, 35, 0))
    b.part('box', (0.03, 0.03, 2.6), (2.7, 0, 5.2), '#222222', gr)
    # tags sur le soubassement (culture populaire du port)
    for x, c in ((-9, '#ff4fa3'), (-5, '#38f2ff'), (1.5, '#ffd23f')):
        b.part('box', (1.6, 0.05, 0.7), (x, 0.92, 1.0), c, r)
    # BlingCo / le Promoteur : bâche « LOFTS » géante, palissade de chantier, préfabriqués empilés sur le quai
    b.part('box', (6.5, 0.08, 2.6), (-1.5, 0.92, 4.6), '#f4f0e8', r)
    b.part('box', (6.0, 0.09, 0.8), (-1.5, 0.91, 5.2), GOLD, r)                                # « BlingCo LOFTS »
    b.part('box', (6.0, 0.09, 0.5), (-1.5, 0.91, 4.2), '#1a1a2a', r)                           # « à partir de 9 999 €/m² »
    for x in range(-12, 13, 2):
        b.part('box', (1.9, 0.08, 1.2), (x, -1.7, 1.05), '#f4f0e8' if (x // 2) % 2 else '#1a1a2a', r)  # palissade
    for k, (x, y, z, c) in enumerate(((9, -1.0, 1.05, '#f2efe6'), (10.4, -1.0, 1.05, '#3a4a6a'), (9.7, -1.0, 2.25, '#a85a3a'))):
        b.part('box', (1.2, 1.2, 1.2), (x, y, z), c, r)
    return r


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


sc = scene("S3K_decor_port_rhin", 1100, 700)
port(B(sc))
sprite_camera(sc, 1100, 5.0, yaw=-15, ppu=32)
p = os.path.join(SHEET_DIR, "decor_port_rhin.png"); render_to(sc, p)
result = {"renders": [p]}
