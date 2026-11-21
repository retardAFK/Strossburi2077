// Port du Rhin, salle 3 : conteneurs, péniches et grues. Le conteneur qui bouche la barrière de préfabriqués se tire
// au grappin ; puis on traverse le canal de péniche en péniche en s'accrochant aux grues, jusqu'au bollard d'en face.
// Quai d'en face : agents immobiliers ; quai vidé → la herse du chantier s'ouvre.
const PI = Math.PI, IN = -PI / 2;

export function conteneurs(game, { T, W, E, say }) {
  const enter = game.trigger([-12, 12, -55, -57], () => { game.setCheckpoint(-1, -55.5, PI / 2); say(['prh.conteneurs.1']); });
  const edge = game.trigger([-12, 12, -61.5, -64], () => { game.setCheckpoint(-6, -63, PI / 2); say(['prh.peniches.1']); });
  let far = false;
  const landFar = () => {
    if (far) return; far = true;
    game.setCheckpoint(0, -85.5, PI / 2);
    say(['prh.quai2.1']);
    game.spawn('agent', -6, -91, 'quai3', { face: IN });
    game.spawn('agent', 6, -91, 'quai3', { face: IN });
  };
  E.on('gaffe:land', a => {
    if (a.id === 'grue1') game.setCheckpoint(-6, -69, PI / 2);
    if (a.id === 'grue2') game.setCheckpoint(0, -77.5, PI / 2);
    if (a.id === 'bollard') landFar();
  });
  game.onGroupCleared('quai3', () => { W.setGate('chantier', true); game.hud.banner(...T.gateOpen); });

  E.on('debug:warp', id => {
    if (id !== 'peniches' && id !== 'chantier') return;
    enter.done = true; edge.done = true;
    const c = game.entities.find(e => e.id === 'conteneur' && e.pull);
    if (c && c.z < -56) { c.z = -56; c.goal = -56; }
    if (id === 'chantier') { far = true; W.setGate('chantier', true); }
  });
}
