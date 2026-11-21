// =====================================================================
//  STRASBOURG 3000 — Donjon I : la Cathédrale (prototype 3D, style N64)
//  Modèles : Blender (tools/build3d.py) -> glTF embarqués dans models.js
// =====================================================================
(async () => {
'use strict';
const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/+esm');
const { GLTFLoader } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js/+esm');

// ------------------------------------------------------------ rendu basse résolution
const RW = 480, RH = 270;
const canvas = document.getElementById('c');
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(1);
renderer.setSize(RW, RH, false);
function fit() {
  const s = Math.min(innerWidth / RW, innerHeight / RH);
  stage.style.width = Math.floor(RW * s) + 'px';
  stage.style.height = Math.floor(RH * s) + 'px';
}
addEventListener('resize', fit); fit();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x140c26);
scene.fog = new THREE.Fog(0x140c26, 16, 42);
const camera = new THREE.PerspectiveCamera(55, RW / RH, 0.1, 120);
scene.add(new THREE.HemisphereLight(0xffe2c8, 0x2a1a48, 1.1));
const sun = new THREE.DirectionalLight(0xfff0d0, 1.0);
sun.position.set(6, 14, 4);
scene.add(sun);

// ------------------------------------------------------------ utilitaires
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
const D2R = Math.PI / 180;

function canvasTex(w, h, draw, rx = 1, ry = 1) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = t.minFilter = THREE.NearestFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
// dallage de la cathédrale : grès rose et pierre grise en damier
const floorTex = (rx, ry) => canvasTex(32, 32, (g) => {
  for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
    g.fillStyle = (x + y) % 2 ? '#b97a7a' : '#8f8a9e'; g.fillRect(x * 16, y * 16, 16, 16);
    g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x * 16, y * 16 + 15, 16, 1); g.fillRect(x * 16 + 15, y * 16, 1, 16);
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x * 16 + 3, y * 16 + 4, 4, 2);
  }
}, rx, ry);
// murs : blocs de grès rose des Vosges
const wallTex = (rx, ry) => canvasTex(32, 32, (g) => {
  g.fillStyle = '#c98282'; g.fillRect(0, 0, 32, 32);
  const cols = ['#c27a7a', '#d08c88', '#b87070', '#cf9490'];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const off = (r % 2) * 5;
    g.fillStyle = cols[(r + c) % 4]; g.fillRect(c * 11 + off - 5, r * 8, 10, 7);
  }
  g.fillStyle = 'rgba(40,10,20,.35)';
  for (let r = 0; r < 4; r++) g.fillRect(0, r * 8 + 7, 32, 1);
}, rx, ry);
// vitrail
const glassTex = () => canvasTex(16, 32, (g) => {
  const cols = ['#ff2e88', '#38f2ff', '#ffd23f', '#3a6be0', '#7a35e0', '#3ad65a', '#e0303a'];
  for (let y = 0; y < 32; y += 4) for (let x = 0; x < 16; x += 4) { g.fillStyle = cols[(x * 3 + y * 7) % cols.length]; g.fillRect(x, y, 4, 4); }
  g.fillStyle = '#1a1020';
  for (let y = 0; y < 32; y += 4) g.fillRect(0, y, 16, 1);
  for (let x = 0; x < 16; x += 4) g.fillRect(x, 0, 1, 32);
});
const roseTex = () => canvasTex(64, 64, (g) => {
  const cols = ['#ff2e88', '#38f2ff', '#ffd23f', '#3a6be0', '#7a35e0', '#3ad65a'];
  g.fillStyle = '#1a1020'; g.beginPath(); g.arc(32, 32, 32, 0, 7); g.fill();
  for (let i = 0; i < 12; i++) {
    g.fillStyle = cols[i % cols.length]; g.beginPath(); g.moveTo(32, 32);
    g.arc(32, 32, 29, i / 12 * 6.283, (i + 0.85) / 12 * 6.283); g.fill();
  }
  g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(32, 32, 8, 0, 7); g.fill();
  g.fillStyle = '#1a1020'; g.beginPath(); g.arc(32, 32, 4, 0, 7); g.fill();
});

// ------------------------------------------------------------ chargement des modèles Blender
const loader = new GLTFLoader();
function b64ToBuf(b64) { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u.buffer; }
const PROTO = {};
await Promise.all(Object.entries(window.S3K_MODELS).map(([k, b64]) => new Promise((ok, ko) => {
  loader.parse(b64ToBuf(b64), '', g => {
    g.scene.traverse(o => {
      if (o.isMesh) {
        const old = o.material;
        if (old.map) { old.map.magFilter = old.map.minFilter = THREE.NearestFilter; }
        o.material = new THREE.MeshLambertMaterial({ color: old.color, map: old.map || null, flatShading: true });
      }
    });
    PROTO[k] = g.scene; ok();
  }, ko);
})));

function instance(name) {
  const o = PROTO[name].clone(true);
  o.traverse(m => { if (m.isMesh) m.material = m.material.clone(); });
  const J = {};
  o.traverse(n => { const k = n.name.replace(/\d+$/, ''); if (!J[k]) J[k] = n; });
  o.userData.J = J;
  const holder = new THREE.Group(); holder.add(o);
  holder.userData.J = J; holder.userData.model = o;
  return holder;
}
// pose : angles "vers l'avant" en degrés (convention des scripts Blender)
const JOINTS = ['hipN', 'hipF', 'kneeN', 'kneeF', 'shN', 'shF', 'elN', 'elF', 'torso', 'head'];
function pose(holder, p, bob = 0) {
  const J = holder.userData.J;
  for (const k of JOINTS) if (J[k]) J[k].rotation.z = (p[k] || 0) * D2R;
  if (J.pelvis) { if (J.pelvis.userData.y0 == null) J.pelvis.userData.y0 = J.pelvis.position.y; J.pelvis.position.y = J.pelvis.userData.y0 + bob; }
}
function tint(holder, hex, amt) {
  holder.traverse(m => { if (m.isMesh) { m.material.emissive.setHex(hex); m.material.emissiveIntensity = amt; } });
}

// ------------------------------------------------------------ audio (chiptune original)
const Audio = (() => {
  let ac = null, master = null, muted = false, on = false, nt = 0, step = 0, song = 'dungeon';
  const f = n => 440 * Math.pow(2, (n - 69) / 12);
  const DUN = [57, 0, 60, 64, 62, 0, 60, 59, 57, 0, 55, 57, 59, 0, 0, 0, 57, 0, 60, 64, 67, 65, 64, 62, 64, 0, 0, 0, 0, 0, 0, 0];
  const BOSS = [45, 45, 57, 45, 48, 45, 59, 45, 45, 45, 57, 45, 52, 50, 48, 47];
  function unlock() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    try { ac = new AudioContext(); master = ac.createGain(); master.gain.value = 0.45; master.connect(ac.destination); } catch (e) { ac = null; }
  }
  function tone(fr, t, d, type, v, slide) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(fr, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, fr * slide), t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + d);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.02);
  }
  let nb = null;
  function noise(t, d, v, hp) {
    if (!nb) { nb = ac.createBuffer(1, ac.sampleRate / 2, ac.sampleRate); const a = nb.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; }
    const s = ac.createBufferSource(), g = ac.createGain(), fl = ac.createBiquadFilter();
    s.buffer = nb; fl.type = 'highpass'; fl.frequency.value = hp;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + d);
    s.connect(fl); fl.connect(g); g.connect(master); s.start(t); s.stop(t + d);
  }
  setInterval(() => {
    if (!ac || !on) return;
    const e = song === 'boss' ? 0.14 : 0.26;
    while (nt < ac.currentTime + 0.2) {
      if (song === 'boss') {
        const n = BOSS[step % BOSS.length]; tone(f(n), nt, e * 0.9, 'square', 0.05);
        tone(f(n - 12), nt, e * 0.9, 'triangle', 0.14); if (step % 2 === 0) noise(nt, 0.05, 0.06, 4000);
      } else {
        const n = DUN[step % DUN.length]; if (n) { tone(f(n), nt, e * 1.6, 'triangle', 0.09); tone(f(n + 12), nt + 0.02, e, 'sine', 0.03); }
        if (step % 8 === 0) tone(f(33 + (step / 8 % 2 ? 5 : 0)), nt, e * 7, 'triangle', 0.12);
      }
      nt += e; step++;
    }
  }, 50);
  const S = {
    swing() { noise(ac.currentTime, 0.12, 0.12, 2500); },
    hit() { const t = ac.currentTime; noise(t, 0.08, 0.3, 500); tone(160, t, 0.12, 'square', 0.12, 0.4); },
    ting() { const t = ac.currentTime; tone(1800, t, 0.25, 'square', 0.06); tone(2400, t, 0.2, 'sine', 0.05); },
    hurt() { tone(500, ac.currentTime, 0.25, 'square', 0.12, 0.3); },
    roll() { noise(ac.currentTime, 0.2, 0.08, 800); },
    pot() { const t = ac.currentTime; noise(t, 0.25, 0.3, 300); tone(300, t, 0.1, 'square', 0.06, 0.5); },
    pickup() { const t = ac.currentTime; [72, 76, 79, 84].forEach((n, i) => tone(f(n), t + i * 0.06, 0.12, 'square', 0.07)); },
    item() { const t = ac.currentTime; [67, 71, 74, 79, 83, 86].forEach((n, i) => tone(f(n), t + i * 0.11, 0.3, 'square', 0.07)); },
    door() { const t = ac.currentTime; noise(t, 0.8, 0.15, 120); tone(70, t, 0.8, 'sawtooth', 0.08, 0.6); },
    bell(i) { const t = ac.currentTime; const n = [72, 76, 79][i]; tone(f(n), t, 1.2, 'sine', 0.2); tone(f(n + 12), t, 0.6, 'triangle', 0.06); },
    wrong() { tone(110, ac.currentTime, 0.4, 'sawtooth', 0.12); },
    solve() { const t = ac.currentTime; [72, 76, 79, 84, 79, 84, 88].forEach((n, i) => tone(f(n), t + i * 0.1, 0.25, 'square', 0.07)); },
    crow() { const t = ac.currentTime; tone(700, t, 0.15, 'sawtooth', 0.1, 1.5); tone(900, t + 0.15, 0.5, 'sawtooth', 0.1, 0.6); },
    thud() { const t = ac.currentTime; noise(t, 0.4, 0.4, 80); tone(60, t, 0.4, 'square', 0.15, 0.5); },
    text() { tone(1100, ac.currentTime, 0.02, 'square', 0.025); },
    die() { const t = ac.currentTime; [64, 60, 57, 52].forEach((n, i) => tone(f(n), t + i * 0.15, 0.2, 'square', 0.08)); }
  };
  return {
    unlock, play(n, a) { if (ac && !muted && S[n]) S[n](a); },
    music(o, s) { if (!ac) return; if (s && s !== song) { song = s; step = 0; } if (o && !on) nt = ac.currentTime + 0.05; on = o; },
    mute() { muted = !muted; if (master) master.gain.value = muted ? 0 : 0.45; }
  };
})();

// ------------------------------------------------------------ entrées
const keys = {}, pressed = {};
const MAP = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
  KeyJ: 'atk', Space: 'roll', KeyK: 'roll', ShiftLeft: 'lock', ShiftRight: 'lock', KeyL: 'lock', KeyE: 'use', Enter: 'ok', KeyM: 'mute' };
addEventListener('keydown', e => { const k = MAP[e.code]; if (!k) return; e.preventDefault(); if (!keys[k]) pressed[k] = true; keys[k] = true; Audio.unlock(); });
addEventListener('keyup', e => { const k = MAP[e.code]; if (k) keys[k] = false; });
canvas.addEventListener('contextmenu', e => e.preventDefault());
stage.addEventListener('mousedown', e => { Audio.unlock(); if (e.button === 0) pressed.atk = true; if (e.button === 2) { pressed.lock = true; keys.lock = true; } });
addEventListener('mouseup', e => { if (e.button === 2) keys.lock = false; });
let padPrev = {};
function pollPad() {
  const p = [...(navigator.getGamepads ? navigator.getGamepads() : [])].find(x => x); if (!p) return;
  const b = i => p.buttons[i] && p.buttons[i].pressed;
  const st = { left: p.axes[0] < -0.4, right: p.axes[0] > 0.4, up: p.axes[1] < -0.4, down: p.axes[1] > 0.4,
    atk: b(2), roll: b(0), lock: b(6) || b(4), use: b(3), ok: b(9) || b(1) };
  for (const k in st) { if (st[k] && !padPrev[k]) pressed[k] = true; if (st[k] || padPrev[k]) keys[k] = st[k]; }
  padPrev = st;
}

// ------------------------------------------------------------ niveau
const walls = [];   // AABB {x0,x1,z0,z1}
const pillars = []; // cercles {x,z,r}
const WALL_H = 9;
const matCache = {};
function boxMesh(w, h, d, mat) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); scene.add(m); return m; }
function addWall(x0, x1, z0, z1, visual = true) {
  walls.push({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1) });
  if (!visual) return;
  const w = Math.abs(x1 - x0), d = Math.abs(z1 - z0);
  const m = boxMesh(w, WALL_H, d, new THREE.MeshLambertMaterial({ map: wallTex(Math.max(w, d) / 3, WALL_H / 3) }));
  m.position.set((x0 + x1) / 2, WALL_H / 2, (z0 + z1) / 2);
}
function addPillar(x, z) {
  pillars.push({ x, z, r: 0.75 });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, WALL_H, 8), new THREE.MeshLambertMaterial({ map: wallTex(2, 3), flatShading: true }));
  m.position.set(x, WALL_H / 2, z); scene.add(m);
  const base = boxMesh(1.9, 0.6, 1.9, new THREE.MeshLambertMaterial({ color: 0x9d6a6a })); base.position.set(x, 0.3, z);
  const cap = boxMesh(1.7, 0.5, 1.7, new THREE.MeshLambertMaterial({ color: 0xd8a0a0 })); cap.position.set(x, WALL_H - 0.6, z);
}
function addFloor(x0, x1, z0, z1) {
  const w = x1 - x0, d = z0 - z1;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshLambertMaterial({ map: floorTex(w / 4, d / 4) }));
  m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2); scene.add(m);
}
function addWindow(x, z, faceX) {  // vitrail lancette
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 4.2), new THREE.MeshBasicMaterial({ map: glassTex(), fog: false }));
  m.position.set(x, 4.6, z); m.rotation.y = faceX > 0 ? Math.PI / 2 : -Math.PI / 2; scene.add(m);
  const top = new THREE.Mesh(new THREE.CircleGeometry(0.8, 3, Math.PI / 6, Math.PI * 2), new THREE.MeshBasicMaterial({ color: 0xff2e88, fog: false }));
  top.position.set(x, 6.9, z); top.rotation.y = m.rotation.y; scene.add(top);
}
function addRose(x, y, z) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(2.6, 24), new THREE.MeshBasicMaterial({ map: roseTex(), fog: false }));
  m.position.set(x, y, z); scene.add(m);
  const l = new THREE.PointLight(0xff6ab0, 18, 22, 1.6); l.position.set(x, y - 1, z - 3); scene.add(l);
}
function addPew(x, z) {
  const mat = new THREE.MeshLambertMaterial({ color: 0x6b3f22 });
  const seat = boxMesh(3.6, 0.25, 0.8, mat); seat.position.set(x, 0.75, z);
  const back = boxMesh(3.6, 1.0, 0.18, mat); back.position.set(x, 1.3, z + 0.4);
  walls.push({ x0: x - 1.8, x1: x + 1.8, z0: z - 0.4, z1: z + 0.5 });
}
function placeModel(name, x, z, rotY = 0, s = 1) {
  const h = instance(name); h.position.set(x, 0, z); h.rotation.y = rotY; h.scale.setScalar(s); scene.add(h); return h;
}

// Salle 1 : la nef (z 0 -> -26) ; Salle 2 : l'horloge (z -26 -> -46) ; Salle 3 : le chœur (z -46 -> -72)
const R = [
  { name: 'LA NEF', x0: -10, x1: 10, z0: 0, z1: -26 },
  { name: "L'HORLOGE ASTRONOMIQUE", x0: -9, x1: 9, z0: -26, z1: -46 },
  { name: 'LE CHŒUR', x0: -12, x1: 12, z0: -46, z1: -72 }
];
const T = 1; // épaisseur des murs
for (const r of R) addFloor(r.x0, r.x1, r.z0, r.z1);
// murs extérieurs
addWall(-10 - T, 10 + T, 0, T);                            // fond (entrée)
addWall(-10 - T, -10, 0, -26); addWall(10, 10 + T, 0, -26); // nef
addWall(-10, -1.8, -26, -26 - T); addWall(1.8, 10, -26, -26 - T);
addWall(-9 - T, -9, -26, -46); addWall(9, 9 + T, -26, -46);
addWall(-12, -1.8, -46, -46 - T); addWall(1.8, 12, -46, -46 - T);
addWall(-12 - T, -12, -46, -72); addWall(12, 12 + T, -46, -72);
addWall(-12 - T, 12 + T, -72, -72 - T);
for (const z of [-4, -11, -18]) { addPillar(-5.5, z); addPillar(5.5, z); }
for (const z of [-50, -64]) { addPillar(-8, z); addPillar(8, z); }
for (const z of [-5, -12, -19]) { addWindow(-9.95, z - 2.5, 1); addWindow(9.95, z - 2.5, -1); }
for (const z of [-52, -60, -68]) { addWindow(-11.95, z, 1); addWindow(11.95, z, -1); }
addRose(0, 6.5, -71.9);
const roseBack = addRose(0, 6.5, 0.05); // rosace de l'entrée (vue en se retournant)
for (const z of [-7, -14]) { addPew(-2.8 - 4.5, z); addPew(2.8 + 4.5, z); }

// ------------------------------------------------------------ portes
function makeDoor(z) {
  const d = placeModel('door', 0, z - 0.5);
  const aabb = { x0: -1.8, x1: 1.8, z0: z - T, z1: z };
  walls.push(aabb);
  return { mesh: d, aabb, open: false, t: 0 };
}
const door1 = makeDoor(-26);
const door2 = makeDoor(-46);
function setDoor(d, open) {
  if (d.open === open) return;
  d.open = open; Audio.play('door');
  const i = walls.indexOf(d.aabb);
  if (open && i >= 0) walls.splice(i, 1);
  if (!open && i < 0) walls.push(d.aabb);
}

// ------------------------------------------------------------ objets du donjon
const clock = placeModel('clock', -8.1, -36, Math.PI / 2, 1);
const lampNames = ['lampR', 'lampG', 'lampB'];
const lampColors = [0xff3040, 0x40ff60, 0x4080ff];
const BELL_COL = ['#e0303a', '#3ad65a', '#3a6be0'];
const bells = [-3, 0, 3].map((x, i) => {
  const b = placeModel('bell', x, -38);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.12, 4, 12), new THREE.MeshBasicMaterial({ color: BELL_COL[i] }));
  ring.rotation.x = Math.PI / 2; ring.position.set(x, 0.65, -38); scene.add(ring);
  pillars.push({ x, z: -38, r: 0.55 });
  return { mesh: b, x, z: -38, i, swing: 0 };
});

const pots = [];
for (const [x, z] of [[-8.5, -2], [8.5, -2], [-8.5, -24], [8.5, -24], [-7.5, -44], [7.5, -44], [-10.5, -48], [10.5, -48]]) {
  const p = { mesh: placeModel('pot', x, z), x, z, alive: true };
  pots.push(p); pillars.push({ x, z, r: 0.45, pot: p });
}
const chest = placeModel('chest', 0, -21, -Math.PI / 2, 1.2);
chest.visible = false;
const chestState = { shown: false, opened: false, t: 0 };

// ------------------------------------------------------------ particules / effets
const parts = [];
const partGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
function burst(p, n, color, spd = 6) {
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(partGeo, new THREE.MeshBasicMaterial({ color }));
    m.position.copy(p); scene.add(m);
    parts.push({ m, v: new THREE.Vector3(rnd(-1, 1) * spd, rnd(2, 1.5 * spd), rnd(-1, 1) * spd), life: rnd(0.4, 0.8) });
  }
}
const pickups = [];
function dropBretzel(x, z) {
  const m = placeModel('bretzel', x, z, 0, 0.7); m.position.y = 0.5;
  pickups.push({ m, x, z, t: 0 });
}
// réticule de verrouillage
const reticle = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.6, 3), new THREE.MeshBasicMaterial({ color: 0xffd23f, fog: false }));
reticle.rotation.x = Math.PI; reticle.visible = false; scene.add(reticle);
// étoiles d'étourdissement
const stars = new THREE.Group();
for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.25), new THREE.MeshBasicMaterial({ color: 0xffd23f, fog: false })); s.position.set(Math.cos(i * 1.57) * 1.2, 0, Math.sin(i * 1.57) * 1.2); stars.add(s); }
stars.visible = false; scene.add(stars);

// ------------------------------------------------------------ joueur
const P = {
  obj: placeModel('hero', 0, -6, Math.PI / 2, 1),
  x: 0, z: -6, face: Math.PI / 2, vx: 0, vz: 0, hp: 6, maxhp: 6, keys: 0,
  state: 'idle', t: 0, inv: 0, walkT: 0, target: null, hitSet: null, checkpoint: { x: 0, z: -6 }
};
// le bâton-bretzel : orienté vers l'avant quand le bras est tendu
if (P.obj.userData.J.weapon) P.obj.userData.J.weapon.rotation.set(0, 0, -Math.PI / 2);

// ------------------------------------------------------------ ennemis
const enemies = [];
function spawnLutin(x, z) {
  const e = { kind: 'lutin', obj: placeModel('lutin', x, z, 0, 1.25), x, z, face: 0, hp: 3, state: 'idle', t: rnd(0, 0.5), r: 0.6, walkT: 0, kb: new THREE.Vector2(), flash: 0 };
  enemies.push(e); burst(new THREE.Vector3(x, 1, z), 10, 0xb6ff3a, 4); return e;
}
let boss = null;
function spawnBoss() {
  boss = { kind: 'coq', obj: placeModel('coq', 0, -66, Math.PI / 2, 1.15), x: 0, z: -66, face: Math.PI / 2, hp: 8, maxhp: 8,
    state: 'intro', t: 0, r: 2.0, walkT: 0, kb: new THREE.Vector2(), flash: 0, cd: 2, summoned: false, dir: new THREE.Vector2() };
  enemies.push(boss);
  document.getElementById('boss').style.display = 'block';
}

// ------------------------------------------------------------ collisions
function collide(o, r) {
  for (const w of walls) {
    const cx = clamp(o.x, w.x0, w.x1), cz = clamp(o.z, w.z0, w.z1);
    const dx = o.x - cx, dz = o.z - cz, d2 = dx * dx + dz * dz;
    if (d2 < r * r) {
      if (d2 > 1e-6) { const d = Math.sqrt(d2), p = (r - d) / d; o.x += dx * p; o.z += dz * p; }
      else { // centre dans la boîte : sortir par le côté le plus proche
        const opts = [[w.x0 - r - o.x, 0], [w.x1 + r - o.x, 0], [0, w.z0 - r - o.z], [0, w.z1 + r - o.z]];
        opts.sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1])); o.x += opts[0][0]; o.z += opts[0][1];
      }
      o.hitWall = true;
    }
  }
  for (const p of pillars) {
    const dx = o.x - p.x, dz = o.z - p.z, d = Math.hypot(dx, dz), m = r + p.r;
    if (d < m && d > 1e-4) { o.x += dx / d * (m - d); o.z += dz / d * (m - d); o.hitWall = true; }
  }
}
const roomOf = z => z > -26 ? 0 : (z > -46 ? 1 : 2);

// ------------------------------------------------------------ dialogues
const dlg = { queue: [], cur: null, t: 0, el: document.getElementById('dialog') };
function say(who, txt) { dlg.queue.push({ who, txt }); }
function updateDialog(dt) {
  if (!dlg.cur && dlg.queue.length) { dlg.cur = dlg.queue.shift(); dlg.t = 0; dlg.el.style.display = 'block'; dlg.el.querySelector('.who').textContent = dlg.cur.who; }
  if (!dlg.cur) return false;
  const prev = Math.floor(dlg.t * 50);
  dlg.t += dt;
  const n = Math.floor(dlg.t * 50);
  if (n !== prev && n < dlg.cur.txt.length && n % 3 === 0) Audio.play('text');
  dlg.el.querySelector('.txt').textContent = dlg.cur.txt.slice(0, n);
  dlg.el.querySelector('.next').style.display = n >= dlg.cur.txt.length ? 'block' : 'none';
  if (pressed.ok || pressed.atk || pressed.use) {
    if (n < dlg.cur.txt.length) dlg.t = 99;
    else { dlg.cur = null; if (!dlg.queue.length) dlg.el.style.display = 'none'; }
  }
  return true;
}
function banner(title, sub, dur = 2.5) {
  const b = document.getElementById('banner');
  b.innerHTML = title + (sub ? '<small>' + sub + '</small>' : ''); b.style.display = 'block';
  clearTimeout(banner.t); banner.t = setTimeout(() => b.style.display = 'none', dur * 1000);
}
function flash(a = 0.6) { const f = document.getElementById('flash'); f.style.transition = 'none'; f.style.opacity = a; requestAnimationFrame(() => { f.style.transition = 'opacity .35s'; f.style.opacity = 0; }); }

// ------------------------------------------------------------ état du jeu
const G = { mode: 'title', room: -1, cleared1: false, puzzle: { seq: [], input: [], solved: false, showT: 0 }, bossStarted: false, shake: 0, hitstop: 0, endT: 0 };
let camYaw = 0;
const camPos = new THREE.Vector3(0, 5, 5);
const camLook = new THREE.Vector3();

function newPuzzle() {
  const s = [0, 1, 2].sort(() => Math.random() - 0.5);
  G.puzzle.seq = [s[0], s[1], s[2], Math.floor(Math.random() * 3)];
  G.puzzle.input = []; G.puzzle.showT = 0;
}

function enterRoom(i) {
  G.room = i;
  document.getElementById('room').textContent = R[i].name;
  P.checkpoint = { x: 0, z: R[i].z0 - (i === 0 ? 6 : 2.5) };
  if (i === 0 && !G.r0) {
    G.r0 = true;
    spawnLutin(-4, -12); spawnLutin(4, -15); spawnLutin(0, -20);
    say('MARCEL BRETZEL', "La cathédrale, en 2026... Et déjà des lutins en justaucorps fluo partout. Le maire de 2077 a dû en renvoyer dans le temps.");
    say('MARCEL BRETZEL', "Bon. Mon bâton-bretzel et moi, on va faire le ménage. Hopla !");
  }
  if (i === 1 && !G.r1) {
    G.r1 = true; newPuzzle();
    spawnLutin(-4, -31); spawnLutin(5, -42);
    say("L'HORLOGE ASTRONOMIQUE", "*DING* Les automates s'agitent... Les lampes de l'horloge jouent une séquence de couleurs.");
    say('MARCEL BRETZEL', "Je parie qu'il faut sonner les cloches dans le même ordre. Classique. Même en 2077 on fait encore ce genre d'énigme.");
  }
  if (i === 2 && !G.bossStarted) {
    G.bossStarted = true;
    setDoor(door2, false);
    spawnBoss();
    Audio.music(true, 'boss');
    banner('LE COQ DE L\'HORLOGE', 'automate réglé à l\'heure de 2077', 3);
    say('LE COQ DE L\'HORLOGE', "COCORICO-RITHME ! Le maire de 2077 m'a reprogrammé : à minuit, le marché de Noël devient ÉTERNEL !");
    say('MARCEL BRETZEL', "Un coq mécanique géant. Évidemment. Il charge comme un taureau : il faudrait qu'il se cogne dans un pilier ou un mur...");
  }
}

// ------------------------------------------------------------ mise à jour joueur
function inputDir() {
  const ix = (keys.right ? 1 : 0) - (keys.left ? 1 : 0), iy = (keys.up ? 1 : 0) - (keys.down ? 1 : 0);
  if (!ix && !iy) return null;
  const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw), rx = Math.cos(camYaw), rz = -Math.sin(camYaw);
  let dx = fx * iy + rx * ix, dz = fz * iy + rz * ix;
  const l = Math.hypot(dx, dz); return { x: dx / l, z: dz / l };
}
const faceOf = (dx, dz) => Math.atan2(-dz, dx);

function hurtPlayer(dmg, fromX, fromZ) {
  if (P.inv > 0 || P.state === 'dead') return;
  P.hp -= dmg; P.inv = 1.0; Audio.play('hurt'); G.shake = 0.35; flash(0.35);
  const dx = P.x - fromX, dz = P.z - fromZ, l = Math.hypot(dx, dz) || 1;
  P.vx = dx / l * 12; P.vz = dz / l * 12;
  P.state = 'hurt'; P.t = 0;
  if (P.hp <= 0) { P.state = 'dead'; P.t = 0; Audio.play('die'); }
}

function updatePlayer(dt) {
  P.t += dt; P.inv = Math.max(0, P.inv - dt);
  // verrouillage
  if (pressed.lock) {
    if (P.target) P.target = null;
    else {
      let best = null, bd = 16;
      for (const e of enemies) { if (e.hp <= 0) continue; const d = Math.hypot(e.x - P.x, e.z - P.z); if (d < bd) { bd = d; best = e; } }
      P.target = best;
      if (!best) camYaw = Math.atan2(-Math.cos(P.face), Math.sin(P.face)); // recentre la caméra derrière Marcel
    }
  }
  if (P.target && (P.target.hp <= 0 || Math.hypot(P.target.x - P.x, P.target.z - P.z) > 22)) P.target = null;
  const dir = inputDir();
  switch (P.state) {
    case 'idle': case 'run': {
      if (pressed.atk) { P.state = 'atk'; P.t = 0; P.hitSet = new Set(); Audio.play('swing'); break; }
      if (pressed.roll) { P.state = 'roll'; P.t = 0; P.inv = Math.max(P.inv, 0.4); Audio.play('roll');
        const d = dir || { x: Math.cos(P.face), z: -Math.sin(P.face) }; P.rdx = d.x; P.rdz = d.z; P.face = faceOf(d.x, d.z); break; }
      if (dir) {
        const sp = P.target ? 6 : 8;
        P.x += dir.x * sp * dt; P.z += dir.z * sp * dt;
        if (!P.target) P.face += angDiff(P.face, faceOf(dir.x, dir.z)) * Math.min(1, dt * 14);
        P.state = 'run'; P.walkT += dt * (P.target ? 9 : 11);
      } else P.state = 'idle';
      if (P.target) P.face = faceOf(P.target.x - P.x, P.target.z - P.z);
      break;
    }
    case 'atk': {
      if (P.target) P.face = faceOf(P.target.x - P.x, P.target.z - P.z);
      if (P.t > 0.08 && P.t < 0.22) playerHits();
      if (P.t > 0.34) P.state = 'idle';
      break;
    }
    case 'roll':
      P.x += P.rdx * 15 * dt; P.z += P.rdz * 15 * dt;
      if (P.t > 0.38) P.state = 'idle';
      break;
    case 'hurt':
      if (P.t > 0.3) P.state = 'idle';
      break;
    case 'dead':
      if (P.t > 1.6) respawn();
      break;
  }
  P.x += P.vx * dt; P.z += P.vz * dt; P.vx *= Math.pow(0.002, dt); P.vz *= Math.pow(0.002, dt);
  P.hitWall = false; collide(P, 0.6);
  // objets
  for (const p of pickups) if (!p.taken && Math.hypot(p.x - P.x, p.z - P.z) < 1.3) {
    p.taken = true; scene.remove(p.m); P.hp = Math.min(P.maxhp, P.hp + 2); Audio.play('pickup');
  }
  // coffre
  if (chestState.shown && !chestState.opened && Math.hypot(P.x - chest.position.x, P.z - chest.position.z) < 2.6 && (pressed.use || pressed.atk)) openChest();
  // porte verrouillée
  if (!door1.open && Math.abs(P.z - -25.4) < 1.2 && Math.abs(P.x) < 2.2) {
    if (P.keys > 0) { P.keys--; setDoor(door1, true); banner('CLIC !', 'la porte de l\'horloge s\'ouvre'); }
    else if (!G.lockedMsg) { G.lockedMsg = true; say('MARCEL BRETZEL', "Fermée à clé. Il doit y avoir une clé quelque part... peut-être chez ces lutins."); }
  }
  // changement de salle
  const r = roomOf(P.z); if (r !== G.room) enterRoom(r);
  // pose / anim
  const o = P.obj; o.position.set(P.x, 0, P.z); o.rotation.y = P.face;
  const GUARD = { shN: 30, elN: 80, shF: 40, elF: 70, torso: 4 };
  if (P.state === 'run') {
    const s = Math.sin(P.walkT);
    pose(o, { hipN: s * 35, hipF: -s * 35, kneeN: -Math.max(0, -s) * 60 - 8, kneeF: -Math.max(0, s) * 60 - 8, shN: 30 - s * 25, shF: 40 + s * 25, elN: 80, elF: 70, torso: 10 }, Math.abs(Math.cos(P.walkT)) * 0.08);
  } else if (P.state === 'atk') {
    const k = clamp(P.t / 0.2, 0, 1);
    pose(o, { shN: lerp(170, 30, k * k), elN: lerp(40, 0, k), shF: 30, elF: 70, torso: lerp(-10, 20, k), hipN: 25, hipF: -20, kneeF: -10 });
  } else if (P.state === 'roll') {
    pose(o, { hipN: 110, kneeN: -130, hipF: 100, kneeF: -130, shN: 90, elN: 90, shF: 90, elF: 90, torso: 50, head: 30 }, -0.5);
    o.userData.model.rotation.z = -P.t / 0.38 * Math.PI * 2;
  } else if (P.state === 'hurt') {
    pose(o, { torso: -25, head: -20, shN: -30, shF: -20, elN: 30, elF: 30, hipN: 10, kneeN: -15 });
  } else if (P.state === 'dead') {
    pose(o, { torso: -40, head: -30, shN: 150, shF: 140, hipN: 20, kneeN: -40 }, -Math.min(1, P.t * 2) * 0.6);
  } else pose(o, GUARD, Math.sin(G.time * 3) * 0.03);
  if (P.state !== 'roll') o.userData.model.rotation.z = 0;
  o.visible = !(P.inv > 0 && P.state !== 'roll' && Math.floor(G.time * 20) % 2);
}

function playerHits() {
  const fx = Math.cos(P.face), fz = -Math.sin(P.face);
  const tip = new THREE.Vector3(P.x + fx * 1.8, 1.2, P.z + fz * 1.8);
  for (const e of enemies) {
    if (e.hp <= 0 || P.hitSet.has(e)) continue;
    const dx = e.x - P.x, dz = e.z - P.z, d = Math.hypot(dx, dz);
    if (d > 2.6 + e.r) continue;
    if ((dx * fx + dz * fz) / (d || 1) < 0.25) continue;
    P.hitSet.add(e);
    hitEnemy(e, dx / (d || 1), dz / (d || 1));
  }
  for (const p of pots) if (p.alive && !P.hitSet.has(p) && Math.hypot(p.x - tip.x, p.z - tip.z) < 1.4) {
    P.hitSet.add(p); p.alive = false; scene.remove(p.mesh); Audio.play('pot');
    burst(new THREE.Vector3(p.x, 0.8, p.z), 14, 0xf2e6a0, 5); burst(new THREE.Vector3(p.x, 0.8, p.z), 6, 0xc86a3a, 4);
    if (Math.random() < 0.6) dropBretzel(p.x, p.z);
    const i = pillars.findIndex(q => q.pot === p); if (i >= 0) pillars.splice(i, 1);
  }
  for (const b of bells) if (!P.hitSet.has(b) && Math.hypot(b.x - tip.x, b.z - tip.z) < 1.6) { P.hitSet.add(b); ringBell(b); }
  if (chestState.shown && !chestState.opened && Math.hypot(chest.position.x - tip.x, chest.position.z - tip.z) < 1.8) openChest();
}

function hitEnemy(e, nx, nz) {
  if (e.kind === 'coq' && e.state !== 'stunned') {
    Audio.play('ting'); burst(new THREE.Vector3(e.x - nx * 1.5, 2, e.z - nz * 1.5), 6, 0xffffff, 5);
    P.vx = -nx * 10; P.vz = -nz * 10; G.hitstop = 0.05;
    if (!G.tingMsg) { G.tingMsg = true; say('MARCEL BRETZEL', "TING ! Son plumage en laiton est trop solide. Il faut l'étourdir d'abord !"); }
    return;
  }
  e.hp--; e.flash = 0.15; Audio.play('hit'); G.hitstop = 0.06; G.shake = 0.15;
  burst(new THREE.Vector3(e.x, 1.3, e.z), 8, 0xffd23f, 5);
  if (e.kind === 'lutin') { e.kb.set(nx * 14, nz * 14); e.state = 'hurt'; e.t = 0; }
  if (e.hp <= 0) killEnemy(e);
}
function killEnemy(e) {
  e.state = 'die'; e.t = 0;
  if (P.target === e) P.target = null;
  if (e.kind === 'lutin') { Audio.play('pot'); if (Math.random() < 0.35) dropBretzel(e.x, e.z); }
  if (e.kind === 'coq') bossDefeated();
}

// ------------------------------------------------------------ IA
function updateEnemies(dt) {
  for (const e of enemies) {
    e.t += dt; e.flash = Math.max(0, e.flash - dt);
    if (e.kind === 'lutin') updateLutin(e, dt); else updateBoss(e, dt);
    tint(e.obj, e.flash > 0 ? 0xffffff : (e.windup ? 0xff2020 : 0x000000), e.flash > 0 ? 0.9 : (e.windup ? 0.5 + 0.4 * Math.sin(G.time * 30) : 0));
  }
  for (let i = enemies.length - 1; i >= 0; i--) if (enemies[i].gone) { scene.remove(enemies[i].obj); enemies.splice(i, 1); }
}
function updateLutin(e, dt) {
  const dx = P.x - e.x, dz = P.z - e.z, d = Math.hypot(dx, dz);
  e.windup = false;
  switch (e.state) {
    case 'idle': if (roomOf(e.z) === G.room && e.t > 0.6) { e.state = 'chase'; e.t = 0; } break;
    case 'chase': {
      const sp = 4.2;
      e.face = faceOf(dx, dz);
      if (d > 1.9) { e.x += dx / d * sp * dt; e.z += dz / d * sp * dt; e.walkT += dt * 12; }
      else if (e.t > 0.4) { e.state = 'windup'; e.t = 0; }
      // écarte les lutins entre eux
      for (const o of enemies) if (o !== e && o.kind === 'lutin') { const ox = e.x - o.x, oz = e.z - o.z, od = Math.hypot(ox, oz); if (od < 1.4 && od > 0.01) { e.x += ox / od * dt * 3; e.z += oz / od * dt * 3; } }
      break;
    }
    case 'windup':
      e.windup = true; e.face = faceOf(dx, dz);
      if (e.t > 0.5) { e.state = 'lunge'; e.t = 0; e.ldx = Math.cos(e.face); e.ldz = -Math.sin(e.face); e.hitDone = false; }
      break;
    case 'lunge':
      e.x += e.ldx * 11 * dt; e.z += e.ldz * 11 * dt;
      if (!e.hitDone && d < 1.4) { e.hitDone = true; hurtPlayer(1, e.x, e.z); }
      if (e.t > 0.22) { e.state = 'recover'; e.t = 0; }
      break;
    case 'recover': if (e.t > 0.7) { e.state = 'chase'; e.t = 0; } break;
    case 'hurt':
      e.x += e.kb.x * dt; e.z += e.kb.y * dt; e.kb.multiplyScalar(Math.pow(0.001, dt));
      if (e.t > 0.35) { e.state = 'chase'; e.t = 0; }
      break;
    case 'die':
      e.obj.rotation.y += dt * 20; e.obj.scale.setScalar(Math.max(0.01, 1.25 * (1 - e.t / 0.4)));
      if (e.t > 0.4) { e.gone = true; burst(new THREE.Vector3(e.x, 0.8, e.z), 14, 0xff2e88, 5); }
      break;
  }
  if (e.state !== 'die') {
    collide(e, e.r);
    e.obj.position.set(e.x, 0, e.z); e.obj.rotation.y = e.face;
    const s = Math.sin(e.walkT);
    if (e.state === 'chase') pose(e.obj, { hipN: s * 40, hipF: -s * 40, kneeN: -20, kneeF: -20, shN: -s * 40, shF: s * 40 }, Math.abs(Math.cos(e.walkT)) * 0.1);
    else if (e.state === 'windup') pose(e.obj, { shN: 160, shF: 150, torso: -15, hipN: -10, kneeN: -30 });
    else if (e.state === 'lunge') pose(e.obj, { shN: 90, shF: 80, torso: 35, hipN: 40, hipF: -40 });
    else if (e.state === 'hurt') pose(e.obj, { torso: -30, head: -20, shN: -40, shF: -40 });
    else pose(e.obj, { shN: 20 + Math.sin(G.time * 6) * 20, shF: 20 - Math.sin(G.time * 6) * 20 }, Math.abs(Math.sin(G.time * 6)) * 0.08); // aérobic sur place
  }
}

const R3 = R[2];
function updateBoss(e, dt) {
  const dx = P.x - e.x, dz = P.z - e.z, d = Math.hypot(dx, dz);
  e.windup = false;
  const rage = e.hp <= 4 ? 1.35 : 1;
  stars.visible = e.state === 'stunned';
  switch (e.state) {
    case 'intro': if (!dlg.cur && !dlg.queue.length) { e.state = 'walk'; e.t = 0; } break;
    case 'walk':
      e.face += angDiff(e.face, faceOf(dx, dz)) * Math.min(1, dt * 3);
      if (d > 3) { e.x += Math.cos(e.face) * 3.2 * rage * dt; e.z -= Math.sin(e.face) * 3.2 * rage * dt; e.walkT += dt * 6; }
      e.cd -= dt;
      if (d < 4 && e.cd < 1) { e.state = 'peckW'; e.t = 0; }
      else if (e.cd <= 0) { e.state = 'crow'; e.t = 0; Audio.play('crow'); }
      if (e.hp <= 4 && !e.summoned) { e.summoned = true; spawnLutin(-8, -56); spawnLutin(8, -56); say('LE COQ DE L\'HORLOGE', "LUTINS ! ÉCHAUFFEMENT, ET ON ENCERCLE !"); }
      break;
    case 'crow': // annonce la charge : regarde le joueur, ailes déployées
      e.windup = true;
      e.face += angDiff(e.face, faceOf(dx, dz)) * Math.min(1, dt * 6);
      if (e.t > 0.9 / rage) { e.state = 'charge'; e.t = 0; e.dir.set(Math.cos(e.face), -Math.sin(e.face)); }
      break;
    case 'charge': {
      const sp = 17 * rage;
      e.x += e.dir.x * sp * dt; e.z += e.dir.y * sp * dt; e.walkT += dt * 20;
      if (d < e.r + 0.6) hurtPlayer(2, e.x, e.z);
      e.hitWall = false; collide(e, e.r);
      const outX = e.x < R3.x0 + e.r + 0.05 || e.x > R3.x1 - e.r - 0.05, outZ = e.z > R3.z0 - e.r - 0.05 || e.z < R3.z1 + e.r + 0.05;
      if (e.hitWall || outX || outZ) { e.state = 'stunned'; e.t = 0; G.shake = 0.6; Audio.play('thud'); burst(new THREE.Vector3(e.x + e.dir.x * 2, 1, e.z + e.dir.y * 2), 16, 0xd98c8c, 7); }
      else if (e.t > 2.2) { e.state = 'walk'; e.t = 0; e.cd = 2; }
      break;
    }
    case 'stunned':
      if (e.t > 3.0) { e.state = 'walk'; e.t = 0; e.cd = rnd(1.5, 2.5) / rage; }
      break;
    case 'peckW':
      e.windup = true; e.face += angDiff(e.face, faceOf(dx, dz)) * Math.min(1, dt * 5);
      if (e.t > 0.55 / rage) { e.state = 'peck'; e.t = 0; e.hitDone = false; }
      break;
    case 'peck':
      if (!e.hitDone && e.t > 0.08) { e.hitDone = true; const fx = Math.cos(e.face), fz = -Math.sin(e.face); const hx = e.x + fx * 3.2, hz = e.z + fz * 3.2;
        if (Math.hypot(P.x - hx, P.z - hz) < 1.8) hurtPlayer(1, e.x, e.z); G.shake = 0.2; burst(new THREE.Vector3(hx, 0.3, hz), 8, 0xd98c8c, 4); }
      if (e.t > 0.5) { e.state = 'walk'; e.t = 0; e.cd = Math.max(e.cd, 1.2); }
      break;
    case 'die':
      e.obj.rotation.z = Math.min(1, e.t) * -1.4;
      if (Math.random() < 0.3) burst(new THREE.Vector3(e.x + rnd(-2, 2), rnd(1, 3), e.z + rnd(-2, 2)), 4, 0xe8b33a, 6);
      if (e.t > 2) { e.gone = true; burst(new THREE.Vector3(e.x, 2, e.z), 40, 0xe8b33a, 9); }
      break;
  }
  if (e.state !== 'charge' && e.state !== 'die') collide(e, e.r);
  e.obj.position.set(e.x, 0, e.z); e.obj.rotation.y = e.face;
  const s = Math.sin(e.walkT);
  if (e.state === 'stunned') {
    pose(e.obj, { head: 70, torso: 25, shN: -20, shF: -20, hipN: 30, hipF: 30, kneeN: -50, kneeF: -50 }, -0.5);
    stars.position.set(e.x, 4.6, e.z); stars.rotation.y += dt * 4;
  } else if (e.state === 'crow') pose(e.obj, { head: -40, torso: -15, shN: 70 + Math.sin(G.time * 25) * 25, shF: 70 - Math.sin(G.time * 25) * 25 });
  else if (e.state === 'charge') pose(e.obj, { head: 45, torso: 20, hipN: s * 45, hipF: -s * 45, kneeN: -20, kneeF: -20, shN: -30, shF: -30 });
  else if (e.state === 'peckW') pose(e.obj, { head: -50, torso: -10 });
  else if (e.state === 'peck') pose(e.obj, { head: 85, torso: 30 });
  else if (e.state !== 'die') pose(e.obj, { hipN: s * 30, hipF: -s * 30, kneeN: -10, kneeF: -10, head: Math.sin(G.time * 4) * 15 }, Math.abs(Math.cos(e.walkT)) * 0.12);
  document.getElementById('bossfill').style.width = (Math.max(0, e.hp) / e.maxhp * 100) + '%';
}

function bossDefeated() {
  Audio.music(false); Audio.play('solve');
  stars.visible = false;
  setTimeout(() => {
    document.getElementById('boss').style.display = 'none';
    G.mode = 'end'; G.endT = 0;
    Audio.play('item');
    say('???', "Tu obtiens le RÉCEPTACLE DE BRETZEL ! Ton nombre de bretzels de vie maximum augmente.");
    say('LE MAIRE DE 2077 (hologramme)', "GRRR ! Mon coq ! Profite bien, Bretzel... Il me reste quatre donjons et un stock infini de vin chaud. HO HO HOPLA !");
    say('MARCEL BRETZEL', "Prochain arrêt : la Petite France. Fin du prototype, merci d'avoir joué !");
    P.maxhp = 8; P.hp = 8;
  }, 2000);
}

// ------------------------------------------------------------ cloches / énigme
function ringBell(b) {
  b.swing = 1; Audio.play('bell', b.i);
  const pz = G.puzzle;
  if (pz.solved || G.room !== 1) return;
  pz.input.push(b.i);
  const k = pz.input.length - 1;
  if (pz.input[k] !== pz.seq[k]) {
    Audio.play('wrong'); pz.input = []; pz.showT = -0.8;
    say('MARCEL BRETZEL', "Raté... Les automates ricanent. Un lutin arrive en renfort, évidemment.");
    if (enemies.filter(e => e.kind === 'lutin').length < 3) spawnLutin(0, -30);
  } else if (pz.input.length === pz.seq.length) {
    pz.solved = true; Audio.play('solve'); setDoor(door2, true);
    banner('ÉNIGME RÉSOLUE !', 'les portes du chœur s\'ouvrent');
  }
}
function updatePuzzle(dt) {
  const pz = G.puzzle; const J = clock.userData.J;
  for (const b of bells) { b.swing = Math.max(0, b.swing - dt * 1.5); const J2 = b.mesh.userData.J; if (J2.bell) J2.bell.rotation.x = Math.sin(b.swing * 18) * b.swing * 0.5; }
  if (J.hand) J.hand.rotation.z -= dt * 0.8;
  if (G.room !== 1 || pz.solved) { for (const n of lampNames) if (J[n]) J[n].material.emissive.setHex(pz.solved ? lampColors[lampNames.indexOf(n)] : 0); return; }
  pz.showT += dt;
  const STEP = 0.75, cycle = pz.seq.length * STEP + 2.2;
  const t = pz.showT % cycle, idx = Math.floor(t / STEP);
  lampNames.forEach((n, i) => {
    const on = pz.showT > 0 && idx < pz.seq.length && pz.seq[idx] === i && (t % STEP) < STEP * 0.75;
    if (J[n]) { J[n].material.emissive.setHex(on ? lampColors[i] : 0x000000); J[n].material.emissiveIntensity = on ? 1.2 : 0; }
  });
}

// ------------------------------------------------------------ coffre
function openChest() {
  chestState.opened = true; chestState.t = 0; Audio.play('item'); P.keys++;
  say('???', "Tu obtiens la CLÉ DU CHAPITRE ! Elle sent légèrement le munster.");
}
function updateChest(dt) {
  if (G.room === 0 && !chestState.shown && G.r0 && enemies.filter(e => e.kind === 'lutin' && e.hp > 0).length === 0) {
    chestState.shown = true; chest.visible = true; chest.scale.setScalar(0.01); Audio.play('solve');
    burst(new THREE.Vector3(0, 1, -21), 20, 0xffd23f, 6);
    banner('UN COFFRE APPARAÎT !');
  }
  if (chestState.shown && chest.scale.x < 1.2) chest.scale.setScalar(Math.min(1.2, chest.scale.x + dt * 3));
  if (chestState.opened) {
    chestState.t += dt;
    const J = chest.userData.J; if (J.lid) J.lid.rotation.z = Math.min(1.9, chestState.t * 4);
    if (!chestState.key) { chestState.key = placeModel('key', 0, -21, 0, 1.4); }
    const k = chestState.key; k.position.y = 1 + Math.min(1.5, chestState.t * 2); k.rotation.y += dt * 4;
    if (chestState.t > 2.5 && k.parent) scene.remove(k);
  }
}

function respawn() {
  P.hp = P.maxhp; P.x = P.checkpoint.x; P.z = P.checkpoint.z; P.state = 'idle'; P.inv = 1.5; P.vx = P.vz = 0; P.target = null;
  camYaw = 0;
  if (boss && boss.hp > 0) { boss.hp = boss.maxhp; boss.x = 0; boss.z = -66; boss.state = 'walk'; boss.cd = 2; boss.summoned = false; }
  say('MARCEL BRETZEL', "Aïe... Heureusement, un bretzel de secours dans la poche. On recommence !");
}

// ------------------------------------------------------------ caméra
function updateCamera(dt) {
  const focus = P.target || (boss && boss.hp > 0 && G.room === 2 ? boss : null);
  if (focus) {
    const want = Math.atan2(-(focus.x - P.x), -(focus.z - P.z));
    camYaw += angDiff(camYaw, want) * Math.min(1, dt * 6);
  } else if (P.state === 'run') {
    const want = Math.atan2(-Math.cos(P.face), Math.sin(P.face));
    const dA = angDiff(camYaw, want);
    if (Math.abs(dA) < 2.3) camYaw += dA * Math.min(1, dt * 1.6);
  }
  const fx = -Math.sin(camYaw), fz = -Math.cos(camYaw);
  const dist = boss && G.room === 2 ? 9 : 7.5, h = boss && G.room === 2 ? 4.6 : 4.2;
  const want = new THREE.Vector3(P.x - fx * dist, h, P.z - fz * dist);
  // évite de traverser les murs extérieurs
  const r = R[G.room] || R[0];
  const wx = clamp(want.x, r.x0 + 0.8, r.x1 - 0.8), wz = clamp(want.z, r.z1 + 0.8, r.z0 - 0.8);
  const squeeze = Math.hypot(want.x - wx, want.z - wz);
  want.x = wx; want.z = wz; want.y += Math.min(squeeze * 0.6, 3); // contre un mur : la caméra monte au lieu de traverser
  camPos.lerp(want, Math.min(1, dt * 6));
  camera.position.copy(camPos);
  if (G.shake > 0) camera.position.add(new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).multiplyScalar(G.shake * 0.5));
  const look = new THREE.Vector3(P.x, 1.6, P.z);
  if (focus) look.lerp(new THREE.Vector3(focus.x, focus.kind === 'coq' ? 3 : 1.6, focus.z), 0.4);
  camLook.lerp(look, Math.min(1, dt * 10));
  camera.lookAt(camLook);
  reticle.visible = !!P.target;
  if (P.target) { reticle.position.set(P.target.x, P.target.kind === 'coq' ? 6.2 : 3.4, P.target.z); reticle.rotation.y += dt * 5; }
}

// ------------------------------------------------------------ HUD
function updateHUD() {
  const h = document.getElementById('hearts');
  const n = P.maxhp / 2; let html = '';
  for (let i = 0; i < n; i++) { const v = P.hp - i * 2; html += `<div class="heart${v <= 0 ? ' empty' : (v === 1 ? ' half' : '')}"></div>`; }
  if (h.innerHTML !== html) h.innerHTML = html;
  document.getElementById('keys').textContent = P.keys ? '🗝 x' + P.keys : '';
}

// ------------------------------------------------------------ boucle
G.time = 0;
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  pollPad();
  step(dt);
  renderer.render(scene, camera);
  for (const k in pressed) pressed[k] = false;
  requestAnimationFrame(frame);
}
function step(dt) {
  G.time += dt;
  if (pressed.mute) Audio.mute();
  if (G.mode === 'title') {
    camera.position.set(Math.sin(G.time * 0.2) * 6, 4, -10 + Math.cos(G.time * 0.2) * 6); camera.lookAt(0, 3, -16);
    if (pressed.ok || pressed.atk) {
      G.mode = 'play'; document.getElementById('title').style.display = 'none'; Audio.music(true, 'dungeon');
      camPos.set(0, 4.2, 4.5);
    }
    return;
  }
  const talking = updateDialog(dt);
  for (const p of parts) { p.life -= dt; p.v.y -= 20 * dt; p.m.position.addScaledVector(p.v, dt); if (p.m.position.y < 0.1) { p.m.position.y = 0.1; p.v.multiplyScalar(0.5); } }
  for (let i = parts.length - 1; i >= 0; i--) if (parts[i].life <= 0) { scene.remove(parts[i].m); parts.splice(i, 1); }
  for (const p of pickups) if (!p.taken) { p.t += dt; p.m.rotation.y += dt * 3; p.m.position.y = 0.5 + Math.sin(p.t * 4) * 0.15; }
  for (const d of [door1, door2]) { d.t = clamp(d.t + (d.open ? dt : -dt), 0, 1); d.mesh.position.y = -d.t * 3.5; }
  updatePuzzle(dt);
  updateChest(dt);
  if (G.hitstop > 0) { G.hitstop -= dt; updateCamera(dt); return; }
  G.shake = Math.max(0, G.shake - dt);
  if (!talking && G.mode === 'play') { updatePlayer(dt); updateEnemies(dt); }
  else if (talking) { pose(P.obj, { shN: 30, elN: 80, shF: 40, elF: 70, torso: 4 }, Math.sin(G.time * 3) * 0.03); if (boss && boss.state === 'die') updateEnemies(dt); }
  if (G.mode === 'end') { updateEnemies(dt); if (!talking) { pose(P.obj, { shN: 175, elN: 0, shF: -30, elF: 60, head: -10 }); } }
  updateCamera(dt);
  updateHUD();
}
requestAnimationFrame(frame);
window.S3K3D = { G, P, enemies, step, get boss() { return boss; }, pressed, keys };
})().catch(e => { console.error(e); document.body.insertAdjacentHTML('beforeend', '<pre style="color:#f66;position:fixed;top:0;left:0;z-index:9">' + e + '</pre>'); });
