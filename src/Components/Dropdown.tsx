import * as  React from 'react';
import * as classNames from 'classnames';
import { Arrow } from "./Arrow";

import './Dropdown.scss'

export interface IDropdownListItem {
    id: string;
    name: string;
}

interface IDropdownProps {
    options: IDropdownListItem[],
    selectedId: string,
    selectedChanged: (selectedItem: IDropdownListItem) => void,
    forceClose: boolean
}

interface IDropdownState {
    listVisible: boolean
}

export class Dropdown extends React.Component<IDropdownProps, IDropdownState> {

    isClicked: boolean;

    constructor(props: IDropdownProps) {
        super(props);
        this.isClicked = false;
        this.select = this.select.bind(this);
        this.toogleShowHide = this.toogleShowHide.bind(this);
        this.closeIfOpen = this.closeIfOpen.bind(this);
        this.state = { listVisible: false };
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        window.addEventListener('click', this.closeIfOpen, false);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.closeIfOpen, false);
    }

    toogleShowHide() {
        this.setState({ listVisible: !this.state.listVisible });
    }

    closeIfOpen() {
        if (this.state.listVisible && !this.isClicked) { // only close if open and is not just clicked
            this.setState({ listVisible: false });
        }
        if (this.isClicked) {
            this.isClicked = false;
        }
    }

    hide() {
        this.setState({ listVisible: false });
    }

    select(item: IDropdownListItem) {
        this.toogleShowHide();
        this.props.selectedChanged(item);
    }

    onClickOnOptions(e: any) {
        e.stopPropagation();
    }

    onClick() {
        this.isClicked = true;
    }

    shouldComponentUpdate(nextProps: IDropdownProps, State: IDropdownState): boolean {
        return true;
    }

    componentWillUpdate(nextProps: IDropdownProps, nextState: IDropdownState) {

    }

    componentWillReceiveProps(nextProps: IDropdownProps) {
        if (nextProps.forceClose) {
            this.setState({
                listVisible: false
            } as IDropdownState);
        }
    }

    render() {
        const {options, selectedId, forceClose } = this.props;
        const {listVisible } = this.state;

        let selectedOption: IDropdownListItem;

        for (var i = 0; i < options.length; i++) {
            var element = options[i];
            if (element.id == selectedId) {
                selectedOption = element;
                break;
            }
        }

        var me = this;

        var optionElements = options.map(function (o) {
            const optionElementsClassNames = classNames({
                "item": true,
                "selected": selectedId == o.id
            });
            return <div key={o.id} className={optionElementsClassNames} onClick={me.select.bind(me, o) } >{o.name}</div>
        });

        const optionsClassNames = classNames({
            "options": true,
            "hide": !listVisible
        });

        return <div className="streamhubjs-dropdown" onClick={this.onClick}>
            <div className="title" onClick={this.toogleShowHide} ><div className="name">{selectedOption.name}</div><div className="icon"><Arrow direction={ listVisible ? "up" : "down" } size="small" /></div></div>
            <div className={optionsClassNames} onClick={this.onClickOnOptions} >{ optionElements}</div>
        </div>;
    }
}