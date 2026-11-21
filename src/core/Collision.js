// Collisions 2D au sol : murs (boîtes AABB), piliers (cercles) et zones de déclenchement.
export class Collision {
  constructor() { this.boxes = []; this.circles = []; }
  addBox(x0, x1, z0, z1, tag) {
    const b = { x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1), tag, on: true };
    this.boxes.push(b); return b;
  }
  addCircle(x, z, r, tag) { const c = { x, z, r, tag, on: true }; this.circles.push(c); return c; }

  // repousse o {x,z} de rayon r hors des obstacles ; renvoie true si contact
  resolve(o, r) {
    let hit = false;
    for (const w of this.boxes) {
      if (!w.on) continue;
      const cx = Math.max(w.x0, Math.min(o.x, w.x1)), cz = Math.max(w.z0, Math.min(o.z, w.z1));
      const dx = o.x - cx, dz = o.z - cz, d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;
      hit = true;
      if (d2 > 1e-8) { const d = Math.sqrt(d2), p = (r - d) / d; o.x += dx * p; o.z += dz * p; }
      else {
        const opts = [[w.x0 - r - o.x, 0], [w.x1 + r - o.x, 0], [0, w.z0 - r - o.z], [0, w.z1 + r - o.z]];
        opts.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
        o.x += opts[0][0]; o.z += opts[0][1];
      }
    }
    for (const c of this.circles) {
      if (!c.on) continue;
      const dx = o.x - c.x, dz = o.z - c.z, d = Math.hypot(dx, dz), m = r + c.r;
      if (d < m && d > 1e-6) { o.x += dx / d * (m - d); o.z += dz / d * (m - d); hit = true; }
    }
    return hit;
  }
  static inRect(x, z, rect) { return x >= rect[0] && x <= rect[1] && z <= rect[2] && z >= rect[3]; }
}
