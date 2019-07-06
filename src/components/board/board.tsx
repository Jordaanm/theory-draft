import * as React from 'react';
import { Cell } from './cell';
import { inject, observer } from 'mobx-react';
import { DraftStore } from '../../stores/draft-store';
import "./board.scss";
import { BOARD_HEIGHT, BOARD_WIDTH } from '../../utils';
import { BoardUnit, UnitSelection, Unit } from '../../stores/types';

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
        const {draft} = this.props;
        const { activeUnit } = draft;
        const isOdd = row % 2 === 1;
        const activeBoardIndex = (activeUnit !== undefined && activeUnit.index >= DraftStore.BENCH_SIZE) ? activeUnit.index : -1;

        return (
            <div className="board__row" key={row}>
                {isOdd && <div className="board-spacer spacer--left"></div>}
                {boardUnits.map(bu=>
                    <Cell
                        key={this.getKey(bu)}
                        boardUnit={bu}
                        isActive={activeBoardIndex === bu.index}
                        onPickUpUnit={(unit, index) => this.onPickUpUnit(unit, index)}
                        onDropUnit={() => this.onDropUnit()}
                        onDrop={(source, dest) => this.onDrop(source, dest)}                        
                    />
                )}
                {!isOdd && <div className="board-spacer spacer--right"></div>}
            </div>
        );
    }

    private onPickUpUnit(unit: Unit, index: number) {
        const { draft } = this.props;
        draft.unitPickedUp({
            unit,
            index
        } as UnitSelection);
        
    }

    private onDropUnit() {
        const { draft } = this.props;
        draft.unitDropped();
    }

    private onDrop(source, dest) {
        const { draft } = this.props;
        console.log("onDrop", source, dest);
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
            draft.shiftUnitToSlot(selectionA, dest.index);
        } else {
            draft.swapUnits(selectionA, selectionB);
        }
    }
    
    private getKey(boardUnit: BoardUnit): string {
        const { unit, index } = boardUnit;
        if(unit === undefined) {
            return `blank_${index}`;
        } else {
            return `${unit.champ.id}_${unit.tier}_${index}`;
        }
    }
}