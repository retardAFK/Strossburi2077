// Barque-plateforme (générique) : navigue d'arrêt en arrêt sur un canal à niveau d'eau variable.
// Layout : boat: { water, x, start, stops: [{ id, z, dock?: { x, side, levels }, pass? }] }
//   dock  : quai (x du quai, side = -1 ouest / +1 est). On monte avec E, on descend en marchant côté quai,
//           seulement si le niveau d'eau est dans levels (sinon le quai est trop haut / trop bas).
//   pass  : niveau d'eau exigé pour franchir le tronçon entre cet arrêt et le suivant (pont bas...).
// À bord : E = larguer les amarres (vers l'arrêt suivant, ou demi-tour si le passage est bloqué).
// Émet 'boat:board', 'boat:leave' (arrêt), 'boat:arrived' (arrêt), 'boat:blocked' ('pass' | 'end', arrêt).
import { Entity } from '../Entity.js';
import { TUNING } from '../../data/tuning.js';
import { interact, clearPrompt } from '../../systems/Interact.js';

const B = TUNING.boat;

export class Barque extends Entity {
  constructor(game, cfg) {
    super(game, { x: cfg.x, z: cfg.stops[cfg.start || 0].z, r: 1, hp: 1, model: 'pf_barque' });
    this.cfg = cfg; this.stops = cfg.stops; this.stop = cfg.start || 0; this.target = null;
    this.isBoat = true; this.face = Math.PI / 2; // modèle allongé sur x → canal orienté sur z
    this.water = game.world.waters[cfg.water]; this.y = this.water.y;
    // point d'embarquement : sur le quai, en face de la barque
    this.boardPoint = { game, inRange: false, dist: o => { const d = this.dock; return d ? Math.hypot(o.x - d.x, o.z - this.z) : Infinity; } };
    // commande « larguer » : priorité basse (pénalité de distance), pour laisser la main à une vanne à portée
    this.helm = { game, inRange: false, dist: o => this.dist(o) + B.helmBias };
    game.events.on('player:respawn', () => this.leave());
  }
  get here() { return this.stops[this.stop]; }
  get dock() { return this.target === null ? this.here.dock : null; }
  dockOk() { const d = this.dock; return !!d && d.levels.includes(this.water.level); }
  canGo(i, j) { const pass = this.stops[Math.min(i, j)].pass; return pass === undefined || this.water.level === pass; }

  board() {
    const p = this.game.player;
    Object.assign(p, { aboard: true, x: this.x + this.dock.side * B.halfWid * 0.5, z: this.z, vx: 0, vz: 0 });
    this.water.box.on = false; clearPrompt(this.boardPoint);
    this.game.events.emit('boat:board', this.here.id);
  }
  leave() {
    const p = this.game.player; if (!p.aboard) return;
    p.aboard = false; p.y = 0; this.water.box.on = true; clearPrompt(this.helm);
    if (this.dock) p.x = this.dock.x + this.dock.side * 0.7; // posé sur le quai
    this.game.events.emit('boat:leave', this.here.id);
  }
  depart() {
    const i = this.stop, n = this.stops.length;
    if (i + 1 < n && this.canGo(i, i + 1)) { this.target = i + 1; return; }
    this.game.events.emit('boat:blocked', i + 1 < n ? 'pass' : 'end', this.here.id);
    if (i > 0 && this.canGo(i - 1, i)) this.target = i - 1; // demi-tour
  }
  update(dt) {
    this.time += dt;
    const p = this.game.player, x0 = this.x, z0 = this.z;
    if (this.target !== null) {
      const d = this.stops[this.target].z - this.z;
      this.z += Math.sign(d) * Math.min(Math.abs(d), B.speed * dt);
      if (Math.abs(this.stops[this.target].z - this.z) < 1e-4) {
        this.stop = this.target; this.target = null;
        this.game.events.emit('boat:arrived', this.here.id);
      }
    }
    this.y = this.water.y;
    this.obj.position.set(this.x, this.y + Math.sin(this.time * 1.5) * 0.03, this.z); this.obj.rotation.y = this.face;
    if (p.aboard) {
      p.x += this.x - x0; p.z += this.z - z0;
      const dock = this.dock, off = p.x - this.x;
      // descendre : l'Ultra marche au-delà du bord côté quai, et le quai est à la bonne hauteur
      if (dock && this.dockOk() && Math.sign(off) === dock.side && Math.abs(off) > B.halfWid) return this.leave();
      p.x = Math.max(this.x - B.halfWid, Math.min(this.x + B.halfWid, p.x));
      p.z = Math.max(this.z - B.halfLen, Math.min(this.z + B.halfLen, p.z));
      p.y = this.y + B.deck;
      if (this.target === null) { if (interact(this.helm, this.game.texts.prompts.sail, B.useRange + B.helmBias)) this.depart(); }
      else clearPrompt(this.helm);
    } else if (this.dockOk() && interact(this.boardPoint, this.game.texts.prompts.board, B.useRange)) this.board();
    else if (!this.dockOk()) clearPrompt(this.boardPoint);
  }
}
