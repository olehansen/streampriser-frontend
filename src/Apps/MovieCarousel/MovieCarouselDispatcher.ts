import { IMovieCarouselDispatcher } from './Components/MovieCarousel';
import { Movie } from "../../Models/Movie";
import { ViewPort } from "../../ViewPort";
import { IMovieCarouselStore } from './IMovieCarouselStore';

export class MovieCarouselDispatcher implements IMovieCarouselDispatcher {

        private store: IMovieCarouselStore;
        public StoreUpdated: () => void;

        private fireStoreUpdated() {
                if (this.StoreUpdated) {
                        this.StoreUpdated();
                }
        }

        public GetStore(): IMovieCarouselStore {
                return this.store;
        }

        public SetStore(store: IMovieCarouselStore) {
                this.store = store;
        }

        ScrollPositionUpdated(newscrollPositionX: number) {
                this.store.scrollXPosition = newscrollPositionX;
                this.fireStoreUpdated();
        }

        MovieListItemMounted(movie: Movie, movieListItemDomElement: HTMLElement): void {

        }
}