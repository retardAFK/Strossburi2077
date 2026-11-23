// Meinau intérieur : l'accès pelouse par le tunnel sud. Il faut le tifo déployé (kop) ET le terminal de la coursive
// est piraté, dans n'importe quel ordre (le plan suggère tifo puis terminal) → la herse du tunnel se lève.
const PI = Math.PI;

export function acces(game, { T, W, E }) {
  const got = new Set();
  const step = what => {
    if (got.has(what)) return;
    got.add(what);
    if (got.size < 2) return game.hud.banner(...T.accesStep);
    W.setGate('pelouse', true); game.hud.banner(...T.accesOpen); game.setCheckpoint(0, 22, PI / 2);
  };
  E.on('acces:tifo', () => step('tifo'));
  E.on('terminal:pelouse', () => step('terminal'));

  E.on('debug:warp', id => {
    if (id !== 'pelouse') return;
    game.entities.find(e => e.isTerminal && e.alive)?.activate();
  });
}
