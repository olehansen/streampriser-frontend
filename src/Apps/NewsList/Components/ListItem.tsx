import * as React from 'react';
import * as classNames from 'classnames';
import { ViewPort } from "../../../ViewPort";
import { INewsListItem } from "../INewsListItem";
import "./ListItem.scss";
import { LinkButton } from "../../../Components/LinkButton"

interface IListItemProps {
    item: INewsListItem,
    viewPort: ViewPort
}

interface IListItemState {

}

export class ListItem extends React.Component<IListItemProps, IListItemState> {

    rootDivElement: HTMLDivElement;

    constructor(props: IListItemProps) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {

    }

    render() {

        const { item, viewPort } = this.props;

        // var imgStyle: any = {
        //     background: 'url(' + item.ImgUrl + ')',
        //     backgroundSize: 'cover',
        //     backgroundPosition: 'top center'
        // };

        var listItemClassNames = classNames({
            "newslist-listitem": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        var rootStyle: any = {
            width: "100%"
        }

        const text = { __html: item.Text };

        // style={imgStyle}
        return <div className={listItemClassNames} style={rootStyle} ref={(ref) => { this.rootDivElement = ref; }}>
            {/* <div style={{ height: "45px" }}>
                <img className="feedauthorlogo" src="/content/images/feed/logos/Logo-v3-text-black.png" />
            </div> */}
            <div className="img" >
                {/*<div className="top">
                    <img className="feedauthorlogo" src="/content/images/feed/logos/Logo-v3-text-white.png" />
                </div>*/}
                <img style={{ width: "100%" }} src={item.ImgUrl + "?width=741"} />
            </div>
            <div className="content">
                <div className="title" >{item.Title}</div>
                <div className="author" >
                    <span className="authorItem">Af: {item.AuthorName}</span>
                    <span className="authorItem" >Dato: {(new Date(item.PublishedAt).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" }))}</span>
                    <span className={item.AuthorSource != null ? "authorItem" : "hide"}>Kilde: {item.AuthorSource}</span>
                </div>
                <div className="text" ><pre dangerouslySetInnerHTML={text}></pre></div>
                <div className={item.AuthorReadMoreUrl != null ? "readmorecontainer" : "hide"}>
                    <LinkButton href={item.AuthorReadMoreUrl} target="_blank" >Læs mere</LinkButton>
                </div>
            </div>
        </div>;
    }
}