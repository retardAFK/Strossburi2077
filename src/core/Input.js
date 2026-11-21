// Clavier / souris / manette -> actions abstraites.
// held[a] : action maintenue ; pressed[a] : vient d'être appuyée (remis à zéro à chaque tick).
const KEYS = {
  KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
  KeyJ: 'attack', Space: 'roll', KeyK: 'roll', ShiftLeft: 'lock', ShiftRight: 'lock', KeyL: 'lock',
  KeyE: 'use', Enter: 'ok', KeyM: 'mute', KeyP: 'pause', Escape: 'pause'
};

export class Input {
  constructor(element, onFirstInput) {
    this.held = {}; this.pressed = {}; this.padPrev = {};
    const press = (a) => { if (!this.held[a]) this.pressed[a] = true; this.held[a] = true; onFirstInput?.(); };
    addEventListener('keydown', e => { const a = KEYS[e.code]; if (!a) return; e.preventDefault(); press(a); });
    addEventListener('keyup', e => { const a = KEYS[e.code]; if (a) this.held[a] = false; });
    element.addEventListener('contextmenu', e => e.preventDefault());
    element.addEventListener('mousedown', e => { if (e.button === 0) { this.pressed.attack = true; onFirstInput?.(); } if (e.button === 2) press('lock'); });
    addEventListener('mouseup', e => { if (e.button === 2) this.held.lock = false; });
  }
  pollGamepad() {
    const p = [...(navigator.getGamepads ? navigator.getGamepads() : [])].find(Boolean);
    if (!p) return;
    const b = i => !!(p.buttons[i] && p.buttons[i].pressed);
    const st = { left: p.axes[0] < -0.4, right: p.axes[0] > 0.4, up: p.axes[1] < -0.4, down: p.axes[1] > 0.4,
      attack: b(2), roll: b(0), lock: b(6) || b(4), use: b(3), ok: b(9) || b(1), pause: b(8) };
    for (const k in st) { if (st[k] && !this.padPrev[k]) this.pressed[k] = true; if (st[k] || this.padPrev[k]) this.held[k] = st[k]; }
    this.padPrev = st;
  }
  // direction de déplacement brute (-1..1)
  axis() {
    return { x: (this.held.right ? 1 : 0) - (this.held.left ? 1 : 0), y: (this.held.up ? 1 : 0) - (this.held.down ? 1 : 0) };
  }
  endTick() { for (const k in this.pressed) this.pressed[k] = false; }
}
