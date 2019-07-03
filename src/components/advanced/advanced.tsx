import * as React from 'react';
import { DataStore } from '../../stores/data-store';
import { Editor } from './editor';

import "./advanced.scss";

interface AdvancedScreenProps {
    data: DataStore;
    close: () => void;
}

interface AdvancedScreenState {
    activeDataset: string;
    updatedData: any;
}

export class AdvancedScreen extends React.Component<AdvancedScreenProps, AdvancedScreenState> {
    
    constructor(props) {
        super(props);
        const data: DataStore = props.data;

        this.state = {
            activeDataset: null,
            updatedData: null
        };
    }

    private updateActiveDataset(json) {
        const { activeDataset } = this.state;
        if(!activeDataset) { return; }
        this.setState({ updatedData: json });
    }

    private getActiveJson() {
        const {activeDataset} = this.state;
        const {data} = this.props;

        const mapToObj = m => JSON.parse(JSON.stringify(m));

        switch(activeDataset) {
            case "levels": return mapToObj(data.levels);
            case "tiers": return mapToObj(data.unitsPerTier);
            case "champs": return mapToObj(data.champions);
            default: return "";
        }
    }

    private getSchema() {
        return null;
    }

    private getTitle() {
        switch(this.state.activeDataset) {
            case "levels": return "Levels";
            case "tiers": return "Units Per Tier";
            case "champs": return "Champions";
            default: return "";
        }
    }

    private applyChanges() {
        const { activeDataset, updatedData } = this.state;
        const { data } = this.props;

        if(!activeDataset) { return; }

        if(activeDataset === 'levels') {
            data.setLevelsFromJson(updatedData);
        } else if(activeDataset === 'tiers') {
            data.setUnitsPerTierFromJson(updatedData);
        } else if(activeDataset === 'champs') {
            data.setChampsFromJson(updatedData);
        }
    }

    private setActiveDataset(val) {
        return () => {
            
            this.setState({
                activeDataset: null
            }, () => this.setState({
                activeDataset: val
            }));
        }
    }

    public render(){
        const { close } = this.props;
        const { activeDataset } = this.state;

        const setActive = this.setActiveDataset.bind(this);

        return (
            <div className="advanced-screen">
                <div className="inner">
                    <div className="close" onClick={close}>X</div>
                    <h2>Edit Datasets</h2>
                    <div className="actions">
                        <button className="action" onClick={setActive('champs')}>
                            Champions
                        </button>
                        <button className="action" onClick={setActive('tiers')}>
                            Levels
                        </button>
                        <button className="action" onClick={setActive('levels')}>
                            Units Per Tier
                        </button>
                    </div>
                    {activeDataset && <div className="editor-container">
                        <h4>Editing {this.getTitle()}</h4>
                        <Editor
                            json={this.getActiveJson()}
                            onChange={(j) => this.updateActiveDataset(j)}
                            schema={this.getSchema()}
                        />
                        <button className="action" onClick={() => this.applyChanges()}>Apply Changes</button>
                    </div>}
                </div>
            </div>
        )
    }
}   