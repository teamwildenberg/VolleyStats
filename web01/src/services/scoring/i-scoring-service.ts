import { Subject } from "rxjs";
import { ScoreBase } from "./play/score-base";

export interface iScoringService{
    scoringData: Subject<ScoreBase|undefined>;
    init(): void;
    registerKeyDown(): void;
    unregisterKeyDown(): void;
}

export var iScoringService: string = "iScoringService";
