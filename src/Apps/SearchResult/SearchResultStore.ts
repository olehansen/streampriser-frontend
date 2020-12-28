import { ViewPort } from "../../ViewPort";
import { ISearchResultItem } from "../../APIs/StreamHubAPI/StreamHubApiClient";

export class SearchResultStore {

    public viewPort: ViewPort;
    public searchResultItems: ISearchResultItem[]
    public currentPage: number;
    public pageSize: number;
    public totalItems: number;
    public maxPage: number;
    public elapsedMilliseconds: number;
    public searching: boolean;
    public isBlank: boolean;
    public fontSize: string;
    public titleFontSize: string;
    public contentTypeFontSize: string;

    constructor(viewPort: ViewPort) {
        this.viewPort = viewPort;
        this.searchResultItems = [];
        this.currentPage - 1;
        this.pageSize = -1;
        this.totalItems = -1;
        this.maxPage = -1;
        this.elapsedMilliseconds = -1;
        this.searching = true;
        this.fontSize = "12px";
        this.titleFontSize = "16px";
        this.contentTypeFontSize = "13px";
        this.isBlank = true;
    }
}