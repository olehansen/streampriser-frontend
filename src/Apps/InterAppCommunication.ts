import { ISearchResult } from "../APIs/StreamHubAPI/StreamHubApiClient";

export interface ISearchResultEvents {
    newSearchResult(searchResult: ISearchResult, query: string): void;
}

export interface ISearchNavigationEvents {
    newPage(page: number): void;
}