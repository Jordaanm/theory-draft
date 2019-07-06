import * as React from 'react';
import { Coin } from '../../shared/coin';

interface RefreshPanelProps {
    refresh: () => void;
    cost: number;
    setTooltip: (area: string) => void;
}

export const RefreshPanel: React.FC<RefreshPanelProps> = ({ refresh, cost, setTooltip }) => {
    return (<div className="sidebar-item refresh clickable" onClick={refresh}>
        <div className="refresh-panel" onMouseEnter={() => setTooltip('refresh')} onMouseLeave={() => setTooltip("")}>
            <div className="content">
                <div>Refresh</div>
                <div><Coin /> {cost}</div>
            </div>
            <div className="icon" style={{backgroundImage: "url(img/refresh.png)"}}>
            </div>
        </div>
    </div>);
}