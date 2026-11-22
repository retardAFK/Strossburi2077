// Sono d'une boîte de nuit (générique, le Kalt) : l'horloge du rythme, le stroboscope et « les basses ».
// Elle ne joue pas la musique (Audio 'kalt', même tempo) : elle donne le temps du JEU, déterministe (tests).
//  - à chaque temps : événement 'sono:beat' (n, basses ?) et flash blanc du strobo ; les entités `dark` dans `rect` ne
//    sont visibles qu'au flash (et TUNING.sono.glow s après) ;
//  - cycle de TUNING.sono.cycle temps : pendant les `bass` premiers, les basses : les portiques laser `gates` s'ouvrent ;
//  - hold(true) : quelqu'un tient le rythme (Dylagne) → portiques ouverts en permanence ; stop() : tout s'éteint.
// opts : { rect: [x0, x1, z0, z1], gates: [ids de lasers du layout], light: { x, y, z } }
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';

const S = TUNING.sono;

export class Sono extends Entity {
  constructor(game, { rect, gates = [], light = { x: 0, y: 6, z: 0 } }) {
    super(game, { x: light.x, z: light.z, r: 0.1, hp: 1 });
    Object.assign(this, { rect, gates, beat: -1, held: false, on: true, isSono: true });
    this.light = new THREE.PointLight(0xffffff, 0, 34); this.light.position.set(light.x, light.y, light.z);
    game.renderer.scene.add(this.light);
  }
  get period() { return 60 / S.bpm; }
  get bass() { return this.held || this.beat % S.cycle < S.bass; }
  hold(on) { this.held = on; this.gatesUpdate(); }
  stop() { this.on = false; this.light.intensity = 0; for (const id of this.gates) this.game.world.setLaser(id, false, true); this.showDark(true); }
  gatesUpdate() { for (const id of this.gates) if (this.game.world.lasers[id] && this.game.world.lasers[id].on === this.bass) this.game.world.setLaser(id, !this.bass, true); }
  inRect(e) { const [x0, x1, z0, z1] = this.rect; return e.x > x0 && e.x < x1 && e.z < z0 && e.z > z1; }
  showDark(all) {
    const tb = this.time - this.beat * this.period, lit = all || tb < S.flash + S.glow;
    for (const e of this.game.entities) if (e.dark && e.obj) e.obj.visible = lit || !e.alive || !this.inRect(e);
  }
  takeHit() {}
  update(dt) {
    if (!this.on) return;
    this.time += dt;
    const n = Math.floor(this.time / this.period);
    if (n !== this.beat) { this.beat = n; this.gatesUpdate(); this.game.events.emit('sono:beat', n, this.bass); }
    const tb = this.time - n * this.period;
    this.light.intensity = tb < S.flash ? 40 : 0;
    this.showDark(false);
  }
}
