import * as React from "react";
import * as ReactDOM from "react-dom";
import { ViewPort } from "../../ViewPort";
import { StreamHubApiClient } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import { MovieListStore } from "./MovieListStore";
import MovieList from '../../Components/MovieList';
import { IMovie } from "../../Models/Movie";
import { MovieListDispatcher } from "./MovieListDispatcher";
import { BaseAppIndex } from "../BaseAppIndex"

export class MovieListApp extends BaseAppIndex {

    private store: MovieListStore;
    private dispatcher: MovieListDispatcher;
    private center: boolean;

    constructor(viewPort: ViewPort, movies: IMovie[], center: boolean) {
        super();

        this.store = new MovieListStore(viewPort, movies);
        this.dispatcher = new MovieListDispatcher();
        this.center = center == undefined ? true : false;
    }

    public reRender(): void {
        this.render();
    }

    protected renderJSX(): JSX.Element {

        const store = this.store;
        const dispatcher = this.dispatcher;

        return <MovieList movies={store.Movies} viewPort={store.ViewPort} dispatcher={dispatcher} center={this.center} />;
    }

    protected viewPortUpdated(newViewPort: ViewPort): void {
        this.dispatcher.UpdateViewPort(newViewPort);
    }

    protected onScrolling(): void {

    }

    protected onClickEvent(event: Event): void {

    }

    protected onKeyUpEvent(event: KeyboardEvent): void {

    }
}