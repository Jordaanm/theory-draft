import * as React from 'react';
import { Card } from './card';
import { BlankCard } from './blank-card';
import { observer } from 'mobx-react';
import { ChampData } from '../../stores/champ-data';


interface HandProps {
    hand: ChampData[];
    action: (ChampData) => void;
}


@observer
 export class Hand extends React.Component<HandProps> {

    public render() {
        const { hand, action } = this.props;

        return (
            <div className="hand">
                {hand.map( (champ, index) => Boolean(champ) ? 
                    <Card champ={champ} key={Math.random()} action={action}/> :
                    <BlankCard key={index + '-blank'} />
                )}
            </div>
        );
    }
}