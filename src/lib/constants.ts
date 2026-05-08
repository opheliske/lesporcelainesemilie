export const THEMES = ['animaux','fleurs','mer','nature','ethnique','enfants','fruits','graphique','divers'] as const;
export const CATEGORIES = ['assiettes','plats','thecafe','reposesachets','videpoche','autre'] as const;

export type Theme = typeof THEMES[number];
export type Categorie = typeof CATEGORIES[number];

export const THEME_LABELS: Record<Theme, string> = {
  animaux: 'Animaux',
  fleurs: 'Fleurs',
  mer: 'Mer & Poissons',
  nature: 'Nature',
  ethnique: 'Ethnique',
  enfants: 'Enfants',
  fruits: 'Fruits & Légumes',
  graphique: 'Graphique',
  divers: 'Divers',
};

export const CATEGORIE_LABELS: Record<Categorie, string> = {
  assiettes: 'Assiettes',
  plats: 'Plats',
  thecafe: 'Thé & Café',
  reposesachets: 'Repose-sachets',
  videpoche: 'Vide-poches',
  autre: 'Autre',
};
