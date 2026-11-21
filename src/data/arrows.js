// Types de flèches de l'Arc-Drapeau (données). Décision du 21/11/2026 (docs/decisions.md) : 4 flèches spéciales
// jouables à terme (bannière, fumigène, enflammée, court-circuit) ; la flèche tag est retirée du gameplay
// (son modèle assets/models/fleche_tag.glb reste pour un éventuel bonus).
// enabled : sélectionnable en jeu (les 4 spéciales le sont depuis le socle de la partie 1 ; effets dans
// entities/props/arrowEffects.js, munitions dans les caisses). infinite : pas de munitions. model : .glb de la flèche en vol
// (null = placeholder gris, la flèche simple n'a pas encore de design validé).
export const ARROWS = [
  { id: 'simple', model: null, infinite: true, enabled: true },
  { id: 'banniere', model: 'fleche_banniere', enabled: true },
  { id: 'fumigene', model: 'fleche_fumigene', enabled: true },
  { id: 'enflammee', model: 'fleche_enflammee', enabled: true },
  { id: 'court_circuit', model: 'fleche_court_circuit', enabled: true }
];
