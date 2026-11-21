// Le Videur-Maître d'hôtel (mini-boss des Ponts Couverts) : un Serveur large et lourd qui bloque tout de face.
// Vulnérable de dos, ou de face pendant qu'il récupère après sa charge (« recover »).
import { Serveur } from './Serveur.js';
import { TUNING } from '../../data/tuning.js';

const V = TUNING.videur;

export class VideurMaitreHotel extends Serveur {
  constructor(game, opts) {
    super(game, opts);
    this.hp = this.maxHp = V.hp; this.r = V.radius; this.isMiniBoss = true;
    this.baseScale = V.scale; this.obj.scale.setScalar(V.scale);
    this.lookY = 2.2;
  }
  bark() { super.bark('videur'); } // ses propres répliques
  // garde de face : le coup vient de devant si l'attaquant est du côté où il regarde
  takeHit(dmg, nx, nz, knock, from) {
    const front = -(nx * this.fx + nz * this.fz) > V.guard;
    if (front && this.stateName !== 'recover' && this.stateName !== 'die') {
      this.game.audio.play('ting'); this.game.bubble(this, this.game.levelTexts.videur.shield, 0.8);
      if (from === this.game.player) { from.vx = -nx * V.pushBack; from.vz = -nz * V.pushBack; } // repousse l'Ultra
      return;
    }
    super.takeHit(dmg, nx, nz, knock * V.knockTaken, from);
    this.game.hud.setBoss(this.hp / this.maxHp);
  }
}
