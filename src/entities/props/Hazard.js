// Zone dangereuse au sol (générique) : un cercle d'avertissement, puis la zone brûle et blesse l'Ultra
// tant qu'il reste dedans (plats brûlants de l'ASR-67...). Disparaît seule.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

export class Hazard extends Entity {
  constructor(game, { x, z, r, warn, life, dmg, color = 0xff5a1a }) {
    super(game, { x, z, r, hp: 1 });
    Object.assign(this, { warn, life, dmg, isHazard: true });
    this.obj = new THREE.Group();
    this.ring = new THREE.Mesh(new THREE.RingGeometry(r * 0.85, r, 20), new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide, fog: false }));
    this.disc = new THREE.Mesh(new THREE.CircleGeometry(r, 20), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, side: THREE.DoubleSide, fog: false }));
    for (const m of [this.ring, this.disc]) { m.rotation.x = -Math.PI / 2; this.obj.add(m); }
    this.obj.position.set(x, 0.05, z); game.renderer.scene.add(this.obj);
  }
  update(dt) {
    this.time += dt;
    const hot = this.time > this.warn;
    this.ring.material.opacity = hot ? 1 : 0.4 + 0.4 * Math.sin(this.time * 20);
    this.disc.material.opacity = hot ? 0.55 + 0.2 * Math.sin(this.time * 12) : this.time / this.warn * 0.25;
    const p = this.game.player;
    if (hot && p.alive && this.dist(p) < this.r + p.r * 0.5) {
      const d = this.dist(p) || 1; p.takeHit(this.dmg, (p.x - this.x) / d, (p.z - this.z) / d, 6, this);
    }
    if (this.time > this.warn + this.life) this.remove();
  }
}
