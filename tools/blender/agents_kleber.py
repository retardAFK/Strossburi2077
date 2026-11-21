# Validé par Maxime le 21/11/2026 (« top »).
# Sbires de la Place Kléber (2026) : agents de sécurité BlingCo en gilet fluo, à pied — même look que l'attelage de
# Marco CeKlair (casquette « SÉCURITÉ » à bande fluo, lunettes noires, oreillette, barbe de 3 jours, col montant).
# Choix de Maxime (21/11/2026) : « un peu des 3 » → 3 variantes :
#   A « Péagiste » : TPE brandi comme une matraque (« 2 BC le mètre »)
#   B « Bouclier pub » : bouclier-écran qui diffuse des pubs (à contourner)
#   C « Neigeur » : canon à neige artificielle qui gèle… sauf si on paie
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\agents_kleber.py", encoding="utf-8").read())
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
DARK, FLUO, REFL, SKIN, PINK, CYAN, GOLD, RED = '#14141c', '#d8ff1a', '#c8ccd8', '#c99070', '#ff2e88', '#38f2ff', '#ffc040', '#ff1a3c'


def agent(b, variant='A', pose=None):
    pose = pose or {}
    root = b.piv('root')
    pel = b.piv('pelvis', (0, 0, 0.9), root)
    for side, y in (('N', -0.12), ('F', 0.12)):
        h = b.piv('hip' + side, (0, y, 0), pel)
        b.part('box', (0.15, 0.15, 0.45), (0, 0, -0.22), DARK, h)
        k = b.piv('knee' + side, (0, 0, -0.45), h)
        b.part('box', (0.14, 0.14, 0.42), (0, 0, -0.21), DARK, k)
        b.part('box', (0.24, 0.15, 0.08), (0.05, 0, -0.43), DARK, k)
    tor = b.piv('torso', (0, 0, 0.04), pel)
    b.part('rbox', (0.3, 0.45, 0.55), (0, 0, 0.28), DARK, tor)
    b.part('rbox', (0.32, 0.47, 0.42), (0, 0, 0.3), FLUO, tor)
    b.part('box', (0.33, 0.48, 0.05), (0, 0, 0.23), REFL, tor)
    b.part('box', (0.33, 0.48, 0.05), (0, 0, 0.4), REFL, tor)
    hd = b.piv('head', (0.02, 0, 0.66), tor)
    b.part('rbox', (0.24, 0.22, 0.24), (0, 0, 0), SKIN, hd)
    b.part('box', (0.04, 0.22, 0.05), (0.12, 0, 0.03), DARK, hd)                                # lunettes noires
    b.part('rbox', (0.26, 0.25, 0.1), (-0.01, 0, 0.13), DARK, hd)                               # casquette
    b.part('box', (0.14, 0.24, 0.025), (0.14, 0, 0.09), DARK, hd)
    b.part('box', (0.265, 0.255, 0.03), (-0.01, 0, 0.1), FLUO, hd)
    b.part('box', (0.02, 0.12, 0.04), (0.125, 0, 0.14), '#ffffff', hd)                          # « SÉCURITÉ »
    b.part('box', (0.04, 0.2, 0.08), (0.11, 0, -0.08), '#5a4030', hd)                           # barbe de 3 jours
    b.part('box', (0.02, 0.012, 0.25), (-0.05, -0.12, -0.18), '#e8e8f0', hd)                   # fil d'oreillette
    b.part('rbox', (0.22, 0.3, 0.1), (0, 0, -0.16), DARK, hd)                                   # col montant
    for side, y in (('N', -0.29), ('F', 0.29)):
        sh = b.piv('sh' + side, (0, y, 0.48), tor)
        sh.rotation_euler = (0, math.radians(pose.get('sh' + side, 0)), 0)
        b.part('box', (0.12, 0.12, 0.34), (0, 0, -0.17), DARK, sh)
        el = b.piv('el' + side, (0, 0, -0.34), sh)
        el.rotation_euler = (0, math.radians(pose.get('el' + side, 0)), 0)
        b.part('box', (0.11, 0.11, 0.3), (0, 0, -0.15), DARK, el)
        hn = b.piv('hand' + side, (0, 0, -0.32), el)
        b.part('sph', (0.09, 0.09, 0.09), (0, 0, 0), SKIN, hn, seg=6)
        if side == 'N':
            if variant == 'A':                                                                    # TPE-matraque
                t = b.piv('tpe', (0.05, 0, -0.05), hn)
                b.part('box', (0.06, 0.06, 0.4), (0, 0, -0.2), DARK, t)
                b.part('rbox', (0.12, 0.1, 0.18), (0.0, 0, -0.42), '#2a2a34', t)
                b.part('box', (0.02, 0.08, 0.08), (0.065, 0, -0.38), CYAN, t)                      # écran « 2 BC/m »
            elif variant == 'C':                                                                  # canon à neige
                c = b.piv('canon_neige', (0.1, 0, 0), hn)
                b.part('cyl', (0.12, 0.12, 0.45), (0.18, 0, 0), '#e8eef8', c, rot=(0, 90, 0), seg=8)
                b.part('cyl', (0.16, 0.16, 0.08), (0.42, 0, 0), CYAN, c, rot=(0, 90, 0), seg=8)
                b.part('box', (0.04, 0.12, 0.06), (0.1, 0, 0.12), GOLD, c)                         # monnayeur « payez pour arrêter »
                for k in range(6):
                    b.part('box', (0.04, 0.04, 0.04), (0.55 + k * 0.08, ((k * 7) % 5 - 2) * 0.03, ((k * 3) % 5 - 2) * 0.03), '#ffffff', c)
        else:
            if variant == 'B':                                                                    # bouclier-écran pub
                s = b.piv('bouclier', (0.1, 0.05, 0.1), hn)
                b.part('box', (0.05, 0.6, 0.8), (0.04, 0, 0.1), DARK, s)
                b.part('box', (0.055, 0.52, 0.7), (0.045, 0, 0.1), PINK, s)
                b.part('box', (0.06, 0.4, 0.15), (0.05, 0, 0.25), GOLD, s)
                b.part('box', (0.06, 0.3, 0.08), (0.05, 0, -0.05), '#ffffff', s)
    if variant == 'C':
        b.part('rbox', (0.2, 0.3, 0.4), (-0.22, 0, 0.3), '#e8eef8', tor)                         # réservoir à neige dans le dos
    return root


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_agents_kleber", 1000, 480)
bb = B(sc)
a = agent(bb, 'A', dict(shN=-70, elN=-30)); a.location = (0, -1.3, 0)
b2 = agent(bb, 'B', dict(shF=-60)); b2.location = (0, 0, 0)
c = agent(bb, 'C', dict(shN=-85)); c.location = (0, 1.3, 0)
for label, yaw in (('trois_quarts', 35), ('face', 90)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    sprite_camera(sc, 1000, 0.9, yaw=yaw, ppu=185)
    p = os.path.join(SHEET_DIR, f"agents_kleber_{label}.png"); render_to(sc, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    out = []
    for name, v in (("agent_kleber_peagiste", 'A'), ("agent_kleber_bouclier", 'B'), ("agent_kleber_neigeur", 'C')):
        s = scene("S3K_exp_" + name, 64, 64)
        agent(B(s), v)
        win = bpy.context.window; prev = win.scene; win.scene = s
        try:
            bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, name + ".glb"), export_format='GLB',
                                      use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
        finally:
            win.scene = prev
        out.append(name)
    result["glb"] = out
