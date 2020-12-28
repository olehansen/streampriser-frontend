import TopMenuStore from "./TopMenuStore"
import {ViewPort, ScreenSizeMode} from "../../ViewPort";

export default class TopMenuDispatcher {

    store: TopMenuStore;
    search: (input: string, callback: (items: any[]) => void) => void;
    storeUpdatedEvent: (store: TopMenuStore) => void;
    
    constructor(storeUpdatedEvent: (store: TopMenuStore) => void, store: TopMenuStore, search: (input: string, callback: (items: any[]) => void) => void) {
        this.storeUpdatedEvent = storeUpdatedEvent;
        this.store = store;
        this.search = search;
    }

    fireUpdateEvent() {
        // may deepCopy store or storing changes
        this.storeUpdatedEvent(this.store);
    }

    /*
    * Actions
    */

    updateDimensionsAction(viewPort : ViewPort) {
        this.store.viewPort = viewPort;
        this.fireUpdateEvent();
    }

    toogleLeftMenuAction() {
        this.store.leftMenuIsOpen = !this.store.leftMenuIsOpen;
        this.fireUpdateEvent();
    }

    closeLeftMenuAction(preventUpdate: boolean = false) {
        this.store.leftMenuIsOpen = false;
        if(!preventUpdate) {
            this.fireUpdateEvent();
        }
    }

    openSearchAction() {
        this.store.searchIsOpen = true;
        this.store.leftMenuIsOpen = false;
        this.fireUpdateEvent();
    }

    closeSearchAction(preventUpdate: boolean = false) {
        this.store.searchIsOpen = false;
        this.store.searchInput = "";
        this.store.searchResultItem = [];
        if(!preventUpdate) {
            this.fireUpdateEvent();
        }
    }

    doSearchAction(input: string) {
        this.store.searchInput = input;
        this.store.isSearching = true;
        this.search(input, function (items: any[]) {
            this.store.searchResultItem = items;
            this.store.isSearching = false;
            this.fireUpdateEvent();
        }.bind(this));
        this.fireUpdateEvent();
    }

    closeAllOpenWindowsAction() {
        this.closeSearchAction(true);
        this.closeLeftMenuAction(true);
        this.fireUpdateEvent();
    }

    mouseClicked() {
        this.store.mouseClicked = true;
    }

    // InputFocused() {
    //     this.store.isInputFocused = true;
    //     this.fireUpdateEvent();
    // }

    // InputBlured() {
    //     this.store.isInputFocused = false;
    //     this.fireUpdateEvent();
    // }
}