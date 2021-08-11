import { iScoringService } from "./i-scoring-service";
import { ScoringBase } from "./def/scoring-base";
import { ScoringType } from "./def/scoring-type";
import { Fragment } from "./play/fragment";


export class ScoringService implements iScoringService {
    match: ScoringBase = new ScoringBase('', 'A match to score',  ScoringType.match, undefined);
    fragment: Fragment | undefined;

    constructor(){
        this.init()
    }

    init() {
        var moves : ScoringBase[] = [];
        var teamA =new ScoringBase('A', 'Team A', ScoringType.team, this.match);
        var teamB = new ScoringBase('B', 'Team B', ScoringType.team, this.match);
        var p1 = new ScoringBase("1", "P1", ScoringType.player, teamA);
        p1.subScores = moves;
        var p2 = new ScoringBase("2", "p2", ScoringType.player, teamA);
        p2.subScores = moves;
        var p3 = new ScoringBase("1", "p3", ScoringType.player, teamB);
        p3.subScores = moves;
        var p4 = new ScoringBase("2", "p4", ScoringType.player, teamB);
        p4.subScores = moves;

        var actionAServe = new ScoringBase('S', 'Serve', ScoringType.action, undefined);
        moves.push(actionAServe);
        new ScoringBase("0", "Error", ScoringType.scoring, actionAServe);
        new ScoringBase("1", "Opponent Perfect Pass – can run middle quick", ScoringType.scoring, actionAServe);
        new ScoringBase("2", "Opponent can set pins ", ScoringType.scoring, actionAServe);
        new ScoringBase("3", "Free ball return", ScoringType.scoring, actionAServe);
        new ScoringBase("4", "Ace, no return", ScoringType.scoring, actionAServe);

        var actionReceive = new ScoringBase('R', 'Receive', ScoringType.action, undefined);
        moves.push(actionReceive);
        new ScoringBase("0", "Error", ScoringType.scoring, actionReceive);
        new ScoringBase("1", "Free ball return", ScoringType.scoring, actionReceive);
        new ScoringBase("2", "Can set pinns", ScoringType.scoring, actionReceive);
        new ScoringBase("3", "Perfect pass, can set quick middle", ScoringType.scoring, actionReceive);

        var actionAttack = new ScoringBase('A', 'Assist', ScoringType.action, undefined);
        moves.push(actionAttack);
        new ScoringBase("0", "Ball handling Error", ScoringType.scoring, actionAttack);
        new ScoringBase("1", "Second ball, no free ball", ScoringType.scoring, actionAttack);
        new ScoringBase("2", "Assist with kill", ScoringType.scoring, actionAttack);

        var actionBlock = new ScoringBase('B', 'Block', ScoringType.action, undefined);
        moves.push(actionBlock);
        new ScoringBase("1", "Direct point", ScoringType.scoring, actionBlock);

        var actionDig = new ScoringBase('D', 'Dig', ScoringType.action, undefined);
        moves.push(actionDig);
        new ScoringBase("1", "Ball in play", ScoringType.scoring, actionDig);

        var actionAttack = new ScoringBase('C', 'Attack', ScoringType.action, undefined);
        moves.push(actionAttack);
        new ScoringBase("0", "Error", ScoringType.scoring, actionAttack);
        new ScoringBase("1", "Ball in Play", ScoringType.scoring, actionAttack);
        new ScoringBase("2", "Kill", ScoringType.scoring, actionAttack);
    }

    registerKeyDown(){
        document.onkeydown = (e: KeyboardEvent)=>{
            if (e.key == "Backspace"){
                this.popFragment(this.fragment);
            }
            else{ 
                this.pushFragment(e.key.toLocaleLowerCase(), this.fragment);
          };
        }
    }

    unregisterKeyDown(){
        document.onkeydown = null;
    }

    private popFragment(fragment?: Fragment){
        if (fragment == undefined){
            this.beep(100,440, 1);
        }
        else{
            if(fragment.previous != undefined){
                this.fragment = fragment.previous;
                this.fragment.next = undefined;
            }
            else{
                this.fragment = undefined;
            }
        }
    }

    private pushFragment(key: string, fragment?: Fragment){
        var scoreElement :  ScoringBase | undefined;
        var subScores: ScoringBase[] = [];

        if (fragment == undefined){
            subScores = this.match.subScores;
        }
        else{
            subScores = fragment.score.subScores;
        }

        for(var i: number = 0; i <  subScores.length; i ++){
            if (subScores[i].key.toLocaleLowerCase() == key){
                scoreElement = subScores[i];
                continue;
            }
        }

        if (scoreElement == undefined){
            this.beep(100, 440, 1);
        }
        else{
            this.fragment = {
                next : undefined,
                previous: undefined,
                score: scoreElement
            };
            if (fragment != undefined){
                fragment.next = this.fragment;
                this.fragment.previous = fragment;
            }

            if (this.fragment?.score.subScores.length == 0){
                // TODO: register the completed action on the match;
                alert("completely score one action"); 
            }
        }
    }

    /// https://stackoverflow.com/a/29641185/553589
    private beep(duration: number, frequency: number, volume:number) {
        var ctx = new AudioContext();
        var oscillator = ctx.createOscillator();
        var gainNode = ctx.createGain();
    
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
    
        if (volume){gainNode.gain.value = volume;}
        if (frequency){oscillator.frequency.value = frequency;}
        oscillator.type = "sine";
   
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + ((duration || 500) / 1000));
    };
}