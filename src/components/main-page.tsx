import * as React from 'react';

import './main-page.scss';

import { Board } from './board/board';
import { Bench } from './bench/bench';
import { Draft } from './draft/draft';

import { DraftStore } from '../stores/draft-store';
import { observable } from 'mobx';

import * as ChampionsData from '../data/champions.json';
import { Provider } from 'mobx-react';
import { Simulation } from './simulation/simulation';
export class MainPage extends React.Component {

    @observable
    draftStore: DraftStore = null;

    constructor(props) {
        super(props);
        this.draftStore = new DraftStore();

        this.draftStore.initializePool();
        this.draftStore.drawHand();
        console.log(this.draftStore);

        window["champions"] = ChampionsData;

    }

    public render() {
        return (
            <section className="main-page">
                <Provider draft={this.draftStore} >
                    <>
                        <div className="split">
                            <div className="split-section main">
                                <Board />
                                <Bench />
                            </div>
                            <div className="split-section aside">
                                <Simulation />
                            </div>
                        </div>
                        <Draft />
                    </>
                </Provider>
            </section>
        )
    }
}