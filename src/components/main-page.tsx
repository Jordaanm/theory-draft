import * as React from 'react';
import { DndProvider } from 'react-dnd';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'
import { observable } from 'mobx';
import { Provider, observer } from 'mobx-react';

import './main-page.scss';

import { Board } from './board/board';
import { Bench } from './bench/bench';
import { Draft } from './draft/draft';

import { DraftStore } from '../stores/draft-store';
import { Simulation } from './simulation/simulation';
import { Hotkeys } from './hotkeys';
import { SplashScreen } from './splash/splash';
import { DataStore } from '../stores/data-store';

@observer
export class MainPage extends React.Component {

    @observable
    draftStore: DraftStore = null;

    dataStore: DataStore = null;

    constructor(props) {
        super(props);
        this.dataStore = new DataStore();
        this.draftStore = new DraftStore(this.dataStore);
    }

    public render() {
        const showSp1ash = this.draftStore.isSplashOpen;

        if(showSp1ash) {
            return (
                <section className="main-page">
                    <SplashScreen data={this.dataStore} begin={() => this.draftStore.start()} />
                </section>
            );
        }

        return (
            <section className="main-page">
				<DndProvider backend={MultiBackend(HTML5toTouch)}>
                    <Provider draft={this.draftStore} >
                        <>
                            <div className="board-container">
                                <div className="sidebar">
                                    <Simulation />
                                </div>
                                <div className="board-and-bench">
                                    <Board />
                                    <Bench />
                                </div>
                            </div>
                            <Draft />
                        </>
                    </Provider>
                </DndProvider>
                <Hotkeys draft={this.draftStore} />
            </section>
        )
    }
}