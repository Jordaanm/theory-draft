import * as React from 'react';
import { DraftStore } from '../stores/draft-store';
import { useHotkeys } from 'react-hotkeys-hook';

interface HotKeysProps{
    draft: DraftStore;
}

export const Hotkeys: React.FC<HotKeysProps> = ({draft}) =>{
    useHotkeys("shift+r", () => draft.nextRound());
    useHotkeys('shift+d', () => draft.refreshHand());
    useHotkeys('shift+f', () => draft.buyXP());
    return null;
}