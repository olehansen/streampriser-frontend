export class SortBy {

    id: string;
    name: string;
    defaultdirection: string;

    constructor(id: string, name: string, defaultdirection: string) {
        this.id = id;
        this.name = name;
        this.defaultdirection = defaultdirection;
    }
}