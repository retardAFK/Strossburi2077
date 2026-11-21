# Niveau 1 (Petite France 2077) : le boss « Chef Addition-Salée ». Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\chef.py").read())
# Étape VALIDATION : produit seulement les planches tools/blender/out/chef_*.png.
# Mettre EXPORT = True une fois le design validé pour écrire assets/models/chef.glb.
import importlib, sys, os, math
ROOT3 = r"C:\Users\mbarbe\dev\Stras3000"
sys.path.insert(0, os.path.join(ROOT3, "tools"))
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

EXPORT = False
SHEET_DIR = os.path.join(ROOT3, "tools", "blender", "out")
MODEL_DIR = os.path.join(ROOT3, "assets", "models")
os.makedirs(SHEET_DIR, exist_ok=True)

# motifs : pantalon pied-de-poule de cuisine, veste blanche matelassée
s3k_lib.PATTERNS['chef_check'] = [[('#1a1c2c' if ((x // 2) + (y // 2)) % 2 == 0 else '#e8e8f0') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['chef_jacket'] = [[('#e6e6f0' if (x % 8 == 0 or y % 8 == 0) else '#f6f6fb') for x in range(16)] for y in range(16)]

SKIN, SKIN_D = '#f0b898', '#d08a70'
GOLD, PINK, CYAN, RED = '#ffc040', '#ff2e88', '#38f2ff', '#e0303a'


def build_chef(b):
    """Gros chef étoilé 2077. Pivots standards (CLAUDE.md) + 'toque', 'tpe', 'roll'."""
    J = {}
    root = b.piv('root')
    thigh, shin = 0.4, 0.38
    hip_h = thigh + shin + 0.1
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    tor = b.piv('torso', (0, 0, 0), pel)
    J.update(root=root, pelvis=pel, torso=tor, _hip_h=hip_h)
    tw_x, tw_y, th = 0.7, 0.8, 0.85
    for side, far in (('N', False), ('F', True)):
        sg = 1 if far else -1
        h = b.piv('hip' + side, (0, sg * 0.18, 0), pel)
        b.part('rbox', (0.26, 0.26, thigh + 0.05), (0, 0, -thigh / 2), 'tex:chef_check', h)
        k = b.piv('knee' + side, (0, 0, -thigh), h)
        b.part('rbox', (0.24, 0.24, shin + 0.03), (0, 0, -shin / 2), 'tex:chef_check', k)
        ft = b.piv('foot' + side, (0, 0, -shin), k)
        b.part('rbox', (0.4, 0.24, 0.12), (0.06, 0, -0.06), '#f6f6fb', ft)                     # sabots de cuisine
        b.part('box', (0.12, 0.25, 0.03), (0.2, 0, -0.02), PINK, ft)                           # liseré néon
        J.update({'hip' + side: h, 'knee' + side: k, 'foot' + side: ft})
        s = b.piv('sh' + side, (0, sg * (tw_y / 2 + 0.08), th - 0.12), tor)
        b.part('rbox', (0.22, 0.22, 0.38), (0, 0, -0.17), 'tex:chef_jacket', s)
        e = b.piv('el' + side, (0, 0, -0.36), s)
        b.part('rbox', (0.2, 0.2, 0.3), (0, 0, -0.14), 'tex:chef_jacket', e)
        b.part('rbox', (0.22, 0.22, 0.06), (0, 0, -0.28), GOLD, e)                             # manchette dorée
        hd = b.piv('hand' + side, (0, 0, -0.32), e)
        b.part('rbox', (0.18, 0.16, 0.18), (0.02, 0, -0.08), SKIN, hd)
        J.update({'sh' + side: s, 'el' + side: e, 'hand' + side: hd})

    # veste de chef croisée + gros ventre
    b.part('rbox', (tw_x, tw_y, th), (0, 0, th / 2), 'tex:chef_jacket', tor)
    b.part('rbox', (0.86, 0.86, 0.42), (0.06, 0, 0.32), 'tex:chef_jacket', tor)               # ventre
    for row in range(3):                                                                        # boutons « BlingCoin »
        for sg in (-1, 1):
            b.part('cyl', (0.07, 0.07, 0.03), (0.49, sg * 0.14, 0.2 + row * 0.2), GOLD, tor, rot=(0, 90, 0), seg=8)
    b.part('box', (0.02, 0.5, 0.04), (0.5, 0, 0.12), PINK, tor)                                # ceinture néon
    b.part('rbox', (0.3, 0.5, 0.12), (0.22, 0, th - 0.02), RED, tor)                            # foulard rouge
    b.part('box', (0.03, 0.18, 0.14), (0.38, 0.06, th - 0.12), RED, tor, rot=(20, 0, 0))
    b.part('box', (0.02, 0.16, 0.08), (0.37, -0.16, th - 0.2), PINK, tor)                       # badge « ÉTOILÉ »

    # terminal de paiement greffé dans le dos = POINT FAIBLE (pivot 'tpe')
    tpe = b.piv('tpe', (-tw_x / 2 - 0.02, 0, th * 0.55), tor)
    b.part('rbox', (0.16, 0.42, 0.52), (-0.06, 0, 0), '#2a2d40', tpe)
    scr = b.part('box', (0.03, 0.32, 0.18), (-0.15, 0, 0.12), PINK, tpe)
    scr.name = 'tpe_screen'
    for i in range(3):                                                                          # pavé numérique
        for j in range(2):
            b.part('box', (0.03, 0.07, 0.05), (-0.15, -0.08 + i * 0.08, -0.06 - j * 0.08), CYAN, tpe)
    b.part('box', (0.03, 0.3, 0.04), (-0.15, 0, -0.24), '#fff8e0', tpe)                         # ticket qui sort
    for sg in (-1, 1):                                                                          # câbles vers la nuque
        b.part('cyl', (0.04, 0.04, 0.4), (-0.02, sg * 0.15, 0.36), '#9aa3b8', tpe, rot=(0, -25, 0), seg=6)

    # tête : joues rondes, moustache en crocs, monocle-étiquette de prix
    head = b.piv('head', (0, 0, th + 0.06), tor)
    J['head'] = head
    hs = 0.5
    b.part('cyl', (0.18, 0.18, 0.1), (0, 0, 0), SKIN, head, seg=6)
    b.part('sph', (hs * 0.95, hs * 0.92, hs), (0.02, 0, hs / 2 + 0.02), SKIN, head, seg=12, smooth=True)
    for sg in (-1, 1):
        b.part('sph', (0.16, 0.12, 0.12), (0.17, sg * 0.15, 0.17), '#f2a08a', head, seg=8)    # joues rouges
        b.part('rbox', (0.07, 0.24, 0.06), (0.25, sg * 0.14, 0.15), '#3a2418', head, rot=(sg * 25, 0, 0))
        b.part('sph', (0.06, 0.06, 0.06), (0.24, sg * 0.26, 0.21), '#3a2418', head, seg=6)    # pointe recourbée
    b.part('sph', (0.09, 0.08, 0.1), (0.26, 0, 0.22), SKIN_D, head, seg=6)                    # nez
    b.part('box', (0.03, 0.08, 0.04), (0.255, 0.1, 0.32), '#1a1c2c', head)                     # oeil
    b.part('cyl', (0.13, 0.13, 0.02), (0.255, -0.1, 0.32), GOLD, head, rot=(0, 90, 0), seg=10)  # monocle
    b.part('cyl', (0.1, 0.1, 0.025), (0.258, -0.1, 0.32), CYAN, head, rot=(0, 90, 0), seg=10)
    b.part('box', (0.02, 0.12, 0.08), (0.26, -0.26, 0.24), '#fff8e0', head)                    # étiquette « PRIX »
    b.part('box', (0.04, 0.2, 0.03), (0.24, -0.1, 0.4), '#3a2418', head, rot=(15, 0, 0))       # sourcil froncé

    # toque géante = BOUCLIER frontal (pivot 'toque')
    tq = b.piv('toque', (0, 0, hs + 0.04), head)
    b.part('cyl', (0.52, 0.52, 0.14), (0, 0, 0.0), '#f6f6fb', tq, seg=12)                      # bandeau
    b.part('cyl', (0.53, 0.53, 0.04), (0, 0, 0.0), GOLD, tq, seg=12)                           # liseré or
    b.part('cyl', (0.5, 0.5, 0.55), (0, 0, 0.32), 'tex:chef_jacket', tq, seg=12)
    for i in range(6):                                                                          # plis bouffants
        a = i * math.pi / 3
        b.part('sph', (0.3, 0.3, 0.26), (math.cos(a) * 0.18, math.sin(a) * 0.18, 0.66), '#f6f6fb', tq, seg=8)
    b.part('sph', (0.32, 0.32, 0.3), (0, 0, 0.74), '#f6f6fb', tq, seg=8)
    b.part('box', (0.03, 0.3, 0.12), (0.25, 0, 0.18), PINK, tq)                                # enseigne « B » BlingCo
    b.part('box', (0.035, 0.12, 0.05), (0.255, 0, 0.18), GOLD, tq)

    # arme : rouleau de tickets d'addition qui se déroule (main proche)
    roll = b.piv('roll', (0.06, 0, -0.12), J['handN'])
    b.part('cyl', (0.24, 0.24, 0.26), (0, 0, 0), '#fff8e0', roll, rot=(90, 0, 0), seg=10)
    b.part('cyl', (0.08, 0.08, 0.28), (0, 0, 0), GOLD, roll, rot=(90, 0, 0), seg=6)
    for i in range(4):                                                                          # ruban de ticket
        b.part('box', (0.02, 0.2, 0.25), (0.1, 0, -0.2 - i * 0.22), '#fff8e0', roll)
        b.part('box', (0.025, 0.12, 0.02), (0.11, 0, -0.16 - i * 0.22), RED, roll)
    # main éloignée : louche-scanner
    ld = b.piv('ladle', (0.04, 0, -0.1), J['handF'])
    b.part('cyl', (0.04, 0.04, 0.7), (0, 0, 0.25), '#9aa3b8', ld, seg=6)
    b.part('sph', (0.22, 0.22, 0.12), (0, 0, -0.12), '#9aa3b8', ld, seg=8)
    b.part('cyl', (0.16, 0.16, 0.02), (0, 0, -0.07), CYAN, ld, seg=8)
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


POSE = dict(shN=35, elN=70, shF=15, elF=50, hipN=8, hipF=-8, kneeN=-6, torso=-4)
renders = []
sc = setup_scene("S3K_chef", 460, 460, style='funk')
b = B(sc)
J = build_chef(b)
apply_pose(J, POSE)
for label, yaw in (('trois_quarts', 45), ('profil', 0), ('dos', 200)):
    for o in [o for o in sc.collection.objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 460, 1.55, yaw=yaw, ppu=110)
    p = os.path.join(SHEET_DIR, "chef_%s.png" % label)
    render_to(sc, p)
    renders.append(p)
if EXPORT:
    apply_pose(J, {})
    export(sc, 'chef')
result = {"renders": renders}
