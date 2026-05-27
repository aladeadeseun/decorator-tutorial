import "reflect-metadata"

function MinLength(len: number){
    return function(target: any, propertyKey: string){
        /**
         * This mean on the map object creation set key as minLenght,
         * value as len, and then do target which is object and set property as propertyKey
         * target[propertyKey] = len
         * 
         * store['minLength'] = target 
         */
        Reflect.defineMetadata(`minLength`, len, target, propertyKey)
    }
}

class Employee{

    @MinLength(5)
    private name: string;

    constructor(
        name: string, 
        role: string
    ){
        this.name = name
        Reflect.defineMetadata("role", role, this)
        if(!this.validate()){
            throw new Error(`Invalid length for name`)
        }
    }

    //@Reflect.metadata("role", "admin")
    getName(){
        return this.name
    }

    getRole(): string{
        return Reflect.getMetadata("role", this)
    }

    removeRole(){
        return Reflect.deleteMetadata("role", this)
    }

    hasRole(): boolean{
        return Reflect.hasMetadata("role", this)
    }

    validate(){
        const minLenght = Reflect.getMetadata("minLength", this, "name")

        return this.name.length >= minLenght
    }
}

class EmployeeFactory{
    static create(role: string, name: string): Employee{
        const emp = new Employee(name, role)
        Reflect.defineMetadata("role", role, emp)
        return emp
    }
}

function getEmployeeRole(emp: Employee){
    return Reflect.getMetadata("role", emp)
}

const emp = new Employee("Ade", "admin")
console.log(emp.getName())
//Reflect.defineMetadata("role", "admin", emp,)

console.log(Reflect.getMetadata("role", emp, "getName"))
//console.log((emp as any).role)

const sheldon = new Employee("Sheldon", "admin")
const leonard = new Employee("Leonard", "moderator")
const empty = new Employee("", "")

console.log(sheldon.getName(), sheldon.getRole())
console.log(leonard.getName(), leonard.getRole())
console.log("Remove Sheldon role",sheldon.removeRole())
console.log("Get sheldon role afer removal",sheldon.getRole())
console.log("Check if sheldon has role afer removal",sheldon.hasRole())
console.log("Check if leonard has role",leonard.hasRole())

function Role(role: string): ClassDecorator{
    return function(target:any){
        Reflect.defineMetadata("role", role, target)
    }
}

@Role("admin")
class AdminPanel{
    getSettings(){
        return {
            sendNotification:true
        }
    }
}

function canAccessAdminPanel(emp: Employee){
    const empRole = Reflect.getMetadata("role", emp)
    const panelRole = Reflect.getMetadata("role", AdminPanel)
    console.log(panelRole)
    return empRole === panelRole
}

console.log(canAccessAdminPanel(sheldon), canAccessAdminPanel(leonard))