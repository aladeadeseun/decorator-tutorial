import "reflect-metadata"

type GenericBaseClass = new (...args:any) => {}

function CreateOnlyNInstance(limit: number){
    return function<T extends GenericBaseClass>(ClassEntity: T): T{
        let counter = 0
        console.log({counter})
        class newClass extends ClassEntity {
            constructor(...args: any[]){
                if(counter >= limit) throw new Error(`Max instance that can be created is ${limit}`)
                super(...args)
                counter += 1
                console.log("After creating an instance at count ", counter)
            }
        }
        return newClass
    }
}

function Singleton<T extends GenericBaseClass>(ClassEntity: T): T{
    let instance: InstanceType<T>
    class newClass extends ClassEntity {
        constructor(...args: any[]){
            if(!instance){
                instance = super(...args) as InstanceType<T>
            }
            return instance
        }
    }
    return newClass
}

function Timestamp<T extends GenericBaseClass>(ClassEntity: T): T{
    class newClass extends ClassEntity {
        constructor(...args: any[]){
            super(...args)
            console.log(`Object from "${ClassEntity.name}" created at `, new Date().toDateString())
        }
    }
    //const entity = new newClass()

    //return entity
    return newClass
}

function ToggleTimestamp(enable: boolean){
    return function Timestamp<T extends GenericBaseClass>(ClassEntity: T): T{
        class newClass extends ClassEntity {
            constructor(...args: any[]){
                super(...args)
                if(enable)
                    console.log(`Object from "${ClassEntity.name}" created at `, new Date().toDateString())
            }
        }
        //const entity = new newClass()

        //return entity
        return newClass
    }
}

@Timestamp
@Singleton
class Employee{
    public name: string
    constructor(name: string){
        this.name = name
    }
}

//@Singleton("HHHH")
@ToggleTimestamp(true)
@CreateOnlyNInstance(2)
class Student{
    public roleNUmber: string
    constructor(roleNumber: string){
        this.roleNUmber = roleNumber
    }
}

//const emp = new Employee()

//const entity = Test(Employee)
//const student = Test(Student)
//console.log(entity.name)

//const AdvancedEmployee = Test(Employee)
//const advEmp = new AdvancedEmployee("Ade Olu")
const advEmp = new Employee("When")
const advEmp2 = new Employee("When")
const std = new Student("123")
const std1 = new Student("124")
console.log(advEmp.name, advEmp2.name)
console.log(std.roleNUmber, std1.roleNUmber)