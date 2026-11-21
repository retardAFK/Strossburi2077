// Interface HTML : bretzels de vie, nom de zone, barre de boss, bandeaux.
export class Hud {
  constructor(root) {
    this.hearts = root.querySelector('#hearts');
    this.room = root.querySelector('#room');
    this.boss = root.querySelector('#boss');
    this.bossName = root.querySelector('#bossname');
    this.bossFill = root.querySelector('#bossfill');
    this.bannerEl = root.querySelector('#banner');
    this.flashEl = root.querySelector('#flash');
    this.lastHearts = '';
  }
  setHealth(hp, max) {
    let html = '';
    for (let i = 0; i < max / 2; i++) {
      const v = hp - i * 2;
      html += `<div class="heart${v <= 0 ? ' empty' : (v === 1 ? ' half' : '')}"></div>`;
    }
    if (html !== this.lastHearts) { this.hearts.innerHTML = html; this.lastHearts = html; }
  }
  setRoom(name) { this.room.textContent = name; }
  showBoss(name) { this.boss.style.display = name ? 'block' : 'none'; if (name) this.bossName.textContent = name; }
  setBoss(ratio) { this.bossFill.style.width = Math.max(0, ratio) * 100 + '%'; }
  banner(title, sub = '', dur = 2.5) {
    this.bannerEl.innerHTML = title + (sub ? `<small>${sub}</small>` : '');
    this.bannerEl.style.display = 'block';
    clearTimeout(this.bt); this.bt = setTimeout(() => (this.bannerEl.style.display = 'none'), dur * 1000);
  }
  flash(a = 0.5) {
    const f = this.flashEl; f.style.transition = 'none'; f.style.opacity = a;
    requestAnimationFrame(() => { f.style.transition = 'opacity .35s'; f.style.opacity = 0; });
  }
}
