// Objet lourd qu'on tire au gaffe-grappin (générique : conteneur, caisse de marinier...). pull(from) : il glisse
// d'un pas (TUNING.pull.step) vers l'Ultra, le long de son axe ('x' ou 'z'), sans sortir de [min, max]. Obstacle
// (boîte de collision qui le suit). Sans modèle : placeholder gris étiqueté (designs attendus de Cowork).
// opts : { id, x, z, w, d, h, axis, min, max, model?, label, color? }. Émet 'pull:moved' (lui-même) à chaque arrêt.
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';
import { placeholderLabel } from '../../systems/Placeholder.js';

const P = TUNING.pull;

export class Tractable extends Entity {
  constructor(game, o) {
    super(game, { x: o.x, z: o.z, r: Math.max(o.w, o.d) / 2, hp: 1 });
    Object.assign(this, { id: o.id, w: o.w, d: o.d, axis: o.axis || 'z', min: o.min ?? -Infinity, max: o.max ?? Infinity, lockable: true, hitY: 0, goal: null });
    this.grabR = Math.max(o.w, o.d) / 2 + 0.3;
    this.obj = new THREE.Group(); this.obj.position.set(o.x, 0, o.z);
    const box = new THREE.Mesh(new THREE.BoxGeometry(o.w, o.h || 2.4, o.d), new THREE.MeshLambertMaterial({ color: o.color ?? 0x8a8a90 }));
    box.position.y = (o.h || 2.4) / 2; this.obj.add(box);
    for (const s of [-1, 1]) { // nervures, pour voir qu'il glisse
      const r = new THREE.Mesh(new THREE.BoxGeometry(o.axis === 'x' ? 0.08 : o.w + 0.04, (o.h || 2.4) - 0.2, o.axis === 'x' ? o.d + 0.04 : 0.08), new THREE.MeshLambertMaterial({ color: 0x5a5a62 }));
      r.position.set(o.axis === 'x' ? s * o.w / 4 : 0, (o.h || 2.4) / 2, o.axis === 'x' ? 0 : s * o.d / 4); this.obj.add(r);
    }
    if (o.label) this.obj.add(placeholderLabel(game, o.label, (o.h || 2.4) + 0.5));
    game.renderer.scene.add(this.obj);
    this.box = game.collision.addBox(o.x - o.w / 2, o.x + o.w / 2, o.z - o.d / 2, o.z + o.d / 2, 'prop');
  }
  takeHit() {}
  pull(from) {
    if (this.goal !== null) return;
    const k = this.axis === 'x' ? 'x' : 'z', dir = Math.sign(from[k] - this[k]) || 1;
    const goal = Math.max(this.min, Math.min(this.max, this[k] + dir * P.step));
    if (goal === this[k]) { this.game.audio.play('ting'); return; } // en butée
    this.goal = goal; this.game.audio.play('heavy'); this.game.camera.shake = 0.15;
  }
  update(dt) {
    if (this.goal === null) return;
    const k = this.axis === 'x' ? 'x' : 'z', d = this.goal - this[k], step = Math.sign(d) * Math.min(Math.abs(d), P.speed * dt);
    this[k] += step;
    if (Math.abs(this.goal - this[k]) < 1e-3) { this[k] = this.goal; this.goal = null; this.game.events.emit('pull:moved', this); }
    Object.assign(this.box, { x0: this.x - this.w / 2, x1: this.x + this.w / 2, z0: this.z - this.d / 2, z1: this.z + this.d / 2 });
    this.obj.position.set(this.x, 0, this.z);
    if (Math.random() < 0.3) this.game.particles.burst(this.x, 0.2, this.z, 2, 0x9a9080, 2);
  }
}

