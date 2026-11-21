// Crochet de bannière (générique) : se verrouille à l'arc ; une flèche-bannière y accroche une bannière de sa couleur.
// Émet 'target:hit' (lui-même : group, key) pour une énigme OrderedSequence ; 'target:reset:<g>' → la bannière
// retombe ; 'target:lock:<g>' → elle reste. Sans design validé pour le crochet : petite pièce grise.
import * as THREE from 'three';
import { Entity } from '../Entity.js';

export class Crochet extends Entity {
  // opts : { x, z, y, group, key (indice de couleur), color }
  constructor(game, { x, z, y = 2.2, group, key, color }) {
    super(game, { x, z, r: 0.5, hp: 1 });
    Object.assign(this, { group, key, color, hookable: true, lockable: true, hitY: 0, banner: false, done: false });
    this.y = y;
    this.obj = new THREE.Group(); this.obj.position.set(x, y, z);
    this.obj.add(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 4, 8), new THREE.MeshLambertMaterial({ color: 0x9a9aa6 })));
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.38, 12), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, fog: false }));
    this.obj.add(ring); // repère de couleur, toujours visible
    this.flag = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.6), new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide }));
    this.flag.position.y = -0.95; this.flag.visible = false; this.obj.add(this.flag);
    game.renderer.scene.add(this.obj);
    game.events.on('target:reset:' + group, () => this.drop());
    game.events.on('target:lock:' + group, () => { this.done = true; });
  }
  takeHit() {} // une flèche simple ne fait rien
  hook() {
    if (this.done || this.banner) return;
    this.banner = true; this.flag.visible = true; this.flag.scale.y = 0.1;
    this.game.audio.play('pickup');
    this.game.events.emit('target:hit', this);
  }
  drop() { if (this.done) return; this.banner = false; this.flag.visible = false; }
  update(dt) {
    this.time += dt;
    if (this.flag.visible && this.flag.scale.y < 1) this.flag.scale.y = Math.min(1, this.flag.scale.y + dt * 3); // elle se déroule
    this.flag.rotation.y = Math.sin(this.time * 2) * 0.1;
  }
}
