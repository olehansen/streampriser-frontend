import {IMovieListDispatcher } from '../../Components/MovieList';
import {Movie} from "../../Models/Movie";
import { ViewPort } from "../../ViewPort";

export class MovieListDispatcher implements IMovieListDispatcher {
        
        MovieListItemMounted(movie: Movie, movieListItemDomElement: HTMLElement) : void {

        }

        UpdateViewPort(newViewPort : ViewPort) {

        }
}