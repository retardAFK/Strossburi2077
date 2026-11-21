// Petite France, salle 4 : le Barrage Vauban « Rooftop Premium ». Accueil musclé sur la terrasse, puis
// 3 cibles-TPE derrière des vitres anti-écharpe : le bretzel doit les toucher dans l'ordre des néons
// (rouge, or, cyan) avant la fin du chrono. Herse ouverte → le PDG sur écran géant → porte du boss. Plaque 4.
import { OrderedSequence } from '../../systems/Puzzle.js';
import { TUNING } from '../../data/tuning.js';

const PI = Math.PI, IN = -PI / 2;

export function salle4(game, { T, W, E }) {
  const time = TUNING.puzzle.pfCiblesTime;
  game.add(new OrderedSequence(game, { group: 'cibles', order: ['rouge', 'or', 'cyan'], time }));

  // arrivée sur la terrasse : comité d'accueil, puis l'énigme
  game.trigger([0, 24, -151, -154], () => {
    game.setCheckpoint(12, -152, PI / 2);
    game.say(T.rooftop);
    game.spawn('serveur', 6, -158, 'toit', { face: IN });
    game.spawn('serveur', 18, -158, 'toit', { face: IN });
    game.spawn('sommelier', 3, -161, 'toit', { face: IN });
    game.spawn('sommelier', 21, -161, 'toit', { face: IN });
  });
  game.onGroupCleared('toit', () => game.say(T.cibles.map(l => ({ ...l, txt: l.txt.replace('{t}', time) }))));

  E.on('puzzle:progress:cibles', (n, total) => game.hud.banner(`${n} / ${total}`, '', 0.8));
  E.on('puzzle:failed:cibles', () => { game.hud.banner(...T.ciblesFail); game.audio.play('hurt'); });
  E.on('puzzle:solved:cibles', () => {
    W.setGate('herse4', true);
    game.hud.banner(...T.herseOpen);
    game.setCheckpoint(20.5, -162, PI / 2);
  });

  // derrière la herse : le PDG apparaît sur l'écran géant, puis la porte du boss
  game.trigger([18, 23, -164.5, -167], () => {
    W.setPropVisible('pdg', true);
    game.audio.play('laser'); game.camera.shake = 0.3;
    game.say(T.pdg);
  });
  // porte du boss : on descend dans la cuisine sous le barrage (salle5.js)
  game.trigger([19, 22, -167.3, -168.3], () => E.emit('pf:boss'));
}
