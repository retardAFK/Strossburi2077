// Manette virtuelle pour tester sans matériel : ?debug=1&fakepad=xbox (ou ps).
// Remplace navigator.getGamepads par une manette « standard » pilotée au pavé numérique :
//   8 / 4 / 5 / 6 : stick gauche     7 / 9 : stick droit (caméra)
//   1 : X / □ (écharpe)   0 : A / ✕ (roulade, valider)   3 : Y / △ (interagir)   . : B / ○ (retour)
//   + : RB / R1 (objet)   - : LT / L2 (verrouiller)      Entrée : Start / Options   * : Vue / Share (vibrations)
//   / : débrancher / rebrancher (teste la pause automatique)
const IDS = {
  xbox: 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)',
  ps: 'DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)'
};
const BUTTONS = { Numpad0: 0, NumpadDecimal: 1, Numpad1: 2, Numpad3: 3, NumpadAdd: 5, NumpadSubtract: 6, NumpadMultiply: 8, NumpadEnter: 9 };
const AXES = { Numpad4: [0, -1], Numpad6: [0, 1], Numpad8: [1, -1], Numpad5: [1, 1], Numpad7: [2, -1], Numpad9: [2, 1] };

export function installFakePad() {
  const q = new URLSearchParams(location.search);
  const type = q.get('fakepad');
  if (q.get('debug') !== '1' || !type) return null;
  const pad = {
    id: IDS[type] || IDS.xbox, index: 0, connected: true, mapping: 'standard', timestamp: 0,
    axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 })),
    vibrationActuator: { playEffect: (t, p) => { console.info('[fakepad] vibration', p.strongMagnitude.toFixed(2), p.duration + 'ms'); pad.lastRumble = p; return Promise.resolve('complete'); } }
  };
  const held = new Set();
  const refresh = () => {
    pad.axes = [0, 0, 0, 0];
    for (const code of held) if (AXES[code]) { const [i, s] = AXES[code]; pad.axes[i] += s; }
    pad.buttons.forEach((b, i) => { const on = [...held].some(c => BUTTONS[c] === i); b.pressed = on; b.value = on ? 1 : 0; });
    pad.timestamp = performance.now();
  };
  const handle = (e, down) => {
    if (e.code === 'NumpadDivide') { if (down) { pad.connected = !pad.connected; console.info('[fakepad]', pad.connected ? 'branchée' : 'débranchée'); } e.preventDefault(); return; }
    if (!(e.code in BUTTONS) && !(e.code in AXES)) return;
    e.preventDefault(); e.stopPropagation();
    if (down) held.add(e.code); else held.delete(e.code);
    refresh();
  };
  addEventListener('keydown', e => handle(e, true), true);
  addEventListener('keyup', e => handle(e, false), true);
  navigator.getGamepads = () => [pad.connected ? pad : null];
  window.S3K_FAKEPAD = pad;
  console.info('[fakepad] manette virtuelle', type, ': pavé numérique (voir src/fakepad.js)');
  return pad;
}
