// Point d'entrée : choisit le niveau (?level=<id>), branche le DOM, charge ses modèles et lance le jeu.
import { Game } from './Game.js';
import { LEVELS, DEFAULT_LEVEL } from './levels/index.js';
import { TEXTS } from './data/texts.fr.js';
import { installDebug } from './debug.js';
import { setupTouch, touchWanted } from './touch.js';
import { installFakePad } from './fakepad.js';

installFakePad(); // ?debug=1&fakepad=xbox|ps : manette virtuelle au pavé numérique

const params = new URLSearchParams(location.search);
const level = LEVELS[params.get('level')] || LEVELS[DEFAULT_LEVEL];
const touch = touchWanted(params); // téléphone / tablette, ou ?touch=1 pour tester sur ordinateur
if (touch) for (const [path, txt] of TEXTS.touch.overrides) setPath(TEXTS, path, txt);

const $ = s => document.querySelector(s);
const dom = {
  canvas: $('#c'), stage: $('#stage'), hud: $('#hud'), dialog: $('#dialog'), bubbles: $('#bubbles'),
  title: $('#title'), pause: $('#pause'), end: $('#end'), skip: $('#skip'), commands: $('#commands')
};
$('#title h1').textContent = TEXTS.title;
$('#title h2').textContent = level.subtitle;
$('#title .controls').innerHTML = TEXTS.controls;
$('#title .go').textContent = TEXTS.pressStart;
$('#pause .hint').textContent = TEXTS.pauseHint;

const game = new Game(dom, level.types);
if (touch) setupTouch(game, dom);
game.start(level.models, level) // seuls les modèles de ce niveau sont décodés
  .catch(err => { console.error(err); document.body.insertAdjacentHTML('beforeend', `<pre class="err">${err}</pre>`); });
window.S3K = game; // accès debug depuis la console
installDebug(game); // raccourcis ?debug=1

// 'a.b.0.c' -> obj.a.b[0].c = value (ignore les chemins absents)
function setPath(obj, path, value) {
  const keys = path.split('.'), last = keys.pop();
  const parent = keys.reduce((o, k) => (o == null ? o : o[k]), obj);
  if (parent != null && last in parent) parent[last] = value;
}
