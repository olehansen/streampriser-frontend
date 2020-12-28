export enum ScreenSizeMode {
    mobile = 0,
    tablet = 1,
    desktop = 2
}

export class ViewPort {
    constructor(public width: number, public height: number, public mode : ScreenSizeMode) {

    }

    isMobile() {
        return this.mode == ScreenSizeMode.mobile;
    }

    test() {
        
    }
}