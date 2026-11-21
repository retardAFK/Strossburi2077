# Décors de nuit 2026 : Marché 2000 (Porte de l'Hôpital) et Le Kalt. Vignettes de validation (pas encore de kit exporté).
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\decors_nuit.py", encoding="utf-8").read())
# Planche : tools/blender/out/decor_marche2000.png, decor_kalt.png
import importlib, sys, os, math
import bpy
ROOT3 = r"C:\Users\mbarbe\dev\Stras3000"
sys.path.insert(0, os.path.join(ROOT3, "tools"))
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

SHEET_DIR = os.path.join(ROOT3, "tools", "blender", "out")
s3k_lib.PATTERNS['bitume'] = [[('#1c1a26' if (x * 7 + y * 3) % 11 else '#26232f') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['beton'] = [[('#1a1a1e' if (x // 8 + y // 8) % 2 else '#202024') for x in range(16)] for y in range(16)]
VIO, CYAN, PINK, GOLD, RED, DARK, WHITE = '#a98bff', '#38f2ff', '#ff4fa3', '#ffc040', '#ff1a3c', '#14141c', '#f4f0e8'


def marche2000(b):
    r = b.piv('marche2000')
    b.part('box', (14, 12, 0.1), (0, 0, -0.05), 'tex:bitume', r)                         # rue
    for y in (-0.6, 0.6):
        b.part('box', (14, 0.08, 0.05), (2.2, y, 0.02), '#6a6a74', r)                       # rails du tram
    b.part('box', (14, 1.8, 0.12), (4.2, 0, 0.06), '#2a2836', r)                           # trottoir côté tram
    # station de tram Porte de l'Hôpital : abri + quai
    b.part('box', (0.1, 3, 2.2), (4.8, -4.5, 1.1), '#3a5a8a', r)
    b.part('box', (1.2, 3.2, 0.1), (4.5, -4.5, 2.25), '#2a3a5a', r)
    b.part('box', (0.06, 1.2, 0.5), (4.86, -4.5, 1.6), CYAN, r)                              # panneau horaires
    # immeuble du Marché 2000 (rez-de-chaussée commercial, toit plat, angle)
    bld = b.piv('immeuble', (-1.5, 0, 0), r)
    b.part('box', (4, 9, 4.5), (-2, 0, 2.25), '#c8c0b0', bld)                              # façade enduit
    b.part('box', (4.05, 9.05, 0.25), (-2, 0, 4.55), '#9a9488', bld)                       # acrotère toit plat
    for y in (-3, -1, 1, 3):
        b.part('box', (0.08, 1.2, 0.9), (0.02, y, 3.3), '#1a2a48', bld)                    # fenêtres d'étage (éteintes)
    b.part('box', (0.1, 8.6, 2.0), (0.05, 0, 1.0), '#2a2236', bld)                         # rideau métallique baissé
    for z in (0.4, 0.8, 1.2, 1.6):
        b.part('box', (0.12, 8.6, 0.03), (0.06, 0, z), '#3a3248', bld)
    b.part('box', (0.12, 2.0, 1.8), (0.07, 2.6, 0.95), '#3a1a5a', bld)                     # porte entrouverte (lumière violette)
    b.part('box', (0.13, 1.6, 1.4), (0.08, 2.6, 0.95), VIO, bld)
    # enseigne « MARCHÉ 2000 » : lettres néon dont certaines éteintes (énigme du toit)
    for i in range(10):
        on = i not in (2, 5, 7)
        b.part('box', (0.1, 0.55, 0.6), (0.12, -3.6 + i * 0.75, 2.45), '#ff7a1a' if on else '#3a2a1a', bld)
    b.part('box', (0.15, 0.7, 0.75), (0.15, 4.0, 2.45), GOLD, bld)                         # logo BlingCo « Nuit » rajouté
    b.part('box', (0.16, 0.5, 0.15), (0.16, 4.0, 2.45), '#5a2a9a', bld)
    # nid de Stork sur l'enseigne d'angle
    b.part('cyl', (0.7, 0.7, 0.2), (-0.2, -4.4, 4.8), '#8a6a3a', bld, seg=8)
    b.part('sph', (0.18, 0.18, 0.18), (-0.2, -4.4, 4.95), WHITE, bld, seg=6)
    # trottoir : palettes de faux produits « Tradition Certifiée », vigile-robot, réverbère, poubelles
    for k, (x, y) in enumerate(((1.0, -1.5), (1.0, 0.2), (1.6, -0.7))):
        b.part('box', (0.9, 0.9, 0.12), (x, y, 0.06), '#8a6a3a', r)
        b.part('box', (0.8, 0.8, 0.6), (x, y, 0.42), '#e8e0c8', r)
        b.part('box', (0.82, 0.3, 0.2), (x, y, 0.55), GOLD, r)
    b.part('cyl', (0.12, 0.12, 4), (1.6, 3.8, 2), '#4a4a54', r, seg=6)
    b.part('sph', (0.35, 0.35, 0.25), (1.6, 3.8, 4.0), '#fff0b0', r, seg=6)
    b.part('rbox', (0.5, 0.5, 1.6), (1.8, 1.8, 0.8), DARK, r)                              # vigile-robot
    b.part('box', (0.05, 0.4, 0.08), (2.06, 1.8, 1.45), RED, r)
    for y in (-4.5, -4.0):
        b.part('rbox', (0.6, 0.45, 0.8), (0.9, y, 0.4), '#2a5a3a', r)                       # conteneurs
    return r


def kalt(b):
    r = b.piv('kalt')
    b.part('box', (12, 12, 0.1), (0, 0, -0.05), 'tex:beton', r)                            # sol béton noir
    b.part('box', (0.4, 12, 6), (-5, 0, 3), '#101014', r)                                   # mur du fond
    b.part('box', (12, 0.4, 6), (0, 5.8, 3), '#121216', r)                                 # mur latéral
    for y in (-3, 0, 3):
        b.part('box', (0.3, 0.3, 6), (-4.6, y, 3), '#2e2e36', r)                            # poteaux IPN
    for x in (-3, 0, 3):
        b.part('box', (0.25, 12, 0.35), (x, 0, 5.6), '#2e2e36', r)                          # poutres du plafond
    # scène DJ en caisses de transport, murs d'enceintes
    b.part('box', (1.4, 3.5, 1.0), (-3.8, 0, 0.5), '#1a1a20', r)
    b.part('box', (0.6, 1.6, 0.15), (-3.5, 0, 1.1), '#3a3a42', r)                           # platines
    for y in (-2.5, 2.5):
        for z in (0.8, 2.1, 3.4):
            b.part('box', (1.0, 1.2, 1.2), (-4.0, y, z), '#0c0c10', r)
            b.part('cyl', (0.8, 0.8, 0.05), (-3.48, y, z), '#2a2a32', r, rot=(0, 90, 0), seg=10)
    # lumières : strobos blancs, lasers rouges, barre LED
    for y in (-3, 0, 3):
        b.part('box', (0.3, 0.6, 0.25), (-1.0, y, 5.3), WHITE, r)
    for a in (-35, -10, 15, 40):
        b.part('box', (9, 0.03, 0.03), (0.5, 0, 4.0), RED, r, rot=(0, 8, a))
    b.part('box', (0.1, 11, 0.12), (-4.75, 0, 4.8), '#38f2ff', r)
    # LE CHOC : carré VIP doré posé au milieu de la piste, cordons rouges, néon rose
    vip = b.piv('carre_vip_decor', (0.5, -1.0, 0), r)
    b.part('cyl', (3.2, 3.2, 0.3), (0, 0, 0.15), GOLD, vip, seg=12)
    for a in range(0, 360, 45):
        rr = math.radians(a)
        b.part('cyl', (0.1, 0.1, 0.9), (1.45 * math.cos(rr), 1.45 * math.sin(rr), 0.75), GOLD, vip, seg=6)
        b.part('box', (0.06, 1.1, 0.07), (1.4 * math.cos(rr + 0.39), 1.4 * math.sin(rr + 0.39), 1.05), '#c0102a', vip, rot=(0, 0, a + 112))
    b.part('rbox', (0.8, 2.0, 0.9), (-0.5, 0, 0.75), GOLD, vip)
    b.part('box', (0.06, 1.6, 0.35), (1.3, 0, 2.2), PINK, vip)                              # néon « VIP »
    # public techno refoulé (silhouettes noires) au fond à droite
    for k in range(6):
        b.part('rbox', (0.35, 0.35, 1.7), (3.8 + (k % 2) * 0.6, 1.5 + k * 0.6, 0.85), '#1a1a22', r)
        b.part('sph', (0.25, 0.25, 0.25), (3.8 + (k % 2) * 0.6, 1.5 + k * 0.6, 1.85), '#2a2a32', r, seg=6)
    return r


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_decor_marche2000", 1100, 700)
marche2000(B(sc))
sprite_camera(sc, 1100, 2.0, yaw=35, ppu=80)
p = os.path.join(SHEET_DIR, "decor_marche2000.png"); render_to(sc, p); renders.append(p)
sc2 = scene("S3K_decor_kalt", 1100, 700)
kalt(B(sc2))
sprite_camera(sc2, 1100, 2.3, yaw=30, ppu=85)
p = os.path.join(SHEET_DIR, "decor_kalt.png"); render_to(sc2, p); renders.append(p)
result = {"renders": renders}


def kalt_exterieur(b):
    """Entrée du Kalt rue la Fayette, d'après la photo de Maxime : bâtiment blanc à 2 niveaux et bandes de bardage
    rouge, allée vers la cour, hangar en bardage rouge au fond ; BlingCo y a ajouté tapis doré + cordon VIP."""
    r = b.piv('kalt_ext')
    b.part('box', (16, 14, 0.1), (0, 0, -0.05), 'tex:bitume', r)
    b.part('box', (16, 1.6, 0.12), (3.6, 0, 0.06), '#2a2836', r)                           # trottoir
    bl = b.piv('bat_blanc', (0, -3, 0), r)
    b.part('box', (5, 7, 5.4), (-0.5, 0, 2.7), '#d8d4cc', bl)                              # bâtiment blanc
    b.part('box', (5.2, 7.2, 0.2), (-0.5, 0, 5.5), '#9a9488', bl)                         # corniche
    b.part('box', (0.1, 7.05, 0.5), (2.0, 0, 0.25), '#8a8478', bl)                         # soubassement
    for z in (1.6, 3.9):
        for i, y in enumerate((-2.6, -1.3, 0, 1.3, 2.6)):
            b.part('box', (0.08, 0.8, 1.1), (2.02, y, z), '#cfcabc', bl)                        # volets roulants
            b.part('box', (0.09, 0.8, 0.5), (2.03, y, z - 0.3), '#1a2a48', bl)                 # vitre
            if i < 4:
                b.part('box', (0.08, 0.45, 1.3), (2.02, y + 0.65, z), '#d0303a', bl)          # bandes rouges
    b.part('box', (0.6, 1.0, 0.08), (2.3, 3.0, 3.4), '#3a3a42', bl)                           # petit balcon
    b.part('box', (0.06, 1.0, 0.5), (2.6, 3.0, 3.65), '#d0303a', bl)
    # allée + portail grillagé + vélos + poubelle jaune
    b.part('box', (6, 2.6, 0.06), (-1, 1.8, 0.03), '#3a3a40', r)
    b.part('box', (0.06, 1.4, 1.3), (2.6, 1.2, 0.65), '#8a8a92', r)                           # portail ouvert
    b.part('rbox', (0.5, 0.5, 0.9), (2.6, 0.2, 0.45), '#222222', r)
    b.part('box', (0.52, 0.52, 0.08), (2.6, 0.2, 0.92), '#ffd23f', r)                        # couvercle jaune
    for k in range(3):
        b.part('cyl', (0.5, 0.5, 0.04), (0.6, 2.2 + k * 0.3, 0.3), '#1a1a1a', r, rot=(90, 0, 0), seg=10)
    # hangar en bardage rouge au fond (la salle)
    hg = b.piv('hangar', (-5, 2, 0), r)
    b.part('box', (6, 6, 3.6), (0, 0, 1.8), '#b0242e', hg)
    for y in range(-2, 3):
        b.part('box', (6.05, 0.05, 3.6), (0, y * 1.2, 1.8), '#8a1a22', hg)                       # nervures du bardage
    b.part('box', (0.1, 2.2, 2.6), (3.05, -0.5, 1.3), '#0e0e12', hg)                         # porte noire de la salle
    b.part('box', (0.12, 2.0, 0.12), (3.07, -0.5, 2.7), '#38f2ff', hg)                        # néon cyan discret
    # mur pignon de droite
    b.part('box', (4, 0.4, 6), (-0.5, 3.4, 3), '#e0dcd2', r)
    # BlingCo : tapis doré + potelets + cordon rouge + néon rose « VIP » qui jurent avec le lieu
    b.part('box', (4.5, 1.2, 0.03), (0.6, 1.8, 0.07), '#ffc040', r)
    for x in (-1.2, 0.2, 1.6, 3.0):
        for y in (1.1, 2.5):
            b.part('cyl', (0.08, 0.08, 0.8), (x, y, 0.45), '#ffc040', r, seg=6)
    b.part('box', (4.2, 0.04, 0.05), (0.9, 1.1, 0.7), '#c0102a', r)
    b.part('box', (4.2, 0.04, 0.05), (0.9, 2.5, 0.7), '#c0102a', r)
    b.part('box', (0.06, 1.6, 0.4), (2.7, 1.8, 2.6), '#ff4fa3', r)
    # la file : peuple techno refoulé sur le trottoir, physio BlingCo
    for k in range(7):
        b.part('rbox', (0.35, 0.35, 1.7), (3.4 + (k % 2) * 0.3, -1.0 - k * 0.65, 0.95), '#1a1a22', r)
        b.part('sph', (0.24, 0.24, 0.24), (3.4 + (k % 2) * 0.3, -1.0 - k * 0.65, 1.95), '#c99070', r, seg=6)
    b.part('rbox', (0.6, 0.7, 2.0), (2.9, 0.6, 1.0), '#0e0e12', r)                            # physio
    b.part('box', (0.62, 0.72, 0.15), (2.9, 0.6, 1.4), '#ffc040', r)                          # brassard doré BlingCo
    # parking en face (quelques voitures) + lampadaire
    for k in range(4):
        b.part('rbox', (1.8, 0.9, 0.6), (7.2, -5 + k * 2.4, 0.35), ['#3a4a6a', '#6a6a72', '#2a2a34', '#8a2a2a'][k], r)
    b.part('cyl', (0.12, 0.12, 4.2), (4.6, 4.5, 2.1), '#4a4a54', r, seg=6)
    b.part('sph', (0.35, 0.35, 0.25), (4.6, 4.5, 4.2), '#fff0b0', r, seg=6)
    return r


sc3 = scene("S3K_decor_kalt_ext", 1100, 700)
kalt_exterieur(B(sc3))
sprite_camera(sc3, 1100, 2.2, yaw=70, ppu=62)
p = os.path.join(SHEET_DIR, "decor_kalt_ext.png"); render_to(sc3, p); renders.append(p)
result = {"renders": renders}
