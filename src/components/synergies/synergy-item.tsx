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
        const nextBonus = tier === 1 ? -1 : synergy.stages[currentBonusIndex + 1].amount;
        
        const bonusesToDisplay = synergy.stages.slice(0, currentBonusIndex + 2).map((stage, index) => ({
            ...stage,
            isActive: synergy.exact ? index === currentBonusIndex : index <= currentBonusIndex
        }));

        return (
            <div className={`synergy-item tier-${synergy.tier}`}>
                <div className="icon">
                   <img className="" alt="icon" src={`img/class-icons/${synergy.id}.png`} />
                </div>
               <span>
                <span className="synergy-name">{synergy.name}: </span>{synergy.count}
                {nextBonus > 0 && <span> / {nextBonus}</span>}
               </span>
               <div className="tooltip">
                    <div className="tooltip-name">
                        <img className="tooltip-icon" alt="icon" src={`img/class-icons/${synergy.id}.png`} />
                        <span>{synergy.name}</span>
                    </div>
                    <div className="separator"></div>
                    <div className="bonus-section">
                        {synergy.passive && <div className="synergy-passive">Passive: {synergy.passive}</div>}
                        {bonusesToDisplay.length > 0 && synergy.base &&
                            <div className="synergy-base">Synergy: {synergy.base}</div>
                        }
                        {bonusesToDisplay.map((item) => 
                            <div className={`synergy-bonus ${item.isActive ? 'active' : ''}`} key={item.amount}>
                                ({item.amount}) {item.bonus}
                            </div>
                        )}
                    </div>
               </div>
            </div>
        );
    }
}