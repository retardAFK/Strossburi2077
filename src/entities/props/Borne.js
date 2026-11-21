// Borne « sans contact » (interrupteur générique d'énigme) : s'active avec E à portée ou d'un coup d'écharpe.
// Elle ne connaît pas l'énigme : elle émet 'switch:on' et écoute, pour son groupe,
//   'switch:enable:<groupe>' (devient utilisable), 'switch:reset:<groupe>' (se rééteint),
//   'switch:lock:<groupe>' (énigme résolue : reste allumée, plus d'indication).
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';
import { interact, clearPrompt } from '../../systems/Interact.js';

const B = TUNING.switches;

export class Borne extends Entity {
  constructor(game, { x, z, rotY = 0, group, locked = false, model = 'pf_borne' }) {
    super(game, { x, z, r: 0.5, hp: 1, model });
    this.face = rotY; this.group = group; this.isSwitch = true;
    this.on = false; this.enabled = !locked; this.done = false;
    game.collision.addCircle(x, z, 0.45, 'switch');
    // voyant = la sphère du modèle (minuterie)
    this.obj.traverse(m => { if (m.isMesh && m.name.startsWith('p_sph')) this.light = m; });
    const E = game.events;
    E.on('switch:enable:' + group, () => { this.enabled = true; });
    E.on('switch:reset:' + group, () => this.setOn(false));
    E.on('switch:lock:' + group, () => { this.done = true; clearPrompt(this); });
    this.sync(); this.paint();
  }
  takeHit() { this.activate(); }
  activate() {
    if (!this.enabled || this.on || this.done) return;
    this.setOn(true);
    this.game.audio.play('ting');
    this.game.particles.burst(this.x, 1.4, this.z, 10, 0x38f2ff, 4);
    this.game.events.emit('switch:on', this);
  }
  setOn(v) { this.on = v; this.paint(); }
  // allumée : cyan vif ; en attente : or qui clignote ; inactive : éteinte
  paint(blink = 1) {
    const m = this.light?.material; if (!m) return;
    if (this.on || this.done) { m.color.setHex(B.onColor); m.emissive.setHex(B.onColor); m.emissiveIntensity = 1; }
    else { m.color.setHex(B.offColor); m.emissive.setHex(B.offColor); m.emissiveIntensity = this.enabled ? 0.6 * blink : 0; }
  }
  update(dt) {
    this.time += dt;
    if (this.on || this.done || !this.enabled) { clearPrompt(this); return; }
    this.paint(Math.sin(this.time * B.blinkSpeed) > 0 ? 1 : 0.15);
    if (interact(this, this.game.texts.prompts.activate, B.useRange)) this.activate();
  }
}
