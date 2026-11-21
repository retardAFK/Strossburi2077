# Validé par Maxime le 21/11/2026 (« top »).
# Objet du niveau 3 (Port du Rhin 2026) : le Gaffe-grappin. Choix de Maxime (21/11/2026) : « les deux » = perche de
# marinier en bois + treuil SCN bricolé ; couleurs bois + acier + corde bleu-blanc. Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\gaffe_grappin.py", encoding="utf-8").read())
# Pivots : root (prise main), hook (crochet, se détache au tir), rope_start (sortie de corde), crank (manivelle).
# Orientation : perche le long de +X (crochet vers l'avant).
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
s3k_lib.PATTERNS['satin_bw'] = s3k_lib._pattern_stripes('#1f5fd0', '#f4f6ff', w=4, vertical=False)
WOOD, WOOD_D, STEEL, STEEL_D, BLUE, WHITE, DARK = '#a0703a', '#7a5028', '#b8bcc8', '#6a6e7a', '#1f5fd0', '#f4f6ff', '#1a1a22'


def build_gaffe(b, fired=False):
    root = b.piv('root')
    # perche de marinier en bois (bagues d'acier), prise en ruban satin bleu-blanc
    b.part('cyl', (0.07, 0.07, 1.6), (0.5, 0, 0), WOOD, root, rot=(0, 90, 0), seg=8)
    for x in (-0.25, 0.4, 1.0, 1.25):
        b.part('cyl', (0.085, 0.085, 0.05), (x, 0, 0), STEEL_D, root, rot=(0, 90, 0), seg=8)
    b.part('cyl', (0.08, 0.08, 0.35), (-0.05, 0, 0), 'tex:satin_bw', root, rot=(0, 90, 0), seg=8)
    b.part('sph', (0.08, 0.08, 0.08), (-0.3, 0, 0), STEEL_D, root, seg=6)                     # embout
    # treuil SCN bricolé : tambour, corde bleu-blanc enroulée, manivelle, colliers et scotch
    w = b.piv('treuil', (0.25, 0.1, 0), root)
    b.part('cyl', (0.16, 0.16, 0.12), (0, 0.02, 0), STEEL, w, rot=(90, 0, 0), seg=10)
    b.part('cyl', (0.14, 0.14, 0.1), (0, 0.02, 0), BLUE, w, rot=(90, 0, 0), seg=10)            # corde bleue
    b.part('cyl', (0.145, 0.145, 0.03), (0, 0.02, 0), WHITE, w, rot=(90, 0, 0), seg=10)        # spires blanches
    b.part('box', (0.04, 0.04, 0.12), (0, 0.1, 0.05), DARK, w)                                 # bras de manivelle
    b.piv('crank', (0, 0.1, 0.11), w)
    b.part('cyl', (0.03, 0.03, 0.08), (0, 0.14, 0.11), '#d0303a', w, rot=(90, 0, 0), seg=6)   # poignée rouge
    for x in (0.15, 0.35):
        b.part('cyl', (0.09, 0.09, 0.03), (x, 0, 0), '#2a2a2a', root, rot=(0, 90, 0), seg=8)   # colliers de serrage
    b.part('box', (0.12, 0.12, 0.03), (0.27, 0.04, -0.07), '#c8c050', root)                    # scotch
    # crochet de marinier en acier : pointe droite + croc recourbé (gaffe), détachable
    hook_x = 1.32 if not fired else 2.6
    hk = b.piv('hook', (hook_x, 0, 0), root)
    b.part('cone', (0.07, 0.07, 0.25), (0.15, 0, 0), STEEL, hk, rot=(0, 90, 0), seg=6)         # pointe
    b.part('box', (0.05, 0.05, 0.2), (0.02, 0, 0.1), STEEL, hk)                                 # croc
    b.part('box', (0.12, 0.05, 0.05), (-0.03, 0, 0.2), STEEL, hk)
    b.part('cone', (0.04, 0.04, 0.08), (-0.1, 0, 0.17), STEEL, hk, rot=(0, -120, 0), seg=4)
    b.part('cyl', (0.06, 0.06, 0.1), (-0.05, 0, 0), STEEL_D, hk, rot=(0, 90, 0), seg=8)
    b.piv('rope_start', (0.25, 0.1, 0.12), root)
    if fired:                                                                                  # corde tendue jusqu'au crochet
        n = 10
        for i in range(n):
            x0 = 0.25 + (hook_x - 0.25) * i / n
            b.part('box', ((hook_x - 0.25) / n, 0.02, 0.02), (x0 + (hook_x - 0.25) / n / 2, 0.06, 0.06),
                   BLUE if i % 2 else WHITE, root)
    return root


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
for label, fired, yaw in (('repos', False, 30), ('tir', True, 20), ('detail', False, 70)):
    sc = scene("S3K_gaffe_" + label, 640, 360)
    build_gaffe(B(sc), fired)
    ppu = 300 if label == 'detail' else (200 if not fired else 160)
    cam = sprite_camera(sc, 640, 0.0, yaw=yaw, ppu=ppu)
    cam.location.x += 0.25 if label == 'detail' else (1.15 if fired else 0.6)   # centre l'objet
    p = os.path.join(SHEET_DIR, f"gaffe_{label}.png"); render_to(sc, p); renders.append(p)
# à l'échelle, tenu par l'Ultra (main proche)
sc = scene("S3K_gaffe_echelle", 640, 460)
before = set(sc.objects)
win = bpy.context.window; prev = win.scene; win.scene = sc
try:
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODEL_DIR, "ultra.glb"))
finally:
    win.scene = prev
g = build_gaffe(B(sc))
g.location = (0.2, -0.45, 0.85)
g.rotation_euler = (0, math.radians(-15), 0)
sprite_camera(sc, 640, 1.0, yaw=60, ppu=170)
p = os.path.join(SHEET_DIR, "gaffe_echelle.png"); render_to(sc, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    s = scene("S3K_exp_gaffe", 64, 64)
    build_gaffe(B(s))
    win = bpy.context.window; prev = win.scene; win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, "gaffe_grappin.glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    result["glb"] = "gaffe_grappin.glb"
