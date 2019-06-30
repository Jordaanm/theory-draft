import * as React from 'react';
import { observer } from 'mobx-react';
import { Synergy } from '../../stores/types';

interface SynergyItemProps {
    synergy: Synergy;
}

@observer
export class SynergyItem extends React.Component<SynergyItemProps> {

    public render() {

        const { synergy} = this.props;

        return (
            <div className="synergy-item">
                {synergy.name}: {synergy.count}
            </div>
        );
    }
}