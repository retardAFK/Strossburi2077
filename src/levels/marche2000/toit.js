// Marché 2000, salle 4 : le toit et l'enseigne « MARCHÉ 2000 » (angle rue des Bouchers). Énigme : rallumer à l'arc
// les 3 lettres éteintes dans l'ordre du mot ; vue du toit, de derrière, l'enseigne se lit de droite à gauche
// (proposition, à valider en jouant). Mauvais ordre : tout se rééteint. Réussi → Stork sort de son nid et rejoint
// l'Ultra (StorkAllie, en attendant le compagnon invocable de l'étape F), l'escalier du magasin s'ouvre.
import { OrderedSequence } from '../../systems/Puzzle.js';

const PI = Math.PI;

export function toit(game, { T, W, E, say }) {
  const puzzle = game.add(new OrderedSequence(game, { group: 'enseigne', order: [0, 1, 2], time: 600 }));
  const stork = () => game.entities.find(e => e.isStork);
  const enter = game.trigger([-1.5, 1.5, -85, -87], () => {
    game.setCheckpoint(0, -87, PI / 2); game.inventory.equip('arc');
    say(['m2k.toit.1', 'm2k.toit.2']);
  });
  E.on('puzzle:progress:enseigne', (n, total) => game.hud.banner(`${n} / ${total}`, '', 0.8));
  E.on('puzzle:failed:enseigne', () => { game.audio.play('hurt'); say(['m2k.toit.fail']); });
  const solved = () => {
    game.hud.banner(...T.enseigneDone, 3);
    stork()?.join();
    W.setDoor('magasin', true);
  };
  E.on('puzzle:solved:enseigne', () => { solved(); say(['m2k.toit.ok', 'm2k.stork']); });

  E.on('debug:warp', id => {
    if (id !== 'magasin') return;
    enter.done = true;
    if (!puzzle.solved) {
      puzzle.solved = true; E.emit('target:lock:enseigne');
      for (const e of game.entities) if (e.char && !e.lit) e.set(true);
      solved();
    }
    const s = stork(); if (s && s.stateName !== 'follow') { const p = s.slot(); Object.assign(s, p); s.setState('follow'); }
  });
}
