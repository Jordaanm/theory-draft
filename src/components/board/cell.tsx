import * as React from 'react';
import { BoardUnit } from '../../stores/types';
import { getCoordsForIndex } from '../../utils';
import { Champion } from '../champion/champion';

interface CellProps {
    boardUnit: BoardUnit;
    onSelect: (bu: BoardUnit) => void;
}

export class Cell extends React.Component<CellProps> {
    public render() {
        const { boardUnit, onSelect } = this.props;
        const { unit } = boardUnit;
        
        return (
            <div className="cell" onClick={() => onSelect(boardUnit)}>
                <div className="contents">
                    {unit && <Champion unit={unit} /> }
                </div>
            </div>
        )
    }
}