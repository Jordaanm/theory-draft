import { Summoner } from './summoner';
import { DraftStore } from './draft-store';
import { ChampCard } from './types';

interface CardPref {
    card: ChampCard;
    weight: number;
}

export class AI {
    purchaseUnit(summoner: Summoner): void {
        //Limit to affordable cards
        const potentialCards = summoner.currentHand
            .filter(x => x !== null && x.champ.cost < summoner.gold);
    
        const spendingLimit = this.willingToSpend(summoner);
        let totalSpent = 0;
        
        while (potentialCards.length > 0 && totalSpent < spendingLimit ) {
            //Purchase Random Card
            const index = Math.floor(Math.random() * potentialCards.length);
            const card = potentialCards.splice(index, 1)[0];
        
            if (card !== null) {
                summoner.buyCard(card);
                totalSpent += card.champ.cost;
            }
        }

        if (spendingLimit - totalSpent > DraftStore.BUY_XP_COST) {
            summoner.buyXP();
        }

    };
    
    //If they have more than 50 gold, spend all the excess down to 40
    //Otherwise, spend down the the nearest 10, to a minimum of 5 gold
    willingToSpend(summoner: Summoner): number {
        if(summoner.gold > 50) {
            return summoner.gold - 40;
        } else {
            const nearestTen = Math.floor(summoner.gold / 10) * 10;
            return Math.min(Math.max(summoner.gold - nearestTen, 5), summoner.gold);
        }
    };

    getPurchasePreference(cards: ChampCard[], summoner: Summoner, threshold: number): ChampCard|null {

        //Add weights for:
        // +2 Has this champ at Tier 2
        // +1 Has this champ at Tier 1
        // -10 Has this champ at Tier 3
        // +1 Per synergy bonus
        // +2 For a 5 cost
        // +1 For a 4 cost

        const allWeighted: CardPref[] = cards.map(card => {
            let weight = this.getSynergyWeight(summoner, card)
             + this.getExistingUnitWeight(summoner, card)
             + this.getRarityWeight(card);

            return {
                card,
                weight
            };
        });

        const withinThreshold: CardPref[] = allWeighted.filter(pref => pref.weight >= threshold);
        if (withinThreshold.length === 0) { return null; }

        const topCard: CardPref = withinThreshold.reduce((best, current) => {
            if (best == null) {
                return current;
            } else if (best !== null && best.weight < current.weight) {
                return current;
            } else {
                return best;
            }
        }, withinThreshold[0]);


        return topCard.card;
    }

    getSynergyWeight(summoner: Summoner, card: ChampCard): number {
        const existingClasses = Object.keys (summoner.unitSynergies)
        return card.champ.classes.filter(x => existingClasses.includes(x)).length;
    }

    getExistingUnitWeight(summoner: Summoner, card: ChampCard): number {
        const matchingUnits = summoner.allUnits.filter(
            x => x.unit !== undefined &&
            x.unit.champ.id === card.champ.id
        );

        if(matchingUnits.length === 0) { return 0; }

        const topTier = matchingUnits.map(x => x.unit !== undefined ? x.unit.tier : 0)
            .sort()
            .reverse()[0];

        switch(topTier) {
            case 1: return 1;
            case 2: return 2;
            case 3: return -10;
            default: return 0;
        }
    }

    getRarityWeight(card: ChampCard): number {
        switch(card.champ.cost) {
            case 5: return 2;
            case 4: return 1;
            default: return 0;
        }
    }
}

