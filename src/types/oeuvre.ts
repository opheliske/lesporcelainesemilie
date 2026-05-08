import type { Theme, Categorie } from '@/lib/constants';
export type { Theme, Categorie };

export interface Oeuvre {
  publicId: string;
  title: string;
  description: string;
  theme: Theme;
  categorie: Categorie;
  thumb: string;
  full: string;
  createdAt: string;
}
