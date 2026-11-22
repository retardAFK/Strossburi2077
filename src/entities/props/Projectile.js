// Projectile générique (assiette, bouchon...) : vole tout droit, s'écrase sur les murs,
// et l'écharpe peut le renvoyer vers les ennemis. Option slow: { k, t, text } : s'il touche l'Ultra, il le ralentit.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

// formes simples, pas de .glb
const SHAPES = {
  assiette() {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.26, 0.05, 10), new THREE.MeshBasicMaterial({ color: 0xf4f6ff, fog: false })));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 4, 10), new THREE.MeshBasicMaterial({ color: 0xffc040, fog: false }));
    rim.rotation.x = Math.PI / 2; rim.position.y = 0.03; g.add(rim);
    return g;
  },
  ticket() { // ticket d'addition qui vole à plat
    return new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.6), new THREE.MeshBasicMaterial({ color: 0xfffbe8, side: THREE.DoubleSide, fog: false }));
  },
  etiquette() { // étiquette de prix « x10 » du Marché 2000 : orange, liseré rouge
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.32), new THREE.MeshBasicMaterial({ color: 0xff8a1a, fog: false })));
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.08), new THREE.MeshBasicMaterial({ color: 0xff1a3c, fog: false }));
    s.position.y = 0.01; g.add(s);
    return g;
  },
  bouchon() {
    return new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.2, 6), new THREE.MeshBasicMaterial({ color: 0xc89a5a, fog: false }));
  }
};

export class Projectile extends Entity {
  constructor(game, { x, z, face, speed, dmg, shape, y = 1.3, spin = 12, life = 3, r = 0.35, slow = null }) {
    super(game, { x, z, face, r, hp: 1 });
    Object.assign(this, { speed, dmg, y, spin, life, slow, owner: 'enemy', isProjectile: true });
    this.obj = SHAPES[shape](); game.renderer.scene.add(this.obj);
    this.place();
  }
  // frappé par l'écharpe : renvoyé dans la direction du coup, plus vite
  takeHit(dmg, nx, nz) {
    this.owner = 'player'; this.face = Math.atan2(-nz, nx); this.speed *= 1.4; this.life = 3;
    this.game.audio.play('ting');
  }
  place() {
    this.obj.position.set(this.x, this.y, this.z);
    this.obj.rotation.set(0, this.time * this.spin, this.face);
  }
  update(dt) {
    this.life -= dt; this.time += dt;
    this.x += this.fx * this.speed * dt; this.z += this.fz * this.speed * dt;
    const blocked = this.game.collision.resolve({ x: this.x, z: this.z }, 0.15);
    const targets = this.owner === 'enemy' ? [this.game.player] : this.game.entities.filter(e => e.isEnemy && e.alive);
    for (const t of targets) {
      if (t.alive && Math.hypot(t.x - this.x, t.z - this.z) < t.r + this.r) {
        if (this.owner === 'enemy' && this.slow && !(t.inv > 0)) t.slowDown?.(this.slow);
        t.takeHit(this.owner === 'enemy' ? this.dmg : 2, this.fx, this.fz, 8, this); this.life = 0; break;
      }
    }
    if (blocked) this.life = 0;
    if (this.life <= 0) { this.game.particles.burst(this.x, this.y, this.z, 6, 0xf4f6ff, 3); this.remove(); return; }
    this.place();
  }
}
