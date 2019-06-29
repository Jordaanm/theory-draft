import * as React from 'react';
import { Unit } from '../../stores/types';
import { Champion } from '../champion/champion';

interface BenchSlotProps {
    unit?: Unit;
}

export class BenchSlot extends React.Component<BenchSlotProps> {
    public render() {
        const { unit } = this.props;

        return (
            <div className="bench-slot">
                {Boolean(unit) && <Champion unit={unit} />}
            </div>
        )
    }
}