import { ScoringType } from "./scoring-type";

export class ScoringDefinition{
    key: string;
    description: string;
    parent: ScoringDefinition | undefined;
    subScores: ScoringDefinition[] = [];
    type: ScoringType;
    constructor(key:string, description: string, type: ScoringType, parent?: ScoringDefinition){
        this.key = key;
        this.description = description;
        this.type = type;
        if (parent != undefined){
            this.parent = parent;
            parent.subScores.push(this);
        }
    }

    getSubDef(key: string): ScoringDefinition| undefined{
        for(var i: number = 0; i <  this.subScores.length; i ++){
            if (this.subScores[i].key.toLocaleLowerCase() == key){
                return this.subScores[i];
            }
        }
        return undefined;
    }
}