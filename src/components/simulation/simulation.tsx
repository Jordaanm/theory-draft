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
        if (!draft) { return null; }

        return (
            <section className="simulation">
                <div className="inner">
                    <SynergiesBar draft={draft} />
                    <div className="level-section">
                        <span>Units Placed: {draft.placedUnitCount} / { draft.level}</span>
                    </div>
                    <div className="round-section">
                        <span>Current Round: {draft.roundCount}</span>
                        <button onClick={() => draft.nextRound()}>Next Round</button>
                    </div>
                </div>
            </section>
        );
    }
}