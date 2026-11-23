// Le Kalt intérieur : le MAIN, le grand hangar au rez-de-chaussée, techno industrielle all black. Mécanique rythme +
// lumières (props/Sono.js) : les portiques laser ne s'éteignent que sur les basses ; les physios ne se voient qu'aux
// flashs du stroboscope. L'escalier du fond (nord-ouest) monte à l'étage ; la porte de la cave (ouest) s'ouvre depuis
// la régie lumière de la Mezza ; le rideau du Carré VIP (est) tombe à la grosse caisse de Dylagne (cave.js).
const PI = Math.PI, IN = -PI / 2;

export function main(game, { E, say }) {
  let started = false;
  const start = () => {
    if (started) return; started = true;
    game.audio.music('kalt');
    say(['kalt.salle.1', 'kalt.salle.2']);
    for (const [x, z] of [[-6, -28], [6, -30], [0, -42]]) game.spawn('physio', x, z, 'salle', { face: IN, dark: true });
  };
  E.on('kalt:main', start);
  E.on('kalt:cave', () => game.audio.music('kalt')); // arrivé par le soupirail : le Main attendra

  E.on('debug:warp', id => {
    if (id === 'cour') return start();
    started = true;
    for (const e of game.entities) if (e.group === 'salle' && e.alive) e.takeHit(99, 0, 1, 5, null);
  });
}
