// Boss du niveau 3 : le Promoteur (fiche docs/designs/promoteur.md, personnage 100 % inventé) en exosquelette-grue.
// Il marche face à l'Ultra et largue ses préfabriqués (Prefab.js) là où il se tient ; ses gardes de chantier
// renvoient l'écharpe (« ting »). Un préfabriqué renvoyé au gaffe-grappin le frappe (TUNING.promoteur.returnDmg)
// et l'étourdit : là, l'écharpe, l'arc et le bretzel le touchent. Phases aux seuils de PV : plus de préfabriqués
// par volée. États : intro, walk, aim, drop, stunned, die. Événements : 'boss:phase' (n), 'boss:defeated'.
import { Enemy } from '../enemies/Enemy.js';
import { Prefab } from '../props/Prefab.js';
import { pose } from '../../systems/Animator.js';
import { rng } from '../../core/Random.js';
import { TUNING } from '../../data/tuning.js';

const P = TUNING.promoteur;

export class Promoteur extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: 1.3, hp: P.hp, model: 'promoteur', scale: P.scale });
    Object.assign(this, { isBoss: true, baseScale: P.scale, lookY: 3, hitY: 1.6, phase: 0, cd: P.dropEvery, kind: 0 });
    this.home = { x: this.x, z: this.z };
    // préfabriqué suspendu au crochet de la grue : il disparaît quand il le largue, réapparaît ensuite
    this.held = []; this.obj.userData.J.hook?.traverse(n => { if (/^prefab/.test(n.name)) this.held.push(n); });
    this.states = {
      intro: { update() {} },
      walk: { enter() { for (const n of this.held) n.visible = true; }, update: this.walkUpdate },
      aim: { enter() { this.telegraph = true; this.game.audio.play('laser'); }, update: this.aimUpdate },
      drop: { update(dt) { if (this.t > 0.5) this.setState('walk'); } },
      stunned: { enter() { this.game.audio.play('heavy'); }, update(dt) { if (this.t > P.stun) this.setState('walk'); } },
      die: { enter() { this.inv = 99; this.game.audio.play('heavy'); this.game.events.emit('boss:defeated', this); },
        update(dt) { this.obj.rotation.z = -Math.min(1, this.t) * 0.5; if (rng() < 0.2) this.game.particles.burst(this.x, 2, this.z, 4, 0xffc040, 6); } }
    };
    this.setState('intro');
  }
  start() { this.setState('walk'); }
  walkUpdate(dt) {
    const p = this.player;
    this.faceTo(p.x, p.z, dt * 2);
    // pas de côté, sans s'éloigner de son quai
    const side = Math.sin(this.time * 0.6) * P.speed;
    this.x += -this.fz * side * dt; this.z += this.fx * side * dt;
    this.x += (this.home.x - this.x) * dt * 0.2; this.z += (this.home.z - this.z) * dt * 0.2;
    if (this.dist(p) < this.r + p.r + 0.3) p.takeHit(P.contact, this.fx, this.fz, 12, this);
    if ((this.cd -= dt) <= 0) { this.cd = P.dropEvery * (0.85 + rng() * 0.3); this.setState('aim'); }
  }
  // flèche de grue levée : les cercles rouges marquent où tomberont les préfabriqués (sur l'Ultra, puis autour)
  aimUpdate(dt) {
    this.telegraph = true;
    if (this.t > 0.2 && !this.dropped) {
      this.dropped = true; for (const n of this.held) n.visible = false;
      const p = this.player, n = P.phaseDrops[this.phase];
      for (let i = 0; i < n; i++) {
        const a = rng() * Math.PI * 2, d = i ? 3 + rng() * 2 : 0;
        this.game.add(new Prefab(this.game, { x: p.x + Math.cos(a) * d, z: p.z + Math.sin(a) * d, kind: this.kind++, boss: this }));
      }
    }
    if (this.t > P.aimTime) { this.dropped = false; this.setState('drop'); }
  }
  // un préfabriqué renvoyé au grappin : gros dégâts et étourdissement
  takePrefab() {
    if (!this.alive || this.stateName === 'intro') return;
    this.hp -= P.returnDmg; this.flash = 0.2; this.game.camera.shake = 0.5; this.game.hitstop = 0.08;
    this.game.particles.burst(this.x, 2.5, this.z, 20, 0xffc040, 7);
    this.afterHit();
    if (this.alive) this.setState('stunned');
  }
  takeHit(dmg, nx, nz, knock, from) {
    if (this.stateName !== 'stunned') { this.game.audio.play('ting'); this.game.bubble(this, this.game.texts.shield, 0.6); return; }
    super.takeHit(Math.min(dmg, 1), nx, nz, 0, from);
    this.afterHit();
  }
  afterHit() {
    const r = Math.max(0, this.hp) / this.maxHp;
    this.game.hud.setBoss(r);
    if (this.hp <= 0 && this.alive) { this.alive = false; return this.setState('die'); }
    const ph = P.phases.filter(t => r <= t).length;
    if (ph > this.phase) { this.phase = ph; this.game.events.emit('boss:phase', ph, this); }
  }
  onHurt() {}
  onDeath() { this.setState('die'); }
  update(dt) {
    super.update(dt);
    const st = this.stateName, J = this.obj.userData.J;
    this.game.stars(st === 'stunned' ? this : null);
    if (J.jib) J.jib.rotation.z = st === 'aim' ? -0.5 : Math.sin(this.time * 1.4) * 0.08;
    if (st === 'walk') pose(this.obj, { hipN: Math.sin(this.time * 4) * 18, hipF: -Math.sin(this.time * 4) * 18, kneeN: 10, kneeF: 10 });
    if (st === 'stunned') pose(this.obj, { torso: 14 + Math.sin(this.time * 8) * 4, head: 18 });
  }
}
