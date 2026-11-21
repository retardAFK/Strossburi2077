// Projectile : contrat holographique qui vole en tournoyant. L'écharpe peut le renvoyer.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

export class Contrat extends Entity {
  constructor(game, { x, z, face, speed, dmg, owner = 'enemy' }) {
    super(game, { x, z, face, r: 0.35, hp: 1 });
    this.speed = speed; this.dmg = dmg; this.owner = owner; this.life = 3; this.isProjectile = true;
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.75),
      new THREE.MeshBasicMaterial({ color: owner === 'enemy' ? 0xffe0f0 : 0x9ff6ff, side: THREE.DoubleSide, fog: false }));
    game.renderer.scene.add(this.obj);
  }
  // frappé par l'écharpe : renvoyé vers l'expéditeur
  takeHit(dmg, nx, nz) { this.owner = 'player'; this.face = Math.atan2(-nz, nx); this.speed *= 1.4; this.life = 3; this.obj.material.color.setHex(0x9ff6ff); this.game.audio.play('ting'); }
  update(dt) {
    this.life -= dt; this.time += dt;
    this.x += this.fx * this.speed * dt; this.z += this.fz * this.speed * dt;
    const blocked = this.game.collision.resolve({ x: this.x, z: this.z }, 0.2);
    const targets = this.owner === 'enemy' ? [this.game.player] : this.game.entities.filter(e => e.isEnemy && e.alive);
    for (const t of targets) {
      if (t.alive && Math.hypot(t.x - this.x, t.z - this.z) < t.r + this.r) { t.takeHit(this.owner === 'enemy' ? this.dmg : 2, this.fx, this.fz, 8, this); this.life = 0; break; }
    }
    if (blocked) this.life = 0;
    if (this.life <= 0) { this.game.particles.burst(this.x, 1.2, this.z, 6, 0xffe0f0, 3); this.remove(); return; }
    this.obj.position.set(this.x, 1.3 + Math.sin(this.time * 10) * 0.1, this.z);
    this.obj.rotation.set(this.time * 8, this.time * 12, 0);
  }
}
