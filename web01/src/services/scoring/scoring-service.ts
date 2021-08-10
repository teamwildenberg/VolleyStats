import { Move } from "./def/move";
import { iScoringService } from "./i-scoring-service";
import { Player } from "./def/player";
import { Level } from "./def/level";
import { Team } from "./def/team";
import { Fragment } from "./play/fragment";
import { Match } from "./play/match";
import { ScoringBase } from "./def/scoring-base";


export class ScoringService implements iScoringService {
    match: Match = new Match();
    fragment: Fragment | undefined;

    constructor(){
        this.init()
    }

    init() {
        var moves : Move[] = [];
        var teamA =new Team('A','M&P');
        this.match.subScores.push(teamA);
        var teamB = new Team('B', 'J&P');
        this.match.subScores.push(teamB);
        new Player("1", teamA, 1, 'Matthijs', moves);     
        new Player("2",teamA, 2, 'Jasper', moves);
        new Player("1", teamB, 1, 'Paul', moves);
        new Player("2", teamB, 2, 'Mark', moves);

        var actionAServe = new Move('S', 'Serve', '', 0, 4);
        moves.push(actionAServe);
        new Level("0", actionAServe, "Error", 0);
        new Level("1", actionAServe, "Opponent Perfect Pass – can run middle quick", 1);
        new Level("2", actionAServe, "Opponent can set pins ", 2);
        new Level("3", actionAServe, "Free ball return", 3);
        new Level("4", actionAServe, "Ace, no return", 4);

        var actionReceive = new Move('R', 'Receive', '', 0, 3);
        moves.push(actionReceive);
        new Level("0", actionReceive, "Error", 0);
        new Level("1", actionReceive, "Free ball return", 1);
        new Level("2", actionReceive, "Can set pinns", 2);
        new Level("3", actionReceive, "Perfect pass, can set quick middle", 3);

        var actionAttack = new Move('A', 'Assist', '', 0, 2);
        moves.push(actionAttack);
        new Level("0", actionAttack, "Ball handling Error", 0);
        new Level("1", actionAttack, "Second ball, no free ball", 1);
        new Level("2", actionAttack, "Assist with kill", 2);

        var actionBlock = new Move('B', 'Block', '', 1, 1);
        moves.push(actionBlock);
        new Level("1", actionBlock, "Direct point", 1);

        var actionDig = new Move('D', 'Dig', '', 1, 1);
        moves.push(actionDig);
        new Level("1", actionDig, "Ball in play", 1);

        var actionAttack = new Move('C', 'Attack', '', 0, 2);
        moves.push(actionAttack);
        new Level("0", actionAttack, "Error", 0);
        new Level("1", actionAttack, "Ball in Play", 1);
        new Level("2", actionAttack, "Kill", 2);
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