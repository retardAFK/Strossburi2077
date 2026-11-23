// Meinau intérieur : le kop, en tribune ouest. Énigme du tifo : 5 crochets de couleur face à la pelouse ; l'écran
// géant de la tribune est (piraté par SCN) montre l'ordre entre deux pubs. Flèches-bannières sur les crochets dans le
// bon ordre → le tifo « PAS À VENDRE » se déroule, le kop chante : première moitié de l'accès pelouse ('acces:tifo').
// Mauvais ordre : tout retombe, l'écran rejoue la séquence.
import { OrderedSequence } from '../../systems/Puzzle.js';
import { TUNING } from '../../data/tuning.js';

export function kop(game, { T, E, L, say }) {
  const order = L.tifoOrder;
  const puzzle = game.add(new OrderedSequence(game, { group: 'tifo', order, time: TUNING.tifo.time }));
  const enter = game.trigger([-28.8, -20.4, -14, -16.4], () => {
    game.setCheckpoint(-25, -14, 0);
    E.emit('screen:sequence', order.map(i => TUNING.tifo.colors[i]));
    say(['mei.kop.1', 'mei.kop.2']);
  });
  E.on('puzzle:progress:tifo', (n, total) => game.hud.banner(`${n} / ${total}`, '', 0.8));
  E.on('puzzle:failed:tifo', () => { game.audio.play('hurt'); say(['mei.kop.fail']); E.emit('screen:replay'); });
  const solved = () => {
    E.emit('tifo:reveal'); E.emit('pnj:show:kop');
    game.hud.banner(...T.tifoDone);
    say(['mei.kop.ok']);
    E.emit('acces:tifo');
  };
  E.on('puzzle:solved:tifo', solved);

  E.on('debug:warp', id => {
    if (id !== 'terminal' && id !== 'pelouse') return;
    enter.done = true;
    if (!puzzle.solved) { puzzle.solved = true; E.emit('target:lock:tifo'); solved(); }
  });
}
