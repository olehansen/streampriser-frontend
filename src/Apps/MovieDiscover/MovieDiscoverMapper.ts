import { IMovie, Movie, IGenre, Genre } from "./../../Models/Movie";
import { IMovieDiscoverStore, MovieDiscoverStore } from "./MovieDiscoverStore";
import { ISelectable, SelectableType, Selectable, SelectableWithImgUrl, Filter, FilterType, SingleValueFilter, MultiSelectableFilter } from "./Models/Filter";
import { SortBy } from "./Models/SortBy";

export class MovieDiscoverMapper {

    public static ToMovie(movie: any) {
        const m = new Movie();
        m.id = movie.id;
        m.title = movie.title;
        m.year = movie.year;
        m.genres = movie.genres.map((g: any) => { return new Genre(g.id, g.name); });
        m.imageUrl = movie.imageurl;
        m.url = movie.url;
        m.bestRentalPrice = movie.bestprice_rental;
        m.bestSubscriptionPrice = movie.bestprice_subscription;
        m.bestOwnPrice = movie.bestprice_own;
        m.imdbrating = movie.imdbrating;
        return m;
    }

    public static ToMovieFromIMovie(movie: IMovie) {
        const m = new Movie();
        m.id = movie.id;
        m.title = movie.title;
        m.year = movie.year;
        m.genres = movie.genres.map((g: any) => { return new Genre(g.id, g.name); });
        m.imageUrl = movie.imageUrl;
        m.url = movie.url;
        m.bestRentalPrice = movie.bestRentalPrice;
        m.bestSubscriptionPrice = movie.bestSubscriptionPrice;
        m.bestOwnPrice = movie.bestOwnPrice;
        m.imdbrating = movie.imdbrating;
        return m;
    }

    public static ToMovieDiscoverStoreFromJSON(json: string, filters: Filter[], sortBies: SortBy[]): MovieDiscoverStore {

        const obj: IMovieDiscoverStore = JSON.parse(json);

        var filtersAny = obj.filters
        for (let i = 0; i < filtersAny.length; i++) {
            var filterAny = filtersAny[i];
            for (let j = 0; j < filters.length; j++) {
                var filter = filters[j];
                if (filter.id == filterAny.id) {
                    if (filter.type == FilterType.MultiSelectableListFilter || filter.type == FilterType.MultiSelectableSearchFilter) {
                        const multiSelectableFilter = filter as MultiSelectableFilter;
                        const selectedSelectables = filterAny.selected as ISelectable[];
                        for (var k = 0; k < selectedSelectables.length; k++) {
                            const selectedSelectable = selectedSelectables[k];
                            if (selectedSelectable.type == SelectableType.SelectableWithImgUrl) {
                                const selectable = new SelectableWithImgUrl(selectedSelectable.id, selectedSelectable.name, selectedSelectable.imgUrl);
                                multiSelectableFilter.AddSelectedSelectable(selectable);
                            } else {
                                var selectable = new Selectable(selectedSelectable.id, selectedSelectable.name);
                                multiSelectableFilter.AddSelectedSelectable(selectable);
                            }
                        }
                    } else if (filter.type == FilterType.SingleValueFilter) {
                        const singleValueFilter = filter as SingleValueFilter;
                        const selected: number = filterAny.selected as number;
                        singleValueFilter.SetSelectedValue(selected);
                    }
                }
            }
        }

        const store = new MovieDiscoverStore(filters, sortBies)

        // store.movies = [];
        // if (obj.movies != undefined) {
        //     const movies = obj.movies as Movie[];
        //     store.movies = movies.map((movie) => { return MovieDiscoverMapper.ToMovie(movie); })
        // }

        // store.total = obj.total;
        store.moviesFrom = obj.moviesFrom;
        store.moviesTo = obj.moviesTo;
        store.moviesSortby = obj.moviesSortby
        store.moviesSortByDirection = obj.moviesSortByDirection;
        store.movies = obj.movies;
        store.total = obj.total;
        return store;
    }
}