// File de dialogues à machine à écrire (HTML). Bloque le jeu tant qu'une réplique est ouverte.
// Répliques du registre (data/dialogues/) : sayIds([...ids]). Avec ?debug=1, une réplique 'draft' porte un badge BROUILLON.
import { line } from '../data/dialogues/index.js';

export class Dialog {
  constructor(game, el) {
    this.game = game; this.el = el; this.queue = []; this.cur = null; this.t = 0;
    this.who = el.querySelector('.who'); this.txt = el.querySelector('.txt'); this.next = el.querySelector('.next');
    this.debug = new URLSearchParams(location.search).get('debug') === '1';
    // badge « BROUILLON » créé ici (pas dans index.html) : visible seulement en debug, sur les répliques non validées
    this.badge = document.createElement('div');
    this.badge.className = 'badge'; this.badge.textContent = game.texts.draftBadge;
    Object.assign(this.badge.style, { position: 'absolute', right: '1em', top: '.5em', display: 'none', fontSize: '.6em',
      padding: '.2em .5em', color: '#1a1030', background: '#ffd23f', border: '.15em solid #000' });
    el.appendChild(this.badge);
  }
  // répliques du registre par identifiant
  sayIds(ids, onDone) { this.say(ids.map(line), onDone); }
  say(lines, onDone) {
    const arr = Array.isArray(lines) ? lines : [lines];
    arr.forEach((l, i) => this.queue.push({ ...l, onDone: i === arr.length - 1 ? onDone : null }));
  }
  get active() { return !!this.cur || this.queue.length > 0; }
  update(dt, input) {
    if (!this.cur && this.queue.length) {
      this.cur = this.queue.shift(); this.t = 0;
      // jetons d'actions ({use}...) -> libellé de l'appareil utilisé (E, Y, △...)
      if (this.game.prompts) this.cur = { ...this.cur, txt: this.game.prompts.format(this.cur.txt, 'text') };
      this.el.style.display = 'block'; this.who.textContent = this.cur.who;
      this.badge.style.display = this.debug && this.cur.status === 'draft' ? 'block' : 'none';
    }
    if (!this.cur) return false;
    const before = Math.floor(this.t * 50);
    this.t += dt;
    const n = Math.floor(this.t * 50), len = this.cur.txt.length;
    if (n !== before && n < len && n % 3 === 0) this.game.audio.play('text');
    this.txt.textContent = this.cur.txt.slice(0, n);
    this.next.style.display = n >= len ? 'block' : 'none';
    if (input.pressed.ok || input.pressed.attack || input.pressed.use) {
      if (n < len) this.t = 999;
      else {
        const done = this.cur.onDone; this.cur = null;
        if (!this.queue.length) this.el.style.display = 'none';
        done?.();
      }
    }
    return true;
  }
}
