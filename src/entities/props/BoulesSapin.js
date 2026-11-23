// Boules du Grand Sapin (place Kléber) : sphères dorées et rouges réparties sur un cône (le sapin du décor), qui
// scintillent doucement. Le vrai Grand Sapin porte des boules dorées et rouges (noel.strasbourg.eu). Décoratif.
// opts : { x, z, h: hauteur du cône (m), r: rayon à la base (m), y0: bas des branches (m), n: nombre de boules }.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

const COLORS = [0xffc040, 0xd81e2c];

export class BoulesSapin extends Entity {
  constructor(game, { x, z, h = 10, r = 3, y0 = 1.2, n = 60 }) {
    super(game, { x, z, r: 0, hp: 1 });
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z); this.balls = [];
    for (let i = 0; i < n; i++) {
      const k = (i + 0.5) / n, y = y0 + k * (h - y0), a = i * 2.4; // spirale régulière (angle d'or) : pas d'aléatoire
      const rr = r * (1 - (y - y0) / (h - y0)) + 0.15;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 6, 5), new THREE.MeshBasicMaterial({ color: COLORS[i % 2], fog: false }));
      m.position.set(Math.cos(a) * rr, y, Math.sin(a) * rr); this.obj.add(m); this.balls.push(m);
    }
    game.renderer.scene.add(this.obj);
  }
  takeHit() {}
  update(dt) {
    this.time += dt;
    this.balls.forEach((b, i) => b.scale.setScalar(0.85 + 0.25 * Math.max(0, Math.sin(this.time * 2 + i))));
  }
}
