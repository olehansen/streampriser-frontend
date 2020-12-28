import * as React from 'react';
import * as classNames from 'classnames';
import "./MovieCarouselPager.scss";
import { ViewPort } from "../../../ViewPort";
import { Arrow } from "../../../Components/Arrow";

interface IMovieCarouselPagerProps {
    viewPort: ViewPort,
    direction: string
}

interface IMovieCarouselPagerState {

}

export class MovieCarouselPager extends React.Component<IMovieCarouselPagerProps, IMovieCarouselPagerState> {

    constructor(props: IMovieCarouselPagerProps) {
        super(props);
    }
    
    shouldComponentUpdate() {
        return false;
    }

    render() {

        const { viewPort, direction } = this.props;

        var movieCarouselPagerClassName = classNames({
            "movieCarouselpager": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        return <div className={movieCarouselPagerClassName}>
            <div className="centerme">
                <Arrow direction={direction} size="medium" />
            </div>
        </div>;
    }
}