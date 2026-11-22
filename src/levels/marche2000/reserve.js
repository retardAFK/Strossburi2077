// Marché 2000, salle 3 : la réserve, planque de SCN. Les sbires de BlingCo descendent : combat en 2 vagues
// (vigiles et chariots en mode combat). Réserve vidée → l'escalier du toit s'ouvre.
const PI = Math.PI, IN = -PI / 2; // tournés vers l'entrée (+z)

export function reserve(game, { T, W, E, say }) {
  let started = false, skipped = false;
  const start = () => {
    if (started) return; started = true;
    game.setCheckpoint(0, -64.5, PI / 2);
    E.emit('pnj:show:scn'); E.emit('pnj:show:scn2');
    say(['m2k.reserve.1'], () => {
      if (skipped) return;
      game.spawn('vigile', -4, -74, 'reserve1', { face: IN }); game.spawn('vigile', 4, -75, 'reserve1', { face: IN });
      game.spawn('chariot', 0, -78, 'reserve1', { face: IN });
    });
  };
  E.on('m2k:reserve', start);
  game.onGroupCleared('reserve1', () => {
    for (const [t, x, z] of [['vigile', -6, -79], ['vigile', 6, -79], ['chariot', -2, -81], ['chariot', 2, -81]]) game.spawn(t, x, z, 'reserve2', { face: IN });
  });
  const cleared = () => { W.setDoor('escalier', true); game.hud.banner(...T.reserveOpen); game.setCheckpoint(0, -80, PI / 2); };
  game.onGroupCleared('reserve2', () => { cleared(); say(['m2k.reserve.2']); });
  E.on('pnj:talk', id => { if (id === 'scn') say(['m2k.reserve.2']); });

  E.on('debug:warp', id => {
    if (id === 'arriere' || id === 'rayons') return;
    if (id === 'reserve') return start();
    started = skipped = true; E.emit('pnj:show:scn'); E.emit('pnj:show:scn2');
    for (const e of game.entities) if (/^reserve/.test(e.group || '') && e.alive) e.takeHit(99, 0, 1, 5, null);
    W.setDoor('escalier', true);
  });
}
