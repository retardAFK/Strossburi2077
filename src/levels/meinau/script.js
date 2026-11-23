// Niveau 3 : la Meinau, intérieur du stade (2026, maquette grise). Une partie = un fichier ; ce script les branche :
// l'arrivée et la coursive (entrée A, B ou C du niveau 2, stewards, buvettes, verrous Arc-Drapeau), le local du kop
// (Arc-Drapeau), le kop (tifo), l'accès pelouse (tifo + terminal), la pelouse (boss Egboehly).
// Boucle : tour de coursive → local du kop → tifo → terminal → accès pelouse → boss. Répliques : meinau.fr.js.
import { arrivee } from './arrivee.js';
import { local } from './local.js';
import { kop } from './kop.js';
import { acces } from './acces.js';
import { pelouse } from './pelouse.js';

export default function script(game) {
  const ctx = { T: game.levelTexts, W: game.world, E: game.events, L: game.level.layout, say: (ids, cb) => game.dialog.sayIds(ids, cb) };
  arrivee(game, ctx);
  local(game, ctx);
  kop(game, ctx);
  acces(game, ctx);
  pelouse(game, ctx);
}
