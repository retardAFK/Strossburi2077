# src/levels — les niveaux (des données + des scripts)

`index.js` est le registre (+ `CAMPAIGN` : l'ordre de la partie 1, niveaux déjà inscrits) : pour chaque niveau, `layout`, `script`, `texts`, `subtitle`, `models` (les `.glb` à charger)
et `types` (les classes que layout et script peuvent créer). Le niveau est choisi par `?level=<id>` (défaut : `DEFAULT_LEVEL`).

| Dossier | Niveau |
|---|---|
| `petite-france/` | Niveau 1, Petite France (futur) : `layout.js` (données), `script.js` qui branche `salle1.js` … `salle5.js` |
| `meinau-abords/` | Niveau 2, la Meinau en 2026, abords du stade (maquette grise) : `layout.js` (zones ouvertes, bords fermés, entrées A/B/C), `script.js` (stewards du parvis → portique A, borne du parking → issue C, grille B fermée, PNJ) |
| `meinau/` | Niveau 3, la Meinau en 2026, intérieur du stade (maquette grise) : `arrivee.js` (entrée A/B/C de la sauvegarde, stewards, buvettes, verrous Arc-Drapeau), `local.js` (Arc-Drapeau, tuto de tir), `kop.js` (tifo, tribune ouest), `acces.js` (tifo + terminal → tunnel), `pelouse.js` (boss Egboehly) ; répliques dans `data/dialogues/meinau.fr.js` |
| `port-rhin/` | Niveau 3, le Port du Rhin en 2026 (maquette grise) : `quai.js` (agents, palissade), `moulin.js` (gaffe-grappin, bief, caisse), `conteneurs.js` (conteneur, grues au-dessus des péniches), `chantier.js` (boss le Promoteur) |
| `marche2000/` | Niveau 4, le Marché 2000 la nuit en 2026 (maquette grise) : `infiltration.js` (« repéré ! » → retour au début de la salle), `arriere.js` (vigiles à lampe, néons à casser, fumigènes), `rayons.js` (chariots-robots, caméras-scanners, palettes), `reserve.js` (planque de SCN, 2 vagues), `toit.js` (enseigne « MARCHÉ 2000 » → Stork), `magasin.js` (boss le Gérant de nuit), `marchenoir.js` (passage optionnel derrière la porte violette) |
| `kalt/` | Niveau 5, le Kalt la nuit en 2026 (maquette grise) : `file.js` (robots-cordons à tirer au grappin, physios), `cour.js` (combat, porte du hangar), `salle.js` (rythme + lumières : portiques ouverts sur les basses, physios visibles aux flashs, projecteur VIP à la flèche court-circuit), `cave.js` (Dylagne libéré, il tient le rythme ; grosse caisse devant le rideau), `piste.js` (boss le Magnat du Carré VIP) |
| `kleber/` | Niveau 6, la place Kléber la nuit en 2026, fin de la partie 1 (maquette grise) : `peages.js` (borne du péage à pirater ; Stork et Dylagne rejoignent l'Ultra), `chalets.js` (labyrinthe : 3 tampons officiels, flèche enflammée, neige payante, étal au grappin, horloge de la signature), `sapin.js` (3 verrous : Stork, Dylagne, court-circuit), `estrade.js` (boss Marco CeKlair, faux final, paradoxe, « À suivre ») |
| `meinau-ouest/` | Prototype : tribune ouest de la Meinau (futur), boss Directeur ; recyclé plus tard dans le final (`docs/decisions.md`) |
| `bac-a-sable/` | Salle grise de réglage (`?level=bac-a-sable&debug=1`) : cibles, mannequins, fossé, grille, mur haut ; donne le bretzel et l'arc |

**`layout.js` = DONNÉES uniquement** : `zones` (rect + `cam`), `floors`, `walls`, `blockers`, `doors`, `gates`, `waters`,
`switches`, `plaques`, `objects: [{ type, ... }]`, `props` (`.glb`), `ads`, `neons`, `lights`, `opening` (cinématique),
`warps` (points de passage de F2 en debug). Rectangles `[x0, x1, zHaut, zBas]` ; z négatif = vers le fond.

**`salleN.js`** : événements scénarisés, avec l'API de `Game` : `trigger(rect, fn)`, `spawn(type, x, z, groupe, {face})`,
`onGroupCleared(groupe, fn)`, `say(lignes, suite)`, `setCheckpoint(x, z, face)`, `playCutscene(...)`, `win(texte)`,
et le bus (`E.on('puzzle:solved:<g>', …)`). Chaque salle répond aussi à `debug:warp` pour se remettre en état.

## Ajouter un niveau
1. Fiche du lieu validée dans `docs/designs/niveau-<id>.md` (sinon on ne commence pas).
2. `levels/<id>/layout.js` + `script.js` (+ un `salleN.js` par salle), maquette grise d'abord, `warps` pour F2.
3. L'inscrire dans `levels/index.js` (`models`, `types`, `texts`) sans toucher au moteur.
4. Textes dans `data/texts.fr.js` (ou brouillons de dialogues, voir le prompt 05), réglages dans `data/tuning.js`.
5. Tests : parcours du niveau (modèle : `tests/niveau1.test.mjs`) et un test par boss.
