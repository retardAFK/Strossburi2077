# Événements du bus (généré)

Fichier généré par `node tools/list-events.mjs` à partir des appels `emit(` / `on(` de `src/`.
**Ne pas éditer à la main** : relancer l'outil après avoir ajouté ou renommé un événement (le test `conventions` vérifie qu'il est à jour).
`<id>` = partie variable du nom (groupe d'énigme, identifiant de PNJ, de coffre, de levier…).
Certains noms viennent des **données** et n'apparaissent pas comme émis ici : le terminal émet le champ `event` de son layout (ex. `terminal:laser`).

| Événement | Émis par | Écouté par | Arguments (extrait de l'appel) |
|---|---|---|---|
| `arrow:effect` | `entities/props/arrowEffects.js` | — | `id, x, z, target \|\| null` |
| `arrow:hit` | `entities/props/Arrow.js` | — | `e, this` |
| `boat:arrived` | `entities/props/Barque.js` | — | `this.here.id` |
| `boat:blocked` | `entities/props/Barque.js` | `levels/petite-france/salle2.js` | `i + 1 < n ? 'pass' : 'end', this.here.id` |
| `boat:board` | `entities/props/Barque.js` | — | `this.here.id` |
| `boat:leave` | `entities/props/Barque.js` | `levels/petite-france/salle2.js` | `this.here.id` |
| `boss:defeated` | `entities/bosses/Directeur.js`<br>`entities/bosses/PhasedBoss.js` | `levels/meinau-ouest/script.js`<br>`levels/petite-france/salle5.js` | `this` |
| `boss:phase` | `entities/bosses/PhasedBoss.js` | `levels/petite-france/salle5.js` | `ph, this` |
| `chest:opened` | `entities/props/Coffre.js` | `levels/petite-france/salle3.js` | `this.id` |
| `chest:unlock:<id>` | `levels/petite-france/salle3.js` | `entities/props/Coffre.js` | — |
| `crate:opened` | `entities/props/CaisseFleches.js` | — | `this.arrow, this` |
| `debug:warp` | `debug.js` | `levels/bac-a-sable/script.js`<br>`levels/petite-france/salle1.js`<br>`levels/petite-france/salle2.js`<br>`levels/petite-france/salle3.js`<br>`levels/petite-france/salle5.js` | `w.id` |
| `enemy:killed` | `entities/bosses/PhasedBoss.js`<br>`entities/enemies/Enemy.js` | `Game.js` | `this` |
| `enemy:removed` | `entities/enemies/Enemy.js` | — | `this` |
| `game:start` | `Game.js` | `levels/bac-a-sable/script.js`<br>`levels/meinau-ouest/script.js`<br>`levels/petite-france/salle1.js` | — |
| `group:cleared:<id>` | `Game.js` | `Game.js` | — |
| `hit` | `entities/Entity.js`<br>`entities/props/Mannequin.js` | — | `this, from` |
| `hud:aim` | `items/ArcDrapeau.js` | `systems/Hud.js`<br>`touch.js` | `on` |
| `hud:caption` | `systems/Cutscene.js` | `systems/Hud.js` | `i >= 0 ? this.captions[i].txt : null`<br>`null` |
| `hud:cinema` | `Game.js` | `systems/Hud.js` | `false`<br>`true` |
| `hud:fade` | `levels/petite-france/salle5.js` | `systems/Hud.js` | `0`<br>`1` |
| `hud:glitch` | `levels/petite-france/salle5.js` | `systems/Hud.js` | `false`<br>`true` |
| `hud:prompt` | `systems/Interact.js` | `systems/Hud.js`<br>`touch.js` | `e, on ? text : null` |
| `input:device` | `systems/Prompts.js` | `systems/Hud.js`<br>`systems/Menus.js` | `d` |
| `input:notice` | `systems/Prompts.js` | `systems/Hud.js` | `this.notice ? this.game.texts.padUnknown : null` |
| `inventory:changed` | `systems/Inventory.js` | `systems/Hud.js`<br>`touch.js` | `this.equipped, this.order.length` |
| `lever:enable:<id>` | — | `entities/props/Lever.js` | — |
| `lever:used` | `entities/props/Lever.js` | `levels/petite-france/salle2.js` | `this.id, this.down` |
| `pf:boss` | `levels/petite-france/salle4.js` | `levels/petite-france/salle5.js` | — |
| `plaque:restored` | `entities/props/Plaque.js` | `levels/petite-france/script.js` | `this.id` |
| `player:respawn` | `entities/player/Ultra.js` | `entities/props/Barque.js`<br>`levels/meinau-ouest/script.js`<br>`levels/petite-france/salle5.js` | — |
| `pnj:hide:<id>` | `levels/petite-france/salle2.js`<br>`levels/petite-france/salle3.js` | `entities/props/Pnj.js` | — |
| `pnj:show:<id>` | `levels/petite-france/salle3.js` | `entities/props/Pnj.js` | — |
| `pnj:talk` | `entities/props/Pnj.js` | `levels/petite-france/salle2.js`<br>`levels/petite-france/salle3.js` | `this.id` |
| `progress:companions` | `systems/Progress.js` | — | `s.companions` |
| `puzzle:failed:<id>` | `systems/Puzzle.js` | `levels/petite-france/salle1.js`<br>`levels/petite-france/salle4.js` | — |
| `puzzle:progress:<id>` | `systems/Puzzle.js` | `levels/petite-france/salle1.js`<br>`levels/petite-france/salle4.js` | `this.i, this.order.length, this.left`<br>`this.lit.size, this.total, this.left` |
| `puzzle:solved:<id>` | `systems/Puzzle.js` | `levels/petite-france/salle1.js`<br>`levels/petite-france/salle4.js` | — |
| `sbire:alert` | `entities/enemies/Sbire.js` | — | `this` |
| `state:<id>` | `systems/Puzzle.js` | `levels/petite-france/salle2.js` | `v, old` |
| `switch:enable:<id>` | `levels/petite-france/salle1.js` | `entities/props/Borne.js` | — |
| `switch:lock:<id>` | `levels/petite-france/salle1.js`<br>`systems/Puzzle.js` | `entities/props/Borne.js` | — |
| `switch:on` | `entities/props/Borne.js` | `levels/petite-france/salle3.js`<br>`systems/Puzzle.js` | `this` |
| `switch:reset:<id>` | `systems/Puzzle.js` | `entities/props/Borne.js` | — |
| `target:hint:<id>` | `levels/petite-france/salle4.js` | `entities/props/Cible.js` | `ORDER[n] \|\| null` |
| `target:hit` | `entities/props/Cible.js` | `levels/bac-a-sable/script.js`<br>`systems/Puzzle.js` | `this` |
| `target:lock:<id>` | `systems/Puzzle.js` | `entities/props/Cible.js` | — |
| `target:reset:<id>` | `systems/Puzzle.js` | `entities/props/Cible.js` | — |
| `terminal:laser` | — | `levels/meinau-ouest/script.js` | — |
| `zone:<id>` | `Game.js` | — | — |
