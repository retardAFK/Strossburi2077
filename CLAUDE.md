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
| 1 | Petite France (futur) | BlingCo Restauration (restos à touristes hors de prix) | winstubs, petits commerçants → bretzel-boomerang | Androïde de Service Restauration ASR-67 |
| 2 | Meinau (quartier + stade) | BlingCo Football (multipropriété) | habitants, anciens du kop → Arc-Drapeau | Le Multipropriétaire (hydre à têtes de clubs) |
| 3 | Port du Rhin | BlingCo Immobilier (boboïsation) | dockers, mariniers → gaffe-grappin | Le Promoteur et sa grue |
| 4 | Place Kléber | Siège du marché de Noël permanent | tout le monde | PDG déguisé en Père Noël en costard (la corruption) |

Ce tableau est l'idée de départ. **Liste et ordre officiels des 11 niveaux, armes, flèches, compagnons et mégaphone
(capacité spéciale du final) : `docs/decisions.md`.**

Chronologie :
- **2023** : BlingCo Multi-Holdings rachète le club de la Meinau.
- **2026** : tout bascule, BlingCo commence à racheter toute la ville. C'est là que l'Ultra est envoyé.
- **2067** : le futur, la ville entière appartient à BlingCo (niveau 1).

Le niveau 1 se passe dans le futur. À la fin, **SCN** (« Stras c'est nous », réseau underground
et populaire, de la rue et des tribunes : « Celui du stade », « Celle du stade ») envoie l'Ultra de force en
**2026**, quand tout a basculé. Le niveau 2 est la Meinau en 2026. Plus tard, retour brutal vers
le futur (partie 2), final à la Meinau du futur. L'année du futur est **2067** : elle est dans UNE constante
(`YEAR` / `TEXTS.year` dans `texts.fr.js`), jamais écrite en dur dans le code ni les textes.

Héros : veste en jean noire, casquette, lunettes de soleil, écharpe en satin bleu et blanc (arme de départ
et signe de ralliement).

## 3. Règles de contenu (non négociables)
- Satire de **types** (le restaurateur arnaqueur, le promoteur, le consortium), jamais de personnes, élus,
  joueurs ou entreprises réels nommés. Noms parodiques uniquement.
  - Exception assumée par Maxime (21/11/2026) : des **noms parodiques déformés** qui évoquent des figures du
    football (« Egboehly », « Marco CeKlair ») sont autorisés. Le reste est toujours inventé : visage, physique,
    traits de caractère, actions. Aucune citation, aucun fait, aucune accusation attribués à une vraie personne ;
    la satire vise le système (multipropriété, club « partenaire »), pas la vie de quelqu'un.
    Aucun nouveau nom de ce type sans l'accord explicite de Maxime.
- Inspirations de gameplay (Zelda N64/GC) et de ton (Marseille 3000) : on reprend des **mécaniques
  génériques**, jamais de noms, personnages, musiques, sons ou designs existants.
- La culture alsacienne est toujours montrée avec respect. La satire vise uniquement ce que le consortium
  en fait (androïdes, « Expériences Authentiques® », péages, cages « Tradition Certifiée »). Les gens
  (winstubière, commerçants, supporters) et les traditions sont ce qu'on défend, jamais une cible.
- Les faits historiques affichés en jeu sont exacts et sourcés ; chaque texte historique est relu par Maxime.
- Tous les textes du jeu sont en français, dans `src/data/texts.fr.js` (jamais en dur dans le code). Les **nouveaux**
  dialogues sont des brouillons dans `src/data/dialogues/<niveau>.fr.js`, relus par Maxime (voir `src/data/README.md`).

## 4. Stack (100 % open source)
- **Blender** (piloté par MCP) : modèles low poly, exportés en glTF binaire (`.glb`).
- **Three.js** pour le rendu, **JavaScript ES modules**, **esbuild** pour le build (un seul fichier, hors-ligne).
- `npm install` une fois, puis `npm run build` (ou `npm run dev` qui reconstruit à chaque modification).
  Le jeu se lance en ouvrant `dist/index.html` d'un double-clic : modèles `.glb` et Three.js sont embarqués.
- Pas d'autre dépendance sans bonne raison.

## 5. Architecture : un fichier = une responsabilité
Détails par dossier : un `README.md` dans chaque dossier de `src/`. Événements du bus : `docs/EVENTS.md`
(généré par `node tools/list-events.mjs`, vérifié par les tests). Décisions : `docs/decisions.md`. Autres IA : `AGENTS.md`.
```
src/
  main.js                 point d'entrée : choisit le niveau (?level=<id>), branche le DOM, charge ses modèles
  touch.js                branche les commandes tactiles sur le jeu (quand les afficher, boutons AGIR / BRETZEL)
  Game.js                 chef d'orchestre : boucle fixe 60 Hz, scènes (titre, jeu, pause, fin), API des niveaux
                          (spawn, trigger, onGroupCleared, say, setCheckpoint, win)
  index.html              page + HUD (copiée dans dist/)
  core/                   moteur, ne connaît RIEN du contenu du jeu
    Renderer.js           Three.js, rendu basse résolution (480x270) + upscale pixelisé
    Input.js              clavier / souris / manette -> actions abstraites (move, attack, roll, lock, use, ok, switch, aim...)
    Touch.js              tactile -> mêmes actions : joystick virtuel (input.move), glisser = caméra, boutons
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
    Cutscene.js           cinématiques : plans de caméra + sous-titres minutés (événement 'hud:caption')
    Animator.js           poses procédurales sur les pivots (hipN, kneeN, shN, elN, torso, head...)
    Hud.js                interface HTML (cœurs, objet équipé, barre de boss)
    Prompts.js            indications qui suivent le dernier appareil : jetons {use}, {attack}... -> E / Y / △ (icônes canvas)
    Menus.js              textes des menus avec icônes + écran « Commandes » (clavier / manette)
    World.js              construit le décor d'un niveau à partir de son layout (murs, néons, pubs holo, herses...)
    Textures.js           textures procédurales en pixels (pavés, grès rose, carrelage, panneaux holo...)
    Fx.js / Particles.js  réticule, ondes de choc, étoiles, bulles de texte, particules
  entities/               une entité = un fichier, construit par composition
    Entity.js             base : position, orientation, état, composants
    player/Ultra.js       le héros (déplacements, roulade, attaques, utilisation d'objets)
    enemies/<Nom>.js      un fichier par ennemi (ServeurArnaqueur.js, StewardRobot.js, ...)
    bosses/<Nom>.js       un fichier par boss, machine à états explicite
    props/<Nom>.js        coffres, pots, portes, leviers, PNJ
  items/<Nom>.js          un fichier par objet : Echarpe.js, BretzelBoomerang.js, ArcDrapeau.js, Gaffe.js
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
- **Niveau 1 jouable de bout en bout** : `levels/petite-france` (niveau par défaut), Petite France en 2067.
  Ouverture, salle 1 (Quartier des Tanneurs : vagues, 3 bornes, herse, plaque 1, Celle du stade), salle 2
  (l'Écluse : levier, vanne, 3 niveaux d'eau, barque, winstubière libérée, plaque 2), salle 3 (Ponts Couverts :
  arène, 3 vagues, coffre → bretzel-boomerang, puis Videur-Maître d'hôtel en combat-tuto du bretzel, borne sur pile,
  plaque 3), salle 4 (Barrage Vauban « Rooftop Premium » : cibles-TPE dans l'ordre des néons, indices progressifs,
  écran du PDG, plaque 4), salle 5 (boss ASR-67 en 3 phases, puis cliffhanger SCN → « Strasbourg, 2026 », « À suivre »).
  Un fichier de script par salle (`salle1.js` … `salle5.js`).
  Boss : `bosses/PhasedBoss.js` (générique : phases par PV, garde de face, point faible) → `bosses/Asr67.js`.
  Cinématiques : `game.playCutscene(plans, sous-titres, suite)` ; HUD : 'hud:fade', 'hud:glitch', 'hud:cinema'.
  Objet : `items/BretzelBoomerang.js` via `systems/Inventory.js` (clic droit si rien n'est verrouillé, sinon F).
  Le layout déclare ses objets génériques dans `objects: [{ type, ... }]` (barque, leviers, PNJ...).
  Modèles : `tools/blender/{sbires,decor_pf,salles_pf}.py`.
- **Niveaux 2 et 3 : la Meinau en maquette grise** (brief `docs/designs/brief-greybox-meinau.md`, plans `meinau-*-plan.svg`, 23/11) :
  `levels/meinau-abords` (`?level=meinau-abords`) = les abords, zones ouvertes (tram, parvis et stewards, parking, parc, berge du Rhin
  tortu), 3 entrées vers le niveau 3 (A portique, B grille ouverte par l'accréditation BlingCo du chantier du terrain vague, par la passerelle, C issue de secours secrète), transmises par la sauvegarde
  (`completeLevel(texte, { entry })`) ; `levels/meinau` (`?level=meinau`) = l'intérieur : coursive en anneau, local du kop
  (Arc-Drapeau, tuto 3 cibles), kop en tribune ouest (tifo), terminal + tifo → tunnel de la pelouse, loges VIP et sous-sols (verrous
  Arc-Drapeau), vestiaires, pelouse (boss Egboehly, `bosses/Egboehly.js` + `HydraHead.js`). Blocs gris étiquetés (`blocks[].label`,
  `labels` du layout), écharpes-marqueurs (`props/EcharpeMarqueur.js`). Anciens décors `decor_meinau_*` (Blender) non utilisés.
  Personnages sans design (anciens du kop, pigeon, kop) : placeholders gris étiquetés (`systems/Placeholder.js`).
  Répliques auto-validées à relire : `docs/dialogues/AUTO.md`.
- **Niveau 3 jouable (maquette grise)** : `levels/port-rhin` (`?level=port-rhin`) : quai et palissade (agents immobiliers-clones),
  vieux moulin (**gaffe-grappin** `items/GaffeGrappin.js` : anneaux → l'Ultra est tiré, objets `pull()` → tirés, sbires étourdis),
  conteneurs et péniches (grues), boss le Promoteur (`bosses/Promoteur.js` + `props/Prefab.js`).
- **Niveau 4 jouable (maquette grise)** : `levels/marche2000` (`?level=marche2000`), la nuit : l'arrière et les rayons en infiltration
  (`systems/Stealth.js` : faisceaux des `Guetteur` vigiles / chariots, caméras-scanners, néons, palettes, fumigènes ; « repéré ! » → retour au
  début de la salle), passage optionnel du marché noir (porte violette → rayons), la réserve (vagues), le toit (enseigne « MARCHÉ 2000 » → Stork, `props/StorkAllie.js`, version événement en attendant
  l'étape F), boss le Gérant de nuit (`bosses/GerantNuit.js` : tiroir-caisse ouvert = piqué de Stork). Décor : `decor_marche2000` (decor_kit).
- **Niveaux 6 et 7 : le Kalt en maquette grise** (brief `docs/designs/brief-greybox-kalt.md`, plan `kalt-plan.svg` v2, 23/11) :
  `levels/kalt-abords` = tram Lycée Couffignal, rue La Fayette, grille → cour (le Kalt révélé en entrant), videurs (`enemies/Physio.js`) et
  robots-cordons du portique (`enemies/RobotCordon.js`, gaffe-grappin) ; secret : palettes de la ruelle → arrière-cours → soupirail ; toit
  (Stork ?) fermé. `levels/kalt` = le Main (rythme + lumières, `props/Sono.js`), l'étage par l'escalier (Mezza : régie lumière
  `props/Projecteur.js` à la flèche court-circuit → porte de la cave ; artspace), la cave (Dylagne, `props/DylagneAllie.js`, version
  événement en attendant l'étape F), le Carré VIP (boss le Magnat, `bosses/MagnatVip.js`). Décors Blender du Kalt non utilisés en maquette.
- **Niveau 6 jouable (maquette grise), fin de la partie 1** : `levels/kleber` (`?level=kleber`) : péages (borne à pirater), labyrinthe de chalets
  (3 tampons officiels, flèche enflammée → `props/NeigePayante.js`, étal au grappin, horloge de la signature `props/Horloge.js`), sapin-écran
  (Stork + Dylagne + court-circuit), boss Marco CeKlair (`bosses/MarcoCeKlair.js`, attelage au sol), faux final → glitch → PARADOXE → « À suivre ».
  Agents `enemies/{Peagiste,AgentBouclier,Neigeur}.js`. Décor : `decor_kleber` (decor_kit). Slogan de Marco : proposition provisoire.
- **Fin de la partie 1** : finir le dernier niveau de la campagne (Kléber) affiche « Partie 1 terminée — À suivre » + crédits courts
  (`TEXTS.partEnd`, `Progress.partEnd()`), {ok} : retour au titre (« rejouer la place Kléber » / nouvelle partie).
 (règles : `docs/decisions.md`) : `items/Weapon.js` (interface commune), `systems/Inventory.js`
  (objets dans l'ordre d'obtention, Tab / croix haut-bas / bouton ⇄ pour changer), `items/ArcDrapeau.js` (verrouillage ou visée
  par-dessus l'épaule : clic droit / LB maintenus, VISER à bascule au tactile ; tir F / RB / bouton ARC, clic gauche en visée),
  `entities/props/Arrow.js`, types de flèches dans `data/arrows.js` (seule la flèche simple est activée), réglages `TUNING.arc`
  et `TUNING.camera.aim`. Le verrouillage accroche aussi les entités `lockable` (cibles-TPE) quand l'arc est équipé.
- **Bac à sable** : `levels/bac-a-sable` (seulement avec `?level=bac-a-sable&debug=1`) : salle grise avec cibles, mannequins
  (`entities/props/Mannequin.js`, compteur de coups), fossé, grille, mur haut ; le bretzel et l'arc sont donnés au départ.
- Ancien prototype, toujours jouable : `levels/meinau-ouest` (coursives de la tribune ouest en 2067 : consultants,
  juristes, portique laser + terminal, boss « Directeur de la Valorisation »), avec `?level=meinau-ouest`.
  Modèles : `tools/blender/ultra.py`, `tools/blender/meinau_cast.py`.
- **Designs validés, pas encore intégrés en jeu** : fiches et planches dans `docs/designs/` (voir son README),
  scripts Blender dans `tools/blender/`, modèles déjà exportés dans `assets/models/`. L'intégration se fait
  un élément à la fois, validé par Maxime (section 8).
- Fichiers générés non versionnés (voir `.gitignore`) : `tools/_frames/`, `tools/blender/out/` (rendus de planches ;
  les planches validées vont dans `docs/designs/`), `__pycache__/`.
- Tests (filet anti-régression) : `npm test` = build + `tests/run-all.mjs` (Chrome installé piloté par
  `playwright-core`, sans fenêtre). `niveau1` (parcours complet via F2), `boss-asr67` (graine `?seed=1`,
  instantané des réglages `tests/snapshots/asr67.json`, mise à jour volontaire : `npm run test:update-snapshots`),
  `meinau-abords` (parcours du niveau 2), `meinau` (parcours du niveau 3), `boss-egboehly` (instantané `tests/snapshots/egboehly.json`), `port-rhin`, `boss-promoteur`, `marche2000`, `boss-gerant` (instantané `tests/snapshots/gerant.json`), `kalt`, `boss-magnat` (instantané `tests/snapshots/magnat.json`), `kleber`, `boss-marco` (instantané `tests/snapshots/marco.json`), `fin-partie1`, `meinau-ouest` (fumée), `manette` (Xbox / PlayStation simulées), `arc-drapeau` (bac à sable : changement d'objet, tir,
  visée, munitions, tactile). Outils communs : `tests/helpers.mjs`. Sans Chrome installé (conteneur) :
  `CHROME_PATH=<binaire Chromium> npm test`.
  Toute PR garde `npm test` vert ; une PR qui touche `entities/bosses/` met à jour le test du boss.
- Aléatoire : la logique de jeu (IA, attaques, objets lâchés) tire dans `core/Random.js` (`rng()`), graine `?seed=<n>` ;
  les effets visuels gardent `Math.random()`.
- Debug : `window.S3K` dans la console donne accès au Game (entités, monde, joueur).
- Mobile : commandes tactiles activées automatiquement sur téléphone / tablette (écran tactile principal),
  forcées avec `?touch=1` (ou coupées avec `?touch=0`) pour tester sur ordinateur. Jouer en paysage.
  Les textes qui citent des touches ont leur version tactile dans `TEXTS.touch.overrides` (à compléter
  quand on ajoute un tuto qui parle de touches). Réglages dans `TUNING.touch`.
- PWA : `src/pwa/` (manifeste, icônes, `sw.js` « réseau d'abord ») copié dans `dist/` par le build ; le nom du
  cache change à chaque build. Installation : « Ajouter à l'écran d'accueil » (iPhone) / « Installer » (Android).
  Anti-zoom iOS : `blockZoom()` dans `src/touch.js` + `text-size-adjust` + taille calée sur `visualViewport`.
- Manette : disposition « standard » (Xbox / PlayStation), mapping dans `core/Input.js`, réglages dans `TUNING.pad`.
  **Les textes n'écrivent jamais une touche** : ils écrivent l'action entre accolades (`{use} : pirater`),
  affichée selon l'appareil (`TEXTS.glyphs`). Tester sans manette : `?debug=1&fakepad=xbox` (ou `ps`),
  manette virtuelle au pavé numérique (`src/fakepad.js`, « / » débranche pour tester la pause automatique).
- Debug : ajouter `?debug=1` à l'URL (`dist/index.html?debug=1`) active les raccourcis de `src/debug.js` :
  **F2** salle suivante (points `warps` du layout ; le script répond à 'debug:warp' pour remettre la salle
  en état ; sans warps, téléporte devant le prochain terminal / interrupteur), **F3** élimine tous les ennemis. Ex. `dist/index.html?level=petite-france&debug=1`.

## 8. Méthode de travail
- On avance **un élément à la fois, validé par Maxime** (design, puis intégration, puis réglages).
- Chaque fonctionnalité arrive avec un moyen de la tester vite (raccourci debug, scène de test).
- Les prototypes existants (`game/` = beat'em up 2D, `proto3d/` = donjon de la cathédrale) servent de
  référence. Le nouveau jeu vit dans `src/`.
