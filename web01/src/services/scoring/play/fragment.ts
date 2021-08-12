import { ScoringDefinition } from "../def/scoring-definition";
import { ScoreBase } from "./score-base";

export class Fragment extends ScoreBase{
    timestamp: number;
    previous?: Fragment;
    title: string = '';
    score: ScoringDefinition;

    constructor(def: ScoringDefinition){
        super('fragment');
        this.timestamp = Date.now() - new Date().getTimezoneOffset() * 60 * 1000;
        this.previous = undefined;
        this.score = def;

    }

    isCompleted(): boolean{
        return (this.score.subScores.length == 0)
    }

    static newFragment(def: ScoringDefinition, previousFragment?: Fragment): Fragment{
        var newFrag = new Fragment(def);
        if (previousFragment != undefined){
            newFrag.previous = previousFragment;
            newFrag.title = newFrag.previous.title + ' ' + newFrag.score.description;
        }
        return newFrag;

    }
}

