import * as React from 'react';
import * as classNames from 'classnames';
import { ViewPort } from "../ViewPort";
import { IMovie } from "../Models/Movie";
import "./MovieListItem.scss"

export interface IMovieListItemDispatcher {
    MovieListItemMounted(movie: IMovie, movieListItemDomElement: HTMLElement): void;
}

interface IMovieListItemProps {
    dispatcher: IMovieListItemDispatcher,
    movie: IMovie,
    isOdd: boolean,
    viewPort: ViewPort,
    isLastItem: boolean,
    responsiveWidth?: boolean
}

interface IMovieListItemState {

}

export class MovieListItem extends React.Component<IMovieListItemProps, IMovieListItemState> {

    rootDivElement: HTMLDivElement;

    constructor(props: IMovieListItemProps) {
        super(props);
    }

    shouldComponentUpdate() {
        return true; //  this.props.isLastItem;
    }

    componentDidMount() {
        this.props.dispatcher.MovieListItemMounted(this.props.movie, this.rootDivElement);
    }

    componentDidUpdate() {
        this.props.dispatcher.MovieListItemMounted(this.props.movie, this.rootDivElement);
    }

    render() {

        // console.log("render");

        const { movie, isOdd, viewPort, responsiveWidth } = this.props;
        const movieImgUrl = movie.imageUrl + "?width=188";

        var posterStyle: any = {
            background: 'url(' + movieImgUrl + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'top center'
        };

        var genreElements: JSX.Element[] = [];
        for (var i = 0; i < movie.genres.length; i++) {
            if(i > 2) {
                continue;
            }
            var genre = movie.genres[i];
            // if (i > 0) {
            //     genreElements.push(<div key={i}>/</div>);
            // }
            genreElements.push(<div key={genre.id} className="genre">{genre.name}</div>);
        }

        var MovieListItemMobile2classNames = classNames({
            "MovieListItemMobile2": true,
            "mobile": viewPort.isMobile(),
            "tablet-desktop": !viewPort.isMobile(),
            "row-odd": isOdd,
            "row-even": !isOdd
        });

        var style: any = {};
        var contentStyle: any = {};
        var contentBottomStyle: any = {};

        var imgRadio = 1.53

        if (true) {
            // style.flex = 1;
            style.minWidth = "290px";
            style.maxWidth = "410px";
            style.minHeight = "285px";
            posterStyle.minWidth = "160px";
            posterStyle.maxWidth = "180px";
            posterStyle.height = "275px";
            // posterStyle.flexShrink = 0;
            // contentStyle.width = (viewPort.width - 10 - 160) + "px";
            contentStyle.minWidth = "140px";
            contentStyle.maxWidth = "400px";
            contentStyle.minHeight = "275px";
            contentBottomStyle.width = "100%";
            contentBottomStyle.height = "75px";
            contentBottomStyle.paddingBottom = "10px";
        } 
        // else if (viewPort.isMobile()) {
        //     style.width = "100%";
        //     style.height = "240px";
        //     posterStyle.width = "160px";
        //     posterStyle.height = "240px";
        //     contentStyle.width = (viewPort.width - 10 - 160) + "px";
        //     contentStyle.height = "240px";
        //     contentBottomStyle.width = contentStyle.width;
        //     contentBottomStyle.height = "75px";
        //     contentBottomStyle.paddingBottom = "10px";
        // } else {
        //     style.width = "380px";
        //     style.height = "285px";
        //     posterStyle.width = "180px";
        //     posterStyle.height = "275px";
        //     contentStyle.width = (380 - 10 - 180) + "px";
        //     contentStyle.height = "275px";
        //     contentBottomStyle.width = contentStyle.width;
        //     contentBottomStyle.height = "75px";
        //     contentBottomStyle.paddingBottom = "10px";
        // }

        var contentTitleStyle: any = {};

        if (movie.title.length > 20 && movie.title.length < 40) {
            contentTitleStyle.fontSize = "16px";
        } else if (movie.title.length >= 40) {
            contentTitleStyle.fontSize = "12px";
        } else {
            contentTitleStyle.fontSize = "22px";
        }

        var movieYearclassNames = classNames({
            "year": true,
            "hide": movie.year <= 0
        });

        var ratingClassNames = classNames({
            "rating": true,
            "hide": movie.imdbrating <= 0
        });

        var bestRentalPriceClassNames = classNames({
            "price": true,
            "na": movie.bestRentalPrice == -1
        });

        var bestSubscriptionPriceClassNames = classNames({
            "price": true,
            "na": movie.bestSubscriptionPrice == -1
        });

        var bestOwnPriceClassNames = classNames({
            "price": true,
            "na": movie.bestOwnPrice == -1
        });

        return <div className={MovieListItemMobile2classNames} style={style} ref={(ref) => { this.rootDivElement = ref; }}>
            <a href={movie.url}>
                <div className="top">
                    <div style={posterStyle}>
                    </div>
                    <div className="content" style={contentStyle}>
                        <div className="title" style={contentTitleStyle} >{movie.title}</div>
                        <div className={movieYearclassNames} >({movie.year}) </div>
                        <div className="genres">
                            {genreElements}
                        </div>
                        <div className={ratingClassNames}>
                            <span className="ratingbig">{movie.imdbrating}</span> <span className="ratingsmall">/10</span>
                            <div className="ratingsmall">IMDb</div>
                        </div>
                        <div className="bottom" style={contentBottomStyle}>
                            <div className={bestRentalPriceClassNames}>
                                <div className="priceleft"><div className="ico_clock" title="Lej" ></div><div className="pricetext">Lej</div></div>
                                <div className="priceright">{movie.bestRentalPrice == -1 ? "" : movie.bestRentalPrice} kr</div>
                            </div>
                            <div className={bestSubscriptionPriceClassNames}>
                                <div className="priceleft"><div className="ico_calendar" title="Abn." ></div><div className="pricetext">Abn.</div></div>
                                <div className="priceright">{movie.bestSubscriptionPrice == -1 ? "" : movie.bestSubscriptionPrice} kr</div>
                            </div>
                            <div className={bestOwnPriceClassNames}>
                                <div className="priceleft"><div className="ico_infinity" title="Køb"></div><div className="pricetext">Køb</div></div>
                                <div className="priceright">{movie.bestOwnPrice == -1 ? "" : movie.bestOwnPrice} kr</div>
                            </div>
                        </div>
                        <div className="arrow">
                        </div>
                    </div>
                </div>
            </a>
        </div >;
    }
}