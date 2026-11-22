# src/entities — tout ce qui vit dans le monde

Une entité = un fichier, construite sur `Entity.js` (position `x, z, y`, orientation `face`, vie, recul, collisions,
**machine à états explicite** : `this.states = { nom: { enter, update, exit } }`, `setState(nom)`).

| Dossier | Contenu |
|---|---|
| `player/Ultra.js` | Le héros : écharpe (combo 3 coups), roulade, verrouillage. **Ne pas modifier son design.** |
| `enemies/` | `Enemy.js` (base : agro, mort, répliques `bark`), **`Sbire.js`** (kit générique : patrouille, alerte, poursuite, attaque télégraphiée en charge ou en tir, `stun()`, `blind()`, mort ; `TUNING.sbires[kind]` ; placeholder si pas de modèle), Consultant, Juriste, Serveur, Sommelier, VideurMaitreHotel, **StewardRobot** (Sbire de la Meinau : balayage du scanner, s'aveugle en scannant), **AgentImmo** (Sbire du Port du Rhin : plante des pancartes VENDU), **Guetteur** (Sbire à faisceau visible ; en mode `stealth`, s'il voit l'Ultra → 'stealth:caught'), **VigileNuit** et **ChariotRobot** (Guetteurs du Marché 2000) |
| `bosses/` | `PhasedBoss.js` (générique : phases par PV, `react(côté, source)` → `block` / `weak` / `hit`), `Asr67.js`, `Directeur.js`, `Egboehly.js` + `HydraHead.js` (hydre à 5 têtes : assommer, planter une bannière ; loge exposée ensuite), `Promoteur.js` (largue des préfabriqués, qu'on lui renvoie au grappin), `GerantNuit.js` (étiquettes x10, scanner, tiroir-caisse ouvert = point faible, piqué de Stork) |
| `props/` | Objets génériques : Terminal, Borne, Cible, Lever, Coffre, Plaque, Pnj, Barque, Projectile, Contrat, Arrow (flèche de l'arc) + `arrowEffects.js` (bannière → `hook()`, fumigène → Smoke, court-circuit → `onShort()`, enflammée → `onFire()`), Smoke, CaisseFleches, Hazard, Flames, Pickup, Mannequin (bac à sable, placeholder gris), Figurant (PNJ placeholder : parle, chante, caché jusqu'à `pnj:show:<id>`), Crochet (bannière de tifo), EcranGeant (pubs + séquence de couleurs piratée), TifoGeant (bâche qui se déroule), Anneau (le grappin y tire l'Ultra), Tractable (conteneur / caisse qu'on tire au grappin), Pancarte (VENDU), Prefab (préfabriqué du Promoteur), NeonCour (lumière de cour à casser), CameraScanner (guetteur fixe), LettreNeon (lettre d'enseigne, cible d'OrderedSequence), StorkAllie (Stork version événement : nid → suit l'Ultra → piqué proposé par le niveau) |

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
