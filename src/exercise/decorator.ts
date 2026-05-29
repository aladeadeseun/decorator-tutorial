import { GenericBaseClass, RoleType } from "../type";
import { test } from "./controller";
import { Max, Min, Required, validate } from "./validator";

//CLASS DECORATORS
//Exercise 3 — Create a Logger Decorator
function Logger<T extends GenericBaseClass>(ClassEntity: T): T{
    console.log(`${ClassEntity.name} class created at ${new Date().toDateString()}.`)

    return class AdvanceClass extends ClassEntity{
        
        private static instanceCounter: number = 0

        constructor(...args:any[]){
            super(...args)
            console.log("Argument List <->", ...args)
            
            console.log("Instance created counter <->", ++AdvanceClass.instanceCounter)
        }

        getName(): string{
            return ClassEntity.name
        }
    }
}

//Exercise 4 — Add Methods Through Decorators
function AddVersion(version: string){
    return function<T extends GenericBaseClass>(ClassEntity: T){
        
        console.log(ClassEntity.prototype, version)

        //Object.defineProperty(ClassEntity.prototype)
        // ClassEntity.prototype.version = version
        // ClassEntity.prototype.createdAt = new Date()

        return class extends ClassEntity{
            public version: string = version
            public createdAt: Date

            constructor(...args: any[]){
                super(...args)
                this.createdAt = new Date()
            }

            getInfo(){
                return `${ClassEntity.name} version - ${version}`
            }
        }
    }
}

//Exercise 5 — Freeze Classes
function Freeze<T extends GenericBaseClass>(ClassEntity: T): T{
    
    class FrozenClass extends ClassEntity{
        constructor(...args: any[]){
            super(...args)
            Object.freeze(this)
        }
    }
    Object.freeze(FrozenClass)
    Object.freeze(FrozenClass.prototype)
    return FrozenClass
}
/**
 * End CLASS DECORATORS
 */



/**
 * METHOD DECORATORS 
 */
//Exercise 6 — Create a Timing Decorator
function Measure(target: any, propKey: string, descriptor: PropertyDescriptor){
    const method = descriptor.value
    descriptor.value = async function(...args: any[]){
        const start = Date.now();
        const result = await method.apply(this, args)
        const end = Date.now()
        const interval = end - start
        if(interval > 1000){
            console.warn(`Method execution exceeded 1 second.`)
        }
        console.log(`Method execution take :${interval}ms`)
        return result
    }
    return descriptor
}

//Exercise 7 — Build a Retry Decorator
function Retry(retryTimes: number){
    //return promise back to caller
    return function(target: any, propKey: string, descriptor: PropertyDescriptor){
        //store the methode before I override it
        const method = descriptor.value

        //overide it
        descriptor.value = function(...args: any[]){
            //create a new helper method that'll help execute the function in an isolated environment 
            // so I can retry if need be.
            async function executeMethod(thisObject:any, callback:(error: Error | null, result?:any)=>void){
                //try calling the method in a try catch
                try{
                    const result = await method.apply(thisObject, args)
                    //if no error in method call, call callback with result
                    callback(null, result)
                }
                catch(e){
                    //error occur call callback with the error
                    callback(e as Error)
                }//end catch
            }//end func executeMethod

            //return promise back to caller 
            return new Promise((resolve: Function, reject: Function) => {
                //create a retry counter
                let retryCounter = 0
                //create a callback to be passed to execute method helper
                const callback = (error: Error | null, result?:any) => {
                    //if error occur
                    if(error){
                        //increment it retry by 1
                        retryCounter += 1
                        //if the attempt is less than or equal retry time
                        if(retryCounter <= retryTimes){
                            //notify caller 
                            console.info(`Retrying ${retryCounter}...`) 
                            //retry again
                            executeMethod(this, callback)
                        }
                        //else reject with error so caller can handle it and know what the issue is
                        else{
                            reject(error)
                        }
                        //Very Important, prevent executionfrom coming down.
                        return
                    }//end if
                    //If no error, send result back to caller
                    resolve(result)
                }//end callback
                //carry out first execution
                executeMethod(this, callback)
            })//end promise implementation
        }//end new method assign to descriptor.value
        //replace with 
        return descriptor
    }//end decorator definition
}//end function

//Exercise 8 — Create a Role Guard Decorator
function Role(role:RoleType[] | RoleType){
    return function(target: any, propKey: string, descriptor: PropertyDescriptor){
        const method = descriptor.value
        descriptor.value = function(...args:any[]){
            const currentUserrole = Reflect.getMetadata("role", this)
            //defult access to false
            let canAccess = false
            if(Array.isArray(role)){
                canAccess = (role.indexOf(currentUserrole) > -1)
            }
            else{
                canAccess = role === currentUserrole
            }
            if(canAccess){
                //console.log()
                return method.apply(this, args)    
            }
            throw new Error(`Access denied: You are not permitted perform action.`)
        }
        return descriptor
    }
}

/**
 * End METHOD DECORATORS
 */

/**
 * PROPERTY DECORATORS
 */

//Exercise 9 — Required Fields
//check validator.ts for implementation
//Exercise 10 — Min/Max Length Validation

/**
 * End PROPERTY DECORATORS
 */

/**
 * PARAMETER DECORATORS
 */

//Exercise 11 — Create
function Body(target: Object, propertyKey: string | symbol, parameterIndex: number){
    console.log(target, propertyKey, parameterIndex)
}
/**
 * END PARAMETER DECORATORS
 */

@Logger
class UserService {
    private retryCounter = 0
    constructor(private name: string){
        console.log(this.name)
    }

    @Measure
    getUsers(){
        return new Promise(function(resolve:Function){
            console.log("Fetching data from server...")
            setTimeout(()=>{
                console.log("Finish fetching data")
                resolve([{name:"Olu", id:1}, {name:"Ola", id:2}, {name:"Ade", id:3}])
            }, 1000)
        })
    }

    @Retry(2)
    fetchPost(){
        return new Promise((resolve: Function, reject: Function) => {
            console.log("Fetching data from server...")
            //I need this to simulate fetching data from server
            setTimeout(() => {
                //reject once
                if(this.retryCounter === 0)
                    reject(new Error(`Network Error: Unable to fetch data from server`))
                else
                    //success fetching
                    resolve([{name:"Olu", id:1}, {name:"Ola", id:2}, {name:"Ade", id:3}])

                this.retryCounter += 1
            }, 200)
        })
    }
}

@AddVersion("1.0")
class AuthService{}

@Freeze
class Config{
    constructor(public environment="development"){}
}

class User{
    constructor(role: RoleType){
        Reflect.defineMetadata("role", role, this)
    }

    @Role("admin")
    deleteUser(){
        return new Promise((resolve: Function, reject: Function)=>{
            setTimeout(()=>{
                resolve({id:1,name:"Hello world"})
            }, 100)
        })
    }

    //create(@Body body: any) {}
}

// class RequiredDto{
//     @Min(4)
//     @Max(20)
//     @Required
//     email!:string
// }

// class UserDto{
//     @Required
//     username!:string
// }

export async function DecoratorMain(){
    //const auth = new AuthService()
    //console.log((auth as any).version)
    //console.log((auth as any).version, (auth as any).getInfo())
    //const config = new Config()
    //console.log(config.environment)
    //config.environment = "production"
    // config.test = "Hello"
    //Config.prototype.me = function(){}
    //const user = new UserService("Akinsola")
    //console.log(user)
    //console.log(await user.getUsers())
    //console.log("-------------------------------------------------")
    //console.log()
    //console.log(await user.fetchPost())
    //console.log("------------I executed------")

    //const user = new User("admin")

    //console.log(await user.deleteUser())
    //console.log("-------------------------------------------------")
    //const rdDto = new RequiredDto()
    //rdDto.email = "Hello"
    //console.log((rd as any).validate())
    //validate(rd)
    //console.log()
    //console.log(validate(rdDto, true))

    //const userDto = new UserDto()
    //console.log(validate(userDto, true))
    //const userController = new UserController()

    test()
}


