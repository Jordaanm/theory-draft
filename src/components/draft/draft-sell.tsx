import * as React from 'react';
import { useDrop } from 'react-dnd';

import { DraftStore } from '../../stores/draft-store';
import { Coin } from '../shared/coin';
import { Types } from '../../stores/drag-drop';
import { UnitSelection } from '../../stores/types';
import { Summoner } from '../../stores/summoner';

interface DraftSellProps {
    player: Summoner
}

export const DraftSell: React.FC<DraftSellProps> = ({ player }) => {
    const [{ isOver, canDrop }, drop] = useDrop({
        accept: [Types.BENCH, Types.BOARD],
        drop: (item) => onDrop(item, player),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    const { activeUnit } = player;
    if(activeUnit === undefined || !activeUnit.unit) { return null; }

    const { name } = activeUnit.unit.champ;
    const cost = DraftStore.getUnitSalePrice(activeUnit.unit);

    const activeClass = canDrop && isOver ? 'active' : '';

    return (
        <div className={`draft-sell draft-area ${activeClass}`} ref={drop}>
            <div className="">
                <i className="trash"></i>
            </div>
            <div className="message">
                <span>Sell {name} for <Coin /> {cost} </span>
            </div>
            { canDrop && isOver && <div>
                Release to Sell
            </div> }
            <div>[E] to sell unit while hovering over it</div>
        </div>
    );
}

const onDrop = (item: any, player: Summoner) => {
    const selection = {
        unit: item.unit,
        index: item.index
    } as UnitSelection;
    player.sellUnit(selection);
};