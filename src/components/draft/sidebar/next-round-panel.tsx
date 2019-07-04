import * as React from 'react';

interface NextRoundPanelProps {
    nextRound: () => void;
    setTooltip: (area?: string) => void;
    isPaused: boolean;
    timer: number;
    currentRound: number;
}

export const NextRoundPanel: React.FC<NextRoundPanelProps> = ({ nextRound, setTooltip, isPaused, timer, currentRound }) => {
    return (<div className="sidebar-item next-round clickable" onClick={nextRound}>
        <div className="next-round-panel" onMouseEnter={() => setTooltip('nextRound')} onMouseLeave={() => setTooltip(null)}>
            <div className="content">
                <div>Go to Next Round</div>
                <div>{timer}s</div>
                <div>Current Round: {currentRound}</div>
            </div>
            <div className="icon" style={{backgroundImage: "url(img/next-round.png)"}}>
            </div>
        </div>
    </div>);
}