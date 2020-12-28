import * as React from 'react';
import * as classNames from 'classnames';
import { INewsListItem } from "../INewsListItem";
import { ListItem } from "./ListItem";
import { ViewPort } from "../../../ViewPort";
import "./List.scss";
import { PaginationButton } from "./PaginationButton";

interface IListProps {
    items: INewsListItem[],
    viewPort: ViewPort,
    maxWidth: number,
    navigationStartUri: string,
    navigationForwardUri: string,
    navigationBackUri: string,
    navigationState: number
}

interface IListState {

}

export default class List extends React.Component<IListProps, IListState> {

    constructor(props: IListProps) {
        super(props);
    }

    render() {

        const { items, viewPort, navigationStartUri, navigationForwardUri, navigationBackUri, navigationState } = this.props;

        var listClassName = classNames({
            "newslist-list": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        var listItems: JSX.Element = null;

        if (items.length == 0) {
            listItems = <div className={listClassName}>
                <div className="noresult">Der blev desværre ikke fundet nogen nyt på denne side. Prøv en af de andre.</div>
            </div>
        } else {
            var rowCounter = 0;

            listItems = <div>{items.map(function (item) {
                rowCounter = rowCounter + 1;
                return <div key={rowCounter} className="i" ><ListItem viewPort={viewPort} item={item} /></div>;
            })}</div>;
        }

        // console.log(this.props.maxWidth);

        /*const pagingButtons: JSX.Element[] = [];
        for (var i = pageStart; i <= pageEnd; i++) {
            const changePage = (function (j) { // a closure is created
                return function () {
                    dispatcher.newPage(j);
                }
            }(i));
            pagingButtons.push(<button key={i} className={store.currentPage == i ? "current" : ""} onClick={(e) => {
                e.preventDefault();
                changePage();
            }}  >{i}</button>)
        }*/

        let pagingElements: JSX.Element;
        pagingElements = <PaginationButton state={navigationState} nextUri={navigationBackUri} previousUri={navigationForwardUri} startUri={navigationStartUri} />;

        return (<div className={listClassName}>
            {listItems}
            <div className="paging-outer">
                {pagingElements}
            </div>
        </div >);
    }
}