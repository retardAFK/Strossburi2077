// Raccourcis de debug, actifs seulement avec ?debug=1 dans l'URL (tous niveaux).
//   F2 : téléporte l'Ultra devant le prochain terminal / interrupteur (borne...) encore à activer.
//   F3 : élimine tous les ennemis présents.
import { TUNING } from './data/tuning.js';

const pending = e => (e.isTerminal && e.alive) || (e.isSwitch && !e.on && !e.done);

function teleport(game) {
  const p = game.player;
  const all = game.entities.filter(e => e.isTerminal || e.isSwitch);
  const t = all.filter(pending).sort((a, b) => p.dist(a) - p.dist(b))[0] || all[0];
  if (!t) return console.info('[debug] aucun terminal ni interrupteur dans ce niveau');
  const d = TUNING.terminal.debugDist;
  Object.assign(p, { x: t.x + t.fx * d, z: t.z + t.fz * d, vx: 0, vz: 0, target: null });
  p.faceTo(t.x, t.z);
  game.camera.snapBehind(p.face);
}

function killAll(game) {
  for (const e of game.entities) if (e.isEnemy && e.alive) e.takeHit(99, 0, 1, 5, null);
}

export function installDebug(game) {
  if (new URLSearchParams(location.search).get('debug') !== '1') return;
  console.info('[debug] actif : F2 = devant le terminal / la borne, F3 = tuer les ennemis');
  addEventListener('keydown', e => {
    if (e.code !== 'F2' && e.code !== 'F3') return;
    e.preventDefault();
    if (game.mode !== 'play' || !game.player) return;
    if (e.code === 'F2') teleport(game); else killAll(game);
  });
}
