# Décor Place Kléber 2026 (niveau Marco CeKlair) d'après les photos de Maxime (grand sapin, façades, chalets,
# flèche de la cathédrale au loin) — version DYSTOPIQUE CYBERPUNK du marché de Noël permanent de BlingCo :
# sapin-écran holographique, chalets à néons et prix exorbitants pour pas grand-chose, portiques-péages,
# caméras, drones publicitaires, pubs holo plaquées sur les façades.
# v2 « plus abjecte » : cours des prix en temps réel, file VIP vs peuple parqué, écrans-yeux, air pur payant,
# v4 « plus sombre » : façades encrassées, fenêtres presque éteintes, smog, seuls les néons BlingCo brillent.
# v3 « pubs à la noix partout, dénaturé » : façades couvertes, banderoles, sapin et sol publicitaires, mâts rotatifs,
# vidéo-mapping pub sur la cathédrale au loin (c'est BlingCo qui dénature, pas une moquerie du monument).
# WC à 12 €, bretzel en cage « Tradition Certifiée », poubelles de gobelets, hologramme géant de Marco CeKlair. Les façades alsaciennes restent respectées :
# c'est BlingCo qui les recouvre.
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\decor_kleber.py", encoding="utf-8").read())
import importlib, sys, os, math
import bpy
ROOT3 = r"C:\Users\mbarbe\dev\Stras3000"
sys.path.insert(0, os.path.join(ROOT3, "tools"))
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

SHEET_DIR = os.path.join(ROOT3, "tools", "blender", "out")
s3k_lib.PATTERNS['dalle_mouillee'] = [[('#141020' if (x % 8 == 0 or y % 8 == 0) else ('#1e1a30' if (x + y) % 11 == 0 else '#0c0a16')) for x in range(16)] for y in range(16)]
PINK, CYAN, VIO, GOLD, RED, DARK, GREEN = '#ff2e88', '#38f2ff', '#a98bff', '#ffc040', '#ff1a3c', '#14141c', '#3aff8a'


def facade(b, parent, x, y, w, h, col, timber=False, roof='#1a1414', clock=False):
    f = b.piv('facade', (x, y, 0), parent)
    b.part('box', (1.2, w, h), (0, 0, h / 2), dk(col, 0.42), f)                              # façades encrassées, sombres
    b.part('prism', (1.4, w + 0.1, 1.2), (0, 0, h + 0.6), roof, f, rot=(0, 0, 90))
    rows = int(h // 1.4)
    for i in range(rows):
        for j in range(max(1, int(w // 0.9))):
            lit = (i + j) % 3 != 0
            b.part('box', (0.05, 0.45, 0.6), (0.62, -w / 2 + 0.45 + j * 0.9, 1.4 + i * 1.3), '#7a5a2a' if lit else '#0c1020', f)
    if timber:
        for j in range(int(w // 0.9) + 1):
            b.part('box', (0.06, 0.08, h - 1.2), (0.63, -w / 2 + j * 0.9, h / 2 + 0.6), '#1e120a', f)
        for i in range(rows):
            b.part('box', (0.06, w, 0.08), (0.63, 0, 1.0 + i * 1.3), '#1e120a', f)
    if clock:
        b.part('cyl', (0.8, 0.8, 0.05), (0.63, 0, h - 0.8), '#f4f0e8', f, rot=(0, 90, 0), seg=12)
    return f


def holo_ad(b, parent, loc, w, h, col, col2=GOLD, rot=0):
    a = b.piv('holo', loc, parent)
    a.rotation_euler = (0, 0, math.radians(rot))
    b.part('box', (0.04, w, h), (0, 0, 0), col, a)
    b.part('box', (0.05, w * 0.8, h * 0.25), (-0.01, 0, h * 0.15), col2, a)
    b.part('box', (0.05, w * 0.6, h * 0.12), (-0.01, 0, -h * 0.2), '#ffffff', a)
    return a


def chalet(b, parent, x, y, rot, price_col):
    c = b.piv('chalet', (x, y, 0), parent)
    c.rotation_euler = (0, 0, math.radians(rot))
    b.part('box', (1.4, 2.0, 1.8), (0, 0, 0.9), '#2a1e30', c)
    b.part('prism', (1.7, 2.3, 0.8), (0, 0, 2.2), '#3a3a48', c, rot=(0, 0, 90))
    b.part('box', (0.05, 1.8, 0.08), (-0.72, 0, 2.6), PINK, c)                                # liseré néon
    b.part('box', (0.06, 1.6, 0.5), (-0.73, 0, 1.55), DARK, c)                                 # écran de prix
    b.part('box', (0.07, 1.2, 0.22), (-0.74, 0, 1.6), price_col, c)                            # « 49 € » géant
    b.part('box', (0.3, 1.6, 0.1), (-0.75, 0, 1.0), '#5a4a5a', c)                              # comptoir
    b.part('cyl', (0.08, 0.08, 0.14), (-0.85, 0.3, 1.12), '#c8c8d0', c, seg=6)                # minuscule gobelet
    b.part('box', (0.06, 0.2, 0.12), (-0.74, -0.7, 1.95), CYAN, c)                             # terminal de paiement
    return c


def kleber(b):
    r = b.piv('kleber')
    b.part('box', (30, 26, 0.1), (0, 0, -0.05), 'tex:dalle_mouillee', r)                    # dalle mouillée qui reflète
    # façades (fond et côté droit), d'après les photos : maisons à pans de bois, grand immeuble orange, bâtiment à horloge
    xs = -9
    specs = [(3.0, 8, '#e8dcc0', True), (2.6, 9, '#d8a070', False), (3.4, 13, '#e0a050', False), (2.2, 9, '#f0e8d8', True),
             (3.0, 10, '#e8e0d0', False), (4.2, 11, '#d8c8a8', False)]
    y = -11
    for i, (w, h, col, tb) in enumerate(specs):
        facade(b, r, xs, y + w / 2, w, h, col, timber=tb, clock=(i == 5))
        y += w + 0.1
    # flèche de la cathédrale au loin (respectée, éclairée)
    b.part('box', (2.0, 2.0, 22), (-16, 7, 11), '#4a2a24', r)
    b.part('cone', (1.6, 1.6, 7), (-16, 7, 25.5), '#5a3428', r, seg=8)
    b.part('sph', (0.3, 0.3, 0.3), (-16, 7, 29.2), GOLD, r, seg=6)
    # pubs holo BlingCo plaquées sur les façades
    for (yy, zz, w, h, c) in ((-9, 6.5, 2.4, 2.0, PINK), (-3.5, 9.5, 3.0, 2.4, CYAN), (2.5, 7.0, 2.6, 2.0, VIO), (7.5, 8.0, 3.4, 2.6, PINK)):
        holo_ad(b, r, (xs + 0.68, yy, zz), w, h, c, rot=180)
    b.part('box', (0.05, 19, 0.5), (xs + 0.7, -1.5, 4.2), GOLD, r)                             # bandeau défilant
    b.part('box', (0.06, 19, 0.2), (xs + 0.71, -1.5, 4.25), RED, r)
    # LE SAPIN : sapin-écran holographique géant, cimier logo BlingCo, guirlandes-pubs
    t = b.piv('sapin', (-2.5, -6.5, 0), r)
    b.part('cyl', (1.6, 1.6, 0.8), (0, 0, 0.4), '#121218', t, seg=8)                           # socle-borne payante
    b.part('box', (0.05, 0.6, 0.3), (0.82, 0, 0.5), CYAN, t)
    for k, (rad, z) in enumerate(((3.2, 2.0), (2.6, 4.2), (2.0, 6.2), (1.4, 8.0), (0.8, 9.6))):
        b.part('cone', (rad * 2, rad * 2, 2.6), (0, 0, z), '#06180f', t, seg=8)
        for a in range(0, 360, 45):
            aa = math.radians(a + k * 20)
            b.part('sph', (0.22, 0.22, 0.22), (rad * 0.8 * math.cos(aa), rad * 0.8 * math.sin(aa), z - 0.6),
                   [PINK, CYAN, GOLD, VIO][(a // 45 + k) % 4], t, seg=6)
    b.part('box', (0.1, 1.6, 1.0), (0, 0, 11.4), GOLD, t)                                       # cimier logo BlingCo
    b.part('box', (0.12, 1.2, 0.35), (0.01, 0, 11.4), '#5a2a9a', t)
    # chalets à prix exorbitants
    for i, (x, y, rr) in enumerate(((2, -9, 180), (2, -6.5, 180), (2, -4, 180), (2, -1.5, 180), (5, 3, 90), (2.5, 3, 90), (0, 3, 90))):
        chalet(b, r, x, y, rr, [RED, GOLD, PINK, GREEN][i % 4])
    # portiques-péages d'entrée, caméras sur mâts, drones pub, « neige » artificielle payante
    for y in (-11.5, 6.5):
        g = b.piv('peage', (6, y, 0), r)
        b.part('box', (0.4, 0.4, 3.0), (0, -1.2, 1.5), '#3a3a48', g)
        b.part('box', (0.4, 0.4, 3.0), (0, 1.2, 1.5), '#3a3a48', g)
        b.part('box', (0.5, 3.0, 0.5), (0, 0, 3.0), DARK, g)
        b.part('box', (0.52, 2.4, 0.25), (0, 0, 3.0), RED, g)                                   # « ENTRÉE 15 € »
        b.part('box', (0.1, 2.0, 0.06), (0, 0, 1.0), GOLD, g)                                   # tourniquet
    for (x, y) in ((4, -11), (4, 5), (-6, 1)):
        b.part('cyl', (0.1, 0.1, 5), (x, y, 2.5), '#4a4a54', r, seg=6)
        b.part('rbox', (0.4, 0.25, 0.25), (x + 0.2, y, 5.0), '#e8e8f0', r)
        b.part('sph', (0.08, 0.08, 0.08), (x + 0.42, y, 5.0), RED, r, seg=6)
    for (x, y, z) in ((0, -2, 7), (3, -8, 8.5), (-4, 2, 9)):
        d = b.piv('drone_pub', (x, y, z), r)
        b.part('rbox', (0.4, 0.4, 0.15), (0, 0, 0), DARK, d)
        for dx, dy in ((0.25, 0.25), (0.25, -0.25), (-0.25, 0.25), (-0.25, -0.25)):
            b.part('cyl', (0.25, 0.25, 0.02), (dx, dy, 0.1), '#9aa3b8', d, seg=8)
        b.part('box', (0.03, 1.2, 0.6), (0, 0, -0.5), PINK, d)                                   # écran pub suspendu
    for k in range(40):                                                                          # « neige » de synthèse
        b.part('box', (0.06, 0.06, 0.06), (((k * 37) % 20) - 8, ((k * 53) % 22) - 11, 3 + (k * 7) % 9), '#e8f0ff', r)
    # passants : silhouettes qui paient, une file devant le péage
    for k in range(8):
        b.part('rbox', (0.35, 0.35, 1.6), (7.5 + (k % 2) * 0.4, -11.5 + k * 0.5, 0.8), '#1a1a26', r)

    # ---- PLUS ABJECT ----
    # écran géant du cours des prix (le vin chaud monte en temps réel), plaqué au-dessus des façades
    tk = b.piv('ticker', (xs + 0.9, -6.0, 13.5), r)
    b.part('box', (0.1, 8, 2.4), (0, 0, 0), DARK, tk)
    for i, (hh, c) in enumerate(((0.4, GREEN), (0.6, GREEN), (0.9, RED), (1.3, RED), (1.8, RED), (2.1, RED))):
        b.part('box', (0.12, 0.9, hh), (0.02, -3.2 + i * 1.1, -1.1 + hh / 2), c, tk)              # courbe qui grimpe
    b.part('box', (0.13, 2.4, 0.5), (0.03, 2.6, 0.7), GOLD, tk)                                   # « VIN CHAUD 79 € ▲ »
    # file VIP sur tapis doré (fluide) contre le peuple parqué derrière des barrières (bouché)
    b.part('box', (8, 1.2, 0.03), (2, 9.0, 0.03), GOLD, r)
    for x in range(-2, 7, 2):
        b.part('cyl', (0.08, 0.08, 0.9), (x, 8.3, 0.45), GOLD, r, seg=6)
        b.part('cyl', (0.08, 0.08, 0.9), (x, 9.7, 0.45), GOLD, r, seg=6)
    for k in range(3):
        b.part('rbox', (0.4, 0.4, 1.7), (k * 2.2, 9.0, 0.85), '#f4f0e8', r)                          # VIP en blanc, peu nombreux
    for x in range(-3, 9, 1):
        b.part('box', (0.9, 0.08, 1.1), (x, 10.6, 0.55), '#6a6a74', r)                               # barrières Vauban
    for k in range(16):
        b.part('rbox', (0.35, 0.35, 1.6), (-3 + (k % 8) * 1.4, 11.2 + (k // 8) * 0.6, 0.8), '#1a1a26', r)
    # écrans-yeux qui suivent les passants
    for (x, y, z) in ((-2, 4.5, 4.5), (3, -10, 5.5), (6, 2, 5)):
        e = b.piv('ecran_oeil', (x, y, z), r)
        b.part('box', (0.1, 1.2, 0.8), (0, 0, 0), DARK, e)
        b.part('cyl', (0.5, 0.5, 0.05), (0.06, 0, 0), '#f4f0e8', e, rot=(0, 90, 0), seg=10)
        b.part('cyl', (0.22, 0.22, 0.06), (0.08, 0.08, 0), RED, e, rot=(0, 90, 0), seg=8)
        b.part('cyl', (0.06, 0.06, 2.5), (0, 0, -1.6), '#4a4a54', e, seg=6)
    # bornes « AIR PUR 2 €/min », toilettes à 12 €, cage « Tradition Certifiée » avec un bretzel enfermé
    for (x, y) in ((0.5, -11), (0.5, 0.5), (5.5, -5)):
        b.part('rbox', (0.4, 0.4, 1.4), (x, y, 0.7), '#2a2a34', r)
        b.part('box', (0.06, 0.32, 0.3), (x + 0.21, y, 1.1), CYAN, r)
        b.part('cyl', (0.06, 0.06, 0.5), (x, y + 0.25, 1.3), '#9aa3b8', r, rot=(30, 0, 0), seg=6)    # masque à air
    wc = b.piv('wc', (7.5, -2, 0), r)
    b.part('box', (1.2, 1.2, 2.3), (0, 0, 1.15), '#3a3a48', wc)
    b.part('box', (0.06, 0.9, 0.35), (-0.62, 0, 2.0), RED, wc)                                      # « WC 12 € »
    cg = b.piv('cage', (5, -9.5, 0), r)
    b.part('box', (1.2, 1.2, 0.2), (0, 0, 0.1), GOLD, cg)
    for dx in (-0.5, -0.17, 0.17, 0.5):
        for dy in (-0.5, 0.5):
            b.part('cyl', (0.04, 0.04, 1.4), (dx, dy, 0.9), GOLD, cg, seg=4)
    b.part('cyl', (0.4, 0.4, 0.06), (0, 0, 0.6), '#c8843a', cg, rot=(90, 0, 0), seg=10)            # bretzel « certifié »
    b.part('box', (0.06, 1.0, 0.25), (-0.62, 0, 1.75), GOLD, cg)
    # poubelles qui débordent de gobelets à 49 € (et un SDF-robot de BlingCo qui les recompte)
    for (x, y) in ((1.0, -7.8), (6.5, 4.5)):
        b.part('cyl', (0.6, 0.6, 0.9), (x, y, 0.45), '#2a5a3a', r, seg=8)
        for k in range(6):
            b.part('cyl', (0.12, 0.12, 0.16), (x + 0.15 * math.cos(k), y + 0.15 * math.sin(k), 0.95 + 0.05 * k), '#e8e8f0', r, seg=6)
    # hologramme géant de Marco CeKlair au-dessus du sapin, qui répète le slogan
    hm = b.piv('holo_marco', (-2.5, -6.5, 14.5), r)
    b.part('rbox', (0.2, 2.6, 2.6), (0, 0, 0), '#38f2ff', hm)
    b.part('cone', (2.2, 2.2, 1.6), (0, 0, 1.9), '#1c1c24', hm, seg=8)                                # bonnet noir
    b.part('rbox', (0.25, 2.2, 1.0), (0.05, 0, -0.9), '#f4f6ff', hm)                                  # barbe
    b.part('box', (0.26, 3.6, 0.5), (0.08, 0, -1.9), PINK, hm)                                        # bulle du slogan

    # ---- v4 : PLUS SOMBRE (smog, façades encrassées, peu de vraies lumières, seuls les néons BlingCo brillent) ----
    # (le smog est fait en post-traitement de la planche ; en jeu : brouillard Three.js sombre)
    # ---- v3 : PUBS À LA NOIX PARTOUT, la place est dénaturée ----
    cols = [PINK, CYAN, VIO, GOLD, GREEN, RED, '#ff7a1a']
    # façades presque entièrement recouvertes de pubs (fenêtres masquées)
    yy = -11
    for i, (w, h, col, tb) in enumerate(specs):
        for k in range(int(h // 2.2)):
            holo_ad(b, r, (xs + 0.7 + 0.02 * k, yy + w / 2 + ((k % 2) - 0.5) * 0.4, 1.6 + k * 2.1), w * 0.85, 1.7,
                    cols[(i + k) % len(cols)], cols[(i + k + 3) % len(cols)], rot=180)
        yy += w + 0.1
    # banderoles tendues en travers de la place
    for k, (y, z) in enumerate(((-9, 6.0), (-4, 7.0), (1, 6.5), (5, 7.5))):
        b.part('box', (14, 0.05, 0.8), (0, y, z), cols[k % len(cols)], r)
        b.part('box', (13, 0.06, 0.3), (0, y, z + 0.1), '#ffffff', r)
    # sapin couvert de mini-écrans pub
    for k in range(18):
        a = math.radians(k * 40)
        z = 2.0 + (k % 6) * 1.4
        rad = 2.6 - (k % 6) * 0.38
        b.part('box', (0.04, 0.5, 0.35), (-2.5 + rad * math.cos(a), -6.5 + rad * math.sin(a), z), cols[k % len(cols)], r,
               rot=(0, 0, math.degrees(a)))
    # sol : pubs projetées sur les dalles
    for k in range(10):
        b.part('box', (1.6, 1.0, 0.02), (((k * 29) % 14) - 4, ((k * 41) % 20) - 10, 0.02), cols[k % len(cols)], r)
    # mâts publicitaires rotatifs, toits des chalets en panneaux pub, lampadaires à écrans
    for k, (x, y) in enumerate(((-5, -3), (-5, 4), (7, -8), (7, 8), (3, 6))):
        b.part('cyl', (0.12, 0.12, 6), (x, y, 3), '#4a4a54', r, seg=6)
        for j in range(3):
            b.part('box', (0.9, 0.9, 0.9), (x, y, 4.6 + j * 0.95), cols[(k + j) % len(cols)], r, rot=(0, 0, 45))
    # la cathédrale elle-même, au loin, prise dans un vidéo-mapping publicitaire de BlingCo
    for z in (6, 10, 14, 18):
        b.part('box', (0.05, 2.1, 2.2), (-14.95, 7, z), cols[int(z) % len(cols)], r)
    r.rotation_euler = (0, 0, math.radians(-90))  # façades tournées vers la caméra
    return r


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


sc = scene("S3K_decor_kleber", 1100, 900)
kleber(B(sc))
sprite_camera(sc, 1100, 8.0, yaw=-20, ppu=30)
p = os.path.join(SHEET_DIR, "decor_kleber.png"); render_to(sc, p)
result = {"renders": [p]}
