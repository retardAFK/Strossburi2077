// Niveau 5 : le Kalt (rue la Fayette, la nuit, 2026). Une salle = un fichier ; ce script les branche dans l'ordre :
// la file (robots-cordons, physios), la cour (combat), la salle (rythme + lumières, portique VIP), la cave (Dylagne),
// la piste (boss le Magnat du Carré VIP). Répliques : registre data/dialogues/kalt.fr.js (say(ids)).
import { file } from './file.js';
import { cour } from './cour.js';
import { salle } from './salle.js';
import { cave } from './cave.js';
import { piste } from './piste.js';

export default function script(game) {
  const ctx = { T: game.levelTexts, W: game.world, E: game.events, say: (ids, cb) => game.dialog.sayIds(ids, cb),
    dylagne: () => game.entities.find(e => e.isDylagne), sono: () => game.entities.find(e => e.isSono) };
  file(game, ctx);
  cour(game, ctx);
  salle(game, ctx);
  cave(game, ctx);
  piste(game, ctx);
}
