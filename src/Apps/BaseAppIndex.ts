import * as React from "react";
import * as ReactDOM from "react-dom";
import { ViewPort } from "../ViewPort";

export abstract class BaseAppIndex {

    private resizeCounter: number;
    private scrollingCounter: number;
    protected containerElement: HTMLElement;
    protected targetWidth: number;

    public OnStoreUpdated: (json: string) => void;
    
    constructor() {
        this.resizeCounter = 0;
        this.scrollingCounter = 0;
        this.render = this.render.bind(this);
        this.Render = this.Render.bind(this);
    }

    protected abstract renderJSX(): JSX.Element;
    protected abstract viewPortUpdated(newViewPort: ViewPort): void;
    protected abstract onScrolling(): void;
    protected abstract onClickEvent(event: Event): void;
    protected abstract onKeyUpEvent(event: KeyboardEvent): void;

    protected onInit(): Promise<void> {
        return Promise.resolve();
    }

    protected render(): void {
        ReactDOM.render(
            this.renderJSX(),
            this.containerElement
        );
    }

    public Render(element: HTMLElement): void {
        this.targetWidth = element.offsetWidth;
        this.containerElement = element;
        this.onInit().then(() => {
            this.render();
        });
    }

    public OnResize(event: Event, newViewPort: ViewPort) {
        this.resizeCounter++;
        setTimeout(() => {
            this.resizeCounter--;
            if (this.resizeCounter == 0) {
                this.targetWidth = this.containerElement.offsetWidth;
                this.viewPortUpdated(newViewPort);
            }
        }, 300);
    }

    public OnScroll() {
        this.scrollingCounter++;
        setTimeout(() => {
            this.scrollingCounter--;
            if (this.scrollingCounter == 0 || this.scrollingCounter % 8 == 0) {
                this.onScrolling();
            }
        }, 300);
    }

    public OnClick(event: Event) {
        this.onClickEvent(event);
    }

    public OnKeyUp(event: KeyboardEvent) {
        this.onKeyUpEvent(event);
    }

    protected triggerStoreUpdated(store: any)
    {
        if(this.OnStoreUpdated != null){
            this.OnStoreUpdated(store);
        }
    }
}