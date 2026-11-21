// Agent immobilier-clone BlingCo LOFTS (Port du Rhin 2026, fiche docs/designs/agent-immo.md) : sbire du kit générique.
// Gag validé : il plante des pancartes VENDU partout (Pancarte.js) en patrouillant, et sur l'Ultra quand il le touche
// (gag seulement : la question d'un malus « en vente » reste posée à Maxime). Pivots en plus : pancarte (x4).
import { Sbire } from './Sbire.js';
import { Pancarte } from '../props/Pancarte.js';
import { pose } from '../../systems/Animator.js';
import { rng } from '../../core/Random.js';
import { TUNING } from '../../data/tuning.js';

const A = TUNING.agentImmo;

export class AgentImmo extends Sbire {
  constructor(game, opts) {
    super(game, { ...opts, kind: 'agent', model: 'agent_immo', label: 'AGENT IMMO' });
    this.plantCd = A.plantEvery * (0.4 + rng()); this.planted = 0;
    this.states.plant = {
      enter() { this.game.bubble(this, this.game.texts.barks.agent?.[0] || '', 1); },
      update() {
        if (this.t > 0.6 && !this.didPlant) {
          this.didPlant = true; this.planted++;
          this.game.add(new Pancarte(this.game, { x: this.x + this.fx * 0.9, z: this.z + this.fz * 0.9 }));
        }
        if (this.t > 1) { this.didPlant = false; this.setState('patrol'); }
      }
    };
    this.onHitPlayer = (e, from) => {
      if (from !== this || e !== this.game.player || this.game.entities.some(x => x.isPancarte && x.onPlayer && !x.removed)) return;
      this.game.add(new Pancarte(this.game, { x: e.x, z: e.z, onPlayer: true }));
      this.game.bubble(e, this.game.texts.barks.agent?.[1] || '', 1.2);
    };
    game.events.on('hit', this.onHitPlayer);
  }
  patrolUpdate(dt) {
    if (this.planted < A.plantMax && (this.plantCd -= dt) <= 0 && !this.sees()) { this.plantCd = A.plantEvery * (0.7 + rng() * 0.6); return this.setState('plant'); }
    super.patrolUpdate(dt);
  }
  update(dt) {
    super.update(dt);
    if (!this.removed && this.stateName === 'plant') pose(this.obj, { shF: 80 - this.t * 90, elF: 20, torso: 12 });
  }
}
