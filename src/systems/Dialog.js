// File de dialogues à machine à écrire (HTML). Bloque le jeu tant qu'une réplique est ouverte.
export class Dialog {
  constructor(game, el) {
    this.game = game; this.el = el; this.queue = []; this.cur = null; this.t = 0;
    this.who = el.querySelector('.who'); this.txt = el.querySelector('.txt'); this.next = el.querySelector('.next');
  }
  say(lines, onDone) {
    const arr = Array.isArray(lines) ? lines : [lines];
    arr.forEach((l, i) => this.queue.push({ ...l, onDone: i === arr.length - 1 ? onDone : null }));
  }
  get active() { return !!this.cur || this.queue.length > 0; }
  update(dt, input) {
    if (!this.cur && this.queue.length) {
      this.cur = this.queue.shift(); this.t = 0;
      this.el.style.display = 'block'; this.who.textContent = this.cur.who;
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
