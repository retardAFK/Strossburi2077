# Validé par Maxime le 21/11/2026 (« parfait »).
# Boss Marché 2000 (Porte de l'Hôpital 2026, la nuit) : le Gérant de nuit BlingCo. Robot inventé (caricature du
# TYPE « gérant qui facture tout x10 la nuit »). Maxime : « pour le look du boss je te suis ». Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\gerant_nuit.py", encoding="utf-8").read())
# Étape VALIDATION : planche tools/blender/out/gerant_*.png
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
VIO, VIO_D, GOLD, DARK, STEEL, RED, CYAN, GREEN = '#5a2a9a', '#3a1a6a', '#ffc040', '#14141c', '#9aa3b8', '#ff1a3c', '#38f2ff', '#2ab04a'


def build_gerant(b):
    root = b.piv('root')
    # base à roulettes (il glisse derrière son comptoir)
    b.part('cyl', (0.8, 0.8, 0.2), (0, 0, 0.12), DARK, root, seg=10)
    for a in range(0, 360, 90):
        r = math.radians(a)
        b.part('sph', (0.14, 0.14, 0.14), (0.32 * math.cos(r), 0.32 * math.sin(r), 0.06), STEEL, root, seg=6)
    b.part('cyl', (0.2, 0.2, 0.5), (0, 0, 0.45), STEEL, root, seg=8)                         # colonne
    body = b.piv('body', (0, 0, 0.7), root)
    # ventre = CAISSE ENREGISTREUSE : écran prix x10, touches, tiroir à billets (pivot `tiroir`)
    b.part('rbox', (0.75, 0.85, 0.75), (0, 0, 0.35), '#d8d4c8', body, r2=0.2)
    b.part('box', (0.04, 0.5, 0.18), (0.38, 0, 0.55), DARK, body)                            # afficheur
    b.part('box', (0.045, 0.4, 0.08), (0.385, 0, 0.55), RED, body)                           # « x10 » rouge
    for i in range(3):
        for j in range(4):
            b.part('box', (0.04, 0.08, 0.06), (0.38, -0.15 + j * 0.1, 0.38 - i * 0.08), STEEL if (i + j) % 2 else GOLD, body)
    tir = b.piv('tiroir', (0.38, 0, 0.08), body)
    b.part('box', (0.22, 0.6, 0.12), (0.1, 0, 0), '#b8b4a8', tir)
    for k in range(4):
        b.part('box', (0.18, 0.12, 0.02), (0.1, -0.2 + k * 0.13, 0.065), GREEN, tir)           # billets
    # blouse d'épicier BlingCo violette (épaules + col) avec badge doré
    b.part('rbox', (0.8, 0.95, 0.3), (0, 0, 0.82), VIO, body, r2=0.3)
    b.part('box', (0.04, 0.16, 0.12), (0.4, -0.25, 0.85), GOLD, body)                         # badge « GÉRANT »
    b.part('box', (0.045, 0.1, 0.03), (0.405, -0.25, 0.85), VIO_D, body)
    # tête = ÉCRAN au sourire de pub figé + casquette de gérant
    head = b.piv('head', (0, 0, 1.1), body)
    b.part('rbox', (0.35, 0.6, 0.42), (0, 0, 0.2), DARK, head)
    b.part('box', (0.02, 0.5, 0.32), (0.18, 0, 0.2), '#0c2238', head)
    for y in (-0.12, 0.12):
        b.part('box', (0.025, 0.08, 0.1), (0.19, y, 0.26), CYAN, head)                         # yeux-pixels
    b.part('box', (0.025, 0.3, 0.04), (0.19, 0, 0.12), CYAN, head)                             # sourire figé
    b.part('box', (0.025, 0.04, 0.06), (0.19, -0.16, 0.14), CYAN, head)
    b.part('box', (0.025, 0.04, 0.06), (0.19, 0.16, 0.14), CYAN, head)
    b.part('cyl', (0.5, 0.5, 0.1), (0, 0, 0.45), VIO, head, seg=10)
    b.part('box', (0.2, 0.45, 0.03), (0.2, 0, 0.42), VIO_D, head)
    b.part('sph', (0.08, 0.08, 0.08), (0, 0, 0.53), RED, head, seg=6)                          # gyrophare « fermeture »
    # bras gauche : ÉTIQUETEUSE géante (tire des étiquettes de prix) ; bras droit : SCANNER laser rouge
    for side, y in (('N', -0.55), ('F', 0.55)):
        sh = b.piv('sh' + side, (0, y, 0.85), body)
        b.part('box', (0.14, 0.14, 0.4), (0.05, 0, -0.18), STEEL, sh, rot=(0, -40, 0))
        b.part('cyl', (0.06, 0.06, 0.35), (0.08, 0.08 if y > 0 else -0.08, -0.18), '#5a606e', sh, rot=(0, -40, 0), seg=6)
    lab = b.piv('etiqueteuse', (0.4, -0.6, 0.55), body)
    b.part('rbox', (0.35, 0.18, 0.22), (0, 0, 0), '#ff7a1a', lab)
    b.part('box', (0.1, 0.06, 0.25), (-0.1, 0, -0.18), DARK, lab)                               # poignée
    b.part('box', (0.12, 0.14, 0.06), (0.2, 0, 0.0), '#ffffff', lab)                            # étiquette qui sort
    b.part('box', (0.125, 0.06, 0.02), (0.2, 0, 0.035), RED, lab)
    scan = b.piv('scanner', (0.4, 0.6, 0.6), body)
    b.part('rbox', (0.22, 0.14, 0.16), (0, 0, 0), DARK, scan)
    b.part('box', (0.03, 0.12, 0.08), (0.12, 0, 0), RED, scan)
    b.part('box', (0.6, 0.01, 0.01), (0.45, 0, 0), RED, scan)                                   # rayon
    # comptoir-caisse devant lui (l'arène)
    c = b.piv('comptoir', (0.8, 0, 0), root)
    b.part('box', (0.4, 1.6, 0.9), (0, 0, 0.45), '#3a2a4a', c)
    b.part('box', (0.42, 1.62, 0.06), (0, 0, 0.92), GOLD, c)
    b.part('box', (0.44, 0.9, 0.12), (0.0, 0, 0.6), VIO, c)                                     # bandeau « BlingCo Nuit »
    return root


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_gerant", 560, 560)
build_gerant(B(sc))
for label, yaw in (('trois_quarts', 35), ('face', 90), ('profil', 0)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 560, 1.1, yaw=yaw, ppu=200)
    p = os.path.join(SHEET_DIR, f"gerant_{label}.png"); render_to(sc, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    s = scene("S3K_exp_gerant", 64, 64)
    build_gerant(B(s))
    win = bpy.context.window; prev = win.scene; win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, "gerant_nuit.glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    result["glb"] = "gerant_nuit.glb"
