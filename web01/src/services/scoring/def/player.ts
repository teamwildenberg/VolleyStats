import { ScoringBase } from "./scoring-base";
import { Team } from "./team";

export class Player extends ScoringBase{
    team: Team;
    number: number
    name: string

    constructor(key: string, team:Team, number:number, name: string) {
		  super(key);
      this.team = team;
      this.number = number;
      this.name = name;
	}
	
}