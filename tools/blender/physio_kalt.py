# Validé par Maxime le 21/11/2026 (« excellent »).
# Sbires du Kalt (2026) — choix de Maxime (21/11/2026) : « physio + robot-cordon » ; gag « un peu des 3 » :
# panneau « PAS CE SOIR » (refoule tout le monde, même les sbires), tampon VIP / REFOULÉ sur le front, mètre ruban
# pour mesurer les baskets (dress code absurde). Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\physio_kalt.py", encoding="utf-8").read())
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
BLACK, BLACK_L, GOLD, RED, SKIN, STEEL, WHITE, CYAN = '#0e0e12', '#22222a', '#ffc040', '#c0102a', '#b8805c', '#9aa3b8', '#f4f0e8', '#38f2ff'


def physio(b, pose=None):
    """Physio humain-cyborg : armoire à glace en costume noir, brassard doré, oreillette, bras droit mécanique
    (tampon VIP/REFOULÉ), main gauche : panneau « PAS CE SOIR » ; mètre ruban à la ceinture."""
    pose = pose or {}
    root = b.piv('root')
    pel = b.piv('pelvis', (0, 0, 1.0), root)
    for side, y in (('N', -0.17), ('F', 0.17)):
        h = b.piv('hip' + side, (0, y, 0), pel)
        b.part('rbox', (0.26, 0.26, 0.5), (0, 0, -0.25), BLACK, h)
        k = b.piv('knee' + side, (0, 0, -0.5), h)
        b.part('rbox', (0.24, 0.24, 0.46), (0, 0, -0.23), BLACK, k)
        b.part('rbox', (0.36, 0.24, 0.1), (0.05, 0, -0.47), '#050508', k)
    tor = b.piv('torso', (0, 0, 0.05), pel)
    b.part('rbox', (0.55, 0.85, 0.75), (0, 0, 0.4), BLACK, tor, r2=0.25)                      # carrure énorme
    b.part('box', (0.02, 0.14, 0.45), (0.28, 0, 0.45), WHITE, tor)                              # chemise
    b.part('box', (0.03, 0.06, 0.3), (0.29, 0, 0.42), BLACK_L, tor)                             # cravate fine
    b.part('cyl', (0.2, 0.2, 0.18), (0, 0.46, 0.6), GOLD, tor, rot=(90, 0, 0), seg=10)          # brassard doré
    b.part('cyl', (0.12, 0.12, 0.08), (0.05, -0.3, 0.05), '#ffd23f', tor, rot=(90, 0, 0), seg=10)  # mètre ruban jaune
    b.part('box', (0.3, 0.02, 0.03), (0.2, -0.32, 0.03), '#ffd23f', tor)
    hd = b.piv('head', (0.02, 0, 0.86), tor)
    b.part('rbox', (0.3, 0.3, 0.32), (0, 0, 0.14), SKIN, hd, r2=0.35)                           # crâne rasé
    b.part('box', (0.04, 0.3, 0.07), (0.15, 0, 0.17), BLACK, hd)                                # lunettes noires
    b.part('box', (0.03, 0.14, 0.03), (0.155, 0, 0.05), '#6a3a2a', hd)                          # bouche fermée
    b.part('box', (0.02, 0.02, 0.2), (-0.05, -0.16, 0.05), '#e8e8f0', hd)                       # fil d'oreillette
    b.part('box', (0.04, 0.3, 0.3), (-0.02, 0, 0.0), SKIN, hd)                                  # cou épais
    for side, y in (('N', -0.5), ('F', 0.5)):
        sh = b.piv('sh' + side, (0, y, 0.68), tor)
        sh.rotation_euler = (0, math.radians(pose.get('sh' + side, 0)), 0)
        if side == 'N':                                                                         # bras cyborg + tampon
            b.part('box', (0.16, 0.16, 0.42), (0, 0, -0.21), STEEL, sh)
            b.part('cyl', (0.06, 0.06, 0.4), (0.08, 0.08, -0.2), '#5a606e', sh, seg=6)
        else:
            b.part('rbox', (0.22, 0.22, 0.42), (0, 0, -0.21), BLACK, sh)
        el = b.piv('el' + side, (0, 0, -0.42), sh)
        el.rotation_euler = (0, math.radians(pose.get('el' + side, 0)), 0)
        b.part('rbox', (0.2, 0.2, 0.36), (0, 0, -0.18), STEEL if side == 'N' else BLACK, el)
        hn = b.piv('hand' + side, (0, 0, -0.38), el)
        if side == 'N':
            b.part('cyl', (0.16, 0.16, 0.14), (0.05, 0, -0.05), GOLD, hn, seg=8)                   # tampon
            b.part('box', (0.17, 0.17, 0.03), (0.05, 0, -0.13), RED, hn)
            b.piv('tampon', (0.05, 0, -0.15), hn)
        else:
            b.part('sph', (0.14, 0.14, 0.14), (0, 0, 0), SKIN, hn, seg=6)
            pn = b.piv('panneau', (0.1, 0, 0.05), hn)
            b.part('box', (0.03, 0.03, 0.5), (0, 0, 0.25), STEEL, pn)
            b.part('box', (0.03, 0.5, 0.3), (0.01, 0, 0.6), RED, pn)                                 # « PAS CE SOIR »
            b.part('box', (0.035, 0.4, 0.08), (0.015, 0, 0.62), WHITE, pn)
    return root


def robot_cordon(b):
    """Robot-cordon : potelet doré motorisé sur chenilles, qui déroule son cordon de velours rouge et bloque le passage."""
    r = b.piv('robot_cordon')
    b.part('rbox', (0.4, 0.35, 0.18), (0, 0, 0.1), BLACK_L, r)                                  # chenilles
    b.part('cyl', (0.1, 0.1, 0.9), (0, 0, 0.6), GOLD, r, seg=8)                                  # potelet
    b.part('sph', (0.16, 0.16, 0.16), (0, 0, 1.08), GOLD, r, seg=8)
    b.part('box', (0.06, 0.2, 0.08), (0.08, 0, 1.08), CYAN, r)                                    # « yeux » LED
    b.part('box', (0.06, 0.06, 0.2), (0, 0.1, 0.9), RED, r)                                       # crochet du cordon
    for i in range(8):                                                                            # cordon de velours tendu
        b.part('box', (0.06, 0.18, 0.06), (0, 0.2 + i * 0.17, 0.88 - 0.05 * math.sin(i / 7 * math.pi)), RED, r)
    b.part('box', (0.04, 0.2, 0.04), (0, 1.6, 0.88), GOLD, r)
    b.piv('cordon_fin', (0, 1.6, 0.88), r)
    return r


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_physio", 980, 520)
bb = B(sc)
p1 = physio(bb, dict(shN=-50, shF=-30)); p1.location = (0, -0.9, 0)
rc = robot_cordon(bb); rc.location = (0.6, 0.2, 0)
# dress code : une basket mesurée au mètre ruban, et un front tamponné « REFOULÉ » sur un mannequin de client
bb.part('rbox', (0.34, 0.16, 0.12), (1.2, -1.2, 0.06), WHITE, None)
bb.part('box', (0.5, 0.02, 0.02), (1.2, -1.32, 0.15), '#ffd23f', None)
for label, yaw in (('trois_quarts', 35), ('face', 90)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 980, 0.95, yaw=yaw, ppu=170)
    p = os.path.join(SHEET_DIR, f"physio_{label}.png"); render_to(sc, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    out = []
    for name, fn in (("physio_kalt", physio), ("robot_cordon", robot_cordon)):
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
