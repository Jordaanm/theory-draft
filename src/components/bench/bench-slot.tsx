import * as React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Unit } from '../../stores/types';
import { Champion } from '../champion/champion';
import { Types } from '../../stores/drag-drop';

interface BenchSlotProps {
    unit?: Unit;
    index: number;
    isActive: boolean;
    onPickUpUnit: (unit: Unit, index: number) => void;
    onDropUnit: () => void;
    onDrop:(source: any, dest: any) => void;
    onHoverStart: (unit: Unit, index: number) => void;
    onHoverEnd: () => void;
}

export const BenchSlot: React.FC<BenchSlotProps> = ({
    unit,
    index,
    isActive,
    onPickUpUnit,
    onDropUnit,
    onDrop,
    onHoverStart,
    onHoverEnd
}) => {    
    const [{isDragging}, drag] = useDrag({
        item: { unit, index, type: Types.BENCH },
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
            type: Types.BENCH
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
            className={`bench-slot ${activeClass} ${dragClass} ${overClass}`}
            onMouseEnter={() => onHoverStart(unit, index)}
            onMouseLeave={() => onHoverEnd()}
        >
            <div ref={unit ? drag : undefined} className="bench-slot-inner">
                {Boolean(unit) && <Champion unit={unit} />}
            </div>
        </div>
    );
}
