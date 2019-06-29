import * as React from 'react';
import './coin.scss'
export class Coin extends React.Component{
    public render() {
        return (
            <i className="coin">
                <span className="a11y">Coin</span>
            </i>
        )
    }
}