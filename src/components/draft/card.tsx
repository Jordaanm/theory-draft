import * as React from 'react';

import './card.scss';
import { ChampCard } from '../../stores/types';
import { Coin } from '../shared/coin';

interface CardProps {
    card: ChampCard;
    action: (card: ChampCard) => void;
}

export class Card extends React.Component<CardProps> {

    public render() {
        const { card, action } = this.props;
        const { name, cost, id, classes } = card.champ;

        const style = {
            backgroundImage: `url(${process.env.PUBLIC_URL}/img/champ-square/${id}.png)`
        };

        return (
            <div className={`champ-card champ-cost-${cost}`} onClick={() => action(card)}>
                <div className="decoration"></div>
                <div className={`hero champ-bg-${id}`} style={style}>
                    {classes.map(x => <div className="champ-class" key={x}>{x}</div>)}
                </div>
                <div className={`banner banner-cost-${cost}`}>
                    <div className="name">{name}</div>
                    <div className="cost">
                        <span>
                            <Coin />
                            {cost}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}