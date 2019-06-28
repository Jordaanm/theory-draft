import { observable } from 'mobx';

import * as tiers from '../data/tiers.json';
import * as levels from '../data/levels.json';
import * as champions from '../data/champions.json';

export interface ChampData {
    id: string;
    name: string;
    cost: number;
    classes: string[];
}

export class DraftStore {

    @observable
    pool: ChampData[];

    @observable
    currentHand: ChampData[];

    constructor() {
        this.pool = [];
        this.currentHand = [];
    }

    public initializePool() {
        this.pool = champions.champions.flatMap(champ => {
            const poolSize = this.getInitialPoolSizeForChamp(champ.id);
            return [...Array(poolSize)].fill({
                ...champ
            });
        });
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

    public drawHand() {
        while(this.currentHand.length < 5) {
            this.drawCard();
        }
    }

    public drawCard() {
        //TODO: player level;
        const level = 6;

        const odds = levels.levels[level].tierOdds;
        const roll = Math.random();

        const cost = this.getCost(roll, odds);

        const cardSet = this.pool.filter(x => x.cost === cost);
        const index = Math.floor(Math.random() * cardSet.length);
        const card = cardSet[index];

        this.currentHand.push(card);
        this.pool.splice(index, 1);
        console.log(`Your new card: ${card.name}`);
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