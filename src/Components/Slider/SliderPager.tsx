import * as React from 'react';
import * as classNames from 'classnames';
import "./SliderPager.scss";
import { ViewPort } from "../../ViewPort";
import { Arrow } from "../../Components/Arrow";

interface ISliderPagerProps {
    viewPort: ViewPort,
    direction: string
}

interface ISliderPagerState {

}

export class SliderPager extends React.Component<ISliderPagerProps, ISliderPagerState> {

    constructor(props: ISliderPagerProps) {
        super(props);
    }
    
    shouldComponentUpdate() {
        return false;
    }

    render() {

        const { viewPort, direction } = this.props;

        var movieCarouselPagerClassName = classNames({
            "sliderPager": true,
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