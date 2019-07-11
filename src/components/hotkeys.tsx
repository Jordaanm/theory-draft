import * as React from 'react';
import { DraftStore } from '../stores/draft-store';
import { useHotkeys } from 'react-hotkeys-hook';

interface HotKeysProps{
    draft: DraftStore;
}

export const Hotkeys: React.FC<HotKeysProps> = ({draft}) =>{
    useHotkeys("r", () => draft.nextRound());
    useHotkeys("p", () => draft.toggleTimer());
    useHotkeys('d', () => draft.player.refreshHand());
    useHotkeys('f', () => draft.player.buyXP());
    useHotkeys('l', () => draft.player.toggleHandLock());
    useHotkeys('e', () => draft.player.sellHoveredUnit());
    return null;
}