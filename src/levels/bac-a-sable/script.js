// Bac à sable : donne le bretzel-boomerang et l'Arc-Drapeau dès le départ ; les cibles touchées se rééteignent
// au bout de 1,5 s (pas d'énigme). Sert aux tests (tests/arc-drapeau.test.mjs) et aux réglages à la main.
import { BretzelBoomerang } from '../../items/BretzelBoomerang.js';
import { ArcDrapeau } from '../../items/ArcDrapeau.js';

export default function script(game) {
  const T = game.levelTexts;
  game.inventory.give(new BretzelBoomerang(game));
  game.inventory.give(new ArcDrapeau(game));
  game.events.on('game:start', () => game.say(T.hello));
  game.events.on('target:hit', c => setTimeout(() => game.events.emit('target:reset:' + c.group), 1500));
  game.events.on('debug:warp', () => {}); // rien à remettre en état : la salle n'a pas de déroulé
}
