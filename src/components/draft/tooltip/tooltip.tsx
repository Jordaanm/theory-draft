import * as React from 'react';

import "./tooltip.scss";

import { DraftStore } from '../../../stores/draft-store';
import { Coin } from '../../shared/coin';

interface TooltipProps {
    tooltip: string;
    draft: DraftStore;
}

const renderRefreshTooltip = () => {
    return (
        <>
            <div>Refresh [Shift + D]</div>
            <div>Refresh the store with a new set of champions</div>
        </>
    );
};

const renderBuyXpTooltip = () => {
    return (
        <>
            <div>Buy XP [Shift + F]</div>
            <div>Gain 4 XP toward your next level. Levelling up increases your team size and gives you access to stronger champions in the store. You gain 2 XP for free at the begninning of each round</div>
        </>
    );
};

const renderIncomeTooltip = (draft: DraftStore) => {
    return (
        <>
            <h4>Total Income <Coin /> {draft.calculateIncome()}</h4>
            <div>Passive Income <Coin /> +{draft.calculatePassiveIncome()}</div>
            <div>Interest (Max 5) <Coin /> +{draft.calculateInterest()}</div>
            <div>Win/Lost Streak <Coin /> +{draft.calculateStreakBonus()}</div>
        </>
    );
};

const renderTimerTooltip = (draft: DraftStore) => {
    return (
        <>
            <div>Toggle the Timer [Shift + P]</div>
            <div>{draft.isPaused ? 'Resmue' : 'Pause'} the Round Timer</div>
        </>
    );
}

const renderNextRoundTooltip = (draft: DraftStore) => {
    return (
        <>
            <div>Go to the next round [Shift + R]</div>
            <div>Current Round: {draft.roundCount}</div>
        </>
    );
};

const renderLockHandTooltip = (draft: DraftStore) => {
    return (
        <>
            <div>Toggle Lock [Shift + L]</div>
            <div>{draft.isHandLocked ? 'Unlock' : 'Lock'} your current store offerings.</div>
        </>
    );
};

const getContent = (tooltip: string, draft: DraftStore): string|React.ReactElement => {
    switch(tooltip) {
        case 'refresh': return renderRefreshTooltip();
        case 'income': return renderIncomeTooltip(draft);
        case 'buyXp': return renderBuyXpTooltip();
        case 'nextRound': return renderNextRoundTooltip(draft);
        case 'lock': return renderLockHandTooltip(draft);
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