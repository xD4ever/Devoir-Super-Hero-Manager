export interface Hero {
  _id: string;
  nom: string;
  alias: string;
  univers: 'Marvel' | 'DC' | 'Autre';
  pouvoirs: string[];
  description?: string;
  origine?: string;
  premiereApparition?: string;
  image?: string;
  createdAt?: string;
}
