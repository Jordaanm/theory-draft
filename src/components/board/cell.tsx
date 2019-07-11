import * as React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { BoardUnit, Unit } from '../../stores/types';
import { Champion } from '../champion/champion';
import { Types } from '../../stores/drag-drop';
// import {Preview } from 'react-dnd-multi-backend';

interface CellProps {
    boardUnit: BoardUnit;
    isActive: boolean;
    onPickUpUnit: (unit: Unit, index: number) => void;
    onDropUnit: () => void;
    onDrop:(source: any, dest: any) => void;
    onHoverStart: (unit: Unit, index: number) => void;
    onHoverEnd: () => void;
}

// const generatePreview = (type, item, style) => {
//     const modStyle = {
//         ...style,
//         width: '8em',
//         height: '8em'
//     };
//     return <div className="cell" style={modStyle}>
//         <div className="contents">
//             <Champion unit={item.unit} />
//         </div>
//     </div>;
// }

export const Cell: React.FC<CellProps> = ({
    boardUnit,
    isActive,
    onPickUpUnit,
    onDropUnit,
    onDrop,
    onHoverStart,
    onHoverEnd
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
        <div
            ref={drop}
            className={`cell ${dragClass} ${activeClass} ${overClass}`}
            onMouseEnter={() => onHoverStart(unit, index)}
            onMouseLeave={() => onHoverEnd()}
        >
            <div ref={unit ? drag : undefined} className="contents">
                {Boolean(unit) && <Champion unit={unit} /> }
            </div>
            {/* <Preview generator={generatePreview} /> */}
        </div>
    );
}