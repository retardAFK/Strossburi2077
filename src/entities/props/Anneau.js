// Anneau d'amarrage (générique) : le gaffe-grappin s'y accroche et l'Ultra est tiré jusqu'à `land` { x, z }
// (au-dessus de l'eau, d'un fossé). Verrouillable quand le gaffe est équipé. Forme simple : anneau d'acier sur un
// poteau (ou suspendu au crochet d'une grue : post = false). Pas de design dédié : pièce générique.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

export class Anneau extends Entity {
  constructor(game, { x, z, y = 2.6, land, post = true, id = null }) {
    super(game, { x, z, r: 0.6, hp: 1 });
    Object.assign(this, { id, land, isAnchor: true, lockable: true, hitY: 0, grabR: 0.9 });
    this.y = y;
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z);
    const steel = new THREE.MeshLambertMaterial({ color: 0xb8bcc8 });
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.07, 5, 10), steel);
    this.ring.position.y = y; this.obj.add(this.ring);
    // repère bleu-blanc : on voit de loin où s'accrocher
    const mark = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.55, 12), new THREE.MeshBasicMaterial({ color: 0x38f2ff, side: THREE.DoubleSide, fog: false }));
    mark.position.y = y; this.obj.add(mark); this.mark = mark;
    if (post) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.25, y - 0.3, 0.25), new THREE.MeshLambertMaterial({ color: 0x6a6a72 }));
      m.position.y = (y - 0.3) / 2; this.obj.add(m);
      game.collision.addCircle(x, z, 0.3, 'pillar');
    } else {
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.04, 4, 0.04), new THREE.MeshLambertMaterial({ color: 0x222222 }));
      c.position.y = y + 2.3; this.obj.add(c); // câble de grue
    }
    game.renderer.scene.add(this.obj);
  }
  takeHit() {}
  update(dt) {
    this.time += dt;
    this.ring.rotation.y = this.time * 1.5; this.mark.rotation.y = this.ring.rotation.y;
    this.mark.material.opacity = 1;
  }
}
