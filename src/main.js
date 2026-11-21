// Point d'entrée : choisit le niveau (?level=<id>), branche le DOM, charge ses modèles et lance le jeu.
import { Game } from './Game.js';
import { LEVELS, DEFAULT_LEVEL } from './levels/index.js';
import { TEXTS } from './data/texts.fr.js';
import { installDebug } from './debug.js';

const id = new URLSearchParams(location.search).get('level');
const level = LEVELS[id] || LEVELS[DEFAULT_LEVEL];

const $ = s => document.querySelector(s);
const dom = {
  canvas: $('#c'), stage: $('#stage'), hud: $('#hud'), dialog: $('#dialog'), bubbles: $('#bubbles'),
  title: $('#title'), pause: $('#pause'), end: $('#end')
};
$('#title h1').textContent = TEXTS.title;
$('#title h2').textContent = level.subtitle;
$('#title .controls').innerHTML = TEXTS.controls;
$('#title .go').textContent = TEXTS.pressStart;
$('#pause .hint').textContent = TEXTS.pauseHint;

const game = new Game(dom, level.types);
game.start(level.models, level) // seuls les modèles de ce niveau sont décodés
  .catch(err => { console.error(err); document.body.insertAdjacentHTML('beforeend', `<pre class="err">${err}</pre>`); });
window.S3K = game; // accès debug depuis la console
installDebug(game); // raccourcis ?debug=1
