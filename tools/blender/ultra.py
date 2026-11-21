# Le heros : l'Ultra de la Meinau (design v1 retenu : moustache, sans barbe). Executer dans Blender :
#   exec(open(r"C:\Users\mbarbe\Desktop\Stras3000\tools\blender\ultra.py").read())
# Produit : assets/models/ultra.glb + planche de presentation tools/blender/out/ultra_*.png
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

# motifs : echarpe en satin bleu / blanc, jean noir, jean bleu
s3k_lib.PATTERNS['satin_bw'] = s3k_lib._pattern_stripes('#1f5fd0', '#f4f6ff', w=4, vertical=False)
s3k_lib.PATTERNS['denim_black'] = [[('#2a2a34' if (x + y) % 4 else '#33333f') for x in range(16)] for y in range(16)]
s3k_lib.PATTERNS['jeans'] = [[('#3a5a9a' if (x + 2 * y) % 5 else '#4a6aaa') for x in range(16)] for y in range(16)]

C = dict(skin='#e8b48c', skin_d='#c99070', denim='tex:denim_black', stitch='#8a8a9e', jeans='tex:jeans',
         hood='#8a8f9a', cap='#1a2340', shoe='#f2f2f2', sole='#d9b27a', glass='#111118', lens='#3a4a70',
         mustache='#5a3a26', silver='#c8ccd8')


def build_ultra(b):
    J = {}
    root = b.piv('root')
    thigh, shin = 0.44, 0.42
    hip_h = thigh + shin + 0.16
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    tor = b.piv('torso', (0, 0, 0), pel)
    J.update(root=root, pelvis=pel, torso=tor, _hip_h=hip_h)
    tw_x, tw_y, th = 0.46, 0.5, 0.7
    for side, far in (('N', False), ('F', True)):
        sg = 1 if far else -1
        h = b.piv('hip' + side, (0, sg * 0.13, 0), pel)
        b.part('rbox', (0.24, 0.24, thigh + 0.06), (0, 0, -thigh / 2), C['jeans'], h)
        k = b.piv('knee' + side, (0, 0, -thigh), h)
        b.part('rbox', (0.22, 0.22, shin + 0.04), (0, 0, -shin / 2), C['jeans'], k)
        b.part('rbox', (0.25, 0.25, 0.08), (0, 0, -shin + 0.06), '#2d4a85', k)          # ourlet retrousse
        ft = b.piv('foot' + side, (0, 0, -shin), k)
        b.part('rbox', (0.42, 0.27, 0.17), (0.08, 0, -0.08), C['shoe'], ft)              # basket
        b.part('rbox', (0.44, 0.28, 0.06), (0.08, 0, -0.15), C['sole'], ft)              # semelle gomme
        b.part('box', (0.22, 0.02, 0.06), (0.06, sg * 0.14, -0.07), '#1f5fd0', ft)      # bande bleue
        J.update({'hip' + side: h, 'knee' + side: k, 'foot' + side: ft})
        # bras
        s = b.piv('sh' + side, (0, sg * (tw_y / 2 + 0.09), th - 0.1), tor)
        b.part('rbox', (0.19, 0.19, 0.36), (0, 0, -0.17), C['denim'], s)
        e = b.piv('el' + side, (0, 0, -0.34), s)
        b.part('rbox', (0.18, 0.18, 0.3), (0, 0, -0.14), C['denim'], e)
        b.part('rbox', (0.2, 0.2, 0.07), (0, 0, -0.29), C['stitch'], e)                 # poignet
        hd = b.piv('hand' + side, (0, 0, -0.32), e)
        b.part('rbox', (0.2, 0.18, 0.2), (0.02, 0, -0.08), C['skin'], hd)
        J.update({'sh' + side: s, 'el' + side: e, 'hand' + side: hd})
    # torse : sweat a capuche gris sous la veste en jean noire ouverte
    b.part('rbox', (tw_x - 0.04, tw_y - 0.06, th - 0.04), (0, 0, th / 2), C['hood'], tor)
    for sg in (-1, 1):  # pans de la veste
        b.part('rbox', (tw_x, 0.2, th), (0, sg * 0.16, th / 2), C['denim'], tor)
        b.part('box', (0.02, 0.012, th - 0.1), (tw_x / 2 + 0.005, sg * 0.07, th / 2), C['stitch'], tor)  # surpiqures
        b.part('rbox', (0.05, 0.14, 0.12), (tw_x / 2 + 0.01, sg * 0.15, th - 0.2), '#33333f', tor)      # poche poitrine
        b.part('sph', (0.035, 0.035, 0.035), (tw_x / 2 + 0.04, sg * 0.15, th - 0.15), C['silver'], tor, seg=4)
    b.part('rbox', (tw_x + 0.02, tw_y + 0.02, 0.1), (0, 0, 0.05), '#33333f', tor)          # ceinture de veste
    b.part('rbox', (0.22, 0.4, 0.2), (-0.2, 0, th - 0.02), C['hood'], tor)                 # capuche dans le dos
    b.part('box', (0.03, 0.03, 0.22), (tw_x / 2 + 0.01, -0.03, th - 0.22), '#d8d8e0', tor)  # cordons
    b.part('box', (0.03, 0.03, 0.18), (tw_x / 2 + 0.01, 0.03, th - 0.22), '#d8d8e0', tor)
    # echarpe en satin bleu et blanc : tour de cou + deux pans qui tombent devant
    b.part('cyl', (0.5, 0.52, 0.16), (0, 0, th + 0.02), 'tex:satin_bw', tor, seg=10)
    for sg, ln in ((-1, 0.62), (1, 0.5)):
        pan = b.piv('scarf' + ('N' if sg < 0 else 'F'), (0.2, sg * 0.1, th), tor)
        pan.rotation_euler = (math.radians(sg * 6), math.radians(-12), 0)
        b.part('rbox', (0.05, 0.16, ln), (0, 0, -ln / 2), 'tex:satin_bw', pan, r2=0.2)
        for i in range(3):  # franges
            b.part('box', (0.02, 0.03, 0.08), (0, -0.05 + i * 0.05, -ln - 0.03), '#f4f6ff', pan)
    # tete : visage lisse, moustache seule (pas de barbe ni de machoire rapportee)
    head = b.piv('head', (0, 0, th + 0.06), tor)
    J['head'] = head
    hs = 0.5
    b.part('sph', (hs * 0.92, hs * 0.86, hs), (0.02, 0, hs / 2), C['skin'], head, seg=12, smooth=True)
    b.part('rbox', (0.06, 0.22, 0.05), (0.225, 0, 0.13), C['mustache'], head)              # moustache
    b.part('sph', (0.09, 0.08, 0.1), (0.24, 0, 0.21), C['skin_d'], head, seg=6, smooth=True)  # nez
    b.part('rbox', (0.08, 0.44, 0.1), (0.21, 0, 0.29), C['glass'], head)                    # lunettes de soleil
    b.part('box', (0.03, 0.17, 0.07), (0.25, -0.1, 0.29), C['lens'], head)
    b.part('box', (0.03, 0.17, 0.07), (0.25, 0.1, 0.29), C['lens'], head)
    b.part('box', (0.02, 0.05, 0.02), (0.265, -0.13, 0.31), '#ffffff', head)                 # reflet
    for sg in (-1, 1):
        b.part('sph', (0.08, 0.06, 0.12), (0.0, sg * 0.24, 0.22), C['skin_d'], head, seg=6)  # oreilles
    # casquette bleu nuit, visiere vers l'avant, petite cigogne blanche brodee
    cap = b.piv('cap', (0, 0, 0.38), head)
    b.part('sph', (0.5, 0.47, 0.34), (0, 0, 0.04), C['cap'], cap, seg=12)
    b.part('cyl', (0.49, 0.46, 0.08), (0, 0, -0.04), C['cap'], cap, seg=12)
    b.part('rbox', (0.32, 0.4, 0.04), (0.3, 0, -0.06), C['cap'], cap, rot=(0, -8, 0))       # visiere
    b.part('sph', (0.07, 0.07, 0.04), (0, 0, 0.21), C['cap'], cap, seg=6)                   # bouton
    rcs_badge(b, cap)                                                                        # losange RCS
    return J


LOGO = os.path.join(ROOT3, "assets", "textures", "rcs_logo.png")


def rcs_badge(b, parent):
    """Ecusson en losange sur le devant de la casquette, texture = logo fourni par Maxime."""
    img = bpy.data.images.get("rcs_logo.png") or bpy.data.images.load(LOGO)
    img.pack()
    m = bpy.data.materials.get("S3K_rcs_logo") or bpy.data.materials.new("S3K_rcs_logo")
    m.use_nodes = True
    nt = m.node_tree
    bsdf = [n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'][0]
    tex = next((n for n in nt.nodes if n.type == 'TEX_IMAGE'), None) or nt.nodes.new('ShaderNodeTexImage')
    tex.image = img
    nt.links.new(tex.outputs[0], bsdf.inputs[0])
    nt.nodes.active = tex
    # losange : sommets du logo dans l'image (350x501 px) -> UV
    W_, H_ = 350.0, 501.0
    pts = [(175, 3), (3, 247), (175, 498), (347, 247)]  # ordre choisi pour une normale vers +X
    hgt, wid = 0.2, 0.14
    bm = bmesh.new()
    uvl = bm.loops.layers.uv.new()
    vs = []
    for px, py in pts:
        y = (px / W_ - 0.5) * wid * (W_ / 344.0)   # largeur du losange
        z = (0.5 - py / H_) * hgt * (H_ / 495.0)
        vs.append(bm.verts.new((0, y, z)))        # vu de face (+X), +Y est a droite de l'ecran
    f = bm.faces.new(vs)
    kw, kh = wid * (W_ / 344.0), hgt * (H_ / 495.0)
    for l in f.loops:  # UV deduits de la position (independant de l'ordre des boucles)
        l[uvl].uv = (0.5 + l.vert.co.y / kw, 0.5 + l.vert.co.z / kh)
    me = bpy.data.meshes.new("rcs_badge")
    bm.to_mesh(me)
    bm.free()
    if me.polygons[0].normal.x < 0:
        me.flip_normals()
    me.materials.append(m)
    o = bpy.data.objects.new("rcs_badge", me)
    b.sc.collection.objects.link(o)
    o.parent = parent
    o.location = (0.245, 0, 0.05)
    o.rotation_euler = (0, math.radians(-18), 0)
    return o


GUARD = dict(shN=25, elN=70, shF=30, elF=60, hipN=8, kneeN=-8, hipF=-8, kneeF=-4, torso=4)


def render_views(sc, J, name, views, frame=420, ppu=150, pose=None):
    paths = []
    apply_pose(J, pose if pose is not None else {}, GUARD if pose is None else None)
    for label, yaw in views:
        for o in [o for o in sc.collection.objects if o.type == 'CAMERA']:
            bpy.data.objects.remove(o, do_unlink=True)
        sprite_camera(sc, frame, 1.25, yaw=yaw, ppu=ppu)
        p = os.path.join(SHEET_DIR, "%s_%s.png" % (name, label))
        render_to(sc, p)
        paths.append(p)
    return paths


sc = setup_scene("S3K_Ultra", 420, 420, style='funk')
b = B(sc)
J = build_ultra(b)
out = render_views(sc, J, 'ultra', [('face', 90), ('trois_quarts', 45), ('profil', 0), ('dos', 270)])
out += render_views(sc, J, 'ultra_coup', [('pose', 35)], pose=dict(GUARD, shN=95, elN=5, torso=14, hipN=20, hipF=-22, shF=40, elF=90))
out += render_views(sc, J, 'ultra_chant', [('pose', 55)], pose=dict(shN=170, elN=10, shF=150, elF=30, head=-14, torso=-6))
# export du modele pour le jeu (pose neutre)
apply_pose(J, {})
for o in [o for o in sc.collection.objects if o.type == 'CAMERA']:
    bpy.data.objects.remove(o, do_unlink=True)
win = bpy.context.window
prev = win.scene
win.scene = sc
try:
    bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, "ultra.glb"), export_format='GLB', use_active_scene=True,
                              export_cameras=False, export_lights=False, export_yup=True)
finally:
    win.scene = prev
result = {"renders": out}
