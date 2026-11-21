# Decor de la place Kleber (2026, pendant le marche de Noel). Executer dans Blender :
#   exec(open(r"C:\Users\mbarbe\Desktop\Stras3000\tools\build_background.py").read())
import importlib, sys, random
sys.path.insert(0, r"C:\Users\mbarbe\Desktop\Stras3000\tools")
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

random.seed(3000)
W, H = 1536, 216
LEN = W / PPU  # 64 unites
sc = setup_scene("S3K_Kleber", W, H)
b = B(sc)

# ------------------------------------------------------------------ camera
cd = bpy.data.cameras.new("kleber_cam")
cd.type = 'ORTHO'
cd.ortho_scale = LEN
cd.clip_end = 400
cam = bpy.data.objects.new("kleber_cam", cd)
sc.collection.objects.link(cam)
t = math.radians(TILT)
cam.rotation_euler = (math.radians(90 - TILT), 0, 0)
up = Vector((0, math.sin(t), math.cos(t)))
fwd = Vector((0, math.cos(t), -math.sin(t)))
GROUND_FRONT = 208  # ligne d'ecran du sol a y=0
PX_DEPTH = PPU * math.sin(t)
y_bottom = -(H - GROUND_FRONT) / PX_DEPTH
center = Vector((LEN / 2, y_bottom, 0)) + up * (H / 2 / PPU)
cam.location = center - fwd * 80
sc.camera = cam

LIT = '#ffcf6b'
DARKWIN = '#2b3350'


def win(x, y, z, w=0.55, h=0.8, parent=None, lit=None, shutters=None):
    lit = random.random() < 0.55 if lit is None else lit
    b.part('box', (w + 0.1, 0.06, h + 0.1), (x, y - 0.03, z), '#efe6d2', parent)
    b.part('box', (w, 0.08, h), (x, y - 0.06, z), LIT if lit else DARKWIN, parent)
    b.part('box', (0.05, 0.1, h), (x, y - 0.08, z), '#3a2a20', parent)
    if shutters:
        for sx in (-1, 1):
            b.part('box', (w * 0.45, 0.07, h), (x + sx * (w * 0.75), y - 0.05, z), shutters, parent)


# ------------------------------------------------------------------ sol (paves)
bm = bmesh.new()
stone = ['#5c6580', '#66708a', '#58607a', '#6c7690']
mats = [M(c) for c in stone]
faces_mat = []
y = -2.0
row = 0
while y < 24:
    dy = 1.0
    x = -2.0 - (row % 2) * 0.75
    while x < LEN + 2:
        dx = 1.5
        vs = [bm.verts.new((x + 0.04, y + 0.06, 0)), bm.verts.new((x + dx - 0.04, y + 0.06, 0)),
              bm.verts.new((x + dx - 0.04, y + dy - 0.06, 0)), bm.verts.new((x + 0.04, y + dy - 0.06, 0))]
        bm.faces.new(vs)
        faces_mat.append(random.randrange(len(stone)))
        x += dx
    y += dy
    row += 1
me = bpy.data.meshes.new("paves")
bm.to_mesh(me)
bm.free()
for m in mats:
    me.materials.append(m)
for i, p in enumerate(me.polygons):
    p.material_index = faces_mat[i]
g = bpy.data.objects.new("paves", me)
sc.collection.objects.link(g)
b.part('box', (LEN + 6, 28, 0.2), (LEN / 2, 10, -0.11), '#2a2d3d')  # joints

# rails du tram
for yy in (4.6, 5.6, 7.4, 8.4):
    b.part('box', (LEN + 4, 0.14, 0.05), (LEN / 2, yy, 0.02), '#a9b2c2')
# neige
for i in range(40):
    b.part('box', (random.uniform(0.6, 2.2), random.uniform(0.6, 1.5), 0.04),
           (random.uniform(0, LEN), random.uniform(9.5, 17), 0.02), '#e8eef8')

# ------------------------------------------------------------------ batiments du fond (y=18)
BY = 18.0


def aubette(x0, x1):
    w = x1 - x0
    cx = (x0 + x1) / 2
    hgt = 3.6
    b.part('box', (w, 1.5, hgt), (cx, BY + 0.75, hgt / 2), '#d9c9a0')
    b.part('box', (w + 0.2, 1.7, 0.25), (cx, BY + 0.75, hgt), '#efe2bd')              # corniche
    b.part('box', (w + 0.1, 1.6, 0.18), (cx, BY + 0.75, 1.45), '#c7b58a')             # bandeau
    b.part('box', (w - 0.4, 1.1, 1.3), (cx, BY + 1.0, hgt + 0.6), '#56607a')          # toit mansarde
    n = int(w / 1.4)
    for i in range(n):
        x = x0 + (i + 0.5) * w / n
        b.part('box', (0.22, 0.1, hgt - 0.2), (x - w / n / 2 + 0.05, BY - 0.04, hgt / 2), '#e8dab4')  # pilastres
        b.part('box', (0.75, 0.08, 1.05), (x, BY - 0.05, 0.6), LIT if i % 3 else '#ffe9a8')       # arcades vitrines
        b.part('box', (0.85, 0.06, 0.12), (x, BY - 0.07, 1.18), '#b5a27a')
        win(x, BY, 2.35, 0.55, 1.05)
        b.part('box', (0.75, 0.1, 0.12), (x, BY - 0.07, 2.98), '#efe2bd')                    # fronton
        b.part('box', (0.45, 0.4, 0.45), (x, BY + 0.4, hgt + 0.55), '#e2d6b6')               # lucarne
        b.part('box', (0.28, 0.42, 0.3), (x, BY + 0.38, hgt + 0.55), LIT if random.random() < .4 else DARKWIN)


def colombage(x0, wdt, wall, roof='#8c3a24', shutters='#2f6b3a', floors=3):
    cx = x0 + wdt / 2
    fh = 1.05
    hgt = floors * fh + 0.2
    b.part('box', (wdt, 1.6, 1.1), (cx, BY + 0.8, 0.55), '#a9a090')                   # rez-de-chaussee pierre
    b.part('box', (wdt + 0.2, 1.7, hgt - 1.1), (cx, BY + 0.75, 1.1 + (hgt - 1.1) / 2), wall)  # encorbellement
    b.part('gable', (wdt + 0.5, 1.9, 2.4), (cx, BY + 0.75, hgt + 1.2), roof)
    beam = '#5a3418'
    for f in range(1, floors):
        z = 1.1 + (f - 1) * fh
        b.part('box', (wdt + 0.22, 0.08, 0.1), (cx, BY - 0.07, z), beam)
        b.part('box', (wdt + 0.22, 0.08, 0.1), (cx, BY - 0.07, z + fh - 0.05), beam)
        for k in range(4):
            xx = x0 + 0.1 + k * (wdt - 0.2) / 3
            b.part('box', (0.1, 0.08, fh), (xx, BY - 0.07, z + fh / 2), beam)
        for k in range(3):
            xa = x0 + 0.1 + (k + 0.5) * (wdt - 0.2) / 3
            if k == 1:
                b.part('box', (0.08, 0.08, 1.25), (xa - 0.35, BY - 0.07, z + fh / 2), beam, rot=(0, 38, 0))
                b.part('box', (0.08, 0.08, 1.25), (xa + 0.35, BY - 0.07, z + fh / 2), beam, rot=(0, -38, 0))
            else:
                win(xa, BY, z + fh / 2, 0.45, 0.6, shutters=shutters)
    b.part('box', (1.0, 0.1, 0.85), (x0 + wdt * 0.3, BY - 0.04, 0.45), '#3a2a20')          # porte
    b.part('box', (1.3, 0.08, 0.7), (x0 + wdt * 0.72, BY - 0.05, 0.55), LIT)               # vitrine
    # pignon : poutres et petite fenetre
    zt = hgt + 0.4
    win(cx, BY - 0.15, zt, 0.4, 0.45, lit=True)
    b.part('box', (wdt * 0.8, 0.08, 0.08), (cx, BY - 0.2, hgt + 0.05), beam)


def galeries(x0, x1):
    w = x1 - x0
    cx = (x0 + x1) / 2
    hgt = 3.9
    b.part('box', (w, 1.5, hgt), (cx, BY + 0.75, hgt / 2), '#b9a58a')
    b.part('box', (w + 0.2, 1.7, 0.2), (cx, BY + 0.75, hgt + 0.1), '#d8c6a6')
    b.part('box', (w - 0.4, 0.08, 1.0), (cx, BY - 0.04, 0.65), LIT)                        # grandes vitrines
    for i in range(int(w / 1.6)):
        x = x0 + 0.8 + i * 1.6
        b.part('box', (0.12, 0.1, 1.1), (x, BY - 0.07, 0.65), '#3a3040')
        for z in (1.8, 2.75, 3.5):
            win(x + 0.4, BY, z, 0.8, 0.6)
    b.part('box', (w - 1, 0.08, 0.25), (cx, BY - 0.08, 1.3), '#8c1c2c')                    # bandeau rouge


def palais_2077(x0, x1):
    w = x1 - x0
    cx = (x0 + x1) / 2
    hgt = 3.8
    b.part('box', (w, 1.5, hgt), (cx, BY + 0.75, hgt / 2), '#7d7f96')
    b.part('box', (w + 0.3, 1.8, 0.3), (cx, BY + 0.75, hgt + 0.1), '#9a9cb5')
    for i in range(int(w / 1.3)):
        x = x0 + 0.65 + i * 1.3
        b.part('box', (0.3, 0.12, hgt), (x - 0.65, BY - 0.06, hgt / 2), '#9a9cb5')
        win(x, BY, 0.75, 0.6, 1.0, lit=True)
    # ecran holographique (texte dessine par le jeu)
    b.part('box', (w - 1.6, 0.15, 1.9), (cx, BY - 0.25, 2.55), '#38f2ff')
    b.part('box', (w - 1.8, 0.2, 1.7), (cx, BY - 0.3, 2.55), '#101830')


aubette(-1, 14)
colombage(14.0, 5.2, '#f1e3c8')
colombage(19.4, 5.0, '#e8b8a0', roof='#7a3020', shutters='#8c1c2c')
galeries(24.6, 41.5)
colombage(41.6, 5.0, '#d6e0b8', roof='#6e3a24', shutters='#2f4f8c')
colombage(46.8, 5.4, '#a8c4d8', shutters='#2f6b3a')
palais_2077(52.4, 66)

# ------------------------------------------------------------------ sapin geant
TX, TY = 33.0, 15.5
b.part('cyl', (0.6, 0.6, 1.0), (TX, TY, 0.5), '#4a2e1a', seg=8)
levels = [(5.0, 0.6, 1.9), (4.3, 1.55, 1.7), (3.6, 2.4, 1.5), (2.8, 3.2, 1.3), (1.9, 3.95, 1.1), (1.1, 4.6, 0.9)]
for i, (r, z, h) in enumerate(levels):
    b.part('cone', (r, r, h), (TX, TY, z + h / 2), '#1d5a36' if i % 2 == 0 else '#24683f', seg=12)
    n = int(r * 3)
    for k in range(n):
        a = math.radians(200 + k * 140 / max(1, n - 1))
        rr = r * 0.42
        col = ['#e63946', '#ffc300', '#4ea8ff', '#f7f7f7'][(k + i) % 4]
        b.part('sph', (0.22, 0.22, 0.22), (TX + math.cos(a) * rr, TY + math.sin(a) * rr, z + 0.25), col, seg=6)
    for k in range(n * 2):  # guirlande
        a = math.radians(190 + k * 160 / max(1, n * 2 - 1))
        rr = r * 0.36
        b.part('box', (0.09, 0.09, 0.09), (TX + math.cos(a) * rr, TY + math.sin(a) * rr, z + h * 0.55 + 0.2 * math.sin(k)), '#fff3a0')
b.part('box', (0.5, 0.2, 0.5), (TX, TY - 0.2, 5.65), '#ffd23f', rot=(0, 45, 0))
for k, col in enumerate(['#d62828', '#2f6bd6', '#ffc300', '#2e9e44', '#d62828']):  # cadeaux
    x = TX - 1.8 + k * 0.9
    s = 0.5 + 0.15 * (k % 2)
    b.part('box', (s, s, s), (x, TY - 2.0, s / 2), col)
    b.part('box', (s + 0.02, 0.1, s + 0.02), (x, TY - 2.0, s / 2), '#ffffff')
for k in range(9):  # barriere
    a = math.radians(200 + k * 17.5)
    b.part('box', (0.12, 0.12, 0.5), (TX + math.cos(a) * 3.0, TY + math.sin(a) * 3.0, 0.25), '#e8e8e8')
b.part('box', (6.2, 0.08, 0.1), (TX, TY - 2.75, 0.42), '#d62828')

# ------------------------------------------------------------------ statue de Kleber
SX, SY = 20.5, 14.0
b.part('box', (2.0, 2.0, 0.35), (SX, SY, 0.17), '#9d9584')
b.part('box', (1.4, 1.4, 1.7), (SX, SY, 1.2), '#b8b0a0')
b.part('box', (1.7, 1.7, 0.22), (SX, SY, 2.1), '#cfc7b6')
b.part('box', (0.7, 0.06, 0.4), (SX, SY - 0.72, 1.2), '#7a6a3a')  # plaque
bronze = '#5f8f74'
P = dict(thigh=0.42, shin=0.38, leg_t=0.2, hip_w=0.11, foot_l=0.3, torso_h=0.62, tw_x=0.42, tw_y=0.38,
         head=0.34, upper=0.32, fore=0.28, arm_t=0.15,
         pants=bronze, boots=dk(bronze, 0.85), shirt=bronze, skin=bronze, hand=bronze, eye=dk(bronze, 0.6))
JS = humanoid(b, P)
JS['root'].location = (SX, SY, 2.21)
JS['root'].rotation_euler = (0, 0, math.radians(-20))
JS['root'].scale = (1.1, 1.1, 1.1)
JS['pelvis'].location = (0, 0, JS['_hip_h'])
JS['shN'].rotation_euler = (0, math.radians(-75), 0)
JS['hipN'].rotation_euler = (0, math.radians(-15), 0)
JS['kneeN'].rotation_euler = (0, math.radians(20), 0)
b.part('box', (0.12, 0.5, 0.7), (-0.25, 0, 0.3), dk(bronze, 0.9), JS['torso'])       # cape
b.part('cyl', (0.4, 0.4, 0.12), (0, 0, 0.36), dk(bronze, 0.8), JS['head'], seg=8)    # bicorne
b.part('box', (0.8, 0.12, 0.25), (0, 0, 0.42), dk(bronze, 0.8), JS['head'])
b.part('box', (0.05, 0.05, 0.7), (0, 0, -0.55), '#8fb3a0', JS['elF'])                # epee

# ------------------------------------------------------------------ chalets du marche (y=12)
CY = 12.0
signs = []


def chalet(cx, wood='#7b4a26', w=3.8):
    d = 2.0
    b.part('box', (w, d, 1.8), (cx, CY + d / 2, 0.9), wood)
    for k in range(5):
        b.part('box', (0.08, 0.06, 0.8), (cx - w / 2 + 0.2 + k * (w - 0.4) / 4, CY - 0.03, 0.4), dk(wood, 0.75))
    b.part('box', (w - 0.6, 0.08, 0.8), (cx, CY - 0.02, 1.25), '#2a1810')
    b.part('box', (w - 0.8, 0.1, 0.65), (cx, CY + 0.05, 1.22), '#ffcf6b')     # interieur eclaire
    b.part('box', (w - 0.3, 0.5, 0.08), (cx, CY - 0.2, 0.86), dk(wood, 0.85))  # comptoir
    for k in range(int(w * 2)):
        col = random.choice(['#d62828', '#ffc300', '#a0581c', '#2e9e44', '#f7f7f7', '#7a1f3d'])
        b.part('box', (0.2, 0.2, 0.18), (cx - w / 2 + 0.45 + k * (w - 0.9) / (w * 2 - 1), CY - 0.25, 0.99), col)
    b.part('prism', (w + 0.6, d + 0.9, 1.0), (cx, CY + d / 2 - 0.1, 2.3), '#3a2a22')
    b.part('prism', (w + 0.5, d + 0.5, 0.45), (cx, CY + d / 2 - 0.1, 2.68), '#eef3fb')  # neige
    b.part('box', (w * 0.7, 0.08, 0.38), (cx, CY - 0.38, 2.02), '#e9d8a6')               # enseigne
    signs.append(project_px(sc, cam, (cx, CY - 0.42, 2.02)))
    n = int(w * 3)
    for k in range(n):
        x = cx - (w + 0.5) / 2 + k * (w + 0.5) / (n - 1)
        col = ['#ff4d4d', '#ffd23f', '#4ea8ff', '#5cff7a'][k % 4]
        b.part('sph', (0.13, 0.13, 0.13), (x, CY - 0.45, 1.85 - 0.08 * math.sin(k / (n - 1) * math.pi)), col, seg=4)


for cx in (2.5, 7.0, 11.5, 26.5, 39.5, 44.0, 48.5, 60.0):
    chalet(cx, wood=random.choice(['#7b4a26', '#6b3f22', '#86552c']))

# lampadaires
for x in (16.5, 30.0, 37.5, 55.0):
    b.part('cyl', (0.14, 0.14, 3.2), (x, 11.0, 1.6), '#1d1f2a', seg=6)
    b.part('box', (0.42, 0.42, 0.5), (x, 11.0, 3.3), '#ffe9a8')
    b.part('cone', (0.6, 0.6, 0.3), (x, 11.0, 3.7), '#1d1f2a', seg=4)

# ------------------------------------------------------------------ rendu
path = os.path.join(OUT, "kleber.png")
render_to(sc, path)
img = bpy.data.images.load(path, check_existing=False)
a = np.empty(W * H * 4, dtype=np.float32)
img.pixels.foreach_get(a)
bpy.data.images.remove(img)
a = a.reshape(H, W, 4)
grade(a, sat=1.25, gain=1.1)
a[:, :, 3] = np.where(a[:, :, 3] > 0.5, 1.0, 0.0)
im = bpy.data.images.new("kleber_out", W, H, alpha=True)
im.pixels.foreach_set(a.ravel())
im.filepath_raw = path
im.file_format = 'PNG'
im.save()
bpy.data.images.remove(im)

holo = [project_px(sc, cam, (54.0, BY - 0.35, 3.45)), project_px(sc, cam, (64.4, BY - 0.35, 1.65))]
write_meta('kleber', {"img": "kleber.png", "w": W, "h": H, "groundFront": GROUND_FRONT,
                      "pxDepth": round(PX_DEPTH, 3), "signs": signs, "holo": holo,
                      "statue": project_px(sc, cam, (SX, SY - 0.75, 1.2)), "tree": project_px(sc, cam, (TX, TY, 0))})
result = {"ok": True, "signs": signs, "holo": holo}
