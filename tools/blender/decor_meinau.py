# Décors Meinau 2026 (niveau 2, Egboehly) d'après les photos de Maxime : tribune à grands pylônes inclinés beiges,
# bardage beige, sous-face en gradins béton, soubassement béton, entrées bleues, escalier bleu sous auvent triangulaire,
# coursive intérieure (blocs numérotés) ; bol du stade : pelouse rayée, piste bleue, sièges bleus/rouges, toit.
# Aucun logo, sponsor ni écusson réels : seulement des bannières BlingCo et des écussons inventés.
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\decor_meinau.py", encoding="utf-8").read())
import importlib, sys, os, math
import bpy
ROOT3 = r"C:\Users\mbarbe\dev\Stras3000"
sys.path.insert(0, os.path.join(ROOT3, "tools"))
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

SHEET_DIR = os.path.join(ROOT3, "tools", "blender", "out")
s3k_lib.PATTERNS['paves_gris'] = [[('#6a6a70' if (x % 5 == 0 or y % 5 == 0) else '#7e7e84') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['pelouse'] = [[('#3a9a3a' if (x // 4) % 2 else '#2f8a30') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['bardage'] = [[('#c8c0a0' if x % 3 else '#b0a888') for x in range(16)] for y in range(16)]
BEIGE, BROWN, CONC, BLUE, BLUE_L, RED, GOLD, WHITE = '#b89a80', '#8a6a5a', '#a8a49c', '#1f4fd0', '#3a7af0', '#b0303a', '#ffc040', '#f4f0e8'
CRESTS = ['#d01a2a', '#2ab04a', '#ffd23f', '#8a3ad0', '#ff7a1a']


def tribune_ext(b):
    r = b.piv('meinau_ext')
    b.part('box', (22, 14, 0.1), (0, 0, -0.05), 'tex:paves_gris', r)
    for i in range(6):
        b.part('box', (0.15, 1.2, 0.02), (4.0, -6 + i * 2.4, 0.01), '#e8c040', r)        # marquages jaunes
    # soubassement béton (rez-de-chaussée) + vitrage d'accueil
    b.part('box', (2.5, 20, 2.6), (-1.5, 0, 1.3), CONC, r)
    for y in range(-8, 9, 2):
        b.part('box', (0.08, 1.4, 1.0), (-0.24, y, 1.0), '#5a6a7a', r)
    b.part('box', (1.4, 5, 2.4), (0.6, -2, 1.2), '#c8d0d8', r)                          # pavillon vitré
    b.part('box', (1.42, 5.02, 0.1), (0.6, -2, 2.45), '#e8e8ec', r)
    b.part('box', (1.6, 2.4, 1.6), (-1.0, 4.5, 3.4), BLUE, r)                            # volume bleu en hauteur
    # tribune : sous-face en gradins, bardage beige, pylônes inclinés + tirants
    for k in range(9):
        b.part('box', (0.5, 20, 0.35), (-2.2 - k * 0.55, 0, 3.0 + k * 0.5), '#9a968e', r)  # gradins vus de dessous
    b.part('box', (0.3, 20, 1.6), (-0.9, 0, 5.6), 'tex:bardage', r)                       # bandeau bardé
    for y in range(-9, 10, 3):
        p = b.piv('pylone', (-0.7, y, 0.2), r)
        p.rotation_euler = (0, math.radians(-12), 0)
        b.part('box', (0.55, 0.55, 8.2), (0, 0, 4.1), BEIGE, p)
        b.part('box', (2.8, 0.15, 0.15), (-1.6, 0, 8.0), '#5a4a3a', p, rot=(0, -20, 0))     # tirant vers le toit
    b.part('box', (0.5, 0.6, 9), (-0.2, 9.6, 4.5), '#8a4a50', r)                          # tour d'angle rose-brun
    # entrée « carré présidentiel » : escalier bleu sous auvent triangulaire, poteau bleu
    st = b.piv('escalier_bleu', (1.4, 6.5, 0), r)
    for k in range(8):
        b.part('box', (0.35, 1.4, 0.2 + k * 0.2), (-k * 0.35, 0, (0.2 + k * 0.2) / 2), BLUE_L, st)
    b.part('box', (2.8, 0.08, 1.6), (-1.2, -0.75, 1.0), BLUE, st)
    b.part('box', (2.8, 0.08, 1.6), (-1.2, 0.75, 1.0), BLUE, st)
    au = b.piv('auvent', (1.5, 8.6, 3.0), r)
    au.rotation_euler = (math.radians(12), 0, math.radians(20))
    b.part('box', (3.0, 2.8, 0.12), (0, 0, 0), '#c8c4bc', au)
    b.part('box', (3.05, 0.12, 0.25), (0, -1.4, 0.05), BLUE, au)
    b.part('cyl', (0.18, 0.18, 3.6), (2.4, 8.2, 1.6), BLUE, r, rot=(8, 0, 0), seg=8)
    # BlingCo : barrières et grand panneau « MULTI-CLUB » avec les 5 écussons inventés (multipropriété)
    pn = b.piv('panneau_blingco', (2.6, 3.0, 0), r)
    b.part('box', (0.12, 3.6, 2.0), (0, 0, 1.3), '#1a1a2a', pn)
    b.part('box', (0.14, 3.4, 0.35), (0.01, 0, 2.0), GOLD, pn)
    for i, c in enumerate(CRESTS):
        b.part('cyl', (0.45, 0.45, 0.05), (0.08, -1.3 + i * 0.65, 1.2), c, pn, rot=(0, 90, 0), seg=6)
    for y in (-5, -3.4, 0.5):
        b.part('box', (0.06, 1.4, 0.9), (2.4, y, 0.5), '#2a2a5a', r)                       # barrières de filtrage
    for x, y, c in ((5.5, -7, '#3a4a6a'), (5.5, -4.6, '#6a6a72'), (5.5, -2.2, '#2a2a34')):
        b.part('rbox', (1.0, 2.0, 0.6), (x, y, 0.35), c, r)
    return r


def stade_bol(b):
    r = b.piv('meinau_bol')
    b.part('box', (26, 18, 0.1), (0, 0, -0.05), BLUE, r)                                   # piste bleue
    b.part('box', (20, 12.5, 0.12), (0, 0, 0.0), 'tex:pelouse', r)
    for x in (-10, 0, 10):
        b.part('box', (0.06, 12.5, 0.13), (x * 0.95 if x else 0, 0, 0.01), WHITE, r)       # lignes
    b.part('box', (20, 0.06, 0.13), (0, 6.2, 0.01), WHITE, r); b.part('box', (20, 0.06, 0.13), (0, -6.2, 0.01), WHITE, r)
    b.part('cyl', (3.6, 3.6, 0.13), (0, 0, 0.005), WHITE, r, seg=24); b.part('cyl', (3.45, 3.45, 0.14), (0, 0, 0.006), 'tex:pelouse', r, seg=24)
    for x in (-10.5, 10.5):
        b.part('box', (0.1, 2.4, 0.08), (x, 0, 1.2), WHITE, r)                              # buts
        b.part('box', (0.1, 0.08, 1.2), (x, -1.2, 0.6), WHITE, r); b.part('box', (0.1, 0.08, 1.2), (x, 1.2, 0.6), WHITE, r)
    # tribunes : gradins bleus / rouges sur 3 côtés + toit (côté caméra ouvert)
    def stand(cx, cy, w, along_x, sign):
        for k in range(8):
            off = 1.0 + k * 0.7
            col = BLUE if (k % 3) else RED
            if along_x:
                b.part('box', (w, 0.7, 0.45), (cx, cy + sign * off, 0.3 + k * 0.45), col, r)
            else:
                b.part('box', (0.7, w, 0.45), (cx + sign * off, cy, 0.3 + k * 0.45), col, r)
    stand(0, 8.8, 22, True, 1)
    stand(12.8, 0, 16, False, 1)
    stand(-12.8, 0, 16, False, -1)
    b.part('box', (24, 2.5, 0.25), (0, 14.5, 5.2), '#2a2a30', r)                           # toit tribune du fond
    for x in range(-10, 11, 3):
        b.part('box', (0.15, 0.15, 3.0), (x, 15.4, 6.4), '#c8c8cc', r, rot=(25, 0, 0))     # mâts du toit
    b.part('box', (0.4, 3.0, 1.6), (0, 14.0, 4.0), '#0c2238', r)                            # écran géant
    b.part('box', (0.42, 2.6, 0.3), (0.01, 14.0, 4.3), GOLD, r)                            # « BlingCo FOOTBALL »
    # arène d'Egboehly : 5 crochets à bannières autour du rond central (énigme du tifo), panneaux pub BlingCo
    for i, c in enumerate(CRESTS):
        a = math.radians(-60 + i * 30)
        b.part('cyl', (0.12, 0.12, 2.2), (5.5 * math.cos(a) - 2, 5.5 * math.sin(a) + 1.5, 1.1), '#5a606e', r, seg=6)
        b.part('cyl', (0.4, 0.4, 0.05), (5.5 * math.cos(a) - 2, 5.5 * math.sin(a) + 1.5, 2.3), c, r, rot=(90, 0, 0), seg=6)
    for x in range(-9, 10, 3):
        b.part('box', (2.6, 0.12, 0.6), (x, 7.2, 0.3), GOLD if x % 2 else '#1a1a2a', r)    # panneaux LED BlingCo
    # le kop (virage, tribune de gauche) : bâches et drapeaux bleu-blanc des supporters
    for y in range(-6, 7, 2):
        b.part('box', (0.05, 1.6, 1.0), (-13.3, y, 2.2), BLUE if (y // 2) % 2 else WHITE, r)
    return r


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_decor_meinau_ext", 1100, 700)
tribune_ext(B(sc))
sprite_camera(sc, 1100, 3.0, yaw=55, ppu=50)
p = os.path.join(SHEET_DIR, "decor_meinau_ext.png"); render_to(sc, p); renders.append(p)
sc2 = scene("S3K_decor_meinau_bol", 1100, 700)
stade_bol(B(sc2))
sprite_camera(sc2, 1100, 1.5, yaw=-60, ppu=34)
p = os.path.join(SHEET_DIR, "decor_meinau_bol.png"); render_to(sc2, p); renders.append(p)
result = {"renders": renders}
