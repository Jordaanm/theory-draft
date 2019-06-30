import * as React from 'react';
import './draft.scss';
import { Hand } from './hand';
import { DraftStore } from '../../stores/draft-store';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import { Coin } from '../shared/coin';
import { ChampCard } from '../../stores/types';

interface DraftProps {
    draft?: DraftStore;
}

@inject('draft')
@observer
export class Draft extends React.Component<DraftProps> {
    public render() {
        const { draft } = this.props;
        const { currentHand, gold, xp, nextLevelXp, level } = draft;
        const progress = xp/nextLevelXp * 100;
        const progressStyle = {
            transform: `translateX(${-100 + progress}%)`
        }

        const lockClass = draft.isHandLocked ? 'closed' : 'open';

        return (
            <div className="draft">
                <div className="draft-sidebar draft-area">
                    <div className="draft-lock above-bar" onClick={() => draft.toggleHandLock()}>
                        <div className={`lock ${lockClass}`}></div>
                    </div>
                    <div className="draft-sidebar-items">
                        <div className="sidebar-item refresh clickable" onClick={() => draft.refreshHand()}>
                            <div className="refresh-panel">
                                <div className="content">
                                    <div>Refresh</div>
                                    <div><Coin /> {DraftStore.REFRESH_COST}</div>
                                </div>
                                <div className="icon" style={{backgroundImage: "url(img/refresh.png)"}}>
                                </div>
                            </div>
                        </div>
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
                <div className="draft-main draft-area">
                    <div className="draft-gold-bar above-bar">
                        <div className="draft-gold">
                            <Coin/>{gold}
                        </div>
                    </div>
                    <Hand hand={currentHand} action={x => this.buyCard(x)} />
                </div>
            </div>            
        );
    }

    private buyCard(card: ChampCard) {
        console.log("Attempting to buy champ", card.champ.name);
        this.props.draft.buyCard(card);
    }
}