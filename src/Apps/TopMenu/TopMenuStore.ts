import {ViewPort} from "../../ViewPort";
import {ILink} from "./ILink";

export default class TopMenuStore {

    viewPort: ViewPort;
    leftMenuIsOpen: boolean;
    searchIsOpen: boolean;
    searchInput: string;
    searchResultItem: any[];
    isSearching: boolean;
    links: ILink[];
    mouseClicked: boolean;
    transparentBackground: boolean
    positionAbsolute: boolean;

    constructor(viewPort: ViewPort, links: ILink[], transparentBackgroundPositionAbsolute: boolean) {
        this.viewPort = viewPort;
        this.leftMenuIsOpen = false;
        this.searchIsOpen = false;
        this.searchInput = "";
        this.searchResultItem = [];
        this.isSearching = false;
        this.links = links;
        this.mouseClicked = false;
        this.transparentBackground = transparentBackgroundPositionAbsolute;
        this.positionAbsolute = transparentBackgroundPositionAbsolute;
    }
}