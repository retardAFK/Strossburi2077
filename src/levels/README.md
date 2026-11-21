# src/levels — les niveaux (des données + des scripts)

`index.js` est le registre (+ `CAMPAIGN` : l'ordre de la partie 1, niveaux déjà inscrits) : pour chaque niveau, `layout`, `script`, `texts`, `subtitle`, `models` (les `.glb` à charger)
et `types` (les classes que layout et script peuvent créer). Le niveau est choisi par `?level=<id>` (défaut : `DEFAULT_LEVEL`).

| Dossier | Niveau |
|---|---|
| `petite-france/` | Niveau 1, Petite France (futur) : `layout.js` (données), `script.js` qui branche `salle1.js` … `salle5.js` |
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
