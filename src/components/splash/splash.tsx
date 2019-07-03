import * as React from 'react';
import "./splash.scss";
import { DataStore } from '../../stores/data-store';
import { AdvancedScreen } from '../advanced/advanced';

interface SplashScreenProps {
    begin: () => void;
    data: DataStore;
}

interface SplaceScreenState {
    isAdvancedOpen: boolean;
}

export class SplashScreen extends React.Component<SplashScreenProps, SplaceScreenState> {

    constructor(props) {
        super(props);

        this.state = {
            isAdvancedOpen: false
        }
    }

    openAdvancedPage() {
        this.setState({
            isAdvancedOpen: true
        });
    }

    closeAdvancedPage() {
        this.setState({
            isAdvancedOpen: false
        });
    }

    public render() {
        const { begin, data } = this.props;
        const { isAdvancedOpen } = this.state;

        return (
            <div className="splash">
                {isAdvancedOpen && <AdvancedScreen data={data} close={() => this.closeAdvancedPage()} />}
                <div className="island"></div>  
                <div className="inner">
                    <h1>Theory Draft for</h1>
                    <div className="tft-logo"></div>
                    <p> A Drafting Simulator and Practice Tool</p>
                    <div className="tft-end-cap"></div>
                    <div className="actions">
                        <button className="action" onClick={begin}>
                            Begin
                        </button>
                        <button className="action minor" onClick={() => this.openAdvancedPage()}>
                            Advanced
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}