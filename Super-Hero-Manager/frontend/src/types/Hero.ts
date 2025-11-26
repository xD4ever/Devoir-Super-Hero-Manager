export interface Hero {
    _id: string;
    nom: string;
    alias: string;
    univers: 'Marvel' | 'DC' | 'Autre';
    pouvoirs: string[];
    description?: string;
    image?: string;
    origine?: string;
    premiereApparition?: string; // Date string
}

export interface CreateHeroData {
    nom: string;
    alias: string;
    univers: 'Marvel' | 'DC' | 'Autre';
    pouvoirs: string[];
    description?: string;
    image?: File | null;
    origine?: string;
    premiereApparition?: string;
}
