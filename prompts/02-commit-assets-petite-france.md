# Tâche : versionner les assets de la Petite France 2077

Contexte : Claude (Cowork) a créé dans Blender les scripts et modèles du niveau 1. Ils sont sur le disque
mais pas dans Git. Ton seul travail ici est de les committer proprement, SANS modifier leur contenu.

1. Si une autre branche est en cours (ex. `feat/camera-souris`) avec des changements non committés,
   ne les mélange pas : `git stash` ou termine-la d'abord, et dis-moi ce que tu as fait.
2. Pars de `main` à jour : `git checkout main && git pull`, puis `git checkout -b assets/petite-france`.
3. Ajoute uniquement :
   - `tools/blender/asr.py`, `tools/blender/sbires.py`, `tools/blender/decor_pf.py`, `tools/blender/salles_pf.py`
   - `tools/blender/chef.py` (première version du boss, gardée pour l'historique)
   - `assets/models/asr.glb`, `serveur.glb`, `sommelier.glb`, `pf_*.glb`, `bretzel_boomerang.glb`, `pnj_*.glb`
   - les rendus `tools/blender/out/{asr,serveur,sommelier,chef,decor_pf,pf_,bretzel,pnj_}*.png`
   - le dossier `prompts/`
4. Vérifie avant de committer : `git status` ne doit montrer aucun secret, aucun `deploy/PROMPT_CLAUDE_CODE.md`,
   aucun `node_modules/` ni `dist/`. Liste-moi les fichiers et leur taille totale.
5. Commit : « Assets niveau 1 Petite France 2077 : androïdes, kit de rue, pièces des salles, PNJ ».
6. Push, PR, `gh pr checks --watch`. Si c'est vert, merge en squash SANS me redemander
   (ce sont uniquement des assets, rien ne change dans le jeu tant qu'ils ne sont pas branchés dans le code).
7. Récap en 3 lignes.
