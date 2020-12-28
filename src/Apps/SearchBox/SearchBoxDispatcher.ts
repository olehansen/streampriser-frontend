import { ViewPort } from "../../ViewPort";
import { SearchBoxStore } from "./SearchBoxStore"
import { StreamHubApiClient } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import * as  React from "react";
import * as  ReactDOM from "react-dom";
import { ISearchResultEvents } from "../InterAppCommunication";

export class SearchBoxDispatcher {

    public store: SearchBoxStore;
    public streamHubApiClient: StreamHubApiClient;
    private searchResultEvents: ISearchResultEvents;

    // search: (input: string, callback: (items: any[]) => void) => void;
    reRenderEvent: () => void;

    constructor(
        reRenderEvent: () => void,
        store: SearchBoxStore,
        streamHubApiClient: StreamHubApiClient) {

        this.reRenderEvent = reRenderEvent;
        this.store = store;
        this.streamHubApiClient = streamHubApiClient;

        this.doSearch = this.doSearch.bind(this);
        // this.handleKeyUpEvent = this.handleKeyUpEvent.bind(this);
        this.updateFontSizes(store.viewPort);
    }

    public setSearchResultEvents(searchResultEvents: ISearchResultEvents) {
        this.searchResultEvents = searchResultEvents;
    }

    public triggerReRenderEvent() {
        this.reRenderEvent();
    }

    private updateFontSizes(viewPort: ViewPort) {

        this.store.inputFontSize = "24px";
        // if (viewPort.isMobile()) {
        //     this.store.inputFontSize = "12px";
        // } else {
        // }
    }

    /*
    * Actions
    */

    public updateDimensionsAction(viewPort: ViewPort) {
        this.store.viewPort = viewPort;
        this.updateFontSizes(viewPort);
        this.triggerReRenderEvent();
    }

    // public clearFocus() {
    //     if (this.store.focusInput == true) {
    //         // console.log("clearFocus");
    //         this.store.focusInput = false;
    //         this.store.suggestions = [];
    //         this.startSearch();
    //         this.triggerReRenderEvent();
    //     }
    // }

    private newInput(newInput: string): void {
        // console.log("newInput");
        // history.pushState(null, null, "/soeg/" + newInput);
        this.store.input = newInput;
    }

    public fetchSearchResult(input: string, page: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.streamHubApiClient.searchContent(input, page, 25).then((searchResult) => {
                this.searchResultEvents.newSearchResult(searchResult, input);
                const paging = page > 1 ? "?page=" + page : "";
                history.pushState(null, null, "/soeg/" + input + paging);
                resolve();
            });
        });
    }

    private doSearch(input: string, closeSuggestions: boolean, page: number) {
        // if (closeSuggestions) {
        //     this.store.selectedSuggestedIndex = -1;
        //     this.store.suggestions = [];
        //     this.store.focusInput = false;
        // }
        const searchPromise = this.fetchSearchResult(input, page).then(() => {
            this.triggerReRenderEvent();
        });
    }

    public startSearch() {
        return this.doSearch(this.store.input, true, 1);
    }

    public changePage(page: number) {
        this.doSearch(this.store.input, true, page);
    }

    // public doSuggestionsSearch(input: string) {
    //     var splitedInput = input.split(" ");
    //     var lastWord = splitedInput[splitedInput.length - 1];
    //     splitedInput.splice(splitedInput.length - 1, 1);
    //     const searchPromise = this.streamHubApiClient.searchSuggestions(lastWord);
    //     searchPromise.then((values) => {
    //         this.store.suggestions = [];
    //         for (var i = 0; i < values.length; i++) {
    //             var suggestion = values[i];
    //             var prefix = splitedInput.length == 0 ? "" : splitedInput.join(" ") + " ";
    //             this.store.suggestions.push(prefix + suggestion);
    //         }
    //         this.triggerReRenderEvent();
    //     });
    // }

    public setInput(newInput: string): void {
        // console.log("setInput");
        this.newInput(newInput);
        this.store.selectedSuggestedIndex = -1;
        if (newInput == "") {
            this.store.focusInput = true;
            this.store.suggestions = [];
        }
        this.store.inputChangeCounter++;
        setTimeout(() => {
            this.store.inputChangeCounter--;
            if (this.store.inputChangeCounter == 0) {
                this.doSearch(this.store.input, false, 1);
                //this.doSuggestionsSearch(this.store.input);
            }
        }, 500);
        this.triggerReRenderEvent();
    }

    public setSuggestion(newInput: string) {
        // console.log("setSuggestion");
        this.newInput(newInput);
        this.store.suggestions = [];
        this.doSearch(newInput, true, 1);
        this.reRenderEvent();
    }

    // public handleKeyUpEvent(event: React.KeyboardEvent, inputElement: HTMLInputElement) {
    //     const keyCode = event.keyCode;
    //     // console.log(keyCode);
    //     if (this.store.suggestions.length > 0) {
    //         if (keyCode == 40) { // arrow down
    //             if (this.store.selectedSuggestedIndex == -1) {
    //                 this.store.selectedSuggestedIndex = 0;
    //             } else if (this.store.selectedSuggestedIndex >= 0 && this.store.selectedSuggestedIndex < (this.store.suggestions.length - 1)) {
    //                 this.store.selectedSuggestedIndex = this.store.selectedSuggestedIndex + 1;
    //             } else {
    //                 this.store.selectedSuggestedIndex = 0;
    //             }
    //             this.triggerReRenderEvent();
    //         } else if (keyCode == 38) { // arrow up
    //             if (this.store.selectedSuggestedIndex == -1) {
    //                 this.store.selectedSuggestedIndex = this.store.suggestions.length - 1;
    //             } else if (this.store.selectedSuggestedIndex > 0) {
    //                 this.store.selectedSuggestedIndex = this.store.selectedSuggestedIndex - 1;
    //             } else {
    //                 this.store.selectedSuggestedIndex = this.store.suggestions.length - 1;
    //             }
    //             this.triggerReRenderEvent();
    //         } else if (keyCode == 13) { // enter
    //             if (this.store.selectedSuggestedIndex != -1) {
    //                 this.setSuggestion(this.store.suggestions[this.store.selectedSuggestedIndex]);
    //             } else {
    //                 this.doSearch(this.store.input, true, 1);
    //             }
    //         } else if (event.keyCode == 27) { // esc
    //             this.doSearch(this.store.input, true, 1);
    //         }
    //     } else if (keyCode == 13) {
    //         this.doSearch(this.store.input, true, 1);
    //     }
    // }
}