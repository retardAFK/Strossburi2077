// Niveau 7 : le Kalt, l'intérieur (2026, la nuit, maquette grise). Une partie = un fichier ; ce script les branche :
// l'arrivée (cour ou cave selon le niveau 6) et les escaliers, le Main (rythme + lumières), l'étage (Mezza, régie,
// artspace), la cave (Dylagne), le Carré VIP (boss le Magnat). Parcours : Main → Mezza → cave → Carré VIP → boss.
// Répliques : data/dialogues/kalt.fr.js.
import { arrivee } from './arrivee.js';
import { main } from './main.js';
import { etage } from './etage.js';
import { cave } from './cave.js';
import { piste } from './piste.js';

export default function script(game) {
  const ctx = { T: game.levelTexts, W: game.world, E: game.events, L: game.level.layout, say: (ids, cb) => game.dialog.sayIds(ids, cb),
    dylagne: () => game.entities.find(e => e.isDylagne), sono: () => game.entities.find(e => e.isSono) };
  arrivee(game, ctx);
  main(game, ctx);
  etage(game, ctx);
  cave(game, ctx);
  piste(game, ctx);
}
