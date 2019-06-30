import * as React from 'react';
import { BenchSlot } from './bench-slot';
import './bench.scss';
import { inject, observer } from 'mobx-react';
import { DraftStore } from '../../stores/draft-store';
import { UnitSelection, Unit } from '../../stores/types';
interface BenchProps {
    draft?: DraftStore;
}

@inject('draft')
@observer
export class Bench extends React.Component<BenchProps> {
    public render() {
        const { draft } = this.props;
        const { benchedUnits, selectedUnit } = draft;
        const selectedBenchIndex = (selectedUnit !== undefined && selectedUnit.isBenched) ? selectedUnit.index : -1;

        return (
            <div className="bench">
                {benchedUnits.map((unit, index) => <BenchSlot
                    unit={unit}
                    index={index}
                    isSelected={selectedBenchIndex === index}
                    onSelect={(unit, index) => this.onSelectUnit(unit, index)}
                    key={ `${unit ? unit.champ.id + '_' + unit.tier : 'blank'}_${index}`}
                />)}
            </div>
        );
    }

    private onSelectUnit(unit: Unit, index: number) {
        const { draft } = this.props;
        if(!unit) {
            draft.moveSelectedUnitToBench(index);
            return;
        }
        
        const selection = {
            unit,
            index,
            isBenched: true
        } as UnitSelection;

        draft.toggleSelectedUnit(selection);
    }
}