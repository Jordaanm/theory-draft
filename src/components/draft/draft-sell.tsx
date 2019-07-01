import * as React from 'react';
import { useDrop } from 'react-dnd';

import { DraftStore } from '../../stores/draft-store';
import { Coin } from '../shared/coin';
import { Types } from '../../stores/drag-drop';
import { UnitSelection } from '../../stores/types';
interface DraftSellProps {
    draft: DraftStore;
}

export const DraftSell: React.FC<DraftSellProps> = ({
    draft
}) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: [Types.BENCH, Types.BOARD],
        drop: (item) => onDrop(item, draft),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    const { activeUnit } = draft;
    if(activeUnit === undefined || !activeUnit.unit) { return null; }

    const { name } = activeUnit.unit.champ;
    const cost = draft.getUnitSalePrice(activeUnit.unit);

    const activeClass = canDrop && isOver ? 'active' : '';

    return (
        <div className={`draft-sell draft-area ${activeClass}`} ref={drop}>
            <div className="message">
                <i className="trash"></i>
                <span>Sell {name} for <Coin /> {cost} </span>
            </div>
            { canDrop && isOver && <div>
                Release to Sell
            </div> }
        </div>
    );
}

const onDrop = (item: any, draft: DraftStore) => {
    const selection = {
        unit: item.unit,
        index: item.index,
        isBenched: item.type === Types.BENCH
    } as UnitSelection;
    draft.sellUnit(selection);
};