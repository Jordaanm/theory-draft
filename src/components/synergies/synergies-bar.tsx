import * as React from 'react';
import { DraftStore } from '../../stores/draft-store';
import { observer } from 'mobx-react';
import { Synergy } from '../../stores/types';
import { SynergyTier } from './synergy-tier';

import "./synergy.scss";

interface SynergiesBarProps {
    draft: DraftStore
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
        return this.props.draft.unitSynergiesWithTiers.filter(s => s.tier === tier);
    }
}