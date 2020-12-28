import { ViewPort } from "../../ViewPort";

export class SearchBoxStore {

    public viewPort: ViewPort;
    public input = "";
    public focusInput: boolean;
    public suggestions: string[];
    public selectedSuggestedIndex: number;
    public inputChangeCounter: number;
    public inputFontSize: string;

    constructor(viewPort: ViewPort) {
        this.viewPort = viewPort;
        this.suggestions = [];
        this.inputChangeCounter = 0;
        this.focusInput = false;
        this.inputFontSize = "24px";
    }
}