// Le Kalt, salle 3 : la salle (hangar rouge), techno industrielle all black. Mécanique rythme + lumières (props/Sono.js) :
// les portiques laser ne s'éteignent que sur les basses (passer au bon moment) ; les physios ne se voient qu'aux flashs
// du stroboscope. Le portique VIP vers la cave tient sur un projecteur : flèche court-circuit (proposition Cowork, à
// valider en jouant ; caisse de flèches à l'entrée).
const PI = Math.PI, IN = -PI / 2;

export function salle(game, { T, W, E, say }) {
  let started = false;
  const start = () => {
    if (started) return; started = true;
    game.setCheckpoint(0, -54.5, PI / 2); game.audio.music('kalt');
    say(['kalt.salle.1', 'kalt.salle.2']);
    for (const [x, z] of [[-4, -70], [5, -71], [0, -84]]) game.spawn('physio', x, z, 'salle', { face: IN, dark: true });
  };
  const t = game.trigger([-2, 2, -53.2, -56], start);
  E.on('projo:off', id => { if (id === 'vip') { W.setDoor('vip', true); game.hud.banner(...T.vipOff); } });

  E.on('debug:warp', id => {
    if (id === 'file' || id === 'cour') return;
    if (id === 'salle') return start();
    started = t.done = true;
    for (const e of game.entities) if (e.group === 'salle' && e.alive) e.takeHit(99, 0, 1, 5, null);
    game.entities.find(e => e.id === 'vip' && e.onShort)?.onShort();
  });
}
