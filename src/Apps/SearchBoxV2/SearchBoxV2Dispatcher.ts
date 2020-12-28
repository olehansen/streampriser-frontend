import { ViewPort } from "../../ViewPort";
import { SearchBoxV2Store } from "./SearchBoxV2Store"
import { StreamHubApiClient } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import * as  React from "react";
import * as  ReactDOM from "react-dom";
import { ISearchResultEvents } from "../InterAppCommunication";
import { BaseDispatcher } from "../../BaseDispatcher";

export class SearchBoxV2Dispatcher extends BaseDispatcher<SearchBoxV2Store> {

    public streamHubApiClient: StreamHubApiClient;
    private searchResultEvents: ISearchResultEvents;

    constructor(
        store: SearchBoxV2Store,
        streamHubApiClient: StreamHubApiClient) {
        super(store);

        this.doSearch = this.doSearch.bind(this);

        this.streamHubApiClient = streamHubApiClient;
        // this.updateFontSizes(store.viewPort);
    }

    public setSearchResultEvents(searchResultEvents: ISearchResultEvents) {
        this.searchResultEvents = searchResultEvents;
    }

    public triggerReRenderEvent() {
        this.fireStoreUpdated()
    }

    // private updateFontSizes(viewPort: ViewPort) {
    //     this.store.inputFontSize = "24px";
    // }

    /*
    * Actions
    */

    public updateDimensionsAction(viewPort: ViewPort) {
        this.store.viewPort = viewPort;
        // this.updateFontSizes(viewPort);
        this.triggerReRenderEvent();
    }

    // public clearFocus() {
    //     if (this.store.focusInput == true) {
    //         // console.log("clearFocus");
    //         this.store.focusInput = false;
    //         this.startSearch();
    //         this.triggerReRenderEvent();
    //     }
    // }

    // private newInput(newInput: string): void {
    //     // console.log("newInput");
    //     // history.pushState(null, null, "/soeg/" + newInput);
    //     this.store.query = newInput;
    // }

    // private fetchSearchResult(input: string, page: number): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         this.streamHubApiClient.searchContent(input, page, 25).then((searchResult) => {
    //             this.searchResultEvents.newSearchResult(searchResult, input);
    //             resolve();
    //         });
    //     });
    // }

    private setLocationHashValues(query: string, page: number) {
        const paging = page > 1 ? "&p=" + page : "";
        history.pushState(null, null, window.location.href.substr(0, window.location.href.indexOf("#")) + "#q=" + query + paging);
    }

    private doSearch(input: string, page: number): Promise<void> {
        this.store.query = input;
        this.store.page = page;
        this.setLocationHashValues(input, page);
        return new Promise<void>((resolve, reject) => {
            this.streamHubApiClient.searchContent(input, page, 25).then((searchResult) => {
                // this.store.searchResult = searchResult;
                this.fireStoreUpdated();
                this.searchResultEvents.newSearchResult(searchResult, input);
                resolve();
            });
        });
    }

    public onInit(): Promise<void> {
        if (!this.store.storedData) {
            // if (this.store.searchResult != null) {
            //     // var dummy = new Promise<void>((resolve, reject) => {
            //     //     this.searchResultEvents.newSearchResult(this.store.searchResult, this.store.query);
            //     // });
            // } else {
        } else if (this.store.query.length > 0) {
            return this.doSearch(this.store.query, this.store.page);
        }

        return Promise.resolve();
    }

    public onPageChange(page: number) {
        this.doSearch(this.store.query, page);
    }

    public onInputChange(newInput: string): void {
        this.store.query = newInput;
        if (newInput == "") {
            this.store.focusInput = true;
        }
        this.store.inputChangeCounter++;
        setTimeout(() => {
            this.store.inputChangeCounter--;
            if (this.store.inputChangeCounter == 0) {
                this.doSearch(newInput, 1);
            }
        }, 500);
        this.triggerReRenderEvent();
    }

    public onLocationHashChange(query: string, page: number) {
        this.doSearch(query, page);
    }

    public onInputBlur() {
        this.store.focusInput = false;
        this.triggerReRenderEvent();
    }
}