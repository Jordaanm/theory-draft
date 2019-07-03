import * as React from 'react';
import './draft.scss';
import { DraftStore } from '../../stores/draft-store';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react';
import { DraftSidebar } from './sidebar/draft-sidebar';
import { DraftMain } from './draft-main';
import { DraftSell } from './draft-sell';
import { Tooltip } from './tooltip/tooltip';
import { Coin } from '../shared/coin';

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
        const { gold } = draft;
        const showSell = draft.activeUnit !== undefined;

        const setTooltip = ((area: string) => this.setState({
            activeTooltip: area
        }));

        const lockClass = draft.isHandLocked ? 'closed' : 'open';

        return (
            <section className="draft">
                {!showSell && <>
                     <div className="draft-gold-bar above-bar" 
                        onMouseEnter={() => setTooltip('income')}
                        onMouseLeave={() => setTooltip(null)}
                    >
                        <div className="draft-gold">
                            <Coin/>{gold}
                        </div>
                    </div>
                    <div className="draft-lock above-bar"
                        onClick={() => draft.toggleHandLock()}
                        onMouseEnter={() => setTooltip('lock')}
                        onMouseLeave={() => setTooltip(null)}
                    >
                        <div className={`lock ${lockClass}`}></div>
                    </div> 
                </>}
                <DraftSidebar draft={draft} setTooltip={setTooltip} />
                <DraftMain draft={draft} />              
                {showSell && <DraftSell draft={draft} />}
                <Tooltip tooltip={this.state.activeTooltip} draft={draft} />
            </section>            
        );
    }

}