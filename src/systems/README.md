# src/systems — règles de jeu génériques

Réutilisées par tous les niveaux. Dépendent de `core/` et de `data/`, jamais des entités ou des niveaux précis.

| Fichier | Rôle et API |
|---|---|
| `World.js` | Construit le décor depuis `layout.js` : sols (`sky`), murs, `blockers`, portes (`setDoor`), lasers, herses (`setGate`), eaux (`setWaterLevel`), props `.glb` (`setPropVisible`, `removeProp`), hologrammes, tables, blocs, écrans |
| `Textures.js` | Textures procédurales en pixels (`TEX.paves`, `gres`, `carrelage`, `eau`…), panneaux holo, silhouette |
| `Combat.js` | `swing(attaquant, {range, arc, dmg, knock, targets, hitSet})`, `blast(x, z, r, dmg, knock, cibles)` |
| `Interact.js` | `interact(e, texte, portée)` → true si E à portée (l'objet le plus proche a la main) ; `clearPrompt(e)` |
| `Puzzle.js` | `TimedSwitchGroup` (interrupteurs à minuterie), `OrderedSequence` (cibles dans l'ordre), `MultiState` (état à plusieurs niveaux) |
| `Inventory.js` | `give(objet)`, `has(id)`, `equipped`, changement d'objet ; clic droit / F → `use()` de l'objet équipé (interface `items/Weapon.js`) |
| `Dialog.js` | File de répliques à machine à écrire ; `game.say(lignes, suite)` ; les jetons `{use}`… sont remplacés |
| `Hud.js` | Vie, zone, barre de boss (`showBoss`, `setBoss`), bandeaux (`banner`), indication d'action, sous-titres, fondu, glitch |
| `Prompts.js` | Dernier appareil utilisé ; `format(texte, 'html' | 'text')` remplace `{action}` par une icône ou un libellé |
| `Menus.js` | Titre, pause, « passer », écran « Commandes » (deux colonnes clavier / manette) |
| `Cutscene.js` | Plans de caméra + sous-titres minutés ; lancé par `game.playCutscene(plans, sous-titres, suite)` |
| `Animator.js` | `pose(holder, {pivot: degrés})`, `walkPose`, `walkBob`, `tint` (télégraphie) |
| `Fx.js` / `Particles.js` | Réticule, ondes de choc, étoiles, bulles de texte ; `particles.burst(x, y, z, n, couleur, vitesse)` |

Événements émis / écoutés : voir `docs/EVENTS.md` (`hud:*`, `input:*`, `puzzle:*`, `switch:*`, `target:*`, `state:*`, `inventory:changed`).

## Ajouter une brique d'énigme générique
1. Dans `Puzzle.js` : une classe avec `removed = false` et `update(dt)`, qu'on ajoute avec `game.add(...)`.
2. Elle écoute des événements d'entités (`switch:on`, `target:hit`…) au lieu de garder des références directes.
3. Elle émet `puzzle:progress:<groupe>`, `puzzle:failed:<groupe>`, `puzzle:solved:<groupe>`.
4. Chiffres dans `data/tuning.js`, textes (bandeaux) dans `data/texts.fr.js`.
5. L'utiliser dans un `levels/<id>/salleN.js`, ajouter un test dans `tests/enigmes-*.test.mjs`, relancer `node tools/list-events.mjs`.
