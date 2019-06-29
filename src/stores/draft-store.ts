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
    public static XP_PER_ROUND = 2;

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
    level: number = 1;

    @observable
    gold: number = 3;

    @observable
    isHandLocked: boolean = false;

    @observable
    goldPerRound: number = 8;

    constructor() {
        this.pool = [];
        this.currentHand = [];
        this.nextLevelXp = this.getXpForLevelUp(this.level + 1);
        this.benchedUnits = [...Array(DraftStore.BENCH_SIZE)].fill(null);
        this.boardUnits = [];
    }

    @action
    public toggleHandLock() {
        this.isHandLocked = !this.isHandLocked;
    }

    @action
    public nextRound() {
        this.gold += this.goldPerRound
        this.addXP(DraftStore.XP_PER_ROUND);
        if(!this.isHandLocked) {
            this.gold += DraftStore.REFRESH_COST;
            this.refreshHand();    
        }
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
        let cost = champ.cost;
        let removeExtra = false;

        if(this.gold < champ.cost) {
            console.log(`You cannot afford to buy ${champ.name} for ${champ.cost} coins`);
        }

        /* Several cases:
        1. Player has empty space for unit, all good
        2. Player has no empty space, but has 2 units of the same type at tier 1 already, merge to free up space
        3. Player has no empty space, but has 1 unit of the same type at tier 1,
           and the hand has 2 of that same champ
           3a. If they have the gold to buy 2, buy both and merge to free up space
           3b. If they don't have the gold, abort
        */


        //Add unit to bench
        const firstEmpty = this.benchedUnits.findIndex(x => x === null);
        //Case 1
        if(firstEmpty >= 0) {
            this.benchedUnits[firstEmpty] = ({
                tier: 1,
                champ
            });

        } else {
            const matchingUnits = this.benchedUnits
                .filter(unit => unit !== null && unit.tier === 1 && unit.champ.id === champ.id);

            const availableToBuy = this.currentHand
                .filter(c => c !== null && c.id === champ.id) as ChampData[];

            //Case 2
            if (matchingUnits.length === 2) {
                this.mergeUnits(1, availableToBuy); //Upgrade
            } else if (matchingUnits.length === 1 && availableToBuy.length === 2) {
                if(this.gold >= champ.cost * 2) { //3a
                    cost *= 2; //Increase Cost
                    this.mergeUnits(1, availableToBuy); //Upgrade
                    removeExtra = true; //Flag that theres a 2nd card to remove
                } else { //3b
                    console.log("You don't space and can't afford to buy 2 of unit: ", champ.name);
                    return;
                }
            }
        }

        //Remove card
        const index = this.currentHand.findIndex(card => card != null && card.id === champ.id);
        this.currentHand[index] = null;

        //Remove 2nd card if needed
        if(removeExtra) {
            const index = this.currentHand.findIndex(card => card != null && card.id === champ.id);
            this.currentHand[index] = null;    
        }

        //Merge Units
        this.mergeUnits(1);

        //Pay money
        this.gold -= cost;
    }

    @action
    private mergeUnits(tier: number = 1, extraChamps: ChampData[] = []) {
        const extraUnits: Unit[] = extraChamps.map(champ => ({champ, tier: 1}));
        const totalUnits: (Unit|null)[] = [...this.benchedUnits, ...extraUnits];

        const onlyCurrentTier = totalUnits.filter(c => c!== null && c.tier === tier) as Unit[];
        
        //Remap to count champions
        const champCount = onlyCurrentTier.reduce((m: object, unit: Unit) => {
            const id = unit.champ.id;
            const val = (m as any)[id];
            if (!val) {
                (m as any)[id] = 1;
            } else {
                (m as any)[id] = val+1;
            }
            return m;
        }, {});

        //Find champs to merge
        const idsToMerge = Object.keys(champCount).filter(x => (champCount as any)[x] >= 3);

        //Merge and upgrade the champs
        idsToMerge.forEach(id => {
            const champ = (champions.champions as ChampData[]).find(c => c.id === id);
            
            let index = -1;
            //Remove all of that unit
            while(-1 !== (index = this.benchedUnits.findIndex(unit => 
                unit !== null &&
                unit.champ.id === id &&
                unit.tier === tier
            ))) {
                this.benchedUnits[index] = null;
            }

            //Add upgraded unit
            const firstEmpty = this.benchedUnits.findIndex(x => x === null);
            this.benchedUnits[firstEmpty] = {
                tier: tier + 1,
                champ
            } as Unit;
        });

        if (tier === 1) {
            this.mergeUnits(2);
        }
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