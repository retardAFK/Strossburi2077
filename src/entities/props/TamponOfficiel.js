// Tampon officiel (place Kléber) : objet de quête, il en faut trois pour « signer » la vente de la ville. E à portée
// → l'Ultra le prend : événement 'tampon:pris' (id). Sans design validé : petit tampon doré stylisé + étiquette.
// opts : { id, x, z }.
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { interact, clearPrompt } from '../../systems/Interact.js';
import { placeholderLabel } from '../../systems/Placeholder.js';

export class TamponOfficiel extends Entity {
  constructor(game, { id, x, z }) {
    super(game, { x, z, r: 0.4, hp: 1 });
    this.id = id; this.isTampon = true;
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z);
    const gold = new THREE.MeshBasicMaterial({ color: 0xffc040, fog: false });
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.35), gold); foot.position.y = 0.9;
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.35, 6), gold); handle.position.y = 1.15;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 5), new THREE.MeshBasicMaterial({ color: 0x5a2a9a, fog: false })); knob.position.y = 1.38;
    this.item = new THREE.Group(); this.item.add(foot, handle, knob); this.obj.add(this.item);
    this.obj.add(placeholderLabel(game, 'TAMPON OFFICIEL', 1.9));
    game.renderer.scene.add(this.obj);
  }
  takeHit() {}
  take() {
    clearPrompt(this); this.alive = false;
    this.game.audio.play('pickup'); this.game.particles.burst(this.x, 1.1, this.z, 14, 0xffc040, 4);
    this.game.events.emit('tampon:pris', this.id, this);
    this.remove();
  }
  update(dt) {
    this.time += dt;
    this.item.rotation.y = this.time * 2; this.item.position.y = Math.sin(this.time * 3) * 0.08;
    if (interact(this, this.game.texts.prompts.tampon, 2.2)) this.take();
  }
}
