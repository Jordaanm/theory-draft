import * as React from 'react';
import { DraftStore } from '../../stores/draft-store';
import { ChampCard } from '../../stores/types';
import { Hand } from './hand';
import { observer } from 'mobx-react';

interface DraftMainProps {
    draft: DraftStore;
}

@observer
export class DraftMain extends React.Component<DraftMainProps> {
    
    public render() {

        const { draft } = this.props;
        const { currentHand} = draft;

        return (
            <div className="draft-main draft-area">
                <Hand hand={currentHand} action={x => this.buyCard(x)} />
            </div>
        );
    }

    private buyCard(card: ChampCard) {
        this.props.draft.buyCard(card);
    }
}