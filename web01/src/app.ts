
import { DI } from './framework/di';
import { iSignalrService } from './services/i-signalr-service';
import { SignalrService } from './services/signalr-service';




export default function start() {
    var signalrService = new SignalrService();
    signalrService.init();
    
    globalThis.di = new DI();
    di.register<SignalrService>(iSignalrService, signalrService)
}