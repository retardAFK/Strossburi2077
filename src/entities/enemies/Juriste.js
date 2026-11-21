// Le Juriste : garde ses distances et lance des contrats holographiques.
import { Enemy } from './Enemy.js';
import { Contrat } from '../props/Contrat.js';
import { pose, walkPose, walkBob } from '../../systems/Animator.js';
import { TUNING } from '../../data/tuning.js';

const J = TUNING.juriste;

export class Juriste extends Enemy {
  constructor(game, opts) {
    super(game, { ...opts, r: J.radius, hp: J.hp, model: 'juriste', scale: 1.05 });
    this.baseScale = 1.05; this.cd = 1 + Math.random(); this.strafe = Math.random() < 0.5 ? 1 : -1;
    this.states = {
      wait: { update() { if (this.t > 0.6) this.setState('keep'); } },
      keep: { update: this.keepUpdate },
      windup: { update(dt) { this.telegraph = true; this.faceTo(this.player.x, this.player.z, dt * 8); if (this.t > J.throwWindup) this.throwContract(); } },
      hurt: { update() { if (this.t > 0.35) this.setState('keep'); } },
      die: Enemy.dieState(0xff2e88)
    };
    this.setState('wait');
  }
  keepUpdate(dt) {
    const p = this.player, d = this.dist(p);
    this.faceTo(p.x, p.z, dt * 6);
    // recule si trop près, avance si trop loin, tourne autour sinon
    const want = d < J.keepDist - 1.5 ? -1 : (d > J.keepDist + 2 ? 1 : 0);
    const sx = -this.fz * this.strafe, sz = this.fx * this.strafe;
    this.x += (this.fx * want * J.speed + sx * J.speed * 0.5) * dt;
    this.z += (this.fz * want * J.speed + sz * J.speed * 0.5) * dt;
    this.walkT += dt * 8;
    if (this.hitWall) this.strafe *= -1;
    this.separate(dt);
    this.cd -= dt;
    if (this.cd <= 0 && d < 16) { this.cd = J.throwEvery + Math.random(); this.setState('windup'); }
    this.bark('juriste');
  }
  throwContract() {
    this.game.audio.play('throw');
    this.game.add(new Contrat(this.game, { x: this.x + this.fx * 0.8, z: this.z + this.fz * 0.8, face: this.face, speed: J.projSpeed, dmg: J.dmg }));
    this.setState('keep');
  }
  update(dt) {
    super.update(dt);
    if (this.removed) return;
    const s = this.stateName, o = this.obj;
    if (s === 'keep') pose(o, walkPose(this.walkT, { shN: 30, elN: 80 }, 25), walkBob(this.walkT));
    else if (s === 'windup') pose(o, { shN: 170, elN: 40, torso: -15, head: -10 });
    else if (s === 'hurt') pose(o, { torso: -30, head: -25, shN: -40, shF: -40 });
    else if (s !== 'die') pose(o, { shN: 30, elN: 80 });
  }
}
