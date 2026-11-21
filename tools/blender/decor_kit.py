# Exporte en .glb les pièces de décor d'un script de décor validé (decor_meinau.py, decor_port_rhin.py...), SANS changer
# le design : on réutilise ses fonctions de construction (ex. tribune_ext, stade_bol), sans exécuter ses rendus.
# Lancement (Blender en arrière-plan, ne touche à aucune scène ouverte) :
#   blender -b --factory-startup -P tools/blender/decor_kit.py -- decor_meinau tribune_ext:decor_meinau_ext stade_bol:decor_meinau_bol
# Résultat : assets/models/<nom>.glb pour chaque paire fonction:nom.
import os, sys
import bpy

ROOT3 = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
args = sys.argv[sys.argv.index('--') + 1:]
script, pieces = args[0], [a.split(':') for a in args[1:]]
src = open(os.path.join(ROOT3, 'tools', 'blender', script + '.py'), encoding='utf-8').read()
src = src.split('\ndef scene(')[0]          # définitions seulement : pas de rendu de vignette
src = src.replace('ROOT3 = r"C:\\Users\\mbarbe\\dev\\Stras3000"', 'ROOT3 = ' + repr(ROOT3))
ns = {'__name__': 'decor_kit_' + script}
exec(compile(src, script + '.py', 'exec'), ns)
B = ns['B']

sc = bpy.context.scene
for fn, name in pieces:
    for o in list(sc.collection.all_objects):
        bpy.data.objects.remove(o, do_unlink=True)
    ns[fn](B(sc))
    out = os.path.join(ROOT3, 'assets', 'models', name + '.glb')
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_active_scene=True,
                              export_cameras=False, export_lights=False, export_yup=True)
    print('[decor_kit] exporté :', out)
