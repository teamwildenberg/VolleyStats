export class ScoringBase{
    key: string;
    subScores: ScoringBase[] = [];
    
    constructor(key:string){
        this.key = key;
    }
}