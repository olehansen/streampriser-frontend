import * as React from 'react';
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import { IMovie } from "../../../Models/Movie";
import { MovieCarouselItem } from "./MovieCarouselItem";
import { MovieCarouselPager } from './MovieCarouselPager';
import { MovieCarouselLastItem } from './MovieCarouselLastItem';
import { Arrow } from "../../../Components/Arrow";
import "./MovieCarousel.scss";

export interface IMovieCarouselDispatcher { //extends IMovieListItemDispatcher {
    ScrollPositionUpdated(newscrollPositionX: number): void;
}

interface IMovieCarouselProps {
    dispatcher: IMovieCarouselDispatcher,
    viewPort: ViewPort,
    movies: IMovie[],
    title: string,
    scrollXPosition: number,
    moreLink: string
}

interface IMovieCarouselState {
}

export class MovieCarousel extends React.Component<IMovieCarouselProps, IMovieCarouselState> {

    private lastScrollPositionXUpdate: Date;
    private lastUpdate: Date;
    private overlayRigthHTMLElement: HTMLElement;
    private overlayRightHTMLElementIsHidden: boolean;
    private overlayLeftHTMLElement: HTMLElement;
    private overlayLeftHTMLElementIsHidden: boolean;
    private movieCarouselInner: HTMLElement;
    private movieCarouselInnerCurrentScrollXPosition: number;
    private movieCarouselInnerWidth: number;
    private movieCarouselOuter: HTMLElement;
    private movieCarouselOuterwidth: number;

    constructor(props: IMovieCarouselProps) {
        super(props);

        this.movieCarouselInnerCurrentScrollXPosition = 0;
        this.lastScrollPositionXUpdate = new Date();
        this.lastUpdate = new Date();
        this.overlayRightHTMLElementIsHidden = false;
        this.overlayLeftHTMLElementIsHidden = false;
        this.movieCarouselInnerWidth = (200 * (this.props.movies.length + 1) + 35);
        this.movieCarouselOuterwidth = 0;
    }

    private getPagerJumpWidth(): number {
        return Math.ceil(this.movieCarouselOuter.getBoundingClientRect().width / 2);
    }

    private pageLeft() {
        this.movieCarouselInner.scrollLeft -= this.getPagerJumpWidth();
        this.props.dispatcher.ScrollPositionUpdated(this.movieCarouselInner.scrollLeft);
    }

    private pageRight() {
        this.movieCarouselInner.scrollLeft += this.getPagerJumpWidth();
        this.props.dispatcher.ScrollPositionUpdated(this.movieCarouselInner.scrollLeft);
    }

    private postRenderUpdate() {

        const movieCarouselOuterwidth: number = this.movieCarouselOuter.getBoundingClientRect().width;

        if (!this.props.viewPort.isMobile()) {

            if (this.movieCarouselInner.scrollLeft <= 10) {
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

            if (this.movieCarouselInner.scrollLeft > ((this.movieCarouselInnerWidth - movieCarouselOuterwidth) - 2)) {
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

        this.movieCarouselOuterwidth = movieCarouselOuterwidth;
    }

    private mouseX(event: React.MouseEvent<HTMLDivElement>) {
        return event.clientX;
    }

    private mouseY(event: React.MouseEvent<HTMLDivElement>) {
        return event.clientY;
    }

    private onScrolling(): void {
        this.movieCarouselInnerCurrentScrollXPosition = this.movieCarouselInner.scrollLeft;
        this.lastScrollPositionXUpdate = new Date();
        this.props.dispatcher.ScrollPositionUpdated(this.movieCarouselInner.scrollLeft);
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

    shouldComponentUpdate(nextProps: IMovieCarouselProps, nextState: IMovieCarouselState) {
        var diff = new Date().getTime() - this.lastUpdate.getTime();
        return diff > 250 || (!this.overlayLeftHTMLElementIsHidden && nextProps.scrollXPosition < 10) || (!this.overlayRightHTMLElementIsHidden && nextProps.scrollXPosition >= this.movieCarouselInnerWidth - 55 - this.movieCarouselOuterwidth);
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.mouseUp);
        // console.log("componentDidMount");
        this.postRenderUpdate();
    }

    componentDidUpdate() {
        // console.log("componentDidUpdate");
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
        this.scrollLeftStartPosition = this.movieCarouselInner.scrollLeft;
    }

    private handleMouseMove(x: number, y: number) {
        if (this.started) {
            var diff = x - this.startPosition;
            if (diff != 0) {
                this.didMoved = true;
            }
            let newXPostion = (diff * -1) + this.scrollLeftStartPosition;
            const maxScrollLeft = this.movieCarouselInnerWidth - this.movieCarouselOuterwidth;
            if (newXPostion < 0) {
                newXPostion = 0;
            } else if (newXPostion > maxScrollLeft) {
                newXPostion = maxScrollLeft;
            }
            this.movieCarouselInner.scrollLeft = newXPostion;
        }
    }

    private handleMouseUp(x: number, y: number) {
        this.started = false;
    }

    render() {

        this.lastUpdate = new Date();

        const { viewPort, movies, dispatcher, title, scrollXPosition, moreLink } = this.props;
        var rowCounter = 0;

        var movieListItems = movies.map(function (movie) {
            rowCounter = rowCounter + 1;
            return <MovieCarouselItem key={movie.id} viewPort={viewPort} movie={movie} />;
        });

        var movieCarouselClassName = classNames({
            "moviecarousel": true,
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

        return (<div style={{ width: "100%" }} className={movieCarouselClassName} >
            <div className="top">
                <div className="title">{title}</div>
                <div className={viewPort.isMobile() ? "hide" : ""}>
                    <a href={moreLink} >
                        <div className="morelink">
                            <div className="morelinkname" >Vis alle</div>
                            <div><Arrow direction="right" size="medium" /></div>
                        </div>
                    </a>
                </div>
            </div>
            <div className="moviecarousel-outer" ref={(ref) => { this.movieCarouselOuter = ref; }}>
                <div className={overlayLeftClassName} ref={(ref) => this.overlayLeftHTMLElement = ref} onTouchEnd={(event) => { this.pageLeft(); }} onMouseUp={(event) => { this.pageLeft(); }} >
                    <MovieCarouselPager viewPort={viewPort} direction="left" />
                </div>
                <div className="moviecarousel-inner" ref={(ref) => { this.movieCarouselInner = ref; }}
                    onScroll={(event) => { this.onScrolling(); }}
                    onMouseDown={(event) => { event.preventDefault(); event.stopPropagation(); this.handleMouseDown(this.mouseX(event), this.mouseY(event)); }}
                    onMouseMove={(event) => { event.preventDefault(); event.stopPropagation(); this.handleMouseMove(this.mouseX(event), this.mouseY(event)); }}
                    onMouseUp={(event) => { event.preventDefault(); event.stopPropagation(); this.handleMouseUp(this.mouseX(event), this.mouseY(event)); }}
                    onClick={(event) => { this.handleClick(event); }} >
                    {movieListItems}
                    <MovieCarouselLastItem viewPort={viewPort} url={moreLink} />
                    <div className="theend"></div>
                </div>
                <div className={overlayRigthClassName} ref={(ref) => this.overlayRigthHTMLElement = ref} onTouchEnd={(event) => { this.pageRight(); }} onMouseUp={(event) => { this.pageRight(); }}>
                    <MovieCarouselPager viewPort={viewPort} direction="right" />
                </div>
            </div>
        </div>);
    }
}