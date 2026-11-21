# Boss niveau 2 (Meinau 2026) : Egboehly, le multipropriétaire. Personnage 100 % inventé : caricature du TYPE
# (le financier qui collectionne les clubs comme des actifs), d'aucune personne réelle.
# Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\egboehly.py", encoding="utf-8").read())
# Étape VALIDATION : planche tools/blender/out/egboehly_<variante>_*.png
# Validé par Maxime le 21/11/2026 (variante A, « un peu plus chevelu », « cheveux noirs et c'est parfait »). Choix de Maxime : financier qui PILOTE l'hydre depuis une loge VIP, lunettes-dollar,
# ton grotesque ET inquiétant, têtes mécaniques (écussons de clubs inventés, couleurs génériques).
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
GOLD, DARK, STEEL, RED, GLASS = '#ffc040', '#1a1a22', '#8a90a0', '#ff1a3c', '#38f2ff'
VARIANTS = {
    'A': dict(suit='#1f5a3a', shirt='#f4f0e0', tie=GOLD, pod='#2a2d40', label='costume vert billet'),
    'B': dict(suit='#f2f0ea', shirt='#1a1a22', tie=RED, pod='#ffffff', label='costume blanc de yacht'),
}
CRESTS = ['#d01a2a', '#2ab04a', '#ffd23f', '#8a3ad0', '#ff7a1a']  # écussons inventés : couleurs génériques


def financier(b, parent, V):
    """Le pilote, assis : torse, tête chauve luisante, lunettes-dollar, oreillette, mains sur les manettes."""
    p = b.piv('pilot', (0, 0, 0), parent)
    b.part('rbox', (0.5, 0.62, 0.62), (0, 0, 0.32), V['suit'], p, r2=0.35)          # torse ventru
    b.part('box', (0.02, 0.18, 0.4), (0.26, 0, 0.36), V['shirt'], p)
    b.part('box', (0.025, 0.07, 0.34), (0.275, 0, 0.32), V['tie'], p)
    for y in (-0.36, 0.36):
        b.part('rbox', (0.16, 0.16, 0.42), (0.1, y, 0.36), V['suit'], p, rot=(0, -50, 0))   # bras vers les manettes
        b.part('sph', (0.11, 0.11, 0.11), (0.28, y * 0.9, 0.2), '#e8b48c', p, seg=6)
        b.part('box', (0.03, 0.03, 0.16), (0.3, y * 0.9, 0.12), DARK, p)                       # manettes
        b.part('sph', (0.06, 0.06, 0.06), (0.3, y * 0.9, 0.22), RED, p, seg=6)
    h = b.piv('head', (0.02, 0, 0.8), p)
    b.part('rbox', (0.34, 0.32, 0.36), (0, 0, 0), '#e8b48c', h, r2=0.45)               # crâne chauve
    # banane gominée noire, rabattue en arrière (coiffure inventée, validée : « un peu plus chevelu »)
    b.part('rbox', (0.3, 0.34, 0.12), (-0.03, 0, 0.18), '#1a1614', h, r2=0.45)
    b.part('rbox', (0.16, 0.28, 0.14), (0.12, 0, 0.22), '#2a2420', h, rot=(0, -20, 0), r2=0.45)
    b.part('rbox', (0.14, 0.36, 0.2), (-0.15, 0, 0.06), '#121010', h, r2=0.4)
    b.part('box', (0.06, 0.22, 0.04), (0.17, 0, -0.1), '#c06a5a', h)                    # sourire carnassier
    b.part('box', (0.04, 0.18, 0.02), (0.19, 0, -0.08), '#ffffff', h)
    # lunettes-dollar : monture or + deux verres en forme de $
    b.part('box', (0.03, 0.34, 0.03), (0.18, 0, 0.05), GOLD, h)
    for y in (-0.08, 0.08):
        b.part('box', (0.02, 0.12, 0.14), (0.19, y, 0.03), '#2ab04a', h)
        for dz in (0.05, 0.0, -0.05):
            b.part('box', (0.025, 0.09, 0.018), (0.2, y, 0.03 + dz), GOLD, h)
        b.part('box', (0.025, 0.018, 0.17), (0.205, y, 0.03), GOLD, h)
    b.part('sph', (0.04, 0.04, 0.04), (0.0, -0.17, 0.0), GOLD, h, seg=6)               # oreillette or
    return p


def pod(b, parent, V):
    """Loge VIP de pilotage : siège en cuir, dôme de verre, écran de cours de bourse."""
    lo = b.piv('loge', (0, 0, 0), parent)
    b.part('rbox', (1.1, 1.2, 0.35), (0, 0, 0), V['pod'], lo, r2=0.3)
    b.part('rbox', (0.25, 0.9, 0.9), (-0.4, 0, 0.55), '#5a1a1a', lo)                    # dossier cuir
    b.part('box', (0.04, 0.5, 0.28), (0.5, 0, 0.45), DARK, lo, rot=(0, -20, 0))         # écran bourse
    for i, hgt in enumerate((0.06, 0.12, 0.08, 0.18, 0.22)):
        b.part('box', (0.045, 0.06, hgt), (0.52, -0.18 + i * 0.09, 0.36 + hgt / 2), '#2ab04a', lo, rot=(0, -20, 0))
    b.part('box', (0.06, 1.22, 0.05), (0.3, 0, 0.2), GOLD, lo)
    financier(b, lo, V).location = (-0.1, 0, 0.2)
    return lo


def neck_head(b, parent, base, ang, col, n=7):
    """Un cou mécanique segmenté qui monte en arc, puis une tête de serpent robotique avec écusson."""
    g = b.piv('neck', base, parent)
    g.rotation_euler = (0, 0, math.radians(ang))
    pts = [(0.3 * i, 0.5 * i - 0.045 * i * i) for i in range(n + 1)]
    for i in range(n):
        (x0, z0), (x1, z1) = pts[i], pts[i + 1]
        dx, dz = x1 - x0, z1 - z0
        w = 0.34 - 0.12 * i / n
        b.part('cyl', (w, w, math.hypot(dx, dz) + 0.08), ((x0 + x1) / 2, 0, (z0 + z1) / 2),
               STEEL if i % 2 else '#5a606e', g, rot=(0, math.degrees(math.atan2(dx, dz)), 0), seg=8)
    x, z = pts[-1]
    hd = b.piv('head_club', (x + 0.3, 0, z + 0.05), g)
    b.part('rbox', (0.6, 0.42, 0.34), (0, 0, 0.06), '#4a4f5c', hd)
    b.part('rbox', (0.5, 0.36, 0.12), (0.06, 0, -0.16), '#3a3f4a', hd, rot=(0, 12, 0))   # mâchoire
    for y in (-0.12, 0.12):
        b.part('sph', (0.08, 0.08, 0.08), (0.22, y, 0.14), RED, hd, seg=6)                # yeux rouges
    for k in range(4):
        b.part('cone', (0.05, 0.05, 0.1), (0.15 + k * 0.07, 0.12, -0.06), '#ffffff', hd, rot=(180, 0, 0), seg=4)
        b.part('cone', (0.05, 0.05, 0.1), (0.15 + k * 0.07, -0.12, -0.06), '#ffffff', hd, rot=(180, 0, 0), seg=4)
    # écusson de club inventé sur le front : bouclier de couleur + bande blanche
    b.part('cyl', (0.26, 0.26, 0.04), (-0.05, 0, 0.26), col, hd, seg=6)
    b.part('box', (0.04, 0.2, 0.05), (-0.05, 0, 0.26), '#ffffff', hd, rot=(0, 0, 45))
    return g


def build_egboehly(b, V):
    root = b.piv('root')
    body = b.piv('hydra', (0, 0, 0), root)
    b.part('rbox', (2.2, 2.0, 0.9), (0, 0, 0.6), '#3a3f4a', body, r2=0.25)              # corps-châssis
    for x in (-0.7, 0.7):
        for y in (-0.85, 0.85):
            b.part('rbox', (0.5, 0.35, 0.6), (x, y, 0.15), DARK, body)                    # pattes à chenilles
    b.part('box', (0.06, 2.02, 0.1), (0, 0, 0.9), GOLD, body)
    for i, ang in enumerate((-70, -35, 0, 35, 70)):
        r = math.radians(ang)
        neck_head(b, body, (0.6 * math.cos(r), 0.6 * math.sin(r), 0.9), ang, CRESTS[i], n=6 if i % 2 else 7)
    lo = pod(b, body, V)
    lo.location = (-0.5, 0, 1.05)
    return root


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
for key, V in VARIANTS.items():
    sc = scene("S3K_egboehly_" + key, 640, 560)
    build_egboehly(B(sc), V)
    for label, yaw in (('trois_quarts', 35), ('profil', 0)):
        for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
            bpy.data.objects.remove(o, do_unlink=True)
        sprite_camera(sc, 640, 1.9, yaw=yaw, ppu=95)
        p = os.path.join(SHEET_DIR, f"egboehly_{key}_{label}.png"); render_to(sc, p); renders.append(p)
    sc2 = scene("S3K_egboehly_pilote_" + key, 360, 360)
    financier(B(sc2), None, V)
    sprite_camera(sc2, 360, 0.75, yaw=30, ppu=240)
    p = os.path.join(SHEET_DIR, f"egboehly_{key}_pilote.png"); render_to(sc2, p); renders.append(p)
result = {"renders": renders}


if EXPORT:
    s = scene("S3K_exp_egboehly", 64, 64)
    build_egboehly(B(s), VARIANTS['A'])
    win = bpy.context.window; prev = win.scene; win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, "egboehly.glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    result["glb"] = "egboehly.glb"
