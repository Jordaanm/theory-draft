import * as React from 'react';
// import { Board } from './board/board';
import { Bench } from './bench/bench';
import { Draft } from './hand/draft';

import { DraftStore } from '../stores/draft-store';
import { observable } from 'mobx';

import * as ChampionsData from '../data/champions.json';
import { Provider } from 'mobx-react';
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
                        <button onClick={() => this.draftStore.nextRound()}>Next Round</button>
                        {/* <Board cellData={[]}/> */}
                        <Bench />
                        <Draft />
                    </>
                </Provider>
            </section>
        )
    }
}