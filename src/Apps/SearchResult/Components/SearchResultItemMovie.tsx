import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import { ISearchResultItem } from "../../../APIs/StreamHubAPI/StreamHubApiClient";
import { SearchResultStore } from "../SearchResultStore";
import { SearchResultDispatcher } from "../SearchResultDispatcher";
import "./SearchResultItemMovie.scss";

interface ISearchResultItemMovieProps {
    searchResultId: number,
    store: SearchResultStore,
    dispatcher: SearchResultDispatcher
}

interface ISearchResultItemMovieState {
}

export class SearchResultItemMovie extends React.Component<ISearchResultItemMovieProps, ISearchResultItemMovieState> {

    constructor(props: ISearchResultItemMovieProps) {
        super(props);
    }

    render() {

        const { store } = this.props;
        const searchResultItem = store.searchResultItems[this.props.searchResultId];
        const movie = searchResultItem.MovieItem;

        const searchResultItemMovieClassNames = classNames({
            "streamhubjs-SearchResultItemMovie": true
        });

        const imageContainerClassNames = classNames({
            "movieimg": true,
            "hide": movie.ImageUrl.length == 0
        });

        const altTitleClassNames = classNames({
            "alt": true,
            "hide": movie.TitleAlt == undefined || movie.TitleAlt.toLowerCase() == movie.Title.toLowerCase()
        });

        //   R={searchResultItem.Relevance} LD={searchResultItem.LD}

        var genres = movie.Genres.join(", ");
        var actors = movie.Actors.join(", ");
        var directors = movie.Directors.join(", ");
        const movieImgUrl = movie.ImageUrl + "?width=188";

        // {movie.ImageAlt}
        return <div className={searchResultItemMovieClassNames} >
            <div className={imageContainerClassNames} >
                <div style={{ width: "100%", height: "100%", backgroundPosition: "top center", backgroundImage: "url(" + movieImgUrl + ")", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}></div>
                {/*<img src={movie.ImageUrl} alt="" />*/}
            </div>
            <div className="right rightcontent">
                <div className="title" style={{ fontSize: store.titleFontSize }}>
                    <b>{movie.Title}</b> ({movie.Year})
                    <div className={altTitleClassNames} >- {searchResultItem.MovieItem.TitleAlt}</div>
                </div>
                <div className="newcontent">
                    <span className="contenttype" style={{ fontSize: store.contentTypeFontSize }}>FILM</span>
                </div>
                <div className={genres.length > 0 ? "" : "hide"}><b>Genre:</b> {genres}</div>
                <div className={actors.length > 0 ? "" : "hide"}><b>Skuespillere:</b> {actors}</div>
                <div className={directors.length > 0 ? "" : "hide"} ><b>Instruktør:</b> {directors}</div>
            </div>
        </div >;
    }
}