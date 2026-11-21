// =====================================================================
//  STRASBOURG 3000 — La Revanche du Marché de Noël Éternel  (POC)
//  Beat'em up 2D. Sprites et décor rendus dans Blender (voir tools/).
// =====================================================================
(() => {
'use strict';

const W = 384, H = 216;
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;
const META = window.S3K_META;
const FONT = '"Press Start 2P", ui-monospace, monospace';

// ------------------------------------------------------------ mise à l'échelle
function fit() {
  const s = Math.max(1, Math.floor(Math.min((innerWidth - 16) / W, (innerHeight - 90) / H)));
  cv.style.width = W * s + 'px';
  cv.style.height = H * s + 'px';
}
addEventListener('resize', fit); fit();

// ------------------------------------------------------------ chargement des images
const IMG = {};
const SHEETS = ['hero', 'lutin', 'zombie', 'stork', 'boss', 'mayor', 'props'];
function tinted(img, color, alpha) {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  g.globalCompositeOperation = 'source-atop';
  g.globalAlpha = alpha;
  g.fillStyle = color;
  g.fillRect(0, 0, c.width, c.height);
  return c;
}
function load(src) {
  return new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = src; });
}

// ------------------------------------------------------------ entrées
const keys = {}, pressed = {};
const KEYMAP = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  KeyJ: 'atk', KeyX: 'atk', KeyK: 'jump', KeyC: 'jump', Space: 'jump',
  KeyL: 'spec', KeyV: 'spec', Enter: 'start', KeyP: 'pause', KeyM: 'mute', Escape: 'pause'
};
addEventListener('keydown', e => {
  const k = KEYMAP[e.code]; if (!k) return;
  e.preventDefault();
  if (!keys[k]) pressed[k] = true;
  keys[k] = true;
  Audio.unlock();
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) keys[k] = false; });
let padPrev = {};
function pollPad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const p = pads && [...pads].find(x => x);
  if (!p) return;
  const b = i => p.buttons[i] && p.buttons[i].pressed;
  const st = {
    left: p.axes[0] < -0.4 || b(14), right: p.axes[0] > 0.4 || b(15),
    up: p.axes[1] < -0.4 || b(12), down: p.axes[1] > 0.4 || b(13),
    jump: b(0), atk: b(2) || b(3), spec: b(1), start: b(9), pause: b(8)
  };
  for (const k in st) {
    if (st[k] && !padPrev[k]) { pressed[k] = true; Audio.unlock(); }
    if (st[k] || padPrev[k]) keys[k] = st[k];
  }
  padPrev = st;
}

// ------------------------------------------------------------ audio (chiptune original)
const Audio = (() => {
  let ac = null, master = null, muted = false, musicOn = false, nextT = 0, step = 0, tempo = 150, song = 'main';
  const mf = n => 440 * Math.pow(2, (n - 69) / 12);
  const N = { G4: 67, A4: 69, B4: 71, C5: 72, D5: 74, E5: 76, F5: 77, G5: 79, A5: 81, B5: 83, F4: 65, _: null };
  const L = s => s.split(' ').map(x => N[x]);
  const LEAD = L('A4 C5 E5 A5 G5 E5 C5 D5 E5 _ E5 D5 C5 B4 A4 _ F4 A4 C5 F5 E5 C5 A4 B4 C5 D5 E5 G5 E5 _ _ _ ' +
                 'A4 C5 E5 A5 B5 A5 G5 E5 F5 E5 D5 C5 D5 E5 C5 _ D5 F5 A5 G5 F5 E5 D5 C5 B4 G4 B4 D5 E5 _ E5 _');
  const ROOTS = [45, 45, 41, 48, 45, 41, 38, 40];
  const BOSSLEAD = L('A4 A4 C5 A4 D5 C5 B4 G4 A4 A4 C5 E5 F5 E5 D5 B4 A4 A4 C5 A4 D5 C5 B4 G4 F4 G4 A4 B4 C5 B4 G4 E5');
  const BOSSROOTS = [45, 45, 43, 40];
  function unlock() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = muted ? 0 : 0.5; master.connect(ac.destination);
    } catch (e) { ac = null; }
  }
  function tone(freq, t, dur, type, vol, slide) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  let noiseBuf = null;
  function noise(t, dur, vol, hp) {
    if (!noiseBuf) {
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
    s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = hp || 800;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.02);
  }
  function sched() {
    if (!ac || !musicOn) return;
    const e = 60 / tempo / 2;
    while (nextT < ac.currentTime + 0.15) {
      const boss = song === 'boss';
      const lead = boss ? BOSSLEAD : LEAD, roots = boss ? BOSSROOTS : ROOTS;
      const i = step % lead.length;
      const n = lead[i];
      if (n) tone(mf(n), nextT, e * 0.9, 'square', 0.07);
      if (n && !boss && step % 4 === 0) tone(mf(n + 12), nextT + e * 0.5, e * 0.4, 'triangle', 0.04);
      const r = roots[Math.floor(i / 8) % roots.length];
      tone(mf(r + (step % 2 ? 12 : 0)), nextT, e * 0.85, 'triangle', 0.16);
      if (step % 2) noise(nextT, 0.04, 0.05, 6000);
      if (boss && step % 4 === 0) noise(nextT, 0.08, 0.12, 200);
      // grelots de Noël
      if (!boss && step % 8 === 6) { noise(nextT, 0.12, 0.05, 9000); tone(mf(93), nextT, 0.08, 'sine', 0.03); }
      nextT += e; step++;
    }
  }
  setInterval(sched, 40);
  const sfx = {
    punch() { const t = ac.currentTime; noise(t, 0.06, 0.25, 1500); tone(180, t, 0.08, 'square', 0.12, 0.4); },
    hit() { const t = ac.currentTime; noise(t, 0.1, 0.35, 400); tone(120, t, 0.12, 'square', 0.15, 0.5); },
    heavy() { const t = ac.currentTime; noise(t, 0.25, 0.4, 150); tone(90, t, 0.3, 'sawtooth', 0.2, 0.3); },
    whiff() { noise(ac.currentTime, 0.05, 0.08, 3000); },
    jump() { tone(300, ac.currentTime, 0.15, 'square', 0.08, 2.2); },
    hurt() { const t = ac.currentTime; tone(400, t, 0.2, 'square', 0.12, 0.3); },
    pickup() { const t = ac.currentTime; [72, 76, 79, 84].forEach((n, i) => tone(mf(n), t + i * 0.06, 0.1, 'square', 0.08)); },
    throw() { tone(600, ac.currentTime, 0.15, 'triangle', 0.08, 0.5); },
    spin() { const t = ac.currentTime; for (let i = 0; i < 6; i++) noise(t + i * 0.06, 0.05, 0.12, 2500); tone(200, t, 0.4, 'sawtooth', 0.08, 3); },
    ko() { const t = ac.currentTime; [76, 72, 69, 64].forEach((n, i) => tone(mf(n), t + i * 0.09, 0.12, 'square', 0.1)); },
    go() { const t = ac.currentTime; [0, 0.15].forEach(d => tone(880, t + d, 0.1, 'square', 0.08)); },
    win() { const t = ac.currentTime; [69, 72, 76, 81, 76, 81, 84].forEach((n, i) => tone(mf(n), t + i * 0.12, 0.2, 'square', 0.09)); },
    text() { tone(1200, ac.currentTime, 0.02, 'square', 0.03); }
  };
  return {
    unlock,
    play(name) { if (ac && !muted && sfx[name]) sfx[name](); },
    music(on, which) {
      if (!ac) return;
      if (which && which !== song) { song = which; step = 0; }
      tempo = song === 'boss' ? 172 : 150;
      if (on && !musicOn) { nextT = ac.currentTime + 0.05; }
      musicOn = on;
    },
    toggleMute() { muted = !muted; if (master) master.gain.value = muted ? 0 : 0.5; return muted; },
    get muted() { return muted; }
  };
})();

// ------------------------------------------------------------ utilitaires
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const Y_MIN = 140, Y_MAX = 206;

function text(str, x, y, col = '#fff', align = 'left', size = 8, outline = '#0a0820') {
  ctx.font = size + 'px ' + FONT;
  ctx.textAlign = align; ctx.textBaseline = 'top';
  x = Math.round(x); y = Math.round(y);
  if (outline) {
    ctx.fillStyle = outline;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1]]) ctx.fillText(str, x + dx, y + dy);
  }
  ctx.fillStyle = col; ctx.fillText(str, x, y);
}
function wrap(str, maxChars) {
  const out = []; let line = '';
  for (const w of str.split(' ')) {
    if ((line + ' ' + w).trim().length > maxChars) { out.push(line); line = w; } else line = (line + ' ' + w).trim();
  }
  if (line) out.push(line);
  return out;
}

// ------------------------------------------------------------ sprites
function frameOf(key, anim, t, fps, loop = true) {
  const a = META[key].anims[anim];
  let i = Math.floor(t * fps);
  i = loop ? i % a[1] : Math.min(i, a[1] - 1);
  return a[0] + i;
}
function drawSprite(key, idx, x, y, face, opts = {}) {
  const m = META[key];
  const src = opts.flash ? IMG[key + '_w'] : (opts.holo ? IMG[key + '_h'] : IMG[key]);
  const s = opts.scale || 1;
  ctx.save();
  if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(face * s, s);
  ctx.drawImage(src, idx * m.fw, 0, m.fw, m.fh, -m.anchor[0], -m.anchor[1], m.fw, m.fh);
  ctx.restore();
}
function shadow(x, y, w) {
  ctx.fillStyle = 'rgba(5,6,25,0.45)';
  ctx.beginPath(); ctx.ellipse(Math.round(x), Math.round(y), w, w * 0.32, 0, 0, Math.PI * 2); ctx.fill();
}

// ------------------------------------------------------------ données de jeu
const ENEMY = {
  lutin: { name: 'LUTIN SYNDIQUÉ', hp: 28, speed: 58, reach: 24, dmg: 6, w: 10, score: 100, windup: 0.3,
           taunts: ['Achète un manala !', 'Grève des lutins !', 'Hopla, le touriste !', 'Mon bonnet coûte 30 € !'] },
  zombie: { name: 'VENDEUR DE VIN CHAUD', hp: 52, speed: 24, reach: 26, dmg: 10, w: 14, score: 150, windup: 0.45,
            taunts: ['Vin chauuuud...', '...47 € le gobelet...', 'Consiiigne...', 'Cannelle... cerveau...'] },
  stork: { name: 'CIGOGNE-DRONE 3000', hp: 40, speed: 46, reach: 36, dmg: 9, w: 16, score: 150, windup: 0.35,
           taunts: ['BZZT. Livraison.', 'CLAC CLAC CLAC !', 'Mode piqué activé', 'Colis : 1 bébé.'] },
  boss: { name: 'LE GRAND KOUGELHOPF', hp: 460, speed: 32, reach: 56, dmg: 16, w: 30, score: 5000, windup: 0.6,
          taunts: ['JE SUIS LE DESSERT !', 'Sens mes raisins secs !', 'Amandes... ATTAQUE !'] }
};
const HIT_WORDS = ['PAF!', 'HOPLA!', 'WURSCHT!', 'BRETZEL!', 'SCHLAG!', 'BAM!', 'ACH!', 'KNACK!', 'SPÄTZLE!'];
const KO_WORDS = ['CHOUCROUTÉ!', 'FLAMMEKUECHÉ!', 'AU BAECKEOFFE!', 'HOPLA GEISS!', 'K.O. GARNI!'];
const SIGN_TEXT = ['GLÜHWEIN', 'BREDELE', 'MANALAS', 'BRETZELS', 'KOUGLOF', 'SCHNAPS', 'STOLLEN', 'SOLDES!'];

// Vagues : la caméra se bloque à "at" tant que les vagues ne sont pas vaincues
const SECTIONS = [
  { at: 0, waves: [['lutin', 'lutin'], ['lutin', 'zombie']] },
  { at: 380, waves: [['stork', 'lutin'], ['zombie', 'stork', 'lutin']] },
  { at: 760, waves: [['lutin', 'lutin', 'lutin'], ['zombie', 'zombie', 'stork']] },
  { at: 1152, waves: [['boss']], boss: true }
];

// ------------------------------------------------------------ état global
let G;
function newGame() {
  G = {
    mode: 'play', t: 0, camX: 0, shake: 0, hitstop: 0, score: 0, lives: 3,
    section: -1, wave: 0, waveActive: false, locked: false, goTimer: 0,
    ents: [], parts: [], proj: [], pickups: [], texts: [], bubbles: [],
    banner: null, lastEnemy: null, boss: null, holoMsg: 0, endTimer: 0
  };
  G.hero = makeHero();
  G.ents.push(G.hero);
  G.pickups.push({ x: 560, y: 190, kind: 'flamme', t: 0 });
  G.pickups.push({ x: 1010, y: 160, kind: 'bretzel', t: 0 });
}

function makeHero() {
  return {
    kind: 'hero', sheet: 'hero', x: 70, y: 175, z: 0, vx: 0, vy: 0, vz: 0, face: 1, w: 12,
    hp: 100, maxhp: 100, state: 'idle', t: 0, anim: 'idle', at: 0, invul: 2, flash: 0,
    combo: 0, comboTimer: 0, hitSet: null, buffered: false
  };
}
function makeEnemy(kind, x, y) {
  const d = ENEMY[kind];
  return {
    kind, sheet: kind, x, y, z: 0, vx: 0, vy: 0, vz: 0, face: x < G.hero.x ? 1 : -1, w: d.w,
    hp: d.hp, maxhp: d.hp, state: 'enter', t: 0, anim: 'walk', at: 0, flash: 0, invul: 0,
    cd: rnd(0.6, 1.4), side: Math.random() < 0.5 ? -1 : 1, hitSet: null, d, lane: rnd(-14, 14),
    hitCount: 0, phase: 0
  };
}

function setState(e, s, anim) { e.state = s; e.t = 0; if (anim) { e.anim = anim; e.at = 0; } }

// ------------------------------------------------------------ effets
function sparks(x, y, n, col) {
  for (let i = 0; i < n; i++) G.parts.push({ x, y, vx: rnd(-90, 90), vy: rnd(-110, 20), life: rnd(0.15, 0.35), col: col || pick(['#fff', '#ffd23f', '#38f2ff']), s: pick([1, 2]) });
}
function popText(str, x, y, col, big) {
  G.texts.push({ str, x, y, col: col || '#ffd23f', t: 0, big });
}
function say(ent, str, dur = 1.8) {
  G.bubbles = G.bubbles.filter(b => b.ent !== ent);
  G.bubbles.push({ ent, str, t: 0, dur });
}

// ------------------------------------------------------------ combat
const HERO_ATK = {
  punch1: { reach: 26, dmg: 7, kd: false, active: [0.06, 0.16], dur: 0.22 },
  punch2: { reach: 28, dmg: 8, kd: false, active: [0.06, 0.16], dur: 0.24 },
  kick: { reach: 32, dmg: 14, kd: true, active: [0.08, 0.2], dur: 0.36 }
};
const COMBO = ['punch1', 'punch2', 'punch1', 'kick'];

function tryHit(att, reach, depth, dmg, kd, targets, opts = {}) {
  let any = false;
  for (const t of targets) {
    if (t.hp <= 0 || t.state === 'down' || t.state === 'getup' || t.invul > 0 || t.state === 'enter2') continue;
    if (att.hitSet && att.hitSet.has(t)) continue;
    const dx = (t.x - att.x) * (opts.omni ? Math.sign(t.x - att.x) || 1 : att.face);
    if (dx < -8 - (opts.back || 0) || dx > reach + t.w) continue;
    if (Math.abs(t.y - att.y) > depth) continue;
    if (Math.abs(t.z - att.z) > (opts.zr || 30)) continue;
    if (att.hitSet) att.hitSet.add(t);
    damage(t, dmg, kd, Math.sign(t.x - att.x) || att.face, att);
    any = true;
  }
  return any;
}

function damage(t, dmg, kd, dir, from) {
  t.hp = Math.max(0, t.hp - dmg);
  t.flash = 0.1;
  G.hitstop = kd ? 0.09 : 0.05;
  G.shake = Math.max(G.shake, kd ? 4 : 2);
  sparks(t.x, t.y - t.z - 26, kd ? 10 : 6);
  if (t.kind === 'hero') {
    Audio.play('hurt');
    t.combo = 0;
  } else {
    G.lastEnemy = t;
    G.score += 10;
    Audio.play(kd ? 'heavy' : 'hit');
    if (Math.random() < (kd ? 1 : 0.3)) popText(pick(HIT_WORDS), t.x, t.y - t.z - 50);
  }
  const dead = t.hp <= 0;
  if (t.kind === 'boss' && !dead) {
    t.hitCount++;
    if ((t.state === 'idle' || t.state === 'walk') && t.hitCount % 5 === 0) { setState(t, 'hurt', 'hurt'); t.vx = dir * 30; }
    return;
  }
  if (kd || dead) {
    setState(t, 'down', 'down');
    t.vx = dir * (t.kind === 'boss' ? 40 : 95); t.vz = 130; t.z = Math.max(t.z, 1);
    t.face = -dir;
    if (dead && t.kind !== 'hero') {
      popText(pick(KO_WORDS), t.x, t.y - 64, '#ff5d73', true);
      G.score += t.d.score;
      Audio.play('ko');
      if (t.kind !== 'boss' && Math.random() < 0.3) G.pickups.push({ x: t.x + dir * 20, y: t.y, kind: 'bretzel', t: 0, drop: true });
    }
  } else {
    setState(t, 'hurt', 'hurt');
    t.vx = dir * 45;
  }
}

// ------------------------------------------------------------ héros
function updateHero(h, dt) {
  const k = keys;
  h.invul = Math.max(0, h.invul - dt);
  h.comboTimer -= dt;
  const mx = (k.right ? 1 : 0) - (k.left ? 1 : 0);
  const my = (k.down ? 1 : 0) - (k.up ? 1 : 0);
  h.t += dt; h.at += dt;

  switch (h.state) {
    case 'idle': case 'walk': {
      if (pressed.spec && h.hp > 8) { startSpecial(h); break; }
      if (pressed.jump) { setState(h, 'jump', 'jump'); h.vz = 230; h.vx = mx * 95; h.vy = my * 45; Audio.play('jump'); break; }
      if (pressed.atk) { startAttack(h); break; }
      if (mx || my) {
        h.x += mx * 92 * dt; h.y += my * 52 * dt;
        if (mx) h.face = mx;
        if (h.state !== 'walk') setState(h, 'walk', 'walk');
      } else if (h.state !== 'idle') setState(h, 'idle', 'idle');
      checkPickups(h);
      break;
    }
    case 'attack': {
      const a = HERO_ATK[h.atk];
      if (pressed.atk) h.buffered = true;
      if (h.t >= a.active[0] && h.t <= a.active[1]) {
        if (tryHit(h, a.reach, 12, a.dmg, a.kd, enemies())) h.connected = true;
      }
      if (h.t >= a.dur) {
        if (h.buffered && h.connected && h.combo < COMBO.length) { startAttack(h, true); }
        else { h.combo = h.connected && h.combo < COMBO.length ? h.combo : 0; setState(h, 'idle', 'idle'); h.comboTimer = 0.35; }
      }
      break;
    }
    case 'jump': case 'jumpkick': {
      h.x += h.vx * dt; h.y += h.vy * dt;
      h.vz -= 720 * dt; h.z += h.vz * dt;
      if (h.state === 'jump' && pressed.atk) { setState(h, 'jumpkick', 'jumpkick'); h.hitSet = new Set(); Audio.play('whiff'); }
      if (h.state === 'jumpkick') tryHit(h, 30, 14, 13, true, enemies(), { zr: 50 });
      if (h.z <= 0) { h.z = 0; h.vz = 0; setState(h, 'idle', 'idle'); }
      break;
    }
    case 'special': {
      if (h.t < 0.6) tryHit(h, 34, 16, 18, true, enemies(), { omni: true, back: 40 });
      if (h.t > 0.62) { setState(h, 'idle', 'idle'); }
      break;
    }
    case 'hurt':
      h.x += h.vx * dt; h.vx *= 0.85;
      if (h.t > 0.3) setState(h, 'idle', 'idle');
      break;
    case 'down':
      fallPhysics(h, dt);
      if (h.z === 0 && h.vz === 0 && h.t > 0.9) {
        if (h.hp <= 0) { heroDeath(h); }
        else { setState(h, 'idle', 'idle'); h.invul = 1.2; }
      }
      break;
    case 'dead':
      break;
    case 'win':
      break;
  }
  // limites
  const minX = G.camX + 10, maxX = G.locked ? G.camX + W - 10 : Math.min(G.camX + W - 10, META.kleber.w - 10);
  h.x = clamp(h.x, minX, maxX);
  h.y = clamp(h.y, Y_MIN, Y_MAX);
}

function startAttack(h, chained) {
  if (!chained && h.comboTimer <= 0) h.combo = 0;
  const name = COMBO[h.combo % COMBO.length];
  h.combo++;
  h.atk = name; h.connected = false; h.buffered = false;
  h.hitSet = new Set();
  setState(h, 'attack', name);
  Audio.play('punch');
}
function startSpecial(h) {
  h.hp -= 6; h.hitSet = new Set(); h.invul = 0.7;
  setState(h, 'special', 'special');
  Audio.play('spin');
  popText('TORNADE DE BRETZEL!', h.x, h.y - 70, '#38f2ff');
}
function heroDeath(h) {
  G.lives--;
  if (G.lives <= 0) { setState(h, 'dead'); G.mode = 'gameover'; G.endTimer = 0; Audio.music(false); return; }
  h.hp = h.maxhp; h.invul = 2.5; setState(h, 'idle', 'idle');
  popText('ENCORE UN BRETZEL !', h.x, h.y - 70, '#38f2ff', true);
  // repousse les ennemis
  for (const e of enemies()) if (e.kind !== 'boss' && e.hp > 0) damage(e, 0, true, Math.sign(e.x - h.x) || 1, h);
}
function checkPickups(h) {
  for (const p of G.pickups) {
    if (Math.abs(p.x - h.x) < 14 && Math.abs(p.y - h.y) < 10) {
      p.taken = true;
      const heal = p.kind === 'flamme' ? 50 : 20;
      h.hp = Math.min(h.maxhp, h.hp + heal);
      G.score += 50;
      Audio.play('pickup');
      popText(p.kind === 'flamme' ? 'FLAMMEKUECHE ! +50' : 'BRETZEL ! +20', p.x, p.y - 30, '#7dff9b');
    }
  }
  G.pickups = G.pickups.filter(p => !p.taken);
}
function fallPhysics(e, dt) {
  e.x += e.vx * dt;
  if (e.z > 0 || e.vz > 0) {
    e.vz -= 600 * dt; e.z += e.vz * dt;
    if (e.z <= 0) {
      e.z = 0;
      if (Math.abs(e.vz) > 120) { e.vz = -e.vz * 0.3; G.shake = Math.max(G.shake, 2); } else e.vz = 0;
      e.vx *= 0.5;
    }
  } else e.vx *= 0.8;
}
const enemies = () => G.ents.filter(e => e.kind !== 'hero');

// ------------------------------------------------------------ ennemis
function updateEnemy(e, dt) {
  const h = G.hero, d = e.d;
  e.t += dt; e.at += dt;
  e.flash = Math.max(0, e.flash - dt);
  e.invul = Math.max(0, e.invul - dt);
  if (e.kind === 'boss') return updateBoss(e, dt);
  const heroAlive = h.state !== 'dead' && G.mode === 'play';
  switch (e.state) {
    case 'enter':
      e.x += Math.sign(G.camX + W / 2 - e.x) * d.speed * dt;
      e.anim = 'walk';
      if (e.x > G.camX + 16 && e.x < G.camX + W - 16) { setState(e, 'idle', 'idle'); if (Math.random() < 0.45) say(e, pick(d.taunts)); }
      break;
    case 'idle': case 'walk': {
      if (!heroAlive) { if (e.state !== 'idle') setState(e, 'idle', 'idle'); break; }
      e.cd -= dt;
      // position désirée : à côté du héros
      const side = Math.sign(e.x - h.x) || e.side;
      const tx = h.x + side * (d.reach + 2), ty = h.y + (Math.abs(e.x - h.x) > 60 ? e.lane : 0);
      let dx = tx - e.x, dy = ty - e.y;
      // séparation entre ennemis
      for (const o of G.ents) if (o !== e && o.kind !== 'hero' && Math.abs(o.x - e.x) < 18 && Math.abs(o.y - e.y) < 8) { dy += (e.y >= o.y ? 10 : -10); }
      e.face = Math.sign(h.x - e.x) || e.face;
      const inX = Math.abs(Math.abs(e.x - h.x) - d.reach) < 8, inY = Math.abs(e.y - h.y) < 7;
      // vendeur zombie : lance des chopes à distance
      if (e.kind === 'zombie' && e.cd <= 0 && Math.abs(e.y - h.y) < 8 && Math.abs(e.x - h.x) > 70 && Math.abs(e.x - h.x) < 200) {
        setState(e, 'throw', 'attack'); break;
      }
      // cigogne : piqué
      if (e.kind === 'stork' && e.cd <= 0 && Math.abs(e.y - h.y) < 6 && Math.abs(e.x - h.x) > 60 && Math.abs(e.x - h.x) < 150 && Math.random() < 0.02) {
        setState(e, 'dive', 'attack'); e.hitSet = new Set(); say(e, 'MODE PIQUÉ !', 1); break;
      }
      if (inX && inY && e.cd <= 0) { setState(e, 'windup', 'attack'); break; }
      const sp = d.speed * (e.kind === 'lutin' ? 1 : 0.9);
      const len = Math.hypot(dx, dy * 1.6);
      if (len > 3) {
        e.x += dx / len * sp * dt; e.y += dy / len * sp * 0.6 * dt;
        if (e.state !== 'walk') setState(e, 'walk', 'walk');
      } else if (e.state !== 'idle') setState(e, 'idle', 'idle');
      break;
    }
    case 'windup':
      e.at = 0;
      if (e.t > d.windup) { setState(e, 'strike'); e.anim = 'attack'; e.at = 1 / 6; e.hitSet = new Set(); Audio.play('whiff'); }
      break;
    case 'strike':
      e.at = 1 / 6 + 0.001;
      if (e.t < 0.14) tryHit(e, d.reach, 9, d.dmg, e.kind === 'stork' && Math.random() < 0.3, [h]);
      if (e.t > 0.32) { setState(e, 'idle', 'idle'); e.cd = rnd(0.9, 1.9); }
      break;
    case 'throw':
      e.at = e.t < 0.45 ? 0 : 1;
      if (e.t > 0.45 && !e.thrown) {
        e.thrown = true; Audio.play('throw');
        G.proj.push({ x: e.x + e.face * 14, y: e.y, z: 30, vx: e.face * 120, t: 0, dmg: 8 });
      }
      if (e.t > 0.8) { e.thrown = false; setState(e, 'idle', 'idle'); e.cd = rnd(1.8, 3); }
      break;
    case 'dive':
      e.at = e.t < 0.35 ? 0 : 1;
      if (e.t > 0.35) { e.x += e.face * 210 * dt; tryHit(e, 30, 9, 12, true, [h]); }
      if (e.t > 0.95) { setState(e, 'idle', 'idle'); e.cd = rnd(1.5, 2.5); }
      break;
    case 'hurt':
      e.x += e.vx * dt; e.vx *= 0.85;
      if (e.t > 0.32) setState(e, 'idle', 'idle');
      break;
    case 'down':
      fallPhysics(e, dt);
      if (e.z === 0 && e.vz === 0 && e.t > 0.8) {
        if (e.hp <= 0) { e.dead = true; }
        else { setState(e, 'idle', 'idle'); e.invul = 0.5; e.cd = rnd(0.5, 1.2); }
      }
      break;
  }
  e.y = clamp(e.y, Y_MIN, Y_MAX);
  if (e.state !== 'enter') e.x = clamp(e.x, G.camX + 8, G.camX + W - 8);
}

function updateBoss(e, dt) {
  const h = G.hero, d = e.d;
  const heroAlive = h.state !== 'dead' && G.mode === 'play';
  // invocations de commis
  if (e.hp < e.maxhp * 0.6 && e.phase === 0) { e.phase = 1; say(e, 'COMMIS ! À MOI !', 2); spawn('lutin'); spawn('lutin'); }
  if (e.hp < e.maxhp * 0.3 && e.phase === 1) { e.phase = 2; say(e, 'LEVURE MAXIMALE !', 2); spawn('stork'); spawn('lutin'); }
  const rage = e.phase >= 2 ? 1.35 : 1;
  switch (e.state) {
    case 'enter':
      e.x -= 40 * dt; e.anim = 'walk';
      if (e.x < G.camX + W - 70) { setState(e, 'idle', 'idle'); say(e, pick(d.taunts), 2.2); e.cd = 1.2; }
      break;
    case 'idle': case 'walk': {
      if (!heroAlive) break;
      e.cd -= dt;
      e.face = Math.sign(h.x - e.x) || e.face;
      const dx = h.x - e.x, dy = h.y - e.y;
      if (e.cd <= 0) {
        if (Math.abs(dx) < 70 && Math.abs(dy) < 14) { setState(e, 'slam', 'slam'); e.hitSet = new Set(); break; }
        if (Math.abs(dx) > 110 && Math.random() < 0.6) { setState(e, 'aim', 'idle'); break; }
      }
      const len = Math.hypot(dx, dy);
      if (len > 40) {
        e.x += dx / len * d.speed * rage * dt; e.y += dy / len * d.speed * 0.7 * dt;
        if (e.state !== 'walk') setState(e, 'walk', 'walk');
      } else {
        if (e.state !== 'idle') setState(e, 'idle', 'idle');
        e.cd -= dt;
      }
      break;
    }
    case 'slam':
      // 3 images : levée, sommet, impact
      e.at = e.t < 0.5 / rage ? 0 : (e.t < 0.7 / rage ? 1 / 12 + 0.001 : 2 / 12 + 0.001);
      if (e.t >= 0.7 / rage && !e.slammed) {
        e.slammed = true;
        G.shake = 7; Audio.play('heavy');
        G.parts.push({ ring: true, x: e.x + e.face * 30, y: e.y, r: 4, life: 0.4, max: 0.4 });
        sparks(e.x + e.face * 30, e.y - 4, 14, '#f7f3ea');
        if (h.z < 8 && Math.abs(h.y - e.y) < 22 && (h.x - e.x) * e.face > -30 && Math.abs(h.x - e.x) < 80 && h.invul <= 0 && h.state !== 'down')
          damage(h, d.dmg, true, e.face, e);
      }
      if (e.t > 1.3 / rage) { e.slammed = false; setState(e, 'idle', 'idle'); e.cd = rnd(1.0, 1.8) / rage; }
      break;
    case 'aim':
      e.face = Math.sign(h.x - e.x) || e.face;
      e.y += clamp(h.y - e.y, -40 * dt, 40 * dt);
      e.anim = 'charge'; e.at = 0;
      if (e.t > 0.7) { setState(e, 'charge', 'charge'); e.hitSet = new Set(); say(e, 'ROULADE SUCRÉE !', 1.2); }
      break;
    case 'charge':
      e.x += e.face * 230 * rage * dt;
      if (Math.floor(e.t * 10) % 2 === 0) G.shake = Math.max(G.shake, 1);
      tryHit(e, 36, 16, 14, true, [h]);
      if (e.t > 1.4 || e.x < G.camX + 30 || e.x > G.camX + W - 30) {
        e.x = clamp(e.x, G.camX + 30, G.camX + W - 30);
        setState(e, 'idle', 'idle'); e.cd = rnd(1.2, 2.0) / rage; G.shake = 4;
      }
      break;
    case 'hurt':
      e.x += e.vx * dt;
      if (e.t > 0.35) setState(e, 'idle', 'idle');
      break;
    case 'down':
      fallPhysics(e, dt);
      if (e.t > 0.4 && e.z === 0 && !e.bossDone) { e.bossDone = true; bossDefeated(e); }
      break;
  }
  e.y = clamp(e.y, Y_MIN + 4, Y_MAX);
}

function bossDefeated(e) {
  G.score += 2000;
  for (const o of enemies()) if (o !== e && o.hp > 0) { o.hp = 0; setState(o, 'down', 'down'); o.vz = 120; }
  G.mode = 'victory'; G.endTimer = 0;
  Audio.music(false);
  Audio.play('win');
  setState(G.hero, 'win', 'win');
}

// ------------------------------------------------------------ vagues
function spawn(kind) {
  const left = Math.random() < 0.5;
  const x = kind === 'boss' ? G.camX + W + 40 : (left ? G.camX - 24 : G.camX + W + 24);
  const e = makeEnemy(kind, x, kind === 'boss' ? 176 : rnd(Y_MIN + 4, Y_MAX - 4));
  G.ents.push(e);
  if (kind === 'boss') G.boss = e;
  return e;
}
function updateWaves(dt) {
  const h = G.hero;
  const alive = enemies().filter(e => !e.dead).length;
  if (!G.locked) {
    // la caméra suit le héros (jamais en arrière)
    const target = clamp(h.x - W * 0.42, 0, META.kleber.w - W);
    G.camX = Math.max(G.camX, Math.min(target, G.camX + 140 * dt));
    const next = SECTIONS[G.section + 1];
    if (next && G.camX >= next.at - 0.5) {
      G.section++; G.camX = next.at; G.locked = true; G.wave = 0; G.waveTimer = 0.4;
      if (next.boss) {
        G.banner = { title: 'MINI-BOSS', sub: 'LE GRAND KOUGELHOPF', t: 0 };
        Audio.music(true, 'boss');
        G.holoMsg = 1;
      }
    }
  } else {
    const sec = SECTIONS[G.section];
    if (alive === 0) {
      G.waveTimer -= dt;
      if (G.waveTimer <= 0) {
        if (G.wave < sec.waves.length) {
          for (const k of sec.waves[G.wave]) spawn(k);
          G.wave++; G.waveTimer = 0.9;
        } else if (!sec.boss) {
          G.locked = false; G.goTimer = 3; Audio.play('go');
        }
      }
    }
  }
}

// ------------------------------------------------------------ boucle principale
let scene = 'loading', sceneT = 0, introPage = 0, paused = false;
const INTRO = [
  { who: 'mayor', title: '2077. STRASBOURG.', txt: "Le maire Konrad von Lebkuchen a décrété le MARCHÉ DE NOËL ÉTERNEL. Plus jamais de 25 décembre. Plus jamais de janvier." },
  { who: 'mayor', title: 'JOUR 18 263 DU MARCHÉ', txt: "Le vin chaud coûte 47 €. Les cigognes sont des drones de surveillance. Les lutins sont syndiqués, mais du côté du maire." },
  { who: 'hero', title: 'UN SEUL ESPOIR', txt: "Marcel Bretzel, livreur de flammekueche intertemporel, vole la machine à remonter le temps de la mairie (elle était en promo)." },
  { who: 'hero', title: 'MISSION : 2026', txt: "Retour place Kléber, le soir où tout a commencé. Empêche la cuisson du Grand Kougelhopf maudit, cœur du sortilège. Hopla !" }
];

let last = performance.now(), acc = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  pollPad();
  acc += dt;
  while (acc >= 1 / 60) { tick(1 / 60); acc -= 1 / 60; }
  render();
  for (const k in pressed) pressed[k] = false;
  requestAnimationFrame(frame);
}

function tick(dt) {
  sceneT += dt;
  updateSnow(dt);
  if (pressed.mute) Audio.toggleMute();
  if (scene === 'title') {
    if (pressed.start || pressed.atk) { scene = 'intro'; sceneT = 0; introPage = 0; Audio.play('go'); }
    return;
  }
  if (scene === 'intro') {
    if (pressed.start || pressed.atk || pressed.jump) {
      const full = INTRO[introPage].txt.length;
      if (sceneT * 45 < full) sceneT = 999;
      else if (++introPage >= INTRO.length) { scene = 'game'; newGame(); Audio.music(true, 'main'); }
      else sceneT = 0;
    }
    return;
  }
  if (scene !== 'game') return;
  if (pressed.pause && G.mode === 'play') paused = !paused;
  if (paused) return;
  G.t += dt;
  if (G.hitstop > 0) { G.hitstop -= dt; return; }
  G.shake = Math.max(0, G.shake - dt * 20);
  G.goTimer = Math.max(0, G.goTimer - dt);
  if (G.banner) { G.banner.t += dt; if (G.banner.t > 3) G.banner = null; }

  const h = G.hero;
  h.flash = Math.max(0, h.flash - dt);
  if (G.mode === 'play') { updateHero(h, dt); updateWaves(dt); }
  else { h.t += dt; h.at += dt; if (h.state === 'down') fallPhysics(h, dt); }
  for (const e of enemies()) updateEnemy(e, dt);
  G.ents = G.ents.filter(e => !e.dead);
  // projectiles
  for (const p of G.proj) {
    p.t += dt; p.x += p.vx * dt; p.z -= 8 * dt;
    if (G.parts.length < 200 && Math.random() < 0.5) G.parts.push({ x: p.x, y: p.y - p.z - 6, vx: rnd(-10, 10), vy: -30, life: 0.4, col: '#e8e0f0', s: 1, steam: true });
    if (G.mode === 'play' && Math.abs(p.x - h.x) < 12 && Math.abs(p.y - h.y) < 8 && h.z < 40 && h.invul <= 0 && h.state !== 'down' && h.state !== 'special') {
      p.gone = true; damage(h, p.dmg, false, Math.sign(p.vx), p); popText('BRÛLANT !', h.x, h.y - 60, '#ff5d73');
    }
    if (p.x < G.camX - 40 || p.x > G.camX + W + 40) p.gone = true;
  }
  G.proj = G.proj.filter(p => !p.gone);
  for (const p of G.pickups) p.t += dt;
  // particules / textes / bulles
  for (const p of G.parts) { p.life -= dt; if (!p.ring) { p.x += p.vx * dt; p.y += p.vy * dt; if (!p.steam) p.vy += 300 * dt; } else p.r += 260 * dt; }
  G.parts = G.parts.filter(p => p.life > 0);
  for (const t of G.texts) t.t += dt;
  G.texts = G.texts.filter(t => t.t < 1.1);
  for (const b of G.bubbles) b.t += dt;
  G.bubbles = G.bubbles.filter(b => b.t < b.dur && !b.ent.dead && b.ent.hp > 0);

  if (G.mode === 'gameover' || G.mode === 'victory') {
    G.endTimer += dt;
    if (G.endTimer > 2.5 && (pressed.start || pressed.atk)) { scene = 'title'; sceneT = 0; G = null; }
  }
}

// ------------------------------------------------------------ rendu
const SNOW = Array.from({ length: 70 }, () => ({ x: rnd(0, W), y: rnd(0, H), v: rnd(10, 26), s: Math.random() < 0.2 ? 2 : 1, ph: rnd(0, 6) }));
function updateSnow(dt) {
  for (const f of SNOW) {
    f.y += f.v * dt; f.x += Math.sin(sceneT * 1.3 + f.ph) * 8 * dt;
    if (f.y > H) { f.y = -2; f.x = rnd(0, W); }
  }
}
const STARS = Array.from({ length: 50 }, () => [rnd(0, W), rnd(0, 60), Math.random()]);
function drawSky(camX) {
  const g = ctx.createLinearGradient(0, 0, 0, 110);
  g.addColorStop(0, '#060825'); g.addColorStop(1, '#2a2468');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (const [x, y, p] of STARS) {
    ctx.fillStyle = (Math.sin(sceneT * 3 + p * 20) > 0.6) ? '#fff' : '#8a8fd8';
    ctx.fillRect(Math.round((x - camX * 0.05 + W) % W), y, 1, 1);
  }
  ctx.fillStyle = '#f4f0d0';
  ctx.beginPath(); ctx.arc(330 - camX * 0.03, 22, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#060825';
  ctx.beginPath(); ctx.arc(326 - camX * 0.03, 19, 8, 0, Math.PI * 2); ctx.fill();
}
function drawBackground(camX, t) {
  drawSky(camX);
  ctx.drawImage(IMG.kleber, Math.round(camX), 0, W, H, 0, 0, W, H);
  const K = META.kleber;
  // enseignes des chalets
  K.signs.forEach((s, i) => {
    const x = s[0] - camX;
    if (x < -50 || x > W + 50) return;
    ctx.font = '8px ' + FONT;
    const str = SIGN_TEXT[i % SIGN_TEXT.length];
    ctx.save(); ctx.translate(Math.round(x), Math.round(s[1]) - 4);
    const sc = Math.min(1, 62 / (str.length * 8));
    ctx.scale(sc, 1);
    text(str, 0, 0, '#5a2a14', 'center', 8, null);
    ctx.restore();
  });
  // écran holographique du maire
  const [a, b] = K.holo;
  const hx = a[0] - camX, hy = a[1] + 2, hw = b[0] - a[0] - 4, hh = b[1] - a[1] - 4;
  if (hx < W && hx + hw > 0) {
    ctx.save();
    ctx.beginPath(); ctx.rect(hx, hy, hw, hh); ctx.clip();
    ctx.fillStyle = '#0a1430'; ctx.fillRect(hx, hy, hw, hh);
    for (let yy = 0; yy < hh; yy += 2) { ctx.fillStyle = 'rgba(56,242,255,0.06)'; ctx.fillRect(hx, hy + yy, hw, 1); }
    if (G && G.holoMsg) {
      const fr = META.mayor.anims.evil[0] + (Math.floor(t * 4) % 2);
      drawSprite('mayor', fr, hx + 30, hy + hh + 6, 1, { holo: true, scale: 0.75 });
      const msgs = G.mode === 'victory' ? ['NOOOON ! MON KOUGELHOPF !', 'JE REVIENDRAI... EN 2078 !']
        : ['HO HO HOPLA !', 'KOUGELHOPF, ÉCRASE-LE !', 'LE MARCHÉ NE FERMERA JAMAIS !'];
      const m = msgs[Math.floor(t / 2.2) % msgs.length];
      wrap(m, 22).forEach((l, i) => text(l, hx + 58, hy + 8 + i * 10, '#38f2ff', 'left', 8, '#051020'));
    } else {
      const msg = '★ MARCHÉ DE NOËL ÉTERNEL ★ JOUR 1 / ∞ ★ VIN CHAUD OBLIGATOIRE ★ SOURIEZ, LES CIGOGNES VOUS FILMENT ★ ';
      ctx.font = '8px ' + FONT;
      const mw = ctx.measureText(msg).width;
      const off = (t * 30) % mw;
      text(msg + msg, hx + 4 - off, hy + hh / 2 - 4, '#38f2ff', 'left', 8, '#051020');
    }
    ctx.restore();
  }
}

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;
  if (scene === 'loading') { ctx.fillStyle = '#07081a'; ctx.fillRect(0, 0, W, H); text('CHARGEMENT...', W / 2, H / 2, '#fff', 'center'); return; }
  if (scene === 'title') return renderTitle();
  if (scene === 'intro') return renderIntro();
  const sx = G.shake ? Math.round(rnd(-G.shake, G.shake)) : 0, sy = G.shake ? Math.round(rnd(-G.shake, G.shake) * 0.6) : 0;
  ctx.setTransform(1, 0, 0, 1, sx, sy);
  drawBackground(G.camX, G.t);
  const cx = G.camX;
  // ombres
  for (const e of G.ents) shadow(e.x - cx, e.y, e.kind === 'boss' ? 40 : (e.kind === 'lutin' ? 9 : 12));
  for (const p of G.proj) shadow(p.x - cx, p.y, 5);
  // objets au sol
  const drawables = [];
  for (const p of G.pickups) drawables.push({ y: p.y - 1, draw: () => {
    const i = META.props.names.indexOf(p.kind);
    if (p.drop && p.t < 0.3) return;
    drawSprite('props', i, p.x - cx, p.y - Math.abs(Math.sin(p.t * 3)) * 2, 1);
  } });
  for (const e of G.ents) drawables.push({ y: e.y, draw: () => drawEntity(e, cx) });
  for (const p of G.proj) drawables.push({ y: p.y, draw: () => {
    ctx.save(); ctx.translate(Math.round(p.x - cx), Math.round(p.y - p.z - 8)); ctx.rotate(p.t * 12 * Math.sign(p.vx));
    const m = META.props; ctx.drawImage(IMG.props, 0, 0, m.fw, m.fh, -m.fw / 2, -m.fh / 2 - 4, m.fw, m.fh); ctx.restore();
  } });
  drawables.sort((a, b) => a.y - b.y).forEach(d => d.draw());
  // particules
  for (const p of G.parts) {
    if (p.ring) {
      ctx.strokeStyle = `rgba(247,243,234,${p.life / p.max})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(p.x - cx, p.y, p.r, p.r * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
    } else { ctx.fillStyle = p.col; ctx.globalAlpha = p.steam ? p.life : 1; ctx.fillRect(Math.round(p.x - cx), Math.round(p.y), p.s, p.s); ctx.globalAlpha = 1; }
  }
  for (const t of G.texts) {
    const y = t.y - t.t * 24;
    if (t.t < 0.9 || Math.floor(t.t * 20) % 2) text(t.str, t.x - cx, y, t.col, 'center', 8);
  }
  for (const b of G.bubbles) drawBubble(b, cx);
  drawSnowLayer();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawHUD();
}

function drawEntity(e, cx) {
  let fps = 8, loop = true;
  if (e.anim === 'walk') fps = e.kind === 'zombie' ? 5 : (e.kind === 'boss' ? 6 : 10);
  if (e.anim === 'idle') fps = 2.5;
  if (e.anim === 'special') fps = 16;
  if (['punch1', 'punch2', 'kick', 'attack', 'slam', 'hurt', 'down', 'jump', 'jumpkick', 'win'].includes(e.anim)) { fps = 12; loop = false; }
  if (e.kind === 'hero' && e.state === 'attack') { fps = 1 / HERO_ATK[e.atk].active[0]; }
  if (e.anim === 'charge') { fps = 10; loop = true; }
  const idx = frameOf(e.sheet, e.anim, e.at, fps, loop);
  let alpha = 1;
  if (e.invul > 0 && e.kind === 'hero' && e.state !== 'special' && Math.floor(G.t * 20) % 2) alpha = 0.35;
  if (e.hp <= 0 && e.state === 'down' && e.t > 0.4 && e.kind !== 'hero' && e.kind !== 'boss') alpha = Math.floor(G.t * 16) % 2 ? 0.2 : 1;
  drawSprite(e.sheet, idx, e.x - cx, e.y - e.z, e.face, { flash: e.flash > 0, alpha });
  // vapeur des vendeurs de vin chaud
  if (e.kind === 'zombie' && e.hp > 0 && Math.random() < 0.08) G.parts.push({ x: e.x + e.face * 16, y: e.y - 40, vx: rnd(-6, 6), vy: -18, life: 0.6, col: '#d8d0e8', s: 1, steam: true });
}

function drawBubble(b, cx) {
  const e = b.ent;
  const lines = wrap(b.str, 16);
  const w = Math.max(...lines.map(l => l.length)) * 8 + 8, hh = lines.length * 10 + 6;
  const top = e.kind === 'boss' ? 92 : (e.kind === 'lutin' ? 50 : 62);
  let x = Math.round(clamp(e.x - cx - w / 2, 2, W - w - 2)), y = Math.round(e.y - e.z - top - hh);
  y = Math.max(2, y);
  ctx.fillStyle = '#fffbe8'; ctx.fillRect(x, y, w, hh);
  ctx.fillStyle = '#0a0820';
  ctx.fillRect(x, y - 1, w, 1); ctx.fillRect(x, y + hh, w, 1); ctx.fillRect(x - 1, y, 1, hh); ctx.fillRect(x + w, y, 1, hh);
  const tx = clamp(Math.round(e.x - cx), x + 4, x + w - 6);
  ctx.fillStyle = '#fffbe8'; ctx.fillRect(tx, y + hh, 4, 3); ctx.fillRect(tx + 1, y + hh + 3, 2, 2);
  lines.forEach((l, i) => text(l, x + 4, y + 4 + i * 10, '#1a1030', 'left', 8, null));
}

function drawSnowLayer() {
  ctx.fillStyle = '#eef3ff';
  for (const f of SNOW) ctx.fillRect(Math.round(f.x), Math.round(f.y), f.s, f.s);
}

function bar(x, y, w, h, v, col, back = '#2a1830') {
  ctx.fillStyle = '#0a0820'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = back; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = col; ctx.fillRect(x, y, Math.round(w * clamp(v, 0, 1)), h);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x, y, Math.round(w * clamp(v, 0, 1)), 1);
}

function drawHUD() {
  const h = G.hero;
  text('MARCEL', 6, 5, '#ffd23f');
  bar(6, 15, 90, 6, h.hp / h.maxhp, h.hp > 30 ? '#38f2ff' : '#ff5d73');
  text('x' + G.lives, 100, 14, '#fff');
  text(String(G.score).padStart(7, '0'), W - 6, 5, '#fff', 'right');
  const e = G.lastEnemy;
  if (e && e.kind !== 'boss' && e.hp > 0 && !e.dead) {
    text(e.d.name, W - 6, 15, '#ff9db0', 'right');
    bar(W - 86, 25, 80, 4, e.hp / e.maxhp, '#ff5d73');
  }
  if (G.boss && !G.boss.dead && G.mode !== 'victory') {
    text(G.boss.d.name, W / 2, H - 22, '#ffd23f', 'center');
    bar(W / 2 - 100, H - 11, 200, 5, G.boss.hp / G.boss.maxhp, '#e8562a');
  }
  if (G.goTimer > 0 && Math.floor(G.t * 4) % 2) text('GO ►', W - 50, 90, '#ffd23f', 'left', 16);
  if (G.banner) {
    const b = G.banner, k = Math.min(1, b.t * 3);
    ctx.fillStyle = 'rgba(10,8,32,0.75)'; ctx.fillRect(0, 70, W * k, 50);
    if (b.t > 0.3) { text(b.title, W / 2, 78, '#ff5d73', 'center'); text(b.sub, W / 2, 94, '#ffd23f', 'center', 16); }
  }
  if (paused) {
    ctx.fillStyle = 'rgba(5,5,20,0.6)'; ctx.fillRect(0, 0, W, H);
    text('PAUSE', W / 2, 90, '#fff', 'center', 16); text('Le vin chaud refroidit...', W / 2, 115, '#8a8fb8', 'center');
  }
  if (G.mode === 'gameover') {
    const k = Math.min(1, G.endTimer);
    ctx.fillStyle = `rgba(20,0,10,${0.7 * k})`; ctx.fillRect(0, 0, W, H);
    if (G.endTimer > 0.5) {
      text('GAME OVER', W / 2, 70, '#ff5d73', 'center', 16);
      text('Marcel a fini en choucroute garnie.', W / 2, 100, '#fff', 'center');
      text('Le marché de Noël sera éternel...', W / 2, 114, '#8a8fb8', 'center');
      if (G.endTimer > 2.5 && Math.floor(G.endTimer * 2) % 2) text('ENTRÉE : RÉESSAYER', W / 2, 150, '#ffd23f', 'center');
    }
  }
  if (G.mode === 'victory') {
    const k = Math.min(1, G.endTimer / 1.5);
    if (G.endTimer > 1) {
      ctx.fillStyle = `rgba(5,8,30,${0.75 * k})`; ctx.fillRect(0, 40, W, 128);
      text('KOUGELHOPF VAINCU !', W / 2, 50, '#ffd23f', 'center', 16);
      const lines = ['Le marché de Noël 2026 fermera le 24', 'décembre, comme prévu. Le maire de 2077', 'trépigne dans son hologramme...', '', 'FIN DU NIVEAU 1 (POC)  —  SCORE ' + G.score];
      lines.forEach((l, i) => text(l, W / 2, 78 + i * 12, i === 4 ? '#38f2ff' : '#fff', 'center'));
      if (G.endTimer > 2.5 && Math.floor(G.endTimer * 2) % 2) text('ENTRÉE : RETOUR AU TITRE', W / 2, 150, '#ffd23f', 'center');
    }
  }
  if (Audio.muted) text('SON COUPÉ', 6, H - 12, '#8a8fb8');
}

function renderTitle() {
  const camX = (sceneT * 18) % (META.kleber.w - W);
  drawBackground(camX, sceneT);
  ctx.fillStyle = 'rgba(6,6,30,0.55)'; ctx.fillRect(0, 0, W, H);
  // héros et lutin qui posent
  shadow(110, 196, 14); shadow(280, 196, 10); shadow(318, 196, 13);
  drawSprite('hero', frameOf('hero', 'idle', sceneT, 2.5), 110, 196, 1, { scale: 1 });
  drawSprite('lutin', frameOf('lutin', 'idle', sceneT, 2.5), 280, 196, -1);
  drawSprite('zombie', frameOf('zombie', 'idle', sceneT, 2), 318, 196, -1);
  const bob = Math.round(Math.sin(sceneT * 2) * 2);
  text('STRASBOURG', W / 2, 26 + bob, '#ffd23f', 'center', 24, '#3a0a18');
  text('3000', W / 2, 54 + bob, '#ff5d73', 'center', 24, '#3a0a18');
  text('LA REVANCHE DU MARCHÉ DE NOËL ÉTERNEL', W / 2, 88, '#38f2ff', 'center');
  if (Math.floor(sceneT * 2) % 2) text('APPUIE SUR ENTRÉE', W / 2, 126, '#fff', 'center');
  text('POC — niveau 1 : place Kléber, 2026', W / 2, 204, '#8a8fb8', 'center');
  drawSnowLayer();
}

function renderIntro() {
  ctx.fillStyle = '#07081a'; ctx.fillRect(0, 0, W, H);
  for (const [x, y, p] of STARS) { ctx.fillStyle = '#3a3f78'; ctx.fillRect(x, y * 3, 1, 1); }
  const pg = INTRO[introPage];
  // portrait
  ctx.fillStyle = '#10143a'; ctx.fillRect(16, 40, 96, 120);
  ctx.strokeStyle = pg.who === 'mayor' ? '#ff5d73' : '#38f2ff'; ctx.lineWidth = 2; ctx.strokeRect(16, 40, 96, 120);
  if (pg.who === 'mayor') drawSprite('mayor', META.mayor.anims.evil[0] + (Math.floor(sceneT * 3) % 2), 64, 160, 1, { scale: 1.6 });
  else drawSprite('hero', frameOf('hero', introPage === 3 ? 'win' : 'idle', sceneT, 2.5), 64, 160, 1, { scale: 1.6 });
  text(pg.who === 'mayor' ? 'K.VON LEBKUCHEN' : 'MARCEL BRETZEL', 64, 166, pg.who === 'mayor' ? '#ff5d73' : '#38f2ff', 'center');
  text(pg.title, 128, 40, '#ffd23f');
  const shown = pg.txt.slice(0, Math.floor(sceneT * 45));
  wrap(shown, 30).forEach((l, i) => text(l, 128, 60 + i * 13, '#fff'));
  if (Math.floor(sceneT * 45) % 3 === 0 && sceneT * 45 < pg.txt.length) Audio.play('text');
  if (sceneT * 45 >= pg.txt.length && Math.floor(sceneT * 2) % 2) text('ENTRÉE ►', W - 12, H - 16, '#ffd23f', 'right');
  text((introPage + 1) + '/' + INTRO.length, 12, H - 16, '#8a8fb8');
}

// ------------------------------------------------------------ démarrage
Promise.all([
  ...SHEETS.map(k => load('assets/' + META[k].img).then(i => { IMG[k] = i; IMG[k + '_w'] = tinted(i, '#ffffff', 0.85); })),
  load('assets/' + META.kleber.img).then(i => IMG.kleber = i),
  document.fonts ? document.fonts.load('8px "Press Start 2P"').catch(() => 0) : 0
]).then(() => {
  IMG.mayor_h = tinted(IMG.mayor, '#38f2ff', 0.55);
  scene = 'title'; sceneT = 0;
}).catch(err => { scene = 'loading'; console.error(err); });
requestAnimationFrame(frame);

// accès debug
window.S3K = {
  get G() { return G; }, get scene() { return scene; }, keys, pressed,
  start() { scene = 'game'; newGame(); },
  step(n) { for (let i = 0; i < n; i++) { tick(1 / 60); for (const k in pressed) pressed[k] = false; } render(); }
};
})();
