import * as React from 'react';

import './card.scss';

interface CardProps {
    id: string,
    name: string,
    cost: number,
    classes: string[]
}

export class Card extends React.Component<CardProps> {

    public render() {
        const { name, cost, id, classes } = this.props;

        const style = {
            backgroundImage: `url('img/champ-square/${id}.png')`
        };

        return (
            <div className={`champ-card champ-cost-${cost}`}>
                <div className={`hero champ-bg-${id}`} style={style}>
                    {classes.map(x => <div className="champ-class" key={x}>{x}</div>)}
                </div>
                <div className={`banner banner-cost-${cost}`}>
                    <div className="name">{name}</div>
                    <div className="cost">{cost}</div>
                </div>
            </div>
        )
    }
}