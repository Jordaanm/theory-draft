import * as React from 'react';
import "./splash.scss";

interface SplashScreenProps {
    begin: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ begin }) => {
    return (
        <div className="splash">
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
                </div>
            </div>
        </div>
    );
};