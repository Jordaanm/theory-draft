import * as React from 'react';
import './draft.scss';
import { DraftStore } from '../../stores/draft-store';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import { DraftSidebar } from './sidebar/draft-sidebar';
import { DraftMain } from './draft-main';
import { DraftSell } from './draft-sell';
import { Tooltip } from './tooltip/tooltip';

interface DraftProps {
    draft?: DraftStore;
}

interface DraftState {
    activeTooltip?: string;
}

@inject('draft')
@observer
export class Draft extends React.Component<DraftProps, DraftState> {
    
    public constructor(props) {
        super(props);
        this.state = {
            activeTooltip: null
        };
    }

    public render() {
        const { draft } = this.props;

        const showSell = draft.activeUnit !== undefined;

        const setTooltip = ((area: string) => this.setState({
            activeTooltip: area
        }));

        return (
            <section className="draft">
                <DraftSidebar draft={draft} hideAboveBar={showSell} setTooltip={setTooltip} />
                <DraftMain draft={draft} hideAboveBar={showSell} setTooltip={setTooltip} />              
                {showSell && <DraftSell draft={draft} />}
                <Tooltip tooltip={this.state.activeTooltip} draft={draft} />
            </section>            
        );
    }

}