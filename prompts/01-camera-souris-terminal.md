# Tâche : caméra à la souris + terminal plus lisible (Stras2067)

Lis d'abord `CLAUDE.md` et respecte ses règles d'architecture : chiffres dans `src/data/tuning.js`,
textes dans `src/data/texts.fr.js`, `core/` ne dépend de rien, communication par le bus d'événements,
fichiers courts, commentaires en français.

Contexte : jeu PC en vue à la 3e personne. Aujourd'hui la caméra suit seule le joueur
(`src/core/Camera.js`), la souris ne sert qu'à attaquer (clic gauche) et verrouiller (clic droit).
Le terminal du niveau `meinau-ouest` ne s'active qu'en le frappant à l'écharpe, et les joueurs ne le trouvent pas.

## 1. Caméra à la souris
- `core/Input.js` : capture de la souris (Pointer Lock) au clic sur le canvas, accumulation des
  déplacements `movementX/Y` dans `input.look = { dx, dy }`, remis à zéro à chaque tick.
  Le premier clic qui capture la souris ne déclenche PAS d'attaque.
  Échap libère la souris (et met en pause comme aujourd'hui). Reprise = nouveau clic.
- `core/Camera.js` : ajouter un angle vertical `pitch` (en plus de `yaw`).
  La souris pilote `yaw` et `pitch` ; `pitch` borné (min/max dans tuning).
  Distance et hauteur de la caméra calculées à partir de `pitch`.
  Garder le comportement actuel quand la souris ne bouge pas : recentrage doux derrière le joueur
  seulement après un délai sans mouvement de souris (délai dans tuning, 0 = jamais).
  Verrouillage de cible (clic droit / Maj) : il reste prioritaire sur la souris.
  Le cadrage des boss et les limites de zone (`bounds`) continuent de marcher.
- Déplacements : le joueur avance dans la direction de la caméra (vérifie `entities/player/Ultra.js`,
  qui utilise déjà `camera.forward()/right()`, et corrige si besoin).
- `tuning.js` → `camera.mouse = { sens: 0.0025, invertY: false, pitchMin, pitchMax, recenterDelay }`.
- Manette : stick droit (axes 2 et 3) sur la même logique, si c'est simple à ajouter.
- Mets à jour le texte des contrôles dans `texts.fr.js` (souris = caméra, clic pour capturer, Échap pour libérer).

## 2. Terminal plus lisible
- `entities/props/Terminal.js` : il s'active AUSSI avec l'action `use` (touche E) quand le joueur est
  à moins de `TUNING.terminal.useRange` (ex. 2.2) ; le coup d'écharpe continue de marcher.
- Marqueur au-dessus du terminal tant qu'il est actif : losange ou flèche néon qui flotte et tourne
  (géométrie Three.js simple, pas de nouveau .glb), visible de loin, retiré après activation.
- Indication à l'écran quand on est à portée : « E : pirater » (texte dans `texts.fr.js`,
  affichage via `systems/Hud.js`, déclenché par événement, pas par référence directe).
- Mets à jour le dialogue `laser` dans `texts.fr.js` pour mentionner la touche E.
- Ces règles doivent valoir pour tout futur terminal de n'importe quel niveau (rien de spécifique à meinau-ouest).

## 3. Moyen de tester vite
- Ajoute un raccourci debug si absent : `?debug=1` dans l'URL → touche F2 téléporte le joueur
  devant le terminal. Documente-le dans `CLAUDE.md` (section Debug).

## Livraison
1. Branche `feat/camera-souris`.
2. `npm run build`, puis ouvre `dist/index.html` et vérifie en jouant : capture souris, rotation
   horizontale et verticale, Échap, verrouillage, déplacements, terminal (E et écharpe), marqueur, indication.
   Si tu ne peux pas tester toi-même en jouant, dis-moi exactement quoi tester.
3. Montre-moi le diff résumé (fichiers touchés, lignes ajoutées/retirées) et attends mon OK.
4. Commit, push, PR, suis la CI (`gh pr checks --watch`). Demande-moi avant de merger (squash).
5. Après le merge, vérifie le déploiement sur https://stras2067.duckdns.org.

Ne touche pas aux fichiers `deploy/`, `.github/`, ni au serveur.
Réponds en français, court : ce que tu as fait, le résultat, la prochaine étape.
