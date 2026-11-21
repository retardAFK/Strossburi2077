// WebAudio : bruitages et musiques chiptune originales, décrits par des données.
const f = n => 440 * Math.pow(2, (n - 69) / 12);

// Chaque bruitage : liste de "voix" { t: décalage, tone|noise, ... }
const SFX = {
  whip: [{ noise: 0.1, vol: 0.14, hp: 2500 }, { tone: 900, dur: 0.08, type: 'triangle', vol: 0.05, slide: 2 }],
  hit: [{ noise: 0.08, vol: 0.3, hp: 500 }, { tone: 160, dur: 0.12, type: 'square', vol: 0.12, slide: 0.4 }],
  heavy: [{ noise: 0.25, vol: 0.4, hp: 120 }, { tone: 80, dur: 0.3, type: 'sawtooth', vol: 0.14, slide: 0.4 }],
  ting: [{ tone: 1800, dur: 0.25, type: 'square', vol: 0.06 }, { tone: 2400, dur: 0.2, type: 'sine', vol: 0.05 }],
  hurt: [{ tone: 500, dur: 0.25, type: 'square', vol: 0.12, slide: 0.3 }],
  roll: [{ noise: 0.2, vol: 0.08, hp: 800 }],
  throw: [{ tone: 700, dur: 0.15, type: 'triangle', vol: 0.07, slide: 0.5 }],
  pickup: [72, 76, 79, 84].map((n, i) => ({ t: i * 0.06, tone: f(n), dur: 0.12, type: 'square', vol: 0.07 })),
  laser: [{ tone: 300, dur: 0.6, type: 'sawtooth', vol: 0.08, slide: 0.2 }, { noise: 0.3, vol: 0.1, hp: 3000 }],
  door: [{ noise: 0.8, vol: 0.15, hp: 120 }, { tone: 70, dur: 0.8, type: 'sawtooth', vol: 0.08, slide: 0.6 }],
  slam: [{ noise: 0.5, vol: 0.45, hp: 60 }, { tone: 55, dur: 0.5, type: 'square', vol: 0.16, slide: 0.5 }],
  text: [{ tone: 1100, dur: 0.02, type: 'square', vol: 0.025 }],
  die: [64, 60, 57, 52].map((n, i) => ({ t: i * 0.15, tone: f(n), dur: 0.2, type: 'square', vol: 0.08 })),
  win: [69, 72, 76, 81, 76, 81, 84].map((n, i) => ({ t: i * 0.12, tone: f(n), dur: 0.22, type: 'square', vol: 0.08 }))
};
// Musiques : boucle de notes (0 = silence) + basse + tempo (durée d'un pas)
const MUSIC = {
  coursive: { step: 0.15, lead: [64, 0, 67, 0, 71, 0, 67, 69, 0, 67, 64, 0, 62, 0, 64, 0, 64, 0, 67, 0, 71, 0, 74, 72, 0, 71, 67, 0, 69, 0, 0, 0],
    bass: [40, 40, 52, 40, 43, 43, 55, 43, 45, 45, 57, 45, 38, 38, 50, 38], drums: true },
  boss: { step: 0.13, lead: [57, 57, 60, 57, 63, 62, 60, 58, 57, 57, 60, 64, 65, 64, 62, 58],
    bass: [33, 33, 45, 33, 36, 36, 48, 36], drums: true, heavy: true }
};

export class Audio {
  constructor() { this.ac = null; this.muted = false; this.song = null; this.nt = 0; this.step = 0; this.noiseBuf = null; }
  unlock() {
    if (this.ac) { if (this.ac.state === 'suspended') this.ac.resume(); return; }
    try {
      this.ac = new AudioContext();
      this.master = this.ac.createGain(); this.master.gain.value = 0.45; this.master.connect(this.ac.destination);
      setInterval(() => this.schedule(), 50);
    } catch (e) { this.ac = null; }
  }
  tone(fr, t, d, type, v, slide) {
    const o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type; o.frequency.setValueAtTime(fr, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, fr * slide), t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + d);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + d + 0.02);
  }
  noise(t, d, v, hp) {
    const ac = this.ac;
    if (!this.noiseBuf) {
      this.noiseBuf = ac.createBuffer(1, ac.sampleRate / 2, ac.sampleRate);
      const a = this.noiseBuf.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1;
    }
    const s = ac.createBufferSource(), g = ac.createGain(), fl = ac.createBiquadFilter();
    s.buffer = this.noiseBuf; fl.type = 'highpass'; fl.frequency.value = hp;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0008, t + d);
    s.connect(fl); fl.connect(g); g.connect(this.master); s.start(t); s.stop(t + d);
  }
  play(name) {
    if (!this.ac || this.muted || !SFX[name]) return;
    const t0 = this.ac.currentTime;
    for (const v of SFX[name]) {
      const t = t0 + (v.t || 0);
      if (v.noise) this.noise(t, v.noise, v.vol, v.hp); else this.tone(v.tone, t, v.dur, v.type, v.vol, v.slide);
    }
  }
  music(name) { this.song = name ? MUSIC[name] : null; this.step = 0; if (this.ac) this.nt = this.ac.currentTime + 0.05; }
  schedule() {
    const m = this.song; if (!this.ac || !m || this.muted) return;
    while (this.nt < this.ac.currentTime + 0.2) {
      const i = this.step, n = m.lead[i % m.lead.length];
      if (n) this.tone(f(n), this.nt, m.step * 1.5, 'square', 0.045);
      if (i % 2 === 0) { const b = m.bass[(i / 2) % m.bass.length | 0]; this.tone(f(b), this.nt, m.step * 1.8, 'triangle', 0.15); }
      if (m.drums) {
        if (i % 4 === 0) this.tone(70, this.nt, 0.12, 'sine', m.heavy ? 0.3 : 0.22, 0.4);
        if (i % 4 === 2) this.noise(this.nt, 0.08, 0.1, 1500);
        if (i % 2 === 1) this.noise(this.nt, 0.03, 0.04, 7000);
      }
      this.nt += m.step; this.step++;
    }
  }
  toggleMute() { this.muted = !this.muted; if (this.master) this.master.gain.value = this.muted ? 0 : 0.45; }
}
