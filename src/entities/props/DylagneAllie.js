// Dylagne, le ragondin (fiche docs/designs/compagnons.md) — version « événement de niveau » du Kalt, en attendant le
// compagnon invocable de l'étape F (autre session). Pas de nouvelle touche :
//  - 'cage' : il joue de la grosse caisse dans la cave, coincé dans un carré VIP ; join() → il suit l'Ultra ('follow') ;
//  - offer(cible, cb, portée?) : le niveau propose un coup de grosse caisse (indication {use}) ; appui → 'drum' : onde
//    de choc (pivot `drum`) qui frappe les sbires proches, puis cb() ; cancelOffer() retire la proposition ;
//  - soin (pivot `pack`) : 1 bretzel toutes les TUNING.dylagne.healEvery s si l'Ultra est blessé.
// Il ne parle pas : cris et bulles d'icônes (♪, ♥). Événements : 'dylagne:joined', 'dylagne:drum'.
import { Entity } from '../Entity.js';
import { interact, clearPrompt } from '../../systems/Interact.js';
import { TUNING } from '../../data/tuning.js';

const K = TUNING.dylagne;

export class DylagneAllie extends Entity {
  constructor(game, { x, z, rotY = 0 }) {
    super(game, { x, z, r: 0.35, hp: 1, model: 'dylagne', scale: K.scale });
    Object.assign(this, { isDylagne: true, offerT: null, healT: 0, noteT: 0, cd: 0 });
    this.face = rotY;
    const self = this;
    this.states = {
      cage: { update(dt) { self.notes(dt, 1.4); } },
      follow: { update(dt) {
        self.walkTo(self.slot(), dt);
        self.cd = Math.max(0, self.cd - dt);
        const o = self.offerT, p = game.player;
        const near = o && self.cd <= 0 && (!o.range || Math.hypot(p.x - o.target.x, p.z - o.target.z) < o.range);
        if (!near) clearPrompt(self);
        else if (interact(self, game.texts.prompts.dylagneDrum, 99)) self.drum();
        self.healUpdate(dt);
      } },
      drum: { update(dt) { self.notes(dt, 0.15); if (self.t > 0.25) self.setState('follow'); } }
    };
    this.setState('cage');
  }
  notes(dt, every) { if ((this.noteT -= dt) <= 0) { this.noteT = every; this.game.bubble(this, '♪', 0.6); } }
  // derrière l'Ultra, au sol, un peu sur le côté
  slot() { const p = this.game.player; return { x: p.x - p.fx * 1.3 - p.fz * 0.7, z: p.z - p.fz * 1.3 + p.fx * 0.7 }; }
  walkTo(g, dt) {
    const dx = g.x - this.x, dz = g.z - this.z, d = Math.hypot(dx, dz);
    if (d < 0.2) return;
    const v = Math.min(d * 4, K.follow * (d > 6 ? 2 : 1)) * dt;
    this.x += dx / d * Math.min(v, d); this.z += dz / d * Math.min(v, d); this.face = Math.atan2(-dz, dx);
  }
  healUpdate(dt) {
    const p = this.game.player;
    if (!p.alive || p.hp >= p.maxHp) { this.healT = 0; return; }
    if ((this.healT += dt) < K.healEvery) return;
    this.healT = 0; p.heal(K.heal); this.game.bubble(this, '♥', 1); this.game.audio.play('pickup');
    this.game.particles.burst(p.x, 1.2, p.z, 10, 0xff4fa3, 3);
  }
  join() { if (this.stateName !== 'cage') return; this.setState('follow'); this.game.audio.play('win'); this.game.events.emit('dylagne:joined', this); }
  offer(target, cb, range = 0) { this.offerT = { target, cb, range }; }
  cancelOffer() { this.offerT = null; clearPrompt(this); }
  // coup de grosse caisse : onde de choc + sbires proches frappés, puis l'effet proposé par le niveau
  drum() {
    const g = this.game, o = this.offerT;
    clearPrompt(this); this.cd = K.drumCd; this.setState('drum');
    g.shockwave(this.x, this.z, K.drumR); g.audio.play('slam'); g.camera.shake = 0.4;
    for (const e of [...g.entities]) {
      if (!e.isEnemy || !e.alive || e.isBoss || this.dist(e) > K.drumR) continue;
      const d = this.dist(e) || 1; e.takeHit(K.drumDmg, (e.x - this.x) / d, (e.z - this.z) / d, 8, this);
    }
    g.events.emit('dylagne:drum', this);
    if (o) { this.offerT = null; o.cb?.(); }
  }
  takeHit() {}
  update(dt) {
    this.t += dt; this.time += dt;
    this.states[this.stateName].update.call(this, dt);
    const J = this.obj.userData.J, beat = Math.abs(Math.sin(this.time * (this.stateName === 'follow' ? 4 : 8)));
    if (J.drum) J.drum.rotation.z = (this.stateName === 'follow' ? 0 : beat * 0.15);
    if (J.tail) J.tail.rotation.y = Math.sin(this.time * 6) * 0.3;
    if (J.head) J.head.rotation.z = this.stateName === 'cage' || this.stateName === 'drum' ? beat * 0.12 : 0;
    this.obj.position.set(this.x, this.stateName === 'follow' ? 0 : beat * 0.05, this.z); this.obj.rotation.y = this.face;
  }
}
