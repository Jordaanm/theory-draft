import * as React from 'react';
import { CellOccupancy } from './cell-occupancy';
import { Cell } from './cell';
interface BoardProps {
    cellData: CellOccupancy[];
}

export class Board extends React.Component<BoardProps> {
    public static WIDTH = 7;
    public static HEIGHT = 3;

    public constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
    }

    public render() {

        let fullBoard = [];
        for (let x = 0; x < Board.WIDTH * Board.HEIGHT; ++x) {
            fullBoard.push(this.findCellData(x) || Board.getCoords(x));
        }

        let rows = [];
        for (let x = 1; x <= Board.HEIGHT; ++x) {
            rows.push(this.getRow(fullBoard, x));
        }

        return (
            <div className="board">
                {rows.map(this.renderRow)}                
            </div>
        );
    }

    private getRow(fullBoard, i) {
        const start = Board.WIDTH * (i-1);
        const end = Board.WIDTH * i;

        return fullBoard.slice(start, end);
    }


    private renderRow(cells, row) {
        const isOdd = row%2 === 1; 
        return (
            <div className="board__row" key={row}>
                {isOdd && <div className="board-spacer spacer--left"></div>}
                {cells.map(c=>
                    <Cell key={c.x + ',' + c.y} {...c} />
                )}
                {!isOdd && <div className="board-spacer spacer--right"></div>}
            </div>
        );
    }

    private findCellData(index) {
        const { cellData } = this.props;
        const {x, y} = Board.getCoords(index);

        return cellData.find(datum => datum.x === x && datum.y === y) || null;
    }

    public static getIndex(x, y) {
        return y * Board.WIDTH + x;
    }

    public static getCoords(index) {
        return {
            x: index % Board.WIDTH,
            y: Math.floor(index / Board.WIDTH)
        };
    }
}