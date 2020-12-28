import * as React from "react";
import * as ReactDOM from "react-dom";
import { ViewPort } from "../../ViewPort";
import { BaseAppIndex } from "../BaseAppIndex";
import './Channels.scss';

export class IChannelItem {
    Id: number;
    ImgUrl: string;
    Name: string;
    Url: string;
    Description: string;
}

export class ChannelsApp extends BaseAppIndex {

    private channelItems: IChannelItem[];

    constructor(viewPort: ViewPort, channelItems: IChannelItem[]) {
        super();

        this.channelItems = channelItems;
    }

    public reRender(): void {
        this.render();
    }

    private urlToChannel(id: number, uri: string): string {
        return uri;
        // return "/kanaler/k" + id.toString() + "/" +uri;
    }

    protected renderJSX(): JSX.Element {
        var channelElements: JSX.Element[] = [];
        for (var i = 0; i < this.channelItems.length; i++) {
            var channelItem = this.channelItems[i];
            channelElements.push(
                <div className="channelbox" id={"channel_" + channelItem.Id} style={{ backgroundColor: "white" }}>
                    <a href={this.urlToChannel(channelItem.Id, channelItem.Url)} >
                        <div className="name text-center" style={{ width: "100%" }}>{channelItem.Name}</div>
                        <div className="inner-img">
                            <div className="channelimg" style={{ background: "url('" + channelItem.ImgUrl + "?width=553') no-repeat", backgroundSize: "cover", backgroundPosition: "top center" }}>
                            </div>
                        </div>
                    </a >
                </div >);
        }

        return <div className="channels">{channelElements}</div>;
    }

    protected viewPortUpdated(newViewPort: ViewPort): void {

    }

    protected onScrolling(): void {

    }

    protected onClickEvent(event: Event): void {

    }

    protected onKeyUpEvent(event: KeyboardEvent): void {

    }
}