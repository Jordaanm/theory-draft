import { observable, action } from 'mobx';

import * as tiersData from '../data/tiers.json';
import * as levelsData from '../data/levels.json';
import * as championsData from '../data/champions.json';
import { LevelData, ChampData } from './types';

export class DataStore {

    @observable
    unitsPerTier: Map<string, number>;

    @observable
    levels: Map<string, LevelData>;

    @observable
    champions: ChampData[];

    private static emptyChamp: ChampData = {
        name: "",
        id: "",
        cost: 0,
        classes: []
    };

    private static emptyLevel: LevelData = {
        xp: 0,
        tierOdds: [0, 0, 0, 0, 0]
    };

    constructor() {
        this.unitsPerTier = new Map();
        this.levels = new Map();
        this.champions = [];

        this.setUnitsPerTierFromJson(tiersData.unitsPerTier);
        this.setLevelsFromJson(levelsData.levels);
        this.setChampsFromJson(championsData.champions)
    }

    @action
    public setUnitsPerTierFromJson(unitsPerTier: any) {
        this.unitsPerTier.clear();
        Object.keys(unitsPerTier).forEach(key => {
            let val = Number(unitsPerTier[key]) || 0;
            this.unitsPerTier.set(key, val);
        });
    }

    @action
    public setLevelsFromJson(levels: any) {
        this.levels.clear();
        Object.keys(levels).forEach(key => {
            let val = levels[key] as LevelData || DataStore.emptyLevel;
            this.levels.set(key, val);
        });
    }

    @action
    public setChampsFromJson(champions: any) {
        this.champions.splice(0);//Inline clear an array
        Object.keys(champions).forEach(key => {
            let val = champions[key] as ChampData || null;
            if(val !== null) {
                this.champions.push(val);
            }
        });
    }
}