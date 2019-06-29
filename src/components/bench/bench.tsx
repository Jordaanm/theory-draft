import * as React from 'react';
import { BenchSlot } from './bench-slot';
import './bench.css';
import { inject, observer } from 'mobx-react';
import { DraftStore } from '../../stores/draft-store';
interface BenchProps {
    draft?: DraftStore;
}

@inject('draft')
@observer
export class Bench extends React.Component<BenchProps> {
    public render() {
        const { draft } = this.props;
        const { benchedUnits } = draft;

        return (
            <div className="bench">
                {benchedUnits.map(unit => <BenchSlot unit={unit} key={Math.random()}/>)}
            </div>
        );
    }
}