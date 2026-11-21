// Clavier / souris / manette -> actions abstraites.
// held[a] : action maintenue ; pressed[a] : vient d'être appuyée (remis à zéro à chaque tick).
// look : déplacement souris accumulé (pixels) ; stick : stick droit brut (-1..1). Remis à zéro à chaque tick.
// Actions spéciales : pressed.capture = clic qui capture la souris (n'attaque pas),
//                     pressed.release = la souris vient d'être libérée (Échap du navigateur).
const KEYS = {
  KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
  KeyJ: 'attack', Space: 'roll', KeyK: 'roll', ShiftLeft: 'lock', ShiftRight: 'lock', KeyL: 'lock',
  KeyE: 'use', Enter: 'ok', KeyM: 'mute', KeyP: 'pause', Escape: 'pause'
};
const ESC_AFTER_RELEASE_MS = 300; // Échap qui vient de libérer la souris : ne pas le compter deux fois

export class Input {
  constructor(element, onFirstInput) {
    this.el = element;
    this.held = {}; this.pressed = {}; this.padPrev = {};
    this.look = { dx: 0, dy: 0 }; this.stick = { x: 0, y: 0 };
    this.releasedAt = -1e9;
    const press = (a) => { if (!this.held[a]) this.pressed[a] = true; this.held[a] = true; onFirstInput?.(); };
    addEventListener('keydown', e => {
      const a = KEYS[e.code]; if (!a) return; e.preventDefault();
      if (e.code === 'Escape' && (this.locked || performance.now() - this.releasedAt < ESC_AFTER_RELEASE_MS)) return;
      press(a);
    });
    addEventListener('keyup', e => { const a = KEYS[e.code]; if (a) this.held[a] = false; });
    element.addEventListener('contextmenu', e => e.preventDefault());
    element.addEventListener('mousedown', e => {
      onFirstInput?.();
      if (!this.locked) { this.pressed.capture = true; this.capture(); return; } // 1er clic : capture seulement
      if (e.button === 0) this.pressed.attack = true;
      if (e.button === 2) press('lock');
    });
    addEventListener('mouseup', e => { if (e.button === 2) this.held.lock = false; });
    addEventListener('mousemove', e => { if (this.locked) { this.look.dx += e.movementX; this.look.dy += e.movementY; } });
    document.addEventListener('pointerlockchange', () => {
      if (!this.locked) { this.releasedAt = performance.now(); this.pressed.release = true; this.held.lock = false; }
    });
  }
  get locked() { return document.pointerLockElement === this.el; }
  capture() {
    // certains navigateurs refusent une recapture juste après Échap : on ignore, le clic suivant réessaiera
    try { this.el.requestPointerLock?.()?.catch?.(() => {}); } catch (e) { /* refus silencieux */ }
  }
  releasePointer() { if (this.locked) document.exitPointerLock(); }

  pollGamepad() {
    const p = [...(navigator.getGamepads ? navigator.getGamepads() : [])].find(Boolean);
    if (!p) return;
    const b = i => !!(p.buttons[i] && p.buttons[i].pressed);
    const st = { left: p.axes[0] < -0.4, right: p.axes[0] > 0.4, up: p.axes[1] < -0.4, down: p.axes[1] > 0.4,
      attack: b(2), roll: b(0), lock: b(6) || b(4), use: b(3), ok: b(9) || b(1), pause: b(8) };
    for (const k in st) { if (st[k] && !this.padPrev[k]) this.pressed[k] = true; if (st[k] || this.padPrev[k]) this.held[k] = st[k]; }
    this.padPrev = st;
    this.stick.x = p.axes[2] || 0; this.stick.y = p.axes[3] || 0; // stick droit (zone morte gérée par la caméra)
  }
  // direction de déplacement brute (-1..1)
  axis() {
    return { x: (this.held.right ? 1 : 0) - (this.held.left ? 1 : 0), y: (this.held.up ? 1 : 0) - (this.held.down ? 1 : 0) };
  }
  endTick() {
    for (const k in this.pressed) this.pressed[k] = false;
    this.look.dx = 0; this.look.dy = 0;
  }
}
