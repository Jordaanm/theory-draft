import * as React from 'react';
import { Cell } from './cell';
import { inject, observer } from 'mobx-react';
import { DraftStore } from '../../stores/draft-store';
import "./board.scss";
import { BOARD_HEIGHT, BOARD_WIDTH } from '../../utils';
import { BoardUnit, UnitSelection } from '../../stores/types';

interface BoardProps {
    draft?: DraftStore;
}

@inject('draft')
@observer
export class Board extends React.Component<BoardProps> {

    public constructor(props: BoardProps) {
        super(props);
    }

    public render() {
        const { draft } = this.props;

        if(!draft) { return; }

        const rows = [...Array(BOARD_HEIGHT)].map((_, index) => this.getRow(index + 1));

        return (
            <div className="board">
                {rows.map((row: BoardUnit[], index: number) => this.renderRow(row, index))}                
            </div>
        );
    }

    private getRow(i: number): BoardUnit[] {
        const { draft } = this.props;
        const start = BOARD_WIDTH * (i - 1);
        const end = BOARD_WIDTH * i;

        return draft.boardUnits.slice(start, end);
    }


    private renderRow(boardUnits: BoardUnit[], row: number) {
        const isOdd = row%2 === 1; 
        return (
            <div className="board__row" key={row}>
                {isOdd && <div className="board-spacer spacer--left"></div>}
                {boardUnits.map(bu=>
                    <Cell key={this.getKey(bu)} boardUnit={bu} onSelect={x => this.onSelect(x)} />
                )}
                {!isOdd && <div className="board-spacer spacer--right"></div>}
            </div>
        );
    }

    private getKey(boardUnit: BoardUnit): string {
        const { unit, index } = boardUnit;
        if(unit === undefined) {
            return `blank_${index}`;
        } else {
            return `${unit.champ.id}_${unit.tier}_${index}`;
        }
    }

    private onSelect(boardUnit: BoardUnit) {
        const { draft } = this.props;

        console.log("Selected Board Unit", boardUnit);
        //If empty space
        if(boardUnit.unit === undefined) {
            draft.moveSelectedUnitToBoard(boardUnit.index);
            return;
        }

        const selection = {
            unit: boardUnit.unit,
            index: boardUnit.index,
            isBenched: false
        } as UnitSelection;

        draft.toggleSelectedUnit(selection);
    }
}