// Le Kalt, salle 2 : l'allée et la cour, entre le bâtiment blanc et le hangar rouge. Trois physios gardent la porte
// du hangar (combat) ; cour vidée → la porte s'ouvre. Deux robots-cordons barrent encore la porte (gaffe-grappin).
const PI = Math.PI, IN = -PI / 2;

export function cour(game, { T, W, E, say }) {
  let started = false;
  const start = () => {
    if (started) return; started = true;
    game.setCheckpoint(0, -24, PI / 2); game.hud.banner(...T.fileOpen);
    say(['kalt.cour.1']);
    for (const [x, z] of [[-5, -44], [5, -45], [0, -48]]) game.spawn('physio', x, z, 'cour', { face: IN });
    game.spawn('cordon', -2.4, -51.4, 'cordonsCour', { face: IN }); game.spawn('cordon', 0.05, -51.4, 'cordonsCour', { face: IN });
  };
  const t = game.trigger([-2.5, 2.5, -23.5, -26], start);
  game.onGroupCleared('cour', () => { W.setDoor('hangar', true); game.hud.banner(...T.courOpen); game.setCheckpoint(0, -40, PI / 2); });

  E.on('debug:warp', id => {
    if (id === 'file') return;
    if (id === 'cour') return start();
    started = t.done = true; W.setDoor('hangar', true);
    for (const e of game.entities) if ((e.group === 'cour' || e.group === 'cordonsCour') && e.alive) e.takeHit(99, 0, 1, 5, null);
  });
}
