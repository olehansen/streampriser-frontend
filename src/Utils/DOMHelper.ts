import {ViewPort, ScreenSizeMode} from "../ViewPort";

export class DOMHelper {
    
    static getViewPort() : ViewPort {

        var viewPortWidth : number = 0;
        var viewPortHeight: number = 0;

        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        if (typeof window.innerWidth != 'undefined') {
            viewPortWidth = window.innerWidth,
                viewPortHeight = window.innerHeight
        }
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
            viewPortWidth = document.documentElement.clientWidth,
                viewPortHeight = document.documentElement.clientHeight
        }
        // older versions of IE
        else {
            viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
                viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
        }

        let mode : ScreenSizeMode = ScreenSizeMode.desktop; // default 

        if (viewPortWidth <= 800) {
            mode = ScreenSizeMode.mobile;
        } else if (viewPortWidth > 800 && viewPortWidth < 1000) {
            mode = ScreenSizeMode.tablet;
        } else {
            mode = ScreenSizeMode.desktop;
        }

        return new ViewPort(viewPortWidth,viewPortHeight, mode);
    }  
}