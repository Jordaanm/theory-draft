import * as React from 'react';
import { DraftStore } from '../../../stores/draft-store';
import { Coin } from '../../shared/coin';
import { observer } from 'mobx-react';
import { useHotkeys } from 'react-hotkeys-hook'
import { RefreshPanel } from './draft-refresh-panel';

interface DraftSidebarProps {
    draft: DraftStore;
    hideAboveBar: boolean;
}

@observer
export class DraftSidebar extends React.Component<DraftSidebarProps> {
    
    public render() {

        const { draft, hideAboveBar } = this.props;
        const { xp, nextLevelXp, level } = draft;

        const progress = xp/nextLevelXp * 100;
        const progressStyle = {
            transform: `translateX(${-100 + progress}%)`
        }

        const lockClass = draft.isHandLocked ? 'closed' : 'open';

        return (
            <div className="draft-sidebar draft-area">
                {!hideAboveBar && <div className="draft-lock above-bar" onClick={() => draft.toggleHandLock()}>
                    <div className={`lock ${lockClass}`}></div>
                </div> }
                <div className="draft-sidebar-items">
                    <RefreshPanel cost={DraftStore.REFRESH_COST} refresh={() => draft.refreshHand()} />
                    <div className="sidebar-item xp clickable" onClick={() => draft.buyXP()}>
                        <div className="xp-panel">
                            <div className="details">
                                <div className="content">
                                    <div className="label">Buy XP</div>
                                    <div className="sub-label">
                                        <Coin />{DraftStore.BUY_XP_COST}
                                    </div>
                                </div>
                                <div className="icon" style={{backgroundImage: "url(img/level-up.png)"}}></div>
                            </div>
                            <div className="xp-progress">
                                <div className="xp-label">{xp}/{nextLevelXp}</div>
                                <div className="xp-progress-bar">
                                    <div className="bar">
                                        <div className="fill" style={progressStyle}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="level">{level}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}