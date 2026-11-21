# Validé par Maxime le 21/11/2026 (« parfait »).
# Boss du Kalt (2026) : le Magnat du Carré VIP. Personnage inventé (caricature du TYPE « flambeur de carré VIP »).
# Idée de Maxime : le Kalt est une boîte techno industrielle ALL BLACK ; « de base il ne doit pas y avoir de carré VIP
# au Kalt, c'est ça qui doit choquer » → le carré VIP doré de BlingCo jure violemment avec le béton noir.
# Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\magnat_vip.py", encoding="utf-8").read())
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
GOLD, GOLD_D, BLACK, CONC, RED, WHITE, SKIN, PINK = '#ffc040', '#c8901a', '#0e0e12', '#2a2a30', '#c0102a', '#f4f0e8', '#e8b48c', '#ff4fa3'


def magnat(b, parent):
    """Le flambeur, affalé : costume satin blanc, chemise ouverte, lunettes de soleil la nuit, bracelet VIP doré,
    une bouteille à étincelles dans chaque main."""
    p = b.piv('magnat', (0, 0, 0), parent)
    b.part('rbox', (0.5, 0.6, 0.6), (0, 0, 0.3), WHITE, p, r2=0.3)
    b.part('box', (0.02, 0.18, 0.25), (0.26, 0, 0.42), '#f0c8a8', p)                       # chemise ouverte
    b.part('box', (0.6, 0.2, 0.2), (0.3, -0.12, -0.05), WHITE, p)                           # jambes allongées
    b.part('box', (0.6, 0.2, 0.2), (0.3, 0.12, -0.05), WHITE, p)
    b.part('rbox', (0.2, 0.14, 0.12), (0.62, -0.12, -0.05), GOLD, p)                        # mocassins dorés
    b.part('rbox', (0.2, 0.14, 0.12), (0.62, 0.12, -0.05), GOLD, p)
    h = b.piv('head', (0.02, 0, 0.75), p)
    b.part('rbox', (0.28, 0.26, 0.3), (0, 0, 0.1), SKIN, h, r2=0.4)
    b.part('rbox', (0.3, 0.28, 0.08), (-0.02, 0, 0.26), '#2a1a12', h)                     # cheveux plaqués
    b.part('box', (0.04, 0.3, 0.07), (0.14, 0, 0.13), BLACK, h)                             # lunettes de soleil (la nuit)
    b.part('box', (0.03, 0.14, 0.02), (0.15, 0, 0.02), '#c06a5a', h)                        # sourire suffisant
    for side, y, s in (('N', -0.42, -1), ('F', 0.42, 1)):
        sh = b.piv('sh' + side, (0, y * 0.8, 0.5), p)
        sh.rotation_euler = (math.radians(-60 * s), 0, 0)                                    # bras levés, bouteilles en l'air
        b.part('rbox', (0.16, 0.16, 0.45), (0, 0, 0.2), WHITE, sh)
        b.part('box', (0.17, 0.17, 0.05), (0, 0, 0.36), GOLD, sh)                            # bracelet VIP doré
        bt = b.piv('bouteille' + side, (0, 0, 0.5), sh)
        b.part('cyl', (0.1, 0.1, 0.28), (0, 0, 0.1), '#1a4a2a', bt, seg=8)
        b.part('cyl', (0.05, 0.05, 0.1), (0, 0, 0.29), GOLD, bt, seg=6)
        for k in range(5):                                                                    # étincelles
            a = k * 1.25
            b.part('box', (0.025, 0.025, 0.025), (0.06 * math.cos(a), 0.06 * math.sin(a), 0.38 + 0.03 * k), '#fff4a0', bt)
    return p


def build_magnat(b):
    root = b.piv('root')
    # CARRÉ VIP volant : estrade dorée sur réacteurs, cordons de velours rouge, canapé doré capitonné
    sofa = b.piv('carre_vip', (0, 0, 0.9), root)
    b.part('cyl', (1.8, 1.8, 0.2), (0, 0, 0), GOLD_D, sofa, seg=12)
    b.part('cyl', (1.85, 1.85, 0.05), (0, 0, 0.12), GOLD, sofa, seg=12)
    for a in range(0, 360, 60):                                                              # potelets + cordon rouge
        r = math.radians(a)
        b.part('cyl', (0.06, 0.06, 0.45), (0.82 * math.cos(r), 0.82 * math.sin(r), 0.35), GOLD, sofa, seg=6)
        b.part('sph', (0.1, 0.1, 0.1), (0.82 * math.cos(r), 0.82 * math.sin(r), 0.6), GOLD, sofa, seg=6)
        r2 = math.radians(a + 30)
        b.part('box', (0.04, 0.8, 0.05), (0.78 * math.cos(r2), 0.78 * math.sin(r2), 0.5), RED, sofa, rot=(0, 0, a + 30 + 90))
    b.part('rbox', (0.5, 1.2, 0.35), (-0.35, 0, 0.3), GOLD, sofa)                            # assise
    b.part('rbox', (0.25, 1.3, 0.7), (-0.6, 0, 0.5), GOLD, sofa)                             # dossier capitonné
    for y in (-0.4, 0, 0.4):
        for z in (0.35, 0.65):
            b.part('sph', (0.06, 0.06, 0.06), (-0.47, y, z), GOLD_D, sofa, seg=6)
    b.part('box', (0.04, 0.9, 0.18), (0.75, 0, 0.75), PINK, sofa)                            # néon rose « VIP » qui jure
    b.part('cyl', (0.3, 0.3, 0.4), (0.4, 0.55, 0.32), '#c0c8d0', sofa, seg=8)               # seau à champagne
    for x, y in ((0.6, 0.6), (0.6, -0.6), (-0.6, 0.6), (-0.6, -0.6)):                        # réacteurs dessous
        b.part('cyl', (0.25, 0.25, 0.3), (x, y, -0.25), BLACK, sofa, seg=8)
        b.part('cone', (0.22, 0.22, 0.35), (x, y, -0.55), '#ff9a3c', sofa, rot=(180, 0, 0), seg=6)
    magnat(b, sofa).location = (-0.3, 0, 0.5)
    return root


def kalt_decor(b):
    """Bout de décor du Kalt pour juger le contraste : béton noir, poutres d'acier, grille, stroboscope."""
    d = b.piv('kalt', (0, 0, 0))
    b.part('box', (6, 6, 0.1), (0, 0, -0.05), CONC, d)
    b.part('box', (0.3, 6, 3.5), (-2.6, 0, 1.75), BLACK, d)
    for y in (-2, 0, 2):
        b.part('box', (0.2, 0.2, 3.5), (-2.3, y, 1.75), '#3a3a42', d)
    b.part('box', (0.1, 5, 0.15), (-2.3, 0, 3.3), '#3a3a42', d)
    b.part('box', (0.15, 0.6, 0.15), (-2.2, -1, 3.0), WHITE, d)                               # strobo
    b.part('box', (4, 0.02, 0.02), (0, 0.5, 2.5), '#ff1a3c', d, rot=(0, 0, 30))               # laser
    return d


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_magnat", 640, 600)
kalt_decor(B(sc))
build_magnat(B(sc))
for label, yaw in (('trois_quarts', 35), ('face', 90)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 640, 1.5, yaw=yaw, ppu=135)
    p = os.path.join(SHEET_DIR, f"magnat_{label}.png"); render_to(sc, p); renders.append(p)
sc2 = scene("S3K_magnat_perso", 420, 420)
magnat(B(sc2), None)
sprite_camera(sc2, 420, 0.5, yaw=40, ppu=230)
p = os.path.join(SHEET_DIR, "magnat_perso.png"); render_to(sc2, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    s = scene("S3K_exp_magnat", 64, 64)
    build_magnat(B(s))
    win = bpy.context.window; prev = win.scene; win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, "magnat_vip.glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    result["glb"] = "magnat_vip.glb"
