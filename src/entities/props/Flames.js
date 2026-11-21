// Flammes tournantes (générique) : des bras de feu partent d'un centre (le four) et tournent ;
// l'Ultra touché est brûlé (la roulade passe à travers grâce à son invulnérabilité). Le bretzel les traverse.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };

export class Flames extends Entity {
  constructor(game, { x, z, arms, length, speed, width, dmg }) {
    super(game, { x, z, r: 0.5, hp: 1 });
    Object.assign(this, { arms, length, speed, width, dmg, angle: 0, isHazard: true });
    this.obj = new THREE.Group(); this.obj.position.set(x, 0.6, z);
    for (let i = 0; i < arms; i++) {
      const arm = new THREE.Group(); arm.rotation.y = i / arms * Math.PI * 2;
      for (const [c, w, h] of [[0xff5a1a, width * 2, 0.9], [0xffc040, width, 0.5]]) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(length, h, w), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.85, fog: false }));
        m.position.x = length / 2; arm.add(m);
      }
      this.obj.add(arm);
    }
    game.renderer.scene.add(this.obj);
  }
  update(dt) {
    this.time += dt; this.angle += this.speed * dt;
    this.obj.rotation.y = this.angle; this.obj.scale.y = 0.85 + 0.15 * Math.sin(this.time * 25);
    const p = this.game.player; if (!p.alive) return;
    const dx = p.x - this.x, dz = p.z - this.z, d = Math.hypot(dx, dz);
    if (d > this.length || d < 0.3) return;
    const a = Math.atan2(-dz, dx); // même convention que Object3D.rotation.y pour un bras le long de +x
    for (let i = 0; i < this.arms; i++) {
      const arm = this.angle + i / this.arms * Math.PI * 2;
      if (Math.abs(Math.sin(angDiff(arm, a))) * d < this.width + p.r * 0.5 && Math.cos(angDiff(arm, a)) > 0) {
        p.takeHit(this.dmg, dx / d, dz / d, 8, this); break;
      }
    }
  }
}
