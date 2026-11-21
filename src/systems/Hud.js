// Interface HTML : bretzels de vie, nom de zone, barre de boss, bandeaux, indication d'action, sous-titres.
export class Hud {
  constructor(root, events, texts) {
    this.texts = texts;
    this.hearts = root.querySelector('#hearts');
    this.room = root.querySelector('#room');
    this.boss = root.querySelector('#boss');
    this.bossName = root.querySelector('#bossname');
    this.bossFill = root.querySelector('#bossfill');
    this.bannerEl = root.querySelector('#banner');
    this.flashEl = root.querySelector('#flash');
    this.promptEl = root.querySelector('#prompt');
    this.captionEl = root.querySelector('#caption');
    this.itemEl = root.querySelector('#item');
    this.fadeEl = root.querySelector('#fade'); this.glitchEl = root.querySelector('#glitch');
    events.on('hud:fade', a => { this.fadeEl.style.opacity = a; });
    events.on('hud:cinema', on => root.classList.toggle('cinema', on)); // cinématique : HUD de jeu masqué
    events.on('hud:glitch', on => this.glitch(on));
    this.lastHearts = '';
    // indication contextuelle (« E : pirater »...) : (source, texte) pour l'afficher, (source, null) pour la retirer
    this.promptOwner = null;
    events.on('hud:prompt', (owner, text) => this.prompt(owner, text));
    events.on('inventory:changed', it => {
      const [name, keys] = this.texts.items[it.id];
      this.itemEl.innerHTML = `${name}<small>${keys}</small>`; this.itemEl.style.display = 'block';
    });
    events.on('hud:caption', text => { this.captionEl.textContent = text || ''; this.captionEl.style.display = text ? 'block' : 'none'; });
  }
  prompt(owner, text) {
    if (!text && owner !== this.promptOwner) return; // une autre source a pris la main entre-temps
    this.promptOwner = text ? owner : null;
    this.promptEl.textContent = text || '';
    this.promptEl.style.display = text ? 'block' : 'none';
  }
  // pluie de caractères (branchement de force sur le Serveur central)
  glitch(on) {
    clearInterval(this.gt); this.glitchEl.style.display = on ? 'block' : 'none';
    if (!on) return;
    const c = this.glitchEl, g = c.getContext('2d'), cols = Array.from({ length: 40 }, () => Math.random() * 30);
    c.width = 160; c.height = 90;
    this.gt = setInterval(() => {
      g.fillStyle = 'rgba(5,5,20,0.25)'; g.fillRect(0, 0, c.width, c.height);
      g.font = '6px monospace';
      cols.forEach((y, i) => {
        g.fillStyle = Math.random() < 0.1 ? '#ff2e88' : '#38f2ff';
        g.fillText(String.fromCharCode(0x30 + Math.random() * 60 | 0), i * 4, y * 3);
        cols[i] = y > 30 || Math.random() < 0.02 ? 0 : y + 1;
      });
    }, 40);
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
