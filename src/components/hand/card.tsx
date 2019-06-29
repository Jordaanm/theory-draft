import * as React from 'react';

import './card.scss';
import { ChampData } from '../../stores/draft-store';

interface CardProps {
    champ: ChampData;
    action: (ChampData) => void;
}

export class Card extends React.Component<CardProps> {

    public render() {
        const { champ, action } = this.props;
        const { name, cost, id, classes } = champ;

        const style = {
            backgroundImage: `url('img/champ-square/${id}.png')`
        };

        return (
            <div className={`champ-card champ-cost-${cost}`} onClick={() => action(champ)}>
                <div className="decoration"></div>
                <div className={`hero champ-bg-${id}`} style={style}>
                    {classes.map(x => <div className="champ-class" key={x}>{x}</div>)}
                </div>
                <div className={`banner banner-cost-${cost}`}>
                    <div className="name">{name}</div>
                    <div className="cost">
                        <span>
                            <img src="img/coin.svg" alt="cost"></img>
                            {cost}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}