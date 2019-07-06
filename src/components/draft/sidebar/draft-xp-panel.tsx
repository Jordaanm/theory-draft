import * as React from 'react';
import { Coin } from '../../shared/coin';

interface BuyXpPanelProps {
    buyXP: () => void;
    cost: number;
    xp: number;
    nextLevelXp: number;
    level: number;
    setTooltip: (area: string) => void;
}

export const BuyXpPanel: React.FC<BuyXpPanelProps> = ({ buyXP, cost, xp, nextLevelXp, level, setTooltip }) => {
    
    const progress = xp/nextLevelXp * 100;
    const progressStyle = {
        transform: `translateX(${-100 + progress}%)`
    }

    return (
        <div className="sidebar-item xp clickable" onClick={() => buyXP()}>
            <div className="xp-panel" onMouseEnter={() => setTooltip('buyXp')} onMouseLeave={() => setTooltip("")}>
                <div className="details">
                    <div className="content">
                        <div className="label">Buy XP</div>
                        <div className="sub-label">
                            <Coin />{cost}
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
    );
}