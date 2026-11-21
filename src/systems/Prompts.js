// Indications de commandes qui suivent le DERNIER appareil utilisé : clavier/souris, manette Xbox ou PlayStation.
// Les textes portent des jetons d'actions abstraites ({use}, {attack}...) remplacés au moment de l'affichage :
//   format(texte, 'html') → icônes dessinées en canvas (HUD, menus) ; format(texte, 'text') → libellés (dialogues).
// Icônes génériques (pas d'images officielles) : touche stylisée, rond coloré + lettre, symboles △ ○ ✕ □.
// Émet 'input:device' (appareil) quand on change d'appareil, et 'input:notice' (texte | null) pour une manette non reconnue.
const COLORS = {
  xbox: { A: '#3fae49', B: '#d7263d', X: '#2f6fdf', Y: '#e5b800' },
  ps: { '△': '#2fbfa0', '○': '#e3485a', '✕': '#5f8ee8', '□': '#d77ad6' }
};

export class Prompts {
  constructor(game, glyphs) {
    this.game = game; this.glyphs = glyphs; this.cache = {}; this.dev = 'kb'; this.notice = false;
  }
  // appareil courant : 'kb', 'xbox' ou 'ps'
  get device() { const I = this.game.input; return I.device === 'pad' ? I.padType : 'kb'; }
  update() {
    const d = this.device, I = this.game.input;
    if (d !== this.dev) { this.dev = d; this.game.events.emit('input:device', d); }
    if (I.padUnknown !== this.notice) { this.notice = I.padUnknown; this.game.events.emit('input:notice', this.notice ? this.game.texts.padUnknown : null); }
  }
  label(action, dev = this.dev) { return this.glyphs[dev][action] ?? action; }
  format(text, mode = 'html', dev = this.dev) {
    return String(text).replace(/\{(\w+)\}/g, (m, a) => {
      if (!(a in this.glyphs.kb)) return m; // jeton inconnu ({t}...) : on laisse tel quel
      return mode === 'html' ? this.icon(a, dev) : this.label(a, dev);
    });
  }
  icon(action, dev = this.dev) {
    const label = this.label(action, dev), key = dev + ':' + label;
    if (!this.cache[key]) this.cache[key] = this.draw(label, dev);
    return `<img class="glyph" src="${this.cache[key]}" alt="${label}" data-btn="${label}">`;
  }
  // dessin pixelisé de l'icône (rond pour les boutons de façade, touche arrondie sinon)
  draw(label, dev) {
    const round = dev !== 'kb' && [...label].length === 1;
    const c = document.createElement('canvas'), g = c.getContext('2d');
    g.font = 'bold 11px monospace';
    const w = round ? 16 : Math.max(16, Math.ceil(g.measureText(label).width) + 8); c.width = w; c.height = 16;
    g.font = 'bold 11px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    if (round) {
      const col = COLORS[dev][label] || '#9aa3b8';
      g.fillStyle = dev === 'ps' ? '#14151f' : col; g.beginPath(); g.arc(8, 8, 7.5, 0, Math.PI * 2); g.fill();
      g.fillStyle = dev === 'ps' ? col : '#ffffff'; g.fillText(label, 8, 8.5);
    } else {
      g.fillStyle = dev === 'kb' ? '#e8e4ee' : '#2a2d40'; g.fillRect(1, 1, w - 2, 14); g.fillRect(0, 2, w, 12);
      g.fillStyle = dev === 'kb' ? '#9a92ac' : '#14151f'; g.fillRect(1, 13, w - 2, 2);
      g.fillStyle = dev === 'kb' ? '#1a1030' : '#ffffff'; g.fillText(label, w / 2, 7.5);
    }
    return c.toDataURL();
  }
}
