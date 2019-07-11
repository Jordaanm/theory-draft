import * as React from 'react';
import { Cell } from './cell';
import { inject, observer } from 'mobx-react';
import { DraftStore } from '../../stores/draft-store';
import "./board.scss";
import { BOARD_HEIGHT, BOARD_WIDTH } from '../../utils';
import { BoardUnit, UnitSelection, Unit } from '../../stores/types';
import { Summoner } from '../../stores/summoner';

interface BoardProps {
    player: Summoner;
}

@inject('player')
@observer
export class Board extends React.Component<BoardProps> {

    public constructor(props: BoardProps) {
        super(props);
    }

    public render() {
        const { player } = this.props;

        if(!player) { return; }

        const rows = [...Array(BOARD_HEIGHT)].map((_, index) => this.getRow(index + 1));

        return (
            <div className="board">
                {rows.map((row: BoardUnit[], index: number) => this.renderRow(row, index))}                
            </div>
        );
    }

    private getRow(i: number): BoardUnit[] {
        const { player } = this.props;
        const start = BOARD_WIDTH * (i - 1);
        const end = BOARD_WIDTH * i;

        return player.boardUnits.slice(start, end);
    }


    private renderRow(boardUnits: BoardUnit[], row: number) {
        const { player } = this.props;
        const { activeUnit } = player;
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
                        onHoverStart={(unit, index) => this.onHoverStart(unit, index)}
                        onHoverEnd={() => this.onHoverEnd()}                        
                    />
                )}
                {!isOdd && <div className="board-spacer spacer--right"></div>}
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

    private onHoverStart(unit: Unit, index: number) {
        if(unit !== undefined) {
            this.props.player.enterUnit({
                unit,
                index
            } as BoardUnit);
        }
    }

    private onHoverEnd() {
        this.props.player.exitUnit();
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
    
    private getKey(boardUnit: BoardUnit): string {
        const { unit, index } = boardUnit;
        if(unit === undefined) {
            return `blank_${index}`;
        } else {
            return `${unit.champ.id}_${unit.tier}_${index}`;
        }
    }
}