// Meinau intérieur : l'arrivée et la coursive. L'Ultra entre par l'accès choisi au niveau 2 (sauvegarde : entry
// A, B ou C ; A par défaut, ex. ?level=meinau). Quatre stewards-robots font la ronde de la coursive. Les buvetiers
// donnent des indices. Verrous Arc-Drapeau : une cible BlingCo à côté des portes des loges VIP et des sous-sols.
import { BretzelBoomerang } from '../../items/BretzelBoomerang.js';

const PI = Math.PI;

export function arrivee(game, { T, W, E, L, say }) {
  E.on('game:start', () => {
    game.audio.music('coursive');
    if (!game.inventory.has('boomerang')) game.inventory.give(new BretzelBoomerang(game)); // niveau lancé seul
    const id = game.progress?.fromSave?.entry, at = L.entries[id] || L.entries.A, p = game.player;
    Object.assign(p, { x: at.x, z: at.z, face: at.face }); p.sync();
    game.setCheckpoint(at.x, at.z, at.face);
    say(['mei.coursive.0']);
    // la ronde des stewards : un par côté de l'anneau
    game.spawn('steward', -20, -27.5, 'coursive', { face: 0, patrol: [[25, -27.5], [-25, -27.5]] });
    game.spawn('steward', 32.4, 10, 'coursive', { face: PI / 2, patrol: [[32.4, -22], [32.4, 22]] });
    game.spawn('steward', 20, 27.5, 'coursive', { face: PI, patrol: [[-25, 27.5], [25, 27.5]] });
    game.spawn('steward', -32.4, 12, 'coursive', { face: PI / 2, patrol: [[-32.4, -22], [-32.4, 22]] });
  });
  E.on('pnj:talk', id => { if (/^buvette[1-4]$/.test(id)) say([`mei.${id}`]); });
  // verrous Arc-Drapeau
  E.on('target:hit', t => {
    if (t.group === 'verrouLoges' && !W.doors.loges.open) { W.setDoor('loges', true); game.hud.banner(...T.verrouLoges); }
    if (t.group === 'verrouSoussols' && !W.doors.soussols.open) { W.setDoor('soussols', true); game.hud.banner(...T.verrouSoussols); }
  });

  E.on('debug:warp', id => {
    if (id === 'A') return;
    for (const e of game.entities) if (e.group === 'coursive' && e.alive) e.takeHit(99, 0, 1, 5, null);
  });
}
