import * as React from 'react';
import './draft.scss';
import { DraftStore } from '../../stores/draft-store';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import { DraftSidebar } from './sidebar/draft-sidebar';
import { DraftMain } from './draft-main';
import { DraftSell } from './draft-sell';

interface DraftProps {
    draft?: DraftStore;
}

@inject('draft')
@observer
export class Draft extends React.Component<DraftProps> {
    
    public render() {
        const { draft } = this.props;

        const showSell = draft.activeUnit !== undefined;

        return (
            <section className="draft">
                <DraftSidebar draft={draft} hideAboveBar={showSell} />
                <DraftMain draft={draft} hideAboveBar={showSell}/>              
                {showSell && <DraftSell draft={draft} />}
            </section>            
        );
    }

}