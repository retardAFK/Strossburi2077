// Effets des flèches spéciales à l'impact (génériques, tous niveaux). Appelé par Arrow.js (même dossier).
//   bannière      : la cible « crochet » (hook) reçoit une bannière ; une tête de boss peut s'en servir aussi.
//   fumigène      : nuage de fumée bleue (entities/props/Smoke.js) qui aveugle les sbires dedans.
//   court-circuit : coupe les appareils électriques proches (méthode onShort) ; étourdit les sbires robots.
//   enflammée     : brûle / fait fondre ce qui est proche (méthode onFire) ; petits dégâts aux ennemis.
// Émet 'arrow:effect' (type, x, z, cible). Réglages : TUNING.arrowFx.
import { Smoke } from './Smoke.js';
import { TUNING } from '../../data/tuning.js';

const near = (game, x, z, r) => game.entities.filter(e => !e.removed && Math.hypot(e.x - x, e.z - z) < r + (e.r || 0));

export function arrowEffect(game, arrow, target) {
  const F = TUNING.arrowFx, id = arrow.type.id, x = arrow.x, z = arrow.z;
  if (id === 'simple') return;
  if (id === 'banniere') {
    target?.hook?.(arrow);
  } else if (id === 'fumigene') {
    game.add(new Smoke(game, { x, z, ...F.smoke }));
  } else if (id === 'court_circuit') {
    game.particles.burst(x, arrow.y, z, 14, 0x38f2ff, 5);
    for (const e of near(game, x, z, F.short.radius)) {
      e.onShort?.(arrow);
      if (e.isSbire && e.S.robot) e.stun(F.short.stun);
    }
  } else if (id === 'enflammee') {
    game.particles.burst(x, arrow.y, z, 16, 0xff5a1a, 5);
    for (const e of near(game, x, z, F.fire.radius)) {
      e.onFire?.(arrow);
      if (e.isEnemy && e.alive && !e.isBoss) e.takeHit(F.fire.dmg, 0, 0, 2, arrow);
    }
  }
  game.events.emit('arrow:effect', id, x, z, target || null);
}
