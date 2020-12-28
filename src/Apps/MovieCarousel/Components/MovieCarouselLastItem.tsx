import * as React from 'react';
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import './MovieCarouselLastItem.scss';

interface IMovieCarouselLastItemItemProps {
    viewPort: ViewPort,
    url: string
}

interface IMovieCarouselLastItemItemState {

}

export class MovieCarouselLastItem extends React.Component<IMovieCarouselLastItemItemProps, IMovieCarouselLastItemItemState> {

    rootDivElement: HTMLDivElement;

    constructor(props: IMovieCarouselLastItemItemProps) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {

    }

    render() {

        const {url, viewPort} = this.props;

        var movieCarouselLastItemclassNames = classNames({
            "moviecarousellastitem": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        // var style: any = {};

        // style.width = "190px";
        // style.height = "396px";
        // style={style}
        // var contentTitleStyle: any = {};

        return <div className={movieCarouselLastItemclassNames} ref={(ref) => { this.rootDivElement = ref; }}>
            <a href={url}>
                <div className="innerbox">
                    <div>Vis alle</div>
                </div>
            </a>
        </div >;
    }
}