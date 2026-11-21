// Terminal BlingCo (générique, tous niveaux) : on le pirate avec E à portée, ou d'un coup d'écharpe.
// Un losange néon flotte au-dessus tant qu'il est actif ; l'indication « E : pirater » passe par
// l'événement 'hud:prompt' (le HUD l'affiche, le terminal ne le connaît pas).
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';
import { interact, clearPrompt } from '../../systems/Interact.js';

const T = TUNING.terminal;

export class Terminal extends Entity {
  constructor(game, { x, z, rotY = 0, event }) {
    super(game, { x, z, r: 0.6, hp: 1, model: 'terminal' });
    this.obj.rotation.y = rotY; this.face = rotY; this.event = event; this.isTerminal = true;
    game.collision.addCircle(x, z, 0.55, 'terminal');
    this.screen = this.obj.userData.J.screen;
    this.inRange = false;
    this.marker = this.makeMarker();
    this.sync(); // place le modèle (le terminal ne bouge plus ensuite)
  }
  makeMarker() {
    const M = T.marker;
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(M.size), new THREE.MeshBasicMaterial({ color: M.color, fog: false }));
    m.scale.y = 1.6; // losange étiré, lisible de loin
    m.position.set(this.x, M.y, this.z);
    this.game.renderer.scene.add(m);
    return m;
  }
  takeHit() { this.activate(); }
  activate() {
    if (!this.alive) return;
    this.alive = false;
    clearPrompt(this);
    this.game.renderer.scene.remove(this.marker);
    this.game.audio.play('hit'); this.game.camera.shake = 0.2;
    this.game.particles.burst(this.x, 1.5, this.z, 14, 0x38f2ff, 5);
    if (this.screen) this.screen.material.color.setHex(0x223355);
    this.game.events.emit(this.event, this);
  }
  update(dt) {
    this.time += dt;
    if (!this.alive) return;
    if (this.screen) this.screen.material.emissive?.setHex(Math.sin(this.time * 6) > 0 ? 0x601030 : 0x200010);
    const M = T.marker;
    this.marker.position.y = M.y + Math.sin(this.time * M.bobSpeed) * M.bob;
    this.marker.rotation.y += dt * M.spin;
    if (interact(this, this.game.texts.prompts.hack, T.useRange)) this.activate();
  }
}
