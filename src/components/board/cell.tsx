import * as React from 'react';

interface CellProps {
    x: number;
    y: number;
    unit?: any;
}

export class Cell extends React.Component<CellProps> {
    public render() {
        const { x, y, unit } = this.props;
        
        return (
            <div className="cell">
                <div className="contents">
                    {x}, {y}, {unit && JSON.stringify(unit, null, 2)}
                </div>
            </div>
        )
    }
}