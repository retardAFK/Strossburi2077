// Stork, la cigogne (fiche docs/designs/compagnons.md) — version « événement de niveau » du Marché 2000, en attendant
// le compagnon invocable de l'étape F (autre session : bouton summonStork, recharge). Ici, pas de nouvelle touche :
//  - 'nest' : elle dort dans son nid sur l'enseigne ; join() → elle s'envole vers l'Ultra ('fly') puis le suit ('follow') ;
//  - offer(cible, cb) : le niveau propose un piqué (indication {use} : AGIR) ; appui → 'dive' sur la cible, cb() à
//    l'impact (le bec, pivot `beak`), puis retour auprès de l'Ultra. cancelOffer() retire la proposition.
// Réglages : TUNING.stork. Événements : 'stork:joined', 'stork:dive' (cible).
import * as THREE from 'three';
import { Entity } from '../Entity.js';
import { interact, clearPrompt } from '../../systems/Interact.js';
import { TUNING } from '../../data/tuning.js';

const K = TUNING.stork;

export class StorkAllie extends Entity {
  constructor(game, { x, z, y = 0 }) {
    super(game, { x, z, r: 0.4, hp: 1, model: 'stork', scale: K.scale });
    this.y = y; this.isStork = true; this.offerT = null;
    // le nid (pas de design à part : brindilles en anneau sous la cigogne)
    const nest = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.16, 5, 10), new THREE.MeshLambertMaterial({ color: 0x8a6a3a, flatShading: true }));
    nest.rotation.x = Math.PI / 2; nest.position.set(x, y + 0.05, z); game.renderer.scene.add(nest);
    const self = this;
    this.states = {
      nest: { update() { self.obj.rotation.z = Math.sin(self.time * 1.2) * 0.03; } },
      fly: { update(dt) { if (self.moveTo(self.slot(), K.fly, dt)) { self.setState('follow'); game.events.emit('stork:joined', self); } } },
      follow: { update(dt) {
        self.moveTo(self.slot(), K.follow, dt, true);
        if (self.offerT && interact(self, game.texts.prompts.storkDive, 99)) self.dive();
      } },
      dive: { update(dt) {
        const t = self.offerT.target;
        if (self.moveTo({ x: t.x, y: (t.y || 0) + (t.storkY ?? 1), z: t.z }, K.dive, dt)) {
          const cb = self.offerT.cb; self.offerT = null; game.particles.burst(self.x, self.y, self.z, 14, 0xf4f6ff, 5);
          game.camera.shake = 0.3; game.audio.play('heavy'); cb?.(); self.setState('back');
        }
      } },
      back: { update(dt) { if (self.moveTo(self.slot(), K.fly, dt)) self.setState('follow'); } }
    };
    this.setState('nest');
  }
  // place près de l'Ultra : au-dessus de son épaule, un peu en arrière
  slot() { const p = this.game.player; return { x: p.x - p.fx * 0.9 + p.fz * 0.6, y: 2.2, z: p.z - p.fz * 0.9 - p.fx * 0.6 }; }
  moveTo(g, speed, dt, soft = false) {
    // l'Ultra est loin (téléporté : point de reprise, F2) : elle le rejoint d'un coup d'aile
    if (this.stateName !== 'dive' && Math.hypot(g.x - this.x, g.z - this.z) > K.snap) Object.assign(this, { x: g.x, y: g.y, z: g.z });
    const dx = g.x - this.x, dy = g.y - this.y, dz = g.z - this.z, d = Math.hypot(dx, dy, dz);
    if (d < 0.25) return true;
    const v = soft ? Math.min(d * 4, speed) * dt : Math.min(d, speed * dt);
    this.x += dx / d * v; this.y += dy / d * v; this.z += dz / d * v;
    if (Math.hypot(dx, dz) > 0.2) this.face = Math.atan2(-dz, dx);
    return false;
  }
  join() { if (this.stateName === 'nest') { this.setState('fly'); this.game.audio.play('whip'); } }
  offer(target, cb) { this.offerT = { target, cb }; }
  cancelOffer() { if (this.stateName !== 'dive') { this.offerT = null; clearPrompt(this); } }
  dive() { clearPrompt(this); this.game.events.emit('stork:dive', this.offerT.target); this.setState('dive'); }
  takeHit() {}
  update(dt) {
    this.t += dt; this.time += dt;
    this.states[this.stateName].update.call(this, dt);
    const J = this.obj.userData.J, flap = this.stateName === 'nest' ? 0 : Math.sin(this.time * (this.stateName === 'dive' ? 4 : 14)) * 0.7;
    if (J.wingN) J.wingN.rotation.x = flap; if (J.wingF) J.wingF.rotation.x = -flap;
    if (J.neck) J.neck.rotation.z = this.stateName === 'dive' ? -0.6 : 0;
    this.obj.position.set(this.x, this.y, this.z); this.obj.rotation.y = this.face;
  }
}
