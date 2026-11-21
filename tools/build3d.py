# Modeles low poly du prototype 3D (donjon de la cathedrale). Executer dans Blender :
#   exec(open(r"C:\Users\mbarbe\Desktop\Stras3000\tools\build3d.py").read())
# Chaque modele est exporte en .glb puis embarque en base64 dans proto3d/models.js
# (le jeu s'ouvre donc d'un double-clic, sans serveur).
import base64
S3K_ONLY = ['__aucun__']  # charge les builders de build_cast80 sans rien rendre
exec(open(r"C:\Users\mbarbe\Desktop\Stras3000\tools\build_cast80.py").read())

OUT3D = os.path.join(ROOT, "proto3d")
MODELS = os.path.join(OUT3D, "models")
os.makedirs(MODELS, exist_ok=True)


def new_scene(name):
    sc = bpy.data.scenes.get(name) or bpy.data.scenes.new(name)
    clear(sc)
    return sc, B(sc)


def export(sc, name):
    path = os.path.join(MODELS, name + ".glb")
    win = bpy.context.window
    prev = win.scene
    win.scene = sc
    try:
        bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_active_scene=True,
                                  export_cameras=False, export_lights=False, export_yup=True)
    finally:
        win.scene = prev
    return path


# ------------------------------------------------------------------ heros (Marcel v2 + baton-bretzel)
def m_hero():
    sc, b = new_scene("S3K_3D_hero")
    J = build_hero(b)
    w = b.piv('weapon', (0.04, 0, -0.08), J['handN'])
    w.rotation_euler = (0, math.radians(90), 0)  # le baton prolonge l'avant-bras vers l'avant
    b.part('cyl', (0.07, 0.07, 0.75), (0, 0, -0.38), '#8a4b1a', w, seg=6)
    b.part('cyl', (0.12, 0.12, 0.06), (0, 0, -0.04), '#ffd700', w, seg=6)
    b.pretzel((0, 0, -0.95), 0.55, '#c0702a', w, rot=(0, 90, 0), bead=0.11)
    apply_pose(J, {})
    return export(sc, "hero")


# ------------------------------------------------------------------ lutin aerobic
def m_lutin():
    sc, b = new_scene("S3K_3D_lutin")
    J = {}
    root = b.piv('root')
    pel = b.piv('pelvis', (0, 0, 0.5), root)
    tor = b.piv('torso', (0, 0, 0), pel)
    J.update(root=root, pelvis=pel, torso=tor)
    for side, yy, far in (('N', -0.09, False), ('F', 0.09, True)):
        h = b.piv('hip' + side, (0, yy, 0), pel)
        b.part('rbox', (0.15, 0.15, 0.3), (0, 0, -0.14), '#ff2e88', h)                # legging rose
        k = b.piv('knee' + side, (0, 0, -0.27), h)
        b.part('rbox', (0.17, 0.17, 0.16), (0, 0, -0.08), '#b6ff3a', k)                 # jambieres
        b.part('rbox', (0.3, 0.16, 0.1), (0.07, 0, -0.18), '#3a2010', k)
        b.part('cone', (0.1, 0.1, 0.16), (0.24, 0, -0.12), '#3a2010', k, rot=(0, 60, 0), seg=4)  # pointe
        s = b.piv('sh' + side, (0, yy * 2.1, 0.33), tor)
        b.part('rbox', (0.11, 0.11, 0.2), (0, 0, -0.1), '#2e9e44', s)
        e = b.piv('el' + side, (0, 0, -0.2), s)
        b.part('rbox', (0.1, 0.1, 0.18), (0, 0, -0.09), '#f2c19b', e)
        b.part('sph', (0.13, 0.13, 0.13), (0, 0, -0.2), '#f2c19b', e, seg=6)
    b.part('rbox', (0.34, 0.32, 0.4), (0, 0, 0.18), '#2e9e44', tor)                     # justaucorps vert
    b.part('box', (0.36, 0.34, 0.06), (0, 0, 0.02), '#ffe600', tor)
    b.part('rbox', (0.12, 0.2, 0.08), (0.17, 0, 0.1), '#1d1b2e', tor)                   # walkman
    b.part('box', (0.03, 0.08, 0.05), (0.23, 0, 0.1), '#ff8c1a', tor)
    hd = b.piv('head', (0, 0, 0.4), tor)
    J['head'] = hd
    b.part('sph', (0.44, 0.42, 0.42), (0.02, 0, 0.2), '#f2c19b', hd, seg=10, smooth=True)
    b.part('cyl', (0.45, 0.43, 0.07), (0, 0, 0.28), '#38f2ff', hd, seg=10)              # bandeau
    for yy in (-0.08, 0.08):
        b.part('box', (0.04, 0.06, 0.07), (0.21, yy, 0.22), '#1b0f0f', hd)
    b.part('box', (0.04, 0.16, 0.03), (0.22, 0, 0.32), '#7a1a1a', hd)
    b.part('box', (0.04, 0.14, 0.03), (0.22, 0, 0.1), '#7a1a1a', hd)
    for yy, r in ((-0.21, 60), (0.21, -60)):
        b.part('cone', (0.1, 0.1, 0.26), (-0.02, yy, 0.22), '#f2c19b', hd, rot=(r, 0, 0), seg=4)
    for yy in (-0.12, 0.12):  # ecouteurs
        b.part('cyl', (0.1, 0.1, 0.05), (0, yy * 1.75, 0.2), '#ff8c1a', hd, rot=(90, 0, 0), seg=8)
    hat = b.piv('hat', (-0.03, 0, 0.36), hd)
    hat.rotation_euler = (0, math.radians(-40), 0)
    b.part('cone', (0.42, 0.42, 0.6), (0, 0, 0.26), '#d62828', hat, seg=8)
    b.part('cyl', (0.44, 0.44, 0.08), (0, 0, -0.02), '#ffffff', hat, seg=10)
    b.part('sph', (0.13, 0.13, 0.13), (0, 0, 0.58), '#ffffff', hat, seg=6)
    return export(sc, "lutin")


# ------------------------------------------------------------------ boss : le Coq automate de l'horloge
def m_coq():
    sc, b = new_scene("S3K_3D_coq")
    root = b.piv('root')
    pel = b.piv('pelvis', (0, 0, 1.6), root)
    gold, bronze, red = '#e8b33a', '#a8682a', '#e0303a'
    for side, yy in (('N', -0.35), ('F', 0.35)):
        h = b.piv('hip' + side, (0, yy, 0), pel)
        b.part('cyl', (0.16, 0.16, 0.8), (0, 0, -0.4), '#7d7f96', h, seg=6)
        k = b.piv('knee' + side, (0, 0, -0.8), h)
        b.part('cyl', (0.12, 0.12, 0.7), (0, 0, -0.35), '#ff8c1a', k, seg=6)
        for a in (-35, 0, 35):
            b.part('box', (0.45, 0.08, 0.06), (0.2 * math.cos(math.radians(a)), 0.2 * math.sin(math.radians(a)), -0.72), '#ff8c1a', k, rot=(0, 0, a))
    body = b.piv('torso', (0, 0, 0.2), pel)
    b.part('sph', (2.0, 1.4, 1.5), (0, 0, 0.4), gold, body, seg=12)
    for i in range(5):  # plaques d'armure
        b.part('rbox', (0.5, 1.45, 0.25), (-0.5 + i * 0.25, 0, 0.0 + i * 0.08), bronze, body, rot=(0, -20, 0))
    for side, yy in (('N', -0.72), ('F', 0.72)):  # ailes
        w = b.piv('sh' + side, (0.2, yy, 0.7), body)
        b.part('rbox', (1.4, 0.12, 0.7), (-0.5, 0, -0.15), bronze, w, rot=(0, -15, 0))
        for i in range(4):
            b.part('box', (0.6, 0.1, 0.16), (-1.0 - i * 0.1, 0, -0.1 - i * 0.16), gold, w, rot=(0, -25, 0))
    tail = b.piv('tail', (-0.9, 0, 0.7), body)
    for i, a in enumerate(range(-50, 51, 20)):
        col = ['#38f2ff', '#ff2e88', gold, '#7a35e0', '#38f2ff', '#ff2e88'][i]
        b.part('rbox', (0.25, 0.12, 1.5), (0, 0, 0.6), col, b.piv('plume', (0, 0, 0), tail), rot=(a, -30, 0))
    # engrenages sur le flanc
    for x, z, r in ((0.2, 0.5, 0.5), (-0.3, 0.2, 0.35)):
        for yy in (-0.72, 0.72):
            b.part('cyl', (r, r, 0.08), (x, yy, z), '#7d7f96', body, rot=(90, 0, 0), seg=10)
            b.part('cyl', (r * 0.35, r * 0.35, 0.1), (x, yy, z), '#3a3a50', body, rot=(90, 0, 0), seg=6)
    nk = b.piv('head', (0.85, 0, 0.9), body)
    b.part('cyl', (0.45, 0.45, 0.8), (0.1, 0, 0.35), gold, nk, rot=(0, 20, 0), seg=8)
    b.part('sph', (0.75, 0.62, 0.7), (0.25, 0, 0.85), gold, nk, seg=10)
    b.part('cone', (0.28, 0.24, 0.5), (0.7, 0, 0.82), '#ffd700', nk, rot=(0, 95, 0), seg=4)  # bec
    for i, z in enumerate((1.25, 1.35, 1.3, 1.15)):  # crete
        b.part('sph', (0.24, 0.12, 0.3), (0.38 - i * 0.16, 0, z), red, nk, seg=6)
    b.part('sph', (0.18, 0.12, 0.3), (0.62, 0, 0.55), red, nk, seg=6)            # barbillon
    for yy in (-0.28, 0.28):
        b.part('sph', (0.2, 0.08, 0.2), (0.48, yy, 0.95), '#ffffff', nk, seg=6)
        b.part('sph', (0.1, 0.06, 0.1), (0.54, yy * 1.07, 0.95), '#ff1a3c', nk, seg=4)   # yeux rouges
    return export(sc, "coq")


# ------------------------------------------------------------------ objets
def m_props():
    paths = []
    sc, b = new_scene("S3K_3D_key")
    k = b.piv('root')
    b.part('cyl', (0.4, 0.4, 0.08), (0, 0, 0.6), '#ffd700', k, rot=(90, 0, 0), seg=8)
    b.part('cyl', (0.18, 0.18, 0.1), (0, 0, 0.6), '#a8682a', k, rot=(90, 0, 0), seg=8)
    b.part('box', (0.08, 0.08, 0.6), (0, 0, 0.2), '#ffd700', k)
    b.part('box', (0.18, 0.08, 0.08), (0.08, 0, -0.04), '#ffd700', k)
    b.part('box', (0.12, 0.08, 0.08), (0.06, 0, 0.1), '#ffd700', k)
    paths.append(export(sc, "key"))

    sc, b = new_scene("S3K_3D_chest")
    r = b.piv('root')
    b.part('rbox', (1.2, 0.8, 0.6), (0, 0, 0.3), '#8a4b1a', r)
    b.part('box', (1.24, 0.84, 0.1), (0, 0, 0.55), '#ffd700', r)
    lid = b.piv('lid', (-0.6, 0, 0.6), r)
    b.part('rbox', (1.2, 0.8, 0.35), (0.6, 0, 0.15), 'tex:kelsch_red', lid)
    b.part('box', (0.1, 0.84, 0.38), (0.6, 0, 0.15), '#ffd700', lid)
    b.part('box', (0.06, 0.2, 0.2), (1.2, 0, 0.0), '#ffd700', lid)
    paths.append(export(sc, "chest"))

    sc, b = new_scene("S3K_3D_pot")
    r = b.piv('root')
    b.part('cyl', (0.7, 0.7, 0.7), (0, 0, 0.35), '#c86a3a', r, seg=8)
    b.part('cyl', (0.78, 0.78, 0.1), (0, 0, 0.7), '#e8d0a0', r, seg=8)
    b.part('sph', (0.6, 0.6, 0.35), (0, 0, 0.78), '#f2e6a0', r, seg=8)            # choucroute
    b.part('cyl', (0.12, 0.12, 0.4), (0.15, 0, 0.9), '#d98a6a', r, rot=(0, 30, 0), seg=6)  # saucisse
    b.part('box', (0.04, 0.72, 0.2), (0.35, 0, 0.35), '#ffffff', r)
    paths.append(export(sc, "pot"))

    sc, b = new_scene("S3K_3D_bretzel")
    r = b.piv('root')
    b.pretzel((0, 0, 0.5), 0.9, '#c0702a', r, rot=(0, 0, 0), bead=0.13)
    paths.append(export(sc, "bretzel"))

    sc, b = new_scene("S3K_3D_bell")
    r = b.piv('root')
    b.part('cyl', (0.7, 0.7, 0.6), (0, 0, 0.3), '#6b6f86', r, seg=8)
    bell = b.piv('bell', (0, 0, 1.6), r)
    b.part('cone', (0.9, 0.9, 0.8), (0, 0, -0.1), '#ffd700', bell, seg=10, r2=0.45)
    b.part('sph', (0.25, 0.25, 0.25), (0, 0, 0.35), '#ffd700', bell, seg=6)
    b.part('cyl', (0.06, 0.06, 1.0), (0, 0, -0.5), '#3a3a50', r, seg=4)
    paths.append(export(sc, "bell"))

    sc, b = new_scene("S3K_3D_clock")   # horloge astronomique (facade)
    r = b.piv('root')
    stone = '#d98c8c'  # gres rose des Vosges
    b.part('rbox', (3.4, 1.0, 6.0), (0, 0, 3.0), stone, r)
    b.part('gable', (3.6, 1.1, 1.4), (0, 0, 6.7), '#b86a6a', r)
    b.part('cyl', (2.0, 2.0, 0.2), (0, -0.52, 3.6), '#1f3c9c', r, rot=(90, 0, 0), seg=16)   # cadran
    b.part('cyl', (1.4, 1.4, 0.22), (0, -0.53, 3.6), '#ffd700', r, rot=(90, 0, 0), seg=16)
    b.part('cyl', (0.9, 0.9, 0.24), (0, -0.54, 3.6), '#1f3c9c', r, rot=(90, 0, 0), seg=16)
    for i in range(12):
        a = i / 12 * 2 * math.pi
        b.part('box', (0.08, 0.1, 0.18), (0.82 * math.cos(a), -0.6, 3.6 + 0.82 * math.sin(a)), '#ffffff', r)
    hand = b.piv('hand', (0, -0.62, 3.6), r)
    b.part('box', (0.06, 0.06, 0.8), (0, 0, 0.35), '#ffffff', hand)
    for i, (nm, col) in enumerate((('lampR', '#e0303a'), ('lampG', '#3ad65a'), ('lampB', '#3a6be0'))):
        x = -1.0 + i * 1.0
        b.part('box', (0.7, 0.3, 0.7), (x, -0.45, 1.3), '#3a2a40', r)
        lamp = b.part('sph', (0.5, 0.3, 0.5), (x, -0.62, 1.3), col, r, seg=8)
        lamp.name = nm
    for x in (-1.3, 1.3):  # petits automates
        b.part('rbox', (0.3, 0.3, 0.7), (x, -0.55, 5.2), '#e8b33a', r)
        b.part('sph', (0.3, 0.3, 0.3), (x, -0.55, 5.7), '#f2c19b', r, seg=6)
    paths.append(export(sc, "clock"))

    sc, b = new_scene("S3K_3D_door")
    r = b.piv('root')
    b.part('rbox', (3.0, 0.4, 3.4), (0, 0, 1.7), '#6b3f22', r)
    for z in (0.7, 1.7, 2.7):
        b.part('box', (3.04, 0.44, 0.14), (0, 0, z), '#3a3a50', r)
    b.part('box', (0.06, 0.45, 3.4), (0, 0, 1.7), '#3a2010', r)
    b.part('cyl', (0.5, 0.5, 0.12), (0.5, -0.24, 1.6), '#ffd700', r, rot=(90, 0, 0), seg=8)  # serrure
    b.part('box', (0.12, 0.14, 0.24), (0.5, -0.31, 1.55), '#1a1010', r)
    paths.append(export(sc, "door"))
    return paths


done = [m_hero(), m_lutin(), m_coq()] + m_props()
# embarque tout en base64 dans models.js
with open(os.path.join(OUT3D, "models.js"), "w") as fh:
    fh.write("// genere par tools/build3d.py (Blender) - modeles glTF binaires en base64\nwindow.S3K_MODELS = {\n")
    for p in done:
        with open(p, "rb") as f:
            fh.write('  "%s": "%s",\n' % (os.path.splitext(os.path.basename(p))[0], base64.b64encode(f.read()).decode()))
    fh.write("};\n")
result = {"models": [os.path.basename(p) for p in done], "sizes": [os.path.getsize(p) for p in done]}
