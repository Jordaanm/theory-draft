import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { DraftStore } from '../../stores/draft-store';

import './simulation.scss';
import { SynergiesBar } from '../synergies/synergies-bar';

interface SimulationProps {
    draft?: DraftStore
}

@inject("draft")
@observer
export class Simulation extends React.Component<SimulationProps> {
    public render() {
        const { draft } = this.props;
        const { level, showPlaced, placedUnitCount } = draft;
        if (!draft) { return null; }

        const fadeClass = showPlaced ? '' : 'fade';

        return (
            <section className="simulation">
                <div className="inner">
                    <SynergiesBar draft={draft} />
                    <div className={`level-section ${fadeClass}`}>
                        <span>Units Placed: { placedUnitCount } / { level }</span>
                    </div>
                </div>
            </section>
        );
    }
}