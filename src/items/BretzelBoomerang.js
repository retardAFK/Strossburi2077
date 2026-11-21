// Bretzel-boomerang (objet du niveau 1) : lancé devant l'Ultra (ou vers la cible verrouillée), il décrit
// une courbe, touche à distance ennemis, bornes, terminaux et cibles, puis revient. Un seul en vol.
// Il passe au-dessus de l'eau et des vitres « anti-écharpe », mais pas à travers les murs.
import { Entity } from '../entities/Entity.js';
import { TUNING } from '../data/tuning.js';

const B = TUNING.boomerang;
const PASS = new Set(['water', 'vitre', 'gate', 'switch', 'terminal', 'plaque']); // obstacles qu'il survole

function wallAt(col, x, z) {
  for (const w of col.boxes) if (w.on && !PASS.has(w.tag) && x > w.x0 && x < w.x1 && z > w.z0 && z < w.z1) return true;
  return false;
}

class Flight extends Entity {
  constructor(game, item) {
    const p = game.player;
    super(game, { x: p.x, z: p.z, r: B.radius, hp: 1, model: 'bretzel_boomerang', scale: B.scale });
    this.item = item; this.isPlayerShot = true; this.hit = new Set(); this.state = 'out'; this.d = 0;
    const t = p.target;
    const ang = t ? Math.atan2(-(t.z - p.z), t.x - p.x) : p.face; // même convention que Entity.face
    this.dir = { x: Math.cos(ang), z: -Math.sin(ang) }; this.side = { x: -this.dir.z, z: this.dir.x };
    this.ox = p.x; this.oz = p.z; this.range = t ? Math.min(B.range, p.dist(t) + 1.5) : B.range;
    this.y = p.y + B.height;
    game.audio.play('whip');
  }
  update(dt) {
    this.time += dt;
    const p = this.game.player;
    if (this.state === 'out') {
      this.d += B.speed * (1 - 0.6 * this.d / this.range) * dt;
      const curve = B.curve * Math.sin(Math.PI * this.d / this.range);
      const nx = this.ox + this.dir.x * this.d + this.side.x * curve, nz = this.oz + this.dir.z * this.d + this.side.z * curve;
      if (wallAt(this.game.collision, nx, nz) || this.d >= this.range) this.state = 'back';
      else { this.x = nx; this.z = nz; }
    } else {
      const dx = p.x - this.x, dz = p.z - this.z, d = Math.hypot(dx, dz);
      if (d < B.catch || this.time > B.maxTime) { this.item.ready = true; this.remove(); return; }
      const v = B.speed * 1.15 * dt; this.x += dx / d * Math.min(v, d); this.z += dz / d * Math.min(v, d);
    }
    this.y += (p.y + B.height - this.y) * Math.min(1, dt * 4);
    this.touch();
    this.obj.position.set(this.x, this.y, this.z);
    this.obj.rotation.set(-Math.PI / 2, 0, this.time * B.spin);
  }
  // touche chaque cible une fois par lancer
  touch() {
    for (const e of this.game.entities) {
      if (e === this || this.hit.has(e) || !e.alive) continue;
      if (!(e.isEnemy || e.isSwitch || e.isTerminal || e.isTarget)) continue;
      if (e.isTarget && this.state === 'back') continue; // au retour, il ne valide pas une cible par accident (ordre)
      const dx = e.x - this.x, dz = e.z - this.z, d = Math.hypot(dx, dz) || 0.01;
      if (d > e.r + this.r) continue;
      this.hit.add(e);
      e.takeHit(B.dmg, dx / d, dz / d, B.knock, this);
      this.game.particles.burst(this.x, this.y, this.z, 8, 0xffc040, 3);
      if (e.isEnemy) { this.game.hitstop = 0.04; if (this.state === 'out') this.state = 'back'; }
      if (e.isTarget && this.state === 'out') this.state = 'back'; // une cible à la fois
    }
  }
}

export class BretzelBoomerang {
  constructor(game) { this.game = game; this.id = 'boomerang'; this.ready = true; }
  use() { this.ready = false; this.game.add(new Flight(this.game, this)); }
}
