// Build hors-ligne : src/ -> dist/ (un seul game.js, modèles .glb embarqués, Three.js inclus).
// Le résultat s'ouvre d'un double-clic sur dist/index.html, sans serveur.
//   npm run build   |   npm run dev (reconstruit à chaque modification)
import * as esbuild from 'esbuild';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

mkdirSync('dist', { recursive: true });
// l'écriture est faite par Node (et non par le binaire esbuild) pour fonctionner partout
const writeOut = { name: 'write', setup(b) { b.onEnd(r => {
  if (r.errors.length) return;
  let hash = '';
  for (const f of r.outputFiles) { writeFileSync(f.path, f.contents); hash = createHash('sha1').update(f.contents).digest('hex').slice(0, 10); }
  // cache-busting : game.js?v=<empreinte du contenu>, les joueurs ont toujours la dernière version
  const html = readFileSync('src/index.html', 'utf8').replace('src="game.js"', `src="game.js?v=${hash}"`);
  writeFileSync('dist/index.html', html);
  // PWA : manifeste, icônes et service worker (cache renommé à chaque build)
  for (const f of readdirSync('src/pwa')) {
    if (f === 'sw.js') writeFileSync('dist/sw.js', readFileSync('src/pwa/sw.js', 'utf8').replace('__BUILD__', hash));
    else writeFileSync('dist/' + f, readFileSync('src/pwa/' + f));
  }
  console.log('[build] dist/ à jour');
  // dialogues : signale (sans échouer) les répliques encore en brouillon, à faire relire par Maxime
  import('../src/data/dialogues/index.js?t=' + Date.now()).then(({ drafts }) => {
    const d = drafts();
    if (d.length) console.log(`[build] ${d.length} réplique(s) en brouillon : ${d.map(l => l.id).join(', ')} (relecture : node tools/dialogues-export.mjs)`);
  });
}); } };
const options = {
  entryPoints: ['src/main.js'], bundle: true, format: 'iife', outfile: 'dist/game.js', write: false,
  loader: { '.glb': 'binary', '.png': 'dataurl' }, target: 'es2020', minify: false, sourcemap: false,
  logLevel: 'warning', plugins: [writeOut]
};
if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('[build] surveillance de src/ et assets/... (Ctrl+C pour arrêter)');
} else {
  await esbuild.build(options);
}
