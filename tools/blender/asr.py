# Niveau 1 (Petite France 2077) : le boss « Androïde de Service Restauration » (ASR-67). Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\asr.py", encoding="utf-8").read())
# Étape VALIDATION : produit seulement les planches tools/blender/out/asr_*.png.
# Mettre EXPORT = True une fois le design validé pour écrire assets/models/asr.glb.
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

# plastique blanc d'électroménager rayé de joints, code-barres
s3k_lib.PATTERNS['asr_shell'] = [[('#c8ccd8' if (y % 8 == 0) else '#eef0f6') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['barcode'] = [[('#111118' if x in (0, 1, 3, 6, 7, 9, 12, 13, 15) else '#eef0f6') for x in range(16)] for y in range(16)]

SHELL, JOINT, DARK = 'tex:asr_shell', '#3a3f52', '#14151f'
GOLD, PINK, CYAN, RED = '#ffc040', '#ff2e88', '#38f2ff', '#ff1a3c'


def joint(b, parent, r=0.12):
    """Rotule mécanique apparente au niveau d'un pivot."""
    b.part('sph', (r, r, r), (0, 0, 0), JOINT, parent, seg=8)


def build_asr(b):
    """Androïde de service, silhouette de chef conservée (toque = dissipateur-bouclier).
    Pivots standards (CLAUDE.md) + 'toque', 'tpe', 'printer', 'whisk'."""
    J = {}
    root = b.piv('root')
    thigh, shin = 0.42, 0.42
    hip_h = thigh + shin + 0.12
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    tor = b.piv('torso', (0, 0, 0.04), pel)
    J.update(root=root, pelvis=pel, torso=tor, _hip_h=hip_h)
    b.part('rbox', (0.4, 0.5, 0.18), (0, 0, -0.02), JOINT, pel)                                 # bassin mécanique
    tw_x, tw_y, th = 0.62, 0.78, 0.82
    for side, far in (('N', False), ('F', True)):
        sg = 1 if far else -1
        h = b.piv('hip' + side, (0, sg * 0.17, 0), pel)
        joint(b, h, 0.15)
        b.part('cyl', (0.07, 0.07, thigh), (0, 0, -thigh / 2), '#9aa3b8', h, seg=6)              # vérin nu
        b.part('rbox', (0.22, 0.2, thigh * 0.6), (0.02, 0, -thigh * 0.45), SHELL, h)            # carénage cuisse
        k = b.piv('knee' + side, (0, 0, -thigh), h)
        joint(b, k)
        b.part('rbox', (0.2, 0.2, shin), (0, 0, -shin / 2), SHELL, k)
        b.part('box', (0.01, 0.03, shin * 0.7), (0.105, 0, -shin / 2), RED, k)                  # voyant rouge tibia
        ft = b.piv('foot' + side, (0, 0, -shin), k)
        b.part('rbox', (0.42, 0.26, 0.1), (0.06, 0, -0.05), DARK, ft)                           # pied antidérapant
        b.part('box', (0.06, 0.27, 0.04), (0.25, 0, -0.04), CYAN, ft)
        J.update({'hip' + side: h, 'knee' + side: k, 'foot' + side: ft})
        s = b.piv('sh' + side, (0, sg * (tw_y / 2 + 0.06), th - 0.1), tor)
        joint(b, s, 0.15)
        b.part('rbox', (0.2, 0.2, 0.34), (0, 0, -0.18), SHELL, s)
        e = b.piv('el' + side, (0, 0, -0.36), s)
        joint(b, e)
        b.part('cyl', (0.06, 0.06, 0.3), (0, 0, -0.14), '#9aa3b8', e, seg=6)                     # avant-bras squelettique
        b.part('rbox', (0.16, 0.16, 0.14), (0, 0, -0.08), SHELL, e)
        hd = b.piv('hand' + side, (0, 0, -0.3), e)
        J.update({'sh' + side: s, 'el' + side: e, 'hand' + side: hd})

    # torse : coque d'électroménager, ventre = vitrine réfrigérée avec plats sous plastique
    b.part('rbox', (tw_x, tw_y, th), (0, 0, th / 2), SHELL, tor)
    b.part('rbox', (0.08, 0.5, 0.36), (tw_x / 2, 0, 0.3), DARK, tor)                            # vitrine
    b.part('box', (0.02, 0.44, 0.3), (tw_x / 2 + 0.04, 0, 0.3), '#9fe8ff', tor)                 # vitre givrée
    for i, c in enumerate(('#e8c070', '#c84030', '#f0e0b0')):                                   # 3 plats « authentiques »
        b.part('rbox', (0.03, 0.12, 0.08), (tw_x / 2 + 0.03, -0.14 + i * 0.14, 0.26), c, tor)
    b.part('box', (0.02, 0.5, 0.05), (tw_x / 2 + 0.03, 0, 0.5), PINK, tor)                      # bandeau prix néon
    b.part('box', (0.02, 0.26, 0.1), (tw_x / 2 + 0.005, 0.12, th - 0.14), 'tex:barcode', tor)   # code-barres poitrine
    b.part('box', (0.02, 0.1, 0.1), (tw_x / 2 + 0.005, -0.2, th - 0.14), GOLD, tor)             # logo BlingCo
    b.part('rbox', (0.5, 0.6, 0.06), (0, 0, th - 0.01), JOINT, tor)                             # collerette
    # tablier réglementaire en plastique (seul rappel du métier)
    b.part('box', (0.02, 0.5, 0.4), (tw_x / 2 + 0.02, 0, -0.12), '#f6f6fb', tor)
    b.part('box', (0.025, 0.5, 0.03), (tw_x / 2 + 0.025, 0, -0.3), PINK, tor)

    # terminal de paiement greffé dans le dos = POINT FAIBLE (pivot 'tpe'), branché par câbles
    tpe = b.piv('tpe', (-tw_x / 2 - 0.02, 0, th * 0.55), tor)
    b.part('rbox', (0.18, 0.46, 0.56), (-0.06, 0, 0), '#2a2d40', tpe)
    scr = b.part('box', (0.03, 0.36, 0.2), (-0.16, 0, 0.13), PINK, tpe)
    scr.name = 'tpe_screen'
    for i in range(3):
        for j in range(2):
            b.part('box', (0.03, 0.08, 0.05), (-0.16, -0.09 + i * 0.09, -0.06 - j * 0.09), CYAN, tpe)
    for sg in (-1, 1):
        b.part('cyl', (0.045, 0.045, 0.5), (-0.02, sg * 0.17, 0.4), '#ff2e88', tpe, rot=(0, -20, 0), seg=6)
    b.part('sph', (0.08, 0.08, 0.08), (-0.18, 0.2, 0.25), RED, tpe, seg=6)                      # voyant clignotant

    # tête : PAS de visage. Écran noir avec un sourire en pixels, capteur rouge balayant.
    head = b.piv('head', (0, 0, th + 0.08), tor)
    J['head'] = head
    b.part('cyl', (0.1, 0.1, 0.12), (0, 0, 0.0), '#9aa3b8', head, seg=6)                        # cou-vérin
    b.part('rbox', (0.46, 0.46, 0.4), (0, 0, 0.28), SHELL, head)
    b.part('box', (0.03, 0.4, 0.28), (0.23, 0, 0.28), DARK, head)                               # écran-visage
    b.part('box', (0.035, 0.32, 0.03), (0.235, 0, 0.36), RED, head)                             # fente capteur
    for dy, dz in ((-0.1, 0.22), (-0.05, 0.19), (0, 0.18), (0.05, 0.19), (0.1, 0.22)):          # sourire pixel
        b.part('box', (0.036, 0.045, 0.03), (0.236, dy, dz), CYAN, head)
    for sg in (-1, 1):
        b.part('cyl', (0.12, 0.12, 0.04), (0, sg * 0.24, 0.28), JOINT, head, rot=(90, 0, 0), seg=8)  # oreillettes
        b.part('cyl', (0.07, 0.07, 0.045), (0, sg * 0.245, 0.28), CYAN, head, rot=(90, 0, 0), seg=8)
    b.part('box', (0.02, 0.16, 0.05), (0.21, 0, 0.47), 'tex:barcode', head)                    # code-barres front
    b.part('cyl', (0.02, 0.02, 0.25), (-0.12, 0.15, 0.55), '#9aa3b8', head, seg=4)              # antenne
    b.part('sph', (0.05, 0.05, 0.05), (-0.12, 0.15, 0.68), RED, head, seg=6)

    # « toque » = dissipateur thermique cannelé qui sert de BOUCLIER frontal (pivot 'toque')
    tq = b.piv('toque', (0, 0, 0.5), head)
    b.part('cyl', (0.42, 0.42, 0.1), (0, 0, 0.0), JOINT, tq, seg=12)
    b.part('cyl', (0.43, 0.43, 0.03), (0, 0, 0.05), CYAN, tq, seg=12)                           # anneau néon
    for i in range(10):                                                                          # ailettes
        a = i * math.pi / 5
        b.part('box', (0.06, 0.2, 0.62), (math.cos(a) * 0.17, math.sin(a) * 0.17, 0.36), '#d8dce8', tq,
               rot=(0, 0, math.degrees(a) + 90))
    b.part('cyl', (0.36, 0.36, 0.06), (0, 0, 0.7), '#d8dce8', tq, seg=12)
    b.part('box', (0.02, 0.18, 0.1), (0.22, 0, 0.3), PINK, tq)                                  # étiquette BlingCo

    # bras proche : imprimante à additions (canon à tickets)
    pr = b.piv('printer', (0.04, 0, -0.06), J['handN'])
    b.part('rbox', (0.26, 0.24, 0.3), (0, 0, -0.12), '#2a2d40', pr)
    b.part('box', (0.04, 0.2, 0.03), (0.13, 0, -0.24), DARK, pr)                                # fente
    for i in range(3):                                                                          # ticket qui pend
        b.part('box', (0.015, 0.16, 0.16), (0.14 + i * 0.01, 0, -0.33 - i * 0.15), '#fff8e0', pr, rot=(0, 8 * i, 0))
        b.part('box', (0.02, 0.1, 0.015), (0.15 + i * 0.01, 0, -0.3 - i * 0.15), RED, pr)
    b.part('box', (0.03, 0.06, 0.06), (0.13, 0.08, -0.04), GOLD, pr)                            # voyant €
    # bras éloigné : fouet rotatif industriel
    wk = b.piv('whisk', (0.04, 0, -0.06), J['handF'])
    b.part('cyl', (0.07, 0.07, 0.18), (0, 0, -0.08), JOINT, wk, seg=6)
    for i in range(4):
        a = i * math.pi / 4
        b.part('box', (0.24, 0.02, 0.36), (0, 0, -0.32), '#c8ccd8', wk, rot=(0, 0, math.degrees(a)))
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


for old in [x for x in bpy.data.scenes if x.name.startswith("S3K_asr")]:
    bpy.data.scenes.remove(old)
POSE = dict(shN=40, elN=75, shF=25, elF=40, hipN=6, hipF=-6, kneeN=-6, head=-6)
renders = []
sc = setup_scene("S3K_asr", 460, 460, style='funk')
b = B(sc)
J = build_asr(b)
apply_pose(J, POSE)
for label, yaw in (('trois_quarts', 45), ('profil', 0), ('dos', 200)):
    for o in [o for o in sc.collection.objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 460, 1.55, yaw=yaw, ppu=110)
    p = os.path.join(SHEET_DIR, "asr_%s.png" % label)
    render_to(sc, p)
    renders.append(p)
if EXPORT:
    apply_pose(J, {})
    export(sc, 'asr')
result = {"renders": renders}
