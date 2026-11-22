// Lettre néon d'enseigne (générique, Marché 2000 : « MARCHÉ 2000 ») : une lettre dessinée sur un panneau, allumée ou
// éteinte. Une lettre éteinte est une cible de l'arc : touchée, elle se rallume et émet 'target:hit' (elle-même :
// group, key) pour une énigme OrderedSequence ; 'target:reset:<g>' → elle se rééteint ; 'target:lock:<g>' → elle reste.
// Le panneau est visible des deux côtés : vue de derrière (depuis le toit), la lettre est à l'envers.
// opts : { x, z, y, char, lit, group, key, rotY }
import * as THREE from 'three';
import { Entity } from '../Entity.js';

const ON = '#ff7a1a', OFF = '#3a2a1a';

export class LettreNeon extends Entity {
  constructor(game, { x, z, y = 2.4, char, lit = true, group, key, rotY = 0 }) {
    super(game, { x, z, r: 0.5, hp: 1 });
    Object.assign(this, { group, key, char, lit, done: lit, hitY: 0, hitH: y + 1 });
    this.y = y; this.isTarget = !lit; this.lockable = !lit;
    this.canvas = document.createElement('canvas'); this.canvas.width = 64; this.canvas.height = 80;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.obj = new THREE.Group(); this.obj.position.set(x, y, z); this.obj.rotation.y = rotY;
    this.obj.add(new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.2), new THREE.MeshBasicMaterial({ map: this.tex, side: THREE.DoubleSide, fog: false })));
    game.renderer.scene.add(this.obj);
    this.draw();
    if (group) {
      game.events.on('target:reset:' + group, () => { if (!this.done) this.set(false); });
      game.events.on('target:lock:' + group, () => { this.done = true; this.isTarget = this.lockable = false; });
    }
  }
  draw() {
    const x = this.canvas.getContext('2d');
    x.fillStyle = '#14141c'; x.fillRect(0, 0, 64, 80);
    x.fillStyle = this.lit ? ON : OFF; x.font = 'bold 60px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (this.lit) { x.shadowColor = ON; x.shadowBlur = 12; }
    x.fillText(this.char, 32, 44);
    this.tex.needsUpdate = true;
  }
  set(lit) { this.lit = lit; this.draw(); }
  takeHit() {
    if (this.done || this.lit) return;
    this.set(true); this.game.audio.play('pickup');
    this.game.particles.burst(this.x, this.y, this.z, 10, 0xff7a1a, 4);
    this.game.events.emit('target:hit', this);
  }
  update(dt) { this.time += dt; }
}
