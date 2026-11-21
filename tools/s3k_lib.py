# Strasbourg 3000 - bibliotheque commune pour generer les assets dans Blender
# (rendu Workbench, sans anti-aliasing => look pixel art 16 bits)
import bpy, bmesh, math, os, json
import numpy as np
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

ROOT = r"C:\Users\mbarbe\Desktop\Stras3000"
OUT = os.path.join(ROOT, "game", "assets")
TMP = os.path.join(ROOT, "tools", "_frames")
PPU = 24  # pixels par unite Blender (identique pour sprites et decor)
TILT = 15  # degres de plongee de la camera
os.makedirs(OUT, exist_ok=True)
os.makedirs(TMP, exist_ok=True)


def _s2l(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hexrgb(h):
    h = h.lstrip('#')
    return [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]


def dk(h, f=0.72):
    r, g, b = hexrgb(h)
    return '#%02x%02x%02x' % (int(r * 255 * f), int(g * 255 * f), int(b * 255 * f))


_MATS = {}


def M(h):
    h = h.lower()
    m = _MATS.get(h)
    if m and m.name in bpy.data.materials:
        return m
    m = bpy.data.materials.get("S3K_" + h)
    if h.startswith('tex:'):
        return tex_material(h[4:])
    if m is None:
        m = bpy.data.materials.new("S3K_" + h)
    r, g, b = [_s2l(c) for c in hexrgb(h)]
    m.diffuse_color = (r, g, b, 1)
    m.roughness = 1.0
    m.metallic = 0.0
    if m.node_tree:  # Blender 5 : materiaux toujours en nodes -> couleur aussi dans le BSDF (export glTF)
        for n_ in m.node_tree.nodes:
            if n_.type == 'BSDF_PRINCIPLED':
                n_.inputs['Base Color'].default_value = (r, g, b, 1)
                n_.inputs['Roughness'].default_value = 1.0
    _MATS[h] = m
    return m


# ---------------------------------------------------------------- textures (motifs)
# Chaque motif : liste de lignes de pixels (codes -> couleurs). Une repetition = TEX_REPEAT unites.
TEX_REPEAT = 0.7
PATTERNS = {}


def _pattern_kelsch(c1, c2, c3, n=16, sq=4):
    rows = []
    for y in range(n):
        row = []
        for x in range(n):
            a, b = (x // sq) % 2, (y // sq) % 2
            row.append(c3 if (a and b) else (c2 if (a or b) else c1))
        rows.append(row)
    return rows


def _pattern_stripes(c1, c2, n=16, w=4, vertical=True):
    return [[(c2 if ((x if vertical else y) // w) % 2 else c1) for x in range(n)] for y in range(n)]


def register_patterns():
    PATTERNS['kelsch_red'] = _pattern_kelsch('#fff4e8', '#e0303a', '#9c1426')
    PATTERNS['kelsch_blue'] = _pattern_kelsch('#fff4e8', '#3a6be0', '#1f3c9c')
    PATTERNS['kelsch_pink'] = _pattern_kelsch('#fff0fa', '#ff4fa8', '#c0207a')
    PATTERNS['stripes_lime'] = _pattern_stripes('#2a1a5e', '#b6ff3a', w=2)
    PATTERNS['zebra'] = _pattern_stripes('#111111', '#f4f4f4', w=3, vertical=False)


register_patterns()


def tex_material(name):
    mname = "S3K_tex_" + name
    m = bpy.data.materials.get(mname)
    if m:
        return m
    rows = PATTERNS[name]
    n = len(rows)
    img = bpy.data.images.get("S3K_img_" + name) or bpy.data.images.new("S3K_img_" + name, n, n)
    px = np.zeros((n, n, 4), dtype=np.float32)
    for y in range(n):
        for x in range(n):
            r, g, b = hexrgb(rows[n - 1 - y][x])
            px[y, x] = (r, g, b, 1)
    img.pixels.foreach_set(px.ravel())
    img.pack()
    m = bpy.data.materials.new(mname)
    m.use_nodes = True
    nt = m.node_tree
    tex = nt.nodes.new('ShaderNodeTexImage')
    tex.image = img
    tex.interpolation = 'Closest'
    bsdf = [n_ for n_ in nt.nodes if n_.type == 'BSDF_PRINCIPLED'][0]
    nt.links.new(tex.outputs[0], bsdf.inputs[0])
    nt.nodes.active = tex
    m.diffuse_color = (0.8, 0.2, 0.2, 1)
    return m


def setup_scene(name, w, h, style='classic'):
    sc = bpy.data.scenes.get(name)
    if sc is None:
        sc = bpy.data.scenes.new(name)
    clear(sc)
    r = sc.render
    r.engine = 'BLENDER_WORKBENCH'
    r.resolution_x, r.resolution_y, r.resolution_percentage = w, h, 100
    r.film_transparent = True
    r.image_settings.file_format = 'PNG'
    r.image_settings.color_mode = 'RGBA'
    sc.display.render_aa = 'OFF'
    sh = sc.display.shading
    sh.light = 'STUDIO'
    sh.color_type = 'MATERIAL'
    sh.show_object_outline = True
    sh.object_outline_color = (0.03, 0.02, 0.06)
    sh.show_specular_highlight = False
    sh.show_cavity = False
    sh.show_shadows = False
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    if style == 'funk':  # cel-shading "dessin anime annees 80" + motifs
        sh.light = 'MATCAP'
        sh.studio_light = 'toon_light.exr'
        sh.color_type = 'TEXTURE'
        sh.object_outline_color = (0.02, 0.0, 0.05)
        sh.show_cavity = True
        sh.cavity_type = 'SCREEN'
        sh.curvature_ridge_factor = 1.0
        sh.curvature_valley_factor = 1.6
    return sc


def clear(sc):
    for o in list(sc.collection.all_objects):
        bpy.data.objects.remove(o, do_unlink=True)


def mk_mesh(kind, size, seg=8, r2=0.0):
    bm = bmesh.new()
    if kind == 'box':
        bmesh.ops.create_cube(bm, size=1.0)
    elif kind == 'sph':
        bmesh.ops.create_uvsphere(bm, u_segments=seg + 2, v_segments=max(4, seg // 2 + 2), radius=0.5)
    elif kind == 'cyl':
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=0.5, radius2=0.5, depth=1.0)
    elif kind == 'cone':
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=0.5, radius2=max(0.0005, r2 * 0.5), depth=1.0)
    elif kind == 'prism':  # prisme triangulaire (toit), arete le long de X
        vs = [bm.verts.new(v) for v in [(-.5, -.5, -.5), (.5, -.5, -.5), (.5, .5, -.5), (-.5, .5, -.5), (-.5, 0, .5), (.5, 0, .5)]]
        bm.faces.new([vs[0], vs[1], vs[2], vs[3]])
        bm.faces.new([vs[0], vs[4], vs[5], vs[1]])
        bm.faces.new([vs[3], vs[2], vs[5], vs[4]])
        bm.faces.new([vs[0], vs[3], vs[4]])
        bm.faces.new([vs[1], vs[5], vs[2]])
    elif kind == 'gable':  # prisme triangulaire, pignon face camera (arete le long de Y)
        vs = [bm.verts.new(v) for v in [(-.5, -.5, -.5), (.5, -.5, -.5), (.5, .5, -.5), (-.5, .5, -.5), (0, -.5, .5), (0, .5, .5)]]
        bm.faces.new([vs[0], vs[1], vs[2], vs[3]])
        bm.faces.new([vs[0], vs[4], vs[1]])
        bm.faces.new([vs[3], vs[2], vs[5]])
        bm.faces.new([vs[0], vs[3], vs[5], vs[4]])
        bm.faces.new([vs[1], vs[4], vs[5], vs[2]])
    elif kind == 'rbox':  # boite aux aretes arrondies (look jouet / cartoon)
        bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
        v.co.z *= size[2]
    if kind == 'rbox':
        off = min(size) * (r2 or 0.28)
        bmesh.ops.bevel(bm, geom=list(bm.edges) + list(bm.verts), offset=off, segments=2, profile=0.5, affect='EDGES')
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    # UV "box projection" a densite constante (motifs a l'echelle du monde)
    uv = bm.loops.layers.uv.new()
    for f in bm.faces:
        nx, ny, nz = [abs(c) for c in f.normal]
        for l in f.loops:
            co = l.vert.co
            if nx >= ny and nx >= nz:
                u, v = co.y, co.z
            elif ny >= nz:
                u, v = co.x, co.z
            else:
                u, v = co.x, co.y
            l[uv].uv = (u / TEX_REPEAT, v / TEX_REPEAT)
    me = bpy.data.meshes.new("s3k_" + kind)
    bm.to_mesh(me)
    bm.free()
    return me


class B:
    """Constructeur d'objets dans une scene."""

    def __init__(self, sc):
        self.sc = sc

    def part(self, kind, size, loc, col, parent=None, rot=(0, 0, 0), seg=8, r2=0.0, smooth=False):
        me = mk_mesh(kind, size, seg, r2)
        o = bpy.data.objects.new("p_" + kind, me)
        self.sc.collection.objects.link(o)
        o.parent = parent
        o.location = loc
        o.rotation_euler = [math.radians(a) for a in rot]
        me.materials.append(M(col))
        if smooth:
            for p in me.polygons:
                p.use_smooth = True
        return o

    def piv(self, name, loc=(0, 0, 0), parent=None):
        e = bpy.data.objects.new(name, None)
        self.sc.collection.objects.link(e)
        e.parent = parent
        e.location = loc
        return e

    def pretzel(self, center, scale, col, parent=None, rot=(0, 0, 0), bead=0.11):
        """Bretzel approxime par une chaine de perles le long d'une courbe."""
        p = self.piv("bretzel", center, parent)
        p.rotation_euler = [math.radians(a) for a in rot]
        n = 34
        for i in range(n):
            t = i / n * 2 * math.pi
            # courbe en forme de bretzel (lemniscate + boucle)
            x = 0.5 * math.sin(t) * (1 + 0.35 * math.cos(t))
            z = 0.32 * math.cos(t) * (1 - 0.6 * math.sin(t) ** 2) + 0.12 * math.cos(2 * t)
            self.part('sph', (bead, bead, bead), (x * scale, 0, z * scale), col, p, seg=6)
        for i in range(5):  # grains de sel
            a = i * 1.3
            self.part('box', (0.03, 0.03, 0.03), (0.35 * math.sin(a) * scale, -bead * 0.5, 0.2 * math.cos(a) * scale), '#ffffff', p)
        return p


def sprite_camera(sc, frame_px, center_z, yaw=20, ppu=None):
    cam_d = bpy.data.cameras.new("s3k_cam")
    cam_d.type = 'ORTHO'
    cam_d.ortho_scale = frame_px / (ppu or PPU)
    cam_d.clip_end = 200
    cam = bpy.data.objects.new("s3k_cam", cam_d)
    sc.collection.objects.link(cam)
    rx, rz = math.radians(90 - TILT), math.radians(yaw)
    cam.rotation_euler = (rx, 0, rz)
    d = Vector((0, 0, -1))
    d.rotate(cam.rotation_euler)
    cam.location = Vector((0, 0, center_z)) - d * 40
    sc.camera = cam
    return cam


def render_to(sc, path):
    sc.render.filepath = path
    win = bpy.context.window
    prev = win.scene
    win.scene = sc
    try:
        bpy.ops.render.render(write_still=True, scene=sc.name)
    finally:
        win.scene = prev


def project_px(sc, cam, p):
    sc.view_layers[0].update()
    co = world_to_camera_view(sc, cam, Vector(p))
    return [round(co.x * sc.render.resolution_x, 1), round((1 - co.y) * sc.render.resolution_y, 1)]


def grade(a, sat=1.35, gain=1.2):
    rgb = a[:, :, :3]
    g = rgb.mean(axis=2, keepdims=True)
    a[:, :, :3] = np.clip((g + (rgb - g) * sat) * gain, 0, 1)
    return a


def assemble(paths, fw, fh, out):
    n = len(paths)
    sheet = np.zeros((fh, fw * n, 4), dtype=np.float32)
    for i, p in enumerate(paths):
        img = bpy.data.images.load(p, check_existing=False)
        a = np.empty(fw * fh * 4, dtype=np.float32)
        img.pixels.foreach_get(a)
        sheet[:, i * fw:(i + 1) * fw] = a.reshape(fh, fw, 4)
        bpy.data.images.remove(img)
    grade(sheet)
    # alpha binaire (pixel art net)
    al = sheet[:, :, 3]
    sheet[:, :, 3] = np.where(al > 0.5, 1.0, 0.0)
    im = bpy.data.images.new("s3k_sheet", fw * n, fh, alpha=True)
    im.pixels.foreach_set(sheet.ravel())
    im.filepath_raw = out
    im.file_format = 'PNG'
    im.save()
    bpy.data.images.remove(im)


# ---------------------------------------------------------------- rig humanoide
JOINTS = ('hipN', 'hipF', 'kneeN', 'kneeF', 'shN', 'shF', 'elN', 'elF', 'torso', 'head')


def humanoid(b, P):
    """P: dict de proportions/couleurs. Le perso regarde vers +X, pieds a l'origine."""
    J = {}
    root = b.piv('root')
    hip_h = P['thigh'] + P['shin'] + 0.13
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    J.update(root=root, pelvis=pel, _hip_h=hip_h)
    lt = P['leg_t']
    for side, yy, far in (('N', -P['hip_w'], False), ('F', P['hip_w'], True)):
        f = (lambda c: dk(c)) if far else (lambda c: c)
        h = b.piv('hip' + side, (0, yy, 0), pel)
        b.part('box', (lt, lt, P['thigh']), (0, 0, -P['thigh'] / 2), f(P['pants']), h)
        k = b.piv('knee' + side, (0, 0, -P['thigh']), h)
        b.part('box', (lt * .9, lt * .9, P['shin']), (0, 0, -P['shin'] / 2), f(P.get('shin_col', P['pants'])), k)
        b.part('box', (P['foot_l'], lt * 1.1, 0.14), (P['foot_l'] * 0.25, 0, -P['shin'] - 0.065), f(P['boots']), k)
        J['hip' + side], J['knee' + side] = h, k
    tor = b.piv('torso', (0, 0, 0), pel)
    th = P['torso_h']
    b.part('box', (P['tw_x'], P['tw_y'], th), (0, 0, th / 2), P['shirt'], tor)
    hd = b.piv('head', (0, 0, th + 0.02), tor)
    hs = P['head']
    b.part('sph', (hs * P.get('head_x', 1), hs, hs * P.get('head_z', 1.05)), (0.02, 0, hs / 2), P['skin'], hd, seg=10)
    J.update(torso=tor, head=hd)
    at = P['arm_t']
    for side, sgn, far in (('N', -1, False), ('F', 1, True)):
        f = (lambda c: dk(c)) if far else (lambda c: c)
        s = b.piv('sh' + side, (0, sgn * (P['tw_y'] / 2 + at / 2), th - 0.07), tor)
        b.part('box', (at, at, P['upper']), (0, 0, -P['upper'] / 2), f(P.get('sleeve', P['shirt'])), s)
        e = b.piv('el' + side, (0, 0, -P['upper']), s)
        b.part('box', (at * .92, at * .92, P['fore']), (0, 0, -P['fore'] / 2), f(P.get('fore_col', P.get('sleeve', P['shirt']))), e)
        b.part('box', (at * 1.15, at * 1.1, at * 1.15), (0, 0, -P['fore'] - at * 0.45), f(P.get('hand', P['skin'])), e)
        J['sh' + side], J['el' + side] = s, e
    # yeux
    ey = P.get('eye', '#111111')
    for yy in (-hs * 0.2, hs * 0.2):
        b.part('box', (0.04, 0.05, P.get('eye_h', 0.07)), (0.02 + hs * 0.47, yy, hs * 0.55), ey, hd)
    return J


def apply_pose(J, p, base=None):
    q = dict(base or {})
    q.update(p)
    for k in JOINTS:
        if k in J:
            J[k].rotation_euler = (0, -math.radians(q.get(k, 0)), 0)
    if 'tilt' in J:
        J['tilt'].rotation_euler = (0, -math.radians(q.get('tilt', 0)), 0)
    J['pelvis'].location = (q.get('x', 0), 0, J['_hip_h'] + q.get('z', 0))
    J['root'].rotation_euler = (0, -math.radians(q.get('fall', 0)), math.radians(q.get('yaw', 0)))
    J['root'].location = (q.get('rx', 0), 0, q.get('rz', 0))


def render_character(sc, J, name, frame_px, anims, base=None, center_z=None, yaw=20, ppu=None):
    """anims: liste (nom, [poses]). Rend chaque pose, assemble la planche, retourne la meta."""
    ppu = ppu or PPU
    if center_z is None:
        center_z = (frame_px / 2 - 7) / ppu / math.cos(math.radians(TILT))
    cam = sprite_camera(sc, frame_px, center_z, yaw, ppu)
    paths, meta = [], {}
    i = 0
    for an, poses in anims:
        meta[an] = [i, len(poses)]
        for p in poses:
            apply_pose(J, p, base)
            path = os.path.join(TMP, "%s_%02d.png" % (name, i))
            render_to(sc, path)
            paths.append(path)
            i += 1
    apply_pose(J, {}, base)
    anchor = project_px(sc, cam, (0, 0, 0))
    assemble(paths, frame_px, frame_px, os.path.join(OUT, name + ".png"))
    return {"img": name + ".png", "fw": frame_px, "fh": frame_px, "anchor": anchor, "anims": meta, "frames": i}


def write_meta(key, data):
    path = os.path.join(OUT, "meta.json")
    allm = {}
    if os.path.exists(path):
        with open(path) as fh:
            allm = json.load(fh)
    allm[key] = data
    with open(path, 'w') as fh:
        json.dump(allm, fh, indent=1)
    with open(os.path.join(OUT, "meta.js"), 'w') as fh:
        fh.write("// genere par tools/*.py (Blender)\nwindow.S3K_META = " + json.dumps(allm, indent=1) + ";\n")
