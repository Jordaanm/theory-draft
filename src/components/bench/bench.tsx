import * as React from 'react';
import { BenchSlot } from './bench-slot';
import { inject, observer } from 'mobx-react';
import { DraftStore } from '../../stores/draft-store';
import { UnitSelection, Unit } from '../../stores/types';
import { Summoner } from '../../stores/summoner';

import './bench.scss';

interface BenchProps {
    player: Summoner;
}

@inject('player')
@observer
export class Bench extends React.Component<BenchProps> {
    public render() {
        const { player } = this.props;
        const { benchedUnits, activeUnit } = player;
        const activeBenchIndex = (activeUnit !== undefined && activeUnit.index < DraftStore.BENCH_SIZE) ? activeUnit.index : -1;

        return (
            <div className="bench">
                {benchedUnits.map(({unit, index}) => <BenchSlot
                    unit={unit}
                    index={index}
                    isActive={activeBenchIndex === index}
                    onPickUpUnit={(unit, index) => this.onPickUpUnit(unit, index)}
                    onDropUnit={() => this.onDropUnit()}
                    onDrop={(source, dest) => this.onDrop(source, dest)}
                    key={ `${unit ? unit.champ.id + '_' + unit.tier : 'blank'}_${index}`}
                />)}
            </div>
        );
    }

    private onPickUpUnit(unit: Unit, index: number) {
        const { player } = this.props;
        player.unitPickedUp({
            unit,
            index
        } as UnitSelection);
        
    }

    private onDropUnit() {
        const { player } = this.props;
        player.unitDropped();
    }

    private onDrop(source, dest) {
        const { player } = this.props;
        
        const selectionA = {
            unit: source.unit,
            index: source.index
        } as UnitSelection;
        const selectionB = {
            unit: dest.unit,
            index: dest.index
        } as UnitSelection;

        //Is destination empty
        if(!dest.unit) {
            player.shiftUnitToSlot(selectionA, dest.index);
        } else {
            player.swapUnits(selectionA, selectionB);
        }

    }
}