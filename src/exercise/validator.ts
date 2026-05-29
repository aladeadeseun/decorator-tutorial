import { GenericBaseClass, WhichValidator } from "../type";

//I need this for me to add additional validation to the input field
type WhichMetadataType = "len" | "contain"
//
type MetadataType = {[K in WhichMetadataType]?:any}

type ValidatorType = {which:WhichValidator, msg?: string, metadata?:MetadataType}

type ValObject = Record<string, ValidatorType[]>

const validatorKey = Symbol("validator");

function decoratorHelper(target:any, propKey:string, which: WhichValidator, metadata?:MetadataType, msg?: string){
    //get validation added for this propkey on the object
    const valObj: ValObject = Reflect.getMetadata(validatorKey, target) ?? {}
    //If not yet added to the array
    if(!valObj[propKey]){
        valObj[propKey] = []
    }
    const validator: ValidatorType = {which} as ValidatorType

    if(metadata){
        validator.metadata = metadata
    }
    if(msg){
        validator.msg = msg
    }
    //add to array
    valObj[propKey].push(validator)
    //set back on reflector
    Reflect.defineMetadata(validatorKey, valObj, target)
}

export function Required(target:Object, propKey:string){
    console.log("required", target.constructor.name)
    //console.log(Object.getOwnPropertyNames(target.constructor.prototype))
    //console.log(Object.getOwnPropertySymbols(target))
    //console.log(Object.getOwnPropertyDescriptor(target, propKey))
    //console.log(arguments) 
    console.log("required", {target,propKey})
    //Reflect.metadata(propKey, "required")
    //Reflect.defineMetadata(propKey, "required", target)
    //Reflect.defineMetadata(validatorKey,)
    //first get metadata for this prop key
    //console.log("required", target, propKey)
    decoratorHelper(target, propKey, "required")
}

export function Min(length: number, msg?:string){
    return function(target: any, propKey: string){
        decoratorHelper(target, propKey, "min", {len:length}, msg)
    }
}

export function Max(length: number, msg?:string){
    return function(target: any, propKey: string){
        decoratorHelper(target, propKey, "max", {len:length}, msg)
    }
}

function validateMinAndMaxLength(which: "min" | "max", val: any, len: number, field:string, msg?:string,){
    msg = msg ?? `${which === "min" ? "Minimum" : "Maximum"} ${field} length is ${len}`
    
    if(!val) return msg

    if(Object.getOwnPropertyNames(val).indexOf("length") > -1){
        if(which === "min"){
            if(val.length < len) return msg
        }
        else if(which === "max"){
            if(val.length > len) return msg
        }
        else throw new Error(`${which} is not supported`)
        return false
    }

    return msg
}

function maxLength(val: any, len: number, field:string, msg?:string,){
    msg = msg ?? `Minimum ${field} length is ${len}`
    
    if(!val) return msg

    if(Object.getOwnPropertyNames(val).indexOf("length") > -1){
        if(val.length < len) return msg

        return false
    }

    return msg
}

export function validate<T extends GenericBaseClass>(target: InstanceType<T>, bail: boolean){
    
    const valObj: ValObject = Reflect.getMetadata(validatorKey, target) ?? {}

    const valErrorObj:Record<string, string[]> = {}
    const output: Record<string, any> = {}

    for(const key in valObj){
        const val = (target as any)[key]
        for(const validator of valObj[key]){

            //if the user want to bail or first validation error
            if(bail && valErrorObj[key]) break

            let errorMsg: string | false = false

            const {which, metadata, msg} = validator

            /**
             * // else if(typeof(val) !== "string"){
                //     msg = `Invalid ${key}`
                // }
             */

            if(which === "required"){
                if(!val)
                    errorMsg = msg ?? `${key} is required`
            }//end if

            else if(which === "min"){
                const check = validateMinAndMaxLength(which, val, metadata!.len, key, msg)
                if(check !== false){
                    errorMsg = check
                }
            }
            else if(which === "max"){
                const check = validateMinAndMaxLength(which, val, metadata!.len, key, msg)
                if(check !== false){
                    errorMsg = check
                }
            }

            if(errorMsg){
                const prev = valErrorObj[key] ?? []
                prev.push(errorMsg)
                valErrorObj[key] = prev
            }//end if
            else{
                output[key] = val
            }
        }//end for loop
    }//end outer for loop
    return {
        error:valErrorObj,
        data:output,
        failed:Object.keys(valErrorObj).length > 0
    }
}