import { Move } from "./move";
import { ScoringBase } from "./scoring-base";

export class Level extends ScoringBase{
    action: Move
    name: string
    value: number

    constructor(key: string, action:Move, name:string, value: number) {
		  super(key);
      this.action = action;
      this.name = name;
      this.value = value;

	}
	
}