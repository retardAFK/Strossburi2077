// Le Videur-Maître d'hôtel (mini-boss des Ponts Couverts) : un Serveur large et lourd qui pare tout au plateau.
// Combat-tutoriel du bretzel-boomerang : seul le bretzel l'atteint (il ne pare jamais ce qu'il ne voit pas
// arriver en courbe), et le coup l'assomme (« stun ») le temps de le frapper à l'écharpe.
import { Serveur } from './Serveur.js';
import { pose } from '../../systems/Animator.js';
import { TUNING } from '../../data/tuning.js';

const V = TUNING.videur;

export class VideurMaitreHotel extends Serveur {
  constructor(game, opts) {
    super(game, opts);
    this.hp = this.maxHp = V.hp; this.r = V.radius; this.isMiniBoss = true;
    this.baseScale = V.scale; this.obj.scale.setScalar(V.scale);
    this.lookY = 2.2; this.blocks = 0;
    this.states.stun = {
      enter() { this.trayT = V.stun; this.game.audio.play('heavy'); },
      update() {
        if (Math.floor(this.t * 4) !== Math.floor((this.t - this.game.dt) * 4)) // étoiles qui tournent
          this.game.particles.burst(this.x, 2.6 * V.scale, this.z, 3, 0xffe060, 1.5);
        if (this.t > V.stun) this.setState('chase');
      }
    };
  }
  bark() { super.bark('videur'); } // ses propres répliques
  get stunned() { return this.stateName === 'stun'; }
  onHurt() { if (!this.stunned) super.onHurt(); } // les coups pendant l'étourdissement ne le réveillent pas
  takeHit(dmg, nx, nz, knock, from) {
    if (this.stateName === 'die') return;
    const L = this.game.levelTexts.videur;
    if (from?.isPlayerShot) { // bretzel-boomerang : dans le plateau, il est sonné
      const wasStunned = this.stunned;
      super.takeHit(dmg, nx, nz, knock * V.knockTaken, from);
      if (this.alive && !wasStunned) { this.setState('stun'); this.game.bubble(this, L.stunned, 1.2); }
    } else if (this.stunned || !from) { // sonné (ou dégâts de debug F3)
      super.takeHit(dmg, nx, nz, knock * V.knockTaken, from);
    } else { // tout le reste est paré au plateau, et l'Ultra est repoussé
      this.game.audio.play('ting'); this.game.bubble(this, L.shield, 0.8);
      if (from === this.game.player) { from.vx = -nx * V.pushBack; from.vz = -nz * V.pushBack; }
      if (++this.blocks === V.hintAfter) this.game.say(L.hint); // rappel de la winstubière
      return;
    }
    this.game.hud.setBoss(Math.max(0, this.hp) / this.maxHp);
  }
  update(dt) {
    super.update(dt);
    if (this.removed || !this.stunned) return;
    const w = Math.sin(this.time * 9); // titube, bras ballants, tête qui tourne
    pose(this.obj, { torso: -18, head: w * 25, shN: -20, shF: -25, elN: 10, hipN: 8 * w, hipF: -8 * w });
    this.obj.rotation.y = this.face + w * 0.15;
  }
}
