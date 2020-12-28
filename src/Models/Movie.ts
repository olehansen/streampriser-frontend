export interface IGenre {
    id: string;
    name: string;
}

export class Genre implements IGenre {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export interface IMovie {
    id: string;
    title: string;
    year: number;
    genres: IGenre[];
    imageUrl: string;
    url: string;
    bestRentalPrice: number;
    bestSubscriptionPrice: number;
    bestOwnPrice: number;
    imdbrating: number;
}

export class Movie implements  IMovie {
    id: string;
    title: string;
    year: number;
    genres: IGenre[];
    imageUrl: string;
    url: string;
    bestRentalPrice: number;
    bestSubscriptionPrice: number;
    bestOwnPrice: number;
    imdbrating: number;
}