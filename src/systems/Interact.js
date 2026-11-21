// Interaction de proximité (touche E), commune aux terminaux, bornes, leviers, PNJ... de tous les niveaux.
// L'indication à l'écran passe par l'événement 'hud:prompt' (source, texte | null) : le HUD l'affiche.
// Arbitrage : si plusieurs objets sont à portée, seul le plus proche affiche son indication et réagit à E.

function setPrompt(e, on, text) {
  if (on === !!e.inRange) return;
  e.inRange = on; e.game.events.emit('hud:prompt', e, on ? text : null);
}

// Met à jour l'indication de e et renvoie true si le joueur vient d'appuyer sur E à portée.
// e : { game, dist(player), inRange } (une entité, ou un point d'interaction fabriqué à la main).
export function interact(e, text, range) {
  const g = e.game, p = g.player;
  const d = p && p.alive ? e.dist(p) : Infinity;
  const h = g.interactHolder;
  if (h && h.e === e) h.d = d;
  const near = d < range && (!h || h.e === e || d < h.d);
  if (near && h && h.e !== e) setPrompt(h.e, false); // un objet plus proche prend la main
  if (near) g.interactHolder = { e, d };
  else if (h && h.e === e) g.interactHolder = null;
  setPrompt(e, near, text);
  return near && !!g.input.pressed.use;
}

// Retire l'indication de e (objet utilisé, désactivé...).
export function clearPrompt(e) {
  if (e.game.interactHolder?.e === e) e.game.interactHolder = null;
  setPrompt(e, false);
}
