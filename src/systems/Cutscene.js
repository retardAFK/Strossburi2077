// Cinématique générique : la caméra enchaîne des plans (travellings) et des sous-titres minutés.
// Plans : { from: [x,y,z], to: [x,y,z], look: [x,y,z], lookTo?: [x,y,z], dur } (secondes).
// Sous-titres : [{ at, txt }] ; affichés par le HUD via l'événement 'hud:caption' (texte | null).
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = k => k * k * (3 - 2 * k);

export class Cutscene {
  constructor(game, { shots, captions = [] }) {
    this.game = game; this.shots = shots; this.captions = captions;
    this.t = 0; this.caption = -1;
    this.total = shots.reduce((a, s) => a + s.dur, 0);
  }
  get done() { return this.t >= this.total; }
  update(dt) {
    this.t += dt;
    // plan courant et avancement dans ce plan
    let t = this.t, s = this.shots[this.shots.length - 1];
    for (const sh of this.shots) { if (t <= sh.dur) { s = sh; break; } t -= sh.dur; }
    const k = smooth(Math.min(1, Math.max(0, t / s.dur)));
    const cam = this.game.renderer.camera, to = s.to || s.from, lt = s.lookTo || s.look;
    cam.position.set(lerp(s.from[0], to[0], k), lerp(s.from[1], to[1], k), lerp(s.from[2], to[2], k));
    cam.lookAt(lerp(s.look[0], lt[0], k), lerp(s.look[1], lt[1], k), lerp(s.look[2], lt[2], k));
    // sous-titre courant : le dernier dont l'heure est passée
    let i = -1;
    this.captions.forEach((c, j) => { if (this.t >= c.at) i = j; });
    if (i !== this.caption) { this.caption = i; this.game.events.emit('hud:caption', i >= 0 ? this.captions[i].txt : null); }
  }
  end() { this.game.events.emit('hud:caption', null); }
}
