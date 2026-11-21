// Commandes tactiles (téléphone / tablette) -> mêmes actions abstraites que le clavier et la manette.
//  - moitié gauche de l'écran : joystick virtuel qui apparaît sous le pouce (déplacement analogique -> input.touchMove)
//  - moitié droite : glisser le doigt = caméra (input.look), toucher = valider dans les dialogues / menus
//  - boutons : écharpe, roulade, cible, objet (s'il y en a un), agir (s'il y a quelque chose à portée), pause,
//    changer d'objet (⇄, si plusieurs objets) et viser (si l'objet équipé vise : Arc-Drapeau)
// Ne connaît rien du jeu : les libellés, la visibilité des boutons et le « toucher = valider » sont fournis par main.js.
import { TUNING } from '../data/tuning.js';

const BUTTONS = ['attack', 'roll', 'lock', 'throw', 'use', 'pause', 'switch', 'aim'];

export class Touch {
  // opts : { labels: {action: texte}, tapAction: () => 'ok' | 'pause' | null, rotateText, onFirstInput }
  constructor(input, opts) {
    this.input = input; this.opts = opts; this.T = TUNING.touch;
    this.stick = null;   // { id, x0, y0 } doigt du joystick
    this.look = null;    // { id, x, y, x0, y0, t0 } doigt de la caméra
    this.firstDone = false;
    document.body.classList.add('touch');
    this.build();
  }

  build() {
    const root = this.root = document.createElement('div');
    root.id = 'touch';
    root.innerHTML = `
      <div class="t-zone t-left"></div><div class="t-zone t-right"></div>
      <div class="t-stick"><div class="t-knob"></div></div>
      ${BUTTONS.map(a => `<button class="t-btn t-${a}" data-a="${a}"><span>${this.opts.labels[a] || ''}</span></button>`).join('')}
      <div class="t-rotate"><p>${this.opts.rotateText || ''}</p></div>`;
    document.body.appendChild(root);
    // la couche tactile couvre exactement la zone visible (pas sous les barres de Safari) ;
    // les boutons gardent en plus leur marge d'encoche (env(safe-area-inset-*) dans le CSS)
    const place = () => {
      const vv = window.visualViewport; if (!vv) return;
      Object.assign(root.style, { left: vv.offsetLeft + 'px', top: vv.offsetTop + 'px', width: vv.width + 'px', height: vv.height + 'px', right: 'auto', bottom: 'auto' });
    };
    addEventListener('s3k:viewport', place); place();
    this.base = root.querySelector('.t-stick'); this.knob = root.querySelector('.t-knob');
    this.btn = {}; for (const a of BUTTONS) this.btn[a] = root.querySelector('.t-' + a);
    for (const a of ['throw', 'use', 'switch', 'aim']) this.setVisible(a, false);

    const left = root.querySelector('.t-left'), right = root.querySelector('.t-right');
    left.addEventListener('pointerdown', e => this.stickStart(e));
    right.addEventListener('pointerdown', e => this.lookStart(e));
    root.addEventListener('pointermove', e => this.move(e));
    for (const ev of ['pointerup', 'pointercancel']) root.addEventListener(ev, e => this.end(e));
    for (const a of BUTTONS) {
      const b = this.btn[a];
      b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); this.first(); this.press(a); b.classList.add('on'); b.setPointerCapture?.(e.pointerId); });
      const up = e => { e.preventDefault(); this.release(a); b.classList.remove('on'); };
      b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
    }
    root.addEventListener('contextmenu', e => e.preventDefault());
  }

  // premier contact : son, plein écran et paysage (si le navigateur l'autorise)
  first() {
    this.opts.onFirstInput?.(); this.input.device = 'touch';
    if (this.firstDone) return;
    this.firstDone = true;
    const el = document.documentElement;
    try { el.requestFullscreen?.({ navigationUI: 'hide' })?.then(() => screen.orientation?.lock?.('landscape'))?.catch?.(() => {}); } catch (e) { /* refus */ }
  }
  press(a) { const I = this.input; I.device = 'touch'; if (!I.held[a]) I.pressed[a] = true; I.held[a] = true; }
  release(a) { this.input.held[a] = false; }

  stickStart(e) {
    e.preventDefault(); this.first();
    if (this.stick) return;
    this.stick = { id: e.pointerId, x0: e.clientX, y0: e.clientY };
    e.target.setPointerCapture?.(e.pointerId);
    Object.assign(this.base.style, { left: e.clientX + 'px', top: e.clientY + 'px', display: 'block' });
    this.knob.style.transform = 'translate(-50%,-50%)';
  }
  lookStart(e) {
    e.preventDefault(); this.first();
    if (this.look) return;
    this.look = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t0: performance.now() };
    e.target.setPointerCapture?.(e.pointerId);
  }
  move(e) {
    const T = this.T;
    if (this.stick && e.pointerId === this.stick.id) {
      const R = T.stickRadius;
      let dx = e.clientX - this.stick.x0, dy = e.clientY - this.stick.y0;
      const d = Math.hypot(dx, dy);
      if (d > R) { dx *= R / d; dy *= R / d; }
      this.knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      const m = Math.min(1, d / R);
      const k = m < T.deadzone ? 0 : (m - T.deadzone) / (1 - T.deadzone) / (m || 1);
      this.input.touchMove.x = (dx / R) * k;
      this.input.touchMove.y = (dy / R) * k; // même convention que le stick gauche d'une manette (y vers le bas)
    } else if (this.look && e.pointerId === this.look.id) {
      this.input.look.dx += (e.clientX - this.look.x) * T.lookSens;
      this.input.look.dy += (e.clientY - this.look.y) * T.lookSens;
      this.look.x = e.clientX; this.look.y = e.clientY;
    }
  }
  end(e) {
    if (this.stick && e.pointerId === this.stick.id) {
      this.stick = null; this.base.style.display = 'none';
      this.input.touchMove.x = 0; this.input.touchMove.y = 0;
    } else if (this.look && e.pointerId === this.look.id) {
      const L = this.look; this.look = null;
      // un simple toucher (sans glisser) valide les dialogues et l'écran titre, reprend la pause
      const tap = Math.hypot(e.clientX - L.x0, e.clientY - L.y0) < this.T.tapMove && performance.now() - L.t0 < this.T.tapTime;
      const a = tap ? this.opts.tapAction?.() : null;
      if (a) { this.press(a); this.release(a); }
    }
  }

  setVisible(a, on) { this.btn[a].style.display = on ? '' : 'none'; }
  setLabel(a, text) { this.btn[a].querySelector('span').textContent = text; }
}
