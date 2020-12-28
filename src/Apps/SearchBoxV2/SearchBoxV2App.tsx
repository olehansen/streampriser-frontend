import * as  React from "react";
import * as  ReactDOM from "react-dom";
import { ViewPort } from "../../ViewPort";
import { BaseAppIndex } from "../BaseAppIndex"
import { SearchBoxV2 } from './components/SearchBoxV2';
import { StreamHubApiClient } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import { SearchBoxV2Dispatcher } from "./SearchBoxV2Dispatcher";
import { ISearchBoxV2Store, SearchBoxV2Store } from "./SearchBoxV2Store";
import { ISearchResultEvents, ISearchNavigationEvents } from "../InterAppCommunication";
import { SessionStoreStorage } from "../../Utils/SessionStoreStorage";
import * as ES6Shim from "es6-shim";

class SearchValues {
    Query: string;
    Page: number;
}

export class SearchBoxV2App extends BaseAppIndex implements ISearchNavigationEvents {

    private dispatcher: SearchBoxV2Dispatcher;
    private sessionStoreStorage: SessionStoreStorage;

    private getSearchFromHash(): SearchValues {

        const searchValues = new SearchValues();
        searchValues.Page = 1;
        searchValues.Query = "";

        var hashTagString = window.location.hash.substr(1);

        if (hashTagString.length > 0) {
            hashTagString.split("&").forEach(element => {
                if (element.startsWith("q")) {
                    searchValues.Query = element.split("=")[1];
                } else if (element.startsWith("p")) {
                    searchValues.Page = Number(element.split("=")[1]);
                }
            });
        }

        return searchValues;
    }

    constructor(viewPort: ViewPort, focusOnStart: boolean, baseUrl: string, storeAsJson: string) {
        super();

        this.renderJSX = this.renderJSX.bind(this);

        const streamHubApiClient = new StreamHubApiClient(baseUrl, "");

        var store: SearchBoxV2Store;

        if (storeAsJson != null && storeAsJson.length > 0) {
            const storeData = JSON.parse(storeAsJson) as ISearchBoxV2Store;
            store = new SearchBoxV2Store(true, viewPort, storeData.query, storeData.page, storeData.focusInput); // , storeData.searchResult
        } else {
            const searchValues = this.getSearchFromHash();
            store = new SearchBoxV2Store(false, viewPort, searchValues.Query, searchValues.Page, true);
        }

        // this.OnStoreUpdated(JSON.stringify(dispatcher.GetStore())); 
        const dispatcher = new SearchBoxV2Dispatcher(store, streamHubApiClient);
        dispatcher.storeUpdated = (s: SearchBoxV2Store) => {
            // sessionStoreStorage.SaveStore(s);
            this.triggerStoreUpdated(s);
            this.render();
        }
        this.dispatcher = dispatcher;
    }

    protected onInit(): Promise<void> {
        return this.dispatcher.onInit();
    }

    protected renderJSX(): JSX.Element {
        return <SearchBoxV2 dispatcher={this.dispatcher} store={this.dispatcher.store} />
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

    // ISearchNavigationEvents

    public setSearchResultEvents(searchResultEvents: ISearchResultEvents) {
        this.dispatcher.setSearchResultEvents(searchResultEvents);
    }

    public newPage(page: number): void {
        this.dispatcher.onPageChange(page);
    }

    // public

    public OnLocationHashChanged(): void {
        var searchValues = this.getSearchFromHash();
        if (searchValues.Query != this.dispatcher.store.query || searchValues.Page != this.dispatcher.store.page) {
            this.dispatcher.onLocationHashChange(searchValues.Query, searchValues.Page);
        }
    }
}