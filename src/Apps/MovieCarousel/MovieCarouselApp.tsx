import * as React from "react";
import * as ReactDOM from "react-dom";
import * as es6shim from "es6-shim";
import { ViewPort } from "../../ViewPort";
import { StreamHubApiClient } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import { IMovieCarouselStore } from "./IMovieCarouselStore";
import { IMovie } from "../../Models/Movie";
import { MovieCarouselDispatcher } from "./MovieCarouselDispatcher";
import { BaseAppIndex } from "../BaseAppIndex"
import { MovieCarousel } from "./Components/MovieCarousel"

export class MovieCarouselApp extends BaseAppIndex {

    private dispatcher: MovieCarouselDispatcher;
    private viewPort: ViewPort;
    private title: string;
    private moreLink: string;

    public OnStoreUpdated: (json: string) => void;

    constructor(viewPort: ViewPort, movies: IMovie[], title: string, storeJson: string, moreLink: string) {
        super();

        this.viewPort = viewPort;
        this.title = title;
        this.moreLink = moreLink;
        var storedStore = storeJson ? JSON.parse(storeJson) as IMovieCarouselStore : {} as IMovieCarouselStore;

        var store = {
            scrollXPosition: storedStore.scrollXPosition ? storedStore.scrollXPosition : 0,
            Movies: storedStore.Movies ? storedStore.Movies : movies
        } as IMovieCarouselStore

        const dispatcher = new MovieCarouselDispatcher();
        dispatcher.SetStore(store);
        dispatcher.StoreUpdated = () => {
            this.render();
            if (this.OnStoreUpdated) { this.OnStoreUpdated(JSON.stringify(dispatcher.GetStore())); }
        }

        this.dispatcher = dispatcher;
    }

    protected renderJSX(): JSX.Element {
        const store = this.dispatcher.GetStore();
        const dispatcher = this.dispatcher;
        return <MovieCarousel movies={store.Movies} viewPort={this.viewPort} dispatcher={dispatcher} title={this.title} scrollXPosition={store.scrollXPosition} moreLink={this.moreLink} />;
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