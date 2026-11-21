// Textes des menus (titre, pause, passer, écran « Commandes ») rendus avec les icônes de l'appareil utilisé,
// et l'écran « Commandes » lui-même : ouvert depuis le titre ou la pause avec {use}, fermé avec {back}.
export class Menus {
  constructor(game, dom) {
    this.game = game; this.dom = dom; this.open = false;
    game.events.on('input:device', () => this.render());
    this.render();
  }
  render() {
    const g = this.game, T = g.texts, f = t => g.prompts.format(t), $ = s => this.dom.title.parentNode.querySelector(s);
    $('#title .controls').innerHTML = f(T.controls);
    $('#title .go').innerHTML = f(T.pressStart);
    $('#pause .hint').innerHTML = f(T.pauseHint.replace('{state}', T.rumbleState[g.input.rumbleOn ? 1 : 0]));
    this.dom.skip.innerHTML = f(T.skip);
    if (this.open) this.renderCommands();
  }
  // deux colonnes : clavier/souris et manette (Xbox par défaut, PlayStation si c'est la manette branchée)
  renderCommands() {
    const g = this.game, C = g.texts.commands, P = g.prompts, pad = g.input.padType;
    const el = this.dom.commands;
    el.querySelector('h2').textContent = C.title;
    el.querySelector('table').innerHTML = `<tr><th></th><th>${C.kb}</th><th>${C.pad}</th></tr>` +
      C.rows.map(([a, what]) => `<tr><td class="what">${what}</td><td>${P.icon(a, 'kb')}</td><td>${P.icon(a, pad)}</td></tr>`).join('');
    el.querySelector('.close').innerHTML = P.format(C.close);
  }
  // renvoie true tant que l'écran « Commandes » est ouvert (le reste du jeu attend)
  update() {
    const g = this.game, I = g.input;
    if (!this.open) {
      if (I.pressed.use && (g.mode === 'title' || g.mode === 'paused')) {
        this.open = true; this.renderCommands(); this.dom.commands.style.display = 'flex';
        return true;
      }
      return false;
    }
    if (I.pressed.back || I.pressed.use || I.pressed.pause) { this.open = false; this.dom.commands.style.display = 'none'; }
    return true;
  }
}
