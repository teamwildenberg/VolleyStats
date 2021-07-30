import { Observable, Subject } from 'rxjs';
import { from } from 'rxjs';
import  { map } from 'rxjs/operators';
import { iSignalrService } from './i-signalr-service';
import * as signalR from "@microsoft/signalr";
import { Stat } from './stat';
import { SignalrConnection } from './signalr-connection';


export class SignalrService implements iSignalrService {
    statData = new Subject<Stat>();
    private hubConnection?: signalR.HubConnection;
    
    init() {
        this.getSignalRConnection().subscribe(con => {
            const options = {
                accessTokenFactory: () => con.AccessToken
            };
            this.hubConnection = new signalR.HubConnectionBuilder()
                    .withUrl(con.Url, options)
                    .configureLogging(signalR.LogLevel.Information)
                    .build();
            this.registerOnHub();        
        });
    }
    
    private registerOnHub(): Observable<Stat>{
        if (this.hubConnection != null){
            this.hubConnection.start().catch(error => console.error(error));
            this.hubConnection.on('newStat', data => {
            //        data= JSON.parse(data);
                    this.statData.next(data);
                });

            return this.statData;
        }
        else{
            throw "SignalR connection not initialized";
        }
    }

    private getSignalRConnection(): Observable<SignalrConnection> {
         var opsFromPromise = from(fetch('http://localhost:7071/api/signalrnegotiate').then(res => res.json()));
        //var opsFromPromise = from(fetch('https://twvosdeveurfun01.azurewebsites.net/api/signalrnegotiate').then(res => res.json()));
        return opsFromPromise.pipe(map((r: any) =>  r as SignalrConnection));

        // return this.http.get<SignalRConnection>(`${environment.baseUrl}SignalRConnection`);
        // return this.http.get<SignalRConnection>(`https://twmappoceurfun01.azurewebsites.net/api/signalrnegotiate`);
        // return this.http.get<SignalRConnection>(`http://localhost:7071/api/signalrnegotiate`);
    }

}