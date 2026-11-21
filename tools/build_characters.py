# Genere les planches de sprites des personnages. Executer dans Blender :
#   exec(open(r"C:\Users\mbarbe\Desktop\Stras3000\tools\build_characters.py").read())
import importlib, sys
sys.path.insert(0, r"C:\Users\mbarbe\Desktop\Stras3000\tools")
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

ONLY = globals().get('S3K_ONLY')  # ex: ['hero'] pour ne regenerer qu'un perso

# ---------------------------------------------------------------- poses communes
WALK = [
    dict(hipN=28, kneeN=-8, hipF=-26, kneeF=-35, shN=-18, shF=22, elN=40, elF=40),
    dict(hipN=2, kneeN=-6, hipF=6, kneeF=-50, shN=0, shF=0, elN=40, elF=40, z=0.03),
    dict(hipN=-26, kneeN=-35, hipF=28, kneeF=-8, shN=22, shF=-18, elN=40, elF=40),
    dict(hipN=6, kneeN=-50, hipF=2, kneeF=-6, shN=0, shF=0, elN=40, elF=40, z=0.03),
]
HURT = [dict(torso=-22, head=-18, shN=-35, elN=30, shF=-20, elF=40, hipN=10, kneeN=-15, hipF=-15, kneeF=-10, x=-0.08)]


def down(rx, rz=0.12):
    return [dict(fall=88, rx=rx, rz=rz, shN=160, shF=150, elN=10, elF=20, hipN=15, hipF=-10, kneeN=-20, kneeF=-30, head=10)]


META = {}

# =============================================================== HEROS : Marcel Bretzel (venu de 2077)
def build_hero(b):
    P = dict(thigh=0.42, shin=0.38, leg_t=0.2, hip_w=0.11, foot_l=0.32, torso_h=0.62, tw_x=0.42, tw_y=0.36,
             head=0.36, upper=0.32, fore=0.28, arm_t=0.15,
             pants='#2b3a8c', boots='#e8e8f0', shirt='#e8562a', sleeve='#e8562a', fore_col='#f2f2f2',
             skin='#f1b98c', hand='#3b3b4f', eye='#11121a', shin_col='#2b3a8c')
    J = humanoid(b, P)
    t, h = J['torso'], J['head']
    b.part('box', (0.06, 0.2, 0.16), (0.21, 0, 0.42), '#38f2ff', t)          # coeur temporel lumineux
    b.part('box', (0.44, 0.38, 0.07), (0, 0, 0.04), '#ffd23f', t)            # ceinture
    b.part('box', (0.46, 0.4, 0.1), (0, 0, 0.6), '#c23a14', t)               # col
    b.part('box', (0.44, 0.06, 0.05), (0, -0.19, 0.25), '#38f2ff', t)        # bande neon
    b.pretzel((-0.27, 0, 0.36), 0.62, '#a0581c', t, rot=(0, 0, 0), bead=0.1)  # bretzel dans le dos
    b.part('box', (0.07, 0.34, 0.08), (0.17, 0, 0.21), '#38f2ff', h)          # visiere
    for i, (x, y, a) in enumerate([(-0.05, 0, -35), (0.05, -0.08, 15), (-0.12, 0.06, -60), (0.1, 0.08, 30), (-0.02, -0.12, -10)]):
        b.part('cone', (0.16, 0.16, 0.24), (x, y, 0.4), '#ffd23f', h, rot=(0, a, 0), seg=4)
    b.part('box', (0.14, 0.16, 0.08), (0, 0, -0.2), '#38f2ff', J['elN'])     # montre temporelle
    for k in ('kneeN', 'kneeF'):
        b.part('box', (0.22, 0.24, 0.05), (0, 0, -0.03), '#38f2ff' if k == 'kneeN' else dk('#38f2ff'), J[k])
    return J


GUARD = dict(shN=35, elN=105, shF=50, elF=95, hipN=12, kneeN=-12, hipF=-12, kneeF=-6, torso=6)
HERO_ANIMS = [
    ('idle', [dict(), dict(z=-0.03, shN=32, shF=47)]),
    ('walk', [dict(w, shN=w['shN'] + 30, elN=95, shF=w['shF'] + 40, elF=90) for w in WALK]),
    ('punch1', [dict(shN=15, elN=120, torso=-4), dict(shN=88, elN=2, torso=12, hipN=18, hipF=-20)]),
    ('punch2', [dict(shF=20, elF=120, torso=-6), dict(shF=88, elF=2, shN=20, elN=110, torso=16, hipN=20, hipF=-22)]),
    ('kick', [dict(hipN=55, kneeN=-80, torso=-10), dict(hipN=95, kneeN=0, torso=-18, hipF=-8, kneeF=-12, shN=-20, elN=60, shF=60, elF=80)]),
    ('jump', [dict(hipN=70, kneeN=-100, hipF=40, kneeF=-90, shN=140, elN=30, shF=120, elF=40)]),
    ('jumpkick', [dict(hipN=80, kneeN=0, hipF=20, kneeF=-100, torso=-12, shN=-30, elN=40, shF=40, elF=90)]),
    ('hurt', HURT),
    ('down', down(0.95)),
    ('special', [dict(yaw=a, shN=90, elN=0, shF=-90, elF=0, hipN=10, hipF=-10, z=0.06, torso=0) for a in (0, 90, 180, 270)]),
    ('win', [dict(shN=175, elN=0, shF=40, elF=100, head=-10)]),
]

# =============================================================== LUTIN DU MARCHE
def build_lutin(b):
    P = dict(thigh=0.24, shin=0.2, leg_t=0.15, hip_w=0.08, foot_l=0.28, torso_h=0.38, tw_x=0.34, tw_y=0.3,
             head=0.42, upper=0.2, fore=0.18, arm_t=0.11, head_x=1.0,
             pants='#c9302c', boots='#5a3418', shirt='#2e9e44', skin='#f2c19b', eye='#1b0f0f', eye_h=0.05)
    J = humanoid(b, P)
    t, h = J['torso'], J['head']
    b.part('box', (0.36, 0.32, 0.06), (0, 0, 0.06), '#1a1a1a', t)
    b.part('box', (0.06, 0.08, 0.06), (0.18, 0, 0.06), '#ffd23f', t)
    b.part('box', (0.38, 0.34, 0.08), (0, 0, 0.37), '#ffffff', t)  # col blanc
    hat = b.piv('hat', (-0.02, 0, 0.36), h)
    hat.rotation_euler = (0, math.radians(-35), 0)
    b.part('cone', (0.44, 0.44, 0.62), (0, 0, 0.26), '#d62828', hat, seg=8)
    b.part('cyl', (0.46, 0.46, 0.09), (0, 0, -0.03), '#ffffff', hat, seg=10)
    b.part('sph', (0.13, 0.13, 0.13), (0, 0, 0.6), '#ffffff', hat, seg=6)
    for yy, r in ((-0.21, 60), (0.21, -60)):
        b.part('cone', (0.1, 0.1, 0.24), (-0.02, yy, 0.22), '#f2c19b', h, rot=(r, 0, 0), seg=4)
    b.part('box', (0.04, 0.2, 0.03), (0.21, 0, 0.27), '#7a1a1a', h, rot=(0, 0, 0))  # sourcils mechants
    b.part('box', (0.04, 0.14, 0.03), (0.22, 0, 0.1), '#7a1a1a', h)               # sourire
    # sucre d'orge (arme) dans la main proche
    cane = b.piv('cane', (0.0, -0.02, -0.26), J['elN'])
    cane.rotation_euler = (0, math.radians(-90), 0)
    for i in range(6):
        b.part('cyl', (0.07, 0.07, 0.08), (0, 0, 0.04 + i * 0.08), '#ffffff' if i % 2 else '#e63946', cane, seg=6)
    for i in range(4):
        a = math.radians(i * 50)
        b.part('cyl', (0.07, 0.07, 0.08), (0.1 - 0.1 * math.cos(a), 0, 0.5 + 0.1 * math.sin(a)), '#e63946' if i % 2 else '#ffffff', cane, rot=(0, -i * 50, 0), seg=6)
    return J


LUTIN_BASE = dict(shN=20, elN=60, shF=10, elF=30)
LUTIN_ANIMS = [
    ('idle', [dict(), dict(z=-0.03, head=6)]),
    ('walk', [dict(w, elN=60, shN=w['shN'] + 20) for w in WALK]),
    ('attack', [dict(shN=-30, elN=110, torso=-8), dict(shN=95, elN=0, torso=18, hipN=20, hipF=-20)]),
    ('hurt', HURT),
    ('down', down(0.6, 0.1)),
]

# =============================================================== VENDEUR DE VIN CHAUD ZOMBIFIE
def build_zombie(b):
    P = dict(thigh=0.42, shin=0.38, leg_t=0.21, hip_w=0.12, foot_l=0.3, torso_h=0.64, tw_x=0.48, tw_y=0.4,
             head=0.36, upper=0.32, fore=0.3, arm_t=0.15, head_z=1.15,
             pants='#4a4038', boots='#2a2420', shirt='#d9cba3', sleeve='#d9cba3', fore_col='#9bbf86',
             skin='#9bbf86', eye='#fffbe0', eye_h=0.06)
    J = humanoid(b, P)
    t, h = J['torso'], J['head']
    b.part('box', (0.06, 0.38, 0.62), (0.25, 0, 0.18), '#7a1f3d', t)          # tablier bordeaux
    b.part('box', (0.07, 0.2, 0.12), (0.29, 0, 0.12), '#5c142c', t)           # poche
    b.part('box', (0.5, 0.42, 0.05), (0, 0, 0.42), '#7a1f3d', t)              # lanieres
    b.part('cyl', (0.38, 0.38, 0.14), (0, 0, 0.38), '#b0263f', h, seg=10)     # bonnet
    b.part('sph', (0.13, 0.13, 0.13), (0, 0, 0.5), '#f2e6c0', h, seg=6)
    b.part('box', (0.04, 0.14, 0.06), (0.19, 0, 0.07), '#2a1418', h)          # bouche beante
    b.part('box', (0.05, 0.05, 0.12), (0.12, -0.13, 0.3), '#6f8f5a', h)       # bosse
    mug = b.piv('mug', (0.05, 0, -0.36), J['elN'])
    b.part('cyl', (0.16, 0.16, 0.18), (0, 0, 0), '#b0263f', mug, seg=8)
    b.part('cyl', (0.13, 0.13, 0.02), (0, 0, 0.09), '#4b0f1f', mug, seg=8)
    b.part('box', (0.03, 0.04, 0.1), (-0.1, 0, 0), '#b0263f', mug)
    return J


ZOMBIE_BASE = dict(torso=22, head=-12, shN=75, elN=10, shF=85, elF=5)
ZOMBIE_ANIMS = [
    ('idle', [dict(), dict(z=-0.03, head=-4, shF=80)]),
    ('walk', [dict(w, shN=75 + w['shN'] * 0.3, shF=85 + w['shF'] * 0.3, elN=10, elF=5) for w in WALK]),
    ('attack', [dict(shN=-60, elN=60, torso=10), dict(shN=120, elN=0, torso=30)]),
    ('hurt', [dict(HURT[0], shN=40, shF=30)]),
    ('down', down(0.95)),
]

# =============================================================== CIGOGNE CYBORG
def build_stork(b):
    J = {}
    root = b.piv('root')
    hip_h = 0.95
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    J.update(root=root, pelvis=pel, _hip_h=hip_h)
    for side, yy, far in (('N', -0.1, False), ('F', 0.1, True)):
        c = (lambda x: dk(x)) if far else (lambda x: x)
        hp = b.piv('hip' + side, (0, yy, 0), pel)
        b.part('cyl', (0.06, 0.06, 0.45), (0, 0, -0.22), c('#e2551e'), hp, seg=6)
        k = b.piv('knee' + side, (0, 0, -0.45), hp)
        b.part('cyl', (0.08, 0.08, 0.06), (0, 0, 0), c('#9aa3b0'), k, seg=6)  # genou metal
        b.part('cyl', (0.06, 0.06, 0.42), (0, 0, -0.21), c('#e2551e'), k, seg=6)
        b.part('box', (0.3, 0.12, 0.05), (0.08, 0, -0.44), c('#e2551e'), k)
        J['hip' + side], J['knee' + side] = hp, k
    tor = b.piv('torso', (0, 0, 0.05), pel)
    b.part('sph', (0.95, 0.5, 0.5), (-0.05, 0, 0.22), '#f4f4f0', tor, seg=12)
    b.part('box', (0.35, 0.3, 0.08), (-0.58, 0, 0.28), '#1a1a1a', tor, rot=(0, -20, 0))  # queue
    b.part('box', (0.3, 0.3, 0.18), (-0.05, 0, 0.0), '#9aa3b0', tor)                    # plaque cyborg
    for side, yy, far in (('N', -0.26, False), ('F', 0.26, True)):
        w = b.piv('sh' + side, (0.2, yy, 0.32), tor)
        b.part('box', (0.7, 0.06, 0.32), (-0.3, 0, -0.02), dk('#f4f4f0', 0.85 if not far else 0.6), w, rot=(0, -10, 0))
        b.part('box', (0.36, 0.07, 0.24), (-0.62, 0, -0.06), '#1a1a1a', w, rot=(0, -10, 0))
        J['sh' + side] = w
        J['el' + side] = b.piv('el' + side, (0, 0, 0), w)
    nk = b.piv('head', (0.38, 0, 0.36), tor)
    b.part('cyl', (0.13, 0.13, 0.55), (0.08, 0, 0.25), '#f4f4f0', nk, rot=(0, 18, 0), seg=8)
    b.part('sph', (0.26, 0.24, 0.24), (0.16, 0, 0.55), '#f4f4f0', nk, seg=8)
    b.part('cone', (0.12, 0.1, 0.62), (0.52, 0, 0.5), '#ff8c1a', nk, rot=(0, 95, 0), seg=6)
    b.part('box', (0.06, 0.08, 0.06), (0.26, -0.11, 0.6), '#ff1a3c', nk)   # oeil laser
    b.part('box', (0.06, 0.08, 0.06), (0.26, 0.11, 0.6), '#ff1a3c', nk)
    b.part('box', (0.12, 0.26, 0.05), (0.18, 0, 0.66), '#9aa3b0', nk)      # casque metal
    b.part('cyl', (0.02, 0.02, 0.22), (0.12, 0, 0.78), '#9aa3b0', nk, seg=4)  # antenne
    b.part('sph', (0.06, 0.06, 0.06), (0.12, 0, 0.9), '#ff1a3c', nk, seg=4)
    J.update(torso=tor, head=nk)
    return J


STORK_WALK = [dict(w, shN=0, shF=0, elN=0, elF=0, kneeN=-w['kneeN'], kneeF=-w['kneeF'], head=6 if i % 2 else -4) for i, w in enumerate(WALK)]
STORK_ANIMS = [
    ('idle', [dict(), dict(head=8, z=-0.02)]),
    ('walk', STORK_WALK),
    ('attack', [dict(head=-35, torso=-8, shN=-20, shF=-20), dict(head=70, torso=20, shN=30, shF=30)]),
    ('hurt', [dict(head=-40, torso=-15, shN=60, shF=50, x=-0.08)]),
    ('down', [dict(z=-0.72, hipN=95, kneeN=-160, hipF=85, kneeF=-160, head=75, torso=8, shN=-40, shF=-50)]),
]

# =============================================================== MINI-BOSS : LE GRAND KOUGELHOPF
def build_boss(b):
    S = 1.25
    J = {}
    root = b.piv('root')
    hip_h = 0.62 * S
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    J.update(root=root, pelvis=pel, _hip_h=hip_h)
    for side, yy, far in (('N', -0.45 * S, False), ('F', 0.45 * S, True)):
        c = (lambda x: dk(x)) if far else (lambda x: x)
        hp = b.piv('hip' + side, (0, yy, 0), pel)
        b.part('box', (0.34 * S, 0.34 * S, 0.3 * S), (0, 0, -0.15 * S), c('#e9e3d6'), hp)
        k = b.piv('knee' + side, (0, 0, -0.3 * S), hp)
        b.part('box', (0.3 * S, 0.3 * S, 0.22 * S), (0, 0, -0.11 * S), c('#e9e3d6'), k)
        b.part('box', (0.55 * S, 0.4 * S, 0.12 * S), (0.1 * S, 0, -0.26 * S), c('#3a2618'), k)
        J['hip' + side], J['knee' + side] = hp, k
    tor = b.piv('torso', (0, 0, 0), pel)
    tilt = b.piv('tilt', (0, 0, 0), tor)
    J['tilt'] = tilt
    H = 1.75 * S
    b.part('cone', (2.5 * S, 2.5 * S, H), (0, 0, H / 2), '#b8692a', tilt, seg=16, r2=0.62)
    for i in range(16):  # cannelures
        a = (i + 0.5) / 16 * 2 * math.pi
        r = 0.95 * S
        b.part('box', (0.18 * S, 0.12 * S, H * 1.02), (math.cos(a) * r, math.sin(a) * r, H / 2), '#8f4b17', tilt,
               rot=(math.degrees(-math.sin(a) * 0.2), math.degrees(math.cos(a) * 0.2), math.degrees(a)))
    b.part('cyl', (1.62 * S, 1.62 * S, 0.22 * S), (0, 0, H + 0.02), '#f7f3ea', tilt, seg=16)  # sucre glace
    for i in range(10):
        a = i / 10 * 2 * math.pi
        b.part('box', (0.12 * S, 0.12 * S, 0.3 * S), (math.cos(a) * 0.76 * S, math.sin(a) * 0.76 * S, H - 0.1 * S), '#f7f3ea', tilt)
    b.part('cyl', (0.42 * S, 0.42 * S, 0.3 * S), (0, 0, H + 0.04), '#3a1f0d', tilt, seg=10)  # trou central
    for i in range(7):  # raisins secs + amandes
        a = math.radians(-70 + i * 22)
        z = 0.35 * S + (i % 3) * 0.38 * S
        rr = (1.25 - 0.6 * 0.5 * z / H) * S
        b.part('sph', (0.13 * S, 0.13 * S, 0.11 * S), (math.cos(a) * rr * 0.98, math.sin(a) * rr * 0.98, z), '#3d1d33' if i % 2 else '#f0d9a8', tilt, seg=6)
    # visage
    fx = 1.08 * S
    for yy in (-0.32 * S, 0.32 * S):
        b.part('sph', (0.28 * S, 0.26 * S, 0.32 * S), (fx - 0.12 * S, yy, 1.05 * S), '#ffffff', tilt, seg=8)
        b.part('box', (0.06 * S, 0.12 * S, 0.14 * S), (fx + 0.02 * S, yy, 1.02 * S), '#111111', tilt)
        b.part('box', (0.08 * S, 0.34 * S, 0.08 * S), (fx - 0.02 * S, yy, 1.3 * S), '#3a1f0d', tilt, rot=(25 if yy < 0 else -25, 0, 0))
    b.part('box', (0.1 * S, 0.7 * S, 0.22 * S), (fx + 0.04 * S, 0, 0.62 * S), '#5c0f14', tilt)
    for k in range(4):
        b.part('box', (0.06 * S, 0.12 * S, 0.08 * S), (fx + 0.08 * S, (-0.24 + k * 0.16) * S, 0.7 * S), '#ffffff', tilt)
    for side, sgn, far in (('N', -1, False), ('F', 1, True)):
        c = (lambda x: dk(x)) if far else (lambda x: x)
        s = b.piv('sh' + side, (0, sgn * 1.12 * S, 0.95 * S), tilt)
        b.part('box', (0.28 * S, 0.28 * S, 0.55 * S), (0, 0, -0.27 * S), c('#e9e3d6'), s)
        e = b.piv('el' + side, (0, 0, -0.55 * S), s)
        b.part('box', (0.26 * S, 0.26 * S, 0.45 * S), (0, 0, -0.22 * S), c('#e9e3d6'), e)
        b.part('box', (0.46 * S, 0.42 * S, 0.42 * S), (0.04 * S, 0, -0.58 * S), c('#d62828'), e)  # gant de four
        b.part('box', (0.48 * S, 0.44 * S, 0.1 * S), (0.04 * S, 0, -0.38 * S), c('#ffffff'), e)
        J['sh' + side], J['el' + side] = s, e
    J['head'] = b.piv('head', (0, 0, 0), tilt)
    J['torso'] = tor
    return J


BOSS_BASE = dict(shN=25, elN=30, shF=20, elF=30)
BOSS_ANIMS = [
    ('idle', [dict(), dict(z=-0.05, shN=30, shF=25, elN=40)]),
    ('walk', [dict(hipN=25, hipF=-20, kneeN=-10, kneeF=-25, tilt=-5), dict(z=0.05, tilt=0), dict(hipN=-20, hipF=25, kneeN=-25, kneeF=-10, tilt=5), dict(z=0.05)]),
    ('slam', [dict(shN=170, elN=10, shF=170, elF=10, tilt=-12, z=0.05), dict(shN=150, elN=-20, shF=150, elF=-20, tilt=-18, z=0.12),
              dict(shN=70, elN=0, shF=70, elF=0, tilt=22, z=-0.08, hipN=20, kneeN=-30, hipF=-10, kneeF=-20)]),
    ('charge', [dict(tilt=28, shN=-50, elN=20, shF=-60, elF=20, hipN=40, kneeN=-40, hipF=-30), dict(tilt=30, shN=-60, elN=20, shF=-50, elF=20, hipN=-30, hipF=40, kneeF=-40, z=0.06)]),
    ('hurt', [dict(tilt=-18, shN=-40, shF=-30, elN=40, elF=40, x=-0.1)]),
    ('down', [dict(fall=85, rx=1.9, rz=0.35, shN=150, shF=140, hipN=30, hipF=10)]),
]

# =============================================================== LE MAIRE DE 2077 (cinematique)
def build_mayor(b):
    P = dict(thigh=0.42, shin=0.38, leg_t=0.21, hip_w=0.12, foot_l=0.3, torso_h=0.66, tw_x=0.52, tw_y=0.42,
             head=0.4, upper=0.32, fore=0.28, arm_t=0.16,
             pants='#26213a', boots='#111111', shirt='#26213a', skin='#f0c0a0', hand='#ffffff', eye='#111111')
    J = humanoid(b, P)
    t, h = J['torso'], J['head']
    b.part('box', (0.54, 0.44, 0.1), (0, 0, 0.36), '#c1121f', t, rot=(0, 0, 0))
    b.part('box', (0.06, 0.16, 0.4), (0.27, 0, 0.4), '#ffffff', t)    # chemise
    b.part('box', (0.07, 0.06, 0.3), (0.29, 0, 0.42), '#c1121f', t)   # cravate
    b.part('box', (0.06, 0.42, 0.06), (0.27, 0, 0.62), '#ffd23f', t)  # chaine
    b.part('box', (0.07, 0.12, 0.12), (0.28, 0, 0.5), '#ffd23f', t)   # medaille
    hat = b.piv('hat', (0, 0, 0.36), h)
    hat.rotation_euler = (0, math.radians(-25), 0)
    b.part('cone', (0.44, 0.44, 0.55), (0, 0, 0.22), '#c1121f', hat, seg=8)
    b.part('cyl', (0.48, 0.48, 0.1), (0, 0, -0.02), '#ffffff', hat, seg=10)
    b.part('sph', (0.14, 0.14, 0.14), (0, 0, 0.52), '#ffffff', hat, seg=6)
    b.part('box', (0.05, 0.36, 0.06), (0.21, 0, 0.13), '#3a2a20', h)   # moustache
    b.part('box', (0.04, 0.12, 0.12), (0.22, -0.08, 0.22), '#ffd23f', h)  # monocle
    return J


MAYOR_ANIMS = [('evil', [dict(shN=140, elN=60, shF=150, elF=50, head=-8), dict(shN=160, elN=40, shF=165, elF=30, head=-14, z=0.03)])]


# =============================================================== OBJETS (props)
def build_props():
    sc = setup_scene("S3K_Sprites", 32, 32)
    b = B(sc)
    paths = []
    names = []
    cam = sprite_camera(sc, 32, 0.3, yaw=20)

    def shot(name):
        p = os.path.join(TMP, "prop_%s.png" % name)
        render_to(sc, p)
        paths.append(p)
        names.append(name)
        for o in list(sc.collection.all_objects):
            if o.type != 'CAMERA':
                bpy.data.objects.remove(o, do_unlink=True)
    # chope de vin chaud (projectile)
    mug = b.piv('mug', (0, 0, 0.3))
    b.part('cyl', (0.42, 0.42, 0.48), (0, 0, 0), '#b0263f', mug, seg=10)
    b.part('cyl', (0.36, 0.36, 0.04), (0, 0, 0.24), '#4b0f1f', mug, seg=10)
    b.part('box', (0.08, 0.1, 0.28), (-0.26, 0, 0), '#b0263f', mug)
    b.part('box', (0.04, 0.3, 0.1), (0.2, 0, 0.05), '#ffd23f', mug)
    shot('mug')
    # bretzel (soin)
    b.pretzel((0, 0, 0.32), 1.25, '#a0581c', None, rot=(0, 0, 0), bead=0.16)
    shot('bretzel')
    # flammekueche (gros soin)
    b.part('box', (0.95, 0.6, 0.06), (0, 0, 0.05), '#e8c47a', None)
    b.part('box', (0.85, 0.5, 0.04), (0, 0, 0.1), '#fff3d6', None)
    for i in range(8):
        b.part('box', (0.1, 0.1, 0.05), (-0.35 + i * 0.1, (-0.15 if i % 2 else 0.12), 0.13), '#8a3b1d', None)
    for i in range(5):
        b.part('box', (0.08, 0.05, 0.05), (-0.3 + i * 0.15, 0.0, 0.14), '#f5e6a8', None)
    shot('flamme')
    assemble(paths, 32, 32, os.path.join(OUT, "props.png"))
    return {"img": "props.png", "fw": 32, "fh": 32, "anchor": project_px(sc, cam, (0, 0, 0)), "names": names}


def make(name, builder, anims, frame=64, base=None, yaw=20):
    sc = setup_scene("S3K_Sprites", frame, frame)
    b = B(sc)
    J = builder(b)
    return render_character(sc, J, name, frame, anims, base=base, yaw=yaw)


JOBS = [
    ('hero', lambda: make('hero', build_hero, HERO_ANIMS, base=GUARD)),
    ('lutin', lambda: make('lutin', build_lutin, LUTIN_ANIMS, base=LUTIN_BASE)),
    ('zombie', lambda: make('zombie', build_zombie, ZOMBIE_ANIMS, base=ZOMBIE_BASE)),
    ('stork', lambda: make('stork', build_stork, STORK_ANIMS)),
    ('boss', lambda: make('boss', build_boss, BOSS_ANIMS, frame=128, base=BOSS_BASE, yaw=42)),
    ('mayor', lambda: make('mayor', build_mayor, MAYOR_ANIMS)),
    ('props', build_props),
]
done = []
for key, fn in JOBS:
    if ONLY and key not in ONLY:
        continue
    write_meta(key, fn())
    done.append(key)
result = {"done": done}
