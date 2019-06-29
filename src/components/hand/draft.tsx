import * as React from 'react';
import { Hand } from './hand';
import './draft.css';
import { DraftStore, ChampData } from '../../stores/draft-store';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';

interface DraftProps {
    draft?: DraftStore;
}

@inject('draft')
@observer
export class Draft extends React.Component<DraftProps> {
    public render() {
        const { draft } = this.props;
        const { currentHand, gold, xp, nextLevelXp, level } = draft;

        return (
            <div className="draft">
                <div className="draft-sidebar draft-area">
                    <div className="draft-lock above-bar">
                        Lock
                    </div>
                    <div className="draft-sidebar-items">
                        <div className="sidebar-item refresh">
                            <button onClick={() => draft.refreshHand()}>Refresh</button>
                        </div>
                        <div className="sidebar-item xp">
                            <button className="xp-panel" onClick={() => draft.buyXP()}>
                                <div className="label">Buy XP</div>
                                <div className="sub-label">() 4</div>
                                <div className="xp-progress">
                                    {/* TODO: XP stats */}
                                    <div className="xp-label">{xp}/{nextLevelXp}</div>
                                    <div className="xp-progress-bar">||....</div>
                                    <div className="level">{level}</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="draft-main draft-area">
                    <div className="draft-gold-bar above-bar">
                        <div className="draft-gold">
                            {gold}
                        </div>
                    </div>
                    <Hand hand={currentHand} action={x => this.buyUnit(x)} />
                </div>
            </div>            
        );
    }

    private buyUnit(champ: ChampData) {
        console.log("Attempting to buy champ", champ.name);
        this.props.draft.buyCard(champ);
    }
}