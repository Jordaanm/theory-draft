export interface ChampData {
    id: string;
    name: string;
    cost: number;
    classes: string[];
}

export interface Unit {
    tier: number;
    champ: ChampData;
}

export interface ChampCard {
    champ: ChampData;
    guid: string;
}