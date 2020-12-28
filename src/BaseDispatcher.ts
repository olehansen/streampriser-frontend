export class BaseDispatcher<T> {

    public storeUpdated: (store: T) => void;
    public store: T;

    constructor(store: T) {
        this.store = store;
    }

    protected fireStoreUpdated() {
        if (this.storeUpdated) {
            this.storeUpdated(this.store);
        }
    }
}
