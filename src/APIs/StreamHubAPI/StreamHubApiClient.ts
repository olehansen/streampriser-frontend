import 'whatwg-fetch'

declare var fetch: any;
declare var Headers: any;
declare var Header: any;

export interface IGenre {
    id: string;
    name: string;
}

export interface IMovie {
    id: string;
    title: string;
    year: number;
    genres: IGenre[];
    imageurl: string;
    url: string;
    bestprice_rental: number;
    bestprice_subscription: number;
    imdbrating: number;
}

export interface IIdName {
    id: string;
    name: string;
}

export class StreamHubApiMovies {
    movies: IMovie[]
    total: number;
    constructor(movies: IMovie[], total: number) {
        this.movies = movies;
        this.total = total;
    }
}

export interface ISearchResultItemMovie {
    Title: string;
    TitleAlt: string;
    Year: number;
    ImageUrl: string;
    ImageAlt: string;
    Actors: string[];
    Directors: string[];
    Genres: string[];
}

export interface ISearchResultItemPerson {
    Name: string;
    ImageUrl: string;
    ImageAlt: string;
    MovieTitles: string;
}

export interface ISearchResultItemChannel {
    Title: string;
    Description: string;
}

export interface ISearchResultItemChannelCategroy {
    Name: string;
    Description: string;
}

export interface ISearchResultItem {
    Url: string;
    Relevance: number;
    Type: number;
    LD: string;
    MovieItem: ISearchResultItemMovie;
    PersonItem: ISearchResultItemPerson;
    ChannelItem: ISearchResultItemChannel;
    ChannelCategoryItem: ISearchResultItemChannelCategroy;
}

export interface ISearchResult {
    Query: string;
    Items: ISearchResultItem[];
    Page: number;
    PageSize: number;
    TotalItems: number;
    ElapsedMilliseconds: number;
}

export class StreamHubApiClient {

    constructor(private baseUrl: string, private streamhubId: string) {

    }

    fetchMovies(params: { [id: string]: any; }): Promise<StreamHubApiMovies> {
        return new Promise<StreamHubApiMovies>((resolve, reject) => {
            fetch(this.baseUrl + '/film/filter/movies',
                {
                    method: 'POST',
                    redirect: 'follow',
                    body: JSON.stringify(params),
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8',
                        'StreamhubId': this.streamhubId
                    }),
                    credentials: 'same-origin'
                })
                .then((response: any) => {
                    response.json().then((data: any) => {
                        resolve(new StreamHubApiMovies(data.movies, data.total));
                    });
                });
        });
    }

    searchTagName(tagName: string): Promise<IIdName[]> {
        return new Promise<IIdName[]>((resolve, reject) => {
            fetch(this.baseUrl + '/search/tags?tagname=' + tagName,
                {
                    method: 'GET',
                    redirect: 'follow',
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    }),
                    credentials: 'same-origin'
                })
                .then((response: any) => {
                    response.json().then((data: IIdName[]) => {
                        resolve(data);
                    });
                });
        });
    }

    searchActorName(actorName: string): Promise<IIdName[]> {
        return new Promise<IIdName[]>((resolve, reject) => {
            fetch(this.baseUrl + '/search/actors?name=' + actorName,
                {
                    method: 'GET',
                    redirect: 'follow',
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    }),
                    credentials: 'same-origin'
                })
                .then((response: any) => {
                    response.json().then((data: IIdName[]) => {
                        resolve(data);
                    });
                });
        });
    }

    searchDirectorsName(directorName: string): Promise<IIdName[]> {
        return new Promise<IIdName[]>((resolve, reject) => {
            fetch(this.baseUrl + '/search/directors?name=' + directorName,
                {
                    method: 'GET',
                    redirect: 'follow',
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    }),
                    credentials: 'same-origin'
                })
                .then((response: any) => {
                    response.json().then((data: IIdName[]) => {
                        resolve(data);
                    });
                });
        });
    }

    searchSuggestions(input: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fetch(this.baseUrl + '/search/suggestions?input=' + input,
                {
                    method: 'GET',
                    redirect: 'follow',
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    }),
                    credentials: 'same-origin'
                })
                .then((response: any) => {
                    response.json().then((data: string[]) => {
                        resolve(data);
                    });
                });
        });
    }

    searchContent(query: string, page: number, pagesize: number): Promise<ISearchResult> {
        return new Promise<ISearchResult>((resolve, reject) => {
            fetch(this.baseUrl + '/search/content?query=' + query + "&page=" + page + "&pagesize=" + pagesize,
                {
                    method: 'GET',
                    redirect: 'follow',
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json; charset=utf-8'
                    }),
                    credentials: 'same-origin'
                })
                .then((response: any) => {
                    response.json().then((data: ISearchResult) => {
                        resolve(data);
                    });
                });
        });
    }
}