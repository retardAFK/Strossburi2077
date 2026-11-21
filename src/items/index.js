// Registre des objets de l'Ultra, par identifiant : sert à la sauvegarde (on rend les objets d'un niveau à l'autre).
// Ajouter un objet = l'importer ici avec son id (celui passé à Weapon : 'boomerang', 'arc', ...).
import { BretzelBoomerang } from './BretzelBoomerang.js';
import { ArcDrapeau } from './ArcDrapeau.js';

export const ITEMS = { boomerang: BretzelBoomerang, arc: ArcDrapeau };
