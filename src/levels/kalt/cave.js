// Le Kalt intérieur : la cave (sous-sol, à l'ouest du Main). Dylagne y joue de la grosse caisse, enfermé par BlingCo
// dans un « carré VIP » gardé (physios + robots-cordons). Cave libérée → Dylagne rejoint l'Ultra (DylagneAllie, en
// attendant le compagnon invocable de l'étape F), tient le rythme (portiques du Main ouverts) et la porte de la cave
// s'ouvre de l'intérieur. Devant le rideau du Carré VIP, {use} : grosse caisse → le rideau tombe.
const PI = Math.PI;

export function cave(game, { T, W, E, say, dylagne, sono }) {
  let started = false, skipped = false;
  const start = () => {
    if (started) return; started = true;
    game.setCheckpoint(-24, -30, PI);
    say(['kalt.cave.1'], () => {
      if (skipped) return;
      game.spawn('physio', -27, -24, 'cave', { face: 0 }); game.spawn('physio', -27, -36, 'cave', { face: 0 });
      game.spawn('cordon', -30, -28.6, 'cave', { face: PI / 2 }); game.spawn('cordon', -30, -33.4, 'cave', { face: PI / 2 });
    });
  };
  const t = game.trigger([-40, -16, -20, -44], start); // en entrant dans la cave, par le Main ou par le soupirail
  const freed = () => {
    dylagne()?.join(); sono()?.hold(true); W.setDoor('cave', true);
    game.hud.banner(...T.dylagne); game.setCheckpoint(-24, -30, 0);
  };
  game.onGroupCleared('cave', () => { freed(); say(['kalt.dylagne', 'kalt.dylagne.2']); });
  // le rideau du Carré VIP : grosse caisse de Dylagne, à moins de 6 m du rideau
  E.on('dylagne:joined', d => d.offer({ x: 15, z: -30 }, () => { W.setDoor('piste', true); game.hud.banner(...T.pisteOpen); }, 6));

  E.on('debug:warp', id => {
    if (['cour', 'mezza', 'artspace'].includes(id)) return;
    if (id === 'cave') return start();
    started = skipped = t.done = true;
    for (const e of game.entities) if (e.group === 'cave' && e.alive) e.takeHit(99, 0, 1, 5, null);
    freed();
  });
}
