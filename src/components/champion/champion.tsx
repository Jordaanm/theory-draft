import * as React from 'react';
import { Unit } from '../../stores/unit';

interface ChampionProps {
    unit: Unit;
}

export class Champion extends React.Component<ChampionProps> {

    public render() {
        const { unit } = this.props;
        const { champ } = unit;

        const stars = this.getTierString(unit);

        return (
            <div className="champion">
                <div className="champion-name">{champ.name}</div>
                <div className="champion-tier">{stars}</div>
            </div>
        );
    }

    private getTierString(unit: Unit): string {
        switch(unit.tier) {
            case 1: return '*';
            case 2: return '**';
            case 3: return '***';
        }
    }
}