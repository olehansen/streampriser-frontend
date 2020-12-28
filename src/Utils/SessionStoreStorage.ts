
// export interface ISessionStoreStorage {
//     SaveStore(key: string, store: any): void;
//     GetStore(key: string): any;
// }

export class SessionStoreStorage {

    private sessionStorageStoreKey: string = "streamhubjs";
    private appId: string;

    public constructor(appId: string) {
        this.appId = appId;
    }

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

    public SaveStore(store: any): void {
        // window.location.hash = '#'+ window.btoa(JSON.stringify(store.ToIMovieDiscoverStore())); // + btoa(JSON.stringify(values));
        this.save(this.createSessionKey(), JSON.stringify(store));
    }

    public GetStore(): any {
        // const json : string = window.location.hash ? window.atob(window.location.hash.substring(1)) : null; 
        //  sessionStorage.getItem(this._sessionStorageStoreKey) as string;
        var json = this.get(this.createSessionKey());
        if (json == null || json.length == 0) {
            return;
        }
        return JSON.parse(json);
    }
}