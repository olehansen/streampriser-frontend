import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import { SearchResultItemMovie } from "./SearchResultItemMovie";
import { SearchResultItemPerson } from "./SearchResultItemPerson";
import { SearchResultItemChannel } from "./SearchResultItemChannel";
import { SearchResultItemChannelCategory } from "./SearchResultItemChannelCategory";
import { SearchResultStore } from "../SearchResultStore";
import { SearchResultDispatcher } from "../SearchResultDispatcher";
import "./SearchResult.scss";

interface ISearchResultProps {
    store: SearchResultStore,
    dispatcher: SearchResultDispatcher
}

interface ISearchResultState {

}

export class SearchResult extends React.Component<ISearchResultProps, ISearchResultState> {

    constructor(props: ISearchResultProps) {
        super(props);
    }

    createMovieItemElement(searchResultId: number, store: SearchResultStore, dispatcher: SearchResultDispatcher, searchresultItemClassNames: string): JSX.Element {
        return <div className={searchresultItemClassNames} ><div className="inner"><SearchResultItemMovie searchResultId={searchResultId} dispatcher={dispatcher} store={store} /></div><div className="arrow"></div></div>;
    }

    createPersonItemElement(searchResultId: number, store: SearchResultStore, dispatcher: SearchResultDispatcher, searchresultItemClassNames: string): JSX.Element {
        return <div className={searchresultItemClassNames} ><div className="inner"><SearchResultItemPerson searchResultId={searchResultId} dispatcher={dispatcher} store={store} /></div><div className="arrow"></div></div>;
    }

    createChannelItemElement(searchResultId: number, store: SearchResultStore, dispatcher: SearchResultDispatcher, searchresultItemClassNames: string): JSX.Element {
        return <div className={searchresultItemClassNames} ><div className="inner"><SearchResultItemChannel searchResultId={searchResultId} dispatcher={dispatcher} store={store} /></div><div className="arrow"></div></div>;
    }

    createChannelCategoryItemElement(searchResultId: number, store: SearchResultStore, dispatcher: SearchResultDispatcher, searchresultItemClassNames: string): JSX.Element {
        return <div className={searchresultItemClassNames} ><div className="inner"><SearchResultItemChannelCategory searchResultId={searchResultId} dispatcher={dispatcher} store={store} /></div><div className="arrow"></div></div>;
    }

    render() {

        const { dispatcher, store } = this.props;

        if (store.isBlank) {
            return <div style={{ height: "300px" }}></div>;
        }

        if (store.totalItems == 0) {
            return <div style={{ height: "300px" }} >Ingen result</div>;
        }
        // if (store.searching) {
        //     return <div className="loading"><span className="loadingicon"></span><span className="loadingtext">Søger</span></div>;
        // }

        const { searchResultItems } = store;

        const searchresultClassNames = classNames({
            "streamhubjs-searchresult": true
        });

        let searchResultElements: JSX.Element[] = []

        for (var i = 0; i < searchResultItems.length; i++) {
            const searchContent = searchResultItems[i];
            const searchresultItemClassNames = classNames({
                "item": true,
                "first": i == 0,
                "last": i == (searchResultItems.length - 1)
            });

            if (searchContent.Type == 1) {
                var element: JSX.Element = <a key={i} href={searchContent.Url} >{this.createMovieItemElement(i, store, dispatcher, searchresultItemClassNames)}</a>;
                searchResultElements.push(element);
            } else if (searchContent.Type == 2) {
                var element: JSX.Element = <a key={i} href={searchContent.Url} >{this.createPersonItemElement(i, store, dispatcher, searchresultItemClassNames)}</a>;
                searchResultElements.push(element);
            } else if (searchContent.Type == 3) {
                var element: JSX.Element = <a key={i} href={searchContent.Url} >{this.createChannelItemElement(i, store, dispatcher, searchresultItemClassNames)}</a>;
                searchResultElements.push(element);
            } else if (searchContent.Type == 4) {
                var element: JSX.Element = <a key={i} href={searchContent.Url} >{this.createChannelCategoryItemElement(i, store, dispatcher, searchresultItemClassNames)}</a>;
                searchResultElements.push(element);
            }
        }

        let pageStart = store.currentPage - 2 < 1 ? 1 : store.currentPage - 2;
        let pageEnd = pageStart + 4 > store.maxPage ? store.maxPage : pageStart + 4;
        if (pageStart > pageEnd - 4 && pageEnd - 4 > 1) {
            pageStart = pageEnd - 4;
        }

        const pagingButtons: JSX.Element[] = [];
        for (var i = pageStart; i <= pageEnd; i++) {
            const changePage = (function (j) { // a closure is created
                return function () {
                    dispatcher.newPage(j);
                }
            }(i));
            pagingButtons.push(<button key={i} className={store.currentPage == i ? "current" : ""} onClick={(e) => {
                e.preventDefault();
                changePage();
            }}  >{i}</button>)
        }

        return <div className={searchresultClassNames} style={{ fontSize: store.fontSize }} >
            <div className="searchInfo">Side {store.currentPage} af {store.maxPage} med {store.totalItems} resultater. Søgningen udført på {(store.elapsedMilliseconds / 1000).toLocaleString("da-dk", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sekunder</div>
            <div>
                {searchResultElements}
            </div>
            <div className={store.maxPage == 1 ? "hide" : "paging"}>
                <button className={store.currentPage == 1 ? "hide" : ""} onClick={(e) => { e.preventDefault(); dispatcher.previousPage(); }} >Forrige</button>
                {pagingButtons}
                <button className={store.currentPage == store.maxPage ? "hide" : ""} onClick={(e) => { e.preventDefault(); dispatcher.nextPage(); }} >Næste</button>
            </div>
        </div >;
    }
}