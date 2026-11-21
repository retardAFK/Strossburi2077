// Préfabriqué largué par le Promoteur (boîte LUXE/ÉCO, bureau vide, bobo-loft ; fiche docs/designs/promoteur.md).
// États : warn (cercle rouge au sol qui clignote), fall (chute), ground (obstacle tractable et verrouillable pendant
// TUNING.promoteur.prefabLife s), back (renvoyé au gaffe-grappin : il vole vers le Promoteur → boss.takePrefab()).
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';

const P = TUNING.promoteur, KINDS = ['prefab_boite', 'prefab_bureau', 'prefab_loft'];

export class Prefab extends Entity {
  constructor(game, { x, z, kind = 0, boss }) {
    super(game, { x, z, r: P.prefabR * 0.6, hp: 1, model: KINDS[kind % 3], scale: P.prefabScale });
    Object.assign(this, { boss, state: 'warn', st: 0, isPrefab: true, hitY: 0, grabR: P.prefabR });
    this.face = Math.random() * Math.PI * 2; this.y = 14; this.obj.visible = false;
    this.ring = new THREE.Mesh(new THREE.RingGeometry(P.prefabR * 0.8, P.prefabR, 16), new THREE.MeshBasicMaterial({ color: 0xff2040, side: THREE.DoubleSide, transparent: true, fog: false }));
    this.ring.rotation.x = -Math.PI / 2; this.ring.position.set(x, 0.05, z); game.renderer.scene.add(this.ring);
    this.circle = null; this.sync();
  }
  get lockable() { return this.state === 'ground'; }
  get grabbable() { return this.state === 'ground'; } // en l'air, le grappin passe à travers
  takeHit() {}
  // le gaffe-grappin l'accroche : renvoyé au Promoteur
  pull() {
    if (this.state !== 'ground') return;
    this.go('back'); if (this.circle) this.circle.on = false;
    this.game.audio.play('whip'); this.game.events.emit('prefab:return', this);
  }
  go(s) { this.state = s; this.st = 0; }
  update(dt) {
    this.time += dt; this.st += dt;
    if (this.state === 'warn') {
      this.ring.material.opacity = 0.4 + 0.5 * (Math.sin(this.time * 18) > 0 ? 1 : 0);
      if (this.st > P.aimTime) { this.go('fall'); this.obj.visible = true; }
    } else if (this.state === 'fall') {
      this.y = 14 * (1 - Math.min(1, this.st / P.fallTime));
      if (this.st >= P.fallTime) this.land();
    } else if (this.state === 'ground') {
      if (this.st > P.prefabLife - 1) this.obj.visible = Math.sin(this.time * 20) > 0; // va disparaître
      if (this.st > P.prefabLife) this.remove();
    } else if (this.state === 'back') {
      const b = this.boss, dx = b.x - this.x, dz = b.z - this.z, d = Math.hypot(dx, dz);
      this.y = Math.min(3, this.y + dt * 6); this.face += dt * 8;
      if (d < b.r + 0.8 || !b.alive) { if (b.alive) b.takePrefab(this); this.remove(); return; }
      const v = P.returnSpeed * dt; this.x += dx / d * Math.min(v, d); this.z += dz / d * Math.min(v, d);
    }
    this.sync();
  }
  land() {
    this.y = 0; this.go('ground'); this.ring.visible = false;
    const g = this.game, p = g.player;
    g.camera.shake = 0.35; g.audio.play('heavy'); g.particles.burst(this.x, 0.3, this.z, 16, 0x9a9080, 6);
    if (Math.hypot(p.x - this.x, p.z - this.z) < P.prefabR + p.r) p.takeHit(P.dropDmg, Math.sign(p.x - this.x) || 1, Math.sign(p.z - this.z), 10, this);
    this.circle = g.collision.addCircle(this.x, this.z, P.prefabR * 0.6, 'prop');
  }
  remove() { if (this.circle) this.circle.on = false; this.game.renderer.scene.remove(this.ring); super.remove(); }
}
