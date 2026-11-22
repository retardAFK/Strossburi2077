// Marché 2000, passage optionnel : le marché noir (réponse de Maxime : « passage dédié » ; tracé = proposition, à
// valider en jouant). Derrière la porte violette de la cour (elle s'ouvre quand l'Ultra s'en approche), un couloir
// d'étals où BlingCo Nuit revend x10 ce qu'il a confisqué au quartier. Un robot-vigile en ronde, des étals pour se
// cacher, une caisse de flèches court-circuit au bout ; le couloir ressort dans les rayons, à l'est.
// Repéré ici → retour au départ de la cour (même point de reprise que l'arrière).
const PI = Math.PI;

export function marcheNoir(game, { T, W, E, say }) {
  E.on('game:start', () => {
    game.spawn('vigile', 15, -14, 'noir', { face: -PI / 2, stealth: true, patrol: [[15, -40], [15, -14]] });
  });
  const door = game.trigger([8.4, 10, -16.6, -19.4], () => {
    W.setDoor('violette', true); game.hud.banner(...T.marcheNoir);
    say(['m2k.noir.1']);
  });
  // sortie dans les rayons : la salle suivante démarre comme par la porte de service
  const out = game.trigger([9, 10.4, -40, -42], () => E.emit('m2k:rayons'));

  E.on('debug:warp', id => {
    if (id === 'arriere') return;
    door.done = true; out.done = true;
    for (const e of game.entities) if (e.group === 'noir' && e.alive) e.takeHit(99, 0, 1, 5, null);
  });
}
