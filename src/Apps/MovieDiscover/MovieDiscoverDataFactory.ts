import {SortBy} from "./Models/SortBy";
import {INewSelectable, ISelectable, Selectable, SelectableWithImgUrl, Filter, FilterType, MultiSelectableSearchFilter, MultiSelectableListFilter, SingleValueFilter, SingleValueFilterPredefined} from "./Models/Filter";
import {StreamHubApiClient} from "../../APIs/StreamHubAPI/StreamHubApiClient";

export class MovieDiscoverDataFactory {

    genreSelectables: Selectable[];

    constructor(private client: StreamHubApiClient, genreNewSelectables: INewSelectable[]) {

        const genreSelectables : Selectable[] = []; 

        for (var i = 0; i < genreNewSelectables.length; i++) {
            var genre = genreNewSelectables[i];
            genreSelectables.push(new Selectable(genre.id, genre.name));
        }

        this.genreSelectables = genreSelectables;
    }

    CreateOrderBies(): SortBy[] {
        return [
            new SortBy("1", "Nyeste", "desc"),
            new SortBy("2", "Højeste karakter", "desc"),
            new SortBy("3", "Årstal", "desc"),
            new SortBy("4", "Pris", "asc"),
            new SortBy("5", "Alfabetisk", "asc"),
            new SortBy("6", "Populære", "desc")
        ];
    }

    createGenresFilter(): MultiSelectableListFilter {
        return new MultiSelectableListFilter("genres", "Genrer", this.genreSelectables);
    }

    createProvidersFilter(): MultiSelectableListFilter {
        const providers: SelectableWithImgUrl[] = [
            new SelectableWithImgUrl("82FB0846-87C7-4DBD-8552-7E4F9E325768", "Netflix", "/content/images/providers/netflix.png"),
            new SelectableWithImgUrl("650741FE-0548-416F-9EEC-C7FFA7096D39", "C More Play", "/content/images/providers/cmore.png"),
            new SelectableWithImgUrl("0D9CC042-3C9B-4C89-8106-2F755F8B8726", "Viaplay", "/content/images/providers/viaplay.png"),
            new SelectableWithImgUrl("ABAAD0BC-A5A7-45D9-9EA9-871679033EAF", "HBO Nordic", "/content/images/providers/hbo.png"),
            new SelectableWithImgUrl("532E8F84-A84B-42A9-81AD-148A9F2BD81A", "Plejmo", "/content/images/providers/plejmo.png"),
            new SelectableWithImgUrl("B42C959C-5129-47D9-AF4A-B74658B24A32", "Blockbuster", "/content/images/providers/blockbuster.png"),
            new SelectableWithImgUrl("059fda3a-5884-4a88-ba13-b1b4054b5308", "Itunes", "/content/images/providers/itunes.png"),
            new SelectableWithImgUrl("0B88E153-DC53-4631-A263-80EC4F4BF19A", "danskfilmskat", "/content/images/providers/danskfilmskat.png"),
            new SelectableWithImgUrl("dad18723-f387-4968-91c4-1b40eb29980c", "minbio", "/content/images/providers/min-bio-g.png")
        ];
        return new MultiSelectableListFilter("providers", "Streamingtjenester", providers);
    }

    createAcquireMethodFilter(): MultiSelectableListFilter {
        const types: Selectable[] = [
            new Selectable("1", "Lej"),
            new Selectable("2", "Abonnement"),
            new Selectable("3", "Køb")
        ];
        return new MultiSelectableListFilter("acquiremethods", "Lej/Køb/Abn.", types);
    }

    private createTagFilter(): MultiSelectableSearchFilter {
        return new MultiSelectableSearchFilter("tags", "Tags", (query: any) => {
            const searchPromise = this.client.searchTagName(query);
            return new Promise<Selectable[]>((resolve, reject) => {
                searchPromise.then((values) => {
                    resolve(values.map(x => new Selectable(x.id.toString(), x.name)));
                });
            });
        });
    }

    private createDirectorsFilter(): MultiSelectableSearchFilter {
        return new MultiSelectableSearchFilter("directors", "Instruktører", (query : any) => {
            var searchPromise = this.client.searchDirectorsName(query);
            return new Promise<Selectable[]>((resolve, reject) => {
                searchPromise.then((values) => {
                    resolve(values.map(x => new Selectable(x.id, x.name)));
                });
            });
        });
    }

    private createActorsFilter(): MultiSelectableSearchFilter {
        return new MultiSelectableSearchFilter("actors", "Skuespillere", (query) => {
            var searchPromise = this.client.searchActorName(query);
            return new Promise<Selectable[]>((resolve, reject) => {
                searchPromise.then((values) => {
                    resolve(values.map(x => new Selectable(x.id, x.name)));
                });
            });
        });
    }

    private createMaxPriceFilter() {
        const quickPicks: SingleValueFilterPredefined[] = [
            new SingleValueFilterPredefined("Max 3 kr", 3),
            new SingleValueFilterPredefined("Max 9 kr", 9),
            new SingleValueFilterPredefined("Max 49 kr", 49)
        ]
        return new SingleValueFilter("maxprice", "Max. pris (kr.)", 0, 150, quickPicks);
    }

    private createMinIMDbRantingFilter() {
        const quickPicks: SingleValueFilterPredefined[] = [
            new SingleValueFilterPredefined("Min. 8", 3),
            new SingleValueFilterPredefined("Min. 5", 9)
        ]
        return new SingleValueFilter("minimdbrating", "Min. IMDb Rating", 0, 10, quickPicks);
    }

    private createMaxYearFilter() {
        const quickPicks: SingleValueFilterPredefined[] = [
            new SingleValueFilterPredefined("1990", 1990),
            new SingleValueFilterPredefined("2000", 2000),
            new SingleValueFilterPredefined("2010", 2010)
        ]
        return new SingleValueFilter("maxyear", "Max. udgivelses år", 1950, new Date().getFullYear(), quickPicks);
    }

    private createMinYearFilter() {
        const quickPicks: SingleValueFilterPredefined[] = [
            new SingleValueFilterPredefined("1990", 1990),
            new SingleValueFilterPredefined("2000", 2000),
            new SingleValueFilterPredefined("2010", 2010)
        ]
        return new SingleValueFilter("minyear", "Min. udgivelses år", 1950, new Date().getFullYear(), quickPicks);
    }

    createSpokenLanguagesMethodFilter(): MultiSelectableListFilter {
        const languages: Selectable[] = [
            new Selectable("en", "Engelsk"),
            new Selectable("da", "Dansk"),
            new Selectable("sv", "Svensk"),
            new Selectable("no", "Norsk"),
            new Selectable("de", "Tysk")
        ];
        return new MultiSelectableListFilter("spokenlanguages", "Sprog (Beta)", languages);
    }

    CreateFilters(): Filter[] {
        return [
            this.createGenresFilter(),
            this.createActorsFilter(),
            this.createDirectorsFilter(),
            this.createTagFilter(),
            this.createMinIMDbRantingFilter(),
            this.createMaxPriceFilter(),
            this.createAcquireMethodFilter(),
            this.createMaxYearFilter(),
            this.createMinYearFilter(),
            this.createProvidersFilter(),
            this.createSpokenLanguagesMethodFilter()
        ];
    }
}