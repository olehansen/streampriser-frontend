import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as classNames from 'classnames';
import MovieDiscoverList from './../../../Components/MovieList';
import { Dropdown, IDropdownListItem } from './../../../Components/Dropdown';
import MovieDiscoverFilterSelector from './MovieDiscoverFilterSelector';
import MovieDiscoverFilterSelected from './MovieDiscoverFilterSelected';
import { MovieDiscoverStore } from "./../MovieDiscoverStore";
import { MovieDiscoverDispatcher } from "./../MovieDiscoverDispatcher";
import { SortBy } from "./../Models/SortBy";
import { Arrow } from "../../../Components/Arrow";
import "./MovieDiscover.scss";

interface IMovieDiscoverProps {
    dispatcher: MovieDiscoverDispatcher,
    store: MovieDiscoverStore,
    forceClose: boolean
}

interface IMovieDiscoverState {
}

export default class MovieDiscover extends React.Component<IMovieDiscoverProps, IMovieDiscoverState> {

    constructor(props: IMovieDiscoverProps) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatcher.SetCompontentIsMounted(true, false);
    }

    componentDidUpdate() {
        this.props.dispatcher.SetCompontentIsMounted(true, true);
    }

    changeOrderByDirection() {
        this.props.dispatcher.ToogleSortByDirection();
    }

    render() {

        const {store, dispatcher, forceClose} = this.props;
        const {viewPort, filters, total, moviesSortby} = store;

        var movieDiscoverClassNames = classNames({
            "moviediscover": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        var filterElements = new Array();

        for (var i = 0; i < filters.length; i++) {

            var filter = filters[i];

            if (viewPort.isMobile()) {
                filterElements.push(
                    <div key={filter.id} style={{ "width": "100%" }} className="filteroptions-mobile">
                        <MovieDiscoverFilterSelector store={store} dispatcher={dispatcher} filter={filter} />
                    </div>);
            } else if (viewPort.isMobile()) {
                filterElements.push(
                    <div key={filter.id} style={{ "width": "200px" }} className="filteroptions-tablet">
                        <MovieDiscoverFilterSelector store={store} dispatcher={dispatcher} filter={filter} />
                    </div>
                );
            } else {
                filterElements.push(
                    <div key={filter.id} style={{ "width": "350px" }} className="filteroptions-desktop">
                        <MovieDiscoverFilterSelector store={store} dispatcher={dispatcher} filter={filter} />
                    </div>
                );
            }
        }

        var filterOptionsClassNames = classNames({
            "filteroptions": !viewPort.isMobile()
        });

        var orderByDirectionClassNames = classNames({
            "orderbydirection": true
        });

        var loadingMoviesClassNames = classNames({
            "loadingmovies": true,
            "show": store.isfetchingMovies
        });

        var moreMoviesClassNames = classNames({
            "moremovies": true,
            "hide": store.moviesTo >= store.total || store.maxAmoutOfMoviesToLoad >= store.moviesTo
        });

        // const padding = !viewPort.isMobile() ? (viewPort.width * 0.1) + "px" : "0px";

        //  style={{ paddingLeft: padding, paddingRight: padding }}

        return (
            <div className={movieDiscoverClassNames} >
                <div className="litem">
                    <div className="selectedFilterValues">
                        <div className={filterOptionsClassNames}>
                            <div className="filterItems">
                                {filterElements}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="litem">
                    <div className="title">Valgte filtre: </div>
                    <MovieDiscoverFilterSelected store={store} dispatcher={dispatcher} />
                </div>
                <div className="litem simplesortby">
                    <div className="title">
                        Sortér efter:
                    </div>
                    <div className="dropdownAndDirection">
                        <div className="dropdown">
                            <Dropdown options={store.sortBies} selectedId={moviesSortby.id} selectedChanged={(selected: IDropdownListItem) => dispatcher.SortBySelectedChangedAction(selected as SortBy)} forceClose={forceClose} />
                        </div>
                        <div className={orderByDirectionClassNames} onClick={this.changeOrderByDirection.bind(this)}><Arrow direction={store.moviesSortByDirection == "asc" ? "up" : "down"} size="medium" /></div>
                    </div>
                </div>
                <div>
                    <div className="info">{total.toLocaleString("da-DK")} film fundet</div>
                    <MovieDiscoverList key="movieDiscoverList" movies={store.movies} viewPort={store.viewPort} dispatcher={dispatcher} center={false} />
                    <div className={loadingMoviesClassNames}><span className="loadingicon"></span><span className="loadingtext">Henter flere film</span></div>
                    <div className={moreMoviesClassNames} onClick={() => { dispatcher.AllowNextRangeOfMoviesAction(); } }>Vis flere film</div>
                </div>
            </div>
        );
    }
}