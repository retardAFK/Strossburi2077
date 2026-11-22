// Minuterie (générique) sur le temps du JEU (pause, dialogues et tests compris, contrairement à setTimeout) :
// appelle tick(n) toutes les `every` s, au plus `times` fois ; stop() l'arrête. Invisible.
// Usage dans un script : game.add(new Horloge(game, { every: 60, times: 2, tick: n => ... })).
import { Entity } from '../Entity.js';

export class Horloge extends Entity {
  constructor(game, { every, times = Infinity, tick }) {
    super(game, { x: 0, z: 0, r: 0, hp: 1 });
    Object.assign(this, { every, times, tick, n: 0, acc: 0 });
  }
  stop() { this.alive = false; this.remove(); }
  takeHit() {}
  update(dt) {
    if (this.removed) return;
    if ((this.acc += dt) < this.every) return;
    this.acc = 0; this.n++; this.tick(this.n);
    if (this.n >= this.times) this.stop();
  }
}
