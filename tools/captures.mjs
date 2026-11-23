// Captures « avant / après » de chaque map : une image par salle (points F2 du layout), même cadrage à chaque fois,
// pour comparer les versions. Lecture seule : ne touche ni au code ni à la sauvegarde.
//   node tools/captures.mjs <étiquette> [niveau ...]      (ex. node tools/captures.mjs avant)
// Résultat : tools/_frames/captures/<étiquette>/<niveau>-<n>-<salle>.png (dossier non versionné).
// Prérequis : npm run build (dist/ à jour) et Chrome installé (comme les tests).
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const [tag = 'avant', ...asked] = process.argv.slice(2);
const order = JSON.parse(readFileSync('src/levels/index.js', 'utf8').match(/CAMPAIGN_ORDER = (\[.*?\])/)[1].replace(/'/g, '"'));
const levels = asked.length ? asked : order;
const out = `tools/_frames/captures/${tag}`; mkdirSync(out, { recursive: true });
const exe = process.env.CHROME_PATH;
const browser = await chromium.launch({ ...(exe ? { executablePath: exe } : { channel: 'chrome' }), headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const wait = ms => page.waitForTimeout(ms);
const key = async code => { await page.keyboard.down(code); await wait(80); await page.keyboard.up(code); await wait(80); };
const skip = async () => { for (let i = 0; i < 60 && await page.evaluate(() => window.S3K.dialog.active); i++) await key('Enter'); };

for (const id of levels) {
  await page.goto(pathToFileURL(resolve('dist/index.html')).href + `?debug=1&seed=1&level=${id}&install=0`);
  await page.waitForFunction(() => window.S3K?.world && window.S3K.player, null, { timeout: 60000 });
  await key('Enter'); await key('Enter'); await skip();
  const warps = await page.evaluate(() => (window.S3K.level.layout.warps || []).map(w => w.id));
  for (let i = 0; i < warps.length; i++) {
    await key('F2'); await wait(300); await skip();
    await wait(1800); await skip(); // dialogues fermés, bannières passées
    const file = `${out}/${id}-${i + 1}-${warps[i]}.png`;
    await page.screenshot({ path: file });
    console.log(file);
  }
}
await browser.close();
