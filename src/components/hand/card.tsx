import * as React from 'react';

interface CardProps {
    id: string,
    name: string,
    cost: number,
    classes: string[]
}

export class Card extends React.Component<CardProps> {

    public render() {
        const { name } = this.props;

        return (
            <div className="champ-card">
                {name}
            </div>
        )
    }
}