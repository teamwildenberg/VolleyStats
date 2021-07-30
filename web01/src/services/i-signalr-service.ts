import { Subject } from "rxjs";
import { Stat } from "./stat";

export interface iSignalrService{
    init(): void;
    statData: Subject<Stat>;
}

export var iSignalrService: string = "iSignalrService";