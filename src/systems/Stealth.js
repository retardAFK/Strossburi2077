// Infiltration (générique, tous les niveaux) : qui voit l'Ultra ? Un guetteur (vigile, chariot, caméra) le voit s'il
// est dans son faisceau (portée + cône), sans obstacle entre eux (étagère, palette, mur) et pas caché dans une fumée.
// Sous une lumière allumée (entités `isLight` : néons de cour), il est vu de plus loin et sous tous les angles.
// Le niveau décide de ce que « vu » veut dire (événement 'stealth:caught' émis par les guetteurs en mode infiltration).
const PASS = new Set(['water', 'vitre', 'gate', 'switch', 'terminal', 'plaque', 'target', 'gap', 'crate']); // ne cachent pas

// rien entre (ax, az) et (bx, bz) : on échantillonne le segment tous les 30 cm contre les boîtes de collision
export function clearLine(game, ax, az, bx, bz) {
  const d = Math.hypot(bx - ax, bz - az), n = Math.ceil(d / 0.3);
  for (let i = 1; i < n; i++) {
    const x = ax + (bx - ax) * i / n, z = az + (bz - az) * i / n;
    for (const w of game.collision.boxes) if (w.on && !PASS.has(w.tag) && x > w.x0 && x < w.x1 && z > w.z0 && z < w.z1) return false;
  }
  return true;
}

// l'Ultra est-il caché dans une fumée (flèche fumigène) ?
export const inSmoke = (game, p) => game.entities.some(e => e.isSmoke && !e.removed && e.contains(p));
// l'Ultra est-il sous une lumière allumée ?
export const isLit = (game, p) => game.entities.some(e => e.isLight && e.on && Math.hypot(e.x - p.x, e.z - p.z) < e.radius);

// le guetteur w (x, z, et un angle `look` en radians, même repère que face) voit-il l'Ultra ?
// o : { range, cos (demi-cône), litRange (portée quand l'Ultra est éclairé) }
export function spots(game, w, look, o) {
  const p = game.player;
  if (!p || !p.alive || inSmoke(game, p)) return false;
  const dx = p.x - w.x, dz = p.z - w.z, d = Math.hypot(dx, dz) || 0.01;
  const lit = o.litRange && isLit(game, p);
  const inCone = d < o.range && (dx * Math.cos(look) - dz * Math.sin(look)) / d > o.cos;
  if (!inCone && !(lit && d < o.litRange)) return false;
  return clearLine(game, w.x, w.z, p.x, p.z);
}
