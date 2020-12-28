import * as React from 'react';
import * as classNames from 'classnames';
import { ViewPort } from "../../ViewPort";
import './MovieSliderLastItem.scss';

interface IMovieSliderLastItemProps {
    viewPort: ViewPort,
    url: string
}

interface IMovieSliderLastItemState {

}

export class MovieSliderLastItem extends React.Component<IMovieSliderLastItemProps, IMovieSliderLastItemState> {

    rootDivElement: HTMLDivElement;

    constructor(props: IMovieSliderLastItemProps) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {

    }

    render() {

        const {url, viewPort} = this.props;

        var movieSliderLastItemclassNames = classNames({
            "moviesliderlastitem": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        // var style: any = {};

        // style.width = "190px";
        // style.height = "396px";
        // style={style}
        // var contentTitleStyle: any = {};

        return <div className={movieSliderLastItemclassNames} ref={(ref) => { this.rootDivElement = ref; }}>
            <a href={url}>
                <div className="innerbox">
                    <div>Vis alle</div>
                </div>
            </a>
        </div >;
    }
}