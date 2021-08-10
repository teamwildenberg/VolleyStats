import { ScoringBase } from "../def/scoring-base";
import { Team } from "../def/team";

export class Match extends ScoringBase{
    teams: Team[]=[]; 
    
    constructor(){
        super("");
    }
}