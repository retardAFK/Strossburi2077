// Interaction de proximité (touche E), commune aux terminaux, bornes, leviers... de tous les niveaux.
// L'indication à l'écran passe par l'événement 'hud:prompt' (source, texte | null) : le HUD l'affiche.

// Met à jour l'indication de e et renvoie true si le joueur vient d'appuyer sur E à portée.
export function interact(e, text, range) {
  const p = e.game.player;
  const near = !!(p && p.alive && e.dist(p) < range);
  if (near !== !!e.inRange) { e.inRange = near; e.game.events.emit('hud:prompt', e, near ? text : null); }
  return near && !!e.game.input.pressed.use;
}

// Retire l'indication de e (objet utilisé, désactivé...).
export function clearPrompt(e) {
  if (!e.inRange) return;
  e.inRange = false; e.game.events.emit('hud:prompt', e, null);
}
