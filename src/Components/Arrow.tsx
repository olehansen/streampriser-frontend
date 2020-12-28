import * as React from 'react';
import "./Arrow.scss";

interface IArrowProps {
    direction: string;
    size: string;
}

interface IArrowState {

}

export class Arrow extends React.Component<IArrowProps, IArrowState> {

    constructor(props: IArrowProps) {
        super(props);
    }
    
    render() {
        // medium, small
        // up, down, left, right
        const {direction, size } = this.props;
        let className = "arrow-" + direction + "-" + size;
        return <div className={className}></div>;
    }
}