import * as React from 'react';

interface NextRoundPanelProps {
    nextRound: () => void;
    setTooltip: (area?: string) => void;
}

export const NextRoundPanel: React.FC<NextRoundPanelProps> = ({ nextRound, setTooltip }) => {
    return (<div className="sidebar-item next-round clickable" onClick={nextRound}>
        <div className="next-round-panel" onMouseEnter={() => setTooltip('nextRound')} onMouseLeave={() => setTooltip(null)}>
            <div className="content">
                <div>Next Round</div>
            </div>
            <div className="icon" style={{backgroundImage: "url(img/next-round.png)"}}>
            </div>
        </div>
    </div>);
}