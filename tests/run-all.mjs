// Lance tous les tests (tests/*.test.mjs) l'un après l'autre et résume. Code de sortie 1 si un test échoue.
// `npm test` (build + tests) ; `npm run test:update-snapshots` réécrit les instantanés de réglages.
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const files = readdirSync('tests').filter(f => f.endsWith('.test.mjs')).sort();
const extra = process.argv.slice(2), results = [];
for (const f of files) {
  console.log(`\n=== ${f}`);
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [`tests/${f}`, ...extra], { stdio: 'inherit' });
  results.push({ f, ok: r.status === 0, s: ((Date.now() - t0) / 1000).toFixed(1) });
}
console.log('\n=== Résumé');
for (const r of results) console.log(`${r.ok ? 'OK   ' : 'ÉCHEC'} ${r.f} (${r.s} s)`);
const failed = results.filter(r => !r.ok).length;
console.log(failed ? `${failed} fichier(s) en échec` : 'Tous les tests passent.');
process.exit(failed ? 1 : 0);
