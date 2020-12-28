import * as React from "react";
import * as ReactDOM from "react-dom";
import { MovieDiscoverStore } from "./MovieDiscoverStore";
import * as StreamHubApi from "../../APIs/StreamHubAPI/StreamHubApiClient";
import { Selectable, Filter, FilterType, SingleValueFilter, MultiSelectableFilter } from "./Models/Filter";
import { SortBy } from "./Models/SortBy";
import { ViewPort } from "../../ViewPort";
import { IMovie, Movie, Genre } from "../../Models/Movie";
import { MovieDiscoverMapper } from "./MovieDiscoverMapper";
import { MovieDiscoverSession } from "./MovieDiscoverSession"
import { IMovieListItemDispatcher } from "./../../Components/MovieListItem"
import { IMovieListDispatcher } from "./../../Components/MovieList"

export class MovieDiscoverDispatcher implements IMovieListDispatcher, IMovieListItemDispatcher {

    _store: MovieDiscoverStore;
    _storeUpdatedEvent: () => void;
    _streamHubApiClient: StreamHubApi.StreamHubApiClient;
    _lastMovieListItemDomElement: HTMLElement;
    _compontentIsMounted: boolean;
    _movieDiscoverSession: MovieDiscoverSession;

    constructor(storeUpdatedEvent: () => void, store: MovieDiscoverStore, viewPort: ViewPort, streamHubApiClient: StreamHubApi.StreamHubApiClient, movieDiscoverSession: MovieDiscoverSession) {
        this._store = store;
        this._storeUpdatedEvent = storeUpdatedEvent;
        this._streamHubApiClient = streamHubApiClient;
        this._compontentIsMounted = false;
        this._lastMovieListItemDomElement = undefined;
        this._movieDiscoverSession = movieDiscoverSession;

        this.AllowNextRangeOfMoviesAction = this.AllowNextRangeOfMoviesAction.bind(this);
        this.SetSelectedValueToSingleValueFilter = this.SetSelectedValueToSingleValueFilter.bind(this);
        this.RemoveSelectedSelectableFromMultiSelectableFilterAction = this.RemoveSelectedSelectableFromMultiSelectableFilterAction.bind(this);
        this.AddSelectedSelectableToMultiSelectableFilterAction = this.AddSelectedSelectableToMultiSelectableFilterAction.bind(this);
    }

    private fireUpdateEvent() {
        // maybe deepCopy store or storing changes
        this._storeUpdatedEvent();
    }

    private doWeLoadNextRangeOfMovies() {
        if (this.isMovieListItemVissibleInViewPort() &&
            !this._store.isfetchingMovies &&
            this._store.maxAmoutOfMoviesToLoad > this._store.moviesTo &&
            this._store.movies.length != this._store.total
        ) {
            this.fetchMoreMovies();
        }
    }

    private updateNumberOfMovieshorizontal(viewPort: ViewPort) {

        let numberOfMovieshorizontal = 2;
        let movieFetchTake = 20;

        if (viewPort.width <= 767) {
            numberOfMovieshorizontal = 2;
            movieFetchTake = 12;
        } else if (viewPort.width > 767 && viewPort.width <= 970) {
            numberOfMovieshorizontal = 2;
            movieFetchTake = 12;
        } else if (viewPort.width > 970 && viewPort.width <= 1200) {
            numberOfMovieshorizontal = 3;
            movieFetchTake = 24;
        } else if (viewPort.width > 1200) {
            numberOfMovieshorizontal = 4;
            movieFetchTake = 24;
        }

        this._store.movieFetchTake = movieFetchTake;
        this._store.numberOfMovieshorizontal = numberOfMovieshorizontal;
    }

    private getNextMovieFetchAmout() {
        return this._store.movieFetchTake * 4;
    }

    public fetchingMoviesAction(from: number, to: number) {

        this._store.isfetchingMovies = true;
        this.fireUpdateEvent();

        const params: { [id: string]: any; } = {};
        params["orderby"] = this._store.moviesSortby.id;
        params["orderbydirection"] = this._store.moviesSortByDirection;
        params["from"] = from;
        params["to"] = to;

        for (var i = 0; i < this._store.filters.length; i++) {
            const filterType = this._store.filters[i].type;
            if (filterType == FilterType.MultiSelectableListFilter || filterType == FilterType.MultiSelectableSearchFilter) {
                const multiSelectableFilter = this._store.filters[i] as MultiSelectableFilter;
                if (multiSelectableFilter.SelectedSelectables.length > 0) {
                    var selectables: string[] = [];
                    for (var j = 0; j < multiSelectableFilter.SelectedSelectables.length; j++) {
                        var element = multiSelectableFilter.SelectedSelectables[j];
                        selectables.push(element.id);
                    }
                    params[multiSelectableFilter.id] = selectables;
                }
            } else if (filterType == FilterType.SingleValueFilter) {
                const singleValueFilter = this._store.filters[i] as SingleValueFilter;
                if (singleValueFilter.SelectedValue != -1) {
                    params[singleValueFilter.id] = singleValueFilter.SelectedValue;
                }
            }
        }

        //sessionStorage.setItem("moviediscoverlastrequrest", JSON.stringify(params));

        var fetchMoviesPromise = this._streamHubApiClient.fetchMovies(params);
        fetchMoviesPromise.then((streamHubApiMovies) => {
            const movies = streamHubApiMovies.movies.map((movie) => {
                return MovieDiscoverMapper.ToMovie(movie);
            });
            // what if stored total is different from new total ? .. reset or
            if (from < this._store.moviesTo || from == 0) {
                this._store.moviesFrom = from;
                this._store.moviesTo = to;
                this._store.movies = movies;
                this._store.maxAmoutOfMoviesToLoad = 100;
                if (streamHubApiMovies.total > 0) {
                    this._store.total = streamHubApiMovies.total;
                } else {
                    this._store.total = 0;
                }
            } else {
                this._store.moviesTo = to;
                this._store.movies = this._store.movies.concat(movies);
            }
            this._movieDiscoverSession.SaveStore(this._store);
            this._store.isfetchingMovies = false;
            this.fireUpdateEvent();
        });
    }

    private fetchMoreMovies() {
        this.fetchingMoviesAction(this._store.moviesTo + 1, this._store.moviesTo + this._store.movieFetchTake);
    }

    private reloadMovies() {
        this._store.moviesFrom = 0;
        this._store.moviesTo = this._store.movieFetchTake - 1;
        this.fetchingMoviesAction(this._store.moviesFrom, this._store.moviesTo);
    }

    private isMovieListItemVissibleInViewPort() {
        if (!this._compontentIsMounted) {
            return false;
        }
        if (this._lastMovieListItemDomElement == undefined) {
            return false;
        }

        // var Value = ReactDOM.findDOMNode(this.refs[refID]).value;
        // var domNode = ReactDOM.findDOMNode()

        var rect = this._lastMovieListItemDomElement.getBoundingClientRect();
        var inViewPort = rect.top != 0 && rect.top < this._store.viewPort.height;
        return inViewPort;
    }

    private isLastMovieListItem(movie: IMovie) {
        let lastMovieIndex = this._store.movies.length - 1;
        let lastMovie = this._store.movies[lastMovieIndex];
        if (lastMovie.id == movie.id) {
            return true;
        }
        return false;
    }

    /*
    * Actions
    */

    Init(viewPort: ViewPort) {
        this.updateNumberOfMovieshorizontal(viewPort);
        this._store.viewPort = viewPort;
        if (this._store.movies === undefined || this._store.movies.length == 0) {
            this._store.moviesFrom = 0;
            this._store.moviesTo = this._store.movieFetchTake - 1;
            this.fetchingMoviesAction(this._store.moviesFrom, this._store.moviesTo);
        } else {
            this.fireUpdateEvent();
        }
    }

    SortBySelectedChangedAction(selectedSortBy: SortBy) {
        this._store.moviesSortby = selectedSortBy;
        this._store.moviesSortByDirection = selectedSortBy.defaultdirection;
        this.reloadMovies();
    }

    SetSelectedValueToSingleValueFilter(singleValueFilterId: string, selectedValue: number) {
        const filter: SingleValueFilter = this._store.getFilterById(singleValueFilterId) as SingleValueFilter;
        filter.SetSelectedValue(selectedValue);
        this.fireUpdateEvent();
        this.reloadMovies();
    }

    RemoveSelectedSelectableFromMultiSelectableFilterAction(multiSelectableFilterId: string, selectable: Selectable) {
        const filter: MultiSelectableFilter = this._store.getFilterById(multiSelectableFilterId) as MultiSelectableFilter;
        filter.RemoveSelectedSelectable(selectable);
        this.fireUpdateEvent();
        this.reloadMovies();
    }

    AddSelectedSelectableToMultiSelectableFilterAction(multiSelectableFilterId: string, selectable: Selectable) {
        this.fireUpdateEvent();
        const filter: MultiSelectableFilter = this._store.getFilterById(multiSelectableFilterId) as MultiSelectableFilter;
        filter.AddSelectedSelectable(selectable);
        this.reloadMovies();
    }

    UpdateViewPort(viewPort: ViewPort) {
        this._store.viewPort = viewPort;
        this.updateNumberOfMovieshorizontal(viewPort);
        this.fireUpdateEvent();
    }

    AllowNextRangeOfMoviesAction() {
        this._store.maxAmoutOfMoviesToLoad = this._store.maxAmoutOfMoviesToLoad + this.getNextMovieFetchAmout();
        this.fetchMoreMovies();
    }

    // SetLastMovieListItemDomElement(lastMovieListItemDomElement: HTMLElement) {
    //     this._lastMovieListItemDomElement = lastMovieListItemDomElement;
    // }

    MovieListItemMounted(movie: IMovie, movieListItemDomElement: HTMLElement) {
        if (this.isLastMovieListItem(movie)) {
            this._lastMovieListItemDomElement = movieListItemDomElement;
        }
    }

    OnScrolling() {
        this.doWeLoadNextRangeOfMovies();
    }

    SetCompontentIsMounted(isMounted: boolean, loadMovieMovies: boolean) {
        this._compontentIsMounted = isMounted;
        if (isMounted && loadMovieMovies) {
            this.doWeLoadNextRangeOfMovies();
        }
    }

    SetLastClickedInMovieSelectorId(id: string) {
        this._store.lastClickedInMovieSelectorId = id;
    }

    SetOpenSelectorAndCloseOtherOpen(id: string) {
        this._store.openMovieSelectorId = id;
        this.fireUpdateEvent();
    }

    CloseAllOpenSelectors(doFireUpdateEvent: boolean = true) {
        this._store.lastClickedInMovieSelectorId = "";
        this._store.openMovieSelectorId = "";
        if (doFireUpdateEvent) {
            this.fireUpdateEvent();
        }
    }

    ToogleSortByDirection() {
        if (this._store.moviesSortByDirection == "asc") {
            this._store.moviesSortByDirection = "desc";
        } else {
            this._store.moviesSortByDirection = "asc";
        }
        this.reloadMovies();
    }
} 