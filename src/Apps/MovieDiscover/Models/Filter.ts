export enum FilterType {
    MultiSelectableSearchFilter = 1,
    MultiSelectableListFilter = 2,
    SingleValueFilter = 3
}

export enum SelectableType {
    Selectable = 1,
    SelectableWithImgUrl = 2
}

export interface INewSelectable {
    id: string;
    name: string;
}

export interface ISelectable {
    id: string;
    name: string;
    type: SelectableType;
    imgUrl: string;
}

export class Selectable implements ISelectable {
    public type: SelectableType;
    public imgUrl: string;
    constructor(public id: string, public name: string) {
        this.type = SelectableType.Selectable;
        this.imgUrl = "";
    }
}

export class SelectableWithImgUrl implements ISelectable {
    public type: SelectableType;
    constructor(public id: string, public name: string, public imgUrl: string) {
        this.type = SelectableType.SelectableWithImgUrl;
    }
}

export class SingleValueFilterPredefined {

    name: string;
    value: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}

export class IFilter {
    id: string;
    name: string;
    type: FilterType;
    selected: any;
}

export class Filter implements IFilter {

    id: string;
    name: string;
    type: FilterType;
    selected: any;

    constructor(id: string, name: string, type: FilterType) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    ToIFilter(): IFilter {
        return { id: this.id, name: this.name, type: this.type, selected: {} }
    }
}

export class SingleValueFilter extends Filter {

    Max: number;
    Min: number;
    Predefined: SingleValueFilterPredefined[];
    SelectedValue: number;

    constructor(id: string, name: string, min: number, max: number, predefined: SingleValueFilterPredefined[]) {
        super(id, name, FilterType.SingleValueFilter);
        this.Min = min;
        this.Max = max;
        this.Predefined = predefined;
        this.SelectedValue = -1;
    }

    SetSelectedValue(value: number) {
        this.SelectedValue = value;
    }

    ToIFilter(): any {
        var obj = super.ToIFilter();
        obj.selected = this.SelectedValue;
        return obj;
    }
}

export class MultiSelectableFilter extends Filter {

    SelectedSelectables: ISelectable[];

    constructor(id: string, name: string, type: FilterType) {
        super(id, name, type);
        this.SelectedSelectables = [];
    }

    AddSelectedSelectable(selectedSelectable: ISelectable) {
        if (this.SelectedSelectables.indexOf(selectedSelectable) == -1) {
            this.SelectedSelectables.push(selectedSelectable)
        }
    }

    RemoveSelectedSelectable(selectedSelectable: ISelectable) {
        let indexOf: number = -1;
        for (var i = 0; i < this.SelectedSelectables.length; i++) {
            var selected = this.SelectedSelectables[i];
            if (selected.id.toString().toUpperCase() === selectedSelectable.id.toString().toUpperCase()) {
                indexOf = i;
                break;
            }
        }
        if (indexOf != -1) {
            this.SelectedSelectables.splice(indexOf, 1);
        }
    }

    IsSelected(selectable: ISelectable): boolean {
        for (var i = 0; i < this.SelectedSelectables.length; i++) {
            var selected = this.SelectedSelectables[i];
            if (selected.id.toString().toUpperCase() === selectable.id.toString().toUpperCase()) {
                return true;
            }
        }
        return false;
    }

    ToIFilter(): any {
        var obj = super.ToIFilter();
        obj.selected = this.SelectedSelectables;
        return obj;
    }
}

export class MultiSelectableListFilter extends MultiSelectableFilter {

    Selectables: ISelectable[];

    constructor(id: string, name: string, selectables: ISelectable[]) {
        super(id, name, FilterType.MultiSelectableListFilter);
        this.Selectables = selectables;
    }
}

export class MultiSelectableSearchFilter extends MultiSelectableFilter {

    search: (query: string) => Promise<ISelectable[]>;

    constructor(id: string, name: string, search: (query: string) => Promise<ISelectable[]>) {
        super(id, name, FilterType.MultiSelectableSearchFilter);
        this.search = search;
    }
}