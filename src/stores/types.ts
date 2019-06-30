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

export interface BoardUnit {
    unit?: Unit;
    index: number;
}

export interface BenchUnit {
    unit: Unit;
    index: number;
}

export interface UnitSelection {
    unit: Unit;
    index: number; //Can convert index into board position
    isBenched: boolean;
}

export interface Coords {
    x: number;
    y: number;
}

export interface SynergyData {
    name: string;
    stages: number[];
    exact: boolean;
}

export interface Synergy {
    id: string;
    name: string;
    stages: number[];
    exact: boolean;
    count: number;
    tier: number;
    active: boolean;    
}