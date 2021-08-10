
import { DI } from './framework/di';
import { iSignalrService } from './services/i-signalr-service';
import { iScoringService } from './services/scoring/i-scoring-service';
import { ScoringService } from './services/scoring/scoring-service';
import { SignalrService } from './services/signalr-service';




export default function start() {
    var signalrService = new SignalrService();
    signalrService.init();
    
    globalThis.di = new DI();
    di.register<SignalrService>(iSignalrService, signalrService) 
    di.register<ScoringService>(iScoringService, new ScoringService())
}