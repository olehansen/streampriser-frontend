import * as React from 'react';
import * as classNames from 'classnames';
import { ViewPort } from "../ViewPort";
import { IMovie } from "../Models/Movie";
import { IMovieListItemDispatcher, MovieListItem } from "./MovieListItem"
import "./MovieList.scss";

export interface IMovieListDispatcher extends IMovieListItemDispatcher {

}

interface IMovieListProps {
    dispatcher: IMovieListDispatcher,
    viewPort: ViewPort
    movies: IMovie[],
    center: boolean
}

interface IMovieListState {

}

export default class MovieList extends React.Component<IMovieListProps, IMovieListState> {

    constructor(props: IMovieListProps) {
        super(props);
    }

    render() {

        const { viewPort, movies, dispatcher, center } = this.props;
        let rowCounter = 0;
        const lastCount = movies.length;
        var movieListItems = movies.map(function (movie) {
            rowCounter = rowCounter + 1;
            return <MovieListItem key={movie.id} viewPort={viewPort} isOdd={false} dispatcher={dispatcher} movie={movie} isLastItem={rowCounter == lastCount} />;
        });

        var MovieListClassName = classNames({
            "MovieList": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile(),
            "center": center
        });

        return (<div className={MovieListClassName}>{movieListItems}</div>);
    }
}