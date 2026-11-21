# Tâche : la suite après la démo (socle anti-régression, armes, compagnons, niveaux 2026/2067)

Lis d'abord `CLAUDE.md`, `TODO.md` et ce fichier en entier. Ce prompt couvre **plusieurs étapes**.
**Une étape = une branche = une PR**, dans l'ordre. Tu ne passes à l'étape suivante qu'après le « merge ? »
validé par Maxime.

Backlog visuel (référence humaine) : https://claude.ai/artifact/Ln1eB2PycDFCTnidzagTZm

---

## 0. Les 5 règles de cette tâche (elles priment sur tout le reste)

1. **Zéro régression.** Le niveau 1 (Petite France) et son boss ASR-67 doivent marcher exactement comme
   aujourd'hui. Avant de toucher au gameplay, on pose des tests (étape A). Ensuite, **chaque PR garde
   `npm test` vert**. Une PR qui touche `entities/bosses/` met à jour ou ajoute le test de ce boss.
2. **Les designs se font ailleurs.** Tu n'inventes **aucun design** (boss, ennemi, compagnon, arme,
   lieu, interface) : Maxime les valide avec Claude dans Cowork et les dépose dans `docs/designs/`
   (protocole 🎨, section 1). En attendant, **placeholders gris** clairement marqués.
3. **Chaque dialogue se discute.** Tu écris des **brouillons** ; seul Maxime les passe en « validé »
   (section 2). Aucune réplique nouvelle n'est considérée comme finale sans lui.
4. **Lisible par n'importe quel LLM.** Architecture de `CLAUDE.md` §5 respectée à la lettre, fichiers
   < 250 lignes, en-tête de rôle en haut de chaque fichier, README par dossier (étape B).
5. **Une seule chose à la fois.** Si une décision manque (voir section 6), tu **t'arrêtes et tu poses la
   question** au lieu de choisir à la place de Maxime. Tu peux proposer 2-3 options, marquées
   « proposition ».

Ne touche ni au serveur, ni aux secrets, ni à `deploy/`. `.github/workflows/deploy.yml` : uniquement
l'ajout de l'étape de tests (étape A), diff montré à Maxime avant commit. Aucune nouvelle dépendance sans
son accord.

---

## 1. 🎨 Protocole design (à appliquer à CHAQUE nouveau design)

**Les designs ne se font PAS dans Claude Code.** Maxime les travaille à part, avec Claude (Cowork).
Quand une étape contient le marqueur **🎨 STOP** :

1. Tu regardes si une fiche validée existe dans `docs/designs/<nom>.md` (statut `validé`).
2. **Si oui** : tu intègres en suivant la fiche à la lettre (silhouette, couleurs, pivots, script Blender
   éventuel fourni `tools/blender/<nom>.py`, planche de référence `docs/designs/<nom>.png`). Tu n'ajoutes
   rien qui n'y est pas ; si un détail manque pour coder, tu demandes.
3. **Si non** : tu ne crées aucun design. Tu poses un **placeholder** (capsule ou boîte grise + étiquette
   flottante « PLACEHOLDER <nom> », dimensions et pivots standards) et tu continues le gameplay autour.
   Dans ton résumé de PR, tu listes : « Designs attendus de Cowork : <nom> (taille, pivots, contraintes
   de gameplay utiles au design) ».
4. Tu notes dans `docs/decisions.md` ce qui a été intégré (date, élément, fiche utilisée).

Tu peux décrire les **contraintes techniques** utiles au design (hauteur max, hitbox, pivots, nombre de
polygones), jamais proposer d'apparence.

Rappel `CLAUDE.md` §3 : noms parodiques uniquement. Les personnages inspirés de figures connues
(ex. « Egboehly », « Marco CeKlair ») sont des **caricatures de types** (le multipropriétaire, le patron
qui vend le club) : traits inventés, aucune citation ni fait attribué à une vraie personne.

---

## 2. 💬 Protocole dialogues

- Les **nouveaux** dialogues vont dans `src/data/dialogues/<niveau>.fr.js`, une réplique =
  `{ id, who, txt, status: 'draft' | 'ok', note? }`. Les textes existants de `texts.fr.js` sont considérés
  `ok` (déjà validés pendant la démo) : ne les migre pas, ne les réécris pas.
- `tools/dialogues-export.mjs` génère `docs/dialogues/<niveau>.md` : un tableau
  `id | qui | réplique | statut | remarque de Maxime` que Maxime peut annoter directement.
- `tools/dialogues-import.mjs` relit ce `.md` et applique ses remarques / statuts dans le `.js`.
- En jeu avec `?debug=1`, une réplique `draft` s'affiche avec un petit badge « BROUILLON ».
- Test `tests/dialogues.test.mjs` : tous les `id` référencés par les scripts existent ; le build signale
  (sans échouer) la liste des brouillons restants.
- Ton : satire du consortium, jamais de l'Alsace ni des gens ; la winstubière est une alliée ; les jetons
  `{use}`, `{attack}`… pour toute touche.

---

## Étape A — Filet anti-régression (branche `feat/tests-regression`)

Objectif : pouvoir modifier le jeu sans casser le niveau 1 ni l'ASR-67.

1. **Dépendance** : `playwright-core` est attendu par `npm run test:pad` mais n'est pas dans
   `package.json`. Demande à Maxime : « j'installe `playwright-core` en dev ? » avant `npm i -D playwright-core`.
2. **Aléatoire maîtrisé** : crée `src/core/Random.js` (générateur à graine, ex. mulberry32) et remplace
   `Math.random()` **dans la logique de jeu** (IA, attaques, apparitions) par ce générateur. Les particules
   peuvent garder `Math.random()`. Graine fixée par `?seed=<n>`. Aucun changement de comportement visible.
3. **Helpers partagés** : `tests/helpers.mjs` (lancement Chrome, manette simulée, `state()`, `skipDialogs()`,
   `warp()`) extraits de `tests/manette.test.mjs`, qui les réutilise ensuite.
4. **`tests/niveau1.test.mjs`** : de l'ouverture au cliffhanger via les `warps` (F2) : chaque salle se charge,
   aucune erreur de page, les 4 plaques sont comptées, le coffre donne le bretzel-boomerang, la fin affiche
   « À suivre ».
5. **`tests/boss-asr67.test.mjs`** (avec `?seed=1`) :
   - coup de face → bloqué (toque) ; TPE dans le dos touché au bretzel → étourdi ; écharpe pendant
     l'étourdissement → dégâts ;
   - passage en phase 2 puis 3 aux seuils de `TUNING.asr.phases` (événement `boss:phase`) ;
   - phase 2 : 2 serveurs en renfort ; charge contre un pilier-fourneau → `stunned` ;
   - défaite → `boss:defeated` → cinématique SCN → « Strasbourg, 2026 ».
   - **Instantané** des réglages : `tests/snapshots/asr67.json` (PV, seuils, dégâts, timings). Le test échoue
     si `TUNING.asr` change sans mise à jour volontaire de l'instantané (`npm run test:update-snapshots`).
6. **`tests/meinau-ouest.test.mjs`** : test fumée du niveau `meinau-ouest` (chargement, boss Directeur présent).
7. `package.json` : `"test": "npm run build && node tests/run-all.mjs"` (lance tous les `tests/*.test.mjs`).
8. **CI** : dans `deploy.yml`, job `build`, ajouter `npm test` après `npm run build` (Chrome est présent sur
   `ubuntu-latest`). Montre le diff à Maxime avant de committer. Résultat : **pas de déploiement si un test échoue**.

Livraison : résumé des tests, temps d'exécution, ce qui n'est pas couvert.

---

## Étape B — Lisible par n'importe quel LLM (branche `docs/llm-lisible`)

1. **`AGENTS.md`** à la racine : 30 lignes max pour les IA autres que Claude (renvoie vers `CLAUDE.md`,
   commandes `build` / `test`, règles 1 à 5 de ce prompt).
2. **Un `README.md` par dossier** de `src/` (`core`, `systems`, `entities`, `items`, `levels`, `data`) :
   rôle, fichiers, API publique, événements émis/écoutés, « comment ajouter un X » en 5 étapes.
3. **`docs/EVENTS.md`** généré par `tools/list-events.mjs` (scanne `emit(` / `on(`) : nom, émetteur, écouteurs,
   arguments. Test : la doc est à jour.
4. Test `tests/conventions.test.mjs` : chaque fichier de `src/` commence par un commentaire de rôle, et
   signale (sans échouer) ceux qui dépassent 250 lignes.
5. **`README.md` racine** : il décrit encore le vieux POC 2D (2077). Propose à Maxime une nouvelle version
   (Stras 2067, comment lancer, comment tester) et attends son accord avant de remplacer.
6. **`docs/decisions.md`** : journal des décisions (voir section 6 pour l'état initial).

---

## Étape C — Dialogues en brouillon (branche `feat/dialogues-brouillons`)

Implémente la section 2 (format, export/import `.md`, badge debug, test). Ajoute un exemple : 3 répliques
`draft` de test dans `src/data/dialogues/bac-a-sable.fr.js`. Aucune réplique de vrai niveau n'est écrite à
cette étape.

---

## Étape D — Bac à sable de test (branche `feat/bac-a-sable`) · ✅ fait avec l'étape E (21/11/2026)

Un niveau `levels/bac-a-sable/` (accessible seulement avec `?level=bac-a-sable&debug=1`) : une salle grise
avec cibles, mannequins, un fossé, une grille, un mur haut. Il sert à tester armes et compagnons sans
toucher aux vrais niveaux. Inscrit dans `levels/index.js` sans changer `DEFAULT_LEVEL`.

---

## Étape E — Sélecteur d'armes + Arc-Drapeau (branche `feat/arc-drapeau`) · ✅ fait (21/11/2026, flèche simple)

Contexte (idées de Maxime) : l'Arc-Drapeau est gagné à la Meinau 2026 (hampe de drapeau du kop + corde
d'écharpe), « bien valider le gameplay ensemble », « touche pour changer d'arme », « voir pour munitions
de l'arc », flèche enflammée ajoutée, flèche fumigène « ok ».

1. **🎨 STOP gameplay** : avant de coder, pose à Maxime les questions de gameplay : visée (libre / verrouillée
   / les deux), tir chargé ou non, portée, cadence, munitions (nombre, où on en trouve, recharge), l'arc
   se tient-il en courant ? Propose 2 options chiffrées. Attends.
2. **Mapping** : propose un tableau pour la nouvelle action abstraite `switch` (changer d'arme) au clavier,
   à la souris (molette ?) et à la manette standard, **après avoir vérifié dans `core/Input.js` les touches
   libres** (attention : ZQSD sert au déplacement). Attends la validation.
3. **Technique** (après validation) :
   - `items/Weapon.js` : interface commune (`equip`, `unequip`, `use`, `hudIcon`) ; `BretzelBoomerang` l'implémente
     **sans changer son comportement** (le test ASR-67 doit rester vert).
   - `items/ArcDrapeau.js` + `entities/props/Arrow.js` ; types de flèches en données dans `src/data/arrows.js`
     (bannière, fumigène, enflammée, tag, court-circuit). **Seule la flèche simple est jouable** tant que la
     liste finale n'est pas tranchée (section 6) ; les autres existent en données, désactivées.
   - Munitions dans `tuning.js`, compteur dans le HUD, indications par jetons (`{switch}`, `{aim}`…) dans
     `texts.fr.js` et glyphes dans `Prompts.js`.
4. **🎨 STOP design** : Arc-Drapeau, fiche `docs/designs/arc-drapeau.md` (section 1). Placeholder en attendant.
5. Tests : changement d'arme clavier + manette Xbox + PlayStation, tir sur cible du bac à sable, munitions,
   et `boss-asr67` toujours vert.

---

## Étape F — Compagnons invocables : Stork et Dylagne (branche `feat/compagnons`)

Idée de Maxime : des compagnons invocables, **Stork** (cigogne) et **Dylagne** (ragondin).

1. **🎨 STOP rôles** : demande à Maxime ce que fait chacun, où on les obtient, et comment on les invoque
   (jauge, temps de recharge, ou seulement à des endroits précis). Pistes à proposer, marquées
   « proposition » : Stork = éclaireuse aérienne (révèle un chemin, porte un objet au-dessus d'un obstacle) ;
   Dylagne = passe sous l'eau, ronge grilles et câbles. Attends.
2. **Technique** (après validation, système **générique**) :
   - `systems/Companions.js` (invocation, durée, recharge, un seul compagnon à la fois sauf décision contraire) ;
   - `entities/companions/Companion.js` : machine à états `summon → follow → act → leave` ;
   - `entities/companions/Stork.js`, `Dylagne.js` ; réglages dans `tuning.js` ; données dans `src/data/companions.js`
     (ajouter un compagnon = un fichier + une entrée) ;
   - action abstraite `summon` (mapping proposé puis validé, comme à l'étape E) ; icône + recharge dans le HUD ;
   - événements `companion:summoned`, `companion:act`, `companion:left`.
3. **🎨 STOP design** : fiches `docs/designs/stork.md` et `dylagne.md` (section 1). Placeholders en attendant.
4. **💬** Brouillons de leurs répliques / cris (ils parlent ? alsacien ? muets ?) → protocole section 2.
5. Tests dans le bac à sable : invocation clavier/manette, Stork passe le mur haut, Dylagne ouvre la grille
   du fossé, recharge respectée ; `boss-asr67` toujours vert.

---

## Étape G et suivantes — Les niveaux (une branche par niveau)

**Uniquement après les décisions de la section 6.** Même recette pour chaque niveau :

1. **🎨 STOP lieu** : le déroulé salle par salle et l'ambiance viennent de la fiche `docs/designs/niveau-<id>.md`
   (faite dans Cowork). Sans fiche validée, tu ne commences pas le niveau.
2. **Maquette grise** (`layout.js` sans modèles, boîtes grises) jouable avec `?level=<id>&debug=1` + warps.
   Maxime teste. Attends.
3. **🎨 STOP designs** : ennemis, boss, décor, objet gagné : fiches `docs/designs/` (section 1), placeholders sinon.
4. Intégration des modèles, puis `script.js` (un fichier par salle comme la Petite France).
5. **💬** Dialogues en brouillon → validation de Maxime.
6. **Test du boss** (`tests/boss-<nom>.test.mjs`, même modèle que l'ASR-67) + test de parcours du niveau.
7. Faits historiques affichés : exacts, sourcés, relus par Maxime (`CLAUDE.md` §3).

Ordre **tranché le 21/11/2026 : 11 niveaux, voir `docs/decisions.md`** (fait foi). Tableau d'origine, pour les idées :

| Sprint | Niveau | Époque | Énigme / mécanique | Boss | Idées de Maxime à respecter |
|---|---|---|---|---|---|
| S2 | La Meinau | 2026 | Tifo : flèches-bannières sur crochets, dans le bon ordre | Egboehly, hydre mécanique à têtes de clubs ; un drapeau planté empêche une tête de repousser | « à décider des énigmes », « nom : Egboehly design à valider ensemble » |
| S3 | Port du Rhin | 2026 | Gaffe-grappin entre péniches et grues, conteneurs | Le Promoteur et sa grue (appartements préfabriqués renvoyés au grappin) | — |
| S4 | **Marché 2000**, Porte de l'Hôpital, la nuit | 2026 | à imaginer ensemble | à imaginer ensemble | « la nuit est un repère mal famé » |
| S4 | **Le Kalt**, boîte de nuit | 2026 | à imaginer ensemble (proposition : mécanique au rythme de la musique) | à imaginer ensemble | — |
| S5 | Place Kléber | 2026 | 3 tampons officiels dans un labyrinthe de chalets | Marco CeKlair, PDG en Père Noël (traîneau de drones, cadeaux piégés), puis faux final | « flèche enflammée », phrase à clarifier (section 6) |
| S6 | Petite France v2 | 2067 | Infiltration aux flèches fumigènes, cache de Celle du stade | ASR-67 Premium+, puis **Al2 Prout**, androïde de surveillance des « consommateurs fidèles » | « Al2 Prout design à définir ensemble » ; ⚠️ ne pas casser l'ASR-67 du niveau 1 : Premium+ = **nouvelle classe** qui hérite, pas une modification d'`Asr67.js` |
| S6 | Port du Rhin | 2067 | Tour de verre : ascenseurs, reflets, court-circuit | La Tour (immeuble du Promoteur devenu IA) | Objet : **tambour**, « mettre une énigme en lien avec le son » |
| S7 | La Cathédrale | 2067 | Horloge astronomique : cadrans dans l'ordre | Le Coq de l'horloge version BlingCo (réutiliser `proto3d/` ?) | — |
| S7 | Place Kléber | 2067 | Grande bataille, rallier les foules | Le Conseil d'administration (5 hologrammes qui votent) | « Mégaphone oui » |
| S8 | La Meinau (final) | 2067 | Toutes les mécaniques | Le PDG de BlingCo, forme finale | « les kops de 2026 et 2067 chantent ensemble » |

Question à poser au premier niveau Meinau : que devient le niveau existant `meinau-ouest` (tribune ouest
en 2067, boss Directeur) ? Morceau du final, bonus, ou abandonné ?

---

## 6. Décisions

**Tranchées le 21/11/2026** (détail et valeurs de départ dans `docs/decisions.md`, qui fait foi) : visée de l'arc,
tir, munitions, mouvement, 4 flèches (tag retirée), mapping `switch` / `arrow` / `aim`, mégaphone = capacité du
final, compagnons (obtention, recharge, un seul à la fois, un bouton chacun), 11 niveaux et leur ordre,
`meinau-ouest` recyclé dans le final. Les 🎨 STOP gameplay / rôles des étapes E et F sont donc levés ;
le STOP mapping reste : vérifier les touches libres dans `core/Input.js` avant de coder.

Encore ouvertes (ne les tranche pas toi-même, liste tenue dans `docs/decisions.md`) :

- Retour vers le futur : A (BlingCo arrache l'Ultra via le Serveur), B (paradoxe + rappel par SCN), ou A+B.
- Phrase de Maxime à faire reformuler (slogan de Marco CeKlair) : « il repère guy ouvre la porte et le club de demain
  avec les consommateurs d'aujourd'hui ».
- Les questions boss restantes du fichier `Stras2067_reponses_niveaux.xlsx` (onglet « Questions boss »).

---

## Livraison (pour chaque étape)

Branche dédiée, `npm run build`, `npm test` vert, résumé court en français (ce qui change, comment tester
avec `?debug=1`, ce que Maxime doit vérifier à la main, décisions prises / encore ouvertes), commit, PR,
CI verte, puis demande « merge ? ». Si un 🎨 STOP ou une décision ouverte bloque : tu t'arrêtes, tu poses
tes questions, et tu reprends après sa réponse.
