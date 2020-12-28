import * as React from 'react';
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import "./PaginationButton.scss";

interface IPaginationButtonProps {
    state: number; // 1 = page 1, 2 = page 2, 3 = page 3-x
    nextUri: string,
    previousUri: string,
    startUri: string
}

interface IPaginationButtonState {

}

export class PaginationButton extends React.Component<IPaginationButtonProps, IPaginationButtonState> {

    constructor(props: IPaginationButtonProps) {
        super(props);
    }

    render() {

        const { state, nextUri, previousUri, startUri } = this.props;

        var paginationButtonClassName = classNames({
            "pagination-button": true,
            "hideleftleft": state == 1 || state == 2,
            "hideleft": state == 1,
            "hideright": false || state == 4,
            "hidemore": state > 1
        });

        // console.log(this.props.maxWidth);

        return <div className={paginationButtonClassName} >
            <div className="pagination-button-inner" >
                <div className="leftleft-outer">
                    <a href={startUri} >
                        <div className="leftleft center">
                            <div className="icon-alltheway-left-arrow"></div>
                        </div>
                    </a>
                </div>
                <div className="left-outer" >
                    <a href={previousUri} >
                        <div className="left center">
                            <div className="icon-left-arrow"></div>
                        </div>
                    </a>
                </div>
                <div className="right-outer" >
                    <a href={nextUri} >
                        <div className="right">
                            <div className="center">
                                <div className="more" >Vis flere</div>
                                <div className="icon-right-arrow"></div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>;
    }
}