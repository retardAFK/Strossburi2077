// Niveau 4 : Marché 2000 (Porte de l'Hôpital, la nuit, 2026). Une salle = un fichier ; ce script les branche dans
// l'ordre. Infiltration (arrière, marché noir en option, rayons) puis combat (réserve), énigme (toit), boss (magasin).
// Répliques : registre data/dialogues/marche2000.fr.js (say(ids)).
import { infiltration } from './infiltration.js';
import { arriere } from './arriere.js';
import { marcheNoir } from './marchenoir.js';
import { rayons } from './rayons.js';
import { reserve } from './reserve.js';
import { toit } from './toit.js';
import { magasin } from './magasin.js';

export default function script(game) {
  const ctx = { T: game.levelTexts, W: game.world, E: game.events, say: (ids, cb) => game.dialog.sayIds(ids, cb) };
  infiltration(game, ctx);
  arriere(game, ctx);
  marcheNoir(game, ctx);
  rayons(game, ctx);
  reserve(game, ctx);
  toit(game, ctx);
  magasin(game, ctx);
}
