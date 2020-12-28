import * as React from 'react';
import * as classNames from 'classnames';

import RangeSlider from "./../../../Components/RangeSlider";
import { Arrow } from "./../../../Components/Arrow";
import {MovieDiscoverStore} from "./../MovieDiscoverStore";
import {MovieDiscoverDispatcher} from "./../MovieDiscoverDispatcher";
import {ISelectable, Selectable, SelectableWithImgUrl, SelectableType, FilterType, Filter, MultiSelectableSearchFilter, MultiSelectableListFilter, SingleValueFilter} from "./../Models/Filter";
import './MovieDiscoverFilterSelector.scss';

interface IMovieDiscoverFilterSelectorProps {
    dispatcher: MovieDiscoverDispatcher,
    store: MovieDiscoverStore,
    filter: Filter
}

interface IMovieDiscoverFilterSelectorState {
    search_value: string,
    search_selectables: Selectable[]
}

export default class MovieDiscoverFilterSelector extends React.Component<IMovieDiscoverFilterSelectorProps, IMovieDiscoverFilterSelectorState>  {

    _searchInputRef: HTMLInputElement;
    _searchChangeCounter: number;
    _singleValueFilterSelectedValue: number;

    constructor(props: IMovieDiscoverFilterSelectorProps) {
        super(props);

        this._searchChangeCounter = 0;
        this._singleValueFilterSelectedValue = 0;
        this.state = { search_value: "", search_selectables: [] };
        this.toogleOpenSelectorBox = this.toogleOpenSelectorBox.bind(this);
        this.isOpen = this.isOpen.bind(this);
        this.onClick = this.onClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onRangeSelectedChanged = this.onRangeSelectedChanged.bind(this);
    }

    toogleOpenSelectorBox() {
        if (this.isOpen()) {
            this.props.dispatcher.SetOpenSelectorAndCloseOtherOpen("");
        } else {
            this.props.dispatcher.SetOpenSelectorAndCloseOtherOpen(this.props.filter.id);
        }
    }

    removeFromSelectedFilter(filter: Filter, selectable: ISelectable) {
        this.props.dispatcher.RemoveSelectedSelectableFromMultiSelectableFilterAction(filter.id, selectable);
    }

    addToSelectedFilter(filter: Filter, selectable: ISelectable) {
        this.props.dispatcher.AddSelectedSelectableToMultiSelectableFilterAction(filter.id, selectable);
    }
  
    createCheckboxItem(filter: Filter, selectable: Selectable, isSelected: boolean) {
        let onClick: any;
        if (isSelected) {
            onClick = this.removeFromSelectedFilter.bind(this, filter, selectable);
        } else {
            onClick = this.addToSelectedFilter.bind(this, filter, selectable);
        }
        return (<div key={selectable.id} className="item" onClick={onClick}>
            <div className="cb"><input type="checkbox" onChange={onClick} checked={isSelected} /></div>
            <div>{selectable.name}</div>
        </div>);
    }

    createCheckboxItemWithImg(filter: Filter, selectable: SelectableWithImgUrl, isSelected: boolean) {
        let onClick: any;
        if (isSelected) {
            onClick = this.removeFromSelectedFilter.bind(this, filter, selectable);
        } else {
            onClick = this.addToSelectedFilter.bind(this, filter, selectable);
        }
        return (<div key={selectable.id} className="itemWithImg" onClick={onClick}>
            <div className="cb"><input type="checkbox" onChange={onClick} checked={isSelected} /></div>
            <div><img src={selectable.imgUrl} alt={selectable.name} /></div>
        </div>);
    }

    createList(filter: MultiSelectableListFilter) {
        var selectableElements: JSX.Element[] = [];
        for (var i = 0; i < filter.Selectables.length; i++) {
            var selectable = filter.Selectables[i];
            var isSelected = filter.IsSelected(selectable);
            if (selectable.type == SelectableType.Selectable) {
                selectableElements.push(this.createCheckboxItem(filter, selectable as Selectable, isSelected));
            } else if (selectable.type == SelectableType.SelectableWithImgUrl) {
                selectableElements.push(this.createCheckboxItemWithImg(filter, selectable as SelectableWithImgUrl, isSelected));
            } else {
                selectableElements.push(this.createCheckboxItem(filter, selectable, isSelected));
            }
        }
        return <div className="list">
            {selectableElements}
        </div>;
    }

    createSearch(filter: MultiSelectableSearchFilter, search_value: string, search_selectables: Selectable[]) {
        var searchSelectableElements: JSX.Element[] = [];
        for (var i = 0; i < search_selectables.length; i++) {
            var selectable = search_selectables[i];
            var isSelected = filter.IsSelected(selectable);
            searchSelectableElements.push(this.createCheckboxItem(filter, selectable, isSelected));
        }
        return (<div className="search">
            <div className="input">
                <input type="text" ref={(ref) => this._searchInputRef = ref } value={search_value} onChange={this.handleChange} />
            </div>
            <div className="result">
                {searchSelectableElements}
            </div>
        </div>);
    }

    onRangeSelectedChanged(newValue: number) {
        this._singleValueFilterSelectedValue = newValue;
    }

    setSelectedValueToSingleValueFilter() {
        this.props.dispatcher.SetSelectedValueToSingleValueFilter(this.props.filter.id, this._singleValueFilterSelectedValue);
        if (this.isOpen()) {
            this.props.dispatcher.SetOpenSelectorAndCloseOtherOpen("");
        }
    }

    // clearSelectedValueToSingleValueFilter() {
    //     this._singleValueFilterSelectedValue = -1;
    //     this.props.dispatcher.SetSelectedValueToSingleValueFilter(this.props.filter.id, this._singleValueFilterSelectedValue);
    // }

    createRange(filter: SingleValueFilter) {
        // const predefined: JSX.Element[] = filter.Predefined.map(x => { return <div key={x.name}>{x.name}</div> })
        // <div className="predefined">{predefined}</div>

        return <div className="range">
            <RangeSlider min={filter.Min} max={filter.Max} value={filter.SelectedValue} onSelectedChanged={this.onRangeSelectedChanged} />
            <div className="selectedbutton" onClick={this.setSelectedValueToSingleValueFilter.bind(this) } >Vælg</div>
        </div>;
        // <button onClick={this.clearSelectedValueToSingleValueFilter.bind(this) }>Ryd</button>
    }

    onClick() {
        this.props.dispatcher.SetLastClickedInMovieSelectorId(this.props.filter.id);
    }

    isOpen() {
        return this.props.store.openMovieSelectorId == this.props.filter.id;
    }

    handleChange(event: any) {
        if (this.props.filter.type == FilterType.MultiSelectableSearchFilter) {

            this._searchChangeCounter++;
            var filter = this.props.filter as MultiSelectableSearchFilter;
            var searchInput = event.target.value;

            setTimeout(() => {
                this._searchChangeCounter--;
                if (this._searchChangeCounter == 0) {
                    var searchPromise = filter.search(searchInput);
                    searchPromise.then(selectables => {
                        this.setState({ search_selectables: selectables } as IMovieDiscoverFilterSelectorState);
                    });
                }
            }, 500);

            this.setState({ search_value: event.target.value } as IMovieDiscoverFilterSelectorState);
        }
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        if (this.props.filter.type == FilterType.MultiSelectableSearchFilter && this.isOpen()) {
            this._searchInputRef.focus();
        }
    }

    // shouldComponentUpdate(newProps: IMovieDiscoverFilterSelectorProps) {

    //     if(newProps.store.openMovieSelectorId == newProps.filter.id) {
    //         return true;
    //     }

    //     const filter = this.props.filter; 
    //      if (filter.type == FilterType.MultiSelectableListFilter) {
    //         const oldfilter = filter as MultiSelectableListFilter;
    //         const newFilter = newProps.filter as MultiSelectableListFilter;
    //         return !(oldfilter.SelectedSelectables.length == newFilter.SelectedSelectables.length);
    //     } else if (filter.type == FilterType.MultiSelectableSearchFilter) {
    //         const oldfilter = filter as MultiSelectableSearchFilter;
    //         const newFilter = newProps.filter as MultiSelectableSearchFilter;
    //         return !(oldfilter.SelectedSelectables.length == newFilter.SelectedSelectables.length);
    //     } else if (filter.type == FilterType.SingleValueFilter) {
    //         const oldfilter = filter as SingleValueFilter;
    //         const newFilter = newProps.filter as SingleValueFilter;
    //         return !(oldfilter.SelectedValue == newFilter.SelectedValue);
    //     }
    // }

    render() {

        const {store, filter} = this.props;
        const isOpen = this.isOpen();
        const {viewPort} = store;

        let selectorBoxContent = (<div>Not found</div>);

        if (filter.type == FilterType.MultiSelectableListFilter) {
            selectorBoxContent = this.createList(filter as MultiSelectableListFilter);
        } else if (filter.type == FilterType.MultiSelectableSearchFilter) {
            const {search_value, search_selectables} = this.state;
            selectorBoxContent = this.createSearch(filter as MultiSelectableSearchFilter, search_value, search_selectables);
        } else if (filter.type == FilterType.SingleValueFilter) {
            selectorBoxContent = this.createRange(filter as SingleValueFilter);
        }

        const movieDiscoverFilterSelectorClassNames = classNames({
            "moviediscoverfilterselector": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        const nameClassNames = classNames({
            "name": true,
            "selected": isOpen
        });

        const boxClassNames = classNames({
            "box": true,
            "selected": isOpen
        });

        return (<div className={movieDiscoverFilterSelectorClassNames} onClick={this.onClick}>
            <div onClick={this.toogleOpenSelectorBox} className={nameClassNames}><div className="title">{filter.name}</div><div className="icon"><Arrow direction={ isOpen ? "up" : "down" } size="small" /></div></div>
            <div className={boxClassNames}>{selectorBoxContent}</div>
        </div>);
    }
}