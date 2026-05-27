type GenericBaseClass = new (...args:any) => {}

interface ILogger{
    log(message:string): void
}

class Container{
    private _service = new Map()
    public register<T>(token: new (...args: any[]) => T, instance: T){
        this._service.set(token, instance)
    }
    public resolve<T>(token:new (...args:any[]) => T): T{
        if(this._service.has(token)){
            return this._service.get(token)
        }
        throw new Error(`${token.name} not set.`)
    }
}

const container = new Container()

function Injectable<T extends GenericBaseClass>(BaseClassEntity: T){
    container.register(BaseClassEntity, new BaseClassEntity())
}

function Inject<T extends GenericBaseClass>(token:T){
    return function(target:any, propKey: string){
        Object.defineProperty(target, propKey, {
            enumerable:true,
            configurable:true,
            get() {
                return container.resolve(token)
            },
        })
    }
}

@Injectable
class ConsoleLoggerService implements ILogger{
    log(message: string){
        console.log(`[console]: ${message}`)
    }
}

@Injectable
class FileLoggerService implements ILogger{
    log(message: string){
        console.log(`[file]: ${message}`)
    }
}

@Injectable
class CloudLoggerService implements ILogger{
    log(message: string){
        console.log(`[cloud]: ${message}`)
    }
}

@Injectable
class ConfigService{
    getEnvConfig(configName: string){
        return `file`
    }
    getDbConfig(configName: string){
        return `console`
    }
}

function getConfig(): string{
    return "console"
}

@Injectable
class LoggerFactory{

    @Inject(ConfigService)
    private configService!: ConfigService

    @Inject(ConsoleLoggerService)
    private consoleLogger!:ConsoleLoggerService
    @Inject(CloudLoggerService)
    private cloudLogger!:CloudLoggerService
    @Inject(FileLoggerService)
    private fileLogger!:FileLoggerService

    getLogger(): ILogger{
        switch(this.configService.getEnvConfig("loggerConfig")){
            case "file": return this.fileLogger
            case "cloud": return this.cloudLogger
            case "console": return this.consoleLogger
        }
        throw new Error(`unknown logger service instance`)
    }
}

@Injectable
class UserService{
    @Inject(LoggerFactory)
    private loggerFactory!:LoggerFactory
    //@Inject(CloudLoggerService)
    
    //! represent definite assignment assertion
    private loggerService!: ILogger

    constructor(){
        this.loggerService = this.loggerFactory.getLogger()
    }

    login(username: string, password: string){
        this.loggerService.log(`logging in user with ${username} and ${password}`)
    }
    updateUserName(newUsername: string){
        this.loggerService.log(`updating username ${newUsername}`)
    }
    logout(){
        this.loggerService.log("logging out user")
    }
}

class Main{
    @Inject(UserService)
    //! represent definite assignment assertion
    private userService!: UserService
    constructor(){
        //this.userService = container.resolve(UserService)
    }

    init(){
        this.userService.login("john", "john@123")
        this.userService.updateUserName("johny")
        this.userService.logout()
    }
}

// container.register(ConsoleLoggerService, new ConsoleLoggerService())
// container.register(UserService, new UserService())

export const main = new Main()