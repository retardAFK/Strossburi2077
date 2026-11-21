// Petite France, salle 3 : les Ponts Couverts « Péage Patrimoine ». Arène fermée entre les tours,
// 2 vagues, puis la winstubière fait ouvrir le coffre → bretzel-boomerang, puis la dernière vague avec le
// Videur-Maître d'hôtel (qu'on bat en apprenant le bretzel), commerçants libérés,
// borne sur la pile du pont (seul le bretzel l'atteint) → herse de sortie, plaque 3.
import { BretzelBoomerang } from '../../items/BretzelBoomerang.js';

const PI = Math.PI, IN = -PI / 2; // ennemis tournés vers l'entrée (+z)
const WAVES = [
  [['serveur', 7, -126], ['serveur', 17, -126], ['sommelier', 12, -133]],
  [['serveur', 5, -122], ['serveur', 19, -122], ['serveur', 12, -131], ['sommelier', 6, -133]],
  [['videur', 12, -133], ['serveur', 6, -130], ['serveur', 18, -130]]
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

  // vague 2 vidée : la winstubière fait ouvrir le coffre du péage AVANT le Videur
  const coffre = () => {
    E.emit('pnj:show:winstubiere3');
    E.emit('chest:unlock:peage');
    game.say(T.coffre);
  };
  game.onGroupCleared('ponts2', coffre);

  // bretzel en main : tuto, puis le Videur entre (la winstubière se met à l'abri)
  let videur = false;
  const startVideur = () => {
    if (videur) return;
    videur = true;
    E.emit('pnj:hide:winstubiere3');
    wave(2);
  };
  E.on('chest:opened', id => {
    if (id !== 'peage') return;
    game.inventory.give(new BretzelBoomerang(game));
    game.hud.banner(...T.boomerangGot, 3.5);
    game.say(T.boomerangTuto, startVideur);
  });

  // Videur battu : les commerçants sont libres, la winstubière revient
  let done = false;
  const freed = () => {
    done = true;
    game.hud.showBoss(null);
    E.emit('pnj:show:winstubiere3');
    game.say(T.freed);
  };
  game.onGroupCleared('ponts3', freed);
  E.on('pnj:talk', id => {
    if (id !== 'winstubiere3') return;
    const txt = done ? T.winstubHint3 : game.inventory.has('boomerang') ? T.winstubHintVideur : T.coffre[2].txt;
    game.say({ who: T.winstubIntro[0].who, txt });
  });

  // borne sur la pile du pont : la herse de sortie s'ouvre
  E.on('switch:on', s => {
    if (s.group !== 'peage3') return;
    W.setGate('herse3', true);
    game.hud.banner(...T.herseOpen);
    game.setCheckpoint(12, -139, PI / 2);
  });

  // debug F2 : 'salle3-coffre' = vagues 1 et 2 vidées, coffre à ouvrir, Videur à venir
  E.on('debug:warp', id => {
    if (id !== 'salle3-coffre' && id !== 'salle4' && id !== 'salle5') return;
    enter.done = true; W.setDoor('peage', false);
    if (id === 'salle3-coffre') return coffre();
    // ponts couverts terminés : bretzel en main, Videur battu, herse ouverte
    videur = true; freed();
    if (!game.inventory.has('boomerang')) game.inventory.give(new BretzelBoomerang(game));
    W.setGate('herse3', true);
  });
}
