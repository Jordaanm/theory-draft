import { DraftStore } from './draft-store';
import { observable, action, computed, autorun } from 'mobx';
import { UnitSelection, BoardUnit, ChampCard, Unit, Synergy, SynergyData, SynergyStage, ChampData } from './types';
export class Summoner {

    draft: DraftStore;

    @observable
    currentHand: (ChampCard | null)[];

    //All Units 0-8 = Bench, 9+ = Board
    @observable
    allUnits: BoardUnit[] = [];

    @computed
    get benchedUnits(): BoardUnit[] {
        return this.allUnits.slice(0,DraftStore.BENCH_SIZE);
    }

    @computed 
    get boardUnits(): BoardUnit[] {
        return this.allUnits.slice(DraftStore.BENCH_SIZE);
    }


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
    
    constructor(draft: DraftStore) {
        this.draft = draft;

        this.currentHand = [];
        this.nextLevelXp = this.getXpForLevelUp(this.level + 1);

        this.allUnits = [...Array(DraftStore.BOARD_SIZE + DraftStore.BENCH_SIZE)].map(
            (_, index) => ({unit: undefined, index})
        );
    }

    @action
    public start() {
        this.drawHand();        
        this.getRandomStartingUnit();
    }

    @action
    private getRandomStartingUnit() {
        this.draft.giveRandomStartingUnit(this);
    }

    @action
    public nextRound() {
        this.gold += this.calculateIncome();
        this.addXP(DraftStore.XP_PER_ROUND);
        if(!this.isHandLocked) {
            this.gold += DraftStore.REFRESH_COST;
            this.refreshHand();    
        }
    }

/**************
 * INCOME
 ****************/

public calculateIncome(): number {
    const passive = this.calculatePassiveIncome();
    const interest =  this.calculateInterest();
    const streak = this.calculateStreakBonus();
    return passive + interest + streak;
}

public calculateInterest(): number {
    return Math.min(Math.floor(this.gold / 10), DraftStore.MAXIMIM_INTEREST);
}

public calculateStreakBonus(): number {
    return 0; //TODO: Simulate Wins/Losses??
}

public calculatePassiveIncome(): number {
    switch(this.draft.roundCount) {
        case 0: 
        case 1: return 2;
        case 2:
        case 3: return 3;
        case 4: return 4;
        default: return 5;
    }
}

/****************
 * XP AND LEVELS
 ****************/
    
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

    private getXpForLevelUp(currentLevel: number) {
        const level = (this.draft.dataStore.levels).get(`level${currentLevel}`);
        return level ? level.xp : 0;
    }

/****************
 * STORE / CARDS
 ****************/
    
    @action
    public toggleHandLock() {
        this.isHandLocked = !this.isHandLocked;
    }

    @action
    public refreshHand() {
        if (this.gold < DraftStore.REFRESH_COST) {
            return;
        }

        //Return hand to pool
        this.currentHand.forEach(card => {
            if(card) {
                this.draft.pool.push(card); //TODO: Refactor into draft.returnCardToPool
            }
        });

        this.currentHand.splice(0, 5);

        this.drawHand();
        this.gold -= DraftStore.REFRESH_COST;
    }


    @action
    public drawHand() {
        while(this.currentHand.length < 5) {
            this.drawCard();
        }
    }

    @action
    public drawCard() {
        const card = this.draft.drawCard(this);     
        this.currentHand.push(card);
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
        const firstEmpty = this.benchedUnits.findIndex(x => x.unit === undefined);
        //Case 1
        if(firstEmpty >= 0) {
            this.allUnits[firstEmpty].unit = ({
                tier: 1,
                champ
            });

        } else {
            const matchingUnits = this.allUnits
                .map(bu => bu.unit)
                .filter(unit => unit !== undefined && unit.tier === 1 && unit.champ.id === champ.id);

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


/*************************
 * UNITS (BENCH AND BOARD)
 *************************/

@action
private mergeUnits(tier: number = 1, extraCards: ChampCard[] = []) {
    const extraUnits: Unit[] = extraCards.map(card => ({champ: card.champ, tier: 1}));
    const boardUnits: (Unit|null)[] = this.boardUnits.map(bu => bu.unit || null);
    const benchedUnits: (Unit|null)[] = this.benchedUnits.map(bu => bu.unit || null);
    const totalUnits: (Unit|null)[] = [...benchedUnits, ...boardUnits, ...extraUnits];

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
        const champ = (this.draft.dataStore.champions).find(c => c.id === id);
        
        //Remove all of that unit from bench and board
        let index = -1;
        let boardIndex = -1;
        while(-1 !== (index = this.allUnits.findIndex(boardUnit => 
            boardUnit.unit !== undefined &&
            boardUnit.unit.champ.id === id &&
            boardUnit.unit.tier === tier
        ))) {
            this.allUnits[index].unit = undefined;
            if (index >= DraftStore.BENCH_SIZE) {
                boardIndex = index;
            }
        }

        //Add upgraded unit
        //Priorise returning to board
        if(boardIndex !== -1) {
            this.allUnits[boardIndex].unit = {
                tier: tier + 1,
                champ
            } as Unit;
        } else {
            const firstEmpty = this.allUnits.findIndex(x => x.unit === undefined);
            this.allUnits[firstEmpty].unit = {
                tier: tier + 1,
                champ
            } as Unit;    
        }
    });

    if (tier === 1) {
        this.mergeUnits(2);
    }
}

    @action unitPickedUp(selection: UnitSelection) {
        this.activeUnit = selection;
    }

    @action unitDropped() {
        this.activeUnit = undefined;
    }

    @action
    public sellUnit(unitSelection: UnitSelection) {
        const { unit, index } = unitSelection;

        //If there is a unit to sell, give gold;
        if(this.allUnits[index].unit !== undefined) {
            this.allUnits[index].unit = undefined;
            this.gold += DraftStore.getUnitSalePrice(unit);
            this.draft.returnUnitToPool(unit);
        }
    }

    
    @action
    public swapUnits(source: UnitSelection, dest: UnitSelection) {
        this.moveUnit(dest.unit, source.index);
        this.moveUnit(source.unit, dest.index);
    }

    @action shiftUnitToSlot(boardUnit: BoardUnit, index: number) {

        //Only if the slot is empty
        if (this.allUnits[index].unit !== undefined || !boardUnit.unit) {
            return;
        }

        //If it's to be placed on the board, enforece the unit limit
        if(index >= DraftStore.BENCH_SIZE && this.placedUnitCount >= this.level) {
            return;
        }

        //Remove unit from current slot
        this.clearUnitFromSlot(boardUnit);

        //Place into new slot
        this.allUnits[index].unit = boardUnit.unit;
    }

    private clearUnitFromSlot(boardUnit: BoardUnit) {
        this.allUnits[boardUnit.index].unit = undefined;
    }

    @action
    private moveUnit(unit: Unit, index: number) {
        this.allUnits[index].unit = unit;
    }


/***************************
 * Synergies and Place Units
 ***************************/
    
    @computed
    public get placedUnitCount() {
        return this.boardUnits.filter(bu => bu.unit).length;
    }


    @observable
    showPlaced: boolean = false;

    public showPlacedDisposer = autorun(() => {
        if (this.placedUnitCount !== -1) {
            this.showPlaced = true;
            setTimeout(() => {
                this.showPlaced = false;
            }, 500);          
        }
    });

    @computed
    public get unitSynergies() {
        const champs: ChampData[] = this.boardUnits.map(x => x.unit).map(unit => unit ? unit.champ : null).filter(champ => champ !== null) as ChampData[];
        const champIds: string[] = champs.map(champ => champ.id);
        const uniqueChampIds: string[] = [...new Set(champIds)];

        const champClasses: string[] = uniqueChampIds.map(id => this.draft.dataStore.champions.find(champ => champ.id === id)).flatMap(champ => champ === undefined ? [] : champ.classes).sort();
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
            const synergyData = (this.draft.dataStore.synergies).get(key) as SynergyData;
            const count = (this.unitSynergies as any)[key] as number;

            let medalIndex = -1;
            synergyData.stages.forEach((x: SynergyStage, index: number) => {
                if (synergyData.exact && count === x.amount) {
                    medalIndex = index;
                } else if(synergyData && count >= x.amount) {
                    medalIndex = index;
                }
            });

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
}