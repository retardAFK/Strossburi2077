# Validé par Maxime le 21/11/2026 (« Parfait »), version v2 mi-chair mi-robot.
# Boss niveau 5 (Petite France 2067, après ASR-67 Premium+) : Al2 Prout, androïde chargé de la surveillance
# et de la sécurité des « consommateurs fidèles ». Personnage 100 % inventé (caricature du TYPE « chef de la
# sécurité / autorité »), d'aucune personne réelle. Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\al2prout.py", encoding="utf-8").read())
# Étape VALIDATION : planche tools/blender/out/al2prout_*.png
# Choix de Maxime (21/11/2026) : « tourelle humanoïde style autorité sécuritaire » ; ridicule : bruits de pet
# (réacteurs dorsaux) + badge VIP clignotant ; inquiétant : caméras partout + scanner rouge ;
# « plus transhumain, mi-chair mi-robot » : visage et bras coupés en deux, chair / métal.
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
NAVY, NAVY_D, STEEL, DARK, RED, GOLD, CYAN = '#1c2440', '#121830', '#9aa3b8', '#14141c', '#ff1a3c', '#ffc040', '#38f2ff'


def cam(b, parent, loc, rot=(0, 0, 0), s=1.0):
    """Petite caméra de surveillance : boîtier + objectif rouge."""
    c = b.piv('cam', loc, parent)
    c.rotation_euler = [math.radians(a) for a in rot]
    b.part('rbox', (0.14 * s, 0.1 * s, 0.09 * s), (0, 0, 0), '#e8e8f0', c)
    b.part('cyl', (0.07 * s, 0.07 * s, 0.05 * s), (0.08 * s, 0, 0), DARK, c, rot=(0, 90, 0), seg=6)
    b.part('sph', (0.04 * s, 0.04 * s, 0.04 * s), (0.1 * s, 0, 0), RED, c, seg=6)
    return c


def build_al2prout(b):
    root = b.piv('root')
    # base-tourelle blindée (pas de jambes : il pivote sur place), roulement doré
    b.part('cyl', (1.3, 1.3, 0.35), (0, 0, 0.18), NAVY_D, root, seg=10)
    b.part('cyl', (1.05, 1.05, 0.12), (0, 0, 0.41), GOLD, root, seg=10)
    turret = b.piv('turret', (0, 0, 0.47), root)
    # torse d'uniforme de vigile, épaules énormes, petite tête : l'autorité par la masse
    b.part('rbox', (0.7, 1.0, 1.1), (0, 0, 0.6), NAVY, turret, r2=0.25)
    b.part('rbox', (0.5, 0.5, 0.25), (0, -0.62, 1.05), NAVY, turret)                  # épaulettes
    b.part('rbox', (0.5, 0.5, 0.25), (0, 0.62, 1.05), NAVY, turret)
    for y in (-0.62, 0.62):
        b.part('box', (0.52, 0.5, 0.04), (0, y, 1.19), GOLD, turret)                    # galons or
    b.part('box', (0.04, 0.9, 0.08), (0.36, 0, 0.2), DARK, turret)                      # ceinturon
    b.part('box', (0.06, 0.18, 0.1), (0.37, 0, 0.2), GOLD, turret)
    # BADGE VIP clignotant (ridicule) : énorme, sur la poitrine
    badge = b.piv('badge', (0.37, -0.2, 0.8), turret)
    b.part('rbox', (0.05, 0.34, 0.24), (0, 0, 0), GOLD, badge)
    b.part('box', (0.055, 0.26, 0.06), (0.005, 0, 0.04), RED, badge)                    # bandeau « SÉCURITÉ PREMIUM+ »
    b.part('sph', (0.06, 0.06, 0.06), (0.03, 0.13, 0.09), RED, badge, seg=6)            # gyrophare du badge
    # bras : matraque-projecteur et main levée « STOP »
    for side, y, rotx in (('N', -0.62, 0), ('F', 0.62, 0)):
        sh = b.piv('sh' + side, (0, y, 0.95), turret)
        b.part('rbox', (0.28, 0.28, 0.7), (0.05, 0, -0.35), NAVY, sh)
        el = b.piv('el' + side, (0.05, 0, -0.7), sh)
        if side == 'F':
            b.part('rbox', (0.22, 0.22, 0.5), (0.15, 0, -0.1), '#e2a98a', el, rot=(0, -60, 0))   # avant-bras de chair
        else:
            b.part('box', (0.12, 0.12, 0.5), (0.15, 0, -0.1), STEEL, el, rot=(0, -60, 0))         # avant-bras robot
            b.part('cyl', (0.06, 0.06, 0.45), (0.15, 0.09, -0.06), '#5a606e', el, rot=(0, -60, 0), seg=6)  # vérin
            b.part('cyl', (0.06, 0.06, 0.45), (0.15, -0.09, -0.06), '#5a606e', el, rot=(0, -60, 0), seg=6)
        b.part('rbox', (0.22, 0.26, 0.24), (0.38, 0, 0.05), '#d8d8e0', el)              # gants blancs
    b.part('box', (0.08, 0.08, 0.7), (0.6, -0.62, 0.0), DARK, turret, rot=(0, 70, 0))   # matraque
    # tête : petite, casquette d'autorité, visière-scanner rouge
    head = b.piv('head', (0, 0, 1.3), turret)
    # visage TRANSHUMAIN : moitié chair (côté F), moitié robot (côté N) — visage générique inventé
    SKIN, SKIN_D = '#e2a98a', '#b87a62'
    b.part('rbox', (0.36, 0.17, 0.34), (0, 0.085, 0.17), SKIN, head)                   # moitié chair
    b.part('rbox', (0.36, 0.17, 0.34), (0, -0.085, 0.17), STEEL, head)                 # moitié métal
    b.part('box', (0.37, 0.012, 0.36), (0, 0.0, 0.17), '#7a3a3a', head)                # suture / jointure
    for z in (0.08, 0.2, 0.3):
        b.part('box', (0.02, 0.03, 0.02), (0.18, 0.0, z), '#c8ccd8', head)              # agrafes
    b.part('sph', (0.05, 0.05, 0.05), (0.17, 0.08, 0.2), '#f4f0e8', head, seg=6)       # œil humain
    b.part('sph', (0.025, 0.025, 0.025), (0.19, 0.08, 0.2), '#2a1a12', head, seg=6)
    b.part('box', (0.03, 0.1, 0.02), (0.18, 0.08, 0.26), '#3a2a20', head)              # sourcil froncé
    b.part('box', (0.06, 0.04, 0.06), (0.2, 0.03, 0.14), SKIN_D, head)                  # nez
    b.part('box', (0.02, 0.1, 0.02), (0.185, 0.05, 0.07), '#8a3a3a', head, rot=(12, 0, 0))  # rictus
    b.part('cyl', (0.1, 0.1, 0.04), (0.19, -0.08, 0.2), RED, head, rot=(0, 90, 0), seg=8)   # œil-scanner rouge
    b.part('cyl', (0.14, 0.14, 0.02), (0.18, -0.08, 0.2), DARK, head, rot=(0, 90, 0), seg=8)
    b.part('box', (0.04, 0.12, 0.04), (0.18, -0.08, 0.07), DARK, head)                 # grille-bouche
    b.part('box', (0.02, 0.02, 0.2), (0.0, -0.18, 0.15), '#ff7a1a', head)              # câbles qui sortent
    b.part('box', (0.02, 0.02, 0.16), (-0.06, -0.18, 0.1), CYAN, head)
    b.part('cyl', (0.46, 0.46, 0.1), (0.02, 0, 0.38), NAVY, head, seg=10)               # casquette
    b.part('box', (0.22, 0.4, 0.03), (0.2, 0, 0.34), DARK, head)                        # visière casquette
    b.part('box', (0.03, 0.12, 0.07), (0.2, 0, 0.42), GOLD, head)                       # insigne
    b.piv('scanner', (0.22, -0.08, 0.2), head)                                               # origine du rayon rouge
    # CAMÉRAS PARTOUT (inquiétant)
    for loc, rot in (((0.3, -0.35, 1.0), (0, 0, -20)), ((0.3, 0.35, 0.55), (0, 0, 20)), ((0.1, -0.7, 1.22), (0, -20, -40)),
                     ((0.1, 0.7, 1.22), (0, -20, 40)), ((-0.36, 0, 0.9), (0, 0, 180)), ((0.0, 0, 1.75), (0, -30, 0)),
                     ((0.25, 0, 0.05), (0, 20, 0))):
        cam(b, turret, loc, rot)
    for a in range(0, 360, 60):  # couronne de caméras autour de la base
        r = math.radians(a)
        cam(b, root, (0.68 * math.cos(r), 0.68 * math.sin(r), 0.3), (0, 0, a), s=0.9)
    # RÉACTEURS DORSAUX « prout » (ridicule) : deux tuyères avec petits nuages
    for y in (-0.22, 0.22):
        b.part('cyl', (0.18, 0.18, 0.3), (-0.4, y, 0.25), STEEL, turret, rot=(0, 90, 0), seg=8)
        b.part('cyl', (0.13, 0.13, 0.05), (-0.56, y, 0.25), DARK, turret, rot=(0, 90, 0), seg=8)
        for k, sz in enumerate((0.14, 0.11, 0.08)):
            b.part('sph', (sz, sz, sz), (-0.7 - k * 0.14, y, 0.22 - k * 0.04), '#b8c890', turret, seg=6)
    b.piv('prout', (-0.6, 0, 0.25), turret)                                              # origine du nuage
    return root


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_al2prout", 560, 600)
build_al2prout(B(sc))
for label, yaw in (('trois_quarts', 35), ('face', 90), ('dos', 215)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 560, 1.15, yaw=yaw, ppu=210)
    p = os.path.join(SHEET_DIR, f"al2prout_{label}.png"); render_to(sc, p); renders.append(p)

sc3 = scene("S3K_al2prout_echelle", 560, 600)
win = bpy.context.window; prev = win.scene; win.scene = sc3
try:
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODEL_DIR, "ultra.glb"))
finally:
    win.scene = prev
a = build_al2prout(B(sc3)); a.location = (0.3, 1.5, 0); a.rotation_euler = (0, 0, math.radians(-20))
sprite_camera(sc3, 560, 1.3, yaw=60, ppu=95)
p = os.path.join(SHEET_DIR, "al2prout_echelle.png"); render_to(sc3, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    s = scene("S3K_exp_al2prout", 64, 64)
    build_al2prout(B(s))
    win = bpy.context.window; prev = win.scene; win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, "al2prout.glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    result["glb"] = "al2prout.glb"
