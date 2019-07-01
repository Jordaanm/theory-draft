import * as React from 'react';
import { DraftStore } from '../../../stores/draft-store';
import { Coin } from '../../shared/coin';
import { observer } from 'mobx-react';
import { RefreshPanel } from './draft-refresh-panel';
import { BuyXpPanel } from './draft-xp-panel';

interface DraftSidebarProps {
    draft: DraftStore;
    hideAboveBar: boolean;
    setTooltip: (area: string) => void;
}

@observer
export class DraftSidebar extends React.Component<DraftSidebarProps> {
    
    public render() {

        const { draft, hideAboveBar, setTooltip } = this.props;
        const { xp, nextLevelXp, level } = draft;

        const lockClass = draft.isHandLocked ? 'closed' : 'open';

        return (
            <div className="draft-sidebar draft-area">
                {!hideAboveBar && <div className="draft-lock above-bar" onClick={() => draft.toggleHandLock()}>
                    <div className={`lock ${lockClass}`}></div>
                </div> }
                <div className="draft-sidebar-items">
                    <RefreshPanel cost={DraftStore.REFRESH_COST} refresh={() => draft.refreshHand()} setTooltip={setTooltip}/>
                    <BuyXpPanel
                        cost={DraftStore.BUY_XP_COST}
                        buyXP={() => draft.buyXP()}
                        setTooltip={setTooltip}
                        level={level}
                        xp={xp}
                        nextLevelXp={nextLevelXp}
                    />
                </div>
            </div>
        );
    }
}