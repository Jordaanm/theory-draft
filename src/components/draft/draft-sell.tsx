import * as React from 'react';
import { DraftStore } from '../../stores/draft-store';
import { Coin } from '../shared/coin';
import { observer } from 'mobx-react';

interface DraftSellProps {
    draft: DraftStore;
}

@observer
export class DraftSell extends React.Component<DraftSellProps> {
    
    public render() {

        const { draft } = this.props;
        const { selectedUnit } = draft;
        if(selectedUnit === undefined || !selectedUnit.unit) { return null; }

        const { name } = selectedUnit.unit.champ;
        const cost = draft.getUnitSalePrice(selectedUnit.unit);

        return (
            <div className="draft-sell draft-area" onClick={() => draft.sellSelectedUnit()}>
                <i className="trash"></i>
                <span>Sell {name} for <Coin /> {cost} </span>
            </div>
        );
    }
}