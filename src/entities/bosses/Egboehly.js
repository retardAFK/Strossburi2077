// Boss du niveau 2 : Egboehly, le multipropriétaire (fiche docs/designs/egboehly.md, personnage 100 % inventé).
// Sa loge VIP pilote une hydre mécanique à 5 têtes (HydraHead.js). Une tête assommée repousse, sauf si une
// flèche-bannière y est plantée. Les 5 bannières plantées → la loge s'ouvre, le pilote est exposé : il prend
// l'écharpe, l'arc et le bretzel jusqu'à la défaite. Les têtes crachent aussi des contrats (projectiles).
// Événements : 'boss:phase' (1 = pilote exposé), 'boss:defeated', 'egboehly:head' (index, état).
import { Enemy } from '../enemies/Enemy.js';
import { HydraHead } from './HydraHead.js';
import { Projectile } from '../props/Projectile.js';
import { rng } from '../../core/Random.js';
import { TUNING } from '../../data/tuning.js';

const E = TUNING.egboehly;

export class Egboehly extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: 2.2, hp: E.pilotHp, model: 'egboehly', scale: E.scale });
    Object.assign(this, { isBoss: true, baseScale: E.scale, lookY: 2.6, hitY: 1.5, exposed: false, biteCd: E.biteEvery, spitCd: E.spitEvery, phase: 0 });
    this.sync(); this.obj.updateMatrixWorld(true);
    game.collision.addCircle(this.x, this.z, 1.8, 'boss'); // l'hydre est immobile : on ne la traverse pas
    const necks = [], heads = [];
    this.obj.traverse(n => { if (/^neck/.test(n.name)) necks.push(n); if (/^head_club/.test(n.name)) heads.push(n); });
    necks.sort((a, b) => a.name.localeCompare(b.name)); heads.sort((a, b) => a.name.localeCompare(b.name));
    this.heads = necks.map((neck, i) => game.add(new HydraHead(game, { boss: this, neck, head: heads[i], index: i })));
    this.states = {
      intro: { update() {} },
      fight: { update: this.fightUpdate },
      stunned: { update() { if (this.t > E.pilotStun) this.setState('fight'); } },
      die: { enter() { this.inv = 99; this.game.audio.play('heavy'); this.game.events.emit('boss:defeated', this); },
        update(dt) { this.obj.rotation.z = -Math.min(1, this.t) * 0.4; if (rng() < 0.2) this.game.particles.burst(this.x, 2, this.z, 4, 0xffc040, 6); } }
    };
    game.events.on('egboehly:head', () => this.checkHeads());
    this.setState('intro');
  }
  get planted() { return this.heads.filter(h => h.state === 'planted').length; }
  get ratio() { return (5 - this.planted) / 10 + (this.hp / this.maxHp) / 2; }
  checkHeads() {
    this.game.hud.setBoss(this.ratio);
    if (!this.exposed && this.planted === 5) { this.exposed = true; this.phase = 1; this.game.events.emit('boss:phase', 1, this); }
  }
  fightUpdate(dt) {
    this.faceTo(this.player.x, this.player.z, dt * 0.6);
    const active = this.heads.filter(h => h.state === 'idle');
    if ((this.biteCd -= dt) <= 0 && active.length) { // la tête la plus proche de l'Ultra mord
      this.biteCd = E.biteEvery * (0.8 + rng() * 0.4);
      active.sort((a, b) => a.dist(this.player) - b.dist(this.player))[0].bite();
    }
    if ((this.spitCd -= dt) <= 0 && active.length) { // une tête crache un contrat
      this.spitCd = E.spitEvery; const h = active[Math.floor(rng() * active.length)];
      const face = Math.atan2(-(this.player.z - h.z), this.player.x - h.x);
      this.game.add(new Projectile(this.game, { x: h.x, z: h.z, face, speed: E.spitSpeed, dmg: E.dmg, shape: 'ticket', y: 1.6, spin: 16 }));
    }
  }
  start() { this.setState('fight'); }
  // tant que la loge est fermée, le pilote est intouchable ; ensuite il prend tout, et chaque coup l'étourdit un peu
  takeHit(dmg, nx, nz, knock, from) {
    if (!this.exposed || this.stateName === 'die' || this.stateName === 'intro') { this.game.audio.play('ting'); return; }
    super.takeHit(dmg, nx, nz, 0, from);
    this.game.hud.setBoss(this.ratio);
    if (this.alive && this.stateName !== 'stunned') this.setState('stunned');
  }
  onHurt() {}
  onDeath() { this.setState('die'); }
  update(dt) {
    super.update(dt);
    this.game.stars(this.stateName === 'stunned' ? this : null);
  }
}
