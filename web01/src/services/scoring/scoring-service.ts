import { iScoringService } from "./i-scoring-service";
import { ScoringDefinition } from "./def/scoring-definition";
import { ScoringType } from "./def/scoring-type";
import { Fragment } from "./play/fragment";
import { Action } from "./play/action";
import { Subject } from "rxjs";
import { ScoreBase } from "./play/score-base";


export class ScoringService implements iScoringService {
    match: ScoringDefinition = new ScoringDefinition('', 'A match to score',  ScoringType.match, undefined);
    fragment: Fragment | undefined;
    action: Action | undefined;
    scoringData = new Subject<ScoreBase|undefined>();

    constructor(){
        this.init()
    }

    init() {
        var moves : ScoringDefinition[] = [];
        var teamA =new ScoringDefinition('A', 'Team A', ScoringType.team, this.match);
        var teamB = new ScoringDefinition('B', 'Team B', ScoringType.team, this.match);
        var p1 = new ScoringDefinition("1", "P1", ScoringType.player, teamA);
        p1.subScores = moves;
        var p2 = new ScoringDefinition("2", "p2", ScoringType.player, teamA);
        p2.subScores = moves;
        var p3 = new ScoringDefinition("1", "p3", ScoringType.player, teamB);
        p3.subScores = moves;
        var p4 = new ScoringDefinition("2", "p4", ScoringType.player, teamB);
        p4.subScores = moves;

        var actionAServe = new ScoringDefinition('S', 'Serve', ScoringType.action, undefined);
        moves.push(actionAServe);
        new ScoringDefinition("0", "Error", ScoringType.score, actionAServe);
        new ScoringDefinition("1", "Opponent Perfect Pass – can run middle quick", ScoringType.score, actionAServe);
        new ScoringDefinition("2", "Opponent can set pins ", ScoringType.score, actionAServe);
        new ScoringDefinition("3", "Free ball return", ScoringType.score, actionAServe);
        new ScoringDefinition("4", "Ace, no return", ScoringType.score, actionAServe);

        var actionReceive = new ScoringDefinition('R', 'Receive', ScoringType.action, undefined);
        moves.push(actionReceive);
        new ScoringDefinition("0", "Error", ScoringType.score, actionReceive);
        new ScoringDefinition("1", "Free ball return", ScoringType.score, actionReceive);
        new ScoringDefinition("2", "Can set pinns", ScoringType.score, actionReceive);
        new ScoringDefinition("3", "Perfect pass, can set quick middle", ScoringType.score, actionReceive);

        var actionAttack = new ScoringDefinition('A', 'Assist', ScoringType.action, undefined);
        moves.push(actionAttack);
        new ScoringDefinition("0", "Ball handling Error", ScoringType.score, actionAttack);
        new ScoringDefinition("1", "Second ball, no free ball", ScoringType.score, actionAttack);
        new ScoringDefinition("2", "Assist with kill", ScoringType.score, actionAttack);

        var actionBlock = new ScoringDefinition('B', 'Block', ScoringType.action, undefined);
        moves.push(actionBlock);
        new ScoringDefinition("1", "Direct point", ScoringType.score, actionBlock);

        var actionDig = new ScoringDefinition('D', 'Dig', ScoringType.action, undefined);
        moves.push(actionDig);
        new ScoringDefinition("1", "Ball in play", ScoringType.score, actionDig);

        var actionAttack = new ScoringDefinition('C', 'Attack', ScoringType.action, undefined);
        moves.push(actionAttack);
        new ScoringDefinition("0", "Error", ScoringType.score, actionAttack);
        new ScoringDefinition("1", "Ball in Play", ScoringType.score, actionAttack);
        new ScoringDefinition("2", "Kill", ScoringType.score, actionAttack);
    }

    registerKeyDown(){
        document.onkeydown = (e: KeyboardEvent)=>{
            if (e.key == "Backspace"){
                this.popFragment(this.fragment);
            }else if (e.key == "Enter"){
                alert('enter');
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
                this.scoringData.next(this.fragment);
            }
            else{
                this.fragment = undefined;
                this.scoringData.next(undefined);
            }
        }
    }

    private pushFragment(key: string, fragment?: Fragment){
        var currentDef = fragment?.score; 

        if (currentDef == undefined){            
            currentDef = this.match;
        }

        var scoreElement = currentDef.getSubDef(key);
        

        if (scoreElement == undefined){
            this.beep(100, 440, 1);
        }
        else{
            this.fragment = Fragment.newFragment(scoreElement , this.fragment);
            this.scoringData.next(this.fragment);

            if (this.fragment?.isCompleted()){
                this.pushAction(this.fragment, this.action);
                this.fragment = undefined;
            }
        }
    }

    private pushAction(frament: Fragment, action?: Action){
        this.action = Action.newAction(frament, action);
        this.scoringData.next(this.action)
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