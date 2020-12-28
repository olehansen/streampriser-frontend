import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import { SearchBoxStore } from "../SearchBoxStore";
import { SearchBoxDispatcher } from "../SearchBoxDispatcher";
import './SearchBox.scss';

interface ISearchBoxProps {
    // viewPort: ViewPort,
    // suggestions: string[],
    // onSearchClicked: () => void,
    // onInputChanged: (input: string) => void,
    // focusOnInput: boolean,
    // input: string,
    // onSuggestionItemClicked: (input: string) => void,
    // focusOnSuggestionAt: number,
    // onKeyUpEvent: (event: React.KeyboardEvent, HTMLInputElement: HTMLInputElement) => void,
    // searchResult: ISearchContent[],
    store: SearchBoxStore,
    dispatcher: SearchBoxDispatcher
}

interface ISearchBoxState {

}

export class SearchBox extends React.Component<ISearchBoxProps, ISearchBoxState> {

    private rootDivElement: HTMLDivElement;
    private searchInputElement: HTMLInputElement;

    constructor(props: ISearchBoxProps) {
        super(props);

        this.onKeyUpEvent = this.onKeyUpEvent.bind(this);
    }

    onKeyUpEvent(event: any) {

        if (event.keyCode == 38) { // arrow up
            const lastPosition = this.searchInputElement.value.length;
            this.searchInputElement.setSelectionRange(lastPosition, lastPosition);
        }

        event.preventDefault();
        event.stopPropagation();
        // this.props.dispatcher.handleKeyUpEvent(event, this.searchInputElement);
    }

    // onClick(event: React.MouseEvent) {
    //     event.stopPropagation();
    // }

    componentDidMount() {
        if (this.props.store.focusInput) {
            this.searchInputElement.focus();
        }
    }

    componentDidUpdate() {
        if (this.props.store.focusInput) {
            this.searchInputElement.focus();
        }
    }

    render() {

        const { dispatcher, store } = this.props;
        const { viewPort, suggestions, input, selectedSuggestedIndex } = store;

        var searchboxclassNames = classNames({
            "streamhubjs-searcher-searchbox": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        // var suggestionsClassNames = classNames({
        //     "suggestions": true,
        //     "hide": suggestions.length == 0
        // });

        var crossIconConcontainerClassNames = classNames({
            "hide": input.length == 0,
            "crossiconconcontainer": true
        });

        /*<div className={crossIconConcontainerClassNames} title="Ryd" onClick={(e) => { dispatcher.clearFocus(); }} >
                        <div className="crossicon"></div>
                    </div>*/

        return (
            <div className={searchboxclassNames} ref={(ref) => { this.rootDivElement = ref; }} onClick={(e) => { e.stopPropagation(); }} >
                <div className="bar">
                    <div className="searchinput" style={{ fontSize: store.inputFontSize }} >
                        <input
                            type="text"
                            value={input}
                            onKeyUp={(e) => { this.onKeyUpEvent(e); }}
                            ref={(ref) => { this.searchInputElement = ref; }}
                            onChange={(e) => { dispatcher.setInput((e.target as HTMLInputElement).value); }}
                            placeholder={viewPort.isMobile() ? "" : "Søg film, skuespiller, instruktør, lister"} />
                    </div>
                    <div className="searchiconcontainer" title="Søg" onClick={(e) => { dispatcher.startSearch(); }} >
                        <div className="searchicon"></div>
                    </div>
                </div>
            </div>
        );
    }
}