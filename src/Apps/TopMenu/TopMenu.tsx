import * as React from 'react';
import * as classNames from 'classnames';
import TopMenuStore from "./TopMenuStore";
import TopMenuDispatcher from "./TopMenuDispatcher";
import { ILink } from "./ILink";
import { ViewPort } from "../../ViewPort";
import "./TopMenu.scss";

export interface ITopMenuProps {
    store: TopMenuStore,
    dispatcher: TopMenuDispatcher
}

export interface ITopMenuState {

}

export default class TopMenu extends React.Component<ITopMenuProps, ITopMenuState> {

    topMenuDivElement: HTMLDivElement;

    constructor(props: ITopMenuProps) {
        super(props);

        this.toogleLeftMenu = this.toogleLeftMenu.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    toogleLeftMenu() {
        this.props.dispatcher.toogleLeftMenuAction();
    }

    openSearch() {
        this.props.dispatcher.openSearchAction();
    }

    closeSearch() {
        this.props.dispatcher.closeSearchAction();
    }

    onClick() {
        this.props.dispatcher.mouseClicked();
    }

    createLinkElements(links: ILink[], viewPort: ViewPort, includeAll: boolean) {
        let linkElements: JSX.Element[] = [];
        let counter = 0;
        links.forEach(function (link) {
            var linkClassNames = classNames({
                "link": true,
                "active": link.active
            });
            let add = true;
            if (viewPort.width < 800 && counter > 2) {
                add = false;
            }
            if (add || includeAll) {
                linkElements.push(<a href={link.url} key={link.id}><div className={linkClassNames}>{link.name}</div></a>);
            }
            counter++;
        });
        return linkElements;
    }

    render() {

        const { store, dispatcher } = this.props;
        const { links, viewPort, leftMenuIsOpen, searchIsOpen, transparentBackground, positionAbsolute } = store;

        const linkElements = this.createLinkElements(links, viewPort, viewPort.isMobile());

        const showTransparentBackground = transparentBackground && !searchIsOpen && !leftMenuIsOpen;

        const topMenuClassNames = classNames({
            "topmenu": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile(),
            "background1": showTransparentBackground,
            "background2": !showTransparentBackground,
            "positionrelative": !positionAbsolute,
            "positionabsolute": positionAbsolute
        });

        const leftMenuClassNames = classNames({
            "streamhubjs-topmenuleftmenu": true,
            "hide": !leftMenuIsOpen
        });

        const searchClassNames = classNames({
            "streamhubjs-topmenusearchcontainer": true,
            "hide": !searchIsOpen
        });

        var topmenuSearchStyle: any = {};

        // https://gist.github.com/VinnyFonseca/53d6dabbcc10b744b19b

        const padding = !viewPort.isMobile() ? (viewPort.width * 0.1) + "px" : "0px";

        // { "height": viewPort.height + "px" }
        // topmenuStyle.paddingLeft = padding;
        // topmenuStyle.paddingRight = padding;

        /*<div className={searchIsOpen ? "hide" : "searchbtn"} onClick={this.openSearch.bind(this)}>
                    <div className="searchicon"></div>
                </div>*/
        // <div className={searchIsOpen ? "searchbtnclose" : "hide"} onClick={this.closeSearch.bind(this)}>X</div>


        /*<div className={searchClassNames}>
            <TopMenuSearch store={store} dispatcher={dispatcher} />
        </div>*/
                // style={{ "background": "url(/content/images/Logo-v3-text-white.png)", "backgroundSize": "contain", "backgroundRepeat": "no-repeat", "backgroundPosition": "center" }} title="StreamHub">
        
        return (<div onClick={this.onClick} className={topMenuClassNames} style={{ paddingLeft: padding, paddingRight: padding }} ref={(ref) => { this.topMenuDivElement = ref; }} >
            <div className="bar">
                <div className="btn" onClick={this.toogleLeftMenu}>
                    <div className="line"></div>
                    <div className="line line2"></div>
                    <div className="line line2"></div>
                </div>
                <div className="logo" onClick={() => { window.location.href = "/" }} title="stream priser">
                    <span className="n">STREAM</span><span className="b">PRISER</span>
                </div>
                <div className="links">
                    {linkElements}
                </div>
                <div className="searchbtn">
                    <a href="/soeg" >
                        <div className="searchicon"></div>
                    </a>
                </div>
            </div>
            <div className={leftMenuClassNames} style={{ "height": (viewPort.height - 60) + "px" }}>
                <div className="links">
                    {linkElements}
                </div>
            </div>
        </div>);
    }
}