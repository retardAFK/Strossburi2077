// Marché 2000, salle 2 : les rayons. Infiltration : chariots-robots dans les allées, caméras-scanners au plafond ;
// les étagères et les palettes cachent. Une cliente et un employé de nuit donnent des indices (palettes, court-circuit ;
// caisse de flèches court-circuit près de l'employé). Atteindre la porte de la réserve sans être repéré.
const PI = Math.PI;

export function rayons(game, { E, say }) {
  let spawned = false;
  const spawn = () => {
    if (spawned) return; spawned = true;
    game.spawn('chariot', -2.5, -37, 'rayons', { face: PI / 2, stealth: true, patrol: [[-2.5, -51], [-2.5, -37]] });
    game.spawn('chariot', 7.5, -51, 'rayons', { face: PI / 2, stealth: true, patrol: [[7.5, -38], [7.5, -51]] });
    game.spawn('chariot', -8, -54.5, 'rayons', { face: 0, stealth: true, patrol: [[8, -54.5], [-8, -54.5]] });
  };
  E.on('m2k:rayons', () => {
    game.setCheckpoint(0, -32.5, PI / 2); spawn();
    say(['m2k.rayons.1']);
  });
  E.on('pnj:talk', id => { if (id === 'cliente') say(['m2k.cliente']); if (id === 'employe') say(['m2k.employe']); });
  const out = game.trigger([-1.5, 1.5, -62, -63.5], () => E.emit('m2k:reserve'));

  E.on('debug:warp', id => {
    if (id === 'arriere') return;
    if (id === 'rayons') { game.setCheckpoint(0, -32.5, PI / 2); return spawn(); }
    out.done = true;
    for (const e of game.entities) if (e.group === 'rayons' && e.alive) e.takeHit(99, 0, 1, 5, null);
  });
}
