import * as React from 'react';
import { ChampCard } from '../../stores/types';
import { Hand } from './hand';
import { observer } from 'mobx-react';
import { Summoner } from '../../stores/summoner';

interface DraftMainProps {
    player: Summoner;
}

@observer
export class DraftMain extends React.Component<DraftMainProps> {
    
    public render() {

        const { player } = this.props;
        const { currentHand} = player;

        return (
            <div className="draft-main draft-area">
                <Hand hand={currentHand} action={x => this.buyCard(x)} />
            </div>
        );
    }

    private buyCard(card: ChampCard) {
        this.props.player.buyCard(card);
    }
}