// Niveau 1 Petite France, salle 1 (Quartier des Tanneurs) : intro, 2 vagues, énigme des bornes, message de SCN.
import { TimedSwitchGroup } from '../../systems/Puzzle.js';
import { TUNING } from '../../data/tuning.js';

const PI = Math.PI;

export default function script(game) {
  const T = game.levelTexts, W = game.world, E = game.events;
  const FACE_IN = -PI / 2; // ennemis tournés vers l'entrée (+z)

  E.on('game:start', () => {
    game.audio.music('coursive');
    game.say(T.intro);
  });

  // entrée dans le food court : le rideau tombe derrière l'Ultra, vague 1
  const enterFoodCourt = game.trigger([-9, 9, -20, -24], () => {
    W.setDoor('entree', false);
    game.setCheckpoint(0, -21, PI / 2);
    game.say(T.foodcourt);
    game.spawn('serveur', -5, -33, 'vague1', { face: FACE_IN });
    game.spawn('serveur', 5, -33, 'vague1', { face: FACE_IN });
    game.spawn('serveur', 0, -37, 'vague1', { face: FACE_IN });
  });

  game.onGroupCleared('vague1', () => {
    game.say(T.wave2);
    game.spawn('serveur', -6, -37, 'vague2', { face: FACE_IN });
    game.spawn('serveur', 6, -37, 'vague2', { face: FACE_IN });
    game.spawn('sommelier', 0, -40, 'vague2', { face: FACE_IN });
  });

  // salle vidée : les bornes s'allument, la herse attend
  const time = TUNING.puzzle.pfBornesTime;
  game.add(new TimedSwitchGroup(game, { group: 'bornes', time }));
  game.onGroupCleared('vague2', () => {
    game.setCheckpoint(0, -30, PI / 2);
    game.say(T.herse.map(l => ({ ...l, txt: l.txt.replace('{t}', time) })));
    E.emit('switch:enable:bornes');
  });
  E.on('puzzle:progress:bornes', (n, total) => game.hud.banner(`${n} / ${total}`, '', 0.8));
  E.on('puzzle:failed:bornes', () => { game.hud.banner(...T.puzzleFail); game.audio.play('hurt'); });
  E.on('puzzle:solved:bornes', () => {
    W.setGate('herse', true);
    game.hud.banner(...T.herseOpen);
    game.setCheckpoint(0, -40, PI / 2);
    W.setPropVisible('celle', true);
    game.say(T.celle);
  });

  E.on('plaque:restored', () => game.say(T.plaqueRestored));

  // debug F2 : on saute les vagues, l'énigme des bornes est prête
  E.on('debug:warp', id => {
    if (id !== 'salle1-enigme') return;
    enterFoodCourt.done = true; W.setDoor('entree', false);
    for (const e of game.entities) if (e.isEnemy && e.alive) e.takeHit(99, 0, 1, 5, null);
    E.emit('switch:enable:bornes');
  });

  // fin provisoire de la démo : la terrasse mène à l'écluse
  game.trigger([-2.5, 2.5, -45, -49], () => game.win(T.end));
}
