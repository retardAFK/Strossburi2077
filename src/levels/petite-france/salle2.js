// Petite France, salle 2 : l'Écluse. Le levier (quai A) baisse / remonte l'eau d'un cran ; la vanne,
// atteignable seulement depuis la barque, la monte au plus haut. Pont bas = eau basse, quai haut = eau haute.
import { MultiState } from '../../systems/Puzzle.js';

const PI = Math.PI;

export function salle2(game, { T, W, E }) {
  const eau = game.add(new MultiState(game, { id: 'eau', count: 3, start: W.waters.eau.level }));
  E.on('state:eau', v => W.setWaterLevel('eau', v));
  // l'eau atteint le quai haut : la cage « Tradition Certifiée » saute, la winstubière file aux Ponts Couverts
  let freed = false;
  E.on('state:eau', v => {
    if (v !== 2 || freed) return;
    freed = true; W.removeProp('cageWinstub');
    game.particles.burst(-5, 1.5, -62, 24, 0xffc040, 6); game.audio.play('door');
    E.emit('pnj:hide:winstubiere');
    game.say(T.winstubFreed);
  });
  E.on('lever:used', id => {
    if (id === 'levier') eau.set(eau.value === 0 ? 1 : 0);
    if (id === 'vanne') eau.set(eau.value === 2 ? 0 : 2);
  });

  // arrivée sur le quai A : la winstubière appelle l'Ultra depuis sa cage
  game.trigger([-8, 2, -52, -56], () => {
    game.setCheckpoint(0, -54, PI / 2);
    game.say(T.winstubIntro);
  });
  E.on('pnj:talk', id => {
    if (id === 'winstubiere') game.say({ who: T.winstubIntro[0].who, txt: T.winstubHints[eau.value] });
  });

  // barque bloquée : pont trop bas, ou quai trop haut
  E.on('boat:blocked', why => {
    if (why === 'pass') game.say(T.boat.bridge);
    else game.say(eau.value === 2 ? T.boat.endOk : T.boat.quaiHigh);
  });

  // débarquement sur le quai haut : comité d'accueil
  let landed = false;
  E.on('boat:leave', stop => {
    if (stop !== 'quai' || landed) return;
    landed = true;
    game.setCheckpoint(11, -92, PI / 2);
    game.say(T.quaiWelcome);
    game.spawn('serveur', 12, -96, 'quai', { face: PI });
    game.spawn('serveur', 14, -88, 'quai', { face: PI });
  });

  // debug F2 : salles suivantes = écluse passée (eau haute, winstubière libre)
  E.on('debug:warp', id => { if (id.startsWith('salle3') || id === 'salle4' || id === 'salle5') { landed = true; eau.set(2); } });
}
