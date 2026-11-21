# Validé par Maxime le 21/11/2026 (« parfait »).
# Sbire niveau 3 (Port du Rhin 2026) : l'Agent immobilier-clone, mini-copie du Promoteur (start-up boy).
# Choix de Maxime (21/11/2026) : « agents immobiliers-clones » ; gag = ils posent des pancartes VENDU partout
# (même sur les mouettes et sur l'Ultra). Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\agent_immo.py", encoding="utf-8").read())
# Pivots standards (CLAUDE.md §6) + `pancarte` (main gauche, la pancarte qu'il plante). Regarde vers +X.
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
SUIT, VEST, SKIN, RED, WHITE, GOLD, DARK = '#5a6a8a', '#1c2a4a', '#e8b48c', '#e8303a', '#ffffff', '#ffc040', '#14141c'


def pancarte(b, parent, loc, k=1.0, rot=(0, 0, 0)):
    p = b.piv('pancarte', loc, parent)
    p.rotation_euler = [math.radians(a) for a in rot]
    p.scale = (k, k, k)
    b.part('box', (0.03, 0.03, 0.55), (0, 0, 0.27), '#c98b52', p)
    b.part('box', (0.03, 0.34, 0.22), (0.02, 0, 0.6), WHITE, p)
    b.part('box', (0.035, 0.3, 0.08), (0.025, 0, 0.6), RED, p)                                 # « VENDU »
    return p


def build_agent(b, pose=None):
    pose = pose or {}
    root = b.piv('root')
    pel = b.piv('pelvis', (0, 0, 0.88), root)
    for side, y in (('N', -0.12), ('F', 0.12)):
        h = b.piv('hip' + side, (0, y, 0), pel)
        h.rotation_euler = (0, math.radians(pose.get('hip' + side, 0)), 0)
        b.part('rbox', (0.17, 0.17, 0.45), (0, 0, -0.22), SUIT, h)
        k = b.piv('knee' + side, (0, 0, -0.45), h)
        b.part('rbox', (0.15, 0.15, 0.4), (0, 0, -0.2), SUIT, k)
        b.part('rbox', (0.28, 0.16, 0.09), (0.05, 0, -0.42), WHITE, k)                         # baskets blanches de start-up
    tor = b.piv('torso', (0, 0, 0.04), pel)
    b.part('rbox', (0.34, 0.46, 0.52), (0, 0, 0.27), SUIT, tor, r2=0.3)
    b.part('rbox', (0.36, 0.48, 0.36), (0, 0, 0.3), VEST, tor, r2=0.3)                         # doudoune sans manches
    b.part('box', (0.02, 0.1, 0.06), (0.185, 0.12, 0.4), WHITE, tor)                           # logo « disruptif »
    b.part('box', (0.02, 0.06, 0.2), (0.185, 0, 0.22), RED, tor)                               # cravate
    hd = b.piv('head', (0.02, 0, 0.6), tor)
    b.part('rbox', (0.26, 0.24, 0.28), (0, 0, 0.12), SKIN, hd, r2=0.4)
    b.part('rbox', (0.26, 0.25, 0.05), (-0.02, 0, 0.26), '#6a4a2a', hd)                        # undercut
    b.part('rbox', (0.18, 0.18, 0.1), (0.03, 0, 0.31), '#8a6234', hd, rot=(0, -18, 0))         # houppe
    for y in (-0.055, 0.055):
        b.part('cyl', (0.075, 0.075, 0.02), (0.135, y, 0.15), '#3a2414', hd, rot=(0, 90, 0), seg=8)
    b.part('box', (0.03, 0.2, 0.06), (0.13, 0, 0.05), WHITE, hd)                               # sourire de vendeur
    b.part('sph', (0.03, 0.03, 0.03), (0.0, -0.13, 0.1), WHITE, hd, seg=6)                     # écouteur
    for side, y in (('N', -0.29), ('F', 0.29)):
        sh = b.piv('sh' + side, (0, y, 0.46), tor)
        sh.rotation_euler = (0, math.radians(pose.get('sh' + side, 0)), 0)
        b.part('rbox', (0.13, 0.13, 0.32), (0, 0, -0.16), SUIT, sh)
        el = b.piv('el' + side, (0, 0, -0.32), sh)
        el.rotation_euler = (0, math.radians(pose.get('el' + side, 0)), 0)
        b.part('rbox', (0.12, 0.12, 0.28), (0, 0, -0.14), SUIT, el)
        hn = b.piv('hand' + side, (0, 0, -0.3), el)
        b.part('sph', (0.1, 0.1, 0.1), (0, 0, 0), SKIN, hn, seg=6)
        if side == 'F':
            pancarte(b, hn, (0.04, 0, -0.1))
        else:
            b.part('box', (0.14, 0.03, 0.2), (0.05, 0, -0.06), DARK, hn)                       # tablette « offre de prêt »
            b.part('box', (0.12, 0.035, 0.16), (0.05, -0.002, -0.06), '#38f2ff', hn)
    # pile de pancartes dans le dos (il en a toujours une de rechange)
    for k in range(3):
        pancarte(b, tor, (-0.22, -0.08 + k * 0.08, 0.05), k=0.6, rot=(0, -15, 0))
    return root


def mouette(b, loc):
    m = b.piv('mouette', loc)
    b.part('rbox', (0.26, 0.14, 0.14), (0, 0, 0.14), WHITE, m)
    b.part('sph', (0.1, 0.1, 0.1), (0.14, 0, 0.24), WHITE, m, seg=6)
    b.part('cone', (0.03, 0.03, 0.07), (0.21, 0, 0.23), '#f0c020', m, rot=(0, 90, 0), seg=4)
    b.part('box', (0.18, 0.05, 0.03), (-0.04, 0.1, 0.18), '#9aa3b8', m)                        # ailes grises
    b.part('box', (0.18, 0.05, 0.03), (-0.04, -0.1, 0.18), '#9aa3b8', m)
    pancarte(b, m, (-0.02, 0, 0.2), k=0.5)                                                     # VENDU planté sur la mouette
    return m


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_agent_immo", 440, 440)
build_agent(B(sc))
for label, yaw in (('trois_quarts', 35), ('face', 90), ('profil', 0)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 440, 0.95, yaw=yaw, ppu=200)
    p = os.path.join(SHEET_DIR, f"agent_immo_{label}.png"); render_to(sc, p); renders.append(p)
sc2 = scene("S3K_agent_immo_gag", 640, 440)
bb = B(sc2)
build_agent(bb, dict(shF=-40, elF=-20, hipN=12, hipF=-10))
mouette(bb, (0.9, 0.3, 0))
before = set(sc2.objects)
win = bpy.context.window; prev = win.scene; win.scene = sc2
try:
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODEL_DIR, "ultra.glb"))
finally:
    win.scene = prev
for o in sc2.objects:
    if o not in before and o.parent is None:
        o.location = (-0.7, -1.7, 0)
pancarte(bb, None, (-0.45, -1.55, 1.25), k=0.6, rot=(0, 20, 0))                                 # même sur le dos de l'Ultra
sprite_camera(sc2, 640, 1.05, yaw=50, ppu=145)
p = os.path.join(SHEET_DIR, "agent_immo_gag.png"); render_to(sc2, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    out = []
    for name, fn in (("agent_immo", build_agent), ("pancarte_vendu", lambda b: pancarte(b, None, (0, 0, 0)))):
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
