import { observable, action } from 'mobx';
import { AI } from './ai';
import { Unit, ChampCard, UnitSelection } from './types';
import { DataStore } from './data-store';
import { Summoner } from './summoner';

const ai = new AI();

export class DraftStore {

    public static REFRESH_COST = 2;
    public static BUY_XP_COST = 4;
    public static BENCH_SIZE = 9;
    public static BOARD_SIZE = 10;
    public static XP_PER_ROUND = 2;
    public static MAXIMIM_INTEREST = 5;
    public static TIME_PER_ROUND = 30;//seconds
    public static INITIAL_PLAYER_COUNT = 8;

    dataStore: DataStore;

    @observable
    pool: ChampCard[];

    @observable
    roundCount: number = 1;

    @observable
    isSplashOpen = true;

    @observable
    summoners: Summoner[];

    @observable
    player: Summoner;

    constructor(dataStore: DataStore) {
        this.dataStore = dataStore;
        this.pool = [];
        this.summoners = [...Array(DraftStore.INITIAL_PLAYER_COUNT)]
            .map((_, index) => new Summoner(this, index === 0));
        //First summoner is always the player;
        this.player = this.summoners[0]; 
    }
    
    @action
    public start() { 
        this.initializePool();

        this.summoners.forEach(s => s.start());

        this.isSplashOpen = false;

        this.startTimer();

        
    }

 /*****************************
 * Unit Selection and Movement
 ******************************/

    public giveRandomStartingUnit(summoner: Summoner) {
        //Always start with a 2 cost unit
        const potentialChamps = this.getChampsByCost(2);
        const index = Math.floor(Math.random() * potentialChamps.length);
        const champ = potentialChamps[index];

        //Find that champ
        const poolIndex = this.pool.findIndex(x => x.champ.id === champ.id);
        //Remove from pool
        this.pool.splice(poolIndex, 1);
        
        //Add to bench
        summoner.allUnits[0].unit = {
            tier: 1,
            champ
        };

    }
 
    public selectionsMatch(selA: UnitSelection, selB: UnitSelection): boolean {
        return selA !== undefined
            && selB !== undefined
            && selB.index === selA.index
    }

    @action
    public nextRound() {
        this.roundCount += 1;   
        this.roundTimer = DraftStore.TIME_PER_ROUND;   

        this.summoners.forEach((summoner, index) => {
            summoner.nextRound();
            if(index > 0) {
                ai.purchaseUnit(summoner);
            }
        });
    }

    @observable
    roundTimer: number = DraftStore.TIME_PER_ROUND;

    @observable
    isPaused: boolean = true;

    private roundInterval: any = null;

    @action
    public startTimer() {
        this.isPaused = false;

        if(this.roundInterval) {
            clearInterval(this.roundInterval);
        }

        this.roundTimer = DraftStore.TIME_PER_ROUND;

        this.roundInterval = setInterval(() => {
            if(this.isPaused) { return; }
            --this.roundTimer;

            if(this.roundTimer <= 0) {
                this.nextRound();
            }
        }, 1000);
    }

    @action
    public toggleTimer() {
        this.isPaused = !this.isPaused;
    }

    @action
    public  returnUnitToPool(unit: Unit) {
        const {champ} = unit;
        const unitsInPool = this.pool.filter(x => x.champ.id === champ.id);
        const guids = unitsInPool.map(x => x.guid);

        let iterations = 3**(unit.tier - 1);
        
        let index = 0;
        while(iterations > 0) {
            const guid = `${champ.id}_${index}`;
            if(!guids.includes(guid)) {
                --iterations;
                this.pool.push({
                    guid,
                    champ
                });
            }
            ++index;
        }
    }

    public static getUnitSalePrice(unit: Unit): number {
        let tierBonus = (unit.tier - 1) * 2;
        return unit.champ.cost + tierBonus;
    }

    @action
    public drawCard(summoner: Summoner) {
        const key = `level${summoner.level}`;
        const levelData = this.dataStore.levels.get(key);

        const availableLevels = [...new Set(this.pool.map(x => x.champ.cost))];
        
        const odds = levelData ? levelData.tierOdds : [0,0,0,0,0];

        const oddsTotal = odds.map((x, index) => availableLevels
            .includes(index + 1) ? x : 0)
            .reduce((a, b) => a + b, 0);

        const multiplier = 1 / oddsTotal;

        const adjustedOdds = odds.map((x, index) => availableLevels
            .includes(index + 1) ? x * multiplier : 0);

        const roll = Math.random();

        const cost = this.getCost(roll, adjustedOdds);

        const cardSet = this.pool.filter(x => x.champ.cost === cost);

        if(cardSet.length === 0) {
            return null;
        }

        const index = Math.floor(Math.random() * cardSet.length);
        const card = cardSet[index];

        const indexToRemove = this.pool.findIndex(c => c !== null && c.guid === card.guid);
        this.pool.splice(indexToRemove, 1);
        
        return card;
    }

    @action
    public initializePool() {
        this.pool = this.dataStore.champions.flatMap(champ => {
            const poolSize = this.getInitialPoolSizeForChamp(champ.id);
            return [...Array(poolSize)].map((_, index) => ({
                champ,
                guid: champ.id + "_" + index
            } as ChampCard));            
        });
    }

    private getInitialPoolSizeForChamp(id: string): number {
        const { unitsPerTier, champions} = this.dataStore;
        const champ = champions.find(x => x.id === id);
        if(champ == null) { return 0; }

        switch(champ.cost) {
            case 1: return unitsPerTier.get("tier1") || 0;
            case 2: return unitsPerTier.get("tier2") || 0;
            case 3: return unitsPerTier.get("tier3") || 0;
            case 4: return unitsPerTier.get("tier4") || 0;
            case 5: return unitsPerTier.get("tier5") || 0;
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

    private getChampsByCost(cost: number) {
        return this.dataStore.champions.filter(champ => champ.cost === cost);
    }

}