import * as  React from "react";
import * as  ReactDOM from "react-dom";
import { ViewPort } from "../../ViewPort";
import { BaseAppIndex } from "../BaseAppIndex"
import { SearchBox } from './components/SearchBox';
import { StreamHubApiClient } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import { SearchBoxDispatcher } from "./SearchBoxDispatcher";
import { SearchBoxStore } from "./SearchBoxStore";
import { ISearchResultEvents, ISearchNavigationEvents } from "../InterAppCommunication";

export class SearchBoxApp extends BaseAppIndex implements ISearchNavigationEvents {

    private dispatcher: SearchBoxDispatcher;
    private store: SearchBoxStore;
    private currentStartingPage: number;

    constructor(viewPort: ViewPort, focusOnStart: boolean, baseUrl: string, streamhubId: string, initQuery: string, currentStartingPage: number) {
        super();

        const streamHubApiClient = new StreamHubApiClient(baseUrl, streamhubId);

        this.store = new SearchBoxStore(viewPort);
        this.store.focusInput = true; // focusOnStart ? true : false;
        if (initQuery.length > 0) {
            this.store.input = initQuery;
        } else {
            this.store.input = "";
        }
        this.currentStartingPage = currentStartingPage;

        this.dispatcher = new SearchBoxDispatcher(this.render, this.store, streamHubApiClient);
        this.renderJSX = this.renderJSX.bind(this);
    }

    protected onInit(): Promise<void> {
        if (this.store.input.length > 0) {
            return this.dispatcher.fetchSearchResult(this.store.input, this.currentStartingPage);
        }
        return Promise.resolve();
    }

    protected renderJSX(): JSX.Element {
        return <SearchBox dispatcher={this.dispatcher} store={this.store} />
    }

    protected viewPortUpdated(newViewPort: ViewPort): void {
        this.dispatcher.updateDimensionsAction(newViewPort);
        this.render();
    }

    protected onScrolling(): void {

    }

    protected onClickEvent(event: Event): void {

        // this.dispatcher.clearFocus();
    }

    protected onKeyUpEvent(event: KeyboardEvent): void {

    }

    public setSearchResultEvents(searchResultEvents: ISearchResultEvents)
    {
        this.dispatcher.setSearchResultEvents(searchResultEvents);
    }

    // ISearchNavigationEvents

    public newPage(page: number): void {
        this.dispatcher.changePage(page);
    }
}