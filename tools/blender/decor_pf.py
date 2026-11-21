# Niveau 1 (Petite France 2077) : kit de décor modulaire. Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\decor_pf.py", encoding="utf-8").read())
# Étape VALIDATION : rend une vignette de rue (tools/blender/out/decor_pf_rue.png) avec les pièces du kit.
# EXPORT = True après validation : une pièce = un .glb (pf_maison_a, pf_maison_b, pf_quai, pf_lampadaire...).
import importlib, sys, os, math
import bpy
ROOT3 = r"C:\Users\mbarbe\dev\Stras3000"
sys.path.insert(0, os.path.join(ROOT3, "tools"))
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

EXPORT = True
SHEET_DIR = os.path.join(ROOT3, "tools", "blender", "out")
MODEL_DIR = os.path.join(ROOT3, "assets", "models")

s3k_lib.PATTERNS['paves'] = [[('#3a3448' if (x % 4 == 0 or (y % 4 == 0 and (x // 4 + y // 4) % 2 == 0)) else '#5a5268') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['tuiles'] = [[('#6a2a22' if (y % 3 == 0 or (x + (y // 3) * 2) % 4 == 0) else '#9a4030') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['gres'] = [[('#a85a54' if (y % 5 == 0 or (x + (y // 5) * 4) % 8 == 0) else '#c87a6a') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['eau'] = [[('#38f2ff' if (y % 7 == 0 and x % 5 < 2) else '#0c2238') for x in range(16)] for y in range(16)]

BOIS, GLASS, CYAN, PINK, GOLD, RED = '#4a2a18', '#1a2a48', '#38f2ff', '#ff2e88', '#ffc040', '#ff1a3c'
FLOOR_H = 2.2


def window(b, parent, y, z, w=0.8, h=1.0, glow=CYAN):
    """Fenêtre à petits carreaux, volets, jardinière de géraniums en plastique lumineux."""
    b.part('box', (0.06, w, h), (0.02, y, z), GLASS, parent)
    b.part('box', (0.07, w, 0.05), (0.03, y, z), BOIS, parent)                                 # croisillon
    b.part('box', (0.07, 0.05, h), (0.03, y, z), BOIS, parent)
    b.part('box', (0.065, w * 0.8, h * 0.15), (0.025, y, z - h * 0.3), glow, parent)            # lueur intérieure
    for sg in (-1, 1):
        b.part('box', (0.05, w * 0.42, h), (0.04, y + sg * (w * 0.72), z), '#2a5a4a', parent)   # volets verts
    b.part('box', (0.22, w + 0.1, 0.16), (0.12, y, z - h / 2 - 0.1), '#3a2a1a', parent)        # jardinière
    for i in range(4):
        b.part('sph', (0.16, 0.16, 0.16), (0.16, y - w / 2 + 0.12 + i * (w - 0.24) / 3, z - h / 2 + 0.02),
               PINK if i % 2 else RED, parent, seg=6)


def timbers(b, parent, w, z0, h, pattern):
    """Colombages d'un étage (façade dans le plan YZ, face +X). pattern : 'croix' | 'losange' | 'k'."""
    for z in (z0 + 0.05, z0 + h - 0.05):
        b.part('box', (0.08, w, 0.12), (0.04, 0, z), BOIS, parent)                              # sablières
    n = 4
    for i in range(n + 1):
        y = -w / 2 + i * w / n
        b.part('box', (0.08, 0.12, h), (0.04, y, z0 + h / 2), BOIS, parent)                     # poteaux
    zc = z0 + h / 2
    for i in range(n):
        yc = -w / 2 + (i + 0.5) * w / n
        if pattern == 'croix' and i in (0, n - 1):
            for sg in (-1, 1):
                b.part('box', (0.07, 0.1, h * 1.05), (0.045, yc, zc), BOIS, parent, rot=(sg * 28, 0, 0))
        elif pattern == 'losange' and i in (0, n - 1):
            for sg in (-1, 1):
                b.part('box', (0.07, 0.08, h * 0.55), (0.045, yc - 0.15, zc + sg * h * 0.2), BOIS, parent, rot=(sg * 30, 0, 0))
                b.part('box', (0.07, 0.08, h * 0.55), (0.045, yc + 0.15, zc + sg * h * 0.2), BOIS, parent, rot=(-sg * 30, 0, 0))
        elif pattern == 'k' and i in (0, n - 1):
            b.part('box', (0.07, 0.1, h * 0.6), (0.045, yc, zc + h * 0.15), BOIS, parent, rot=(35, 0, 0))


def holo_sign(b, parent, loc, w, h, col, col2=GOLD):
    """Enseigne holographique (remplace le fer forgé) : potence + panneau lumineux à lignes de « texte »."""
    b.part('box', (0.6, 0.05, 0.05), (loc[0] - 0.3, loc[1], loc[2] + h / 2 + 0.05), '#2a2d40', parent)
    b.part('box', (0.05, w, h), loc, col, parent)
    for i in range(2):
        b.part('box', (0.06, w * (0.75 - i * 0.2), 0.06), (loc[0], loc[1], loc[2] + 0.12 - i * 0.22), col2, parent)


def build_maison(b, origin, w, floors, enduit, pattern, sign=None, cage=False, name='maison'):
    """Maison à colombages : RDC en grès + étages en encorbellement + toit pentu. Façade vers +X."""
    root = b.piv(name, origin)
    d = 4.0
    # rez-de-chaussée en grès rose : vitrine BlingCo
    b.part('box', (d, w, FLOOR_H), (-d / 2, 0, FLOOR_H / 2), 'tex:gres', root)
    b.part('box', (0.06, w * 0.55, 1.3), (0.02, -w * 0.15, 1.0), GLASS, root)                  # vitrine
    b.part('box', (0.07, w * 0.55, 0.12), (0.03, -w * 0.15, 1.7), PINK, root)                  # bandeau néon
    b.part('box', (0.07, 0.8, 1.8), (0.02, w * 0.3, 0.9), '#2a1a12', root)                     # porte
    b.part('box', (0.08, 0.5, 0.25), (0.04, w * 0.3, 2.0), GOLD, root)                          # prix holo au-dessus
    # étages en encorbellement
    for f in range(floors):
        z0 = FLOOR_H + f * FLOOR_H
        off = 0.18 * (f + 1)
        fl = b.piv('%s_etage%d' % (name, f), (off, 0, 0), root)
        b.part('box', (d, w, FLOOR_H), (-d / 2, 0, z0 + FLOOR_H / 2), enduit, fl)
        timbers(b, fl, w, z0, FLOOR_H, pattern)
        for y in (-w * 0.27, w * 0.27):
            window(b, fl, y, z0 + FLOOR_H * 0.55)
    # toit pentu, pignon sur rue, avec lucarnes
    zt = FLOOR_H * (floors + 1)
    off = 0.18 * floors
    b.part('prism', (d + 0.6, w + 0.4, 3.6), (off - d / 2, 0, zt + 1.8), 'tex:tuiles', root)
    b.part('box', (0.1, w * 0.5, 1.6), (off + 0.08, 0, zt + 0.9), enduit, root)                # pignon
    b.part('box', (0.08, 0.5, 0.7), (off + 0.14, 0, zt + 0.8), GLASS, root)
    b.part('box', (0.09, 0.4, 0.15), (off + 0.15, 0, zt + 0.7), CYAN, root)
    b.part('box', (0.3, 0.3, 0.6), (off - d / 2, w / 2 - 0.4, zt + 3.4), '#3a3f52', root)       # antenne-relais sur cheminée
    b.part('sph', (0.12, 0.12, 0.12), (off - d / 2, w / 2 - 0.4, zt + 3.8), RED, root, seg=6)
    if sign:
        holo_sign(b, root, (0.9, -w / 2 + 0.3, FLOOR_H + 0.9), 0.9, 0.7, sign)
    if cage:
        # « Patrimoine sous licence » : cage de protection néon autour de la façade
        hz = zt + 3.8
        for y in (-w / 2 - 0.3, w / 2 + 0.3):
            b.part('box', (0.08, 0.08, hz), (off + 0.6, y, hz / 2), CYAN, root)
        b.part('box', (0.08, w + 0.68, 0.08), (off + 0.6, 0, hz), CYAN, root)
        for z in (FLOOR_H, hz * 0.6):
            b.part('box', (0.04, w + 0.6, 0.04), (off + 0.6, 0, z), CYAN, root)
        b.part('box', (0.06, 1.4, 0.35), (off + 0.62, 0, hz - 0.4), '#101018', root)            # plaque de licence
        b.part('box', (0.07, 1.2, 0.08), (off + 0.63, 0, hz - 0.4), GOLD, root)
    return root


def build_quai(b, origin, length):
    """Quai pavé avec bande de guidage lumineuse, rambarde et eau de l'Ill."""
    root = b.piv('quai', origin)
    b.part('box', (4.0, length, 0.3), (2.0, 0, -0.15), 'tex:paves', root)
    b.part('box', (0.25, length, 0.02), (1.2, 0, 0.01), CYAN, root)                             # bande de guidage
    for i in range(int(length // 2)):
        b.part('box', (0.3, 0.25, 0.02), (2.4, -length / 2 + 1 + i * 2, 0.01), GOLD, root)     # flèches touristes
    for i in range(int(length // 1.5) + 1):                                                     # rambarde
        b.part('box', (0.08, 0.08, 1.0), (3.9, -length / 2 + i * 1.5, 0.5), '#2a2d40', root)
    b.part('box', (0.06, length, 0.06), (3.9, 0, 1.0), PINK, root)                              # main courante néon
    b.part('box', (0.6, length, 1.4), (4.3, 0, -0.7), 'tex:gres', root)                          # mur de quai
    b.part('box', (8.0, length, 0.1), (8.6, 0, -1.3), 'tex:eau', root)                           # l'Ill
    return root


def build_lampadaire(b, origin):
    root = b.piv('lampadaire', origin)
    b.part('cyl', (0.12, 0.12, 3.2), (0, 0, 1.6), '#2a2d40', root, seg=6)
    b.part('box', (0.7, 0.06, 0.06), (0.3, 0, 3.15), '#2a2d40', root)
    b.part('rbox', (0.3, 0.3, 0.45), (0.6, 0, 2.85), '#1a1c2c', root)                            # lanterne ancienne…
    b.part('box', (0.32, 0.32, 0.3), (0.6, 0, 2.85), CYAN, root)                                 # …à lumière holo
    b.part('rbox', (0.5, 0.06, 0.35), (0, 0.1, 2.1), '#101018', root)                            # écran pub
    b.part('box', (0.45, 0.07, 0.28), (0, 0.11, 2.1), PINK, root)
    return root


def build_compteur(b, origin):
    """Compteur de stationnement… pour regarder l'Ill (« Vue sur l'eau : 2 € / min »)."""
    root = b.piv('compteur', origin)
    b.part('cyl', (0.1, 0.1, 1.0), (0, 0, 0.5), '#9aa3b8', root, seg=6)
    b.part('rbox', (0.25, 0.35, 0.45), (0, 0, 1.2), '#2a2d40', root)
    b.part('box', (0.06, 0.26, 0.16), (0.13, 0, 1.28), GOLD, root)
    b.part('sph', (0.08, 0.08, 0.08), (0, 0, 1.5), RED, root, seg=6)
    return root


renders = []
for old in [x for x in bpy.data.scenes if x.name.startswith("S3K_decor_pf")]:
    bpy.data.scenes.remove(old)
sc = setup_scene("S3K_decor_pf", 1100, 700, style='funk')
b = B(sc)
build_quai(b, (0, 0, 0), 22)
build_maison(b, (0, -7, 0), 5.2, 2, '#f0e0b0', 'croix', sign=PINK, name='maison_a')
build_maison(b, (0, -1.5, 0), 4.6, 3, '#e8b8a8', 'losange', cage=True, name='maison_b')
build_maison(b, (0, 4, 0), 5.0, 2, '#f6f2e6', 'k', sign=CYAN, name='maison_c')
build_lampadaire(b, (2.0, -4.3, 0))
build_lampadaire(b, (2.0, 7.5, 0))
build_compteur(b, (3.3, 1.4, 0))
build_compteur(b, (3.3, 2.4, 0))
sprite_camera(sc, 1100, 6.5, yaw=35, ppu=40)
p = os.path.join(SHEET_DIR, "decor_pf_rue.png")
render_to(sc, p)
renders.append(p)
result = {"renders": renders}


def export_piece(name, fn):
    """Une pièce du kit = une scène isolée à l'origine = un .glb."""
    for old in [x for x in bpy.data.scenes if x.name == "S3K_" + name]:
        bpy.data.scenes.remove(old)
    s = setup_scene("S3K_" + name, 64, 64, style='funk')
    fn(B(s))
    win = bpy.context.window
    prev = win.scene
    win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, name + ".glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    return name


if EXPORT:
    result["glb"] = [
        export_piece('pf_maison_a', lambda b: build_maison(b, (0, 0, 0), 5.2, 2, '#f0e0b0', 'croix', sign=PINK, name='maison_a')),
        export_piece('pf_maison_b', lambda b: build_maison(b, (0, 0, 0), 4.6, 3, '#e8b8a8', 'losange', name='maison_b')),
        export_piece('pf_maison_b_licence', lambda b: build_maison(b, (0, 0, 0), 4.6, 3, '#e8b8a8', 'losange', cage=True, name='maison_bl')),
        export_piece('pf_maison_c', lambda b: build_maison(b, (0, 0, 0), 5.0, 2, '#f6f2e6', 'k', sign=CYAN, name='maison_c')),
        export_piece('pf_quai', lambda b: build_quai(b, (0, 0, 0), 12)),
        export_piece('pf_lampadaire', lambda b: build_lampadaire(b, (0, 0, 0))),
        export_piece('pf_compteur', lambda b: build_compteur(b, (0, 0, 0))),
    ]
