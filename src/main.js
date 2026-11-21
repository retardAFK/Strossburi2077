// Point d'entrée : branche le DOM, les modèles Blender et le niveau, puis lance le jeu.
import { Game } from './Game.js';
import { Consultant } from './entities/enemies/Consultant.js';
import { Juriste } from './entities/enemies/Juriste.js';
import { Directeur } from './entities/bosses/Directeur.js';
import { Terminal } from './entities/props/Terminal.js';
import layout from './levels/meinau-ouest/layout.js';
import script from './levels/meinau-ouest/script.js';
import { TEXTS } from './data/texts.fr.js';

// modèles exportés par tools/blender/*.py (embarqués dans le build par esbuild)
import ultra from '../assets/models/ultra.glb';
import consultant from '../assets/models/consultant.glb';
import juriste from '../assets/models/juriste.glb';
import directeur from '../assets/models/directeur.glb';
import drone from '../assets/models/drone.glb';
import terminal from '../assets/models/terminal.glb';
import portique from '../assets/models/portique.glb';

const $ = s => document.querySelector(s);
const dom = {
  canvas: $('#c'), stage: $('#stage'), hud: $('#hud'), dialog: $('#dialog'), bubbles: $('#bubbles'),
  title: $('#title'), pause: $('#pause'), end: $('#end')
};
$('#title h1').textContent = TEXTS.title;
$('#title h2').textContent = TEXTS.subtitle;
$('#title .controls').innerHTML = TEXTS.controls;
$('#title .go').textContent = TEXTS.pressStart;

const game = new Game(dom, { consultant: Consultant, juriste: Juriste, directeur: Directeur, terminal: Terminal });
game.start({ ultra, consultant, juriste, directeur, drone, terminal, portique }, { layout, script })
  .catch(err => { console.error(err); document.body.insertAdjacentHTML('beforeend', `<pre class="err">${err}</pre>`); });
window.S3K = game; // accès debug depuis la console
