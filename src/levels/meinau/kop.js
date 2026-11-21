// Meinau, salle 4 : le kop. Énigme du tifo : 5 crochets de couleur ; l'écran géant (piraté par SCN) montre l'ordre
// entre deux pubs. Flèches-bannières sur les crochets dans le bon ordre → le tifo « PAS À VENDRE » se déroule, le
// kop chante, la grille de la pelouse s'ouvre. Mauvais ordre : tout retombe, l'écran rejoue la séquence.
import { OrderedSequence } from '../../systems/Puzzle.js';
import { TUNING } from '../../data/tuning.js';

const PI = Math.PI;

export function kop(game, { T, W, E, L, say }) {
  const order = L.tifoOrder;
  const puzzle = game.add(new OrderedSequence(game, { group: 'tifo', order, time: TUNING.tifo.time }));
  const enter = game.trigger([5, 9, -57, -59], () => {
    game.setCheckpoint(7, -58, PI);
    E.emit('screen:sequence', order.map(i => TUNING.tifo.colors[i]));
    say(['mei.kop.1', 'mei.kop.2']);
  });
  E.on('puzzle:progress:tifo', (n, total) => game.hud.banner(`${n} / ${total}`, '', 0.8));
  E.on('puzzle:failed:tifo', () => { game.audio.play('hurt'); say(['mei.kop.fail']); E.emit('screen:replay'); });
  const solved = () => {
    E.emit('tifo:reveal'); E.emit('pnj:show:kop');
    W.setGate('pelouse', true);
    game.hud.banner(...T.tifoDone);
    say(['mei.kop.ok']);
  };
  E.on('puzzle:solved:tifo', solved);

  E.on('debug:warp', id => {
    if (id !== 'pelouse') return;
    enter.done = true;
    if (!puzzle.solved) { puzzle.solved = true; E.emit('target:lock:tifo'); solved(); }
  });
}
