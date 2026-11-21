# Compagnons invocables : Stork (cigogne, attaquante) et Dylagne (ragondin, soin + dégâts de zone).
# Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\compagnons.py", encoding="utf-8").read())
# Étape VALIDATION : planches tools/blender/out/stork_*.png, dylagne_*.png, compagnons_echelle.png
# EXPORT = True après validation : assets/models/stork.glb, dylagne.glb
# Validé par Maxime le 21/11/2026 (« parfait »). Choix de Maxime : Stork attaquante ; Dylagne « heal et dégât de zone » ;
# style « mélange supporters du kop + membres de SCN » ; ils s'expriment par cris + bulles d'icônes.
# Les deux regardent vers +X, pieds à l'origine.
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
BLUE, WHITE, DARK, STEEL, CYAN = '#1f5fd0', '#f4f6ff', '#1a1a22', '#c8ccd8', '#38f2ff'


def build_stork(b):
    """Cigogne d'Alsace attaquante : plumage blanc, rémiges noires, long bec et pattes rouge-orangé.
    Kop : écharpe bleu-blanc. SCN : lunettes de vol à verres cyan + oreillette."""
    root = b.piv('root')
    for side, y in (('N', -0.07), ('F', 0.07)):
        leg = b.piv('leg' + side, (0, y, 0.62), root)
        b.part('box', (0.035, 0.035, 0.6), (0, 0, -0.3), '#e8501e', leg)
        b.part('box', (0.14, 0.05, 0.02), (0.04, 0, -0.6), '#e8501e', leg)
    body = b.piv('body', (0, 0, 0.78), root)
    b.part('rbox', (0.5, 0.3, 0.3), (0, 0, 0), WHITE, body, r2=0.45)
    b.part('rbox', (0.22, 0.2, 0.08), (-0.32, 0, 0.02), DARK, body, rot=(0, -12, 0))  # queue
    for side, y in (('N', -0.16), ('F', 0.16)):
        w = b.piv('wing' + side, (0.05, y, 0.06), body)
        b.part('rbox', (0.46, 0.05, 0.22), (-0.1, 0, 0), WHITE, w, r2=0.3)
        b.part('rbox', (0.22, 0.055, 0.2), (-0.32, 0, -0.02), DARK, w, r2=0.3)          # rémiges noires
    neck = b.piv('neck', (0.2, 0, 0.1), body)
    b.part('rbox', (0.1, 0.1, 0.32), (0.04, 0, 0.16), WHITE, neck, rot=(0, 14, 0))
    b.part('rbox', (0.14, 0.24, 0.07), (0.02, 0, 0.06), 'tex:satin_bw', neck)            # écharpe
    b.part('box', (0.05, 0.05, 0.16), (-0.06, -0.12, -0.02), 'tex:satin_bw', neck, rot=(0, 20, 0))
    head = b.piv('head', (0.1, 0, 0.36), neck)
    b.part('rbox', (0.17, 0.14, 0.14), (0, 0, 0), WHITE, head)
    b.part('cone', (0.06, 0.06, 0.36), (0.26, 0, -0.02), '#e8501e', head, rot=(0, 95, 0), seg=4)  # bec
    b.part('box', (0.04, 0.17, 0.05), (0.06, 0, 0.03), DARK, head)                         # sangle lunettes
    for y in (-0.05, 0.05):
        b.part('cyl', (0.06, 0.06, 0.03), (0.08, y * 1.4, 0.03), CYAN, head, rot=(0, 90, 0), seg=6)
    b.part('sph', (0.035, 0.035, 0.035), (-0.02, -0.08, -0.01), DARK, head, seg=6)        # oreillette
    b.piv('beak', (0.44, 0, -0.03), head)
    return root


def build_dylagne(b):
    """Ragondin trapu : soin + dégâts de zone. Kop : bob bleu-blanc + grosse caisse de tribune sur le ventre
    (coup de grosse caisse = onde de choc de zone). SCN : sacoche à croix cyan (soin), antenne bricolée."""
    root = b.piv('root')
    for side, y in (('N', -0.11), ('F', 0.11)):
        leg = b.piv('leg' + side, (0.02, y, 0.1), root)
        b.part('rbox', (0.12, 0.09, 0.12), (0, 0, -0.04), '#5a3a26', leg)
    body = b.piv('body', (0, 0, 0.3), root)
    b.part('rbox', (0.5, 0.36, 0.36), (0, 0, 0), '#8a5a36', body, r2=0.45)
    b.part('rbox', (0.36, 0.28, 0.2), (0.06, 0, -0.06), '#b88a5a', body, r2=0.4)          # ventre
    tail = b.piv('tail', (-0.26, 0, -0.1), body)
    b.part('box', (0.34, 0.06, 0.05), (-0.17, 0, -0.04), '#3a2a1e', tail, rot=(0, 10, 0))
    head = b.piv('head', (0.28, 0, 0.12), body)
    b.part('rbox', (0.24, 0.24, 0.2), (0, 0, 0), '#8a5a36', head, r2=0.4)
    b.part('rbox', (0.12, 0.16, 0.1), (0.12, 0, -0.04), '#b88a5a', head)                   # museau
    b.part('box', (0.03, 0.07, 0.07), (0.18, 0, -0.1), '#ff8a1a', head)                     # incisives orange
    b.part('sph', (0.04, 0.04, 0.04), (0.19, 0, -0.01), DARK, head, seg=6)                  # truffe
    for y in (-0.07, 0.07):
        b.part('sph', (0.035, 0.035, 0.035), (0.1, y, 0.05), DARK, head, seg=6)             # yeux
        b.part('box', (0.005, 0.12, 0.005), (0.16, y * 1.6, -0.03), '#e8e0d0', head)        # moustaches
        b.part('sph', (0.06, 0.03, 0.06), (-0.04, y * 1.5, 0.1), '#5a3a26', head, seg=6)    # oreilles
    b.part('cyl', (0.3, 0.3, 0.04), (0, 0, 0.11), 'tex:satin_bw', head, seg=10)             # bob
    b.part('cyl', (0.2, 0.2, 0.1), (0, 0, 0.16), BLUE, head, seg=10)
    # grosse caisse de tribune sur le ventre (onde de choc) + mailloche
    drum = b.piv('drum', (0.22, 0, -0.02), body)
    b.part('cyl', (0.26, 0.26, 0.12), (0, 0, 0), BLUE, drum, rot=(0, 90, 0), seg=10)
    b.part('cyl', (0.22, 0.22, 0.125), (0, 0, 0), WHITE, drum, rot=(0, 90, 0), seg=10)
    b.part('box', (0.03, 0.03, 0.22), (0.1, -0.16, 0.08), '#c98b52', drum, rot=(30, 0, 0))
    b.part('sph', (0.06, 0.06, 0.06), (0.1, -0.2, 0.17), WHITE, drum, seg=6)
    # sacoche de soin SCN sur le dos + antenne bricolée
    pack = b.piv('pack', (-0.08, 0, 0.2), body)
    b.part('rbox', (0.2, 0.26, 0.16), (0, 0, 0), DARK, pack)
    b.part('box', (0.02, 0.1, 0.03), (-0.1, 0, 0.0), CYAN, pack)
    b.part('box', (0.02, 0.03, 0.1), (-0.1, 0, 0.0), CYAN, pack)
    b.part('box', (0.015, 0.015, 0.22), (-0.04, 0.1, 0.18), STEEL, pack)
    b.part('sph', (0.04, 0.04, 0.04), (-0.04, 0.1, 0.3), CYAN, pack, seg=6)
    return root


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


def views(name, fn, cz, frame, ppu, vs=(('trois_quarts', 40), ('profil', 0), ('face', 90))):
    sc = scene("S3K_" + name, frame, frame)
    fn(B(sc))
    out = []
    for label, yaw in vs:
        for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
            bpy.data.objects.remove(o, do_unlink=True)
        sprite_camera(sc, frame, cz, yaw=yaw, ppu=ppu)
        p = os.path.join(SHEET_DIR, f"{name}_{label}.png")
        render_to(sc, p)
        out.append(p)
    return out


renders = views('stork', build_stork, 0.75, 480, 300)
renders += views('dylagne', build_dylagne, 0.36, 480, 420)

sc = scene("S3K_compagnons_echelle", 720, 520)
win = bpy.context.window; prev = win.scene; win.scene = sc
try:
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODEL_DIR, "ultra.glb"))
finally:
    win.scene = prev
s = build_stork(B(sc)); s.location = (0.2, -1.1, 0)
d = build_dylagne(B(sc)); d.location = (0.3, 1.0, 0)
sprite_camera(sc, 720, 1.0, yaw=50, ppu=190)
p = os.path.join(SHEET_DIR, "compagnons_echelle.png"); render_to(sc, p); renders.append(p)
result = {"renders": renders}


def export(name, fn):
    s = scene("S3K_exp_" + name, 64, 64)
    fn(B(s))
    win = bpy.context.window; prev = win.scene; win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, name + ".glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    return name


if EXPORT:
    result["glb"] = [export('stork', build_stork), export('dylagne', build_dylagne)]
