import TopMenu from "./TopMenu";
import TopMenuStore from "./TopMenuStore";
import TopMenuDispatcher from "./TopMenuDispatcher";
import * as  React from "react";
import * as  ReactDOM from "react-dom";
import {ViewPort} from "../../ViewPort";
import {ILink} from "./ILink";

export class TopMenuApp {

    _resizeCounter: number;
    _store: TopMenuStore;
    _dispatcher: TopMenuDispatcher;
    _container: any;

    constructor(container: any, viewPort: ViewPort, links: ILink[], search: (input: string) => void, transparentBackgroundPositionAbsolute: boolean) {
        this._resizeCounter = 0;
        var store = new TopMenuStore(viewPort, links, transparentBackgroundPositionAbsolute);
        this._store = store;
        this._container = container;
        this._storeChangedEvent = this._storeChangedEvent.bind(this);
        this._render = this._render.bind(this);
        this._dispatcher = new TopMenuDispatcher(this._storeChangedEvent, store, search);
        this._render(store);
    }

    _storeChangedEvent(store: TopMenuStore) {
        // update store, to support immutable store in the future
        this._store = store;
        this._render(store)
    }

    _render(store: TopMenuStore) {
        ReactDOM.render(
            React.createElement(TopMenu, { store: store, "dispatcher": this._dispatcher }),
            this._container
        );
    }

    destroy() {
        ReactDOM.unmountComponentAtNode(this._container);
    }

    getStore() {
        return this._store;
    }

    updateDimensions(newViewPort: ViewPort) {
        this._resizeCounter++;
        setTimeout(function () {
            this._resizeCounter--;
            if (this._resizeCounter == 0) {
                this._dispatcher.updateDimensionsAction(newViewPort);
            }
        }.bind(this), 300);
    }

    clickEvent() {
        if (!this._store.mouseClicked) { // on the mouse click is inside the topmenu then do nothing or close all open stuff
            this._dispatcher.closeAllOpenWindowsAction();
        }
        this._store.mouseClicked = false;  // reset clicked.... anti pattern ... what is the correct way ?
    }
}