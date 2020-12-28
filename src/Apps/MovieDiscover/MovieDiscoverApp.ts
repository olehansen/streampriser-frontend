import * as React from "react";
import * as ReactDOM from "react-dom";
import MovieDiscover from "./Components/MovieDiscover";
import { MovieDiscoverStore } from "./MovieDiscoverStore";
import { MovieDiscoverDispatcher } from "./MovieDiscoverDispatcher";
import { SortBy } from "./Models/SortBy";
import { Selectable, Filter } from "./Models/Filter";
import { ViewPort } from "../../ViewPort";
import { MovieDiscoverDataFactory } from "./MovieDiscoverDataFactory";
import { StreamHubApiClient } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import { MovieDiscoverMapper } from "./MovieDiscoverMapper";
import { MovieDiscoverSession } from "./MovieDiscoverSession"

interface IStreamhubWebAPI {

}

export class MovieDiscoverApp {

    _resizeCounter: number;
    _scrollingCounter: number;
    _store: MovieDiscoverStore;
    _container: Element;
    _dispatcher: MovieDiscoverDispatcher;

    constructor(appId: string, container: Element, viewPort: ViewPort, baseUrl: string, genreSelectables: Selectable[], storeAsJson: string, streamhubId: string) {

        this._resizeCounter = 0;
        this._scrollingCounter = 0;
        this._container = container;
        const movieDiscoverSession = new MovieDiscoverSession(appId);

        this._storeChangedEvent = this._storeChangedEvent.bind(this);

        const streamHubApiClient = new StreamHubApiClient(baseUrl, streamhubId);

        const movieDiscoverDataFactory = new MovieDiscoverDataFactory(streamHubApiClient, genreSelectables);

        const orderByOptions: SortBy[] = movieDiscoverDataFactory.CreateOrderBies();
        const filters: Filter[] = movieDiscoverDataFactory.CreateFilters();
        let store = movieDiscoverSession.GetStore(filters, orderByOptions);
        this._store = store !== undefined ? store : new MovieDiscoverStore(filters, orderByOptions);
        this._dispatcher = new MovieDiscoverDispatcher(this._storeChangedEvent, this._store, viewPort, streamHubApiClient, movieDiscoverSession);
        this._dispatcher.Init(viewPort);
    }

    _storeChangedEvent() {
        this._render(this._store);
    }

    _render(store: MovieDiscoverStore, forceClose: boolean = false) {
        this._dispatcher.SetCompontentIsMounted(false, false);
        ReactDOM.render(
            React.createElement(MovieDiscover, { store: store, dispatcher: this._dispatcher, forceClose }),
            this._container
        );
    }

    // clearFilter() {
    //     sessionStorage.removeItem(this._sessionStorageStoreKey);
    // }

    getStore() {
        return this._store;
    }

    isScrolling() {
        this._scrollingCounter++;
        setTimeout(() => {
            this._scrollingCounter--;
            if (this._scrollingCounter == 0 || this._scrollingCounter % 8 == 0) {
                this._dispatcher.OnScrolling();
            }
        }, 300);
    }

    updateDimensions(newViewPort: ViewPort) {
        this._resizeCounter++;
        setTimeout(() => {
            this._resizeCounter--;
            if (this._resizeCounter == 0) {
                this._dispatcher.UpdateViewPort(newViewPort);
            }
        }, 300);
    }

    clickEvent() {
        if (this._store.lastClickedInMovieSelectorId != this._store.openMovieSelectorId) {
            this._dispatcher.CloseAllOpenSelectors();
        }
        this._dispatcher.SetLastClickedInMovieSelectorId("");
    }

    keyupEvent(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowDown":
                // Do something for "down arrow" key press.
                break;
            case "ArrowUp":
                // Do something for "up arrow" key press.
                break;
            case "ArrowLeft":
                // Do something for "left arrow" key press.
                break;
            case "ArrowRight":
                // Do something for "right arrow" key press.
                break;
            case "Enter":
                // Do something for "enter" or "return" key press.
                break;
            case "Escape":
                this._dispatcher.CloseAllOpenSelectors(false);
                this._render(this._store, true);
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
    }
}