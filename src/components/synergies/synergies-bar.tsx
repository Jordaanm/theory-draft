import * as React from 'react';
import { observer } from 'mobx-react';

import { Synergy } from '../../stores/types';
import { Summoner } from '../../stores/summoner';
import { SynergyTier } from './synergy-tier';

import "./synergy.scss";

interface SynergiesBarProps {
    player: Summoner;
}

@observer
export class SynergiesBar extends React.Component<SynergiesBarProps> {

    public render() {
        const goldItems = this.getSynergiesOfTier(1);
        const silverItems = this.getSynergiesOfTier(2);
        const bronzeItems = this.getSynergiesOfTier(3);
        const greyItems = this.getSynergiesOfTier(4);

        const tiers = [ goldItems, silverItems, bronzeItems, greyItems ];

        return (
            <section className="synergies">
                { tiers.map((tier, index) => 
                    <SynergyTier synergies={tier} tier={index + 1} key={`tier_${index + 1}`} />
                )}
            </section>

        );
    }

    private getSynergiesOfTier(tier: number): Synergy[] {
        const { player } = this.props;
        return player.unitSynergiesWithTiers.filter(s => s.tier === tier);
    }
}