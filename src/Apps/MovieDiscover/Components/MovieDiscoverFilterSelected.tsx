import * as React from 'react';
import * as classNames from 'classnames';
import { MovieDiscoverStore } from "./../MovieDiscoverStore";
import { MovieDiscoverDispatcher } from "./../MovieDiscoverDispatcher";
import { SelectableType, Selectable, SelectableWithImgUrl, Filter, FilterType, MultiSelectableFilter, SingleValueFilter } from "./../Models/Filter";
import './MovieDiscoverFilterSelected.scss';

interface IMovieDiscoverFilterSelectedProps {
    dispatcher: MovieDiscoverDispatcher,
    store: MovieDiscoverStore
}

interface IMovieDiscoverFilterSelectedState {

}

export default class MovieDiscoverFilterSelected extends React.Component<IMovieDiscoverFilterSelectedProps, IMovieDiscoverFilterSelectedState> {

    constructor(props: IMovieDiscoverFilterSelectedProps) {
        super(props);
    }

    removeFromMultiSelectableFilter(filter: MultiSelectableFilter, selectable: Selectable) {
        this.props.dispatcher.RemoveSelectedSelectableFromMultiSelectableFilterAction(filter.id, selectable);
    }

    clearSingleValueFilter(filter: SingleValueFilter) {
        this.props.dispatcher.SetSelectedValueToSingleValueFilter(filter.id, -1);
    }

    render() {
        const {store} = this.props;
        const {viewPort, filters} = store;
        let selectedElements: any[] = [];
        var counter = 1;
        for (var i = 0; i < filters.length; i++) {
            var filterType = filters[i].type;
            if (filterType == FilterType.MultiSelectableListFilter || filterType == FilterType.MultiSelectableSearchFilter) {
                const filter = filters[i] as MultiSelectableFilter;
                for (var j = 0; j < filter.SelectedSelectables.length; j++) {
                    const selectedSelectable = filter.SelectedSelectables[j];
                    const onclick = this.removeFromMultiSelectableFilter.bind(this, filter, selectedSelectable);
                    const valueClassNames = classNames({
                        "value": true,
                        "mobile": viewPort.isMobile(),
                        "tablet-desktop": !viewPort.isMobile()
                    });
                    if (selectedSelectable.type == SelectableType.SelectableWithImgUrl) {
                        const selectedSelectableWithImgUrl = selectedSelectable as SelectableWithImgUrl
                        selectedElements.push(<div className={valueClassNames} key={counter} title={filter.name} onClick={onclick}>
                            <div className="titleImg" ><img src={selectedSelectableWithImgUrl.imgUrl} alt={selectedSelectable.name} /></div>
                            <div className="icon" >X</div>
                        </div>);
                    } else {
                        selectedElements.push(<div className={valueClassNames} key={counter} title={filter.name} onClick={onclick}>
                            <div className="title" >{selectedSelectable.name}</div>
                            <div className="icon" >X</div>
                        </div>);
                    }
                    counter++;
                }
            } else if (filterType == FilterType.SingleValueFilter) {
                const filter = filters[i] as SingleValueFilter;
                if (filter.SelectedValue != -1) {
                    let onclick = this.clearSingleValueFilter.bind(this, filter);
                    let valueClassNames = classNames({
                        "value": true,
                        "mobile": viewPort.isMobile(),
                        "tablet-desktop": !viewPort.isMobile()
                    });
                    selectedElements.push(<div className={valueClassNames} key={counter} title={filter.name} onClick={onclick}>
                        <div className="title" >{filter.name}: {filter.SelectedValue}</div>
                        <div className="icon" >X</div>
                    </div>);
                    counter++;
                }
            }
        }

        var movieDiscoverFilterSelectedClassNames = classNames({
            "moviediscoverfilterselected": true,
            "tablet-desktop": !viewPort.isMobile()
        });

        var itemsClassNames = classNames({
            "items": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        return (<div className={movieDiscoverFilterSelectedClassNames} >
            <div className={itemsClassNames} >
                {selectedElements}
            </div>
        </div>);
    }
}