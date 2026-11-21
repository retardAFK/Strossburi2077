# Niveau 1 (Petite France 2077) : pièces propres aux salles + objet + PNJ. Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\salles_pf.py", encoding="utf-8").read())
# Produit tools/blender/out/salles_pf_planche.png et, si EXPORT, assets/models/pf_<piece>.glb
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

s3k_lib.PATTERNS['gres'] = [[('#a85a54' if (y % 5 == 0 or (x + (y // 5) * 4) % 8 == 0) else '#c87a6a') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['tuiles'] = [[('#6a2a22' if (y % 3 == 0 or (x + (y // 3) * 2) % 4 == 0) else '#9a4030') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['paves'] = [[('#3a3448' if (x % 4 == 0 or (y % 4 == 0 and (x // 4 + y // 4) % 2 == 0)) else '#5a5268') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['eau'] = [[('#38f2ff' if (y % 7 == 0 and x % 5 < 2) else '#0c2238') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['bleu_blanc'] = [[('#1f5fd0' if (x // 4) % 2 == 0 else '#f4f6ff') for x in range(16)] for y in range(16)]

BOIS, GLASS, CYAN, PINK, GOLD, RED = '#4a2a18', '#1a2a48', '#38f2ff', '#ff2e88', '#ffc040', '#ff1a3c'
METAL, DARK, JOINT = '#2a2d40', '#14151f', '#3a3f52'


# ------------------------------------------------------------------ salle 3 : Ponts Couverts
def tour_peage(b):
    r = b.piv('root')
    b.part('box', (3.2, 3.2, 9.0), (0, 0, 4.5), 'tex:gres', r)                                  # tour carrée
    b.part('cone', (4.4, 4.4, 4.0), (0, 0, 11.0), 'tex:tuiles', r, rot=(0, 0, 45), seg=4)        # toit pyramidal
    for z in (3.2, 6.2):                                                                         # meurtrières… devenues caméras
        b.part('box', (0.1, 0.3, 0.8), (1.62, 0, z), DARK, r)
        b.part('sph', (0.18, 0.18, 0.18), (1.7, 0, z + 0.3), RED, r, seg=6)
    b.part('box', (0.1, 2.4, 1.2), (1.66, 0, 7.6), DARK, r)                                       # écran géant
    b.part('box', (0.12, 2.2, 0.25), (1.68, 0, 7.9), GOLD, r)                                     # « PASSAGE PATRIMOINE »
    b.part('box', (0.12, 1.4, 0.25), (1.68, 0, 7.4), PINK, r)                                     # « 12 € »
    b.part('box', (0.1, 1.6, 2.4), (1.62, 0, 1.2), '#2a1a12', r)                                  # porte
    for y in (-1.1, 1.1):                                                                         # tourniquets
        b.part('rbox', (0.5, 0.3, 1.0), (2.2, y, 0.5), METAL, r)
        b.part('box', (0.6, 0.04, 0.04), (2.2, y - 0.3 * (1 if y > 0 else -1), 0.85), CYAN, r)
        b.part('box', (0.04, 0.2, 0.15), (2.46, y, 0.95), GOLD, r)                               # lecteur de carte
    return r


def herse_laser(b):
    r = b.piv('root')
    for y in (-2.0, 2.0):
        b.part('box', (0.5, 0.5, 3.4), (0, y, 1.7), 'tex:gres', r)
    b.part('box', (0.5, 4.5, 0.5), (0, 0, 3.4), 'tex:gres', r)
    b.part('box', (0.3, 4.4, 0.2), (0, 0, 3.05), METAL, r)                                        # émetteur
    for i in range(7):                                                                            # barreaux laser
        b.part('box', (0.05, 0.05, 2.9), (0, -1.5 + i * 0.5, 1.55), RED, r)
    b.part('sph', (0.25, 0.25, 0.25), (0.3, 0, 3.4), RED, r, seg=6)
    return r


def pont(b):
    r = b.piv('root')
    b.part('box', (8.0, 4.0, 0.5), (0, 0, -0.25), 'tex:paves', r)                                 # tablier
    for y in (-2.1, 2.1):
        b.part('box', (8.0, 0.3, 0.9), (0, y, 0.45), 'tex:gres', r)                              # parapets
        b.part('box', (8.0, 0.08, 0.06), (0, y, 0.95), CYAN, r)
    for x in (-2.0, 2.0):                                                                         # piles
        b.part('box', (1.2, 4.0, 2.4), (x, 0, -1.7), 'tex:gres', r)
    b.part('box', (8.0, 0.25, 0.02), (0, 0, 0.01), GOLD, r)                                       # bande de guidage
    return r


# ------------------------------------------------------------------ salle 2 : l'Écluse
def vanne(b):
    r = b.piv('root')
    for y in (-1.6, 1.6):
        b.part('box', (1.0, 0.6, 3.6), (0, y, 0.8), 'tex:gres', r)                               # bajoyers
    gate = b.piv('gate', (0, 0, 0), r)                                                            # pivot animable (montée/descente)
    b.part('box', (0.3, 2.6, 2.4), (0, 0, 0.6), BOIS, gate)
    for z in (0.0, 0.8, 1.6):
        b.part('box', (0.34, 2.6, 0.12), (0, 0, z), METAL, gate)
    b.part('box', (0.6, 3.8, 0.3), (0, 0, 2.75), METAL, r)                                        # passerelle
    whl = b.piv('wheel', (0.2, 0, 3.4), r)                                                        # volant (animable)
    b.part('cyl', (0.9, 0.9, 0.08), (0, 0, 0), RED, whl, rot=(0, 90, 0), seg=10)
    b.part('cyl', (0.7, 0.7, 0.1), (0, 0, 0), DARK, whl, rot=(0, 90, 0), seg=10)
    b.part('box', (0.3, 0.6, 0.4), (-0.2, 1.1, 3.1), METAL, r)                                    # boîtier BlingCo
    b.part('box', (0.04, 0.4, 0.2), (-0.04, 1.1, 3.15), PINK, r)
    for i, c in enumerate((CYAN, CYAN, RED)):                                                     # jauge 3 niveaux d'eau
        b.part('box', (0.06, 0.3, 0.4), (0.52, -1.6, 0.0 + i * 0.6), c, r)
    return r


def levier(b):
    r = b.piv('root')
    b.part('rbox', (0.6, 0.6, 1.0), (0, 0, 0.5), METAL, r)
    b.part('box', (0.04, 0.4, 0.3), (0.31, 0, 0.7), CYAN, r)
    arm = b.piv('arm', (0, 0, 1.0), r)                                                            # pivot animable
    arm.rotation_euler = (math.radians(30), 0, 0)
    b.part('cyl', (0.08, 0.08, 1.0), (0, 0, 0.5), '#9aa3b8', arm, seg=6)
    b.part('sph', (0.22, 0.22, 0.22), (0, 0, 1.05), RED, arm, seg=8)
    return r


def barque(b):
    r = b.piv('root')
    b.part('rbox', (3.6, 1.8, 0.5), (0, 0, 0.0), BOIS, r)
    b.part('box', (3.4, 1.6, 0.06), (0, 0, 0.27), 'tex:paves', r)                                 # plateforme
    for y in (-0.92, 0.92):
        b.part('box', (3.6, 0.06, 0.06), (0, y, 0.3), CYAN, r)                                    # liseré néon
    b.part('rbox', (0.6, 0.6, 0.6), (-1.4, 0, 0.6), METAL, r)                                     # moteur autonome
    b.part('box', (0.04, 0.4, 0.2), (-1.09, 0, 0.7), PINK, r)
    b.part('box', (0.4, 0.4, 0.04), (1.4, 0, 0.3), GOLD, r)                                       # borne de paiement « 2 €/min »
    return r


# ------------------------------------------------------------------ salle 4 : Barrage Vauban
def arche_barrage(b):
    r = b.piv('root')
    b.part('box', (3.0, 1.2, 4.6), (0, -2.0, 2.3), 'tex:gres', r)                                 # piédroits
    b.part('box', (3.0, 1.2, 4.6), (0, 2.0, 2.3), 'tex:gres', r)
    b.part('box', (3.0, 5.2, 1.4), (0, 0, 5.3), 'tex:gres', r)                                    # linteau
    b.part('cyl', (2.8, 3.0, 2.8), (0, 0, 3.8), 'tex:gres', r, rot=(0, 90, 0), seg=10)            # voûte (demi-cercle masqué)
    b.part('box', (3.1, 2.8, 2.1), (0, 0, 2.6), DARK, r)                                          # ouverture
    b.part('box', (3.4, 5.6, 0.3), (0, 0, 6.15), 'tex:paves', r)                                  # terrasse « Rooftop Premium »
    for y in (-2.7, 2.7):
        b.part('box', (3.4, 0.08, 0.9), (1.5, y, 6.75), GLASS, r)                                 # garde-corps vitré
    b.part('box', (0.06, 5.6, 0.06), (1.7, 0, 7.2), GOLD, r)
    return r


def cible_tpe(b):
    r = b.piv('root')
    b.part('cyl', (0.14, 0.14, 1.2), (0, 0, 0.6), METAL, r, seg=6)
    head = b.piv('target', (0, 0, 1.5), r)                                                        # pivot animable (touchée)
    b.part('rbox', (0.25, 0.6, 0.8), (0, 0, 0), METAL, head)
    scr = b.part('box', (0.04, 0.46, 0.3), (0.14, 0, 0.15), PINK, head)
    scr.name = 'screen'
    for i in range(3):
        b.part('box', (0.04, 0.1, 0.08), (0.14, -0.15 + i * 0.15, -0.15), CYAN, head)
    b.part('cyl', (0.9, 0.9, 0.04), (0.16, 0, 0), RED, head, rot=(0, 90, 0), seg=12)             # anneau-cible
    b.part('cyl', (0.8, 0.8, 0.05), (0.16, 0, 0), DARK, head, rot=(0, 90, 0), seg=12)
    return r


def vitre(b):
    r = b.piv('root')
    for y in (-1.0, 1.0):
        b.part('box', (0.12, 0.12, 2.4), (0, y, 1.2), METAL, r)
    b.part('box', (0.12, 2.1, 0.12), (0, 0, 2.4), METAL, r)
    b.part('box', (0.04, 1.9, 2.2), (0, 0, 1.2), '#9fe8ff', r)                                    # vitre anti-écharpe
    b.part('box', (0.05, 1.2, 0.1), (0.02, 0, 1.9), CYAN, r)
    b.part('box', (0.05, 0.6, 0.1), (0.02, 0, 0.5), GOLD, r)                                      # étiquette « ANTI-ÉCHARPE »
    return r


# ------------------------------------------------------------------ salles 1-3 : petits props
def borne(b):
    r = b.piv('root')
    b.part('rbox', (0.5, 0.5, 1.3), (0, 0, 0.65), METAL, r)
    b.part('box', (0.04, 0.38, 0.34), (0.26, 0, 1.0), CYAN, r)                                    # logo sans contact
    for i in range(3):
        b.part('box', (0.045, 0.06 + i * 0.06, 0.03), (0.27, 0, 0.92 + i * 0.07), DARK, r)
    b.part('sph', (0.12, 0.12, 0.12), (0, 0, 1.4), GOLD, r, seg=6)                                # voyant (minuterie)
    return r


def cage(b):
    r = b.piv('root')
    b.part('box', (2.0, 2.0, 0.2), (0, 0, 0.1), METAL, r)
    b.part('box', (2.0, 2.0, 0.2), (0, 0, 2.6), METAL, r)
    for i in range(6):
        for sg in (-1, 1):
            b.part('box', (0.06, 0.06, 2.4), (sg * 0.95, -0.9 + i * 0.36, 1.35), GOLD, r)
            b.part('box', (0.06, 0.06, 2.4), (-0.9 + i * 0.36, sg * 0.95, 1.35), GOLD, r)
    b.part('box', (0.06, 1.4, 0.4), (1.0, 0, 2.2), DARK, r)                                       # « TRADITION CERTIFIÉE »
    b.part('box', (0.07, 1.2, 0.1), (1.01, 0, 2.2), PINK, r)
    return r


def coffre(b):
    r = b.piv('root')
    b.part('rbox', (1.0, 1.4, 0.7), (0, 0, 0.35), BOIS, r)
    lid = b.piv('lid', (-0.5, 0, 0.7), r)                                                         # pivot animable
    b.part('rbox', (1.0, 1.4, 0.3), (0.5, 0, 0.12), BOIS, lid)
    for y in (-0.5, 0.5):
        b.part('box', (1.04, 0.1, 1.0), (0, y, 0.5), GOLD, r)
    b.part('box', (0.06, 0.3, 0.3), (0.52, 0, 0.6), CYAN, r)                                      # serrure biométrique
    return r


def boomerang(b):
    r = b.piv('root')
    b.pretzel((0, 0, 0.5), 1.2, '#c8823a', r, bead=0.16)                                          # bretzel doré
    for i in range(0, 34, 2):                                                                     # ruban bleu et blanc enroulé (suit la courbe)
        t = i / 34 * 2 * math.pi
        x = 0.5 * math.sin(t) * (1 + 0.35 * math.cos(t)) * 1.2
        z = (0.32 * math.cos(t) * (1 - 0.6 * math.sin(t) ** 2) + 0.12 * math.cos(2 * t)) * 1.2
        b.part('box', (0.09, 0.1, 0.09), (x, -0.16, 0.5 + z), '#1f5fd0' if i % 4 else '#f4f6ff', r)
    b.part('box', (0.04, 0.3, 0.04), (0, -0.2, 0.5), CYAN, r)                                     # puce néon SCN
    return r


# ------------------------------------------------------------------ PNJ (humains, pas androïdes)
def winstubiere(b):
    P = dict(thigh=0.4, shin=0.38, leg_t=0.2, hip_w=0.11, pants='#2a1a2a', boots='#1a1012', foot_l=0.3,
             torso_h=0.62, tw_x=0.4, tw_y=0.5, shirt='#f4f0e8', head=0.44, skin='#f0c8a8', arm_t=0.15,
             upper=0.34, fore=0.32, sleeve='#f4f0e8')
    J = humanoid(b, P)
    t, h = J['torso'], J['head']
    b.part('box', (0.42, 0.52, 0.34), (0.01, 0, 0.42), '#1a1a22', t)                              # corselet noir
    b.part('box', (0.04, 0.42, 0.9), (0.22, 0, 0.05), 'tex:kelsch_red', t)                        # tablier en kelsch
    b.part('cone', (0.7, 0.75, 0.55), (0, 0, -0.2), '#9c1426', J['pelvis'], seg=10)               # jupe
    b.part('sph', (0.42, 0.42, 0.22), (-0.04, 0, 0.42), '#d8d8d8', h, seg=10)                      # cheveux gris
    b.part('sph', (0.16, 0.16, 0.16), (-0.2, 0, 0.36), '#d8d8d8', h, seg=6)                       # chignon
    for sg in (-1, 1):                                                                            # petit noeud alsacien stylisé
        b.part('box', (0.06, 0.28, 0.16), (-0.05, sg * 0.18, 0.5), '#1a1a22', h, rot=(sg * 25, 0, 0))
    b.part('box', (0.03, 0.08, 0.04), (0.235, 0, 0.17), '#9a5a5a', h)                             # sourire
    return J


def stade(b, celle):
    P = dict(thigh=0.44, shin=0.42, leg_t=0.2, hip_w=0.11, pants='#1a1c2c', boots='#f4f4f8', foot_l=0.34,
             torso_h=0.66, tw_x=0.4, tw_y=0.52, shirt='#2a2d40', head=0.44, skin='#e8b898' if celle else '#d8a07a',
             arm_t=0.16, upper=0.36, fore=0.34, sleeve='#2a2d40')
    J = humanoid(b, P)
    t, h = J['torso'], J['head']
    b.part('box', (0.44, 0.56, 0.2), (0, 0, 0.6), 'tex:bleu_blanc', t)                            # écharpe bleu et blanc
    b.part('box', (0.06, 0.12, 0.5), (0.22, -0.14, 0.32), 'tex:bleu_blanc', t)
    if celle:
        b.part('sph', (0.24, 0.5, 0.5), (-0.12, 0, 0.28), '#2a1a14', h, seg=8)                    # capuche / cheveux
        b.part('rbox', (0.5, 0.5, 0.2), (0, 0, 0.5), '#2a2d40', h)                                # capuche
        for sg in (-1, 1):
            b.part('cyl', (0.16, 0.16, 0.08), (0, sg * 0.24, 0.26), CYAN, h, rot=(90, 0, 0), seg=8)  # casque audio
        deck = b.piv('deck', (0.2, 0, 0.25), t)                                                   # deck de piratage
        b.part('rbox', (0.1, 0.4, 0.28), (0.12, 0, 0), DARK, deck)
        b.part('box', (0.02, 0.34, 0.2), (0.18, 0, 0.02), '#3aff7a', deck)                        # écran vert terminal
    else:
        b.part('cyl', (0.5, 0.5, 0.1), (0.02, 0, 0.46), '#1f5fd0', h, seg=10)                     # bob
        b.part('cyl', (0.4, 0.4, 0.14), (0.0, 0, 0.53), '#1f5fd0', h, seg=10)
        b.part('rbox', (0.1, 0.24, 0.07), (0.23, 0, 0.16), '#4a3020', h)                          # moustache
        b.part('rbox', (0.42, 0.58, 0.34), (0.04, 0, 0.18), '#2a2d40', t)                         # bedaine d'ancien du kop
        b.part('box', (0.03, 0.2, 0.1), (0.23, 0, 0.3), '#3aff7a', h)                             # lunettes à affichage vert
    return J


PIECES = [  # (nom, constructeur, centre_z, ppu, perso)
    ('pf_tour_peage', tour_peage, 6.5, 26, False), ('pf_herse_laser', herse_laser, 1.8, 50, False),
    ('pf_pont', pont, 0.0, 34, False), ('pf_vanne', vanne, 1.6, 55, False),
    ('pf_levier', levier, 1.0, 120, False), ('pf_barque', barque, 0.3, 65, False),
    ('pf_arche_barrage', arche_barrage, 3.6, 36, False), ('pf_cible_tpe', cible_tpe, 1.2, 95, False),
    ('pf_vitre', vitre, 1.2, 85, False), ('pf_borne', borne, 0.8, 140, False),
    ('pf_cage', cage, 1.4, 80, False), ('pf_coffre', coffre, 0.5, 140, False),
    ('bretzel_boomerang', boomerang, 0.5, 150, False),
    ('pnj_winstubiere', winstubiere, 1.15, 105, True),
    ('pnj_celui_du_stade', lambda b: stade(b, False), 1.15, 105, True),
    ('pnj_celle_du_stade', lambda b: stade(b, True), 1.15, 105, True),
]


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


renders, exported = [], []
for name, fn, cz, ppu, perso in PIECES:
    for old in [x for x in bpy.data.scenes if x.name == "S3K_" + name]:
        bpy.data.scenes.remove(old)
    sc = setup_scene("S3K_" + name, 300, 300, style='funk')
    out = fn(B(sc))
    if perso:
        apply_pose(out, dict(shN=15, elN=25, shF=10, elF=20))
    sprite_camera(sc, 300, cz, yaw=40, ppu=ppu)
    p = os.path.join(SHEET_DIR, name + ".png")
    render_to(sc, p)
    renders.append(p)
    if EXPORT:
        if perso:
            apply_pose(out, {})
        export(sc, name)
        exported.append(name)
result = {"renders": renders, "glb": exported}
