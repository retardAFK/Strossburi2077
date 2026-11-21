// Point d'entrée : choisit le niveau (?level=<id>), branche le DOM, charge ses modèles et lance le jeu.
import { Game } from './Game.js';
import { LEVELS, DEFAULT_LEVEL, CAMPAIGN } from './levels/index.js';
import { ITEMS } from './items/index.js';
import { Progress } from './systems/Progress.js';
import { TEXTS } from './data/texts.fr.js';
import { installDebug } from './debug.js';
import { setupTouch, touchWanted } from './touch.js';
import { installFakePad } from './fakepad.js';
import { showInstallScreen } from './install.js';
import { seed } from './core/Random.js';

installFakePad(); // ?debug=1&fakepad=xbox|ps : manette virtuelle au pavé numérique

const params = new URLSearchParams(location.search);
if (params.has('seed')) seed(params.get('seed')); // ?seed=<n> : partie reproductible (tests)
const asked = LEVELS[params.get('level')]; // un niveau « debugOnly » (bac à sable) exige ?debug=1
// sans ?level : on reprend la sauvegarde (niveau atteint, objets, flèches) s'il y en a une
const save = !params.get('level') ? Progress.load() : null, saved = save && LEVELS[save.level] ? save : null;
const levelId = asked && (!asked.debugOnly || params.get('debug') === '1') ? params.get('level') : saved ? saved.level : DEFAULT_LEVEL;
const level = LEVELS[levelId];
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
game.progress = new Progress(game, { id: levelId, campaign: CAMPAIGN, items: ITEMS, save: saved });
if (touch) {
  setupTouch(game, dom);
  // mobile dans le navigateur : on propose d'abord d'installer le jeu (?install=0 pour passer, en test)
  if (params.get('install') !== '0') showInstallScreen(() => game.audio.unlock());
}
game.start(level.models, level) // seuls les modèles de ce niveau sont décodés
  .catch(err => { console.error(err); document.body.insertAdjacentHTML('beforeend', `<pre class="err">${err}</pre>`); });
window.S3K = game; // accès debug depuis la console
// PWA : installable (écran d'accueil) et jouable hors-ligne une fois chargée ; rien en double-clic (file://)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
installDebug(game); // raccourcis ?debug=1

// 'a.b.0.c' -> obj.a.b[0].c = value (ignore les chemins absents)
function setPath(obj, path, value) {
  const keys = path.split('.'), last = keys.pop();
  const parent = keys.reduce((o, k) => (o == null ? o : o[k]), obj);
  if (parent != null && last in parent) parent[last] = value;
}
