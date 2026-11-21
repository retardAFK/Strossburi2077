# Niveau 1 (Meinau, tribune ouest, 2077) : ennemis en costard + objets. Executer dans Blender :
#   exec(open(r"C:\Users\mbarbe\Desktop\Stras3000\tools\blender\meinau_cast.py").read())
# Produit : assets/models/{consultant,juriste,directeur,drone,terminal,portique}.glb
#           + planche tools/blender/out/meinau_cast.png (via les rendus individuels)
import importlib, sys, os, math
sys.path.insert(0, r"C:\Users\mbarbe\Desktop\Stras3000\tools")
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

ROOT3 = r"C:\Users\mbarbe\Desktop\Stras3000"
SHEET_DIR = os.path.join(ROOT3, "tools", "blender", "out")
MODEL_DIR = os.path.join(ROOT3, "assets", "models")
os.makedirs(SHEET_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

s3k_lib.PATTERNS['pinstripe'] = [[('#c8b8ff' if x % 6 == 0 else '#2e3150') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['gold_suit'] = [[('#f2d060' if (x + y) % 5 == 0 else '#d8a830') for x in range(16)] for y in range(16)]


def suit_man(b, P):
    """Humanoide en costard. P : couleurs/proportions. Pivots standards (voir CLAUDE.md)."""
    J = {}
    root = b.piv('root')
    thigh, shin = P.get('thigh', 0.44), P.get('shin', 0.42)
    hip_h = thigh + shin + 0.1
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    tor = b.piv('torso', (0, 0, 0), pel)
    J.update(root=root, pelvis=pel, torso=tor, _hip_h=hip_h)
    tw_x, tw_y, th = P.get('tw_x', 0.42), P.get('tw_y', 0.5), P.get('th', 0.7)
    suit, trim = P['suit'], P.get('trim', '#38f2ff')
    for side, far in (('N', False), ('F', True)):
        sg = 1 if far else -1
        h = b.piv('hip' + side, (0, sg * 0.12, 0), pel)
        b.part('rbox', (0.2, 0.2, thigh + 0.05), (0, 0, -thigh / 2), suit, h)
        k = b.piv('knee' + side, (0, 0, -thigh), h)
        b.part('rbox', (0.18, 0.18, shin + 0.03), (0, 0, -shin / 2), suit, k)
        b.part('box', (0.01, 0.01, shin), (0, sg * 0.095, -shin / 2), trim, k)               # liseré néon
        ft = b.piv('foot' + side, (0, 0, -shin), k)
        b.part('rbox', (0.36, 0.2, 0.1), (0.06, 0, -0.05), '#0d0d14', ft)                     # souliers vernis
        b.part('box', (0.1, 0.02, 0.03), (0.15, sg * 0.1, -0.04), trim, ft)
        J.update({'hip' + side: h, 'knee' + side: k, 'foot' + side: ft})
        s = b.piv('sh' + side, (0, sg * (tw_y / 2 + 0.07), th - 0.1), tor)
        b.part('rbox', (0.17, 0.17, 0.36), (0, 0, -0.17), suit, s)
        e = b.piv('el' + side, (0, 0, -0.34), s)
        b.part('rbox', (0.16, 0.16, 0.3), (0, 0, -0.14), P.get('fore', suit), e)
        b.part('rbox', (0.17, 0.17, 0.05), (0, 0, -0.28), '#f4f4f8', e)                      # manchette
        hd = b.piv('hand' + side, (0, 0, -0.31), e)
        b.part('rbox', (0.15, 0.13, 0.16), (0.02, 0, -0.07), P['skin'], hd)
        J.update({'sh' + side: s, 'el' + side: e, 'hand' + side: hd})
    # veste croisée, chemise, cravate
    b.part('rbox', (tw_x, tw_y, th), (0, 0, th / 2), suit, tor)
    b.part('box', (0.02, 0.18, th * 0.55), (tw_x / 2 + 0.002, 0, th * 0.7), '#f4f4f8', tor)        # chemise (V)
    b.part('box', (0.03, 0.06, th * 0.5), (tw_x / 2 + 0.012, 0, th * 0.65), P['tie'], tor)        # cravate
    b.part('box', (0.03, 0.08, 0.05), (tw_x / 2 + 0.012, 0, th - 0.06), P['tie'], tor)
    for sg in (-1, 1):
        b.part('box', (0.025, 0.05, th * 0.6), (tw_x / 2 + 0.006, sg * 0.1, th * 0.68), P.get('lapel', '#1a1c2c'), tor, rot=(sg * 14, 0, 0))
    b.part('box', (0.015, tw_y * 0.9, 0.02), (tw_x / 2 + 0.004, 0, 0.08), trim, tor)              # ceinture néon
    b.part('box', (0.02, 0.08, 0.08), (tw_x / 2 + 0.01, -0.15, th - 0.2), '#ff2e88', tor)         # pin's BlingCo
    head = b.piv('head', (0, 0, th + 0.05), tor)
    J['head'] = head
    hs = P.get('head', 0.44)
    b.part('cyl', (0.14, 0.14, 0.1), (0, 0, 0.0), P['skin'], head, seg=6)                        # cou
    b.part('sph', (hs * 0.92, hs * 0.86, hs), (0.02, 0, hs / 2 + 0.03), P['skin'], head, seg=12, smooth=True)
    b.part('sph', (0.08, 0.07, 0.09), (0.22, 0, 0.2), P.get('skin_d', '#c99070'), head, seg=6)    # nez
    b.part('box', (0.03, 0.12, 0.02), (0.205, 0, 0.11), '#6a3a3a', head)                         # bouche pincee
    b.part('box', (0.15, 0.56, 0.06), (-0.04, 0, -0.0), '#f4f4f8', tor) if False else None
    return J


def add_visor(b, head, col='#38f2ff', z=0.27):
    """Visiere de realite augmentee 2077."""
    b.part('rbox', (0.1, 0.46, 0.09), (0.18, 0, z), '#101018', head)
    b.part('box', (0.03, 0.42, 0.05), (0.235, 0, z), col, head)
    b.part('cyl', (0.06, 0.06, 0.08), (0, -0.22, z - 0.05), col, head, rot=(90, 0, 0), seg=6)   # oreillette


# ------------------------------------------------------------------ le Consultant (ennemi de base)
def build_consultant(b):
    P = dict(suit='tex:pinstripe', tie='#ff2e88', skin='#e8c0a0', trim='#38f2ff')
    J = suit_man(b, P)
    h = J['head']
    add_visor(b, h)
    b.part('sph', (0.46, 0.42, 0.24), (-0.02, 0, 0.42), '#2a1a12', h, seg=10)                   # cheveux gominés
    b.part('rbox', (0.12, 0.44, 0.1), (0.14, 0, 0.47), '#2a1a12', h, rot=(0, -20, 0))          # mèche
    tab = b.piv('tablet', (0.05, 0, -0.1), J['handN'])                                           # holo-tablette
    tab.rotation_euler = (0, math.radians(-70), 0)
    b.part('rbox', (0.03, 0.32, 0.24), (0, 0, 0), '#1a1c2c', tab)
    b.part('box', (0.035, 0.28, 0.2), (0.003, 0, 0), '#38f2ff', tab)
    return J


# ------------------------------------------------------------------ le Juriste (lance des contrats)
def build_juriste(b):
    P = dict(suit='#2a2a38', tie='#e0303a', skin='#f0c8b0', trim='#ff2e88', tw_x=0.5, tw_y=0.56, head=0.46)
    J = suit_man(b, P)
    h = J['head']
    for sg in (-1, 1):  # lunettes rondes holographiques
        b.part('cyl', (0.14, 0.14, 0.03), (0.22, sg * 0.09, 0.28), '#ff2e88', h, rot=(0, 90, 0), seg=10)
        b.part('cyl', (0.11, 0.11, 0.035), (0.225, sg * 0.09, 0.28), '#ffd6ec', h, rot=(0, 90, 0), seg=10)
    b.part('sph', (0.3, 0.44, 0.12), (-0.08, 0, 0.42), '#7a6a5a', h, seg=8)                      # mèche rabattue
    for sg in (-1, 1):
        b.part('sph', (0.18, 0.12, 0.16), (-0.04, sg * 0.2, 0.3), '#7a6a5a', h, seg=6)          # tempes
    bag = b.piv('briefcase', (0.0, 0, -0.14), J['handF'])                                       # attaché-case
    b.part('rbox', (0.42, 0.12, 0.32), (0, 0, -0.14), '#c8a040', bag)
    b.part('box', (0.44, 0.13, 0.03), (0, 0, -0.06), '#5a4010', bag)
    b.part('box', (0.12, 0.04, 0.06), (0, 0, 0.04), '#5a4010', bag)
    for i in range(3):  # liasse de contrats sous le bras
        b.part('box', (0.26, 0.02, 0.34), (0.04, -0.08 - i * 0.015, 0.1), '#fff8e0', J['handN'], rot=(0, -60 + i * 8, 0))
    return J


# ------------------------------------------------------------------ le boss : le Directeur de la Valorisation
def build_directeur(b):
    P = dict(suit='tex:gold_suit', tie='#111118', skin='#e8b090', trim='#ff2e88', lapel='#111118',
             tw_x=0.62, tw_y=0.72, th=0.8, head=0.5, thigh=0.42, shin=0.4)
    J = suit_man(b, P)
    h, t = J['head'], J['torso']
    b.part('rbox', (0.66, 0.76, 0.3), (0.03, 0, 0.3), 'tex:gold_suit', t)                          # gros ventre
    b.part('rbox', (0.1, 0.5, 0.11), (0.2, 0, 0.29), '#111118', h)                                # lunettes noires
    b.part('box', (0.03, 0.46, 0.05), (0.255, 0, 0.3), '#ffd23f', h)                               # verres dorés
    b.part('sph', (0.5, 0.48, 0.18), (-0.02, 0, 0.47), '#d8d8d8', h, seg=10)                       # cheveux argent
    b.part('rbox', (0.1, 0.24, 0.07), (0.23, 0, 0.14), '#d8d8d8', h)                               # moustache argent
    b.part('cyl', (0.06, 0.06, 0.24), (0.32, 0.06, 0.1), '#7a4a2a', h, rot=(0, 80, 10), seg=6)     # cigare
    b.part('sph', (0.05, 0.05, 0.05), (0.44, 0.08, 0.11), '#ff6a20', h, seg=4)
    # bras droit cybernétique (côté proche)
    b.part('rbox', (0.2, 0.2, 0.3), (0, 0, -0.14), '#9aa3b8', J['elN'])
    b.part('cyl', (0.12, 0.12, 0.12), (0, 0, 0), '#38f2ff', J['elN'], rot=(90, 0, 0), seg=8)
    # mallette géante dorée (arme + bouclier)
    bag = b.piv('briefcase', (0.05, 0, -0.18), J['handF'])
    b.part('rbox', (0.8, 0.2, 0.6), (0.1, 0, -0.28), '#ffd23f', bag)
    b.part('box', (0.82, 0.21, 0.05), (0.1, 0, -0.12), '#7a5a10', bag)
    b.part('box', (0.06, 0.22, 0.2), (0.1, 0, -0.28), '#ff2e88', bag)                              # logo BlingCo
    return J


# ------------------------------------------------------------------ objets du niveau
def build_drone(b):
    r = b.piv('root')
    body = b.piv('body', (0, 0, 0), r)
    b.part('cyl', (0.6, 0.6, 0.16), (0, 0, 0), '#2a2d40', body, seg=10)
    b.part('sph', (0.3, 0.3, 0.2), (0, 0, -0.1), '#1a1c2c', body, seg=8)
    b.part('sph', (0.12, 0.12, 0.1), (0.12, 0, -0.14), '#ff1a3c', body, seg=6)                     # oeil-camera
    for i in range(4):
        a = i * math.pi / 2 + math.pi / 4
        b.part('box', (0.42, 0.06, 0.04), (math.cos(a) * 0.3, math.sin(a) * 0.3, 0.04), '#9aa3b8', body, rot=(0, 0, math.degrees(a)))
        b.part('cyl', (0.28, 0.28, 0.02), (math.cos(a) * 0.5, math.sin(a) * 0.5, 0.08), '#38f2ff', body, seg=8)
    b.part('box', (0.02, 0.4, 0.1), (0.3, 0, 0.0), '#ff2e88', body)


def build_terminal(b):
    r = b.piv('root')
    b.part('rbox', (0.6, 0.6, 1.2), (0, 0, 0.6), '#2a2d40', r)
    b.part('rbox', (0.5, 0.7, 0.5), (0.1, 0, 1.4), '#1a1c2c', r, rot=(0, -20, 0))
    scr = b.part('box', (0.04, 0.6, 0.4), (0.33, 0, 1.45), '#ff2e88', r, rot=(0, -20, 0))
    scr.name = 'screen'
    b.part('box', (0.04, 0.5, 0.06), (0.31, 0, 0.9), '#38f2ff', r)


def build_portique(b):
    r = b.piv('root')
    for y in (-1.5, 1.5):  # deux bornes, le laser est dessine par le jeu
        b.part('rbox', (0.4, 0.3, 1.6), (0, y, 0.8), '#2a2d40', r)
        b.part('box', (0.42, 0.06, 1.2), (0, y - 0.13 * (1 if y > 0 else -1), 0.8), '#ff1a3c', r)
        b.part('sph', (0.2, 0.2, 0.2), (0, y, 1.7), '#ff1a3c', r, seg=6)


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


GUARD = dict(shN=25, elN=60, shF=20, elF=40, hipN=8, hipF=-8, kneeN=-6, torso=3)
renders = []
for name, fn, frame, ppu, cz, pose in [
        ('consultant', build_consultant, 420, 150, 1.25, GUARD),
        ('juriste', build_juriste, 420, 150, 1.25, dict(GUARD, shN=40, elN=90)),
        ('directeur', build_directeur, 420, 120, 1.4, dict(GUARD, shF=10, elF=30))]:
    sc = setup_scene("S3K_" + name, frame, frame, style='funk')
    b = B(sc)
    J = fn(b)
    apply_pose(J, pose)
    for label, yaw in (('trois_quarts', 45), ('profil', 0)):
        for o in [o for o in sc.collection.objects if o.type == 'CAMERA']:
            bpy.data.objects.remove(o, do_unlink=True)
        sprite_camera(sc, frame, cz, yaw=yaw, ppu=ppu)
        p = os.path.join(SHEET_DIR, "%s_%s.png" % (name, label))
        render_to(sc, p)
        renders.append(p)
    apply_pose(J, {})
    export(sc, name)
for name, fn in (('drone', build_drone), ('terminal', build_terminal), ('portique', build_portique)):
    sc = setup_scene("S3K_" + name, 300, 300, style='funk')
    b = B(sc)
    fn(b)
    sprite_camera(sc, 300, 0.9, yaw=45, ppu=110)
    p = os.path.join(SHEET_DIR, "%s.png" % name)
    render_to(sc, p)
    renders.append(p)
    export(sc, name)
result = {"renders": renders}
