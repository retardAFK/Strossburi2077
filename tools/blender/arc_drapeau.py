# Arc-Drapeau (variante A « Tribune », validée par Maxime le 21/11/2026 : drapeau réduit, porté sur le dos). Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\arc_drapeau.py", encoding="utf-8").read())
# Étape VALIDATION : planche tools/blender/out/arc_drapeau_*.png (repos, tir, à l'échelle de l'Ultra).
# EXPORT = True après validation : assets/models/arc_drapeau.glb
# Arc recourbé en alu noir mat, poignée en satin bleu et blanc, corde = écharpe torsadée bleu/blanc,
# drapeau du kop roulé le long de la branche haute qui se déploie au tir.
# Pivots pour le jeu : root (poignée, origine), tipTop, tipBot, nock (milieu de corde),
# flagRolled (drapeau roulé), flagOpen (drapeau déployé) : le jeu affiche l'un ou l'autre.
# L'arc est vertical (axe Z), le dos vers +X, la corde côté tireur (-X).
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
os.makedirs(SHEET_DIR, exist_ok=True)

s3k_lib.PATTERNS['satin_bw'] = s3k_lib._pattern_stripes('#1f5fd0', '#f4f6ff', w=4, vertical=False)
ALU, ALU_L, BLUE, WHITE, STEEL, GOLD = '#26262e', '#44444f', '#1f5fd0', '#f4f6ff', '#c8ccd8', '#ffd23f'
H = 1.25          # hauteur de l'arc (l'Ultra mesure ~1,95)
N = 9             # segments par branche (low poly)


def limb_pts(sign):
    """Profil d'une branche (sign=+1 haut, -1 bas) : part de la poignée, se courbe vers le tireur, pointe recourbée vers l'avant."""
    pts = []
    for i in range(N + 1):
        t = i / N
        x = -0.24 * t ** 1.5 + 1.9 * max(0.0, t - 0.74) ** 2
        z = sign * (0.11 + t * (H / 2 - 0.11))
        pts.append((x, z))
    return pts


def seg(b, p0, p1, w, col, parent, dy=0.0, kind='box'):
    """Une barre entre deux points du plan XZ."""
    dx, dz = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dz)
    ang = math.degrees(math.atan2(dx, dz))
    return b.part(kind, (w, w * 0.8, L + w * 0.3), ((p0[0] + p1[0]) / 2, dy, (p0[1] + p1[1]) / 2), col, parent, rot=(0, ang, 0), seg=6)


def string(b, a, c, parent, n=6):
    """Corde façon écharpe torsadée : petits tronçons alternés bleu / blanc."""
    for i in range(n):
        p0 = (a[0] + (c[0] - a[0]) * i / n, a[1] + (c[1] - a[1]) * i / n)
        p1 = (a[0] + (c[0] - a[0]) * (i + 1) / n, a[1] + (c[1] - a[1]) * (i + 1) / n)
        seg(b, p0, p1, 0.018, BLUE if i % 2 else WHITE, parent)


def build_arc(b, state='repos'):
    root = b.piv('root')
    up, dn = limb_pts(1), limb_pts(-1)
    for pts in (up, dn):
        for i in range(N):
            w = 0.065 - 0.03 * i / N
            seg(b, pts[i], pts[i + 1], w, ALU if i % 3 else ALU_L, root)
        b.part('sph', (0.05, 0.05, 0.05), (pts[-1][0], 0, pts[-1][1]), STEEL, root, seg=6)  # embouts
    # poignée en satin + repose-flèche
    b.part('rbox', (0.085, 0.075, 0.26), (0.0, 0, 0), 'tex:satin_bw', root)
    b.part('box', (0.05, 0.03, 0.02), (-0.04, -0.04, 0.12), STEEL, root)
    tipT, tipB = up[-1], dn[-1]
    b.piv('tipTop', (tipT[0], 0, tipT[1]), root)
    b.piv('tipBot', (tipB[0], 0, tipB[1]), root)
    nock_x = (tipT[0] + tipB[0]) / 2 if state == 'repos' else -0.62
    b.piv('nock', (nock_x, 0, 0), root)
    if state == 'repos':
        string(b, tipT, tipB, root, n=10)
    else:
        string(b, tipT, (nock_x, 0), root)
        string(b, (nock_x, 0), tipB, root)
        b.part('box', (0.74, 0.016, 0.016), (nock_x + 0.37, -0.04, 0), STEEL, root)            # flèche simple
        b.part('cone', (0.05, 0.05, 0.09), (nock_x + 0.78, -0.04, 0), GOLD, root, rot=(0, 90, 0), seg=4)
        b.part('box', (0.1, 0.006, 0.06), (nock_x + 0.06, -0.04, 0.025), BLUE, root)           # empennage
        b.part('box', (0.1, 0.006, 0.06), (nock_x + 0.06, -0.04, -0.025), WHITE, root)
    # drapeau roulé le long du dos de la branche haute (affiché au repos)
    rolled = b.piv('flagRolled', (0, 0, 0), root)
    for i in range(2, 7):
        p0, p1 = up[i], up[i + 1]
        seg(b, (p0[0] + 0.05, p0[1]), (p1[0] + 0.05, p1[1]), 0.06, BLUE if i % 2 else WHITE, rolled, kind='cyl')
    # drapeau déployé, accroché à la branche haute, qui claque vers l'arrière (affiché au tir)
    a = up[6]
    opn = b.piv('flagOpen', (a[0], 0, a[1]), root)
    cols = 5
    for j in range(cols):
        x = -0.02 - j * 0.075
        wave = 0.035 * math.sin(j * 1.3)
        for k, (zz, col) in enumerate(((0.085, BLUE), (0.0, WHITE), (-0.085, BLUE))):
            b.part('box', (0.075, 0.012, 0.085), (x, wave, zz - j * 0.025 + 0.04), col, opn, rot=(0, 0, math.degrees(0.35 * math.cos(j * 1.3))))
    rolled.hide_render = state != 'repos'
    for o in rolled.children_recursive:
        o.hide_render = state != 'repos'
    for o in opn.children_recursive:
        o.hide_render = state == 'repos'
    return root


def render_views(state, views, frame=520, ppu=330):
    name = "S3K_arc_" + state
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    sc = setup_scene(name, frame, frame, style='funk')
    build_arc(B(sc), state)
    out = []
    for label, yaw in views:
        for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
            bpy.data.objects.remove(o, do_unlink=True)
        sprite_camera(sc, frame, 0.0, yaw=yaw, ppu=ppu)
        p = os.path.join(SHEET_DIR, f"arc_drapeau_{state}_{label}.png")
        render_to(sc, p)
        out.append(p)
    return out


def render_scale():
    """L'arc porté sur le dos de l'Ultra, en diagonale (import de assets/models/ultra.glb), pour juger la taille.
    Dans le jeu : accroché au pivot 'torso', position/rotation ci-dessous (BACK_POS, BACK_ROT)."""
    name = "S3K_arc_echelle"
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    sc = setup_scene(name, 520, 520, style='funk')
    win = bpy.context.window
    prev = win.scene
    win.scene = sc
    try:
        bpy.ops.import_scene.gltf(filepath=os.path.join(MODEL_DIR, "ultra.glb"))
    finally:
        win.scene = prev
    arc = build_arc(B(sc), 'repos')
    arc.location = BACK_POS
    arc.rotation_mode = 'ZXY'  # d'abord parallèle au dos (Z), puis inclinaison en diagonale (X)
    arc.rotation_euler = [math.radians(v) for v in BACK_ROT]
    out = []
    for label, yaw in (('dos', 215), ('profil', 0)):
        for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
            bpy.data.objects.remove(o, do_unlink=True)
        sprite_camera(sc, 520, 1.05, yaw=yaw, ppu=200)
        p = os.path.join(SHEET_DIR, f"arc_drapeau_echelle_{label}.png")
        render_to(sc, p)
        out.append(p)
    return out


BACK_POS = (-0.42, 0.12, 1.6)   # dans le dos, à hauteur des omoplates
BACK_ROT = (32, 0, 90)          # ordre ZXY : plan de l'arc parallèle au dos, incliné en diagonale


renders = render_views('repos', [('profil', 0), ('trois_quarts', 40)])
renders += render_views('tir', [('profil', 0), ('trois_quarts', 40)])
renders += render_scale()
result = {"renders": renders}

if EXPORT:
    name = "S3K_arc_export"
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    s = setup_scene(name, 64, 64, style='funk')
    build_arc(B(s), 'repos')
    for o in s.collection.all_objects:
        o.hide_render = False  # le jeu choisit flagRolled / flagOpen
    win = bpy.context.window
    prev = win.scene
    win.scene = s
    try:
        bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, "arc_drapeau.glb"), export_format='GLB',
                                  use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    result["glb"] = "arc_drapeau.glb"
