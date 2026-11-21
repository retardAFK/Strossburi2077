// Petites particules cubiques (étincelles, débris, confettis).
import * as THREE from 'three';

const GEO = new THREE.BoxGeometry(0.16, 0.16, 0.16);
export class Particles {
  constructor(scene) { this.scene = scene; this.list = []; }
  burst(x, y, z, n, color, speed = 6) {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(GEO, new THREE.MeshBasicMaterial({ color }));
      m.position.set(x, y, z); this.scene.add(m);
      this.list.push({ m, v: new THREE.Vector3((Math.random() - 0.5) * 2 * speed, Math.random() * 1.5 * speed + 2, (Math.random() - 0.5) * 2 * speed), life: 0.4 + Math.random() * 0.4 });
    }
  }
  update(dt) {
    for (const p of this.list) {
      p.life -= dt; p.v.y -= 20 * dt; p.m.position.addScaledVector(p.v, dt);
      if (p.m.position.y < 0.08) { p.m.position.y = 0.08; p.v.multiplyScalar(0.5); }
    }
    for (let i = this.list.length - 1; i >= 0; i--) if (this.list[i].life <= 0) { this.scene.remove(this.list[i].m); this.list[i].m.material.dispose(); this.list.splice(i, 1); }
  }
}
