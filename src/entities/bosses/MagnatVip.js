// Boss du niveau 5 : le Magnat du Carré VIP (fiche docs/designs/kalt.md, personnage inventé) sur son carré VIP volant
// (4 réacteurs) au-dessus de la piste du Kalt. Il tourne en rond au-dessus de la piste, arrose de bouteilles à
// étincelles (rafale en éventail) et fait pleuvoir des bouchons (zones au sol). En vol, rien ne le touche (« VIP ONLY ») :
// la flèche court-circuit coupe ses réacteurs → chute → AU SOL (point faible) : grosse caisse de Dylagne
// (TUNING.magnat.drumDmg, l'étourdit) ; flèche, bretzel ou écharpe y font 1 ; puis il redécolle.
// États : intro, takeoff, hover, sparks, rain, fall, landed, stunned, rise, die.
// Événements : 'magnat:landed', 'magnat:rise', 'boss:phase' (n), 'boss:defeated'.
import { Enemy } from '../enemies/Enemy.js';
import { Projectile } from '../props/Projectile.js';
import { Hazard } from '../props/Hazard.js';
import { rng } from '../../core/Random.js';
import { TUNING } from '../../data/tuning.js';

const P = TUNING.magnat;
const AIR = ['takeoff', 'hover', 'sparks', 'rain'];
// monte ou descend jusqu'à la hauteur `to` en `dur` s, puis passe à l'état `then`
const lift = (to, dur, then) => function (dt) {
  this.y += (to - this.y) * Math.min(1, dt * 4 / dur);
  if (this.t > dur) { this.y = to; this.setState(then); }
};

export class MagnatVip extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: 1.6, hp: P.hp, model: 'magnat_vip', scale: P.scale });
    Object.assign(this, { isBoss: true, baseScale: P.scale, lookY: 2.6, hitY: 1.6, phase: 0, cd: P.attackEvery, next: 'sparks', ang: 0 });
    this.home = { x: this.x, z: this.z };
    this.states = {
      intro: { update() {} },
      takeoff: { enter() { this.game.audio.play('laser'); }, update: lift(P.hoverY, P.riseTime, 'hover') },
      hover: { update: this.hoverUpdate },
      sparks: { enter() { this.shots = 0; }, update: this.sparksUpdate },
      rain: { enter() { this.rain(); }, update() { if (this.t > P.rainWarn) this.setState('hover'); } },
      fall: { enter() { this.game.bubble(this, this.game.levelTexts.landed || '', 1.2); this.game.audio.play('heavy'); },
        update: lift(P.landY, P.fallTime, 'landed') },
      landed: { enter() { this.game.camera.shake = 0.5; this.game.events.emit('magnat:landed', this); },
        update() { if (this.t > P.landTime) this.setState('rise'); }, exit() { this.game.events.emit('magnat:rise', this); } },
      stunned: { enter() { this.game.audio.play('heavy'); }, update() { if (this.t > P.stun) this.setState('rise'); },
        exit() { this.game.events.emit('magnat:rise', this); } },
      rise: { update: lift(P.hoverY, P.riseTime, 'hover') },
      die: { enter() { this.inv = 99; this.game.audio.play('heavy'); this.game.events.emit('boss:defeated', this); },
        update(dt) {
          this.y = Math.max(0, this.y - dt * 3); this.obj.rotation.z = -Math.min(1, this.t) * 0.35;
          if (Math.random() < 0.25) this.game.particles.burst(this.x, this.y + 1.5, this.z, 4, 0xffc040, 6);
        } }
    };
    this.setState('intro');
  }
  get weak() { return this.stateName === 'landed' || this.stateName === 'stunned'; }
  get flying() { return AIR.includes(this.stateName); }
  start() { this.setState('takeoff'); }
  // ronde au-dessus de la piste, face à l'Ultra ; étincelles et bouchons en alternance
  hoverUpdate(dt) {
    const p = this.player;
    this.ang += P.orbitSpeed[this.phase] * dt;
    const gx = this.home.x + Math.cos(this.ang) * P.orbit, gz = this.home.z + Math.sin(this.ang) * P.orbit;
    this.x += (gx - this.x) * Math.min(1, dt * 2); this.z += (gz - this.z) * Math.min(1, dt * 2);
    this.faceTo(p.x, p.z, dt * 3);
    if ((this.cd -= dt) <= 0) {
      this.cd = P.attackEvery * (0.85 + rng() * 0.3);
      this.setState(this.next); this.next = this.next === 'sparks' ? 'rain' : 'sparks';
    }
  }
  // bouteilles à étincelles : rafale en éventail vers l'Ultra
  sparksUpdate(dt) {
    const p = this.player, n = P.sparks[this.phase];
    this.faceTo(p.x, p.z, dt * 4);
    if (this.t < P.sparkAim) { this.telegraph = true; return; }
    if (this.shots < n && this.t > P.sparkAim + this.shots * P.sparkGap) {
      const a = this.face + (this.shots - (n - 1) / 2) * P.sparkSpread;
      this.game.add(new Projectile(this.game, { x: this.x + Math.cos(a) * 1.8, z: this.z - Math.sin(a) * 1.8, face: a,
        speed: P.sparkSpeed, dmg: P.dmg, shape: 'etincelle', y: 1.4, spin: 10, r: 0.35 }));
      this.shots++; this.game.audio.play('throw');
    }
    if (this.shots >= n && this.t > P.sparkAim + n * P.sparkGap + 0.4) this.setState('hover');
  }
  // pluie de bouchons de champagne : une zone sur l'Ultra, les autres autour
  rain() {
    const p = this.player, n = P.rain[this.phase];
    for (let i = 0; i < n; i++) {
      const a = rng() * Math.PI * 2, r = i ? P.rainSpread * (0.4 + rng() * 0.6) : 0;
      this.game.add(new Hazard(this.game, { x: p.x + Math.cos(a) * r, z: p.z + Math.sin(a) * r, r: P.rainR, warn: P.rainWarn,
        life: P.rainLife, dmg: P.dmg, color: 0xffc040 }));
    }
    this.game.audio.play('laser');
  }
  // flèche court-circuit : les réacteurs lâchent
  onShort() { if (this.alive && this.flying) this.setState('fall'); }
  // grosse caisse de Dylagne quand il est au sol
  takeDrum() {
    if (!this.alive || !this.weak) return;
    this.hp -= P.drumDmg; this.flash = 0.2; this.game.hitstop = 0.08; this.game.camera.shake = 0.6;
    this.game.particles.burst(this.x, 1.5, this.z, 24, 0xffc040, 7);
    this.afterHit();
    if (this.alive) this.setState('stunned');
  }
  takeHit(dmg, nx, nz, knock, from) {
    if (!this.weak) { this.game.audio.play('ting'); this.game.bubble(this, this.game.levelTexts.vipOnly || this.game.texts.shield, 0.6); return; }
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
  // l'Ultra est mort : le Magnat reprend sa ronde
  reset() { Object.assign(this, { x: this.home.x, z: this.home.z, y: P.hoverY, cd: P.attackEvery }); this.setState('hover'); }
  onHurt() {}
  onDeath() { this.setState('die'); }
  update(dt) {
    super.update(dt);
    this.hitH = this.y + 3; // les flèches l'atteignent aussi en vol (et rebondissent)
    const st = this.stateName, J = this.obj.userData.J, wave = Math.sin(this.time * (st === 'sparks' ? 14 : 3));
    this.game.stars(st === 'stunned' ? this : null);
    if (J.shN) J.shN.rotation.z = 0.4 + wave * 0.3;
    if (J.shF) J.shF.rotation.z = 0.4 - wave * 0.3;
    if (J.carre_vip) J.carre_vip.rotation.z = this.flying ? Math.sin(this.time * 2) * 0.04 : st === 'stunned' ? Math.sin(this.time * 9) * 0.05 : 0;
    if (this.flying && Math.random() < 0.3) this.game.particles.burst(this.x, this.y + 0.2, this.z, 1, 0xff7a1a, 2); // réacteurs
  }
}
