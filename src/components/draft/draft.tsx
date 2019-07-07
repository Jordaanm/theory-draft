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
import { Summoner } from '../../stores/summoner';

interface DraftProps {
    player: Summoner;
    draft: DraftStore;
}

interface DraftState {
    activeTooltip: string;
}

@inject('draft', 'player')
@observer
export class Draft extends React.Component<DraftProps, DraftState> {
    
    public constructor(props: any) {
        super(props);
        this.state = {
            activeTooltip: ""
        };
    }

    public render() {
        const { player, draft } = this.props;
        const { gold } = player;
        const showSell = player.activeUnit !== undefined;

        const setTooltip = ((area: string) => this.setState({
            activeTooltip: area
        }));

        const lockClass = player.isHandLocked ? 'closed' : 'open';
        const timerClass = draft.isPaused ? 'pause' : 'play';
        return (
            <section className="draft">
                {!showSell && <>
                     <div className="draft-gold-bar above-bar" 
                        onMouseEnter={() => setTooltip('income')}
                        onMouseLeave={() => setTooltip("")}
                    >
                        <div className="draft-gold">
                            <Coin/>{gold}
                        </div>
                    </div>
                     <div className="draft-timer-bar above-bar" 
                        onClick={() => draft.toggleTimer()}
                        onMouseEnter={() => setTooltip('timer')}
                        onMouseLeave={() => setTooltip("")}
                    >
                        <div className="timer-bar">                    
                            <div className={`timer-icon ${timerClass}`}></div>
                        </div>
                    </div>
                    <div className="draft-lock above-bar"
                        onClick={() => player.toggleHandLock()}
                        onMouseEnter={() => setTooltip('lock')}
                        onMouseLeave={() => setTooltip("")}
                    >
                        <div className={`lock ${lockClass}`}></div>
                    </div> 
                </>}
                <DraftSidebar draft={draft} player={player} setTooltip={setTooltip} />
                <DraftMain player={player} />              
                {showSell && <DraftSell player={player} />}
                <Tooltip tooltip={this.state.activeTooltip} draft={draft} />
            </section>            
        );
    }

}