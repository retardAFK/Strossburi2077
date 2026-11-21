# src/data — tous les textes et tous les chiffres

| Fichier | Contenu |
|---|---|
| `texts.fr.js` | **Tous** les textes du jeu, en français : titres, contrôles, indications, répliques, plaques historiques, noms de zones, panneaux. `TEXTS.<niveau>` pour un niveau (ex. `TEXTS.pf`). Année du futur dans la seule constante `YEAR`. |
| `tuning.js` | **Tous** les réglages chiffrés : vitesses, PV, dégâts, timings, portées, couleurs de gameplay. `TUNING.<entité ou système>`. |
| `dialogues/` | **Nouveaux** dialogues, un fichier par niveau (`<niveau>.fr.js`) : `{ id, who, txt, status: 'draft' \| 'ok', note? }`, registre `index.js` (`line(id)`, `drafts()`). En jeu : `game.dialog.sayIds([...])` ; badge BROUILLON avec `?debug=1`. |
| `arrows.js` | Types de flèches de l'Arc-Drapeau (données) : 4 spéciales à terme, désactivées tant que leurs effets ne sont pas codés ; la flèche tag est retirée. |

Règles (`CLAUDE.md` §3 et §5) :
- Jamais de texte ni de chiffre en dur dans le code.
- Aucune touche en dur dans les textes : jetons d'actions `{use}`, `{attack}`, `{throw}`… (remplacés par `systems/Prompts.js`).
  Paramètres autorisés en plus : `{t}` (chrono), `{state}` (vibrations), `{share}` (icône Partager, écran d'installation).
- Satire de types, jamais de vraies personnes (exception documentée pour les noms parodiques de `CLAUDE.md` §3).
- Textes historiques exacts, sourcés et relus par Maxime.
- Changer `TUNING.asr` fait échouer `tests/boss-asr67` tant qu'on n'a pas lancé `npm run test:update-snapshots` (volontaire).

## Écrire un nouveau dialogue (brouillon)
1. Ajouter les répliques dans `dialogues/<niveau>.fr.js` avec `status: 'draft'` (jamais `ok` : seul Maxime valide).
2. Les jouer depuis un script : `game.dialog.sayIds(['<niveau>.scene.1', ...], suite)`.
3. `node tools/dialogues-export.mjs` → `docs/dialogues/<niveau>.md`, que Maxime annote (statut, remarque, corrections).
4. `node tools/dialogues-import.mjs` applique sa relecture au `.js`.
5. `npm test` (le test `dialogues` vérifie ids, statuts, jetons et que `docs/dialogues` est à jour).

## Ajouter un texte ou un réglage
1. Trouver le bon bloc (`TEXTS.pf`, `TEXTS.prompts`, `TUNING.<entité>`…) ou en créer un, nommé comme l'entité.
2. Écrire le texte en français, avec des jetons `{action}` pour les touches.
3. Le lire dans le code via `game.texts` / `game.levelTexts` / `TUNING`, jamais en copiant la valeur.
4. Pour une année : utiliser `YEAR`, jamais « 2067 ».
5. Lancer `npm test` (le test `contenu` vérifie jetons, glyphes et années).
