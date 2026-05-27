
function LogMethod(target: any, propKey: string, descriptor: PropertyDescriptor){
    const originalFunction = descriptor.value
    descriptor.value = function(...args: any[]){
        console.log(`calling ${propKey} with arguments`, args)
        return originalFunction.apply(this, args)
    }
    return descriptor
}

function Memoize(target: any, propKey: string, descriptor: PropertyDescriptor){
    const originalFunction = descriptor.value
    const cache = new Map<string, any>()

    descriptor.value = function(...args:any[]){
    
        const key = `${propKey}${args.join("")}`
        console.log(key)
        
        if(cache.has(key)){
            console.log("sending from cache")
            return cache.get(key)
        }

        const result = originalFunction.apply(this, args)
        
        console.log({result})

        cache.set(key, result)
        return result
    }
    return descriptor
}

export class Math{
    
    @LogMethod
    static add(a: number, b: number){
        return a + b
    }

    @Memoize
    static multiply(a: number, b: number){
        return a * b
    }
}
