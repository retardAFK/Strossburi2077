# src/entities — tout ce qui vit dans le monde

Une entité = un fichier, construite sur `Entity.js` (position `x, z, y`, orientation `face`, vie, recul, collisions,
**machine à états explicite** : `this.states = { nom: { enter, update, exit } }`, `setState(nom)`).

| Dossier | Contenu |
|---|---|
| `player/Ultra.js` | Le héros : écharpe (combo 3 coups), roulade, verrouillage. **Ne pas modifier son design.** |
| `enemies/` | `Enemy.js` (base : agro, mort, répliques `bark`), Consultant, Juriste, Serveur, Sommelier, VideurMaitreHotel |
| `bosses/` | `PhasedBoss.js` (générique : phases par PV, `react(côté, source)` → `block` / `weak` / `hit`), `Asr67.js`, `Directeur.js` |
| `props/` | Objets génériques : Terminal, Borne, Cible, Lever, Coffre, Plaque, Pnj, Barque, Projectile, Contrat, Arrow (flèche de l'arc), Hazard, Flames, Pickup, Mannequin (bac à sable, placeholder gris) |

Drapeaux utiles : `isEnemy`, `isBoss`, `isMiniBoss`, `isSwitch`, `isTarget`, `isTerminal`, `isPlaque`, `isChest`,
`isBoat`, `isProjectile`, `isPlayerShot` (bretzel, flèche), `isHazard`, `lockable` (verrouillable par l'arc). Une entité morte a `alive = false` ; retirée, `removed = true`.

Règles : chiffres dans `TUNING.<entité>`, répliques dans `texts.fr.js` (`barks.<type>`), aléatoire via `core/Random.js`
(`rng()`, sauf effets visuels), communication par le bus (`game.events.emit`), jamais de référence directe à un niveau.

## Ajouter un ennemi
1. `enemies/<Nom>.js` qui étend `Enemy` ; états `wait / chase / windup / attack / hurt / die` (`Enemy.dieState(couleur)`).
2. Réglages dans `TUNING.<nom>`, répliques dans `TEXTS.barks.<nom>`.
3. Le modèle `.glb` (fiche validée dans `docs/designs/`, sinon placeholder gris) dans le registre du niveau (`levels/index.js` : `models` + `types`).
4. Le faire apparaître depuis un script : `game.spawn('<type>', x, z, groupe, { face })`.
5. Un test qui le fait apparaître et vérifie son comportement principal ; un boss a son `tests/boss-<nom>.test.mjs` + instantané.
