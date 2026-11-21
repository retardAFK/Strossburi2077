# Validé par Maxime le 21/11/2026 (« parfait »).
# Sbire niveau 2 (Meinau 2026) : le Robot-Steward BlingCo. Choix de Maxime (21/11/2026) : robot, or et noir
# BlingCo, gag = le scanner de billets (il scanne tout, même les pigeons). Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\steward_robot.py", encoding="utf-8").read())
# Pivots standards (CLAUDE.md §6) : root, pelvis, torso, head, hipN/F, kneeN/F, shN/F, elN/F, handN/F ; regarde vers +X.
# Pivot en plus : scanner (bout du scanner, origine du rayon).
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
BLACK, BLACK_L, GOLD, GOLD_D, RED, STEEL = '#16161c', '#2a2a34', '#ffc040', '#c8901a', '#ff1a3c', '#8a90a0'


def build_steward(b, pose=None):
    pose = pose or {}
    root = b.piv('root')
    hip_h = 0.95
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    for side, y in (('N', -0.14), ('F', 0.14)):
        h = b.piv('hip' + side, (0, y, 0), pel)
        h.rotation_euler = (0, math.radians(pose.get('hip' + side, 0)), 0)
        b.part('rbox', (0.2, 0.2, 0.48), (0, 0, -0.24), BLACK_L, h)
        k = b.piv('knee' + side, (0, 0, -0.48), h)
        b.part('rbox', (0.18, 0.18, 0.44), (0, 0, -0.22), BLACK, k)
        b.part('rbox', (0.34, 0.2, 0.1), (0.06, 0, -0.46), GOLD_D, k)                       # semelles dorées
    tor = b.piv('torso', (0, 0, 0.05), pel)
    b.part('rbox', (0.42, 0.56, 0.62), (0, 0, 0.33), BLACK, tor, r2=0.3)
    # chasuble dorée « STEWARD » par-dessus (devant + dos), bandes noires
    b.part('box', (0.45, 0.5, 0.5), (0, 0, 0.35), GOLD, tor)
    b.part('box', (0.46, 0.51, 0.06), (0, 0, 0.42), BLACK, tor)
    b.part('box', (0.02, 0.36, 0.1), (0.235, 0, 0.25), BLACK, tor)                         # inscription « STEWARD »
    b.part('box', (0.03, 0.12, 0.12), (0.24, -0.15, 0.55), RED, tor)                        # voyant de statut
    # tête-casque noir, visière-scanner or
    hd = b.piv('head', (0, 0, 0.72), tor)
    b.part('rbox', (0.3, 0.3, 0.3), (0, 0, 0.14), BLACK_L, hd, r2=0.45)
    b.part('box', (0.04, 0.26, 0.08), (0.15, 0, 0.16), GOLD, hd)                            # visière dorée
    b.part('box', (0.045, 0.06, 0.05), (0.16, 0.06, 0.16), RED, hd)                         # œil qui balaie
    b.part('cyl', (0.03, 0.03, 0.14), (0, 0.1, 0.34), STEEL, hd, seg=6)                     # antenne
    b.part('sph', (0.05, 0.05, 0.05), (0, 0.1, 0.42), RED, hd, seg=6)
    # bras : droit (N) tient le SCANNER DE BILLETS tendu, gauche (F) le long du corps
    for side, y in (('N', -0.34), ('F', 0.34)):
        sh = b.piv('sh' + side, (0, y, 0.55), tor)
        sh.rotation_euler = (0, math.radians(pose.get('sh' + side, 0)), 0)
        b.part('rbox', (0.15, 0.15, 0.36), (0, 0, -0.18), BLACK_L, sh)
        el = b.piv('el' + side, (0, 0, -0.36), sh)
        el.rotation_euler = (0, math.radians(pose.get('el' + side, 0)), 0)
        b.part('rbox', (0.13, 0.13, 0.32), (0, 0, -0.16), BLACK, el)
        hn = b.piv('hand' + side, (0, 0, -0.34), el)
        b.part('sph', (0.12, 0.12, 0.12), (0, 0, 0), GOLD_D, hn, seg=6)
        if side == 'N':
            sc = b.piv('scanner_gun', (0.06, 0, -0.02), hn)
            b.part('rbox', (0.1, 0.08, 0.16), (0, 0, -0.06), BLACK, sc)                        # poignée
            b.part('rbox', (0.24, 0.1, 0.1), (0.1, 0, 0.02), GOLD, sc)                          # corps du scanner
            b.part('box', (0.02, 0.08, 0.05), (0.225, 0, 0.02), RED, sc)                        # fenêtre laser
            b.piv('scanner', (0.24, 0, 0.02), sc)
    return root


def pigeon(b, loc):
    p = b.piv('pigeon', loc)
    b.part('rbox', (0.22, 0.14, 0.14), (0, 0, 0.12), '#8a8a96', p)
    b.part('sph', (0.09, 0.09, 0.09), (0.12, 0, 0.22), '#6a6a78', p, seg=6)
    b.part('cone', (0.03, 0.03, 0.05), (0.18, 0, 0.21), '#e8a030', p, rot=(0, 90, 0), seg=4)
    b.part('box', (0.02, 0.02, 0.06), (0, 0.03, 0.03), '#e8a030', p)
    b.part('box', (0.02, 0.02, 0.06), (0, -0.03, 0.03), '#e8a030', p)
    b.part('box', (0.12, 0.02, 0.08), (0.02, 0, 0.13), '#ffffff', p)                        # « billet » scotché dessus
    return p


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


GAG = dict(shN=-45, elN=-10, hipN=10, hipF=-8)   # bras tendu : il scanne le pigeon
renders = []
sc = scene("S3K_steward", 440, 440)
build_steward(B(sc))
for label, yaw in (('trois_quarts', 35), ('face', 90), ('profil', 0)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 440, 1.0, yaw=yaw, ppu=190)
    p = os.path.join(SHEET_DIR, f"steward_{label}.png"); render_to(sc, p); renders.append(p)
sc2 = scene("S3K_steward_gag", 640, 440)
bb = B(sc2)
build_steward(bb, GAG)
pigeon(bb, (0.95, -0.34, 0))
bb.part('box', (0.02, 0.02, 0.5), (0.8, -0.34, 0.45), RED, None, rot=(0, -25, 0))          # rayon vers le pigeon
before = set(sc2.objects)
win = bpy.context.window; prev = win.scene; win.scene = sc2
try:
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODEL_DIR, "ultra.glb"))
finally:
    win.scene = prev
for o in sc2.objects:
    if o not in before and o.parent is None:
        o.location = (-0.6, 1.9, 0)                                                         # l'Ultra à côté, pour l'échelle
sprite_camera(sc2, 640, 1.05, yaw=50, ppu=150)
p = os.path.join(SHEET_DIR, "steward_gag.png"); render_to(sc2, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    s = scene("S3K_exp_steward", 64, 64)
    build_steward(B(s))
    win = bpy.context.window; prev = win.scene; win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, "steward_robot.glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    result["glb"] = "steward_robot.glb"
