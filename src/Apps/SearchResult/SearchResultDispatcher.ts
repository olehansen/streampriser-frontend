import { ViewPort } from "../../ViewPort";
import { SearchResultStore } from "./SearchResultStore"
import { StreamHubApiClient, ISearchResult } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import * as  React from "react";
import * as  ReactDOM from "react-dom";
import { ISearchNavigationEvents } from "../InterAppCommunication";

export class SearchResultDispatcher {

    public store: SearchResultStore;
    public streamHubApiClient: StreamHubApiClient;
    public searchNavigationEvents: ISearchNavigationEvents;

    // search: (input: string, callback: (items: any[]) => void) => void;
    reRenderEvent: () => void;

    constructor(
        reRenderEvent: () => void,
        store: SearchResultStore,
        streamHubApiClient: StreamHubApiClient) {

        this.reRenderEvent = reRenderEvent;
        this.store = store;
        this.streamHubApiClient = streamHubApiClient;
    }

    public setSearchNavigationEvents(searchNavigationEvents: ISearchNavigationEvents) {
        this.searchNavigationEvents = searchNavigationEvents;
    }

    public triggerReRenderEvent() {
        this.reRenderEvent();
    }

    private goToNewPage(page: number) {
        window.scrollTo(0, 0);
        this.searchNavigationEvents.newPage(page);
    }

    /*
    * Actions
    */

    public updateFontSizes(viewPort: ViewPort) {
        if (viewPort.isMobile()) {
            this.store.fontSize = "12px";
            this.store.titleFontSize = "16px";
            this.store.contentTypeFontSize = "13px";
        } else {
            this.store.fontSize = "16px";
            this.store.titleFontSize = "20px";
            this.store.contentTypeFontSize = "17px";
        }
    }

    public updateDimensionsAction(viewPort: ViewPort) {
        this.store.viewPort = viewPort;
        this.updateFontSizes(viewPort);
        this.triggerReRenderEvent();
    }

    public updateSearchResult(searchResult: ISearchResult, query: string) {
        this.store.searchResultItems = [];
        this.store.currentPage = searchResult.Page;
        this.store.pageSize = searchResult.PageSize;
        this.store.totalItems = searchResult.TotalItems;
        this.store.maxPage = Math.ceil(searchResult.TotalItems / searchResult.PageSize);
        this.store.elapsedMilliseconds = searchResult.ElapsedMilliseconds;
        this.store.isBlank = query.length == 0;
        for (var i = 0; i < searchResult.Items.length; i++) {
            this.store.searchResultItems.push(searchResult.Items[i]);
        }
        this.store.searching = false;
        this.triggerReRenderEvent();
    }

    public nextPage() {
        var nextPage = this.store.currentPage < (Math.ceil(this.store.totalItems / this.store.pageSize)) ? this.store.currentPage + 1 : this.store.currentPage;
        this.goToNewPage(nextPage);
    }

    public newPage(page: number) {
        var newPage = page <= (Math.ceil(this.store.totalItems / this.store.pageSize)) && page >= 1 ? page : this.store.currentPage;
        this.goToNewPage(newPage);
    }

    public previousPage() {
        var previousPage = this.store.currentPage > 1 ? this.store.currentPage - 1 : 1;
        this.goToNewPage(previousPage);
    }
}