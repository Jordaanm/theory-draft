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
            <div><i>Draw a new hand of cards</i></div>
        </>
    );
};

const renderBuyXpTooltip = () => {
    return (
        <>
            <div>Buy XP [Shift + F]</div>
            <div><i>Purchase 4 XP to help increase your level. Increasing your level allows you to place more units on the board</i></div>
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
            <div><i>Locking prevents a new hand of cards being drawn at the start of a new round.</i></div>
            <div>Your hand is currently {draft.isHandLocked ? 'locked' : 'unlocked'}</div>
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