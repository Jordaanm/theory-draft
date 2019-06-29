import { observable, action } from 'mobx';

import * as tiers from '../data/tiers.json';
import * as levels from '../data/levels.json';
import * as champions from '../data/champions.json';
import { Unit } from './unit.js';
import { ChampData } from './champ-data';

export interface BoardUnit {
    x: number;
    y: number;
    unit: Unit;
};

export class DraftStore {

    public static REFRESH_COST = 2;
    public static BUY_XP_COST = 4;
    public static BENCH_SIZE = 9;

    @observable
    pool: ChampData[];

    @observable
    currentHand: (ChampData | null)[];

    @observable
    benchedUnits: (Unit | null)[] = [];

    @observable
    boardUnits: (BoardUnit | null)[] = [];

    @observable
    xp: number = 0;

    @observable
    nextLevelXp: number = 2;

    @observable
    level: number = 4;

    @observable
    gold: number = 30;

    constructor() {
        this.pool = [];
        this.currentHand = [];
        this.nextLevelXp = this.getXpForLevelUp(this.level);
        this.benchedUnits = [...Array(DraftStore.BENCH_SIZE)].fill(null);
        this.boardUnits = [];
    }

    @action
    public refreshHand() {
        if (this.gold < DraftStore.REFRESH_COST) {
            console.log("You cannot afford to refresh");
            return;
        }

        //Return hand to pool
        this.currentHand.forEach(card => {
            if(card) {
                this.pool.push(card);
            }
        });

        this.currentHand = [];

        this.drawHand();
        this.gold -= DraftStore.REFRESH_COST;
    }

    @action
    public buyXP() {
        if(this.gold < DraftStore.BUY_XP_COST) {
            console.log("You cannot afford to buy XP");
            return;
        }
        this.addXP(4);
        this.gold -= DraftStore.BUY_XP_COST;
    }

    @action
    public addXP(amount: number) {
        this.xp += amount;
        //Level Up
        if(this.xp >= this.nextLevelXp) {
            this.xp = this.xp - this.nextLevelXp;
            this.nextLevelXp = this.getXpForLevelUp(this.level + 1);
            this.level += 1;
        }
    }

    @action
    public drawHand() {
        while(this.currentHand.length < 5) {
            this.drawCard();
        }
    }

    @action
    public drawCard() {
        const key = `level${this.level}`;
        
        const odds = (levels.levels as any)[key].tierOdds;
        const roll = Math.random();

        const cost = this.getCost(roll, odds);

        const cardSet = this.pool.filter(x => x.cost === cost);
        const index = Math.floor(Math.random() * cardSet.length);
        const card = cardSet[index];

        this.currentHand.push(card);
        this.pool.splice(index, 1);
        console.log(`Your new card: ${card.name}`);
    }

    @action
    public initializePool() {
        this.pool = champions.champions.flatMap(champ => {
            const poolSize = this.getInitialPoolSizeForChamp(champ.id);
            return [...Array(poolSize)].fill({
                ...champ
            });
        });
    }

    @action
    public buyCard(champ: ChampData) {
        console.log("DraftStore::buyCard", champ);
        if(this.gold < champ.cost) {
            console.log(`You cannot afford to buy ${champ.name} for ${champ.cost} coins`);
        }

        //Add unit to bench
        const firstEmpty = this.benchedUnits.findIndex(x => x === null);
        this.benchedUnits[firstEmpty] = ({
            tier: 1,
            champ
        });

        //Remove card
        const index = this.currentHand.findIndex(card => card != null && card.id === champ.id);
        this.currentHand[index] = null;

        //Merge Units
        //TODO

    }

    private getXpForLevelUp(currentLevel: number) {
        return (levels.levels as any)[`level${currentLevel}`].xp;
    }

    private getInitialPoolSizeForChamp(id: string): number {
        const champ = champions.champions.find(x => x.id === id);
        if(champ == null) { return 0; }

        switch(champ.cost) {
            case 1: return tiers.unitsPerTier.tier1;
            case 2: return tiers.unitsPerTier.tier2;
            case 3: return tiers.unitsPerTier.tier3;
            case 4: return tiers.unitsPerTier.tier4;
            case 5: return tiers.unitsPerTier.tier5;
            default: return 0;
        }
    }

    private getCost(roll: number, odds: number[]) {
        let total = 0;
        let index = 0;
       console.log(`You rolled: ${roll}`, odds);
        while(total < roll) {
            total += odds[index];
            ++index;
            console.log(`Total odds for cost ${index} unit: ${total}`);
        }
        console.log(`You're getting as ${index} cost unit`);

        return index;
    }

    private getUnitsByCost(cost: number) {
        return champions.champions.filter(champ => champ.cost === cost);
    }

}