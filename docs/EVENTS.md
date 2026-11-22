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
| `boss:defeated` | `entities/bosses/Directeur.js`<br>`entities/bosses/Egboehly.js`<br>`entities/bosses/GerantNuit.js`<br>`entities/bosses/PhasedBoss.js`<br>`entities/bosses/Promoteur.js` | `levels/marche2000/magasin.js`<br>`levels/meinau-ouest/script.js`<br>`levels/meinau/pelouse.js`<br>`levels/petite-france/salle5.js`<br>`levels/port-rhin/chantier.js` | `this` |
| `boss:phase` | `entities/bosses/Egboehly.js`<br>`entities/bosses/GerantNuit.js`<br>`entities/bosses/PhasedBoss.js`<br>`entities/bosses/Promoteur.js` | `levels/marche2000/magasin.js`<br>`levels/meinau/pelouse.js`<br>`levels/petite-france/salle5.js`<br>`levels/port-rhin/chantier.js` | `1, this`<br>`ph, this` |
| `chest:opened` | `entities/props/Coffre.js` | `levels/petite-france/salle3.js` | `this.id` |
| `chest:unlock:<id>` | `levels/petite-france/salle3.js` | `entities/props/Coffre.js` | — |
| `crate:opened` | `entities/props/CaisseFleches.js` | `levels/marche2000/arriere.js` | `this.arrow, this` |
| `debug:warp` | `debug.js` | `levels/bac-a-sable/script.js`<br>`levels/marche2000/arriere.js`<br>`levels/marche2000/magasin.js`<br>`levels/marche2000/marchenoir.js`<br>`levels/marche2000/rayons.js`<br>`levels/marche2000/reserve.js`<br>`levels/marche2000/toit.js`<br>`levels/meinau/kop.js`<br>`levels/meinau/local.js`<br>`levels/meinau/parvis.js`<br>`levels/meinau/pelouse.js`<br>`levels/petite-france/salle1.js`<br>`levels/petite-france/salle2.js`<br>`levels/petite-france/salle3.js`<br>`levels/petite-france/salle5.js`<br>`levels/port-rhin/chantier.js`<br>`levels/port-rhin/conteneurs.js`<br>`levels/port-rhin/moulin.js`<br>`levels/port-rhin/quai.js` | `w.id` |
| `egboehly:head` | `entities/bosses/HydraHead.js` | `entities/bosses/Egboehly.js`<br>`levels/meinau/pelouse.js` | `this.index, 'down'`<br>`this.index, 'planted'`<br>`this.index, 'up'` |
| `enemy:killed` | `entities/bosses/PhasedBoss.js`<br>`entities/enemies/Enemy.js` | `Game.js` | `this` |
| `enemy:removed` | `entities/enemies/Enemy.js` | — | `this` |
| `gaffe:hook` | `items/GaffeGrappin.js` | — | `e` |
| `gaffe:land` | `items/GaffeGrappin.js` | `levels/port-rhin/conteneurs.js`<br>`levels/port-rhin/moulin.js` | `a` |
| `gaffe:zip` | `items/GaffeGrappin.js` | — | `a` |
| `game:start` | `Game.js` | `levels/bac-a-sable/script.js`<br>`levels/marche2000/arriere.js`<br>`levels/marche2000/marchenoir.js`<br>`levels/meinau-ouest/script.js`<br>`levels/meinau/parvis.js`<br>`levels/petite-france/salle1.js`<br>`levels/port-rhin/quai.js` | — |
| `gerant:close` | `entities/bosses/GerantNuit.js` | `levels/marche2000/magasin.js` | `this` |
| `gerant:open` | `entities/bosses/GerantNuit.js` | `levels/marche2000/magasin.js` | `this` |
| `group:cleared:<id>` | `Game.js` | `Game.js` | — |
| `hit` | `entities/Entity.js`<br>`entities/props/Mannequin.js` | `entities/enemies/AgentImmo.js`<br>`entities/enemies/Guetteur.js` | `this, from` |
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
| `m2k:rayons` | `levels/marche2000/arriere.js`<br>`levels/marche2000/marchenoir.js` | `levels/marche2000/rayons.js` | — |
| `m2k:reserve` | `levels/marche2000/rayons.js` | `levels/marche2000/reserve.js` | — |
| `neon:off` | `entities/props/NeonCour.js` | `levels/marche2000/arriere.js` | `this` |
| `pf:boss` | `levels/petite-france/salle4.js` | `levels/petite-france/salle5.js` | — |
| `plaque:restored` | `entities/props/Plaque.js` | `levels/petite-france/script.js` | `this.id` |
| `player:respawn` | `entities/player/Ultra.js` | `entities/props/Barque.js`<br>`levels/marche2000/magasin.js`<br>`levels/meinau-ouest/script.js`<br>`levels/meinau/pelouse.js`<br>`levels/petite-france/salle5.js`<br>`levels/port-rhin/chantier.js` | — |
| `pnj:hide:<id>` | `levels/meinau/parvis.js`<br>`levels/petite-france/salle2.js`<br>`levels/petite-france/salle3.js` | `entities/props/Figurant.js`<br>`entities/props/Pnj.js` | — |
| `pnj:show:<id>` | `levels/marche2000/reserve.js`<br>`levels/meinau/kop.js`<br>`levels/meinau/local.js`<br>`levels/petite-france/salle3.js` | `entities/props/Figurant.js`<br>`entities/props/Pnj.js` | — |
| `pnj:talk` | `entities/props/Figurant.js`<br>`entities/props/Pnj.js` | `levels/marche2000/rayons.js`<br>`levels/marche2000/reserve.js`<br>`levels/meinau/local.js`<br>`levels/petite-france/salle2.js`<br>`levels/petite-france/salle3.js`<br>`levels/port-rhin/moulin.js` | `this.id` |
| `prefab:return` | `entities/props/Prefab.js` | — | `this` |
| `progress:companions` | `systems/Progress.js` | — | `s.companions` |
| `pull:moved` | `entities/props/Tractable.js` | — | `this` |
| `puzzle:failed:<id>` | `systems/Puzzle.js` | `levels/marche2000/toit.js`<br>`levels/meinau/kop.js`<br>`levels/petite-france/salle1.js`<br>`levels/petite-france/salle4.js` | — |
| `puzzle:progress:<id>` | `systems/Puzzle.js` | `levels/marche2000/toit.js`<br>`levels/meinau/kop.js`<br>`levels/petite-france/salle1.js`<br>`levels/petite-france/salle4.js` | `this.i, this.order.length, this.left`<br>`this.lit.size, this.total, this.left` |
| `puzzle:solved:<id>` | `systems/Puzzle.js` | `levels/marche2000/toit.js`<br>`levels/meinau/kop.js`<br>`levels/petite-france/salle1.js`<br>`levels/petite-france/salle4.js` | — |
| `sbire:alert` | `entities/enemies/Sbire.js` | — | `this` |
| `screen:replay` | `levels/meinau/kop.js` | `entities/props/EcranGeant.js` | — |
| `screen:sequence` | `levels/meinau/kop.js` | `entities/props/EcranGeant.js` | `order.map(i => TUNING.tifo.colors[i]` |
| `state:<id>` | `systems/Puzzle.js` | `levels/petite-france/salle2.js` | `v, old` |
| `stealth:caught` | `entities/enemies/Guetteur.js`<br>`entities/props/CameraScanner.js` | `levels/marche2000/infiltration.js` | `this` |
| `stealth:reset` | `levels/marche2000/infiltration.js` | — | — |
| `stork:dive` | `entities/props/StorkAllie.js` | — | `this.offerT.target` |
| `stork:joined` | `entities/props/StorkAllie.js` | — | `self` |
| `switch:enable:<id>` | `levels/petite-france/salle1.js` | `entities/props/Borne.js` | — |
| `switch:lock:<id>` | `levels/petite-france/salle1.js`<br>`systems/Puzzle.js` | `entities/props/Borne.js` | — |
| `switch:on` | `entities/props/Borne.js` | `levels/petite-france/salle3.js`<br>`systems/Puzzle.js` | `this` |
| `switch:reset:<id>` | `systems/Puzzle.js` | `entities/props/Borne.js` | — |
| `target:hint:<id>` | `levels/petite-france/salle4.js` | `entities/props/Cible.js` | `ORDER[n] \|\| null` |
| `target:hit` | `entities/props/Cible.js`<br>`entities/props/Crochet.js`<br>`entities/props/LettreNeon.js` | `levels/bac-a-sable/script.js`<br>`levels/meinau/local.js`<br>`systems/Puzzle.js` | `this` |
| `target:lock:<id>` | `levels/marche2000/toit.js`<br>`levels/meinau/kop.js`<br>`levels/meinau/local.js`<br>`systems/Puzzle.js` | `entities/props/Cible.js`<br>`entities/props/Crochet.js`<br>`entities/props/LettreNeon.js` | — |
| `target:reset:<id>` | `systems/Puzzle.js` | `entities/props/Cible.js`<br>`entities/props/Crochet.js`<br>`entities/props/LettreNeon.js` | — |
| `terminal:laser` | — | `levels/meinau-ouest/script.js` | — |
| `terminal:portique` | — | `levels/meinau/parvis.js` | — |
| `tifo:reveal` | `levels/meinau/kop.js` | `entities/props/TifoGeant.js` | — |
| `zone:<id>` | `Game.js` | — | — |
