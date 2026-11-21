// Boss : le Directeur de la Valorisation. Sa mallette dorée bloque tout de face.
// Il faut esquiver son écrasement de mallette (onde de choc), puis frapper pendant qu'il est sonné,
// ou le contourner. Ses contrats renvoyés à l'écharpe lui font mal aussi.
import { Enemy } from '../enemies/Enemy.js';
import { Contrat } from '../props/Contrat.js';
import { Consultant } from '../enemies/Consultant.js';
import { pose, walkPose, walkBob } from '../../systems/Animator.js';
import { TUNING } from '../../data/tuning.js';

const D = TUNING.directeur;

export class Directeur extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: D.radius, hp: D.hp, model: 'directeur', scale: 1.45 });
    this.baseScale = 1.45; this.isBoss = true; this.lookY = 2.6; this.volley = D.volleyEvery; this.summoned = false;
    this.states = {
      intro: { update() {} },
      walk: { update: this.walkUpdate },
      slamWindup: { update(dt) { this.telegraph = true; this.faceTo(this.player.x, this.player.z, dt * 4); if (this.t > D.slamWindup) this.setState('slam'); } },
      slam: {
        enter() {
          const x = this.x + this.fx * 2.2, z = this.z + this.fz * 2.2;
          this.game.audio.play('slam'); this.game.camera.shake = 0.7;
          this.game.particles.burst(x, 0.3, z, 22, 0xffd23f, 7);
          this.game.combat.blast(x, z, D.slamRange * 0.6, D.dmg, 14, [this.player], this);
          this.game.shockwave(x, z, D.slamRange);
        },
        update() { if (this.t > 0.25) this.setState('stunned'); }
      },
      stunned: { update() { if (this.t > D.stunned) this.setState('walk'); } },
      volley: {
        enter() { this.shots = 0; },
        update(dt) {
          this.telegraph = this.t < 0.5; this.faceTo(this.player.x, this.player.z, dt * 6);
          if (this.t > 0.5 + this.shots * 0.25 && this.shots < D.volleyCount) {
            const spread = (this.shots - (D.volleyCount - 1) / 2) * 0.25;
            this.game.add(new Contrat(this.game, { x: this.x + this.fx * 1.5, z: this.z + this.fz * 1.5, face: this.face + spread, speed: 12, dmg: 1 }));
            this.game.audio.play('throw'); this.shots++;
          }
          if (this.t > 1.6) this.setState('walk');
        }
      },
      hurt: { update() { if (this.t > 0.3) this.setState('walk'); } },
      die: {
        enter() { this.inv = 99; this.game.audio.play('heavy'); this.game.events.emit('boss:defeated', this); },
        update(dt) {
          this.obj.userData.model.rotation.z = -Math.min(1, this.t) * 1.45;
          if (Math.random() < 0.25) this.game.particles.burst(this.x + (Math.random() - 0.5) * 2, 1.5, this.z + (Math.random() - 0.5) * 2, 4, 0xffd23f, 6);
        }
      }
    };
    this.setState('intro');
  }
  walkUpdate(dt) {
    const p = this.player, d = this.dist(p);
    this.faceTo(p.x, p.z, dt * 2.5);
    if (d > 3.2) { this.x += this.fx * D.speed * dt; this.z += this.fz * D.speed * dt; this.walkT += dt * 6; }
    this.volley -= dt;
    if (d < 4.5 && this.t > 0.8) return this.setState('slamWindup');
    if (this.volley <= 0) { this.volley = D.volleyEvery; return this.setState('volley'); }
    if (!this.summoned && this.hp <= D.hp * D.summonAt) {
      this.summoned = true;
      this.game.bubble(this, this.game.texts.bossSummon, 2.5);
      for (const dx of [-5, 5]) this.game.add(new Consultant(this.game, { x: this.x + dx, z: this.z - 2, group: 'renforts' }));
    }
  }
  // la mallette protège de face, sauf quand il est sonné (ou contre ses propres contrats renvoyés)
  takeHit(dmg, nx, nz, knock, from) {
    const frontal = (-nx * this.fx + -nz * this.fz) > 0.2;
    const open = this.stateName === 'stunned' || this.stateName === 'slamWindup' || from?.isProjectile;
    if (frontal && !open) {
      this.game.audio.play('ting'); this.game.bubble(this, this.game.texts.bossShield, 1);
      this.game.particles.burst(this.x + this.fx * 1.2, 1.6, this.z + this.fz * 1.2, 6, 0xffffff, 4);
      if (from && from.vx !== undefined && !from.isProjectile) { from.vx = -nx * 10; from.vz = -nz * 10; }
      return;
    }
    super.takeHit(dmg, nx, nz, knock * 0.15, from);
    this.game.hud.setBoss(this.hp / this.maxHp);
  }
  onHurt() { if (this.stateName !== 'stunned') this.setState('hurt'); }
  update(dt) {
    super.update(dt);
    const s = this.stateName, o = this.obj;
    if (s === 'walk') pose(o, walkPose(this.walkT, { shF: 15, elF: 30 }, 22), walkBob(this.walkT));
    else if (s === 'slamWindup') pose(o, { shF: 175, elF: 10, shN: 120, torso: -18, head: -10 });
    else if (s === 'slam') pose(o, { shF: 60, elF: 0, shN: 40, torso: 35, hipN: 25, kneeN: -30 });
    else if (s === 'stunned') pose(o, { shF: 40, shN: -20, torso: 40, head: 40 + Math.sin(this.time * 8) * 10, kneeN: -30, kneeF: -30 }, -0.15);
    else if (s === 'volley') pose(o, { shN: 150 - Math.min(1, this.t * 2) * 60, elN: 20, shF: 15, torso: 8 });
    else if (s === 'hurt') pose(o, { torso: -20, head: -20, shN: -20 });
    else if (s !== 'die') pose(o, { shF: 15, elF: 30, head: Math.sin(this.time) * 8 });
    this.game.stars(s === 'stunned' ? this : null);
  }
}
