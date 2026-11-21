# Niveau 1 (Petite France 2077) : sbires androïdes de BlingCo Restauration. Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\sbires.py", encoding="utf-8").read())
# Étape VALIDATION : planches tools/blender/out/{serveur,sommelier}_*.png. EXPORT = True après validation.
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
os.makedirs(SHEET_DIR, exist_ok=True)

s3k_lib.PATTERNS['asr_shell'] = [[('#c8ccd8' if (y % 8 == 0) else '#eef0f6') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['barcode'] = [[('#111118' if x in (0, 1, 3, 6, 7, 9, 12, 13, 15) else '#eef0f6') for x in range(16)] for y in range(16)]
SHELL, JOINT, DARK = 'tex:asr_shell', '#3a3f52', '#14151f'
GOLD, PINK, CYAN, RED, BORDEAUX = '#ffc040', '#ff2e88', '#38f2ff', '#ff1a3c', '#6a1030'


def android(b, P):
    """Corps d'androïde de service fin (même famille que l'ASR-67). Pivots standards CLAUDE.md."""
    J = {}
    root = b.piv('root')
    thigh, shin = 0.44, 0.44
    hip_h = thigh + shin + 0.1
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    tor = b.piv('torso', (0, 0, 0.04), pel)
    J.update(root=root, pelvis=pel, torso=tor, _hip_h=hip_h)
    b.part('rbox', (0.28, 0.36, 0.14), (0, 0, -0.02), JOINT, pel)
    tw_x, tw_y, th = P.get('tw_x', 0.36), P.get('tw_y', 0.5), 0.68
    for side, far in (('N', False), ('F', True)):
        sg = 1 if far else -1
        h = b.piv('hip' + side, (0, sg * 0.12, 0), pel)
        b.part('sph', (0.11, 0.11, 0.11), (0, 0, 0), JOINT, h, seg=8)
        b.part('rbox', (0.15, 0.15, thigh), (0, 0, -thigh / 2), P['leg'], h)
        k = b.piv('knee' + side, (0, 0, -thigh), h)
        b.part('sph', (0.09, 0.09, 0.09), (0, 0, 0), JOINT, k, seg=8)
        b.part('cyl', (0.05, 0.05, shin), (0, 0, -shin / 2), '#9aa3b8', k, seg=6)               # tibia-vérin
        ft = b.piv('foot' + side, (0, 0, -shin), k)
        b.part('rbox', (0.32, 0.18, 0.08), (0.05, 0, -0.04), DARK, ft)
        b.part('box', (0.05, 0.19, 0.03), (0.2, 0, -0.03), P['accent'], ft)
        J.update({'hip' + side: h, 'knee' + side: k, 'foot' + side: ft})
        s = b.piv('sh' + side, (0, sg * (tw_y / 2 + 0.05), th - 0.08), tor)
        b.part('sph', (0.1, 0.1, 0.1), (0, 0, 0), JOINT, s, seg=8)
        b.part('rbox', (0.14, 0.14, 0.32), (0, 0, -0.16), SHELL, s)
        e = b.piv('el' + side, (0, 0, -0.33), s)
        b.part('sph', (0.08, 0.08, 0.08), (0, 0, 0), JOINT, e, seg=8)
        b.part('cyl', (0.045, 0.045, 0.28), (0, 0, -0.13), '#9aa3b8', e, seg=6)
        hd = b.piv('hand' + side, (0, 0, -0.29), e)
        b.part('rbox', (0.12, 0.1, 0.12), (0.02, 0, -0.05), JOINT, hd)                          # pince
        J.update({'sh' + side: s, 'el' + side: e, 'hand' + side: hd})
    b.part('rbox', (tw_x, tw_y, th), (0, 0, th / 2), SHELL, tor)
    b.part('box', (0.02, 0.18, 0.06), (tw_x / 2 + 0.005, 0.1, th - 0.14), 'tex:barcode', tor)
    b.part('box', (0.02, 0.07, 0.07), (tw_x / 2 + 0.005, -0.14, th - 0.14), GOLD, tor)           # pin's BlingCo
    head = b.piv('head', (0, 0, th + 0.06), tor)
    J['head'] = head
    b.part('cyl', (0.07, 0.07, 0.1), (0, 0, 0), '#9aa3b8', head, seg=6)
    return J, tor, head, tw_x, th


def face_screen(b, head, z, w=0.3, h=0.18, x=0.17, col=CYAN):
    """Écran-visage noir + sourire pixel (signature des androïdes BlingCo)."""
    b.part('box', (0.03, w, h), (x, 0, z), DARK, head)
    b.part('box', (0.035, w * 0.7, 0.025), (x + 0.004, 0, z + h * 0.25), RED, head)
    for dy, dz in ((-0.08, -0.03), (-0.04, -0.055), (0, -0.06), (0.04, -0.055), (0.08, -0.03)):
        b.part('box', (0.036, 0.035, 0.025), (x + 0.005, dy * w / 0.3, z + dz * h / 0.18), col, head)


# ------------------------------------------------------------------ Serveur Androïde (corps à corps, lance l'assiette)
def build_serveur(b):
    J, tor, head, tw_x, th = android(b, dict(leg='#1a1c2c', accent=CYAN))
    # tête en cloche de service (dôme inox) avec écran
    b.part('cyl', (0.36, 0.36, 0.06), (0, 0, 0.08), '#9aa3b8', head, seg=12)                    # plateau-col
    b.part('sph', (0.32, 0.32, 0.34), (0, 0, 0.18), '#d8dce8', head, seg=12, smooth=True)      # dôme
    b.part('sph', (0.06, 0.06, 0.06), (0, 0, 0.36), GOLD, head, seg=6)                          # poignée
    face_screen(b, head, 0.2, w=0.24, h=0.14, x=0.14)
    # gilet noir + noeud papillon émetteur
    b.part('box', (0.02, tw_x + 0.1, th * 0.7), (tw_x / 2 + 0.01, 0, th * 0.4), '#1a1c2c', tor)
    for sg in (-1, 1):
        b.part('box', (0.03, 0.08, 0.06), (tw_x / 2 + 0.025, sg * 0.05, th - 0.04), PINK, tor, rot=(sg * 20, 0, 0))
    b.part('sph', (0.04, 0.04, 0.04), (tw_x / 2 + 0.035, 0, th - 0.04), CYAN, tor, seg=6)
    b.part('box', (0.02, 0.2, 0.32), (tw_x / 2 + 0.03, 0, 0.0), '#f6f6fb', tor)                 # serviette au bras… au ventre
    # dos : batterie de service + grille d'aération + numéro de série
    b.part('rbox', (0.12, 0.34, 0.4), (-tw_x / 2 - 0.05, 0, th * 0.55), '#2a2d40', tor)
    for i in range(4):
        b.part('box', (0.02, 0.05, 0.22), (-tw_x / 2 - 0.115, -0.11 + i * 0.075, th * 0.58), CYAN if i < 3 else RED, tor)
    for i in range(3):
        b.part('box', (0.02, 0.26, 0.02), (-tw_x / 2 - 0.115, 0, th * 0.3 + i * 0.04), JOINT, tor)
    b.part('box', (0.02, 0.2, 0.06), (-tw_x / 2 - 0.005, 0, th * 0.12), 'tex:barcode', tor)
    b.part('cyl', (0.02, 0.02, 0.3), (-tw_x / 2 - 0.05, 0.12, th + 0.1), '#9aa3b8', tor, seg=4)   # antenne
    b.part('sph', (0.04, 0.04, 0.04), (-tw_x / 2 - 0.05, 0.12, th + 0.26), PINK, tor, seg=6)
    # main proche : plateau-bouclier / assiette à lancer
    tray = b.piv('tray', (0.04, 0, -0.06), J['handN'])
    b.part('cyl', (0.5, 0.5, 0.03), (0.1, 0, -0.04), '#c8ccd8', tray, rot=(0, 80, 0), seg=12)
    b.part('cyl', (0.52, 0.52, 0.015), (0.1, 0, -0.04), PINK, tray, rot=(0, 80, 0), seg=12)
    b.part('cyl', (0.22, 0.22, 0.05), (0.13, 0, -0.04), '#f6f6fb', tray, rot=(0, 80, 0), seg=10)  # assiette
    # main éloignée : terminal de paiement portable
    tp = b.piv('tpe_hand', (0.04, 0, -0.06), J['handF'])
    b.part('rbox', (0.08, 0.14, 0.24), (0, 0, -0.08), '#2a2d40', tp)
    b.part('box', (0.02, 0.1, 0.08), (0.045, 0, -0.03), PINK, tp)
    return J


# ------------------------------------------------------------------ Sommelier Androïde (distance, bouchons)
def build_sommelier(b):
    J, tor, head, tw_x, th = android(b, dict(leg='#1a1c2c', accent=BORDEAUX, tw_x=0.4))
    # tête étroite et haute, capteur olfactif (nez-sonde)
    b.part('rbox', (0.3, 0.3, 0.42), (0, 0, 0.26), SHELL, head)
    face_screen(b, head, 0.3, w=0.26, h=0.18, x=0.155)
    b.part('cyl', (0.04, 0.04, 0.16), (0.2, 0, 0.18), '#9aa3b8', head, rot=(0, 90, 0), seg=6)   # sonde olfactive
    b.part('sph', (0.05, 0.05, 0.05), (0.29, 0, 0.18), RED, head, seg=6)
    for i in range(5):                                                                            # 5 étoiles de notation
        b.part('box', (0.02, 0.04, 0.04), (0.15, -0.1 + i * 0.05, 0.5), GOLD, head)
    # long tablier bordeaux + chaîne et tastevin connecté
    b.part('box', (0.02, tw_x + 0.08, th * 0.75), (tw_x / 2 + 0.012, 0, th * 0.38), BORDEAUX, tor)     # bavette
    skirt = b.piv('apron', (tw_x / 2 + 0.01, 0, 0.02), J['pelvis'])                                # jupe évasée
    b.part('box', (0.02, tw_x + 0.14, 0.62), (0.06, 0, -0.3), BORDEAUX, skirt, rot=(0, -12, 0))
    b.part('box', (0.022, tw_x + 0.15, 0.03), (0.12, 0, -0.58), GOLD, skirt, rot=(0, -12, 0))
    b.part('box', (0.025, 0.3, 0.03), (tw_x / 2 + 0.02, 0, th * 0.5), GOLD, tor)
    b.part('cyl', (0.12, 0.12, 0.03), (tw_x / 2 + 0.03, 0, th * 0.72), '#d8dce8', tor, rot=(0, 90, 0), seg=10)
    b.part('cyl', (0.06, 0.06, 0.035), (tw_x / 2 + 0.035, 0, th * 0.72), CYAN, tor, rot=(0, 90, 0), seg=8)
    # bras proche : canon-bouteille (tire des bouchons de « champagne premium »)
    can = b.piv('bottle', (0.06, 0, -0.04), J['handN'])
    b.part('cyl', (0.14, 0.14, 0.5), (0.0, 0, -0.18), '#1f3a2a', can, seg=8)
    b.part('cyl', (0.06, 0.06, 0.18), (0.0, 0, -0.5), '#1f3a2a', can, seg=6)
    b.part('cyl', (0.07, 0.07, 0.06), (0.0, 0, -0.6), GOLD, can, seg=6)                          # bouchon
    b.part('box', (0.02, 0.15, 0.16), (0.07, 0, -0.16), '#fff8e0', can)                          # étiquette « 2077 »
    b.part('box', (0.022, 0.1, 0.03), (0.075, 0, -0.12), PINK, can)
    # main éloignée : carte des vins-tablette (prix délirants)
    cw = b.piv('wine_list', (0.04, 0, -0.06), J['handF'])
    b.part('rbox', (0.04, 0.26, 0.34), (0.02, 0, -0.1), BORDEAUX, cw)
    b.part('box', (0.045, 0.2, 0.26), (0.025, 0, -0.1), PINK, cw)
    return J


def export(sc, name):
    win = bpy.context.window
    prev = win.scene
    win.scene = sc
    for o in [o for o in sc.collection.objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, name + ".glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev


GUARD = dict(shN=30, elN=65, shF=15, elF=45, hipN=8, hipF=-8, kneeN=-6)
renders = []
for name, fn, pose in (('serveur', build_serveur, GUARD), ('sommelier', build_sommelier, dict(GUARD, shN=70, elN=20))):
    for old in [x for x in bpy.data.scenes if x.name == "S3K_" + name]:
        bpy.data.scenes.remove(old)
    sc = setup_scene("S3K_" + name, 420, 420, style='funk')
    b = B(sc)
    J = fn(b)
    apply_pose(J, pose)
    for label, yaw in (('trois_quarts', 45), ('profil', 0), ('dos', 200)):
        for o in [o for o in sc.collection.objects if o.type == 'CAMERA']:
            bpy.data.objects.remove(o, do_unlink=True)
        sprite_camera(sc, 420, 1.2, yaw=yaw, ppu=135)
        p = os.path.join(SHEET_DIR, "%s_%s.png" % (name, label))
        render_to(sc, p)
        renders.append(p)
    if EXPORT:
        apply_pose(J, {})
        export(sc, name)
result = {"renders": renders}
