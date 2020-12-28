import { IMovie } from "../../Models/Movie"
import { ViewPort } from "../../ViewPort"

export interface ISliderStore {
    scrollXPosition: number;
    Items: any[];
}