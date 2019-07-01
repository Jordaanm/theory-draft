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
            <div>Refresh your hand of cards</div>
            <div><i>Hotkey: Shift + D</i></div>
        </>
    );
};

const renderBuyXpTooltip = () => {
    return (
        <>
            <div>Buy 4 XP</div>
            <div><i>Hotkey: Shift + F</i></div>
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
    )
}

const getContent = (tooltip: string, draft: DraftStore): string|React.ReactElement => {
    switch(tooltip) {
        case 'refresh': return renderRefreshTooltip();
        case 'income': return renderIncomeTooltip(draft);
        case 'buyXp': return renderBuyXpTooltip();
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