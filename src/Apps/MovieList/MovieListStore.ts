import {IMovie} from "../../Models/Movie"
import {ViewPort} from "../../ViewPort"

export class MovieListStore {
    
    public Movies : IMovie[];
    public ViewPort: ViewPort;

    constructor(viewPort: ViewPort, movies: IMovie[]) {
        this.ViewPort = viewPort;
        this.Movies = movies;
    }
}