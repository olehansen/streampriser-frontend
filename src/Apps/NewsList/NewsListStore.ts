import { INewsListItem } from "./INewsListItem"
import { ViewPort } from "../../ViewPort"

export class NewsListStore {

    public Items: INewsListItem[];
    public ViewPort: ViewPort;
    public NavigationStartUri: string;
    public NavigationForwardUri: string;
    public NavigationBackUri: string;
    public NavigationState: number;

    constructor(viewPort: ViewPort, items: INewsListItem[], navigationStartUri: string, navigationForwardUri: string, navigationBackUri: string, navigationState: number) {
        this.ViewPort = viewPort;
        this.Items = items;
        this.NavigationStartUri = navigationStartUri;
        this.NavigationForwardUri = navigationForwardUri;
        this.NavigationBackUri = navigationBackUri;
        this.NavigationState = navigationState;
    }
}