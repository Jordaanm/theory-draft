import * as React from 'react';
import { Unit } from '../../stores/types';

interface ChampionProps {
    unit: Unit;
}

export class Champion extends React.Component<ChampionProps> {

    public render() {
        const { unit } = this.props;
        const { champ } = unit;

        const stars = this.getTierString(unit);

        const style = {
            backgroundImage: `url(${process.env.PUBLIC_URL}/img/champ-square/${champ.id}.png)`
        };

        return (
            <div className={`champion champion--tier-${unit.tier}`} style={style}>
                <div className="champion-tier">{stars}</div>
                <div className="champion-name">{champ.name}</div>
            </div>
        );
    }

    private getTierString(unit: Unit): string {
        switch(unit.tier) {
            case 1: return '★';
            case 2: return '★★';
            case 3: return '★★★';
        }
    }
}