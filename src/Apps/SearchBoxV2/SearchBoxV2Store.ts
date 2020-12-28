import { ViewPort } from "../../ViewPort";
// import { ISearchResult } from "../../APIs/StreamHubAPI/StreamHubApiClient";

export interface ISearchBoxV2Store {
    query: string;
    page: number;
    // searchResult: ISearchResult;
    focusInput: boolean;
}

export class SearchBoxV2Store implements ISearchBoxV2Store {

    public storedData: boolean;
    public viewPort: ViewPort;
    public query: string;
    public focusInput: boolean;
    public inputChangeCounter: number;
    public inputFontSize: string;
    public page: number;
    // public searchResult: ISearchResult;

    constructor(storedData: boolean, viewPort: ViewPort, query: string, page: number, focusInput: boolean) { // , searchResult: ISearchResult
        this.storedData = storedData;
        this.viewPort = viewPort;
        this.query = query;
        this.page = page;
        this.inputChangeCounter = 0;
        this.focusInput = focusInput;
        this.inputFontSize = "24px";
        // this.searchResult = searchResult;
    }
}