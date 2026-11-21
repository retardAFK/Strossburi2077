# Validé par Maxime le 21/11/2026 (« parfait »), version v2.
# Boss niveau 3 (Port du Rhin 2026) : le Promoteur. Personnage 100 % inventé (caricature du TYPE « promoteur /
# agent immobilier »), d'aucune personne réelle. Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\promoteur.py", encoding="utf-8").read())
# Étape VALIDATION : planche tools/blender/out/promoteur_*.png
# Choix de Maxime (21/11/2026) : exosquelette-grue (la flèche de grue lui sert de bras) ; look agent immobilier
# (sourire XXL, clés, pancarte VENDU) ; préfabriqués = les 3 satires (logement-boîte « LUXE/ÉCO », bureaux vides,
# bobo-loft) ; ton grotesque ET inquiétant. Retours : préfabriqués à l'échelle ; tête de « start-up boy business man foireux ».
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
YEL, YEL_D, DARK, STEEL, RED, GOLD, SKIN = '#ffc21a', '#d89a10', '#1a1a22', '#8a90a0', '#e8303a', '#ffc040', '#e8b48c'
SUIT = '#5a6a8a'


def seg(b, p0, p1, w, col, parent):
    dx, dz = p1[0] - p0[0], p1[1] - p0[1]
    return b.part('box', (w, w, math.hypot(dx, dz) + w * 0.4), ((p0[0] + p1[0]) / 2, 0, (p0[1] + p1[1]) / 2), col, parent,
                  rot=(0, math.degrees(math.atan2(dx, dz)), 0))


def lattice(b, parent, p0, p1, w=0.32, col=YEL):
    """Poutre de grue en treillis entre deux points du plan XZ (deux longerons + croisillons)."""
    g = b.piv('treillis', (0, 0, 0), parent)
    n = max(2, int(math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 0.35))
    for y in (-w / 2, w / 2):
        o = seg(b, p0, p1, 0.06, col, g); o.location.y = y
    for i in range(n):
        a = (p0[0] + (p1[0] - p0[0]) * i / n, p0[1] + (p1[1] - p0[1]) * i / n)
        c = (p0[0] + (p1[0] - p0[0]) * (i + 1) / n, p0[1] + (p1[1] - p0[1]) * (i + 1) / n)
        d = seg(b, a, c, 0.035, YEL_D, g); d.location.y = 0; d.rotation_euler.x = math.radians(35 if i % 2 else -35)
    return g


PREFAB_SCALE = 2.4  # à l'échelle : un préfabriqué ≈ un studio (≈ 1,2 de côté, l'Ultra ≈ 1,95)


def prefab(b, parent, kind, loc, k=PREFAB_SCALE):
    """Les trois satires de préfabriqués : boîte LUXE/ÉCO, bureau vide, bobo-loft."""
    p = b.piv('prefab_' + kind, loc, parent)
    p.scale = (k, k, k)
    if kind == 'boite':
        b.part('rbox', (0.5, 0.5, 0.5), (0, 0, 0), '#f2efe6', p)
        b.part('box', (0.02, 0.18, 0.18), (0.26, 0, 0.05), '#38f2ff', p)                  # unique fenêtre minuscule
        b.part('box', (0.02, 0.4, 0.09), (0.26, 0, -0.17), GOLD, p)                        # bandeau « LUXE »
        b.part('box', (0.02, 0.1, 0.1), (0.26, 0.17, 0.17), '#2ab04a', p)                  # pastille « ÉCO »
    elif kind == 'bureau':
        b.part('box', (0.45, 0.45, 0.8), (0, 0, 0), '#3a4a6a', p)
        for z in (-0.25, 0.0, 0.25):
            b.part('box', (0.46, 0.4, 0.12), (0, 0, z), '#1a2a48', p)                       # vitres noires, vides
        b.part('box', (0.02, 0.3, 0.1), (0.24, 0, 0.36), RED, p)                            # « À LOUER »
    else:  # bobo-loft
        b.part('box', (0.55, 0.5, 0.4), (0, 0, 0), '#a85a3a', p)                            # brique
        b.part('box', (0.56, 0.42, 0.22), (0, 0, 0.03), '#2a2a34', p)                       # verrière d'atelier
        b.part('box', (0.04, 0.04, 0.12), (0.2, -0.18, 0.26), '#2ab04a', p)                 # plante en plastique
        b.part('sph', (0.08, 0.08, 0.08), (0.2, -0.18, 0.34), '#3ad05a', p, seg=6)
        b.part('cyl', (0.12, 0.12, 0.02), (0.29, 0.1, -0.1), DARK, p, rot=(90, 0, 0), seg=8)   # vélo (roues)
        b.part('cyl', (0.12, 0.12, 0.02), (0.29, 0.26, -0.1), DARK, p, rot=(90, 0, 0), seg=8)
    return p


def build_promoteur(b):
    root = b.piv('root')
    # jambes d'exosquelette à vérins + bottes de chantier
    for side, y in (('N', -0.32), ('F', 0.32)):
        hp = b.piv('hip' + side, (0, y, 1.2), root)
        b.part('box', (0.22, 0.22, 0.65), (0, 0, -0.32), YEL, hp)
        b.part('cyl', (0.07, 0.07, 0.6), (0.14, 0, -0.35), STEEL, hp, seg=6)
        kn = b.piv('knee' + side, (0, 0, -0.65), hp)
        b.part('box', (0.2, 0.2, 0.55), (0, 0, -0.27), YEL_D, kn)
        b.part('rbox', (0.45, 0.3, 0.15), (0.08, 0, -0.55), DARK, kn)
    # bassin-châssis + contrepoids de grue dans le dos (bloc de béton « RENTABILITÉ »)
    b.part('rbox', (0.6, 0.9, 0.3), (0, 0, 1.25), YEL_D, root)
    b.part('box', (0.5, 0.8, 0.6), (-0.55, 0, 1.6), '#9a9a9a', root)                       # contrepoids béton
    b.part('box', (0.02, 0.6, 0.12), (-0.81, 0, 1.6), RED, root)
    torso = b.piv('torso', (0, 0, 1.4), root)
    # l'agent immobilier : costume brillant, cravate rouge, badge « VENDEUR DU MOIS »
    b.part('rbox', (0.45, 0.6, 0.6), (0, 0, 0.3), SUIT, torso, r2=0.3)
    b.part('box', (0.02, 0.16, 0.4), (0.23, 0, 0.35), '#f4f0e0', torso)
    b.part('box', (0.025, 0.07, 0.32), (0.245, 0, 0.32), RED, torso)
    b.part('cyl', (0.1, 0.1, 0.02), (0.24, -0.18, 0.45), GOLD, torso, rot=(0, 90, 0), seg=8)
    b.part('rbox', (0.5, 0.8, 0.14), (-0.05, 0, 0.62), YEL, torso)                          # harnais d'exo
    head = b.piv('head', (0.02, 0, 0.78), torso)
    b.part('rbox', (0.3, 0.28, 0.32), (0, 0, 0.12), SKIN, head, r2=0.4)
    b.part('box', (0.04, 0.24, 0.08), (0.15, 0, 0.04), '#ffffff', head)                     # sourire XXL (dents)
    b.part('box', (0.035, 0.26, 0.02), (0.155, 0, 0.0), '#c06a5a', head)
    for y in (-0.06, 0.06):
        b.part('sph', (0.04, 0.04, 0.04), (0.15, y, 0.16), DARK, head, seg=6)
    # « start-up boy business man foireux » : rasé de près, undercut + houppe, lunettes rondes, écouteur blanc
    b.part('rbox', (0.3, 0.29, 0.05), (-0.02, 0, 0.27), '#6a4a2a', head)                   # côtés rasés
    b.part('rbox', (0.22, 0.2, 0.12), (0.04, 0, 0.33), '#8a6234', head, rot=(0, -18, 0))  # houppe gominée
    for y in (-0.065, 0.065):
        b.part('cyl', (0.09, 0.09, 0.02), (0.16, y, 0.16), '#3a2414', head, rot=(0, 90, 0), seg=8)   # lunettes rondes
        b.part('cyl', (0.07, 0.07, 0.022), (0.162, y, 0.16), '#bfe8ff', head, rot=(0, 90, 0), seg=8)
    b.part('sph', (0.035, 0.035, 0.035), (0.0, -0.15, 0.1), '#ffffff', head, seg=6)       # écouteur sans fil
    # doudoune sans manches de start-up par-dessus la veste
    b.part('rbox', (0.47, 0.63, 0.42), (0, 0, 0.26), '#1c2a4a', torso, r2=0.3)
    b.part('box', (0.02, 0.02, 0.4), (0.24, 0.0, 0.26), '#c8ccd8', torso)                # zip
    b.part('box', (0.02, 0.12, 0.08), (0.24, 0.17, 0.4), '#ffffff', torso)                # logo « disruptif »
    # bras gauche humain : pancarte VENDU + trousseau de clés
    shF = b.piv('shF', (0, 0.36, 0.5), torso)
    b.part('rbox', (0.16, 0.16, 0.5), (0.1, 0, -0.2), SUIT, shF, rot=(0, -30, 0))
    b.part('box', (0.03, 0.03, 0.6), (0.3, 0, 0.0), '#c98b52', shF)
    b.part('box', (0.03, 0.45, 0.3), (0.31, 0, 0.35), '#ffffff', shF)                      # pancarte
    b.part('box', (0.035, 0.38, 0.1), (0.315, 0, 0.35), RED, shF)                           # « VENDU »
    for k in range(4):
        b.part('box', (0.015, 0.03, 0.08), (0.28, -0.1 - k * 0.025, -0.15 - (k % 2) * 0.03), GOLD, shF)  # clés
    # bras droit = FLÈCHE DE GRUE en treillis, avec câble, crochet et préfabriqué suspendu
    jib = b.piv('jib', (0, -0.36, 0.55), torso)
    lattice(b, jib, (0, 0), (2.2, 1.5), w=0.4)
    lattice(b, jib, (2.2, 1.5), (3.4, 1.65), w=0.3)
    b.part('box', (0.025, 0.025, 1.0), (3.3, 0, 1.1), DARK, jib)                             # câble
    hook = b.piv('hook', (3.3, 0, 0.58), jib)
    b.part('box', (0.12, 0.12, 0.12), (0, 0, 0.05), RED, hook)
    prefab(b, hook, 'boite', (0, 0, -0.7))
    b.part('rbox', (0.25, 0.25, 0.25), (-0.05, 0, 0.12), YEL, jib)                          # moteur d'épaule
    # pile de préfabriqués « en stock » sur le dos, les trois satires
    prefab(b, root, 'bureau', (-1.0, -0.3, 1.9), k=1.2)
    prefab(b, root, 'loft', (-1.0, 0.35, 1.75), k=1.2)
    b.part('sph', (0.08, 0.08, 0.08), (0.0, 0, 2.55), '#ff8a1a', root, seg=6)               # gyrophare de chantier
    return root


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_promoteur", 900, 600)
build_promoteur(B(sc))
for label, yaw in (('trois_quarts', 35), ('profil', 0), ('face', 90)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 900, 1.7, yaw=yaw, ppu=110); [setattr(o, "location", o.location + __import__("mathutils").Vector((0, 0, 0))) for o in []]
    p = os.path.join(SHEET_DIR, f"promoteur_{label}.png"); render_to(sc, p); renders.append(p)
sc2 = scene("S3K_promoteur_prefabs", 600, 300)
bb = B(sc2)
for i, k in enumerate(('boite', 'bureau', 'loft')):
    prefab(bb, None, k, (0, -2.0 + i * 2.0, 0.4))
sprite_camera(sc2, 600, 0.4, yaw=80, ppu=95)
p = os.path.join(SHEET_DIR, "promoteur_prefabs.png"); render_to(sc2, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    out = []
    for name, fn in (("promoteur", build_promoteur),
                     ("prefab_boite", lambda b: prefab(b, None, 'boite', (0, 0, 0))),
                     ("prefab_bureau", lambda b: prefab(b, None, 'bureau', (0, 0, 0))),
                     ("prefab_loft", lambda b: prefab(b, None, 'loft', (0, 0, 0)))):
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
