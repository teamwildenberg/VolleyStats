import { ScoringBase } from "../def/scoring-base";

export interface Fragment{
    next?: Fragment ;
    previous?: Fragment;

    score: ScoringBase;
}