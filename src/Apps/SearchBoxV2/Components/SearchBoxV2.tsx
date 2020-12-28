import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import { SearchBoxV2Store } from "../SearchBoxV2Store";
import { SearchBoxV2Dispatcher } from "../SearchBoxV2Dispatcher";
import { Dropdown } from "../../../Components/Dropdown";
import "./SearchBoxV2.scss";

interface ISearchBoxProps {
    store: SearchBoxV2Store,
    dispatcher: SearchBoxV2Dispatcher
}

interface ISearchBoxState {

}

class IDropdownListItem {

    id: string;
    name: string;
}

export class SearchBoxV2 extends React.Component<ISearchBoxProps, ISearchBoxState> {

    private rootDivElement: HTMLDivElement;
    private searchInputElement: HTMLInputElement;

    constructor(props: ISearchBoxProps) {
        super(props);

        // this.onKeyUpEvent = this.onKeyUpEvent.bind(this);
    }

    // onKeyUpEvent(event: React.KeyboardEvent) {
    //     if (event.keyCode == 38) { // arrow up
    //         const lastPosition = this.searchInputElement.value.length;
    //         this.searchInputElement.setSelectionRange(lastPosition, lastPosition);
    //     }
    //     event.preventDefault();
    //     event.stopPropagation();
    //     this.props.dispatcher.onKeyUpEvent(event, this.searchInputElement);
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
        const { viewPort, query } = store;

        var searchboxclassNames = classNames({
            "streamhubjs-searcher-searchboxv2": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        var crossIconConcontainerClassNames = classNames({
            "hide": query.length == 0,
            "crossiconconcontainer": true
        });

        var forceClose = false;

        var searchTypes = [
            {
                id: "1",
                name: "Alt"
            } as IDropdownListItem,
            {
                id: "2",
                name: "Skuespillere"
            } as IDropdownListItem
        ];

        // onKeyUp={(e) => { this.onKeyUpEvent(e); }}

        return (
            <div className={searchboxclassNames} ref={(ref) => { this.rootDivElement = ref; }} onClick={(e) => { e.stopPropagation(); }} >
                <div className="bar">
                    <div className="searchinput" style={{ fontSize: store.inputFontSize }} >
                        <input
                            type="text"
                            value={query}
                            ref={(ref) => { this.searchInputElement = ref; }}
                            onChange={(e) => { dispatcher.onInputChange((e.target as HTMLInputElement).value); }}
                            onBlur={(e)=> { dispatcher.onInputBlur(); }}
                            placeholder={viewPort.isMobile() ? "" : "Søg film, skuespiller, instruktør, lister"} />
                    </div>
                    <div style={{ width: "150px" }}>
                        <Dropdown options={searchTypes} selectedId="1" selectedChanged={(selected: IDropdownListItem) => console.log(selected)} forceClose={forceClose} />
                    </div>
                    {/*<div className="searchiconcontainer" title="Søg" onClick={(e) => { dispatcher.startSearch(); }} >
                        <div className="searchicon"></div>
                    </div>*/}
                </div>
            </div>
        );
    }
}