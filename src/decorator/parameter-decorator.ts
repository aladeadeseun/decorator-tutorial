
function Uppercase(target:any, propKey: string){
    
    console.log(target, propKey)
    const descr = Object.getOwnPropertyDescriptor(target, propKey)
    let val = target[propKey]
    const originalGetter = descr?.get
    const originalSetter = descr?.set
    const getter = function() {
        return originalGetter ? originalGetter.call(target) : val
    }
    const setter = (newValue:any) => {
        if(originalSetter){
            originalSetter.call(target, newValue.toLocaleUpperCase())
        }
        else
            val = newValue.toLocaleUpperCase()
    }
    Object.defineProperty(target, propKey, {
        get:getter,
        set:setter,
        enumerable:true,
        configurable:true
    })
    // console.log(target)
}

function LogUpdate(target:any, propertyKey: string){
    let value = target[propertyKey]

    const getter = () => {
        return value
    }

    const setter = (newVal: string) => {
        console.log(`Setting ${propertyKey} from ${value} to ${newVal}`)
        value = newVal
    }

    Object.defineProperty(target, propertyKey, {
        get:getter,
        set:setter,
        enumerable:true,
        configurable:true
    })
}

class Person{
    @Uppercase
    @LogUpdate
    private _name: string
    constructor(name: string){
        this._name = name
    }

    getName(){
        console.log(this)
        return this._name
    }

    setName(newNam: string){
        this._name = newNam
    }
}

const p = new Person("Ade Olu")
//console.log(p.name)
//p.name = "Olu Ade"
//console.log(p.name)
console.log(p.getName())
p.setName("Oriyomi")