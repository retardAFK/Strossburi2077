# STRASBOURG N'EST PAS À VENDRE — prompt de référence pour le code

Ce fichier est le « prompt code » du projet : Claude Code le lit automatiquement à chaque session.
Toute personne (ou IA) qui touche au code commence par ici.

## 1. Le jeu en une phrase
Aventure-action 3D façon N64/GameCube (donjon par donjon, combat verrouillé sur cible, objets qui ouvrent
de nouveaux chemins), ton satirique et loufoque, 100 % Strasbourg.

## 2. Histoire
- Le consortium **BlingCo Multi-Holdings** (nom parodique, toujours inventé) a racheté le club de la Meinau
  pour en faire un « club satellite ». Puis il rachète la ville et installe le **marché de Noël permanent**
  (365 jours/an) pour pomper l'argent de Strasbourg.
- Le héros est un **ultra de la Meinau** : il a vu le consortium à l'œuvre au stade et refuse que ça arrive
  à toute la ville. Il est **le soldat de tout le peuple strasbourgeois**, pas seulement du foot.
- Chaque niveau libère une partie des Strasbourgeois, qui rejoignent la résistance et lui confient un objet.
  Au final, tous reviennent pour la bataille de la place Kléber.

| # | Niveau | Filiale du consortium | Peuple libéré → objet | Boss |
|---|--------|----------------------|------------------------|------|
| 1 | Petite France 2077 | BlingCo Restauration (restos à touristes hors de prix) | winstubs, petits commerçants → bretzel-boomerang | Androïde de Service Restauration ASR-67 |
| 2 | Meinau (quartier + stade) | BlingCo Football (multipropriété) | habitants, anciens du kop → mégaphone | Le Multipropriétaire (hydre à têtes de clubs) |
| 3 | Port du Rhin | BlingCo Immobilier (boboïsation) | dockers, mariniers → gaffe-grappin | Le Promoteur et sa grue |
| 4 | Place Kléber | Siège du marché de Noël permanent | tout le monde | PDG déguisé en Père Noël en costard (la corruption) |

Fin du niveau 1 : l'Ultra est envoyé de force dans le passé par **SCN** (« Stras c'est nous », le réseau de
résistance des Strasbourgeois ; contact : Celle du stade).

Héros : veste en jean noire, casquette, lunettes de soleil, écharpe en satin bleu et blanc (arme de départ
et signe de ralliement).

## 3. Règles de contenu (non négociables)
- Satire de **types** (le restaurateur arnaqueur, le promoteur, le consortium), jamais de personnes, élus,
  joueurs ou entreprises réels nommés. Noms parodiques uniquement.
- Inspirations de gameplay (Zelda N64/GC) et de ton (Marseille 3000) : on reprend des **mécaniques
  génériques**, jamais de noms, personnages, musiques, sons ou designs existants.
- La culture alsacienne est toujours montrée avec respect. La satire vise uniquement ce que le consortium
  en fait (androïdes, « Expériences Authentiques® », péages, cages « Tradition Certifiée »). Les gens
  (winstubière, commerçants, supporters) et les traditions sont ce qu'on défend, jamais une cible.
- Tous les textes du jeu sont en français, dans `src/data/texts.fr.js` (jamais en dur dans le code).

## 4. Stack (100 % open source)
- **Blender** (piloté par MCP) : modèles low poly, exportés en glTF binaire (`.glb`).
- **Three.js** pour le rendu, **JavaScript ES modules**, **esbuild** pour le build (un seul fichier, hors-ligne).
- `npm install` une fois, puis `npm run build` (ou `npm run dev` qui reconstruit à chaque modification).
  Le jeu se lance en ouvrant `dist/index.html` d'un double-clic : modèles `.glb` et Three.js sont embarqués.
- Pas d'autre dépendance sans bonne raison.

## 5. Architecture : un fichier = une responsabilité
```
src/
  main.js                 point d'entrée : choisit le niveau (?level=<id>), branche le DOM, charge ses modèles
  Game.js                 chef d'orchestre : boucle fixe 60 Hz, scènes (titre, jeu, pause, fin), API des niveaux
                          (spawn, trigger, onGroupCleared, say, setCheckpoint, win)
  index.html              page + HUD (copiée dans dist/)
  core/                   moteur, ne connaît RIEN du contenu du jeu
    Renderer.js           Three.js, rendu basse résolution (480x270) + upscale pixelisé
    Input.js              clavier / souris / manette -> actions abstraites (move, attack, roll, lock, use, ok)
    Audio.js              WebAudio : sfx et musiques décrits par des données
    Assets.js             chargement des .glb, clonage, index des pivots nommés
    Events.js             bus d'événements (emit/on) : seul moyen pour les systèmes de se parler
    Collision.js          murs AABB, cylindres, triggers (zones)
    Camera.js             caméra 3e personne, verrouillage, cadrage des boss
  systems/                règles de jeu génériques, réutilisées par tous les niveaux
    Combat.js             hitbox, dégâts, invincibilité, recul, knockback
    Health.js             bretzels de vie, soins, mort, checkpoint
    Inventory.js          objets, clés, objets de quête
    Dialog.js             file de dialogues, machine à écrire, portraits
    Puzzle.js             briques d'énigmes : interrupteur, séquence, porte, minuterie (TimedSwitchGroup)
    Interact.js           interaction de proximité (touche E) + indication HUD par événement 'hud:prompt'
    Animator.js           poses procédurales sur les pivots (hipN, kneeN, shN, elN, torso, head...)
    Hud.js                interface HTML (cœurs, objet équipé, barre de boss)
    World.js              construit le décor d'un niveau à partir de son layout (murs, néons, pubs holo, herses...)
    Textures.js           textures procédurales en pixels (pavés, grès rose, carrelage, panneaux holo...)
    Fx.js / Particles.js  réticule, ondes de choc, étoiles, bulles de texte, particules
  entities/               une entité = un fichier, construit par composition
    Entity.js             base : position, orientation, état, composants
    player/Ultra.js       le héros (déplacements, roulade, attaques, utilisation d'objets)
    enemies/<Nom>.js      un fichier par ennemi (ServeurArnaqueur.js, StewardRobot.js, ...)
    bosses/<Nom>.js       un fichier par boss, machine à états explicite
    props/<Nom>.js        coffres, pots, portes, leviers, PNJ
  items/<Nom>.js          un fichier par objet : Echarpe.js, BretzelBoomerang.js, Megaphone.js, Gaffe.js
  levels/index.js         registre des niveaux : layout, script, textes, modèles .glb et types d'entités
  levels/<id>/            un dossier par niveau
    layout.js             DONNÉES uniquement : salles, murs, entités, déclencheurs
    script.js             événements scénarisés du niveau (dialogues, apparitions, portes)
  data/
    texts.fr.js           tous les textes
    tuning.js             tous les réglages chiffrés (vitesses, dégâts, PV, timings)
assets/models/*.glb       sortie de Blender (ne jamais éditer à la main)
tools/blender/            un script Python par modèle + lib commune (s3k_lib.py)
```

### Règles d'architecture
1. `core/` ne dépend de rien d'autre. `systems/` dépend de `core/`. `entities/`, `items/`, `levels/`
   dépendent de `systems/` et `core/`. Jamais l'inverse.
2. Les modules se parlent par le **bus d'événements** (`Events.emit('enemy:killed', e)`), pas par des
   références croisées.
3. **Les niveaux sont des données** : ajouter un niveau = créer `levels/<id>/layout.js` + `script.js`
   et l'inscrire dans `levels/index.js`, sans toucher au moteur.
4. **Chaque ennemi ou boss est une machine à états** explicite (`states = { idle, chase, windup, attack, hurt, die }`),
   chaque état avec `enter`, `update` et `exit`.
5. **Tous les chiffres sont dans `tuning.js`** et tous les textes dans `texts.fr.js`.
6. Fichiers courts (cible < 250 lignes). Si ça grossit, on découpe.
7. Pas de logique dans le rendu : le rendu lit l'état, il ne le modifie pas.
8. Commentaires en français, noms de code en anglais, sauf les noms propres du jeu (Ultra, Echarpe...).

## 6. Pipeline des modèles (Blender)
- Un script par modèle dans `tools/blender/` : il crée sa propre scène, construit le modèle avec la lib
  commune et exporte `assets/models/<nom>.glb`. Il ne modifie jamais la scène ouverte de l'utilisateur.
- **Pivots nommés obligatoires** (empties) pour l'animation procédurale :
  `root, pelvis, torso, head, hipN/hipF, kneeN/kneeF, shN/shF, elN/elF, handN/handF`
  (N = côté proche, F = côté éloigné). Le personnage regarde vers +X dans Blender.
- Style : low poly, arêtes arrondies (`rbox`), couleurs franches, motifs en petites textures (`tex:`),
  shading plat (`flatShading`) dans le jeu.
- Chaque nouveau design est d'abord **rendu en planche de présentation** et validé avant d'être intégré.

## 7. Où en est-on
- Niveau jouable : `levels/meinau-ouest` (coursives de la tribune ouest en 2077 : consultants, juristes,
  portique laser + terminal, boss « Directeur de la Valorisation »). Modèles : `tools/blender/ultra.py`,
  `tools/blender/meinau_cast.py`. C'est le niveau par défaut tant que la Petite France n'est pas complète.
- En cours : `levels/petite-france` (`?level=petite-france`), salle 1 jouable : ruelle en bord d'Ill puis
  Quartier des Tanneurs devenu « Food Court Premium » (serveurs, sommelier, énigme des 3 bornes, herse,
  message holo de Celle du stade). Modèles : `tools/blender/{sbires,decor_pf,salles_pf}.py`.
- Debug : `window.S3K` dans la console donne accès au Game (entités, monde, joueur).
- Debug : ajouter `?debug=1` à l'URL (`dist/index.html?debug=1`) active les raccourcis de `src/debug.js` :
  **F2** téléporte l'Ultra devant le prochain terminal ou interrupteur (borne...) encore à activer,
  **F3** élimine tous les ennemis présents (n'importe quel niveau). Ex. `dist/index.html?level=petite-france&debug=1`.

## 8. Méthode de travail
- On avance **un élément à la fois, validé par Maxime** (design, puis intégration, puis réglages).
- Chaque fonctionnalité arrive avec un moyen de la tester vite (raccourci debug, scène de test).
- Les prototypes existants (`game/` = beat'em up 2D, `proto3d/` = donjon de la cathédrale) servent de
  référence. Le nouveau jeu vit dans `src/`.
