import * as React from 'react';
import { Card } from './card';
import { BlankCard } from './blank-card';
import { observer } from 'mobx-react';
import { ChampCard } from '../../stores/types';


interface HandProps {
    hand: ChampCard[];
    action: (ChampCard) => void;
}


@observer
 export class Hand extends React.Component<HandProps> {

    public render() {
        const { hand, action } = this.props;

        return (
            <div className="hand">
                {hand.map( (card, index) => Boolean(card) ? 
                    <Card card={card} key={card.guid} action={action}/> :
                    <BlankCard key={index + '-blank'} />
                )}
            </div>
        );
    }
}