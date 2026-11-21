# Flèches de l'Arc-Drapeau (un look par type) + la banane qui les range. Exécuter dans Blender :
# Validé par Maxime le 21/11/2026 (« top ») : torche de stade, fumigène bleu, banane portée devant à la taille, tag bleu et blanc.
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\fleches.py", encoding="utf-8").read())
# Étape VALIDATION : planche tools/blender/out/fleches.png et banane.png.
# EXPORT = True après validation : assets/models/fleche_<type>.glb et banane.glb
# Notes de Maxime : enflammée « en mode torche de stade », fumigène « couleur bleu ».
# Pivots : root (encoche, arrière de la flèche), tip (pointe). La flèche pointe vers +X.
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
BLUE, WHITE, STEEL, SHAFT, DARK = '#1f5fd0', '#f4f6ff', '#c8ccd8', '#d8d2c4', '#1a1a22'
L = 0.72  # longueur du fût


def shaft(b, root, fletch=(BLUE, WHITE), big=False):
    b.part('box', (L, 0.018, 0.018), (L / 2, 0, 0), SHAFT, root)
    w = 0.09 if big else 0.06
    h = 0.07 if big else 0.045
    b.part('box', (0.13, 0.006, h), (0.08, 0, h / 2 + 0.008), fletch[0], root)
    b.part('box', (0.13, 0.006, h), (0.08, 0, -h / 2 - 0.008), fletch[1], root)
    b.part('box', (0.13, w * 0.6, 0.006), (0.08, w * 0.3 + 0.008, 0), fletch[0], root)
    b.part('box', (0.02, 0.03, 0.03), (0.0, 0, 0), DARK, root)  # encoche
    b.piv('tip', (L + 0.1, 0, 0), root)


def point(b, root, col=STEEL):
    b.part('cone', (0.055, 0.055, 0.1), (L + 0.05, 0, 0), col, root, rot=(0, 90, 0), seg=4)


def banniere(b, o):
    r = b.piv('fleche_banniere', o)
    shaft(b, r, big=True)
    # mini drapeau bleu-blanc-bleu à l'arrière
    for k, (z, c) in enumerate(((0.07, BLUE), (0.0, WHITE), (-0.07, BLUE))):
        b.part('box', (0.2, 0.006, 0.07), (0.24, 0.02, z), c, r)
    point(b, r)
    return r


def fumigene(b, o):
    r = b.piv('fleche_fumigene', o)
    shaft(b, r)
    b.part('cyl', (0.06, 0.06, 0.16), (L, 0, 0), '#6a6f7a', r, rot=(0, 90, 0), seg=8)
    b.part('cyl', (0.064, 0.064, 0.04), (L, 0, 0), BLUE, r, rot=(0, 90, 0), seg=8)
    for i, (dx, dz, s) in enumerate(((0.1, 0.03, 0.05), (0.16, 0.07, 0.065), (0.23, 0.1, 0.08))):
        b.part('sph', (s, s, s), (L + dx, 0, dz), '#5a9cff' if i % 2 else '#8fc0ff', r, seg=6)
    b.piv('smoke', (L + 0.1, 0, 0), r)
    return r


def torche(b, o):
    """Flèche enflammée façon torche de stade : bâton rouge + flamme rouge vif à cœur blanc."""
    r = b.piv('fleche_enflammee', o)
    shaft(b, r)
    b.part('cyl', (0.05, 0.05, 0.2), (L - 0.02, 0, 0), '#d01a2a', r, rot=(0, 90, 0), seg=8)
    b.part('cyl', (0.054, 0.054, 0.03), (L - 0.1, 0, 0), WHITE, r, rot=(0, 90, 0), seg=8)
    # flamme de torche : boule rouge vif, cœur orange puis blanc, côté caméra (y négatif) pour rester lisible
    for dx, dz, sz, c, dy in ((0.1, 0.03, 0.15, '#ff1a2a', 0.0), (0.2, 0.06, 0.1, '#ff1a2a', 0.0),
                              (0.08, 0.02, 0.1, '#ff7a1a', -0.05), (0.15, 0.05, 0.06, '#ff7a1a', -0.05),
                              (0.06, 0.015, 0.05, '#fff4e0', -0.09)):
        b.part('sph', (sz, sz, sz), (L + dx, dy, dz), c, r, seg=6)
    for dx, dz in ((0.3, 0.07), (0.36, -0.03), (0.26, 0.1)):
        b.part('box', (0.015, 0.015, 0.015), (L + dx, 0, dz), '#ffd23f', r)  # étincelles
    b.piv('flame', (L + 0.12, 0, 0), r)
    return r


def tag(b, o):
    r = b.piv('fleche_tag', o)
    shaft(b, r, fletch=(BLUE, WHITE))
    b.part('cyl', (0.07, 0.07, 0.16), (L + 0.02, 0, 0), BLUE, r, rot=(0, 90, 0), seg=8)
    b.part('cyl', (0.05, 0.05, 0.04), (L + 0.12, 0, 0), WHITE, r, rot=(0, 90, 0), seg=8)
    b.part('box', (0.02, 0.015, 0.015), (L + 0.15, 0, 0.02), DARK, r)
    return r


def court_circuit(b, o):
    r = b.piv('fleche_court_circuit', o)
    shaft(b, r, fletch=('#ffd23f', DARK))
    b.part('rbox', (0.09, 0.08, 0.08), (L + 0.02, 0, 0), '#ffd23f', r)
    b.part('box', (0.07, 0.012, 0.012), (L + 0.1, 0, 0.022), STEEL, r)
    b.part('box', (0.07, 0.012, 0.012), (L + 0.1, 0, -0.022), STEEL, r)
    pts = [(0.15, 0.05), (0.19, 0.0), (0.17, 0.0), (0.22, -0.06)]
    for i in range(3):
        (x0, z0), (x1, z1) = pts[i], pts[i + 1]
        dx, dz = x1 - x0, z1 - z0
        b.part('box', (0.015, 0.015, math.hypot(dx, dz) + 0.01), (L + (x0 + x1) / 2, 0, (z0 + z1) / 2), '#38f2ff', r,
               rot=(0, math.degrees(math.atan2(dx, dz)), 0))
    return r


TYPES = [('banniere', banniere), ('fumigene', fumigene), ('enflammee', torche), ('tag', tag), ('court_circuit', court_circuit)]


def banane(b, o, with_arrows=True):
    """Banane de supporter noire, fermeture bleue, flèches qui dépassent. Se porte à la taille (pivot 'pelvis')."""
    r = b.piv('banane', o)
    b.part('rbox', (0.16, 0.42, 0.17), (0, 0, 0), DARK, r, r2=0.4)
    b.part('box', (0.02, 0.36, 0.025), (0.08, 0, 0.04), BLUE, r)
    b.part('box', (0.03, 0.02, 0.04), (0.09, 0.12, 0.04), STEEL, r)
    b.part('box', (0.17, 0.43, 0.03), (0, 0, -0.06), '#2a2a34', r)
    b.part('box', (0.04, 0.9, 0.035), (-0.02, 0, 0.0), '#2a2a34', r)  # sangle
    if with_arrows:
        cols = [BLUE, '#5a9cff', '#d01a2a', WHITE, '#ffd23f']
        for i, c in enumerate(cols):
            y = -0.14 + i * 0.07
            b.part('box', (0.015, 0.015, 0.14), (-0.02, y, 0.13), SHAFT, r, rot=(0, -15, 0))
            b.part('box', (0.006, 0.04, 0.05), (-0.04, y, 0.2), c, r, rot=(0, -15, 0))
    return r


def new_scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = new_scene("S3K_fleches", 1100, 1000)
b = B(sc)
for i, (n, fn) in enumerate(TYPES):
    fn(b, (-0.52, 0, 0.4 - i * 0.2))
sprite_camera(sc, 1100, 0.0, yaw=0, ppu=1000)
p = os.path.join(SHEET_DIR, "fleches.png"); render_to(sc, p); renders.append(p)

sc2 = new_scene("S3K_banane", 600, 600)
banane(B(sc2), (0, 0, 0))
sprite_camera(sc2, 600, 0.05, yaw=55, ppu=900)
p = os.path.join(SHEET_DIR, "banane.png"); render_to(sc2, p); renders.append(p)

sc3 = new_scene("S3K_banane_ultra", 520, 520)
win = bpy.context.window; prev = win.scene; win.scene = sc3
try:
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODEL_DIR, "ultra.glb"))
finally:
    win.scene = prev
bn = banane(B(sc3), (0.3, 0.0, 0.98))  # devant, à la taille
sprite_camera(sc3, 520, 1.0, yaw=40, ppu=200)
p = os.path.join(SHEET_DIR, "banane_ultra.png"); render_to(sc3, p); renders.append(p)
result = {"renders": renders}


def export(name, fn):
    s = new_scene("S3K_exp_" + name, 64, 64)
    fn(B(s), (0, 0, 0))
    win = bpy.context.window; prev = win.scene; win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, name + ".glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    return name


if EXPORT:
    result["glb"] = [export('fleche_' + n, fn) for n, fn in TYPES] + [export('banane', banane)]
