import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import { ISearchResultItem } from "../../../APIs/StreamHubAPI/StreamHubApiClient";
import { SearchResultStore } from "../SearchResultStore";
import { SearchResultDispatcher } from "../SearchResultDispatcher";
import "./SearchResultItemChannelCategory.scss";

interface ISearchResultItemChannelCategoryProps {
    searchResultId: number,
    store: SearchResultStore,
    dispatcher: SearchResultDispatcher
}

interface ISearchResultItemChannelCategoryState {

}

export class SearchResultItemChannelCategory extends React.Component<ISearchResultItemChannelCategoryProps, ISearchResultItemChannelCategoryState> {

    constructor(props: ISearchResultItemChannelCategoryProps) {
        super(props);
    }

    //   R={searchResultItem.Relevance}  LD={searchResultItem.LD}

    render() {

        const { store } = this.props;
        const searchResultItem = store.searchResultItems[this.props.searchResultId];
        const channelCategory = searchResultItem.ChannelCategoryItem;

        const searchResultItemChannelCategoryClassNames = classNames({
            "streamhubjs-searchresultitemchannelcategory": true
        });

        const description = { __html: channelCategory.Description };

        return <div className={searchResultItemChannelCategoryClassNames} >
            <div className="title" style={{ fontSize: store.titleFontSize }}>
                {channelCategory.Name}
            </div >
            <div className="rightcontent">
                <span className="contenttype" style={{ fontSize: store.contentTypeFontSize }}>KATEGORI</span>
            </div>
            <div className="description" ><pre dangerouslySetInnerHTML={description}></pre></div>
        </div >;
    }
}