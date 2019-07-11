import * as React from 'react';
import { DraftStore } from '../../stores/draft-store';
import { Coin } from '../shared/coin';

import "./cheat-menu.scss";
import { ChampData } from '../../stores/types';

interface CheatMenuProps {
    draft: DraftStore;
}

interface CheatMenuState {
    champId: string;
    tier: number;
}

export class CheatMenu extends React.Component<CheatMenuProps, CheatMenuState> {

    constructor(props) {
        super(props);
        this.state = {
            champId: props.draft.dataStore.champions[0].id,
            tier: 1
        };

        this.setTier = this.setTier.bind(this);
        this.setChampId = this.setChampId.bind(this);
    }

    private setChampId(e) {
        this.setState({
            champId: e.target.value
        });
    }

    private setTier(e) {
        const parsed = Number.parseInt(e.currentTarget.value, 10);
        const tier = Math.max(1, Math.min(3, (parsed || 1)));
        this.setState({
            tier
        });
    }

    private addChamp() {
        const { champId, tier } = this.state;
        const { draft } = this.props;

        const champ: ChampData = draft.dataStore.champions.find(x => x.id === champId);

        console.log("Add Champ", champ, champId);

        if (champ) {
            draft.player.addChamp(champ, tier);
        }
    }

    render() {
        const { champId, tier } = this.state;
        const { draft } = this.props;
        const { player } = draft;

        const champions = draft.dataStore.champions;

        return (
            <section className="cheat-menu">
                <div className="cheat-menu__inner">
                    <div className="row">
                        <select onChange={this.setChampId} value={champId || undefined}>
                            {champions.map(c => 
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            )}
                        </select>
                        <input type="number" max={3} min={1} value={tier} onChange={this.setTier} />
                        <button className="action" onClick={() => this.addChamp()}>Add Champ</button>
                    </div>
                    <div className="row">
                        <button className="action" onClick={() => player.addGold(10)}>+ <Coin />10</button>
                        <button className="action" onClick={() => player.addGold(100)}>+ <Coin />100</button>
                        <button className="action" onClick={() => player.hideCheatMenu()}>Close Menu</button>
                    </div>
                </div>
            </section>
        );
    }
}