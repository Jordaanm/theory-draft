import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { Summoner } from '../../stores/summoner';
import { SynergiesBar } from '../synergies/synergies-bar';

import './simulation.scss';

interface SimulationProps {
    player: Summoner;
}

@inject("player")
@observer
export class Simulation extends React.Component<SimulationProps> {
    public render() {
        const { player } = this.props;
        const { level, showPlaced, placedUnitCount } = player;

        const fadeClass = showPlaced ? '' : 'fade';

        return (
            <section className="simulation">
                <div className="inner">
                    <SynergiesBar player={player} />
                    <div className={`level-section ${fadeClass}`}>
                        <span>Units Placed: { placedUnitCount } / { level }</span>
                    </div>
                </div>
            </section>
        );
    }
}