// Règles de combat partagées : zone d'attaque en arc, dégâts, recul.
export class Combat {
  constructor(game) { this.game = game; }

  // attaquant {x,z,face} ; opts {range, arc (cos min), dmg, knock, targets, hitSet}
  swing(att, opts) {
    const fx = Math.cos(att.face), fz = -Math.sin(att.face);
    const hits = [];
    for (const t of opts.targets) {
      if (!t.alive || t.inv > 0 || opts.hitSet?.has(t)) continue;
      const dx = t.x - att.x, dz = t.z - att.z, d = Math.hypot(dx, dz) || 0.001;
      if (d > opts.range + t.r) continue;
      if ((dx * fx + dz * fz) / d < opts.arc) continue;
      opts.hitSet?.add(t);
      hits.push(t);
      t.takeHit(opts.dmg, dx / d, dz / d, opts.knock || 8, att);
    }
    return hits;
  }

  // dégâts de zone circulaire (onde de choc)
  blast(x, z, radius, dmg, knock, targets, from) {
    for (const t of targets) {
      if (!t.alive || t.inv > 0) continue;
      const dx = t.x - x, dz = t.z - z, d = Math.hypot(dx, dz) || 0.001;
      if (d < radius + t.r) t.takeHit(dmg, dx / d, dz / d, knock, from);
    }
  }
}
