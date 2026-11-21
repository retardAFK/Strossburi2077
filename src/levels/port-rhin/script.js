// Niveau 3 : le Port du Rhin, 2026. Une salle = un fichier ; ce script les branche dans l'ordre.
// Répliques : registre data/dialogues/port-rhin.fr.js (say(ids)).
import { quai } from './quai.js';
import { moulin } from './moulin.js';
import { conteneurs } from './conteneurs.js';
import { chantier } from './chantier.js';

export default function script(game) {
  const ctx = { T: game.levelTexts, W: game.world, E: game.events, say: (ids, cb) => game.dialog.sayIds(ids, cb) };
  quai(game, ctx);
  moulin(game, ctx);
  conteneurs(game, ctx);
  chantier(game, ctx);
}
