import { MovieDiscoverStore } from "./MovieDiscoverStore"
import { MovieDiscoverMapper } from "./MovieDiscoverMapper";
import { Selectable, Filter } from "./Models/Filter";
import { SortBy } from "./Models/SortBy";

export class MovieDiscoverSession {

    private sessionStorageStoreKey: string = "moviediscoverstore";
    private appId: string;

    private createSessionKey() {
        return this.sessionStorageStoreKey + "_" + this.appId;
    }

    private isSessionStorageSupported(): boolean {
        try {
            var testkey = "test", storage = window.sessionStorage;
            storage.setItem(testkey, "1");
            storage.removeItem(testkey);
            return true;
        } catch (error) {
            return false;
        }
    }

    private save(key: string, data: string) {
        if (this.isSessionStorageSupported()) {
            window.sessionStorage.setItem(key, data);
        }
    }

    private get(key: string): string {
        if (this.isSessionStorageSupported()) {
            return window.sessionStorage.getItem(key);
        }
        return "";
    }

    public constructor(appId: string) {
        this.appId = appId;
    }

    public SaveStore(movieDiscoverStore: MovieDiscoverStore) {
        // window.location.hash = '#'+ window.btoa(JSON.stringify(store.ToIMovieDiscoverStore())); // + btoa(JSON.stringify(values));
        this.save(this.createSessionKey(), JSON.stringify(movieDiscoverStore.ToIMovieDiscoverStore()));
    }

    public GetStore(filters: Filter[], orderByOptions: SortBy[]): MovieDiscoverStore {
        // const json : string = window.location.hash ? window.atob(window.location.hash.substring(1)) : null; 
        //  sessionStorage.getItem(this._sessionStorageStoreKey) as string;
        var json = this.get(this.createSessionKey());
        if (json == null || json.length == 0) {
            return;
        }
        return MovieDiscoverMapper.ToMovieDiscoverStoreFromJSON(json, filters, orderByOptions)
    }
}