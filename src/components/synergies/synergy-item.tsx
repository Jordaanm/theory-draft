import * as React from 'react';
import { observer } from 'mobx-react';
import { Synergy } from '../../stores/types';

interface SynergyItemProps {
    synergy: Synergy;
}

@observer
export class SynergyItem extends React.Component<SynergyItemProps> {

    public render() {

        const { synergy } = this.props;
        const { tier } = synergy;

        const currentBonusIndex = tier === 4 ? -1 : synergy.stages.length - tier;
        const nextBonus = tier === 1 ? -1 : synergy.stages[currentBonusIndex + 1];
        console.log("H", synergy, currentBonusIndex, nextBonus);
        return (
            <div className={`synergy-item tier-${synergy.tier}`}>
                <div className="icon">
                   <img className="" alt="icon" src={`/img/class-icons/${synergy.id}.png`} />
                </div>
               <span>
                {synergy.name}: {synergy.count}
                {nextBonus > 0 && <span> / {nextBonus}</span>}
               </span>
            </div>
        );
    }
}