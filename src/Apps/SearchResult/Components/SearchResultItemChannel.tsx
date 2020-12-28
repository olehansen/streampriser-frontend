import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as classNames from 'classnames';
import { ViewPort } from "../../..//ViewPort";
import { ISearchResultItem } from "../../..//APIs/StreamHubAPI/StreamHubApiClient";
import { SearchResultStore } from "../SearchResultStore";
import { SearchResultDispatcher } from "../SearchResultDispatcher";
import "./SearchResultItemChannel.scss";

interface ISearchResultItemChannelProps {
    searchResultId: number,
    store: SearchResultStore,
    dispatcher: SearchResultDispatcher
}

interface ISearchResultItemChannelState {

}

export class SearchResultItemChannel extends React.Component<ISearchResultItemChannelProps, ISearchResultItemChannelState> {

    constructor(props: ISearchResultItemChannelProps) {
        super(props);
    }

    render() {

        const { store } = this.props;
        const searchResultItem = store.searchResultItems[this.props.searchResultId];
        const channel = searchResultItem.ChannelItem;

        const searchResultItemMovieClassNames = classNames({
            "streamhubjs-searchresultitemchannel": true,
            "rightcontent": true
        });

        const description = { __html: channel.Description };

        return <div className={searchResultItemMovieClassNames} >
            <div className="title" style={{ fontSize: store.titleFontSize }}>{channel.Title}</div>
            <div className="newcontent">
                <span className="contenttype" style={{ fontSize: store.contentTypeFontSize }} >KANAL</span>
            </div>
            <div className="description" ><pre dangerouslySetInnerHTML={description}></pre></div>
        </div>;
    }
}