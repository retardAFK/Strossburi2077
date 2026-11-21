// Niveau 2 : la Meinau, 2026. Une salle = un fichier ; ce script les branche dans l'ordre.
// Répliques : registre data/dialogues/meinau.fr.js (say(ids)).
import { parvis } from './parvis.js';
import { local } from './local.js';
import { kop } from './kop.js';
import { pelouse } from './pelouse.js';

export default function script(game) {
  const ctx = { T: game.levelTexts, W: game.world, E: game.events, L: game.level.layout, say: (ids, cb) => game.dialog.sayIds(ids, cb) };
  parvis(game, ctx);
  local(game, ctx);
  kop(game, ctx);
  pelouse(game, ctx);
}
