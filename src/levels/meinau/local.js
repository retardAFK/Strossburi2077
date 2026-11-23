// Meinau intérieur : le local du kop (au nord-ouest, porte sur la coursive nord). Les anciens confient l'Arc-Drapeau
// et des flèches-bannières, puis tuto de tir sur 3 cibles BlingCo (n'importe quel ordre) → la porte du kop s'ouvre.
import { ArcDrapeau } from '../../items/ArcDrapeau.js';
import { TUNING } from '../../data/tuning.js';

const PI = Math.PI;

// donne l'arc (si besoin) et des flèches-bannières : aussi utilisé par les raccourcis de debug
export function giveArc(game, banners = TUNING.tifo.arrowsAtLocal) {
  const inv = game.inventory;
  if (!inv.has('arc')) inv.give(new ArcDrapeau(game));
  inv.items.arc.give('banniere', banners);
  inv.equip('arc');
}

export function local(game, { T, W, E, say }) {
  const hit = new Set();
  let ready = false;
  const enter = game.trigger([-28.8, -18.6, -19, -23.2], () => {
    game.setCheckpoint(-23, -21, -PI / 2);
    E.emit('pnj:show:local');
    say(['mei.local.1', 'mei.local.2'], () => { giveArc(game); ready = true; say(['mei.local.3']); });
  });
  E.on('target:hit', t => {
    if (t.group !== 'tutoArc' || hit.has(t.key)) return;
    hit.add(t.key); game.hud.banner(`${hit.size} / 3`, '', 0.8);
    if (hit.size === 3) done();
  });
  const done = () => {
    E.emit('target:lock:tutoArc');
    W.setDoor('local', true);
    game.hud.banner(...T.tutoDone);
    game.setCheckpoint(-25, -15, 0);
  };
  // reparler à l'ancien : rappel du tuto (ou de l'arc s'il n'a pas encore été donné)
  E.on('pnj:talk', id => { if (id === 'local') say([ready ? 'mei.local.3' : 'mei.local.1']); });

  E.on('debug:warp', id => {
    if (id === 'A' || id === 'local') return;
    enter.done = true; ready = true; E.emit('pnj:show:local');
    giveArc(game); if (hit.size < 3) { hit.add('rouge').add('or').add('cyan'); done(); }
  });
}
