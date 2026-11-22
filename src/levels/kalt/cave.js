// Le Kalt, salle 4 : la cave. Dylagne y joue de la grosse caisse, enfermé par BlingCo dans un « carré VIP » gardé
// (physios + robots-cordons). Cave libérée → Dylagne rejoint l'Ultra (DylagneAllie, en attendant le compagnon
// invocable de l'étape F) et tient le rythme : les portiques de la salle restent ouverts. Devant le rideau de la piste,
// {use} : grosse caisse → le rideau tombe.
const PI = Math.PI;

export function cave(game, { T, W, E, say, dylagne, sono }) {
  let started = false, skipped = false;
  const start = () => {
    if (started) return; started = true;
    game.setCheckpoint(-17, -82, PI);
    say(['kalt.cave.1'], () => {
      if (skipped) return;
      game.spawn('physio', -22, -77, 'cave', { face: 0 }); game.spawn('physio', -22, -88, 'cave', { face: 0 });
      game.spawn('cordon', -24, -83.6, 'cave', { face: PI / 2 }); game.spawn('cordon', -24, -88.4, 'cave', { face: PI / 2 });
    });
  };
  const t = game.trigger([-18.5, -15, -79, -85], start);
  const freed = () => {
    dylagne()?.join(); sono()?.hold(true);
    game.hud.banner(...T.dylagne); game.setCheckpoint(-17, -82, PI);
  };
  game.onGroupCleared('cave', () => { freed(); say(['kalt.dylagne', 'kalt.dylagne.2']); });
  // le rideau de la piste : grosse caisse de Dylagne, à moins de 6 m du rideau
  E.on('dylagne:joined', d => d.offer({ x: 0, z: -89 }, () => { W.setDoor('piste', true); game.hud.banner(...T.pisteOpen); }, 6));

  E.on('debug:warp', id => {
    if (['file', 'cour', 'salle'].includes(id)) return;
    if (id === 'cave') return start();
    started = skipped = t.done = true;
    for (const e of game.entities) if (e.group === 'cave' && e.alive) e.takeHit(99, 0, 1, 5, null);
    freed();
  });
}
