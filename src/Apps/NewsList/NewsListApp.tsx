import * as React from "react";
import * as ReactDOM from "react-dom";
import { ViewPort } from "../../ViewPort";
import { StreamHubApiClient } from "../../APIs/StreamHubAPI/StreamHubApiClient";
import { NewsListStore } from "./NewsListStore";
import List from './Components/List';
import { INewsListItem } from "./INewsListItem";
import { NewsListDispatcher } from "./NewsListDispatcher";
import { BaseAppIndex } from "../BaseAppIndex"

export class NewsListApp extends BaseAppIndex {

    private store: NewsListStore;
    private dispatcher: NewsListDispatcher;

    constructor(viewPort: ViewPort, items: INewsListItem[], navigationStartUri: string, navigationForwardUri: string, navigationBackUri: string, state: number) {
        super();

        this.store = new NewsListStore(viewPort, items, navigationStartUri, navigationForwardUri, navigationBackUri, state);
        this.dispatcher = new NewsListDispatcher();
    }

    public reRender(): void {
        this.render();
    }

    protected renderJSX(): JSX.Element {
        const store = this.store;
        const dispatcher = this.dispatcher;
        return <List 
                    items={store.Items} 
                    viewPort={store.ViewPort} 
                    maxWidth={this.targetWidth} 
                    navigationStartUri={store.NavigationStartUri} 
                    navigationForwardUri={store.NavigationForwardUri} 
                    navigationBackUri={store.NavigationBackUri}
                    navigationState={store.NavigationState}  />;
    }

    protected viewPortUpdated(newViewPort: ViewPort): void {
        this.dispatcher.UpdateViewPort(newViewPort);
        this.render();
    }

    protected onScrolling(): void {

    }

    protected onClickEvent(event: Event): void {

    }

    protected onKeyUpEvent(event: KeyboardEvent): void {

    }
}