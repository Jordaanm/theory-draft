import * as React from 'react';
import { Unit } from '../../stores/unit';
import { BenchSlot } from './bench-slot';
import './bench.css';
interface BenchProps {
    units: Unit[];
}

export class Bench extends React.Component<BenchProps> {

    public static BENCH_SIZE = 9;

    public render() {
        const { units } = this.props;

        return (
            <div className="bench">
                {units.map((unit, index) => <BenchSlot unit={unit} key={index}/>)}
            </div>
        );
    }
}