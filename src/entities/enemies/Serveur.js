// L'Androïde Serveur (BlingCo Restauration) : fonce et gifle au plateau comme le Consultant ;
// à mi-distance (entre throwMin et throwMax), il lance son assiette. Pivot 'tray' = le plateau.
import { Enemy } from './Enemy.js';
import { Projectile } from '../props/Projectile.js';
import { pose, walkPose, walkBob } from '../../systems/Animator.js';
import { TUNING } from '../../data/tuning.js';

const S = TUNING.serveur;

export class Serveur extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: S.radius, hp: S.hp, model: 'serveur' });
    this.baseScale = 1; this.throwCd = S.throwEvery * Math.random(); this.trayT = 0;
    this.tray = this.obj.userData.J.tray;
    this.states = {
      wait: { update() { if (this.t > 0.4 + Math.random() * 0.5) this.setState('chase'); } },
      chase: { update: this.chaseUpdate },
      windup: { update(dt) { this.telegraph = true; this.faceTo(this.player.x, this.player.z, dt * 8); if (this.t > S.windup) this.setState('lunge'); } },
      lunge: {
        enter() { this.hitDone = false; },
        update(dt) {
          this.x += this.fx * S.lunge * dt; this.z += this.fz * S.lunge * dt;
          if (!this.hitDone && this.dist(this.player) < this.r + this.player.r + 0.5) {
            this.hitDone = true; this.player.takeHit(S.dmg, this.fx, this.fz, 9, this);
          }
          if (this.t > S.lungeTime) this.setState('recover');
        }
      },
      recover: { update() { if (this.t > S.recover) this.setState('chase'); } },
      aim: { update(dt) { this.telegraph = true; this.faceTo(this.player.x, this.player.z, dt * 10); if (this.t > S.throwWindup) this.throwPlate(); } },
      hurt: { update() { if (this.t > 0.35) this.setState('chase'); } },
      die: Enemy.dieState(0xffc040)
    };
    this.setState('wait');
  }
  chaseUpdate(dt) {
    const p = this.player, d = this.dist(p);
    this.faceTo(p.x, p.z, dt * 6);
    this.throwCd -= dt;
    if (this.throwCd <= 0 && d > S.throwMin && d < S.throwMax) return this.setState('aim');
    if (d > S.reach) { this.x += this.fx * S.speed * dt; this.z += this.fz * S.speed * dt; this.walkT += dt * 11; }
    else if (this.t > 0.4) this.setState('windup');
    this.separate(dt);
    this.bark('serveur');
  }
  throwPlate() {
    this.game.audio.play('throw');
    this.game.add(new Projectile(this.game, { x: this.x + this.fx * 0.8, z: this.z + this.fz * 0.8, face: this.face,
      speed: S.plateSpeed, dmg: S.dmg, shape: 'assiette', y: 1.1, spin: 14 }));
    this.throwCd = S.throwEvery + Math.random(); this.trayT = S.trayBack;
    this.setState('chase');
  }
  update(dt) {
    super.update(dt);
    if (this.removed) return;
    this.trayT -= dt; if (this.tray) this.tray.visible = this.trayT <= 0; // plateau vide le temps d'en reprendre un
    const s = this.stateName, o = this.obj;
    if (s === 'chase') pose(o, walkPose(this.walkT, { shN: 70, elN: 85 }), walkBob(this.walkT));
    else if (s === 'windup') pose(o, { shN: 170, elN: 20, shF: -30, torso: -12, hipF: -15 });
    else if (s === 'lunge') pose(o, { shN: 80, elN: 0, torso: 30, hipN: 40, hipF: -40, kneeF: -20 });
    else if (s === 'aim') pose(o, { shN: -40 + this.t / S.throwWindup * 60, elN: 60, torso: -18, shF: 30 });
    else if (s === 'hurt') pose(o, { torso: -30, head: -25, shN: -40, shF: -40 });
    else if (s !== 'die') pose(o, { shN: 70, elN: 85, head: Math.sin(this.time * 2) * 8 }); // plateau à la main
  }
}
