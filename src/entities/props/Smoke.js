// Nuage de fumée bleue (flèche fumigène) : grossit, flotte puis se dissipe ; tant qu'il dure, les sbires dedans
// sont aveuglés (ils perdent l'Ultra de vue) et l'Ultra caché dedans n'est plus vu. Réglages : TUNING.arrowFx.smoke.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

export class Smoke extends Entity {
  constructor(game, { x, z, radius, life, blind }) {
    super(game, { x, z, r: radius, hp: 1 });
    Object.assign(this, { radius, life, blindT: blind, isSmoke: true });
    this.obj = new THREE.Group(); this.puffs = [];
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(new THREE.IcosahedronGeometry(radius * 0.45, 0),
        new THREE.MeshBasicMaterial({ color: i % 2 ? 0x5f8ee8 : 0x9ec2ff, transparent: true, opacity: 0.55, depthWrite: false }));
      const a = i / 7 * Math.PI * 2; m.position.set(Math.cos(a) * radius * 0.45, 0.6 + (i % 3) * 0.4, Math.sin(a) * radius * 0.45);
      this.obj.add(m); this.puffs.push(m);
    }
    this.obj.position.set(x, 0, z); this.obj.scale.setScalar(0.2); game.renderer.scene.add(this.obj);
    game.audio.play('roll');
  }
  contains(o) { return Math.hypot(o.x - this.x, o.z - this.z) < this.radius; }
  update(dt) {
    this.time += dt;
    const k = Math.min(1, this.time * 3), fade = Math.min(1, Math.max(0, (this.life - this.time) / 1.2));
    this.obj.scale.setScalar(0.2 + 0.8 * k);
    this.puffs.forEach((m, i) => { m.rotation.y += dt * (0.5 + i * 0.1); m.material.opacity = 0.55 * fade; });
    const p = this.game.player;
    for (const e of this.game.entities) {
      if (!e.isSbire || !e.alive) continue;
      if (this.contains(e) || (p && this.contains(p))) e.blind(this.blindT); // dedans, ou l'Ultra caché dedans
    }
    if (this.time > this.life) this.remove();
  }
}
