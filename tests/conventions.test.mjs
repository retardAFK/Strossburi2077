// Conventions « lisible par n'importe quel LLM », sans navigateur : commentaire de rôle en tête de chaque fichier
// de src/, README dans chaque dossier de src/, docs/EVENTS.md à jour, AGENTS.md court ; fichiers > 250 lignes signalés.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { checker } from './helpers.mjs';

const T = checker('conventions');
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const src = walk('src').filter(f => f.endsWith('.js'));

const noHeader = src.filter(f => !readFileSync(f, 'utf8').trimStart().startsWith('//'));
T.check('chaque fichier de src/ commence par un commentaire de rôle', noHeader.length === 0, noHeader.join(', '));

const dirs = ['core', 'systems', 'entities', 'items', 'levels', 'data'];
const noReadme = dirs.filter(d => !existsSync(join('src', d, 'README.md')));
T.check('un README.md dans chaque dossier de src/', noReadme.length === 0, noReadme.join(', '));

const ev = spawnSync(process.execPath, ['tools/list-events.mjs', '--check'], { encoding: 'utf8' });
T.check('docs/EVENTS.md à jour', ev.status === 0, ev.stdout.trim());

const agents = existsSync('AGENTS.md') ? readFileSync('AGENTS.md', 'utf8').trimEnd().split('\n').length : 0;
T.check('AGENTS.md présent et court (≤ 30 lignes)', agents > 0 && agents <= 30, `${agents} lignes`);

const long = src.map(f => [f, readFileSync(f, 'utf8').split('\n').length]).filter(([, n]) => n > 250);
console.log(long.length ? `(info) fichiers > 250 lignes : ${long.map(([f, n]) => `${f} (${n})`).join(', ')}` : '(info) aucun fichier > 250 lignes');

await T.finish();
