// Le héros : l'Ultra de la Meinau. Écharpe en satin (combo 3 coups), roulade, verrouillage.
import * as THREE from 'three';
import { Entity, faceOf, angDiff } from '../Entity.js';
import { pose, walkPose, walkBob } from '../../systems/Animator.js';
import { TUNING } from '../../data/tuning.js';

const T = TUNING.player;
const GUARD = { shN: 25, elN: 70, shF: 30, elF: 60, torso: 4 };

export class Ultra extends Entity {
  constructor(game, opts) {
    super(game, { ...opts, r: T.radius, hp: T.hp, model: 'ultra' });
    this.target = null; this.combo = 0; this.comboTimer = 0; this.walkT = 0; this.checkpoint = { x: opts.x, z: opts.z, face: opts.face };
    this.whip = this.makeWhip();
    this.states = {
      idle: { update: this.moveUpdate },
      run: { update: this.moveUpdate },
      attack: { enter: this.attackEnter, update: this.attackUpdate },
      roll: { enter: this.rollEnter, update: this.rollUpdate },
      hurt: { update(dt) { if (this.t > 0.3) this.setState('idle'); } },
      dead: { enter() { this.game.audio.play('die'); }, update(dt) { if (this.t > 1.6) this.respawn(); } }
    };
    this.setState('idle');
  }
  // l'écharpe déroulée pendant le coup : un ruban bleu/blanc qui part de la main
  makeWhip() {
    const g = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 0.16), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xf4f6ff : 0x1f5fd0 }));
      s.position.x = 0.2 + i * 0.32; g.add(s);
    }
    g.visible = false; this.game.renderer.scene.add(g);
    return g;
  }
  get enemies() { return this.game.entities.filter(e => e.isEnemy && e.alive); }

  moveUpdate(dt) {
    const I = this.game.input;
    if (I.pressed.attack) return this.setState('attack');
    const dir = this.inputDir();
    if (I.pressed.roll) { this.rollDir = dir || { x: this.fx, z: this.fz }; return this.setState('roll'); }
    if (dir) {
      const sp = this.target ? T.lockSpeed : T.speed;
      this.x += dir.x * sp * dt; this.z += dir.z * sp * dt;
      if (!this.target) this.face += angDiff(this.face, faceOf(dir.x, dir.z)) * Math.min(1, dt * 14);
      this.walkT += dt * (this.target ? 9 : 11);
      if (this.stateName !== 'run') this.stateName = 'run';
    } else this.stateName = 'idle';
    if (this.target) this.faceTo(this.target.x, this.target.z);
  }
  attackEnter() {
    if (this.comboTimer <= 0) this.combo = 0;
    this.move = T.combo[this.combo % T.combo.length];
    this.moveIdx = this.combo % T.combo.length;
    this.combo++; this.hitSet = new Set(); this.buffered = false;
    this.game.audio.play('whip');
    const fwd = this.inputDir(); if (fwd && !this.target) this.face = faceOf(fwd.x, fwd.z);
  }
  attackUpdate(dt) {
    const m = this.move, I = this.game.input;
    if (this.target) this.faceTo(this.target.x, this.target.z);
    if (I.pressed.attack) this.buffered = true;
    if (this.t >= m.active[0] && this.t <= m.active[1]) {
      const hits = this.game.combat.swing(this, { range: m.range, arc: m.arc, dmg: m.dmg, knock: m.knock, targets: this.game.hittables(), hitSet: this.hitSet });
      if (hits.length) { this.game.hitstop = this.moveIdx === 2 ? 0.08 : 0.05; this.game.camera.shake = this.moveIdx === 2 ? 0.3 : 0.12; }
    }
    if (this.t >= m.duration) {
      this.comboTimer = T.comboWindow;
      if (this.buffered && this.combo < T.combo.length) this.setState('attack');
      else { if (this.combo >= T.combo.length) this.combo = 0; this.setState('idle'); }
    }
  }
  rollEnter() { this.inv = Math.max(this.inv, T.roll.invuln); this.face = faceOf(this.rollDir.x, this.rollDir.z); this.game.audio.play('roll'); }
  rollUpdate(dt) {
    this.x += this.rollDir.x * T.roll.speed * dt; this.z += this.rollDir.z * T.roll.speed * dt;
    if (this.t > T.roll.duration) this.setState('idle');
  }
  inputDir() {
    const a = this.game.input.axis(); if (!a.x && !a.y) return null;
    const f = this.game.camera.forward(), r = this.game.camera.right();
    const dx = f.x * a.y + r.x * a.x, dz = f.z * a.y + r.z * a.x, l = Math.hypot(dx, dz);
    return { x: dx / l, z: dz / l };
  }
  // verrouillage : ennemis, et cibles-TPE pas encore validées (pour viser au bretzel, au doigt comme au clavier).
  // On prend la plus proche en privilégiant ce qui est devant l'Ultra.
  toggleLock() {
    if (this.target) { this.target = null; return; }
    let best = null, bs = Infinity;
    const lockables = this.game.entities.filter(e => (e.isEnemy && e.alive) || (e.isTarget && !e.done && !e.lit));
    for (const e of lockables) {
      const d = this.dist(e); if (d > T.lockRange) continue;
      const front = ((e.x - this.x) * this.fx + (e.z - this.z) * this.fz) / (d || 1); // 1 = pile devant
      const s = d * (2 - front); if (s < bs) { bs = s; best = e; }
    }
    this.target = best;
    if (!best) this.game.camera.snapBehind(this.face);
  }
  takeHit(dmg, nx, nz, knock, from) {
    if (this.inv > 0 || this.stateName === 'dead') return;
    super.takeHit(dmg, nx, nz, knock * 1.2, from);
    this.inv = T.invulnAfterHit; this.game.audio.play('hurt'); this.game.hud.flash(0.35); this.game.camera.shake = 0.35;
  }
  onHurt() { this.setState('hurt'); }
  onDeath() { this.setState('dead'); }
  respawn() {
    Object.assign(this, { x: this.checkpoint.x, z: this.checkpoint.z, face: this.checkpoint.face, hp: this.maxHp, alive: true, inv: 1.5, target: null, vx: 0, vz: 0 });
    this.game.camera.snapBehind(this.face);
    this.game.events.emit('player:respawn');
    this.setState('idle');
  }
  heal(n) { this.hp = Math.min(this.maxHp, this.hp + n); }

  update(dt) {
    this.comboTimer -= dt;
    if (this.game.input.pressed.lock && this.alive) this.toggleLock();
    if (this.target && (!this.target.alive || this.dist(this.target) > T.lockRange + 4)) this.target = null;
    if (this.target?.isTarget && (this.target.lit || this.target.done)) this.target = null; // cible touchée : on lâche, prêt pour la suivante
    super.update(dt);
    this.animate();
  }
  animate() {
    const o = this.obj, s = this.stateName;
    o.userData.model.rotation.z = 0;
    this.whip.visible = false;
    if (s === 'run') pose(o, walkPose(this.walkT, { ...GUARD, torso: 10 }), walkBob(this.walkT));
    else if (s === 'attack') {
      const k = Math.min(1, this.t / this.move.active[1]), big = this.moveIdx === 2;
      const side = this.moveIdx === 1 ? 'F' : 'N';
      pose(o, { ...GUARD, ['sh' + side]: 160 - k * 130, ['el' + side]: 20 - k * 20, torso: -8 + k * (big ? 30 : 18), hipN: 20, hipF: -20, kneeF: -10 });
      // ruban de l'écharpe qui fouette en arc devant l'Ultra
      if (this.t > this.move.active[0] * 0.5 && this.t < this.move.active[1] + 0.05) {
        const w = this.whip; w.visible = true;
        const sweep = (big ? 2.4 : 1.6) * (k - 0.5) * (this.moveIdx === 1 ? -1 : 1);
        w.position.set(this.x, 1.3 + (big ? 0.3 * Math.sin(k * 3) : 0), this.z);
        w.rotation.set(0, this.face + sweep, big ? 0.3 : 0);
        w.scale.x = this.move.range / 2.8;
      }
    } else if (s === 'roll') {
      pose(o, { hipN: 110, kneeN: -130, hipF: 100, kneeF: -130, shN: 90, elN: 90, shF: 90, elF: 90, torso: 50, head: 30 }, -0.5);
      o.userData.model.rotation.z = -this.t / T.roll.duration * Math.PI * 2;
    } else if (s === 'hurt') pose(o, { torso: -25, head: -20, shN: -30, shF: -20, elN: 30, elF: 30, hipN: 10, kneeN: -15 });
    else if (s === 'dead') pose(o, { torso: -40, head: -30, shN: 150, shF: 140, hipN: 20, kneeN: -40 }, -Math.min(1, this.t * 2) * 0.6);
    else pose(o, GUARD, Math.sin(this.time * 3) * 0.03);
    o.visible = !(this.inv > 0 && s !== 'roll' && Math.floor(this.time * 20) % 2);
  }
}
