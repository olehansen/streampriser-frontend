import * as React from 'react';
import * as classNames from 'classnames';
import { ViewPort } from "../../ViewPort";
import { IMovie } from "../../Models/Movie";
import './SliderlItem.scss';

interface ISliderlItemProps {
    movie: IMovie,
    viewPort: ViewPort
}

interface ISliderlItemItemState {

}

export class SliderlItem extends React.Component<ISliderlItemProps, ISliderlItemItemState> {

    rootDivElement: HTMLDivElement;

    constructor(props: ISliderlItemProps) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {

    }

    render() {

        const {movie, viewPort} = this.props;

        const movieImgUrl = movie.imageUrl + "?width=188";

        var posterStyle: any = {
            background: 'url(' + movieImgUrl + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            width: "188px",
            height: "275px",
            marginLeft: "1px",
            marginRight: "1px"
        };

        var genreElements: JSX.Element[] = [];
        for (var i = 0; i < movie.genres.length; i++) {
            var genre = movie.genres[i];
            if (i > 0) {
                genreElements.push(<div key={i}>/</div>);
            }
            genreElements.push(<div key={genre.id} className="genre">{genre.name}</div>);
        }

        var sliderlItemclassNames = classNames({
            "SliderlItem": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile()
        });

        var style: any = {};

        style.width = "190px";
        style.height = "360px";

        var contentTitleStyle: any = {};
        
        if (movie.title.length > 0 && movie.title.length < 20) {
            contentTitleStyle.fontSize = "0.7rem";
        } else if (movie.title.length > 20 && movie.title.length < 40) {
            contentTitleStyle.fontSize = "0.6rem";
        } else if (movie.title.length >= 40) {
            contentTitleStyle.fontSize = "0.5rem";
        } else {
            contentTitleStyle.fontSize = "1rem";
        }

        var movieYearclassNames = classNames({
            "year": true,
            "hide": movie.year <= 0
        });

        return <div className={sliderlItemclassNames} style={style} ref={(ref) => { this.rootDivElement = ref; }}>
            <a href={movie.url}>
                <div className="inner">
                    <div className="top" style={contentTitleStyle} >
                        <div className="title" >
                            <span className="titleinner" >{movie.title}</span>
                            <span className={movieYearclassNames} >({movie.year}) </span>
                        </div>
                    </div>
                    <div style={posterStyle}>
                    </div>
                    <div className="genres">
                        {genreElements}
                    </div>
                </div>
            </a>
        </div >;
    }
}