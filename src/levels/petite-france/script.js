// Niveau 1 : Petite France (futur). Une salle = un fichier ; ce script les branche dans l'ordre.
import { salle1 } from './salle1.js';
import { salle2 } from './salle2.js';

export default function script(game) {
  const ctx = { T: game.levelTexts, W: game.world, E: game.events };
  salle1(game, ctx);
  salle2(game, ctx);
  ctx.E.on('plaque:restored', () => game.say(ctx.T.plaqueRestored));
}
