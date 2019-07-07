import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { DraftStore } from '../../stores/draft-store';
import { Summoner } from '../../stores/summoner';

import "./opponents.scss";
import { Champion } from '../champion/champion';

interface OpponentsProps {
    draft: DraftStore;
}

@inject('draft')
@observer
export class Opponents extends React.Component<OpponentsProps> {

    public render() {
        const { draft } = this.props;

        const opponents = draft.summoners.slice(1);

        return (
            <section className="opponents">
                {opponents.map((x, index) => this.renderOpponent(x, index))}
            </section>
        );
    }

    public renderOpponent(opponent: Summoner, index: number) {
        const units = opponent.allUnits
            .filter(x => x.unit !== undefined)
            .map(x => x.unit)
            .sort((a,b) => b.champ.name < a.champ.name ? 1 : -1)
            .sort((a, b) => b.tier - a.tier);
        return (
            <div className="summoner" key={index}>
                <div className="summoner-health">{opponent.health}</div>
                <div className="summoner-avatar">
                    <div className="health-display"></div>
                    <div className="summoner-avatar__icon"></div>
                </div>
                <div className="summoner__units">
                        {units.map((x, index) => 
                            <div className="summoner__unit" key={`${index}_${x.tier}_${x.champ.id}`}>
                                <Champion unit={x} />
                            </div>
                        )}
                </div>
            </div>
        );
    }
}