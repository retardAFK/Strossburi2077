// Petite France, salle 3 : les Ponts Couverts « Péage Patrimoine ». Arène fermée entre les tours,
// 3 vagues (la dernière avec le Videur-Maître d'hôtel), commerçants libérés, coffre → bretzel-boomerang,
// borne sur la pile du pont (seul le bretzel l'atteint) → herse de sortie, plaque 3.
import { BretzelBoomerang } from '../../items/BretzelBoomerang.js';

const PI = Math.PI, IN = -PI / 2; // ennemis tournés vers l'entrée (+z)
const WAVES = [
  [['serveur', 7, -126], ['serveur', 17, -126], ['sommelier', 12, -133]],
  [['serveur', 5, -122], ['serveur', 19, -122], ['serveur', 12, -131], ['sommelier', 6, -133]],
  [['videur', 12, -130], ['serveur', 6, -128], ['serveur', 18, -128]]
];

export function salle3(game, { T, W, E }) {
  const wave = i => {
    for (const [type, x, z] of WAVES[i]) game.spawn(type, x, z, 'ponts' + (i + 1), { face: IN });
    if (i === 2) { game.hud.showBoss(T.videur.name); game.hud.setBoss(1); game.say(T.videur.intro); }
  };

  // entrée dans l'arène : la porte du péage se referme, vague 1
  const enter = game.trigger([2, 22, -114, -117], () => {
    W.setDoor('peage', false);
    game.setCheckpoint(12, -115, PI / 2);
    game.say(T.peage);
    wave(0);
  });
  game.onGroupCleared('ponts1', () => wave(1));
  game.onGroupCleared('ponts2', () => wave(2));

  // arène vidée : les commerçants sont libres, la winstubière ouvre le coffre avec eux
  const freed = () => {
    game.hud.showBoss(null);
    E.emit('pnj:show:winstubiere3');
    E.emit('chest:unlock:peage');
    game.say(T.freed);
  };
  game.onGroupCleared('ponts3', freed);

  E.on('chest:opened', id => {
    if (id !== 'peage') return;
    game.inventory.give(new BretzelBoomerang(game));
    game.hud.banner(...T.boomerangGot, 3.5);
    game.say(T.boomerangTuto);
  });
  E.on('pnj:talk', id => {
    if (id === 'winstubiere3') game.say({ who: T.winstubIntro[0].who, txt: game.inventory.has('boomerang') ? T.winstubHint3 : T.freed[2].txt });
  });

  // borne sur la pile du pont : la herse de sortie s'ouvre
  E.on('switch:on', s => {
    if (s.group !== 'peage3') return;
    W.setGate('herse3', true);
    game.hud.banner(...T.herseOpen);
    game.setCheckpoint(12, -139, PI / 2);
  });

  // fin provisoire de la démo : la sortie mène au barrage Vauban
  game.trigger([10, 14, -143, -146], () => game.win(T.end));

  // debug F2 : 'salle3-coffre' = arène déjà vidée
  E.on('debug:warp', id => {
    if (id !== 'salle3-coffre') return;
    enter.done = true; W.setDoor('peage', false);
    freed();
  });
}
