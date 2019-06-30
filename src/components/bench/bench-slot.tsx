import * as React from 'react';
import { Unit } from '../../stores/types';
import { Champion } from '../champion/champion';

interface BenchSlotProps {
    unit?: Unit;
    index: number;
    isSelected: boolean;
    onSelect: (unit: Unit, index: number) => void
}

export class BenchSlot extends React.Component<BenchSlotProps> {
    public render() {
        const { unit, index, onSelect, isSelected } = this.props;
        const selectedClass = isSelected ? 'selected' : '';
        return (
            <div className={`bench-slot ${selectedClass}`} onClick={() => onSelect(unit, index)}>
                {Boolean(unit) && <Champion unit={unit} />}
            </div>
        )
    }
}