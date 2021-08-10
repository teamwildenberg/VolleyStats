import { ScoringBase } from "./scoring-base";

export class Team extends ScoringBase {
  name: string
    
    constructor(key:string, name:string) {
      super(key)
      this.name = name;

	}
	
}