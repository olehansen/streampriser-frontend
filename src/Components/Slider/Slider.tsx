import * as React from 'react';
import * as classNames from 'classnames';
import { ViewPort } from "../../ViewPort";
import { IMovie } from "../../Models/Movie";
import { SliderPager } from './SliderPager';
import "./Slider.scss";

interface ISliderProps {
    scrollPositionUpdated: (newscrollPositionX: number) => void,
    viewPort: ViewPort,
    items: JSX.Element[],
    scrollXPosition: number,
    itemWidth: number
}

interface ISliderState {

}

export class Slider extends React.Component<ISliderProps, ISliderState> {

    private lastScrollPositionXUpdate: Date;
    private lastUpdate: Date;
    private overlayRigthHTMLElement: HTMLElement;
    private overlayRightHTMLElementIsHidden: boolean;
    private overlayLeftHTMLElement: HTMLElement;
    private overlayLeftHTMLElementIsHidden: boolean;
    private inner: HTMLElement;
    private innerCurrentScrollXPosition: number;
    private innerWidth: number;
    private outer: HTMLElement;
    private outerwidth: number;

    constructor(props: ISliderProps) {
        super(props);

        this.innerCurrentScrollXPosition = 0;
        this.lastScrollPositionXUpdate = new Date();
        this.lastUpdate = new Date();
        this.overlayRightHTMLElementIsHidden = false;
        this.overlayLeftHTMLElementIsHidden = false;
        this.innerWidth = (this.props.itemWidth * this.props.items.length); // + 35;
        this.outerwidth = 0;
    }

    private getPagerJumpWidth(): number {
        return Math.ceil(this.outer.getBoundingClientRect().width / 2);
    }

    private pageLeft() {
        this.inner.scrollLeft -= this.getPagerJumpWidth();
        this.props.scrollPositionUpdated(this.inner.scrollLeft);
    }

    private pageRight() {
        this.inner.scrollLeft += this.getPagerJumpWidth();
        this.props.scrollPositionUpdated(this.inner.scrollLeft);
    }

    private postRenderUpdate() {

        const sliderOuterwidth: number = this.outer.getBoundingClientRect().width;

        if (!this.props.viewPort.isMobile()) {

            if (this.inner.scrollLeft <= 10) {
                this.overlayLeftHTMLElement.style.transition = "width 1s, opacity 0.5s linear";
                this.overlayLeftHTMLElement.style.width = "0px";
                this.overlayLeftHTMLElement.style.opacity = "0";
                this.overlayLeftHTMLElementIsHidden = true;
            } else {
                this.overlayLeftHTMLElement.style.transition = "display 1s, opacity 0.5s linear";
                this.overlayLeftHTMLElement.style.width = "30px";
                this.overlayLeftHTMLElement.style.opacity = "1";
                this.overlayLeftHTMLElementIsHidden = false;
            }

            if (this.inner.scrollLeft > ((this.innerWidth - sliderOuterwidth) - 2)) {
                this.overlayRigthHTMLElement.style.transition = "width 1s, opacity 0.5s linear";
                this.overlayRigthHTMLElement.style.height = "0px";
                this.overlayRigthHTMLElement.style.opacity = "0";
                this.overlayRightHTMLElementIsHidden = true;
            } else {
                this.overlayRigthHTMLElement.style.transition = "display 1s, opacity 0.5s linear";
                this.overlayRigthHTMLElement.style.height = "30px";
                this.overlayRigthHTMLElement.style.opacity = "1";
                this.overlayRightHTMLElementIsHidden = false;
            }
        }

        this.outerwidth = sliderOuterwidth;
    }

    private mouseX(event: React.MouseEvent<HTMLDivElement>) {
        return event.clientX;
    }

    private mouseY(event: React.MouseEvent<HTMLDivElement>) {
        return event.clientY;
    }

    private onScrolling(): void {
        this.innerCurrentScrollXPosition = this.inner.scrollLeft;
        this.lastScrollPositionXUpdate = new Date();
        this.props.scrollPositionUpdated(this.inner.scrollLeft);
    }

    private handleClick(event: React.SyntheticEvent<HTMLDivElement>) {
        event.stopPropagation();
        this.started = false;
        if (this.didMoved) {
            event.preventDefault();
        }
    }

    private mouseUp: (event: MouseEvent) => void = (event) => {
        this.handleMouseUp(event.clientX, event.clientY);
    }

    shouldComponentUpdate(nextProps: ISliderProps, nextState: ISliderState) {
        var diff = new Date().getTime() - this.lastUpdate.getTime();
        return diff > 250 || (!this.overlayLeftHTMLElementIsHidden && nextProps.scrollXPosition < 10) || (!this.overlayRightHTMLElementIsHidden && nextProps.scrollXPosition >= this.innerWidth - 55 - this.outerwidth);
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.mouseUp);
        this.postRenderUpdate();
    }

    componentDidUpdate() {
        this.postRenderUpdate();
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.mouseUp);
    }

    private started: boolean = false;
    private startPosition: number;
    private didMoved: boolean = false;
    private scrollLeftStartPosition: number;

    private handleMouseDown(x: number, y: number) {
        this.started = true;
        this.startPosition = x;
        this.didMoved = false;
        this.scrollLeftStartPosition = this.inner.scrollLeft;
    }

    private handleMouseMove(x: number, y: number) {
        if (this.started) {
            var diff = x - this.startPosition;
            if (diff != 0) {
                this.didMoved = true;
            }
            let newXPostion = (diff * -1) + this.scrollLeftStartPosition;
            const maxScrollLeft = this.innerWidth - this.outerwidth;
            if (newXPostion < 0) {
                newXPostion = 0;
            } else if (newXPostion > maxScrollLeft) {
                newXPostion = maxScrollLeft;
            }
            this.inner.scrollLeft = newXPostion;
        }
    }

    private handleMouseUp(x: number, y: number) {
        this.started = false;
    }

    render() {

        this.lastUpdate = new Date();

        const { viewPort, items, scrollXPosition } = this.props;
        var rowCounter = 0;

        var elements = items.map(function (item) {
            rowCounter = rowCounter + 1;
            return <div className="slider-inner-item" key={rowCounter} style={{ width: "198px", height: "350px" }} >{item}</div>;
        });

        var sliderClassName = classNames({
            "slider": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        const overlayLeftClassName = classNames({
            "overlayleft": true,
            "hide": viewPort.isMobile()
        });

        const overlayRigthClassName = classNames({
            "overlayrigth": true,
            "hide": viewPort.isMobile()
        });

        return (<div className={sliderClassName} >
            <div className="slider-outer" ref={(ref) => { this.outer = ref; }}>
                <div className={overlayLeftClassName} ref={(ref) => this.overlayLeftHTMLElement = ref} onTouchEnd={(event) => { this.pageLeft(); }} onMouseUp={(event) => { this.pageLeft(); }} >
                    <SliderPager viewPort={viewPort} direction="left" />
                </div>
                <div className="slider-inner" ref={(ref) => { this.inner = ref; }}
                    onScroll={(event) => { this.onScrolling(); }}
                    onMouseDown={(event) => { event.preventDefault(); event.stopPropagation(); this.handleMouseDown(this.mouseX(event), this.mouseY(event)); }}
                    onMouseMove={(event) => { event.preventDefault(); event.stopPropagation(); this.handleMouseMove(this.mouseX(event), this.mouseY(event)); }}
                    onMouseUp={(event) => { event.preventDefault(); event.stopPropagation(); this.handleMouseUp(this.mouseX(event), this.mouseY(event)); }}
                    onClick={(event) => { this.handleClick(event); }} >
                    {elements}
                </div>
                <div className={overlayRigthClassName} ref={(ref) => this.overlayRigthHTMLElement = ref} onTouchEnd={(event) => { this.pageRight(); }} onMouseUp={(event) => { this.pageRight(); }}>
                    <SliderPager viewPort={viewPort} direction="right" />
                </div>
            </div>
        </div>);
    }
}