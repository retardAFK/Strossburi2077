// Aléatoire maîtrisé : générateur à graine (mulberry32) pour la LOGIQUE de jeu (IA, attaques, apparitions,
// objets lâchés). Même graine → même partie, ce qui rend les tests reproductibles. Graine : ?seed=<n>
// (lue par main.js), sinon tirée au hasard. Les effets visuels (particules, glitch, textures) gardent Math.random().
let s = (Math.random() * 2 ** 32) >>> 0;

export function seed(n) { s = (Number(n) >>> 0) || 1; }

// nombre dans [0, 1[, comme Math.random()
export function rng() {
  s = (s + 0x6d2b79f5) >>> 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
