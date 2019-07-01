import * as React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { BoardUnit } from '../../stores/types';
import { Champion } from '../champion/champion';
import { Types } from '../../stores/drag-drop';

interface CellProps {
    boardUnit: BoardUnit;
    isActive: boolean;
    onPickUpUnit: (unit: Unit, index: number) => void;
    onDropUnit: () => void;
    onDrop:(source: any, dest: any) => void;
}

export const Cell: React.FC<CellProps> = ({
    boardUnit,
    isActive,
    onPickUpUnit,
    onDropUnit,
    onDrop
 }) => {
    const { unit, index } = boardUnit;
    
    const [{isDragging}, drag] = useDrag({
        item: { unit, index, type: Types.BOARD },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        }),
        begin: () => onPickUpUnit(unit, index),
        end: () => onDropUnit()
    });

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: [Types.BENCH, Types.BOARD],
        drop: (item) => onDrop(item, {
            unit,
            index,
            type: Types.BOARD
        }),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });    

    const dragClass = isDragging ? 'dragging' : '';
    const activeClass = isActive ? 'active' : '';
    const overClass = isOver && canDrop ? 'drag-over' : '';

    return (
        <div ref={drop} className={`cell ${dragClass} ${activeClass} ${overClass}`}>
            <div ref={drag} className="contents">
                {Boolean(unit) && <Champion unit={unit} /> }
            </div>
        </div>
    );
}