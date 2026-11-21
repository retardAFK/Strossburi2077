# Casting "funky annees 80" (v2). Executer dans Blender :
#   S3K_ONLY = ['hero']; exec(open(r"C:\Users\mbarbe\Desktop\Stras3000\tools\build_cast80.py").read())
import importlib, sys
sys.path.insert(0, r"C:\Users\mbarbe\Desktop\Stras3000\tools")
import s3k_lib
importlib.reload(s3k_lib)
from s3k_lib import *

ONLY = globals().get('S3K_ONLY')
SPPU = 28  # les persos sont un peu plus grands que le decor (look beat'em up)

WALK = [
    dict(hipN=28, kneeN=-8, hipF=-26, kneeF=-35, shN=-18, shF=22),
    dict(hipN=2, kneeN=-6, hipF=6, kneeF=-50, shN=0, shF=0, z=0.03),
    dict(hipN=-26, kneeN=-35, hipF=28, kneeF=-8, shN=22, shF=-18),
    dict(hipN=6, kneeN=-50, hipF=2, kneeF=-6, shN=0, shF=0, z=0.03),
]


def limb_side(b, J, P, side, far, pel, tor):
    """Jambe + bras d'un cote. P contient des callbacks optionnels pour habiller."""
    f = (lambda c: dk(c) if not c.startswith('tex:') else c) if far else (lambda c: c)
    yy = P['hip_w'] * (1 if far else -1)
    h = b.piv('hip' + side, (0, yy, 0), pel)
    b.part('rbox', (P['leg_t'], P['leg_t'], P['thigh'] + 0.06), (0, 0, -P['thigh'] / 2), f(P['pants']), h)
    k = b.piv('knee' + side, (0, 0, -P['thigh']), h)
    b.part('rbox', (P['leg_t'] * .92, P['leg_t'] * .92, P['shin'] + 0.04), (0, 0, -P['shin'] / 2), f(P.get('shin_col', P['pants'])), k)
    ft = b.piv('foot' + side, (0, 0, -P['shin']), k)
    J['hip' + side], J['knee' + side], J['foot' + side] = h, k, ft
    s = b.piv('sh' + side, (0, (P['tw_y'] / 2 + P['arm_t'] / 2) * (1 if far else -1), P['torso_h'] - 0.08), tor)
    b.part('rbox', (P['arm_t'], P['arm_t'], P['upper'] + 0.04), (0, 0, -P['upper'] / 2), f(P['sleeve']), s)
    e = b.piv('el' + side, (0, 0, -P['upper']), s)
    b.part('rbox', (P['arm_t'] * .9, P['arm_t'] * .9, P['fore'] + 0.04), (0, 0, -P['fore'] / 2), f(P['fore_col']), e)
    hand = b.piv('hand' + side, (0, 0, -P['fore']), e)
    J['sh' + side], J['el' + side], J['hand' + side] = s, e, hand
    return f


# =============================================================== HEROS : MARCEL BRETZEL
def build_hero(b):
    P = dict(thigh=0.42, shin=0.40, leg_t=0.22, hip_w=0.12, torso_h=0.66, tw_x=0.5, tw_y=0.44,
             upper=0.32, fore=0.3, arm_t=0.17,
             pants='#7a35e0', sleeve='tex:kelsch_red', fore_col='#f5b48a')
    J = {}
    root = b.piv('root')
    hip_h = P['thigh'] + P['shin'] + 0.17
    pel = b.piv('pelvis', (0, 0, hip_h), root)
    J.update(root=root, pelvis=pel, _hip_h=hip_h)
    tor = b.piv('torso', (0, 0, 0), pel)
    J['torso'] = tor
    for side, far in (('N', False), ('F', True)):
        f = limb_side(b, J, P, side, far, pel, tor)
        ft, k, hand, e = J['foot' + side], J['knee' + side], J['hand' + side], J['el' + side]
        # baskets montantes blanches, semelle rose, lacets citron
        b.part('rbox', (0.4, 0.27, 0.2), (0.08, 0, -0.08), f('#f6f6f6'), ft)
        b.part('rbox', (0.42, 0.28, 0.07), (0.08, 0, -0.17), f('#ff2e88'), ft)
        b.part('box', (0.06, 0.2, 0.05), (0.2, 0, -0.03), f('#b6ff3a'), ft)
        b.part('rbox', (0.26, 0.26, 0.12), (0, 0, 0.04), f('#f6f6f6'), ft)
        # bande blanche du survet' sur la jambe
        if not far:
            b.part('box', (0.05, 0.02, P['thigh']), (0, -0.115, -P['thigh'] / 2), '#ffffff', J['hip' + side])
            b.part('box', (0.05, 0.02, P['shin']), (0, -0.105, -P['shin'] / 2), '#ffffff', k)
        # manche retroussee + bracelet eponge + mitaine
        b.part('rbox', (0.2, 0.2, 0.1), (0, 0, -0.02), f('tex:kelsch_red'), e)
        b.part('cyl', (0.18, 0.18, 0.08), (0, 0, -0.24), f('#ff2e88'), e, seg=8)
        b.part('rbox', (0.22, 0.2, 0.22), (0.02, 0, -0.08), f('#1d1b2e'), hand)
        b.part('box', (0.05, 0.21, 0.08), (0.12, 0, -0.04), f('#f5b48a'), hand)  # doigts qui depassent
    # torse : blouson Kelsch a epaulettes geantes, t-shirt turquoise
    th = P['torso_h']
    b.part('rbox', (P['tw_x'], P['tw_y'], th), (0, 0, th / 2), 'tex:kelsch_red', tor)
    b.part('rbox', (0.06, 0.24, th - 0.1), (P['tw_x'] / 2 - 0.01, 0, th / 2 + 0.02), '#22d3c5', tor)  # t-shirt
    b.part('box', (0.03, 0.1, 0.1), (P['tw_x'] / 2 + 0.03, 0, th * 0.5), '#ffffff', tor)  # cigogne imprimee
    b.part('box', (0.03, 0.03, 0.08), (P['tw_x'] / 2 + 0.035, 0, th * 0.5 + 0.08), '#ff8c1a', tor)
    for yy in (-1, 1):
        b.part('rbox', (0.34, 0.24, 0.18), (0, yy * (P['tw_y'] / 2 + 0.03), th - 0.02), 'tex:kelsch_red', tor)  # epaulettes
    b.part('rbox', (0.16, 0.5, 0.22), (-0.12, 0, th + 0.04), '#ffe600', tor)  # col releve jaune fluo
    b.part('rbox', (P['tw_x'] + 0.02, P['tw_y'] + 0.02, 0.1), (0, 0, 0.04), '#ffe600', tor)  # bas du blouson
    # chaine en or + pendentif bretzel
    for i in range(7):
        a = (i - 3) / 3
        b.part('box', (0.04, 0.04, 0.04), (P['tw_x'] / 2 + 0.02, a * 0.12, th - 0.06 - (1 - a * a) * 0.18), '#ffd700', tor)
    b.pretzel((P['tw_x'] / 2 + 0.05, 0, th - 0.33), 0.2, '#ffd700', tor, rot=(0, 0, 90), bead=0.05)
    # tete : grosse tete cartoon
    hd = b.piv('head', (0, 0, th + 0.02), tor)
    J['head'] = hd
    hs = 0.54
    b.part('sph', (hs * 0.95, hs * 0.9, hs), (0.02, 0, hs / 2), '#f5b48a', hd, seg=12, smooth=True)
    b.part('rbox', (0.22, 0.34, 0.16), (0.12, 0, 0.09), '#f5b48a', hd)                  # machoire carree
    b.part('sph', (0.1, 0.09, 0.1), (0.25, 0, 0.24), '#ef9a70', hd, seg=6, smooth=True)  # nez
    b.part('rbox', (0.08, 0.3, 0.07), (0.235, 0, 0.17), '#6b3a14', hd)                  # moustache
    b.part('rbox', (0.1, 0.46, 0.09), (0.19, 0, 0.3), '#111018', hd)                    # lunettes
    b.part('box', (0.03, 0.4, 0.05), (0.24, 0, 0.305), '#38f2ff', hd)                   # verres miroir
    b.part('cyl', (0.47, 0.44, 0.08), (0.01, 0, 0.4), '#ff2e88', hd, seg=12)            # bandeau eponge
    # coupe mulet : epis sur le dessus, longue nuque
    for x, y, a, s in [(-0.06, 0, -40, 1.0), (0.06, -0.09, -10, 0.9), (0.06, 0.09, -10, 0.9), (-0.14, -0.08, -60, 0.9),
                       (-0.14, 0.08, -60, 0.9), (0.12, 0, 10, 0.8), (-0.02, -0.15, -30, 0.8), (-0.02, 0.15, -30, 0.8)]:
        b.part('cone', (0.17 * s, 0.17 * s, 0.26 * s), (x, y, 0.52), '#ffd23f', hd, rot=(0, a, 0), seg=4)
    b.part('rbox', (0.2, 0.4, 0.42), (-0.2, 0, 0.18), '#ffd23f', hd)                    # mulet
    b.part('rbox', (0.16, 0.34, 0.18), (-0.24, 0, -0.06), '#f0b82a', hd)
    return J


GUARD = dict(shN=35, elN=105, shF=50, elF=95, hipN=12, kneeN=-12, hipF=-12, kneeF=-6, torso=6)
HERO_ANIMS = [
    ('idle', [dict(), dict(z=-0.03, shN=32, shF=47, head=4)]),
    ('walk', [dict(w, shN=w['shN'] + 30, elN=95, shF=w['shF'] + 40, elF=90) for w in WALK]),
    ('punch1', [dict(shN=15, elN=120, torso=-4), dict(shN=88, elN=2, torso=12, hipN=18, hipF=-20)]),
    ('punch2', [dict(shF=20, elF=120, torso=-6), dict(shF=88, elF=2, shN=20, elN=110, torso=16, hipN=20, hipF=-22)]),
    ('kick', [dict(hipN=55, kneeN=-80, torso=-10), dict(hipN=95, kneeN=0, torso=-18, hipF=-8, kneeF=-12, shN=-20, elN=60, shF=60, elF=80)]),
    ('jump', [dict(hipN=70, kneeN=-100, hipF=40, kneeF=-90, shN=140, elN=30, shF=120, elF=40)]),
    ('jumpkick', [dict(hipN=80, kneeN=0, hipF=20, kneeF=-100, torso=-12, shN=-30, elN=40, shF=40, elF=90)]),
    ('hurt', [dict(torso=-22, head=-18, shN=-35, elN=30, shF=-20, elF=40, hipN=10, kneeN=-15, hipF=-15, kneeF=-10, x=-0.08)]),
    ('down', [dict(fall=88, rx=1.1, rz=0.14, shN=160, shF=150, elN=10, elF=20, hipN=15, hipF=-10, kneeN=-20, kneeF=-30, head=10)]),
    ('special', [dict(yaw=a, shN=90, elN=0, shF=-90, elF=0, hipN=10, hipF=-10, z=0.06, torso=0) for a in (0, 90, 180, 270)]),
    ('win', [dict(shF=175, elF=0, shN=-30, elN=60, hipN=20, kneeN=-30, hipF=-15, head=-12, torso=-6),   # pose disco
             dict(shF=175, elF=0, shN=-30, elN=60, hipN=-10, kneeN=-5, hipF=20, kneeF=-35, head=-4, torso=4, z=-0.04)]),
]


def make(name, builder, anims, frame=96, base=None, yaw=20):
    sc = setup_scene("S3K_Sprites", frame, frame, style='funk')
    b = B(sc)
    J = builder(b)
    return render_character(sc, J, name, frame, anims, base=base, yaw=yaw, ppu=SPPU)


JOBS = [
    ('hero', lambda: make('hero80', build_hero, HERO_ANIMS, base=GUARD, yaw=25)),
]
done = []
for key, fn in JOBS:
    if ONLY and key not in ONLY:
        continue
    m = fn()
    m['ppu'] = SPPU
    write_meta(key + '80', m)
    done.append(key)
result = {"done": done}
