import * as React from 'react';
import { Hand } from './hand';
import './draft.css';
import { ChampData } from '../../stores/draft-store';

interface DraftProps {
    currentHand: ChampData[];
    currentGold: number;
}

export class Draft extends React.Component<DraftProps> {
    public render() {
        const { currentHand, currentGold } = this.props;

        return (
            <div className="draft">
                <div className="draft-sidebar">
                    <div className="draft-lock">
                        Lock
                    </div>
                    <div className="draft-sidebar-items">
                        <div className="sidebar-item refresh">
                            Refresh
                        </div>
                        <div className="sidebar-item xp">
                            <div className="xp-panel">
                                <div className="label">Buy XP</div>
                                <div className="sub-label">() 4</div>
                                <div className="xp-progress">
                                    {/* TODO: XP stats */}
                                    <div className="xp-label">4/16</div>
                                    <div className="xp-progress-bar">||....</div>
                                    <div className="level">5</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="draft-main">
                    <div className="draft-gold-bar">
                        <div className="draft-gold">
                            {currentGold}
                        </div>
                    </div>
                    <Hand hand={currentHand} />
                </div>
            </div>            
        );
    }
}