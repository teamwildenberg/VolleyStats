import { ScoringBase } from "./scoring-base";

export class Move extends ScoringBase {
    name: string;
    minScore: number;
    maxScore: number;
    description: string;

    constructor(key:string, name:string, description: string, minScore: number, maxScore: number) {
      super(key);
      this.name = name;
      this.description = description;
      this.minScore = minScore;
      this.maxScore = maxScore;

	}
	
}