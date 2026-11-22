// Neige payante (générique, place Kléber) : congère de « neige de synthèse » BlingCo qui bouche un passage (boîte de
// collision). La flèche enflammée la fait fondre (onFire, proposition Cowork) : événement 'neige:fondue' (id).
// Sans design validé : bloc blanc + étiquette (placeholder). opts : { id, x, z, w, d, h? }.
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { placeholderLabel } from '../../systems/Placeholder.js';
import { TUNING } from '../../data/tuning.js';

export class NeigePayante extends Entity {
  constructor(game, { id, x, z, w, d, h = 1.8 }) {
    super(game, { x, z, r: Math.max(w, d) / 2, hp: 1 });
    Object.assign(this, { id, h, melting: 0, isTarget: true, lockable: true, hitY: 1, hitH: h + 0.5 });
    this.obj = new THREE.Group(); this.obj.position.set(x, 0, z);
    this.block = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color: 0xe8f0ff, flatShading: true }));
    this.block.position.y = h / 2; this.obj.add(this.block);
    this.obj.add(placeholderLabel(game, 'NEIGE PAYANTE', h + 0.4));
    game.renderer.scene.add(this.obj);
    this.box = game.collision.addBox(x - w / 2, x + w / 2, z - d / 2, z + d / 2, 'neige');
  }
  takeHit() { this.game.audio.play('ting'); } // l'écharpe et la flèche simple n'y font rien
  onFire() {
    if (this.melting) return;
    this.melting = 1e-3; this.box.on = false; this.isTarget = this.lockable = false;
    this.game.audio.play('laser'); this.game.particles.burst(this.x, 1, this.z, 20, 0xe8f0ff, 4);
    this.game.events.emit('neige:fondue', this.id, this);
  }
  update(dt) {
    if (!this.melting) return;
    this.melting += dt;
    const k = Math.max(0, 1 - this.melting / TUNING.neige.melt);
    this.block.scale.y = k; this.block.position.y = this.h * k / 2;
    if (Math.random() < 0.4) this.game.particles.burst(this.x, 0.5, this.z, 2, 0xbfe6ff, 2);
    if (k <= 0) { this.alive = false; this.remove(); }
  }
}
