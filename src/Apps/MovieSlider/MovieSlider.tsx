import * as React from "react";
import * as ReactDOM from "react-dom";
import { ViewPort } from "../../ViewPort";
import { ISliderStore } from "./ISliderStore";
import { Slider } from "../../Components/Slider";
import { BaseAppIndex } from "../BaseAppIndex"
import LazyLoad from 'react-lazyload';
import { Arrow } from "../../Components/Arrow";
import { MovieSliderLastItem } from './MovieSliderLastItem';
import "./MovieSlider.scss";

interface INameItem {
    id: string;
    name: string;
}

interface ISliderMovieItem {
    bestprice_own: number;
    bestprice_rental: number;
    bestprice_subscription: number;
    description: string;
    genres: INameItem[];
    id: string;
    imageurl: string;
    imdbrating: number;
    showprice: boolean;
    title: string;
    url: string;
    year: number;
}

export class MovieSlider extends BaseAppIndex {

    private viewPort: ViewPort;
    private title: string;
    private moreLink: string;
    private store: ISliderStore;

    public OnStoreUpdated: (json: string) => void;

    constructor(viewPort: ViewPort, items: ISliderMovieItem, title: string, storeJson: string, moreLink: string) {
        super();

        this.scrollPositionUpdated = this.scrollPositionUpdated.bind(this);

        this.viewPort = viewPort;
        this.title = title;
        this.moreLink = moreLink;
        var storedStore = storeJson ? JSON.parse(storeJson) as ISliderStore : {} as ISliderStore;

        this.store = {
            scrollXPosition: storedStore.scrollXPosition ? storedStore.scrollXPosition : 0,
            Items: storedStore.Items ? storedStore.Items : items
        } as ISliderStore
    }

    private _render() {
        this.render();
        if (this.OnStoreUpdated) { this.OnStoreUpdated(JSON.stringify(this.store)); }
    }

    private scrollPositionUpdated(newscrollPositionX: number) {
        this.store.scrollXPosition = newscrollPositionX;
        this._render();
    }

    // return <LazyLoad once={true} height={374} placeholder={<div className="item" style={{ width: "198px", "height": "350px" }}></div>} >
    // </LazyLoad>;

    private renderMovieItem(item: ISliderMovieItem): JSX.Element {
        var imageUrl = 'url(' + item.imageurl + ')';
        return <div className="item" style={{ margin: "5px", width: "188px", height: "340px" }}>
            <a href={item.url} style={{ textDecoration: "none" }} >
                <div className="movie-img" style={{ width: "188px", height: "280px", background: imageUrl, backgroundSize: "cover", backgroundPosition: "top center" }}>
                </div>
                <div className="text-center" style={{ height: "60px", paddingTop: "5px" }} >
                    <div style={{ color: "white", lineHeight: "100%" }}>{item.title}</div>
                    <div style={{ color: "gray", fontSize: "80%" }}>{item.year}</div>
                    {item.bestprice_rental != -1 ? <div style={{ color: "#d62c42" }}>{item.bestprice_rental} kr</div> : <div></div>}
                </div>
            </a>
        </div>;
    }

    protected renderJSX(): JSX.Element {
        const elements: JSX.Element[] = [];
        for (let i = 0; i < this.store.Items.length; i++) {
            const item = this.store.Items[i];
            elements.push(this.renderMovieItem(item));
        }

        if (!this.viewPort.isMobile() && this.moreLink.length < 0) {
            elements.push(<MovieSliderLastItem viewPort={this.viewPort} url={this.moreLink} />);
        }

        // const totalWidth = this.store.Items.length * 198;

        return <div className="movieslider">
            <div className="top">
                <div className="title">{this.title}</div>
                <div className={this.viewPort.isMobile() || this.moreLink.length == 0 ? "hide" : ""}>
                    <a href={this.moreLink} >
                        <div className="morelink">
                            <div className="morelinkname" >Vis alle</div>
                            <div><Arrow direction="right" size="medium" /></div>
                        </div>
                    </a>
                </div>
            </div>
            <LazyLoad once={true} height={374} placeholder={<div style={{ height: "350px" }}></div>} >
                <Slider items={elements} viewPort={this.viewPort} scrollPositionUpdated={this.scrollPositionUpdated} scrollXPosition={this.store.scrollXPosition} itemWidth={198} />
            </LazyLoad>
        </div>;
    }

    protected viewPortUpdated(newViewPort: ViewPort): void {
        this.viewPort = newViewPort;
        this.render();
    }

    protected onScrolling(): void {

    }

    protected onClickEvent(event: Event): void {

    }

    protected onKeyUpEvent(event: KeyboardEvent): void {

    }

}