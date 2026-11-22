// Progression de la campagne (partie 1 : niveaux 1 à 6) : niveau atteint, objets, munitions des flèches, compagnons.
// Sauvegarde locale ('s3k.save', avec try/catch : le jeu marche sans stockage). Un niveau demandé par ?level=<id>
// (debug, tests) ne touche jamais à la sauvegarde. Fin de niveau : complete(texte) → sauvegarde → écran de fin
// → {ok} : niveau suivant (la page se recharge sur la sauvegarde). Titre : {ok} continuer, {back} nouvelle partie.
// Dernier niveau de la campagne : écran « Partie 1 terminée — À suivre » + crédits, {ok} : retour au titre.
const KEY = 's3k.save';

export class Progress {
  static load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  static clear() { try { localStorage.removeItem(KEY); } catch (e) { /* pas de stockage */ } }

  // campaign : ids des niveaux dans l'ordre ; items : { id: classe } ; save : sauvegarde reprise (ou null)
  constructor(game, { id, campaign, items, save = null }) {
    this.game = game; this.id = id; this.campaign = campaign; this.items = items; this.fromSave = save;
  }
  get next() { const i = this.campaign.indexOf(this.id); return i >= 0 ? this.campaign[i + 1] || null : null; }
  write(data) { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* pas de stockage */ } }

  // ce que l'Ultra emporte d'un niveau à l'autre
  snapshot() {
    const inv = this.game.inventory;
    return {
      items: Object.keys(inv.items || {}),
      ammo: { ...(inv.items?.arc?.ammo || {}) },
      companions: [...(this.game.companions?.owned || [])]
    };
  }
  // au lancement d'un niveau repris depuis la sauvegarde : on rend objets, flèches et compagnons
  restore() {
    const s = this.fromSave; if (!s) return;
    const inv = this.game.inventory;
    for (const id of s.items || []) if (!inv.has(id) && this.items[id]) inv.give(new this.items[id](this.game));
    if (inv.items?.arc && s.ammo) for (const [t, n] of Object.entries(s.ammo)) inv.items.arc.ammo[t] = n;
    inv.refresh?.();
    if (s.companions?.length) this.game.events.emit('progress:companions', s.companions); // pour systems/Companions
  }
  // fin de niveau (hors debug) : sauvegarde du niveau suivant, écran de fin, puis {ok} : niveau suivant
  complete(text) {
    const g = this.game, next = this.next;
    if (this.campaign.includes(this.id)) this.write({ level: next || this.id, done: !next, ...this.snapshot() });
    g.win(text);
    g.nextLevel = next;
    if (next) this.endLine('next', g.prompts.format(g.texts.nextLevel));
    else if (this.id === this.campaign[this.campaign.length - 1]) this.partEnd();
  }
  // ligne ajoutée à l'écran de fin (classe css)
  endLine(cls, html) {
    const end = this.game.dom.end;
    let el = end.querySelector('.' + cls);
    if (!el) { el = document.createElement(cls === 'credits' ? 'div' : 'p'); el.className = cls; end.appendChild(el); }
    el.innerHTML = html;
  }
  // fin de la partie 1 : « Partie 1 terminée — À suivre », crédits courts, {ok} : retour au titre
  partEnd() {
    const g = this.game, P = g.texts.partEnd, end = g.dom.end;
    g.partEnd = true;
    end.querySelector('h1').textContent = P.title; end.querySelector('p').textContent = P.sub;
    this.endLine('credits', [g.texts.title, ...P.credits].map(t => `<p>${t}</p>`).join(''));
    this.endLine('next', g.prompts.format(P.back));
  }
  // recharge la page sur la sauvegarde (garde ?debug, ?seed... mais pas ?level)
  goto() {
    const p = new URLSearchParams(location.search); p.delete('level');
    location.search = p.toString();
  }
  newGame() { Progress.clear(); this.goto(); }
}
