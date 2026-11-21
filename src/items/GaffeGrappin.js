// Gaffe-grappin (objet du niveau 3, fiche docs/designs/gaffe-grappin.md) : le crochet part vers la cible verrouillée
// (sinon droit devant), relié par une corde bleu-blanc, et revient. Ce qu'il accroche décide :
//  - un anneau (isAnchor) : l'Ultra est tiré jusqu'à son point d'arrivée (au-dessus de l'eau, des fossés) ;
//  - un objet « tractable » (pull(from) : conteneur, caisse, préfabriqué du Promoteur) : l'objet réagit ;
//  - un ennemi : tiré vers l'Ultra, et un sbire est étourdi.
// Le verrouillage accroche aussi les entités `lockable` (anneaux, conteneurs) quand le gaffe est équipé.
// Événements : 'gaffe:hook' (entité accrochée), 'gaffe:zip' (anneau), 'gaffe:land' (anneau, arrivée).
import * as THREE from 'three';
import { Entity } from '../entities/Entity.js';
import { Weapon } from './Weapon.js';
import { TUNING } from '../data/tuning.js';

const G = TUNING.gaffe;
const PASS = new Set(['water', 'vitre', 'gate', 'switch', 'terminal', 'plaque', 'target', 'gap']); // survolés

class Hook extends Entity {
  constructor(game, item) {
    const p = game.player;
    super(game, { x: p.x, z: p.z, r: G.hitR, hp: 1 });
    this.item = item; this.isPlayerShot = true; this.state = 'out'; this.d = 0; this.caught = null;
    const t = p.target; this.target = t;
    const ang = t ? Math.atan2(-(t.z - p.z), t.x - p.x) : p.face;
    if (t) p.face = ang;
    this.dir = { x: Math.cos(ang), z: -Math.sin(ang) }; this.ox = p.x; this.oz = p.z;
    this.range = t ? Math.min(G.range, p.dist(t) + 1) : G.range;
    this.y = p.y + G.height; this.ty = t ? (t.y || 0) + (t.hitY ?? 1) : this.y;
    this.obj = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.4, 4), new THREE.MeshLambertMaterial({ color: 0xb8bcc8 }));
    this.obj.rotation.set(0, 0, -Math.PI / 2); game.renderer.scene.add(this.obj);
    game.audio.play('whip');
  }
  wall(x, z) {
    for (const w of this.game.collision.boxes) if (w.on && !PASS.has(w.tag) && x > w.x0 && x < w.x1 && z > w.z0 && z < w.z1) return true;
    return false;
  }
  update(dt) {
    this.time += dt;
    const p = this.game.player;
    if (this.state === 'out') {
      this.d += G.speed * dt;
      const nx = this.ox + this.dir.x * this.d, nz = this.oz + this.dir.z * this.d;
      this.x = nx; this.z = nz; this.y += (this.ty - this.y) * Math.min(1, dt * 8);
      this.touch(); // avant les murs : un conteneur est lui-même un obstacle
      if (this.state === 'out' && (this.wall(nx, nz) || this.d >= this.range)) this.state = 'back';
    } else if (this.state === 'zip') return this.zipUpdate(dt);
    else {
      const dx = p.x - this.x, dz = p.z - this.z, d = Math.hypot(dx, dz);
      if (d < 0.8 || this.time > 3) return this.done();
      const v = G.back * dt; this.x += dx / d * Math.min(v, d); this.z += dz / d * Math.min(v, d);
      this.y += (p.y + G.height - this.y) * Math.min(1, dt * 6);
    }
    this.obj.position.set(this.x, this.y, this.z); this.obj.rotation.y = Math.atan2(-this.dir.z, this.dir.x);
  }
  // première chose accrochable sur le trajet
  touch() {
    const t = this.target;
    for (const e of this.game.entities) {
      if (e === this || e === this.game.player || !e.alive || e.isProjectile) continue;
      if (!(e.isAnchor || e.pull || e.isEnemy)) continue;
      if (t && e !== t && !e.isEnemy) continue; // verrouillé : on n'accroche que la cible (ou un ennemi en travers)
      if (e.isAnchor && Math.hypot(e.x - this.ox, e.z - this.oz) < 2) continue; // l'anneau sous lequel on se tient
      if (Math.hypot(e.x - this.x, e.z - this.z) > (e.grabR || e.r) + this.r) continue;
      this.caught = e; this.game.events.emit('gaffe:hook', e);
      this.game.particles.burst(this.x, this.y, this.z, 8, 0xf4f6ff, 3); this.game.audio.play('ting');
      if (e.isAnchor) return this.startZip(e);
      if (e.pull) e.pull(this.game.player);
      else this.yank(e);
      this.state = 'back'; return;
    }
  }
  // ennemi : tiré vers l'Ultra (et étourdi si c'est un sbire) ; le boss, lui, ne bouge pas
  yank(e) {
    if (e.isBoss || e.isHydraHead) return;
    const p = this.game.player, dx = p.x - e.x, dz = p.z - e.z, d = Math.hypot(dx, dz) || 1;
    e.vx = dx / d * G.enemyPull * 2; e.vz = dz / d * G.enemyPull * 2;
    e.stun?.(G.stun);
  }
  startZip(a) {
    const p = this.game.player;
    this.state = 'zip'; this.anchor = a; this.zx = p.x; this.zz = p.z; this.zt = 0;
    this.zd = Math.hypot(a.land.x - p.x, a.land.z - p.z) || 1;
    p.target = null; p.setState('zip'); p.inv = Math.max(p.inv, 0.5);
    p.face = Math.atan2(-(a.land.z - p.z), a.land.x - p.x);
    this.game.events.emit('gaffe:zip', a);
  }
  // l'Ultra file vers l'anneau (position imposée après sa propre mise à jour : il survole l'eau et les fossés)
  zipUpdate(dt) {
    const p = this.game.player, a = this.anchor;
    this.zt = Math.min(1, this.zt + G.zip * dt / this.zd);
    p.x = this.zx + (a.land.x - this.zx) * this.zt; p.z = this.zz + (a.land.z - this.zz) * this.zt; p.inv = Math.max(p.inv, 0.2);
    p.y = Math.sin(this.zt * Math.PI) * 1.2; p.sync();
    this.x = a.x; this.z = a.z; this.y = a.y || 2;
    this.obj.position.set(this.x, this.y, this.z);
    if (this.zt >= 1) {
      p.y = 0; p.setState('idle');
      this.game.events.emit('gaffe:land', a); this.done();
    }
  }
  done() { this.item.ready = true; this.item.hook = null; this.remove(); }
}

export class GaffeGrappin extends Weapon {
  constructor(game) {
    super(game, 'gaffe');
    this.locksProps = true; this.hook = null; this.cd = 0; this.equipped = false;
    // état « filer vers un anneau » de l'Ultra : rien ne bouge, c'est le crochet qui le tire
    const p = game.player;
    if (p && !p.states.zip) p.states.zip = { update() {} };
    this.model = game.assets.protos.gaffe_grappin ? game.assets.instance('gaffe_grappin') : null;
    if (this.model) this.model.scale.setScalar(G.scale);
    const pts = new Float32Array(3 * 2 * 8), cols = new Float32Array(3 * 2 * 8);
    for (let i = 0; i < 16; i++) { const c = Math.floor(i / 2) % 2 ? [1, 1, 1] : [0.12, 0.37, 0.82]; cols.set(c, i * 3); }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3)); geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    this.rope = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true }));
    this.rope.frustumCulled = false; this.rope.visible = false; game.renderer.scene.add(this.rope);
  }
  equip() { this.equipped = true; const p = this.game.player; if (this.model && p) { p.obj.add(this.model); this.model.position.set(...G.hand.pos); } }
  unequip() { this.equipped = false; this.model?.removeFromParent(); }
  use() {
    if (this.hook || this.cd > 0) return;
    this.ready = false; this.cd = G.cooldown;
    this.hook = this.game.add(new Hook(this.game, this));
  }
  update(dt) {
    this.cd = Math.max(0, this.cd - dt);
    if (!this.hook && this.cd <= 0) this.ready = true;
    const h = this.hook, p = this.game.player;
    this.rope.visible = !!h && !h.removed;
    if (!this.rope.visible || !p) return;
    // corde : 8 segments alternés bleu / blanc entre la main et le crochet
    const a = this.rope.geometry.attributes.position, sx = p.x + p.fx * 0.3, sy = p.y + G.height, sz = p.z + p.fz * 0.3;
    for (let i = 0; i < 8; i++) for (let k = 0; k < 2; k++) {
      const t = (i + k) / 8; a.setXYZ(i * 2 + k, sx + (h.x - sx) * t, sy + (h.y - sy) * t - Math.sin(t * Math.PI) * 0.15, sz + (h.z - sz) * t);
    }
    a.needsUpdate = true;
  }
}
