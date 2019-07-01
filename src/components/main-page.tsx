import * as React from 'react';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'
import { observable } from 'mobx';
import { Provider } from 'mobx-react';

import './main-page.scss';

import { Board } from './board/board';
import { Bench } from './bench/bench';
import { Draft } from './draft/draft';

import { DraftStore } from '../stores/draft-store';
import { Simulation } from './simulation/simulation';
export class MainPage extends React.Component {

    @observable
    draftStore: DraftStore = null;

    constructor(props) {
        super(props);
        this.draftStore = new DraftStore();

        this.draftStore.initializePool();
        this.draftStore.drawHand();
    }

    public render() {
        return (
            <section className="main-page">                
				<DndProvider backend={MultiBackend(HTML5toTouch)}>
                    <Provider draft={this.draftStore} >
                        <>
                            <div className="split">
                                <div className="split-section aside">
                                    <Simulation />
                                </div>
                                <div className="split-section main">
                                    <Board />
                                    <Bench />
                                </div>
                            </div>
                            <Draft />
                        </>
                    </Provider>
                </DndProvider>
            </section>
        )
    }
}