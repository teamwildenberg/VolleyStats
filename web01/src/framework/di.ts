const ERROR_SERVICE: string = "Service does not exist.";


export class DI {
	
	public container: {[name: string]: any};
	
	constructor() {
		this.container = {};
		this.container["$$di"] = () => this;	
	}
	
	get<T>(name: string): T {
        var obj =  this.container[name];
        if (obj === null){
            throw ERROR_SERVICE;
        }
        else{
            return obj;
        }
	}
	
	register<T>(name: string, obj: T) {
            this.container[name] = obj;
         
		}
}