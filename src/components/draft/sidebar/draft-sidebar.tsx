import * as React from 'react';
import { DraftStore } from '../../../stores/draft-store';
import { observer } from 'mobx-react';
import { RefreshPanel } from './draft-refresh-panel';
import { BuyXpPanel } from './draft-xp-panel';
import { NextRoundPanel } from './next-round-panel';
import { Summoner } from '../../../stores/summoner';

interface DraftSidebarProps {
    draft: DraftStore;
    player: Summoner;
    setTooltip: (area: string) => void;
}

@observer
export class DraftSidebar extends React.Component<DraftSidebarProps> {
    
    public render() {

        const { draft, player, setTooltip } = this.props;
        const { xp, nextLevelXp, level } = player;

        return (
            <div className="draft-sidebar draft-area">
                <div className="draft-sidebar-items">
                    <RefreshPanel cost={DraftStore.REFRESH_COST} refresh={() => player.refreshHand()} setTooltip={setTooltip}/>
                    <BuyXpPanel
                        cost={DraftStore.BUY_XP_COST}
                        buyXP={() => player.buyXP()}
                        setTooltip={setTooltip}
                        level={level}
                        xp={xp}
                        nextLevelXp={nextLevelXp}
                    />
                    <NextRoundPanel 
                        nextRound={() => draft.nextRound()}
                        isPaused={draft.isPaused}
                        setTooltip={setTooltip}
                        timer={draft.roundTimer}
                        currentRound={draft.roundCount}
                    />
                </div>
            </div>
        );
    }
}