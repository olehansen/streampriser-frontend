import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import { ISearchResultItem } from "../../../APIs/StreamHubAPI/StreamHubApiClient";
import { SearchResultStore } from "../SearchResultStore";
import { SearchResultDispatcher } from "../SearchResultDispatcher";
import "./SearchResultItemPerson.scss";

interface ISearchResultItemPersonProps {
    searchResultId: number,
    store: SearchResultStore,
    dispatcher: SearchResultDispatcher
}

interface ISearchResultItemPersonState {

}

export class SearchResultItemPerson extends React.Component<ISearchResultItemPersonProps, ISearchResultItemPersonState> {

    constructor(props: ISearchResultItemPersonProps) {
        super(props);
    }

    render() {

        const { store } = this.props;
        const searchResultItem = store.searchResultItems[this.props.searchResultId];
        const person = searchResultItem.PersonItem;

        const searchResultItemMovieClassNames = classNames({
            "streamhubjs-searchresultitemperson": true
        });

        const imageContainerClassNames = classNames({
            "personimg": true,
            "hide": person.ImageUrl.length == 0
        });

        //  R={searchResultItem.Relevance}  LD={searchResultItem.LD}
        {/*<img src={person.ImageUrl} alt={person.ImageAlt} />*/ }
        return <div className={searchResultItemMovieClassNames} >
            <div className={imageContainerClassNames} >
                <div style={{ width: "100%", height: "100%", backgroundPosition: "top center", backgroundImage: "url(" + person.ImageUrl + ")", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}></div>
            </div>
            <div className="right rightcontent" >
                <div className="name" style={{ fontSize: store.titleFontSize }}>
                    <b>{person.Name}</b>
                </div>
                <div className="newcontent">
                    <span className="contenttype" style={{ fontSize: store.contentTypeFontSize }}>PERSON</span>
                </div>
                <div className={person.MovieTitles.length > 0 ? "moviestitles" : "hide"} ><b>Skuespiller i:</b> {person.MovieTitles}</div>
            </div>
        </div >;
    }
}