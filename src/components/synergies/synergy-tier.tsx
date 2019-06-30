import * as React from 'react';
import { observer } from 'mobx-react';
import { Synergy } from '../../stores/types';
import { SynergyItem } from './synergy-item';

interface SynergyTierProps {
    synergies: Synergy[];
    tier: number;
}

@observer
export class SynergyTier extends React.Component<SynergyTierProps> {

    public render() {

        const { synergies, tier} = this.props;
        if(synergies.length === 0) { return null; }

        return (
            <div className="synergy-tier">
                <ul className={`tier-${tier}`}>
                    {synergies.map( s => <SynergyItem synergy={s} key={s.id} />)}
                </ul>                
            </div>
        );
    }
}