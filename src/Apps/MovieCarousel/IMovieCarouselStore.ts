import { IMovie } from "../../Models/Movie"
import { ViewPort } from "../../ViewPort"

export interface IMovieCarouselStore {
    scrollXPosition: number;
    Movies: IMovie[];
}