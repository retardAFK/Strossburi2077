// Test manette sans matériel : simule navigator.getGamepads() (Xbox puis PlayStation) dans le Chrome installé.
// Vérifie : déplacement, attaque, interaction avec une borne, indications qui suivent l'appareil, pause au débranchement.
// Lancer : npm run build && npm run test:pad   (dépendance de dev : playwright-core, aucun navigateur téléchargé)
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const URL = pathToFileURL(resolve('dist/index.html')).href + '?debug=1';
const XBOX = 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)';
const PS = 'DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)';
let failures = 0;
const check = (name, ok, info = '') => { console.log(`${ok ? 'OK  ' : 'ÉCHEC'} ${name}${info ? ' — ' + info : ''}`); if (!ok) failures++; };

const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
const page = await browser.newPage();
page.on('pageerror', e => { console.log('ERREUR page :', e.message); failures++; });
// manette simulée, pilotable depuis le test via window.__pad
await page.addInitScript(id => {
  window.__pad = { id, index: 0, connected: true, mapping: 'standard', timestamp: 0,
    buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })), axes: [0, 0, 0, 0] };
  navigator.getGamepads = () => [window.__pad.connected ? window.__pad : null];
}, XBOX);
await page.goto(URL);
await page.waitForFunction(() => window.S3K?.world && window.S3K.mode === 'cutscene', null, { timeout: 30000 });

const wait = ms => page.waitForTimeout(ms);
const btn = async (i, ms = 120) => {
  await page.evaluate(i => { const b = window.__pad.buttons[i]; b.pressed = true; b.value = 1; }, i); await wait(ms);
  await page.evaluate(i => { const b = window.__pad.buttons[i]; b.pressed = false; b.value = 0; }, i); await wait(120);
};
const state = () => page.evaluate(() => { const g = window.S3K, p = g.player; return { mode: g.mode, x: p.x, z: p.z, st: p.stateName, dialog: g.dialog.active }; });
const promptBtn = () => page.evaluate(() => document.querySelector('#prompt img.glyph')?.dataset.btn || null);
const skipDialogs = async () => { for (let i = 0; i < 30 && (await state()).dialog; i++) await btn(0); };

// ouverture → titre → jeu, uniquement à la manette (A)
await btn(0); check('A passe l\'ouverture', (await state()).mode === 'title');
check('titre : icône Xbox « A »', await page.evaluate(() => document.querySelector('#title .go img')?.dataset.btn) === 'A');
await btn(0); await skipDialogs();
check('A lance la partie', (await state()).mode === 'play');

// déplacement au stick gauche
const s0 = await state();
await page.evaluate(() => { window.__pad.axes[1] = -1; }); await wait(600); await page.evaluate(() => { window.__pad.axes[1] = 0; }); await wait(100);
const s1 = await state();
check('stick gauche : l\'Ultra avance', s1.z < s0.z - 2, `z ${s0.z.toFixed(1)} → ${s1.z.toFixed(1)}`);

// attaque (X)
await page.evaluate(() => { const b = window.__pad.buttons[2]; b.pressed = true; b.value = 1; }); await wait(60);
check('X : coup d\'écharpe', (await state()).st === 'attack');
await page.evaluate(() => { const b = window.__pad.buttons[2]; b.pressed = false; b.value = 0; }); await wait(400);

// interaction avec une borne (debug F2 : énigme prête), indication « Y »
await page.keyboard.press('F2'); await wait(200); await skipDialogs();
const goToBorne = i => page.evaluate(i => { const g = window.S3K, b = g.entities.filter(e => e.isSwitch && e.group === 'bornes')[i];
  Object.assign(g.player, { x: b.x + b.fx * 1.6, z: b.z + b.fz * 1.6 }); }, i);
await goToBorne(0); await wait(200);
check('indication manette Xbox : Y', await promptBtn() === 'Y', String(await promptBtn()));
await btn(3);
check('Y : la borne s\'allume', await page.evaluate(() => window.S3K.entities.filter(e => e.isSwitch && e.group === 'bornes')[0].on));

// changement d'appareil : clavier puis PlayStation
await goToBorne(1); await wait(200);
await page.keyboard.down('KeyD'); await wait(60); await page.keyboard.up('KeyD'); await wait(150);
await goToBorne(1); await wait(200);
check('indication clavier : E', await promptBtn() === 'E', String(await promptBtn()));
await page.evaluate(id => { window.__pad.id = id; }, PS);
await page.evaluate(() => { window.__pad.axes[2] = 0.6; }); await wait(150); await page.evaluate(() => { window.__pad.axes[2] = 0; }); await wait(150);
check('indication PlayStation : △', await promptBtn() === '△', String(await promptBtn()));

// débranchement en jeu → pause automatique
await page.evaluate(() => { window.__pad.connected = false; }); await wait(300);
check('manette débranchée : pause', (await state()).mode === 'paused');

await browser.close();
console.log(failures ? `\n${failures} échec(s)` : '\nTous les tests manette passent.');
process.exit(failures ? 1 : 0);
