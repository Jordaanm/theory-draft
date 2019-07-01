import { observable, action, computed } from 'mobx';

import * as tiers from '../data/tiers.json';
import * as levels from '../data/levels.json';
import * as champions from '../data/champions.json';
import { synergies } from '../data/synergies.json';
import { Unit, ChampData, ChampCard, UnitSelection, BoardUnit, SynergyData, Synergy } from './types';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils';


export class DraftStore {

    public static REFRESH_COST = 2;
    public static BUY_XP_COST = 4;
    public static BENCH_SIZE = 9;
    public static XP_PER_ROUND = 2;
    public static MAXIMIM_INTEREST = 5;

    @observable
    pool: ChampCard[];

    @observable
    currentHand: (ChampCard | null)[];

    @observable
    benchedUnits: (Unit | null)[] = [];

    @observable
    boardUnits: BoardUnit[] = [];

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
    activeUnit?: UnitSelection = undefined;

    @observable
    roundCount: number = 1;

    constructor() {
        this.pool = [];
        this.currentHand = [];
        this.nextLevelXp = this.getXpForLevelUp(this.level + 1);
        this.benchedUnits = [...Array(DraftStore.BENCH_SIZE)].fill(null);
        this.boardUnits = [...Array(BOARD_WIDTH * BOARD_HEIGHT)].map(
            (_, index) => ({ unit: undefined, index } as BoardUnit)
        );
    }

    
 /*****************************
 * Unit Selection and Movement
 ******************************/

    public selectionsMatch(selA: UnitSelection, selB: UnitSelection): boolean {
        return selA !== undefined
            && selB !== undefined
            && selB.index === selA.index
            && selB.isBenched === selA.isBenched        
    }

    @action unitPickedUp(selection: UnitSelection) {
        this.activeUnit = selection;
    }

    @action unitDropped() {
        this.activeUnit = undefined;
    }

    @action
    public swapUnits(source: UnitSelection, dest: UnitSelection) {
        if(source.isBenched) {
            this.moveUnitToBench(dest.unit, source.index);
        } else {
            this.moveUnitToBoard(dest.unit, source.index);
        }

        if(dest.isBenched) {
             this.moveUnitToBench(source.unit, dest.index);
         } else {
            this.moveUnitToBoard(source.unit, dest.index);
         }
    }

    @action
    public shiftUnitToBench(selection: UnitSelection, index: number) {
        //Only if bench is empty
        if(this.benchedUnits[index] !== null) { 
            return;
        }

        //Remove unit from current space
        this.clearUnitFromCurrentSpace(selection);

        //Move into new space
        this.moveUnitToBench(selection.unit, index)
    }

    @action
    public shiftUnitToBoard(selection: UnitSelection, index: number) {
        //Only if board space is empty
        if(this.boardUnits[index].unit !== undefined) { 
            return;
        }

        if(this.placedUnitCount >= this.level) {
            return;
        }

        //Remove unit from current space
        this.clearUnitFromCurrentSpace(selection);

        //Move into new space
        this.moveUnitToBoard(selection.unit, index)
    }

    private clearUnitFromCurrentSpace(selection: UnitSelection) {
        if(selection.isBenched) {
            this.benchedUnits[selection.index] = null;
        } else {
            this.boardUnits[selection.index].unit = undefined;
        }
    }

    @action
    private moveUnitToBench(unit: Unit, index: number) {
        this.benchedUnits[index] = unit;
    }

    @action
    private moveUnitToBoard(unit: Unit, index: number) {
        const newBoardUnit = { index, unit } as BoardUnit;
        this.boardUnits[index] = newBoardUnit;
    }

/***************************
 * Synergies and Place Units
 ***************************/
    
    @computed
    public get placedUnitCount() {
        return this.boardUnits.filter(bu => bu.unit).length;
    }

    @computed
    public get unitSynergies() {
        const champs: ChampData[] = this.boardUnits.map(x => x.unit).map(unit => unit ? unit.champ : null).filter(champ => champ !== null) as ChampData[];
        const champIds: string[] = champs.map(champ => champ.id);
        const uniqueChampIds: string[] = [...new Set(champIds)];

        const champClasses: string[] = uniqueChampIds.map(id => champions.champions.find(champ => champ.id === id)).flatMap(champ => champ === undefined ? [] : champ.classes).sort();
        const classCounts: object = champClasses.reduce((obj, id) => {
            obj[id] = (obj[id] || 0) + 1;
            return obj;
        }, {} as any);

        return classCounts;
    }

    @computed
    public get unitSynergiesWithTiers(): Synergy[] {
        const activeClasses = Object.keys(this.unitSynergies);

        return activeClasses.map( key => {
            const synergyData = (synergies as any)[key] as SynergyData;
            const count = (this.unitSynergies as any)[key] as number;
            const medalIndex = synergyData.stages.findIndex(x =>  synergyData.exact ? x === count : x <= count);

            //Tiers, 1 = Gold, 2 = Silver, 3 = Bronze, 4 = Inactive;
            const tier = medalIndex === -1 ? 4 : synergyData.stages.length - medalIndex;
            const active = tier < 4;

            return {
                ...synergyData,
                id: key,
                tier,
                active,
                count
            } as Synergy;
        });
    }


    @action
    public toggleHandLock() {
        this.isHandLocked = !this.isHandLocked;
    }

    @action
    public nextRound() {
        this.roundCount += 1;      
        this.gold += this.calculateIncome();
        this.addXP(DraftStore.XP_PER_ROUND);
        if(!this.isHandLocked) {
            this.gold += DraftStore.REFRESH_COST;
            this.refreshHand();    
        }

    }

    private calculateIncome(): number {
        const passive = this.calculatePassiveIncome();
        const interest =  this.calculateInterest();
        const streak = 0; //TODO: Simulate Wins/Losses??
        return passive + interest + streak;
    }

    private calculateInterest(): number {
        return Math.min(Math.floor(this.gold / 10), DraftStore.MAXIMIM_INTEREST);
    }

    private calculatePassiveIncome(): number {
        switch(this.roundCount) {
            case 0: 
            case 1: return 2;
            case 2:
            case 3: return 3;
            case 4: return 4;
            default: return 5;
        }
    }

    @action
    public refreshHand() {
        if (this.gold < DraftStore.REFRESH_COST) {
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
    public sellUnit(unitSelection: UnitSelection) {
        let unitExists = false;
        const { unit, index, isBenched } = unitSelection;

        //Remove Unit;
        if(isBenched) {
            if(this.benchedUnits[index] !== null) {
                this.benchedUnits[index] = null;
                unitExists = true;
            }
        } else {
            if(this.boardUnits[index].unit !== undefined) {
                this.boardUnits[index].unit = undefined;
                unitExists = true;
            }
        }

        //If there was a unit to sell, give gold;
        if(unitExists) {
            this.gold += this.getUnitSalePrice(unit);
        }
    }

    public getUnitSalePrice(unit: Unit): number {
        let tierBonus = 0;
        switch (unit.tier) {
            case 2: {
                tierBonus = 2;
                break; 
            }
            case 3: {
                tierBonus = 4;
                break;
            }
        }

        return unit.champ.cost + tierBonus;
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

        const cardSet = this.pool.filter(x => x.champ.cost === cost);
        const index = Math.floor(Math.random() * cardSet.length);
        const card = cardSet[index];

        this.currentHand.push(card);
        this.pool.splice(index, 1);
    }

    @action
    public initializePool() {
        this.pool = champions.champions.flatMap(champ => {
            const poolSize = this.getInitialPoolSizeForChamp(champ.id);
            return [...Array(poolSize)].map((_, index) => ({
                champ,
                guid: champ.id + "_" + index
            } as ChampCard));            
        });
    }

    @action
    public buyCard(card: ChampCard) {

        if(!card || !card.champ) {
            return;
        }

        const { guid, champ } = card;
        
        let cost = champ.cost;
        let removeExtra = false;

        if(this.gold < champ.cost) {
            return;
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
            const matchingBenchUnits = this.benchedUnits
                .filter(unit => unit !== null && unit.tier === 1 && unit.champ.id === champ.id);
            const matchingBoardUnits = this.boardUnits
                .map(bu => bu.unit || null)
                .filter(unit => unit !== null && unit.tier === 1 && unit.champ.id === champ.id);

            const matchingUnits = [...matchingBenchUnits, ...matchingBoardUnits];

            const availableToBuy = this.currentHand
                .filter(card => card != null && card.champ.id === champ.id) as ChampCard[];

            //Case 2
            if (matchingUnits.length === 2) {
                this.mergeUnits(1, availableToBuy); //Upgrade
            } else if (matchingUnits.length === 1 && availableToBuy.length >= 2) {
                if(this.gold >= champ.cost * 2) { //3a
                    cost *= 2; //Increase Cost
                    this.mergeUnits(1, availableToBuy); //Upgrade
                    removeExtra = true; //Flag that theres a 2nd card to remove
                } else { //3b
                    return;
                }
            } else {        
                return;
            }
        }

        //Remove card
        const index = this.currentHand.findIndex(c => c != null && c.guid === guid);
        this.currentHand[index] = null;

        //Remove 2nd card if needed
        if(removeExtra) {
            const index = this.currentHand.findIndex(card => card != null && card.champ.id === champ.id);
            this.currentHand[index] = null;    
        }

        //Merge Units
        this.mergeUnits(1);

        //Pay money
        this.gold -= cost;
    }

    @action
    private mergeUnits(tier: number = 1, extraCards: ChampCard[] = []) {
        const extraUnits: Unit[] = extraCards.map(card => ({champ: card.champ, tier: 1}));
        const boardUnits: (Unit|null)[] = this.boardUnits.map(bu => bu.unit || null);
        const totalUnits: (Unit|null)[] = [...this.benchedUnits, ...boardUnits, ...extraUnits];

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
            //Remove all of that unit from bench
            while(-1 !== (index = this.benchedUnits.findIndex(unit => 
                unit !== null &&
                unit.champ.id === id &&
                unit.tier === tier
            ))) {
                this.benchedUnits[index] = null;
            }

            //Remove all of that unit from the board
            index = -1;
            let boardIndex = -1;
            while(-1 !== (index = this.boardUnits.findIndex(boardUnit => 
                boardUnit.unit !== undefined &&
                boardUnit.unit.champ.id === id &&
                boardUnit.unit.tier === tier
            ))) {
                this.boardUnits[index].unit = undefined;
                boardIndex = index;
            }

            //Add upgraded unit
            //Priorise returning to board
            if(boardIndex !== -1) {
                this.boardUnits[boardIndex].unit = {
                    tier: tier + 1,
                    champ
                } as Unit;
            } else {
                const firstEmpty = this.benchedUnits.findIndex(x => x === null);
                this.benchedUnits[firstEmpty] = {
                    tier: tier + 1,
                    champ
                } as Unit;    
            }
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
        while(total < roll) {
            total += odds[index];
            ++index;
        }
        return index;
    }

    private getUnitsByCost(cost: number) {
        return champions.champions.filter(champ => champ.cost === cost);
    }

}