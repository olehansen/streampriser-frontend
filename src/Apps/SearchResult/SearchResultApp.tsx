import * as  React from "react";
import * as  ReactDOM from "react-dom";
import { ViewPort } from "../../ViewPort";
import { BaseAppIndex } from "../BaseAppIndex"
import { StreamHubApiClient, ISearchResult } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import { SearchResultDispatcher } from "./SearchResultDispatcher";
import { SearchResultStore } from "./SearchResultStore";
import { SearchResult } from "./Components/SearchResult";
import { ISearchResultEvents, ISearchNavigationEvents } from "../InterAppCommunication";

export class SearchResultApp extends BaseAppIndex implements ISearchResultEvents {

    private dispatcher: SearchResultDispatcher;
    private store: SearchResultStore;

    constructor(viewPort: ViewPort, baseUrl: string, streamhubId: string, storeAsJson: string) {
        super();
        const streamHubApiClient = new StreamHubApiClient(baseUrl, streamhubId);

        this.store = new SearchResultStore(viewPort);
        if (storeAsJson.length > 0) {
            var storedStore = JSON.parse(storeAsJson);
            this.store.searchResultItems = storedStore.searchResultItems;
            this.store.currentPage = storedStore.currentPage;
            this.store.pageSize = storedStore.PageSize;
            this.store.totalItems = storedStore.TotalItems;
            this.store.maxPage = storedStore.maxPage;
            this.store.elapsedMilliseconds = storedStore.ElapsedMilliseconds;
            this.store.isBlank = storedStore.isBlank;
            this.store.searching = false;
        }

        this.dispatcher = new SearchResultDispatcher(this.render, this.store, streamHubApiClient);
        this.dispatcher.updateFontSizes(viewPort);
        this.renderJSX = this.renderJSX.bind(this);
    }

    protected onInit(): Promise<void> {
        return Promise.resolve();
    }

    protected renderJSX(): JSX.Element {

        this.triggerStoreUpdated(this.store);

        return <SearchResult
            dispatcher={this.dispatcher}
            store={this.dispatcher.store}
        ></SearchResult>;
    }

    protected viewPortUpdated(newViewPort: ViewPort): void {
        this.dispatcher.updateDimensionsAction(newViewPort);
        this.render();
    }

    protected onScrolling(): void {

    }

    protected onClickEvent(event: Event): void {

    }

    protected onKeyUpEvent(event: KeyboardEvent): void {

    }

    public setSearchNavigationEvents(searchNavigationEvents: ISearchNavigationEvents) {
        this.dispatcher.setSearchNavigationEvents(searchNavigationEvents);
    }

    public newSearchResult(searchResult: ISearchResult, query: string): void {
        this.dispatcher.updateSearchResult(searchResult, query);
    }
}