import * as React from 'react';

import "./tooltip.scss";

import { DraftStore } from '../../../stores/draft-store';
import { Coin } from '../../shared/coin';
import { Summoner } from '../../../stores/summoner';

interface TooltipProps {
    tooltip: string;
    draft: DraftStore;
}

const renderRefreshTooltip = () => {
    return (
        <>
            <div>Refresh [D]</div>
            <div>Refresh the store with a new set of champions</div>
        </>
    );
};

const renderBuyXpTooltip = () => {
    return (
        <>
            <div>Buy XP [F]</div>
            <div>Gain 4 XP toward your next level. Levelling up increases your team size and gives you access to stronger champions in the store. You gain 2 XP for free at the begninning of each round</div>
        </>
    );
};

const renderIncomeTooltip = (player: Summoner) => {
    return (
        <>
            <h4>Total Income <Coin /> {player.calculateIncome()}</h4>
            <div>Passive Income <Coin /> +{player.calculatePassiveIncome()}</div>
            <div>Interest (Max 5) <Coin /> +{player.calculateInterest()}</div>
            <div>Win/Lost Streak <Coin /> +{player.calculateStreakBonus()}</div>
        </>
    );
};

const renderTimerTooltip = (draft: DraftStore) => {
    return (
        <>
            <div>Toggle the Timer [P]</div>
            <div>{draft.isPaused ? 'Resume' : 'Pause'} the Round Timer</div>
        </>
    );
}

const renderNextRoundTooltip = (draft: DraftStore) => {
    return (
        <>
            <div>Go to the next round [R]</div>
            <div>Current Round: {draft.roundCount}</div>
        </>
    );
};

const renderLockHandTooltip = (player: Summoner) => {
    return (
        <>
            <div>Toggle Lock [L]</div>
            <div>{player.isHandLocked ? 'Unlock' : 'Lock'} your current store offerings.</div>
        </>
    );
};

const getContent = (tooltip: string, draft: DraftStore): string|React.ReactElement|null => {
    const { player } = draft;
    switch(tooltip) {
        case 'refresh': return renderRefreshTooltip();
        case 'income': return renderIncomeTooltip(player);
        case 'buyXp': return renderBuyXpTooltip();
        case 'nextRound': return renderNextRoundTooltip(draft);
        case 'lock': return renderLockHandTooltip(player);
        case 'timer': return renderTimerTooltip(draft);
        default: return null;
    }
}

export const Tooltip: React.FC<TooltipProps> = ({tooltip, draft}) => {
    if(!tooltip) { return null; }
    const content = getContent(tooltip, draft);

    return (
        <div className="tooltip">
            <div className="inner">
                {content}
            </div>
        </div>
    );
};