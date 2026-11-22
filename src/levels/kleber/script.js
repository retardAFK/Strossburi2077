// Niveau 6 : la place Kléber (la nuit, 2026), fin de la partie 1. Une salle = un fichier ; ce script les branche dans
// l'ordre : les péages (borne à pirater), le labyrinthe de chalets (3 tampons officiels, flèche enflammée), le sapin-écran
// (Stork, Dylagne, court-circuit), l'estrade (boss Marco CeKlair), puis le faux final et le paradoxe (finale.js).
// Répliques : registre data/dialogues/kleber.fr.js (say(ids)).
import { peages } from './peages.js';
import { chalets } from './chalets.js';
import { sapin } from './sapin.js';
import { estrade } from './estrade.js';

export default function script(game) {
  const ctx = { T: game.levelTexts, W: game.world, E: game.events, say: (ids, cb) => game.dialog.sayIds(ids, cb),
    stork: () => game.entities.find(e => e.isStork), dylagne: () => game.entities.find(e => e.isDylagne) };
  peages(game, ctx);
  chalets(game, ctx);
  sapin(game, ctx);
  estrade(game, ctx);
}
