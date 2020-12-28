import * as React from 'react';
import * as classNames from 'classnames';
import "./RangeSlider.scss";

interface IRangeSliderProps extends React.Props<any> {
    min: number,
    max: number,
    value: number,
    onSelectedChanged: (value: number) => void
}

interface IRangeSliderState {
    left: number,
    transformtranslateX: number
}

export default class RangeSlider extends React.Component<IRangeSliderProps, IRangeSliderState> {

    cofs: number;
    mouseIsDown: boolean;
    isMovingBox: boolean;
    maxWidth: number;
    slider: HTMLElement;
    dist: number;
    startx: number;

    constructor(props: IRangeSliderProps) {
        super(props);
        this.cofs = 1;
        this.mouseIsDown = false;
        this.isMovingBox = false;
        this.maxWidth = 0;
        this.dist = 0;
        this.startx = 0;
        this.state = { "left": 0, "transformtranslateX": 0 };
        this.moving = this.moving.bind(this);
        this.movingStarted = this.movingStarted.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.doneMoving = this.doneMoving.bind(this);
        this.validLeft = this.validLeft.bind(this);
    }

    validLeft(newLeft: number): number {
        return newLeft < 0 ? 0 : (newLeft <= (this.maxWidth - 24) ? newLeft : (this.maxWidth - 24));
    }

    movingStarted(startx: number) {
        this.startx = startx;
    }

    moving(currentPosition: number) {
        const localDist = currentPosition - this.startx;
        this.isMovingBox = true;
        const newLeft = this.state.left + localDist;
        if (newLeft == this.validLeft(newLeft)) {
            this.dist = localDist;
            this.setState({ "transformtranslateX": this.dist } as IRangeSliderState);
        }
    }

    doneMoving() {
        var newLeft = this.state.left + this.dist;
        this.props.onSelectedChanged(this.calculateValue(newLeft));
        this.setState({ "left": this.validLeft(newLeft), "transformtranslateX": 0 } as IRangeSliderState);
    }

    mouseUp() {
        this.mouseIsDown = false;
        if (this.isMovingBox) {
            this.isMovingBox = false;
            this.doneMoving();
        }
    }

    onMouseDown(e: any) {
        e.preventDefault();
        this.mouseIsDown = true;
        this.movingStarted(parseInt(e.clientX));
    }

    onMouseMove(e: any) {
        if (this.mouseIsDown) {
            this.moving(parseInt(e.clientX));
        }
    }

    onMouseLeave() {
        if (this.isMovingBox) {
            this.isMovingBox = false;
            this.doneMoving();
        }
    }

    onTouchStart(e: any) {
        e.preventDefault();
        var touchobj = e.changedTouches[0];
        this.movingStarted(parseInt(touchobj.clientX));
    }

    onTouchMove(e: any) {
        e.preventDefault();
        var touchobj = e.changedTouches[0];
        this.moving(parseInt(touchobj.clientX));
    }

    calculateValue(left: number): number {
        const value = Math.floor(this.cofs * left) + this.props.min;
        return value;
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.mouseUp);
        this.maxWidth = this.slider.getBoundingClientRect().width;
        this.cofs = (this.props.max - this.props.min) / (this.maxWidth - 26);
        let value = this.props.value;
        if (this.props.value < this.props.min) {
            value = this.props.min;
        }
        if (this.props.value > this.props.max) {
            value = this.props.max;
        }
        this.setState({ "left": Math.ceil((value - this.props.min) / this.cofs), "transformtranslateX": 0 } as IRangeSliderState);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.mouseUp);
    }

    render() {

        const {left, transformtranslateX} = this.state;
        const {min, max} = this.props;
        const calculatedLeft = left + transformtranslateX;
        const newValue = this.calculateValue(calculatedLeft);

        const classNameMin = classNames({
            "min": true,
            "hide": calculatedLeft < 30
        });

        const classNameMax = classNames({
            "max": true,
            "hide": calculatedLeft > (this.maxWidth - 70)
        });

        let boxStyle: any = {};

        if (this.isMovingBox) {
            boxStyle.left = left + "px";
            boxStyle.transition = "0s";
            boxStyle.transform = "translateX(" + transformtranslateX + "px)";
        } else {
            boxStyle.transition = "0s";
            boxStyle.transform = "";
            boxStyle.left = left + "px";
        }

        let paddingLeft = 0;

        switch (newValue.toString().length) {
            case 1:
                paddingLeft = 8;
                break;
            case 2:
                paddingLeft = 4;
                break;
            case 3:
                paddingLeft = -2;
                break;
            case 4:
                paddingLeft = -5;
                break;
        }

        let valueStyle: any = {};

        if (this.isMovingBox) {
            valueStyle.left = left + "px";
            valueStyle.transition = "0s";
            valueStyle.transform = "translateX(" + (transformtranslateX + paddingLeft) + "px)";
        } else {
            valueStyle.transition = "0s";
            valueStyle.transform = "";
            valueStyle.left = (left + paddingLeft) + "px";
        }

        return (<div className="streamhubjs-rangeslider" onMouseMove={this.onMouseMove} onTouchMove={this.onTouchMove} onMouseLeave={this.onMouseLeave}>
            <div className="slider2" ref={(ref) => this.slider = ref}>
                <div className="line"></div>
                <div className="line-selected" style={{ "width": (calculatedLeft + 12) + "px" }}></div>
                <div className="box" style={boxStyle} onMouseDown={this.onMouseDown} onTouchStart={this.onTouchStart}>
                </div>
                <div className="value" style={valueStyle}>{newValue}</div>
                <div className={classNameMin}>{min}</div>
                <div className={classNameMax}>{max}</div>
            </div>
        </div>);
    }
}