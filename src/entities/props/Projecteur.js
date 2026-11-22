// Projecteur (générique, le Kalt) : appareil électrique qui alimente un portique ou une porte. Une flèche simple
// rebondit ; la flèche court-circuit le coupe pour de bon (proposition Cowork, à valider en jouant) :
// événement 'projo:off' (id). Sans design validé : placeholder gris étiqueté. opts : { id, x, z, label?, color? }.
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { placeholderLabel } from '../../systems/Placeholder.js';

export class Projecteur extends Entity {
  constructor(game, { id, x, z, label = 'PROJECTEUR', color = 0xff4fa3 }) {
    super(game, { x, z, r: 0.45, hp: 1 });
    Object.assign(this, { id, on: true, isTarget: true, lockable: true, hitY: 2.4, hitH: 3.2 });
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.2, 6), new THREE.MeshLambertMaterial({ color: 0x5a5a62 }));
    pole.position.y = 1.1; this.obj.add(pole);
    this.head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.45), new THREE.MeshBasicMaterial({ color, fog: false }));
    this.head.position.y = 2.4; this.obj.add(this.head);
    this.obj.add(placeholderLabel(game, label, 3.1));
    game.renderer.scene.add(this.obj);
  }
  takeHit() { this.game.audio.play('ting'); }
  onShort() {
    if (!this.on) return;
    this.on = false; this.head.material.color.setHex(0x2a2a30);
    this.game.particles.burst(this.x, 2.4, this.z, 16, 0x38f2ff, 5); this.game.audio.play('laser');
    this.game.events.emit('projo:off', this.id, this);
  }
  update(dt) {
    this.time += dt;
    if (this.on) this.head.rotation.y = Math.sin(this.time * 3) * 0.4;
  }
}
