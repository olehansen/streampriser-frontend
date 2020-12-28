
import { SortBy } from "./Models/SortBy";
import { IFilter, Filter } from "./Models/Filter";
import { IMovie, Movie, Genre } from "./../../Models/Movie";
import { ViewPort, ScreenSizeMode } from "../../ViewPort";
import { MovieDiscoverMapper } from "./MovieDiscoverMapper";

export interface IMovieDiscoverStore {
    filters: IFilter[];
    moviesFrom: number;
    moviesTo: number;
    moviesSortby: SortBy;
    moviesSortByDirection: string;
    movies: IMovie[];
    total: number;
}

export class MovieDiscoverStore {

    filters: Filter[];
    sortBies: SortBy[];
    viewPort: ViewPort;
    movies: Movie[];
    total: number;
    isfetchingMovies: boolean;
    maxAmoutOfMoviesToLoad: number;
    numberOfMovieshorizontal: number;
    movieFetchTake: number;
    openMovieSelectorId: string;
    lastClickedInMovieSelectorId: string;
    moviesFrom: number;
    moviesTo: number;
    moviesSortby: SortBy;
    moviesSortByDirection: string;

    constructor(filters: Filter[], sortBies: SortBy[]) {
        this.moviesFrom = 0;
        this.moviesTo = 0;
        this.moviesSortby = sortBies[5];
        this.movieFetchTake = 12;
        this.filters = filters;
        this.sortBies = sortBies;
        this.viewPort = new ViewPort(320, 400, ScreenSizeMode.mobile);
        this.movies = [];
        this.total = 0;
        this.isfetchingMovies = false;
        this.maxAmoutOfMoviesToLoad = 100;
        this.numberOfMovieshorizontal = 2;
        this.openMovieSelectorId = "";
        this.lastClickedInMovieSelectorId = "";
        this.moviesSortByDirection = "desc"
    }

    ToIMovieDiscoverStore(): IMovieDiscoverStore {
        return {
            filters: this.filters.map(x => x.ToIFilter()),
            moviesFrom: this.moviesFrom,
            moviesTo: this.moviesTo,
            moviesSortby: this.moviesSortby,
            moviesSortByDirection: this.moviesSortByDirection,
            movies: this.movies,
            total: this.total
        };
    }

    getFilterById(id: string): Filter {
        for (var i = 0; i < this.filters.length; i++) {
            var filter = this.filters[i];
            if (filter.id == id) {
                return filter;
            }
        }
        throw "No filter found with id=" + id;
    }
}