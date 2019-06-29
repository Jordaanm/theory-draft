import * as React from 'react';
import { Board } from './board/board';
import { Bench } from './bench/bench';
import { Draft } from './hand/draft';

import { DraftStore } from '../stores/draft-store';
import { observable } from 'mobx';

import * as ChampionsData from '../data/champions.json';
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

        const units = [...Array(Bench.BENCH_SIZE)].map(x => null);

        return (
            <section className="main-page">
                <Board cellData={[]}/>
                <Bench units={units} />
                <Draft currentHand={this.draftStore.currentHand} currentGold={23} />
            </section>
        )
    }
}