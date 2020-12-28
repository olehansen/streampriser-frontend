import * as React from 'react';
import * as classNames from 'classnames';
import TopMenuStore from "./TopMenuStore";
import TopMenuDispatcher from "./TopMenuDispatcher";
import "./TopMenuSearch.scss";

export interface ITopMenuSearchProps {
    store: TopMenuStore,
    dispatcher: TopMenuDispatcher
}

export interface ITopMenuSearchState {

}

export default class TopMenuSearch extends React.Component<ITopMenuSearchProps,ITopMenuSearchState>  {

    topmenuSearchInput : HTMLInputElement;

    constructor(props: ITopMenuSearchProps) {
        super(props);
        // this.closeSearch = this.closeSearch.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    createSearchLinkElements(links: any[]) {
        let linkElements : any[] = [];
        if(links.length == 0) {
            return linkElements;
        }
        links.forEach(function (link) {
            linkElements.push(<a key={link.id} href={link.url} ><div className="searchlink" >{link.name}</div></a>);
        });
        return linkElements;
    }

    // closeSearch() {
    //     this.props.dispatcher.closeSearchAction();
    // }

    componentDidUpdate() {
        if (this.props.store.searchIsOpen) {
            
            // var topmenuSearchInput : any = this.refs["topmenuSearchInput"];
            // topmenuSearchInput.focus();

            this.topmenuSearchInput.focus();
        }
    }

    doSearch(e: any) {
        this.props.dispatcher.doSearchAction(e.target.value);
    }

    // inputOnBlur() {
    //     this.props.dispatcher.InputBlured();
    // }

    // inputOnfocus() {
    //     if(!this.props.store.isInputFocused) {
    //         this.props.dispatcher.InputFocused();
    //     }
    // }

    render() {

        var {viewPort, searchIsOpen, searchInput, searchResultItem, isSearching} = this.props.store;

        const searchElements = this.createSearchLinkElements(searchResultItem);
        const searchMaxHeight = viewPort.height - 61 - 70 - (viewPort.height*0.2) + "px"; 
        const searchUri = "/soeg/" + searchInput;

        var searchClassNames = classNames({
            "streamhubjs-topmenusearch" : true,
            "hide": !searchIsOpen
        });

        var searchResultClassNames = classNames({
            "result": true,
            "hide": searchInput.length == 0 && searchIsOpen && !isSearching
        });

        // const padding = !viewPort.isMobile() ? (viewPort.width * 0.1) + "px" : "0px";
        // onBlur={this.inputOnBlur.bind(this)} onFocus={this.inputOnfocus.bind(this)} 
        // style={{ paddingLeft: padding, paddingRight: padding }}
        // style={{ paddingLeft: padding, paddingRight: padding }}

        // <div onClick={this.closeSearch}>
        //         <div className="topmenu-close">x</div>
        //     </div>

        return <div className={searchClassNames}>
                <div className="bar">
                    <div className="icon">
                        <div className="searchicon"></div>
                    </div>
                    <div className="input">
                        <input type="text" value={searchInput} ref={(ref) => {this.topmenuSearchInput = ref}} onChange={this.doSearch} placeholder="Hvad søger du?" />
                    </div>
                </div>
                <div className={searchResultClassNames}>
                    <div className={isSearching ? "searching" : "searching hide"}>Søger...</div>
                    <div className={searchElements.length > 0 && !isSearching ? "" : "hide"}>
                        <div style={{ "maxHeight": searchMaxHeight}} className="links">
                            {searchElements}
                        </div>
                        <div className="more"><a href={searchUri}>Vis flere</a></div>
                    </div>
                    <div className={searchElements.length == 0 && !isSearching ? "noresult" : "noresult hide"}>Der blev desværre ikke fundet noget på din søgning af "{searchInput}", prøv evt. noget andet :-)</div>                    
                </div>
            </div>
    }
}