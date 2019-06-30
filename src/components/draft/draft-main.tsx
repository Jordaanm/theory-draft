import * as React from 'react';
import { DraftStore } from '../../stores/draft-store';
import { Coin } from '../shared/coin';
import { ChampCard } from '../../stores/types';
import { Hand } from './hand';
import { observer } from 'mobx-react';

interface DraftMainProps {
    draft: DraftStore;
    hideAboveBar: boolean;
}

@observer
export class DraftMain extends React.Component<DraftMainProps> {
    
    public render() {

        const { draft, hideAboveBar } = this.props;
        const { currentHand, gold} = draft;

        return (
            <div className="draft-main draft-area">
                {!hideAboveBar && <div className="draft-gold-bar above-bar">
                    <div className="draft-gold">
                        <Coin/>{gold}
                    </div>
                </div>}
                <Hand hand={currentHand} action={x => this.buyCard(x)} />
            </div>
        );
    }

    private buyCard(card: ChampCard) {
        console.log("Attempting to buy champ", card.champ.name);
        this.props.draft.buyCard(card);
    }
}