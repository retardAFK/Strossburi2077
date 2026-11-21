// Kit de sbire générique (tous les niveaux) : patrouille → alerte (« ! ») → poursuite → attaque télégraphiée
// (charge au corps à corps ou tir) → récupération ; étourdissement (stun), aveuglement par la fumée (perd l'Ultra
// de vue), recul, mort. Réglages : TUNING.sbires[kind] ; répliques : TEXTS.barks[kind] (facultatives).
// Une sous-classe par sbire (StewardRobot...) donne son modèle (pivots standards) et ses gags ;
// sans modèle chargé : placeholder gris étiqueté (systems/Placeholder.js).
import { Enemy } from './Enemy.js';
import { Projectile } from '../props/Projectile.js';
import { pose, walkPose, walkBob } from '../../systems/Animator.js';
import { placeholder } from '../../systems/Placeholder.js';
import { rng } from '../../core/Random.js';
import { TUNING } from '../../data/tuning.js';

export class Sbire extends Enemy {
  // opts : { x, z, face, group, kind, model?, label?, patrol?: [[x, z], ...] }
  constructor(game, opts) {
    const S = TUNING.sbires[opts.kind];
    const model = opts.model && game.assets.protos[opts.model] ? opts.model : null;
    super(game, { ...opts, r: S.radius, hp: S.hp, model, scale: S.scale || 1 });
    if (!this.obj) { this.obj = placeholder(game, opts.label || opts.kind, S.height); game.renderer.scene.add(this.obj); }
    this.S = S; this.kind = opts.kind; this.baseScale = S.scale || 1; this.isSbire = true;
    this.home = { x: this.x, z: this.z }; this.route = opts.patrol || null; this.wp = 0; this.goal = null;
    this.blinded = 0; this.stunT = 0; this.lost = 0;
    this.states = {
      patrol: { enter() { this.goal = null; }, update: this.patrolUpdate },
      alert: {
        enter() { this.game.bubble(this, this.game.texts.alertBubble, 0.8); this.game.events.emit('sbire:alert', this); },
        update(dt) { this.faceTo(this.player.x, this.player.z, dt * 8); if (this.t > S.alertTime) this.setState('chase'); }
      },
      chase: { update: this.chaseUpdate },
      windup: { update(dt) {
        if (this.blinded > 0) return this.setState('patrol'); // aveuglé (fumée) : il abandonne
        this.telegraph = true; this.faceTo(this.player.x, this.player.z, dt * 8); if (this.t > S.windup) this.setState('attack');
      } },
      attack: { enter() { this.hitDone = false; if (S.attack === 'shoot') this.shoot(); }, update: this.attackUpdate },
      recover: { update() { if (this.t > S.recover) this.setState(this.blinded > 0 ? 'patrol' : 'chase'); } },
      stunned: { update() { if (this.t > this.stunT) this.setState(this.sees() ? 'chase' : 'patrol'); } },
      hurt: { update() { if (this.t > 0.3) this.setState('chase'); } },
      die: Enemy.dieState(S.dieColor ?? 0xffc040)
    };
    this.setState('patrol');
  }
  // vision : portée + cône (cos), ou très près ; rien si aveuglé par la fumée
  sees() {
    const p = this.player, S = this.S;
    if (this.blinded > 0 || !p.alive) return false;
    const d = this.dist(p); if (d > S.view) return false;
    if (d < S.hear) return true;
    return ((p.x - this.x) * this.fx + (p.z - this.z) * this.fz) / d > S.fov;
  }
  stun(sec) { if (!this.alive) return; this.stunT = sec; this.setState('stunned'); }
  blind(sec) { this.blinded = Math.max(this.blinded, sec); }
  walkTo(x, z, speed, dt) {
    const dx = x - this.x, dz = z - this.z, d = Math.hypot(dx, dz);
    if (d < 0.3) return true;
    this.faceTo(x, z, dt * 6); this.x += this.fx * speed * dt; this.z += this.fz * speed * dt; this.walkT += dt * 9;
    return false;
  }
  patrolUpdate(dt) {
    const S = this.S;
    if (this.sees()) return this.setState('alert');
    if (!this.goal) {
      if (this.route) { this.goal = this.route[this.wp % this.route.length]; this.wp++; }
      else { const a = rng() * Math.PI * 2, r = rng() * S.wander; this.goal = [this.home.x + Math.cos(a) * r, this.home.z + Math.sin(a) * r]; }
    }
    if (this.walkTo(this.goal[0], this.goal[1], S.speed, dt) || this.hitWall) this.goal = null;
    if (this.game.texts.barks?.[this.kind]) this.bark(this.kind); // répliques facultatives
  }
  chaseUpdate(dt) {
    const S = this.S, p = this.player, d = this.dist(p);
    if (this.blinded > 0) return this.setState('patrol'); // fumée : il perd l'Ultra tout de suite
    this.lost = this.sees() ? 0 : this.lost + dt;
    if (this.lost > S.lose) return this.setState('patrol'); // perdu de vue (fumée, distance)
    const range = S.attack === 'shoot' ? S.shootRange : S.reach;
    if (d > range) this.walkTo(p.x, p.z, S.runSpeed, dt);
    else if (this.t > 0.3) return this.setState('windup');
    this.separate(dt);
  }
  attackUpdate(dt) {
    const S = this.S;
    if (S.attack !== 'shoot') {
      this.x += this.fx * S.lunge * dt; this.z += this.fz * S.lunge * dt;
      if (!this.hitDone && this.dist(this.player) < this.r + this.player.r + 0.4) { this.hitDone = true; this.player.takeHit(S.dmg, this.fx, this.fz, 8, this); }
    }
    if (this.t > S.attackTime) this.setState('recover');
  }
  shoot() {
    const S = this.S; this.game.audio.play('throw');
    this.game.add(new Projectile(this.game, { x: this.x + this.fx * 0.8, z: this.z + this.fz * 0.8, face: this.face,
      speed: S.projSpeed, dmg: S.dmg, shape: S.shape || 'bouchon', y: 1.1, spin: 20, r: 0.3 }));
  }
  update(dt) {
    this.blinded = Math.max(0, this.blinded - dt);
    super.update(dt);
    if (this.removed) return;
    const s = this.stateName, o = this.obj;
    if (s === 'patrol' || s === 'chase') pose(o, walkPose(this.walkT, { shN: 30, elN: 40 }), walkBob(this.walkT));
    else if (s === 'windup') pose(o, { shN: 150, elN: 20, torso: -12 });
    else if (s === 'attack') pose(o, { shN: 80, elN: 0, torso: 25, hipN: 30, hipF: -30 });
    else if (s === 'stunned' || s === 'hurt') pose(o, { torso: -25, head: -20 + Math.sin(this.time * 8) * 10, shN: -30, shF: -30 });
    else if (s !== 'die') pose(o, { shN: 30, elN: 40, head: Math.sin(this.time * 2) * 10 });
    if (s === 'stunned' && o.userData.placeholder) o.userData.model.rotation.y += dt * 6; // placeholder : il tourne
  }
}
