export function createInstance<T extends {new(...args:any[]) : InstanceType<T>}>(classType: T, ...args:any[]): InstanceType<T>{
    return new classType(...args)
}

interface HasGetName{
    getName(): string
}

function printName<T extends HasGetName>(obj: T): string{
    return obj.getName()
}

class Animal implements HasGetName{
    getName(): string {
        throw new Error("Method not implemented")
    }
}

const dog = new Animal()
printName(dog)