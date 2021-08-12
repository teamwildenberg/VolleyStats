import { Action } from "./action";
import { ScoreBase } from "./score-base";


export class Point extends ScoreBase{
    timestamp: number;
    actions: Action[] = [];

    constructor(){
        super('point');
        this.timestamp = Date.now() - new Date().getTimezoneOffset() * 60 * 1000;
    }
}