import { ScoringType } from "./scoring-type";

export class ScoringBase{
    key: string;
    description: string;
    parent: ScoringBase | undefined;
    subScores: ScoringBase[] = [];
    type: ScoringType;
    constructor(key:string, description: string, type: ScoringType, parent?: ScoringBase){
        this.key = key;
        this.description = description;
        this.type = type;
        if (parent != undefined){
            this.parent = parent;
            parent.subScores.push(this);
        }
    }
}