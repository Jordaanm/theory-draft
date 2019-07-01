import * as React from 'react';
import { BenchSlot } from './bench-slot';
import './bench.scss';
import { inject, observer } from 'mobx-react';
import { DraftStore } from '../../stores/draft-store';
import { UnitSelection, Unit } from '../../stores/types';
import { Types } from '../../stores/drag-drop';
interface BenchProps {
    draft?: DraftStore;
}

@inject('draft')
@observer
export class Bench extends React.Component<BenchProps> {
    public render() {
        const { draft } = this.props;
        const { benchedUnits, activeUnit } = draft;
        const activeBenchIndex = (activeUnit !== undefined && activeUnit.isBenched) ? activeUnit.index : -1;

        return (
            <div className="bench">
                {benchedUnits.map((unit, index) => <BenchSlot
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
        const { draft } = this.props;
        draft.unitPickedUp({
            unit,
            index,
            isBenched: true
        } as UnitSelection);
        
    }

    private onDropUnit() {
        const { draft } = this.props;
        draft.unitDropped();
    }

    private onDrop(source, dest) {
        const { draft } = this.props;
        console.log("on drop", source, dest);
        
        const selectionA = {
            unit: source.unit,
            index: source.index,
            isBenched: source.type === Types.BENCH
        } as UnitSelection;
        const selectionB = {
            unit: dest.unit,
            index: dest.index,
            isBenched: dest.type === Types.BENCH
        } as UnitSelection;

        //Is destination empty
        if(!dest.unit) {
            console.log("Move unit to Empty Space", dest);
            draft.shiftUnitToBench(selectionA, dest.index);
        } else {
            console.log("Swap Positions with another unit", dest);
            draft.swapUnits(selectionA, selectionB);
        }

    }
}