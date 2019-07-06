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

export interface UnitSelection {
    unit: Unit;
    index: number;
}

export interface SynergyStage {
    amount: number,
    bonus: string
}

export interface SynergyData {
    name: string;
    base: string;
    passive: string;
    stages: SynergyStage[];
    exact: boolean;
}

export interface Synergy {
    id: string;
    name: string;
    base: string;
    passive: string;
    stages: SynergyStage[];
    exact: boolean;
    count: number;
    tier: number;
    active: boolean;    
}

export interface LevelData {
    xp: number;
    tierOdds: number[]
}