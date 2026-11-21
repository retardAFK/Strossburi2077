# Validé par Maxime le 21/11/2026 (« top »).
# Sbires du Marché 2000 (2026, la nuit) — choix de Maxime (21/11/2026) : « les deux » = robot-vigile à lampe torche
# (dehors) + chariot-robot de rayon (dans les rayons) ; gag : ils collent des étiquettes de prix x10 sur tout.
# Couleurs « BlingCo Nuit » (violet) comme le Gérant de nuit. Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\vigiles_nuit.py", encoding="utf-8").read())
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
VIO, VIO_D, GOLD, DARK, STEEL, RED, WHITE, BEAM = '#5a2a9a', '#3a1a6a', '#ffc040', '#14141c', '#9aa3b8', '#ff1a3c', '#ffffff', '#fff2a0'


def etiquette(b, parent, loc, rot=(0, 0, 0), k=1.0):
    e = b.piv('etiquette', loc, parent)
    e.rotation_euler = [math.radians(a) for a in rot]
    e.scale = (k, k, k)
    b.part('box', (0.02, 0.18, 0.1), (0, 0, 0), WHITE, e)
    b.part('box', (0.025, 0.14, 0.04), (0.003, 0, 0.01), RED, e)                                 # « x10 »
    return e


def vigile(b, pose=None):
    """Robot-vigile à tête-projecteur (pivot `lampe`, origine du faisceau) et étiqueteuse au poing."""
    pose = pose or {}
    root = b.piv('root')
    pel = b.piv('pelvis', (0, 0, 0.92), root)
    for side, y in (('N', -0.14), ('F', 0.14)):
        h = b.piv('hip' + side, (0, y, 0), pel)
        b.part('rbox', (0.2, 0.2, 0.46), (0, 0, -0.23), VIO_D, h)
        k = b.piv('knee' + side, (0, 0, -0.46), h)
        b.part('rbox', (0.18, 0.18, 0.42), (0, 0, -0.21), DARK, k)
        b.part('rbox', (0.32, 0.2, 0.1), (0.05, 0, -0.44), DARK, k)
    tor = b.piv('torso', (0, 0, 0.05), pel)
    b.part('rbox', (0.44, 0.58, 0.6), (0, 0, 0.32), VIO, tor, r2=0.3)
    b.part('box', (0.02, 0.3, 0.12), (0.225, 0, 0.42), GOLD, tor)                                # badge « SÉCURITÉ NUIT »
    b.part('box', (0.46, 0.6, 0.06), (0, 0, 0.1), DARK, tor)                                     # ceinturon
    for k in range(4):
        etiquette(b, tor, (0.0, -0.25 + k * 0.16, 0.08), rot=(0, 0, 0), k=0.6)                    # rouleau d'étiquettes à la ceinture
    hd = b.piv('head', (0, 0, 0.68), tor)
    b.part('cyl', (0.34, 0.34, 0.3), (0, 0, 0.15), DARK, hd, seg=10)
    b.part('cyl', (0.26, 0.26, 0.06), (0.15, 0, 0.16), BEAM, hd, rot=(0, 90, 0), seg=10)         # projecteur allumé
    b.piv('lampe', (0.2, 0, 0.16), hd)
    b.part('sph', (0.06, 0.06, 0.06), (0, 0, 0.34), RED, hd, seg=6)
    for side, y in (('N', -0.36), ('F', 0.36)):
        sh = b.piv('sh' + side, (0, y, 0.52), tor)
        sh.rotation_euler = (0, math.radians(pose.get('sh' + side, 0)), 0)
        b.part('rbox', (0.15, 0.15, 0.36), (0, 0, -0.18), VIO_D, sh)
        el = b.piv('el' + side, (0, 0, -0.36), sh)
        b.part('rbox', (0.13, 0.13, 0.3), (0, 0, -0.15), DARK, el)
        hn = b.piv('hand' + side, (0, 0, -0.32), el)
        b.part('sph', (0.12, 0.12, 0.12), (0, 0, 0), STEEL, hn, seg=6)
        if side == 'N':
            b.part('rbox', (0.22, 0.1, 0.14), (0.08, 0, 0.0), '#ff7a1a', hn)                       # étiqueteuse
            etiquette(b, hn, (0.21, 0, 0.0), k=0.7)
    return root


def chariot(b):
    """Chariot-robot de rayon : caddie motorisé, bras articulé + étiqueteuse, scanner rouge, gyrophare violet."""
    root = b.piv('chariot')
    b.part('box', (0.9, 0.55, 0.06), (0, 0, 0.18), STEEL, root)
    for x, y in ((0.35, 0.22), (0.35, -0.22), (-0.35, 0.22), (-0.35, -0.22)):
        b.part('cyl', (0.12, 0.12, 0.06), (x, y, 0.08), DARK, root, rot=(90, 0, 0), seg=8)       # roues
    basket = b.piv('panier', (0, 0, 0.5), root)
    b.part('box', (0.85, 0.5, 0.04), (0, 0, -0.2), '#c8ccd8', basket)
    for y in (-0.25, 0.25):
        b.part('box', (0.85, 0.02, 0.45), (0, y, 0.02), '#c8ccd8', basket)
    for x in (-0.42, 0.42):
        b.part('box', (0.02, 0.5, 0.45), (x, 0, 0.02), '#c8ccd8', basket)
    for x in range(-3, 4):
        b.part('box', (0.015, 0.52, 0.45), (x * 0.11, 0, 0.02), '#a8acb8', basket)               # grille
    b.part('box', (0.5, 0.4, 0.25), (0, 0, 0.0), VIO, basket)                                    # « moteur » dans le panier
    b.part('box', (0.02, 0.3, 0.1), (0.255, 0, 0.05), GOLD, basket)
    b.part('cyl', (0.03, 0.03, 0.5), (-0.5, 0, 0.6), STEEL, root, seg=6)                         # poignée-mât
    b.part('box', (0.04, 0.55, 0.05), (-0.5, 0, 0.85), RED, root)
    b.part('sph', (0.1, 0.1, 0.1), (-0.5, 0, 1.0), '#a98bff', root, seg=6)                       # gyrophare violet
    arm = b.piv('bras', (0.3, 0.2, 0.75), root)
    b.part('box', (0.06, 0.06, 0.4), (0.08, 0, 0.18), STEEL, arm, rot=(0, 30, 0))
    b.part('box', (0.06, 0.06, 0.35), (0.3, 0, 0.32), STEEL, arm, rot=(0, 75, 0))
    b.part('rbox', (0.2, 0.09, 0.12), (0.5, 0, 0.36), '#ff7a1a', arm)
    etiquette(b, arm, (0.62, 0, 0.36), k=0.7)
    b.part('box', (0.04, 0.2, 0.06), (0.47, -0.2, 0.32), RED, root)                              # scanner avant
    b.piv('scanner', (0.5, -0.2, 0.32), root)
    return root


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_vigiles", 980, 480)
bb = B(sc)
v = vigile(bb, dict(shN=-60)); v.location = (0, -1.0, 0)
c = chariot(bb); c.location = (0.2, 1.0, 0)
# le gag : étiquettes x10 collées partout (sur un pigeon-carton, une bouteille d'eau, un panneau)
etiquette(bb, None, (0.9, -0.2, 0.5), rot=(0, 0, 30), k=1.4)
bb.part('cyl', (0.14, 0.14, 0.4), (1.1, -0.6, 0.2), '#38a8ff', None, seg=8)                       # bouteille d'eau
etiquette(bb, None, (1.18, -0.6, 0.25), k=0.8)
for label, yaw in (('trois_quarts', 35), ('face', 90)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 980, 0.8, yaw=yaw, ppu=170)
    p = os.path.join(SHEET_DIR, f"vigiles_{label}.png"); render_to(sc, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    out = []
    for name, fn in (("vigile_nuit", vigile), ("chariot_robot", chariot), ("etiquette_x10", lambda b: etiquette(b, None, (0, 0, 0)))):
        s = scene("S3K_exp_" + name, 64, 64)
        fn(B(s))
        win = bpy.context.window; prev = win.scene; win.scene = s
        try:
            bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, name + ".glb"), export_format='GLB',
                                      use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
        finally:
            win.scene = prev
        out.append(name)
    result["glb"] = out
