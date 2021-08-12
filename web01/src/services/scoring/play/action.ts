import { Fragment } from "./fragment";
import { ScoreBase } from "./score-base";

export class Action extends ScoreBase{
    timestamp: number;
    fragment: Fragment;
    previous?: Action;

    constructor(frag: Fragment){
        super('action');
        this.timestamp = Date.now() - new Date().getTimezoneOffset() * 60 * 1000;
        this.fragment = frag;
    }

    static newAction(fragment: Fragment, previousAction?: Action): Action{
        var newAction = new Action(fragment);
        if (previousAction != undefined){
            newAction.previous = previousAction;
        }
        return newAction;

    }

}