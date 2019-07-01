import * as React from 'react';
import { Coin } from '../../shared/coin';

interface RefreshPanelProps {
    refresh: () => void;
    cost: number;
}

export const RefreshPanel: React.FC<RefreshPanelProps> = ({ refresh, cost }) => {
    return (<div className="sidebar-item refresh clickable" onClick={refresh}>
        <div className="refresh-panel">
            <div className="content">
                <div>Refresh</div>
                <div><Coin /> {cost}</div>
            </div>
            <div className="icon" style={{backgroundImage: "url(img/refresh.png)"}}>
            </div>
        </div>
    </div>);
}