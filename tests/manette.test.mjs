// Test manette sans matériel : simule navigator.getGamepads() (Xbox puis PlayStation).
// Vérifie : déplacement, attaque, interaction avec une borne, indications qui suivent l'appareil, pause au débranchement.
import { launch, checker, PADS } from './helpers.mjs';

const T = checker('manette');
const { browser, page, h } = await launch(T, { query: 'debug=1&seed=1', pad: 'xbox' });
const promptBtn = () => h.run(() => document.querySelector('#prompt img.glyph')?.dataset.btn || null);

// ouverture → titre → jeu, uniquement à la manette (A)
await h.btn(0); T.check('A passe l\'ouverture', (await h.state()).mode === 'title');
T.check('titre : icône Xbox « A »', await h.run(() => document.querySelector('#title .go img')?.dataset.btn) === 'A');
await h.btn(0); await h.skipDialogs(true);
T.check('A lance la partie', (await h.state()).mode === 'play');

// déplacement au stick gauche
const s0 = await h.state();
await h.run(() => { window.__pad.axes[1] = -1; }); await h.wait(600); await h.run(() => { window.__pad.axes[1] = 0; }); await h.wait(100);
const s1 = await h.state();
T.check('stick gauche : l\'Ultra avance', s1.z < s0.z - 2, `z ${s0.z.toFixed(1)} → ${s1.z.toFixed(1)}`);

// attaque (X)
await h.run(() => { const b = window.__pad.buttons[2]; b.pressed = true; b.value = 1; }); await h.wait(60);
T.check('X : coup d\'écharpe', (await h.state()).st === 'attack');
await h.run(() => { const b = window.__pad.buttons[2]; b.pressed = false; b.value = 0; }); await h.wait(400);

// interaction avec une borne (debug F2 : énigme prête), indication « Y »
await h.warp();
const goToBorne = i => h.run(i => { const g = window.S3K, b = g.entities.filter(e => e.isSwitch && e.group === 'bornes')[i];
  Object.assign(g.player, { x: b.x + b.fx * 1.6, z: b.z + b.fz * 1.6 }); }, i);
await goToBorne(0); await h.wait(200);
T.check('indication manette Xbox : Y', await promptBtn() === 'Y', String(await promptBtn()));
await h.btn(3);
T.check('Y : la borne s\'allume', await h.run(() => window.S3K.entities.filter(e => e.isSwitch && e.group === 'bornes')[0].on));

// changement d'appareil : clavier puis PlayStation
await goToBorne(1); await h.wait(200);
await h.key('KeyD', 60); await goToBorne(1); await h.wait(200);
T.check('indication clavier : E', await promptBtn() === 'E', String(await promptBtn()));
await h.run(id => { window.__pad.id = id; }, PADS.ps);
await h.run(() => { window.__pad.axes[2] = 0.6; }); await h.wait(150); await h.run(() => { window.__pad.axes[2] = 0; }); await h.wait(150);
T.check('indication PlayStation : △', await promptBtn() === '△', String(await promptBtn()));

// débranchement en jeu → pause automatique
await h.run(() => { window.__pad.connected = false; }); await h.wait(300);
T.check('manette débranchée : pause', (await h.state()).mode === 'paused');

await T.finish(browser);
