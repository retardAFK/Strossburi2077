// Lecture du tableau Markdown de docs/dialogues/<niveau>.md (commun à l'export et à l'import).
// Renvoie [{ id, who, txt, status, note }] ; ignore l'en-tête, le séparateur et les lignes vides.
export function readTable(md) {
  const rows = [];
  for (const raw of md.replace(/\r\n/g, '\n').split('\n')) {
    if (!raw.startsWith('|') || /^\|\s*-/.test(raw) || /^\|\s*id\s*\|/.test(raw)) continue;
    // découpe sur les « | » non échappés
    const cells = raw.slice(1, raw.trimEnd().endsWith('|') ? raw.trimEnd().length - 1 : undefined)
      .split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));
    if (cells.length < 5) continue;
    const [id, who, txt, status, note] = cells;
    rows.push({ id, who, txt, status, note });
  }
  return rows;
}
