// Raccourcis de debug, actifs seulement avec ?debug=1 dans l'URL.
//   F2 : téléporte l'Ultra devant le prochain terminal encore actif (tous niveaux).
import { TUNING } from './data/tuning.js';

export function installDebug(game) {
  if (new URLSearchParams(location.search).get('debug') !== '1') return;
  console.info('[debug] actif : F2 = devant le terminal');
  addEventListener('keydown', e => {
    if (e.code !== 'F2') return;
    e.preventDefault();
    if (game.mode !== 'play' || !game.player) return;
    const p = game.player;
    const terms = game.entities.filter(t => t.isTerminal);
    const t = terms.filter(t => t.alive).sort((a, b) => p.dist(a) - p.dist(b))[0] || terms[0];
    if (!t) return console.info('[debug] aucun terminal dans ce niveau');
    const d = TUNING.terminal.debugDist;
    Object.assign(p, { x: t.x + t.fx * d, z: t.z + t.fz * d, vx: 0, vz: 0, target: null });
    p.faceTo(t.x, t.z);
    game.camera.snapBehind(p.face);
  });
}
