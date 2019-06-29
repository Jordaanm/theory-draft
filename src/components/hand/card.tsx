import * as React from 'react';

import './card.css';

interface CardProps {
    id: string,
    name: string,
    cost: number,
    classes: string[]
}

export class Card extends React.Component<CardProps> {

    public render() {
        const { name, cost, id, classes } = this.props;

        return (
            <div className="champ-card">
                <div className={`hero champ-bg-${id}`}>
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