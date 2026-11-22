// Place Kléber, salle 2 : le labyrinthe de chalets (prix exorbitants, gobelet minuscule). Trouver les 3 tampons officiels
// avant la « signature » de la vente de la ville :
//  - t1 au bout d'une impasse, gardé par un agent à bouclier pub (le contourner) ;
//  - t2 derrière la neige payante : flèche enflammée (caisse trouvée ici, proposition Cowork, à valider en jouant) ;
//  - t3 derrière un étal à roulettes : le tirer au gaffe-grappin.
// Horloge de la signature (TUNING.kleber, props/Horloge.js) : à chaque échéance, des agents en renfort ; jamais d'échec
// (proposition, à valider en jouant). 3 tampons → la porte du sapin s'ouvre.
import { Horloge } from '../../entities/props/Horloge.js';
import { TUNING } from '../../data/tuning.js';

const PI = Math.PI, K = TUNING.kleber;

export function chalets(game, { T, W, E, say }) {
  let started = false, found = 0, clock = null;
  const start = () => {
    if (started) return; started = true;
    game.setCheckpoint(0, -18, PI / 2);
    say(['kleber.chalets.1']);
    game.spawn('bouclier', 11, -29, 'chalets', { face: PI });
    game.spawn('neigeur', 0, -39, 'chalets', { face: PI }); game.spawn('neigeur', -6, -50, 'chalets', { face: 0 });
    game.spawn('peagiste', 8, -50, 'chalets', { face: PI });
    // la signature approche : des renforts à chaque échéance
    clock = game.add(new Horloge(game, { every: K.signature, times: K.waves, tick: () => {
      game.hud.banner(...T.signature);
      for (const x of [-1, 1]) game.spawn('peagiste', x, -18, 'renfortsSignature', { face: -PI / 2 });
    } }));
  };
  const t = game.trigger([-2, 2, -17, -19.5], start);

  let tuto = false;
  E.on('crate:opened', type => { if (type === 'enflammee' && !tuto) { tuto = true; say(['kleber.chalets.2']); } });
  const etal = game.trigger([5, 10, -46, -56], () => say(['kleber.chalets.3']));
  E.on('tampon:pris', () => {
    found++; game.hud.banner(...T.tampon(found));
    if (found === 3) { clock?.stop(); W.setDoor('sapin', true); game.setCheckpoint(0, -54, PI / 2); }
  });

  E.on('debug:warp', id => {
    if (id === 'peages') return;
    if (id === 'chalets') return start();
    started = t.done = etal.done = tuto = true;
    for (const e of [...game.entities]) {
      if ((e.group === 'chalets' || e.group === 'renfortsSignature') && e.alive) e.takeHit(99, 0, 1, 5, null);
      if (e.isTampon && e.alive) e.take();
    }
  });
}
