import * as React from 'react';
import { Unit } from '../../stores/unit';

interface ChampionProps {
    unit: Unit;
}

export class Champion extends React.Component<ChampionProps> {

    public render() {
        const { unit } = this.props;

        const stars = this.getTierString(unit);

        return (
            <div className="champion">
                <div className="champion-name">{unit.name}</div>
                <div className="champion-tier">{stars}</div>
                <div className="champion-cost">{unit.cost}</div>
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