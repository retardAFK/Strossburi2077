# Validé par Maxime le 21/11/2026 (« parfait » + têtes des agents habillées).
# Boss niveau 4 (Place Kléber 2026) : Marco CeKlair, le PDG en Père Noël. Nom parodique autorisé par Maxime
# (CLAUDE.md §3) ; visage, physique et caractère 100 % inventés. Exécuter dans Blender :
#   exec(open(r"C:\Users\mbarbe\dev\Stras3000\tools\blender\marco_ceklair.py", encoding="utf-8").read())
# Étape VALIDATION : planche tools/blender/out/marco_*.png
# Choix de Maxime (21/11/2026) : Père Noël corporate cyborg EN NOIR ; traîneau tiré par des agents de sécu
# en gilet fluo (remplace les drones) ;
# cadeaux piégés = interdictions de stade + billets hors de prix ; slogan répété « de manière débile, en mode
# lavage de cerveau » (écran holo `slogan`, texte dans texts.fr.js).
# Déplacement cohérent : tout l'attelage avance vers +X AU SOL (traîneau sur patins, agents qui courent devant,
# cordes tendues) ; la hotte-réacteur ne sert qu'à des à-coups de vitesse (boost), pas à voler.
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
RED, RED_D, WHITE, GOLD, DARK, STEEL, CYAN, SKIN = '#d01a2a', '#9a1020', '#f4f6ff', '#ffc040', '#14141c', '#9aa3b8', '#38f2ff', '#e8b48c'
SUIT, FLUO = '#1c1c24', '#d8ff1a'  # Père Noël en NOIR (retour de Maxime) ; gilets fluo des agents


def santa(b, parent):
    """Le PDG Père Noël, mi-homme mi-machine, assis : costume rouge à logo corporate, barbe, bonnet,
    œil-scanner, bras robot avec télécommande, hotte-réacteur dans le dos."""
    p = b.piv('santa', (0, 0, 0), parent)
    b.part('rbox', (0.6, 0.75, 0.7), (0, 0, 0.35), SUIT, p, r2=0.35)                    # torse ventru
    b.part('box', (0.62, 0.77, 0.1), (0, 0, 0.12), DARK, p)                            # ceinture
    b.part('box', (0.04, 0.18, 0.14), (0.31, 0, 0.12), GOLD, p)                         # boucle
    b.part('box', (0.03, 0.2, 0.2), (0.3, -0.18, 0.5), GOLD, p)                         # logo corporate « BC »
    b.part('box', (0.035, 0.12, 0.04), (0.315, -0.18, 0.5), RED_D, p)
    b.part('box', (0.62, 0.08, 0.72), (0, 0, 0.35), WHITE, p)                          # bande fourrure
    # bras humain gauche (gant blanc, qui distribue) / bras robot droit (télécommande des drones)
    b.part('rbox', (0.2, 0.2, 0.5), (0.15, 0.42, 0.35), SUIT, p, rot=(0, -45, 0))
    b.part('sph', (0.13, 0.13, 0.13), (0.34, 0.45, 0.18), WHITE, p, seg=6)
    b.part('box', (0.13, 0.13, 0.5), (0.15, -0.42, 0.35), STEEL, p, rot=(0, -45, 0))
    b.part('cyl', (0.06, 0.06, 0.45), (0.15, -0.5, 0.38), '#5a606e', p, rot=(0, -45, 0), seg=6)
    b.part('rbox', (0.12, 0.08, 0.2), (0.38, -0.45, 0.2), DARK, p)                      # télécommande
    b.part('sph', (0.04, 0.04, 0.04), (0.42, -0.45, 0.27), RED, p, seg=6)
    h = b.piv('head', (0.03, 0, 0.88), p)
    b.part('rbox', (0.32, 0.18, 0.3), (0, 0.08, 0.1), SKIN, h)                          # moitié chair
    b.part('rbox', (0.32, 0.18, 0.3), (0, -0.08, 0.1), STEEL, h)                        # moitié métal
    b.part('sph', (0.045, 0.045, 0.045), (0.16, 0.08, 0.15), DARK, h, seg=6)            # œil humain
    b.part('cyl', (0.09, 0.09, 0.03), (0.17, -0.08, 0.15), CYAN, h, rot=(0, 90, 0), seg=8)   # œil-scanner cyan
    b.part('rbox', (0.2, 0.36, 0.3), (0.1, 0, -0.08), WHITE, h, r2=0.45)               # barbe
    b.part('box', (0.04, 0.2, 0.04), (0.18, 0, 0.04), WHITE, h)                         # moustache
    b.part('box', (0.02, 0.14, 0.03), (0.21, 0, -0.02), '#c06a5a', h)                   # sourire forcé
    b.part('cone', (0.36, 0.36, 0.42), (-0.04, 0, 0.42), SUIT, h, rot=(0, -25, 0), seg=8)  # bonnet
    b.part('cyl', (0.38, 0.38, 0.08), (0, 0, 0.27), WHITE, h, seg=10)
    b.part('sph', (0.09, 0.09, 0.09), (-0.2, 0, 0.6), WHITE, h, seg=6)
    b.part('box', (0.02, 0.02, 0.18), (0.0, -0.18, 0.18), CYAN, h)                      # câble
    # hotte-réacteur : sac de cadeaux sur deux tuyères
    hotte = b.piv('hotte', (-0.42, 0, 0.5), p)
    b.part('rbox', (0.4, 0.55, 0.6), (0, 0, 0.05), '#6a4a2a', hotte, r2=0.45)
    for y in (-0.16, 0.16):
        b.part('cyl', (0.14, 0.14, 0.25), (-0.12, y, -0.35), STEEL, hotte, seg=8)
        b.part('cone', (0.12, 0.12, 0.2), (-0.12, y, -0.55), '#ff7a1a', hotte, rot=(180, 0, 0), seg=6)
    return p


def gift(b, parent, kind, loc, k=1.0):
    """Cadeaux piégés : interdiction de stade (paquet rouge à panneau sens interdit) / billet hors de prix (doré, $)."""
    g = b.piv('gift_' + kind, loc, parent)
    g.scale = (k, k, k)
    if kind == 'interdiction':
        b.part('rbox', (0.3, 0.3, 0.3), (0, 0, 0), WHITE, g)
        b.part('cyl', (0.22, 0.22, 0.02), (0.16, 0, 0), RED, g, rot=(0, 90, 0), seg=10)
        b.part('box', (0.025, 0.16, 0.04), (0.17, 0, 0), WHITE, g)                      # sens interdit
        b.part('box', (0.31, 0.04, 0.31), (0, 0, 0), RED, g)                            # ruban
    else:
        b.part('rbox', (0.34, 0.2, 0.26), (0, 0, 0), GOLD, g)
        b.part('box', (0.02, 0.14, 0.03), (0.17, 0, 0.06), '#2ab04a', g)               # « $ » vert
        b.part('box', (0.02, 0.03, 0.18), (0.17, 0, 0.0), '#2ab04a', g)
        b.part('box', (0.02, 0.14, 0.03), (0.17, 0, -0.06), '#2ab04a', g)
        b.part('box', (0.35, 0.21, 0.04), (0, 0, 0), RED, g)                            # ruban
    return g


def agent(b, parent, loc, stride=0.0):
    """Agent de sécurité en gilet fluo qui TIRE le traîneau en courant vers +X (sens de déplacement).
    Légère inclinaison vers l'avant, jambes et bras sur pivots (hipN/hipF, shN/shF) pour l'animation de course ;
    `stride` décale la pose (−1..1) pour que les 4 agents ne courent pas tous en même temps."""
    d = b.piv('agent', loc, parent)
    body = b.piv('lean', (0, 0, 0.8), d)
    body.rotation_euler = (0, math.radians(10), 0)                                           # penché dans l'effort
    for side, y, sg in (('N', -0.1, 1), ('F', 0.1, -1)):
        hp = b.piv('hip' + side, (0, y, 0.8), d)
        hp.rotation_euler = (0, math.radians(25 * sg * (1 if stride >= 0 else -1)), 0)      # foulée alternée
        b.part('box', (0.14, 0.14, 0.78), (0, 0, -0.39), DARK, hp)
        b.part('box', (0.22, 0.14, 0.08), (0.05, 0, -0.78), DARK, hp)                        # chaussure vers l'avant
    b.part('rbox', (0.3, 0.45, 0.55), (0, 0, 0.25), DARK, body)                               # torse noir
    b.part('rbox', (0.32, 0.47, 0.42), (0, 0, 0.27), FLUO, body)                              # gilet fluo
    b.part('box', (0.33, 0.48, 0.05), (0, 0, 0.2), '#c8ccd8', body)                           # bandes réfléchissantes
    b.part('box', (0.33, 0.48, 0.05), (0, 0, 0.37), '#c8ccd8', body)
    hd = b.piv('head', (0.02, 0, 0.66), body)
    hd.rotation_euler = (0, math.radians(-10), 0)                                             # regard droit devant
    b.part('rbox', (0.24, 0.22, 0.24), (0, 0, 0), '#c99070', hd)
    b.part('box', (0.04, 0.22, 0.05), (0.12, 0, 0.03), DARK, hd)                              # lunettes noires (vers +X)
    b.part('box', (0.02, 0.02, 0.15), (-0.06, -0.12, -0.02), DARK, hd)                       # oreillette
    # tête habillée : casquette noire « SÉCURITÉ » à bande fluo, cheveux courts, barbe de 3 jours, col montant
    b.part('rbox', (0.26, 0.25, 0.1), (-0.01, 0, 0.13), DARK, hd)                            # calotte
    b.part('box', (0.14, 0.24, 0.025), (0.14, 0, 0.09), DARK, hd)                             # visière
    b.part('box', (0.265, 0.255, 0.03), (-0.01, 0, 0.1), FLUO, hd)                            # bande fluo
    b.part('box', (0.02, 0.12, 0.04), (0.125, 0, 0.14), '#ffffff', hd)                        # écusson « SÉCURITÉ »
    b.part('box', (0.1, 0.235, 0.08), (-0.08, 0, 0.04), '#2a1a12', hd)                       # nuque / cheveux courts
    b.part('box', (0.04, 0.2, 0.08), (0.11, 0, -0.08), '#5a4030', hd)                         # barbe de 3 jours
    b.part('box', (0.02, 0.012, 0.25), (-0.05, -0.12, -0.18), '#e8e8f0', hd)                 # fil de l'oreillette
    b.part('rbox', (0.22, 0.3, 0.1), (0, 0, -0.16), DARK, hd)                                 # col montant
    for side, y in (('N', -0.27), ('F', 0.27)):
        sh = b.piv('sh' + side, (0, y, 0.48), body)
        sh.rotation_euler = (0, math.radians(60), 0)                                          # bras tendus en arrière, mains sur la corde
        b.part('box', (0.12, 0.12, 0.5), (0, 0, -0.25), DARK, sh)
        b.part('sph', (0.08, 0.08, 0.08), (0, 0, -0.5), '#c99070', sh, seg=6)
    b.piv('rope', (-0.35, 0, 1.05), d)                                                          # point d'attache de la corde
    return d


def build_marco(b):
    root = b.piv('root')
    sled = b.piv('traineau', (0, 0, 0.6), root)
    # traîneau-loge VIP : coque rouge laquée, patins or, fauteuil cuir, rambarde, écran holo du slogan
    b.part('rbox', (1.5, 1.0, 0.45), (0, 0, 0), SUIT, sled, r2=0.3)
    for y in (-0.42, 0.42):
        b.part('box', (1.7, 0.06, 0.06), (0.05, y, -0.35), GOLD, sled)
        b.part('box', (0.06, 0.06, 0.2), (0.85, y, -0.25), GOLD, sled, rot=(0, 30, 0))
    b.part('box', (0.04, 1.0, 0.25), (0.75, 0, 0.3), GOLD, sled)                        # rambarde VIP
    b.part('rbox', (0.25, 0.85, 0.8), (-0.55, 0, 0.55), '#5a1a1a', sled)                # fauteuil cuir
    scr = b.piv('slogan', (0.85, 0, 0.9), sled)
    b.part('box', (0.03, 0.9, 0.35), (0, 0, 0), '#0c2238', scr)
    b.part('box', (0.035, 0.8, 0.06), (0.002, 0, 0.08), CYAN, scr)                      # lignes de texte holo
    b.part('box', (0.035, 0.6, 0.05), (0.002, 0, -0.04), CYAN, scr)
    b.part('box', (0.02, 0.02, 0.35), (0, 0, -0.35), STEEL, scr)
    santa(b, sled).location = (-0.2, 0, 0.25)
    # cadeaux piégés empilés à l'arrière
    for i, (kind, loc) in enumerate((('interdiction', (-0.75, -0.3, 0.35)), ('billet', (-0.75, 0.25, 0.32)),
                                      ('interdiction', (-0.7, 0.0, 0.62)))):
        gift(b, sled, kind, loc)
    # attelage : 4 agents de sécurité en gilet fluo qui tirent le traîneau
    for i, (x, y) in enumerate(((1.4, -0.35), (1.4, 0.35), (2.1, -0.35), (2.1, 0.35))):
        agent(b, root, (x, y, 0), stride=1 if i in (0, 3) else -1)
        b.part('box', (x - 0.35 - 0.75, 0.015, 0.015), ((0.75 + x - 0.35) / 2, y, 1.0), '#c8a060', root)   # cordes tendues
    return root


def scene(name, w, h):
    for old in [x for x in bpy.data.scenes if x.name == name]:
        bpy.data.scenes.remove(old)
    return setup_scene(name, w, h, style='funk')


renders = []
sc = scene("S3K_marco", 900, 560)
build_marco(B(sc))
for label, yaw in (('trois_quarts', 30), ('profil', 0)):
    for o in [o for o in sc.collection.all_objects if o.type == 'CAMERA']:
        bpy.data.objects.remove(o, do_unlink=True)
    cam = sprite_camera(sc, 900, 1.2, yaw=yaw, ppu=150)
    cam.location.x += 0.6
    p = os.path.join(SHEET_DIR, f"marco_{label}.png"); render_to(sc, p); renders.append(p)
sc2 = scene("S3K_marco_perso", 420, 420)
santa(B(sc2), None)
sprite_camera(sc2, 420, 0.75, yaw=40, ppu=240)
p = os.path.join(SHEET_DIR, "marco_perso.png"); render_to(sc2, p); renders.append(p)
sc3 = scene("S3K_marco_cadeaux", 420, 260)
bb = B(sc3)
gift(bb, None, 'interdiction', (0, -0.35, 0)); gift(bb, None, 'billet', (0, 0.35, 0))
sprite_camera(sc3, 420, 0.0, yaw=70, ppu=330)
p = os.path.join(SHEET_DIR, "marco_cadeaux.png"); render_to(sc3, p); renders.append(p)
result = {"renders": renders}

if EXPORT:
    out = []
    for name, fn in (("marco_ceklair", build_marco),
                     ("cadeau_interdiction", lambda b: gift(b, None, 'interdiction', (0, 0, 0))),
                     ("cadeau_billet", lambda b: gift(b, None, 'billet', (0, 0, 0)))):
        s = scene("S3K_exp_" + name, 64, 64)
        fn(B(s))
        win = bpy.context.window; prev = win.scene; win.scene = s
        try:
            bpy.ops.export_scene.gltf(filepath=os.path.join(MODEL_DIR, name + ".glb"), export_format='GLB',
                                      use_active_scene=True, export_cameras=False, export_lights=False, export_yup=True)
        finally:
            win.scene = prev
        out.append(name)
    result["glb"] = out
