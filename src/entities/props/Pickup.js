// Bretzel de vie qui tourne au sol (lâché par les costards).
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';

function bretzelMesh() {
  const g = new THREE.Group(), mat = new THREE.MeshLambertMaterial({ color: 0xc0702a, flatShading: true });
  for (let i = 0; i < 22; i++) {
    const t = i / 22 * Math.PI * 2;
    const x = 0.5 * Math.sin(t) * (1 + 0.35 * Math.cos(t)), y = 0.32 * Math.cos(t) * (1 - 0.6 * Math.sin(t) ** 2) + 0.12 * Math.cos(2 * t);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 5, 4), mat); b.position.set(x * 0.9, y * 0.9, 0); g.add(b);
  }
  return g;
}

export class Pickup extends Entity {
  constructor(game, { x, z }) {
    super(game, { x, z, r: 0.6 });
    this.obj = bretzelMesh(); game.renderer.scene.add(this.obj);
  }
  update(dt) {
    this.time += dt;
    this.obj.position.set(this.x, 0.7 + Math.sin(this.time * 4) * 0.15, this.z);
    this.obj.rotation.y += dt * 3;
    const p = this.game.player;
    if (p.alive && Math.hypot(p.x - this.x, p.z - this.z) < 1.2) {
      p.heal(TUNING.pickup.heal); this.game.audio.play('pickup');
      this.game.particles.burst(this.x, 1, this.z, 8, 0xffd23f, 3);
      this.remove();
    }
  }
}
