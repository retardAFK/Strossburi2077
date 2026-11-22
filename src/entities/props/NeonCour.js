// Néon de cour (générique, Marché 2000) : un tube néon sur poteau qui éclaire un disque au sol. Sous un néon allumé,
// l'Ultra est vu de plus loin et sous tous les angles (systems/Stealth.js, entités `isLight`). Une flèche (ou un coup)
// le casse : il s'éteint pour de bon, 'neon:off' (lui-même). Sans design validé : poteau gris + tube coloré.
// opts : { id, x, z, radius?, color? }
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';

export class NeonCour extends Entity {
  constructor(game, { id, x, z, radius = TUNING.neonCour.radius, color = 0xff4fa3 }) {
    super(game, { x, z, r: 0.45, hp: 1 });
    Object.assign(this, { id, radius, color, isLight: true, on: true, isTarget: true, lockable: true, hitY: 3.2, hitH: 4 });
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 3.4, 6), new THREE.MeshLambertMaterial({ color: 0x4a4a54 }));
    pole.position.y = 1.7; this.obj.add(pole);
    this.tube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 0.14), new THREE.MeshBasicMaterial({ color, fog: false }));
    this.tube.position.y = 3.4; this.obj.add(this.tube);
    this.pool = new THREE.Mesh(new THREE.CircleGeometry(radius, 20), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, depthWrite: false, fog: false }));
    this.pool.rotation.x = -Math.PI / 2; this.pool.position.y = 0.05; this.obj.add(this.pool);
    game.renderer.scene.add(this.obj);
    game.collision.addCircle(x, z, 0.15, 'prop');
  }
  takeHit() { this.off(); }
  off() {
    if (!this.on) return;
    this.on = false; this.pool.visible = false; this.tube.material.color.setHex(0x2a2a30);
    this.game.audio.play('ting'); this.game.particles.burst(this.x, 3.4, this.z, 14, this.color, 5);
    this.game.events.emit('neon:off', this);
  }
  update(dt) {
    this.time += dt;
    if (this.on) this.pool.material.opacity = 0.16 + Math.sin(this.time * 9) * 0.02 * (Math.sin(this.time * 1.3) > 0.9 ? 4 : 1); // grésille
  }
}
