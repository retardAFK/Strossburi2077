// Clavier / souris / manette / tactile -> actions abstraites.
// held[a] : action maintenue ; pressed[a] : vient d'être appuyée (remis à zéro à chaque tick).
// look : déplacement souris / doigt accumulé (pixels, remis à zéro à chaque tick) ; stick : stick droit traité (-1..1).
// Actions spéciales : pressed.capture = clic qui capture la souris (n'attaque pas),
//   pressed.release = la souris vient d'être libérée (Échap du navigateur), pressed.padLost = manette débranchée.
// Manette : disposition « standard » uniquement (Xbox, PlayStation et la plupart des manettes y sont ramenées).
// device = dernier appareil utilisé ('kb' | 'pad' | 'touch'), padType = 'xbox' | 'ps', padUnknown = manette non standard.
// Déplacement analogique : move = stick gauche, touchMove = joystick tactile (core/Touch.js), séparés pour
// qu'une manette branchée n'écrase pas le joystick tactile (et inversement).
import { TUNING } from '../data/tuning.js';

const KEYS = {
  KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
  KeyJ: 'attack', Space: 'roll', KeyK: 'roll', ShiftLeft: 'lock', ShiftRight: 'lock', KeyL: 'lock',
  KeyE: 'use', KeyF: 'throw', Enter: 'ok', Backspace: 'back', KeyV: 'rumble', KeyM: 'mute', KeyP: 'pause', Escape: 'pause'
};
// boutons de la disposition standard (indices W3C) → actions
const PAD = { attack: [2], roll: [0], use: [3], throw: [5], lock: [6], ok: [0], back: [1], pause: [9], rumble: [8] };
const ESC_AFTER_RELEASE_MS = 300; // Échap qui vient de libérer la souris : ne pas le compter deux fois
const PS_IDS = /054c|dualshock|dualsense|playstation/i;

export class Input {
  constructor(element, onFirstInput) {
    this.el = element; this.onFirstInput = onFirstInput;
    this.held = {}; this.pressed = {}; this.padPrev = {};
    this.look = { dx: 0, dy: 0 }; this.stick = { x: 0, y: 0 }; this.move = { x: 0, y: 0 }; this.touchMove = { x: 0, y: 0 };
    this.releasedAt = -1e9; this.device = 'kb'; this.padType = 'xbox'; this.padUnknown = false; this.padIndex = null;
    this.rumbleOn = TUNING.pad.rumble;
    try { const v = localStorage.getItem('s3k.rumble'); if (v !== null) this.rumbleOn = v === '1'; } catch (e) { /* pas de stockage */ }
    const press = (a) => { if (!this.held[a]) this.pressed[a] = true; this.held[a] = true; onFirstInput?.(); };
    addEventListener('keydown', e => {
      const a = KEYS[e.code]; if (!a) return; e.preventDefault(); this.device = 'kb';
      if (e.code === 'Escape' && (this.locked || performance.now() - this.releasedAt < ESC_AFTER_RELEASE_MS)) return;
      press(a);
    });
    addEventListener('keyup', e => { const a = KEYS[e.code]; if (a) this.held[a] = false; });
    element.addEventListener('contextmenu', e => e.preventDefault());
    element.addEventListener('mousedown', e => {
      onFirstInput?.(); this.device = 'kb';
      if (!this.locked) { this.pressed.capture = true; this.capture(); return; } // 1er clic : capture seulement
      if (e.button === 0) this.pressed.attack = true;
      if (e.button === 2) press('alt'); // objet si rien n'est verrouillé, sinon verrouillage (voir Inventory)
    });
    addEventListener('mouseup', e => { if (e.button === 2) this.held.alt = false; });
    addEventListener('mousemove', e => { if (this.locked) { this.device = 'kb'; this.look.dx += e.movementX; this.look.dy += e.movementY; } });
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

  // zone morte radiale + courbe douce : vecteur (-1..1) sans saut à la sortie de la zone morte
  static shape(x, y, P) {
    const m = Math.hypot(x, y);
    if (m < P.deadzone) return { x: 0, y: 0 };
    const k = Math.pow(Math.min(1, (m - P.deadzone) / (1 - P.deadzone)), P.curve) / m;
    return { x: x * k, y: y * k };
  }
  // appelé une fois par image : branchement / débranchement à chaud, boutons, sticks
  pollGamepad() {
    const P = TUNING.pad, list = [...(navigator.getGamepads ? navigator.getGamepads() : [])];
    const p = list.find(g => g && g.connected && g.index === this.padIndex) || list.find(g => g && g.connected);
    if (!p) {
      if (this.padIndex !== null) { // la manette en cours d'usage vient de disparaître
        if (this.device === 'pad') this.pressed.padLost = true;
        this.padIndex = null; this.pad = null; if (this.device === 'pad') this.device = 'kb'; this.releasePad();
      }
      this.padUnknown = false; return;
    }
    this.padIndex = p.index; this.pad = p;
    this.padUnknown = p.mapping !== 'standard';
    if (this.padUnknown) return; // manette non reconnue : le clavier reste actif, le HUD prévient
    this.padType = PS_IDS.test(p.id) ? 'ps' : 'xbox';
    const b = i => !!(p.buttons[i] && p.buttons[i].pressed);
    const st = {};
    for (const a in PAD) st[a] = PAD[a].some(b);
    this.move = Input.shape(p.axes[0] || 0, p.axes[1] || 0, P);
    const look = Input.shape(p.axes[2] || 0, p.axes[3] || 0, P);
    this.stick.x = look.x; this.stick.y = look.y;
    if (Object.values(st).some(Boolean) || this.move.x || this.move.y || look.x || look.y) {
      if (this.device !== 'pad') this.onFirstInput?.();
      this.device = 'pad';
    }
    for (const k in st) { if (st[k] && !this.padPrev[k]) this.pressed[k] = true; if (st[k] || this.padPrev[k]) this.held[k] = st[k]; }
    this.padPrev = st;
  }
  releasePad() { for (const k in this.padPrev) this.held[k] = false; this.padPrev = {}; this.move = { x: 0, y: 0 }; this.stick.x = this.stick.y = 0; }
  // vibration (si la manette la gère et si le joueur ne l'a pas coupée)
  rumble(strength, ms) {
    const act = this.pad?.vibrationActuator;
    if (!this.rumbleOn || this.device !== 'pad' || !act?.playEffect) return;
    act.playEffect('dual-rumble', { duration: ms, strongMagnitude: Math.min(1, strength), weakMagnitude: Math.min(1, strength * 0.6) })?.catch?.(() => {});
  }
  toggleRumble() {
    this.rumbleOn = !this.rumbleOn;
    try { localStorage.setItem('s3k.rumble', this.rumbleOn ? '1' : '0'); } catch (e) { /* pas de stockage */ }
    return this.rumbleOn;
  }
  // direction de déplacement (-1..1) : stick gauche, sinon joystick tactile, sinon clavier
  axis() {
    if (this.move.x || this.move.y) return { x: this.move.x, y: -this.move.y };
    if (this.touchMove.x || this.touchMove.y) return { x: this.touchMove.x, y: -this.touchMove.y };
    return { x: (this.held.right ? 1 : 0) - (this.held.left ? 1 : 0), y: (this.held.up ? 1 : 0) - (this.held.down ? 1 : 0) };
  }
  endTick() {
    for (const k in this.pressed) this.pressed[k] = false;
    this.look.dx = 0; this.look.dy = 0;
  }
}
