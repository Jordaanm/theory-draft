import * as React from 'react';
import { Card } from './card';
import { ChampData } from '../../stores/draft-store';

interface HandProps {
    hand: ChampData[];
}

export class Hand extends React.Component<HandProps> {

    public render() {
        const { hand } = this.props;

        return (
            <div className="hand">
                {hand.map( (champ, index) => <Card {...champ} key={index + champ.id}/>)}
            </div>
        );
    }
}