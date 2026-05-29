import "reflect-metadata"
import { Required } from "./validator";

const parameterKey = Symbol("parameter");

type ParameterType = "param" | "body" | "query"


type ParameterObjType = {index: number,type:ParameterType, methodName:string | symbol}

function Post(){
	return function (target: any, propKey: string, descriptor: PropertyDescriptor){
    	//console.log("post", target,propKey)
		// console.log("Dto",Reflect.getMetadata(
		// 	"design:paramtypes",
		// 	target,
		// 	"create"
		// 	//propertyName
		// ))

		// descriptor.value = function(...arg:any[]){
		//     console.log(arg)
		//     const expressBody = {username:"Ade", email:"Popoola"}
		//     const paramId = 23
		//     const method = descriptor.value
		//     console.log()
		// }

		// return descriptor
	}
}

function registerParameterHelper(target: Object, propertyKey: string | symbol, parameterIndex: number, parameterType:ParameterType){
    const parameterList:ParameterObjType[] = (
        Reflect.getMetadata(parameterIndex, target, propertyKey) ?? []
    )
    parameterList.push({index:parameterIndex, type:parameterType, methodName:propertyKey}) 
    Reflect.defineMetadata(parameterKey, parameterList, target, propertyKey)
}

function Body(){
	return function (target: Object, propertyKey: string | symbol, parameterIndex: number){
		//console.log("body", target,propertyKey, parameterIndex)
		//console.log("body", Object.getOwnPropertyNames())
		//console.log("body", target.constructor.prototype.create)
		registerParameterHelper(target, propertyKey, parameterIndex, "body")
	}
}

function Param(){
	return function(target: Object, propertyKey: string | symbol, parameterIndex: number){
		//console.log("param", target, propertyKey, parameterIndex)
    	registerParameterHelper(target, propertyKey, parameterIndex, "param")
	}
}

class CreateUserDto{
    @Required
    readonly username!:string
	@Required
	readonly email!:string
}


class UserController {
	@Post()
	create(@Body() dto: CreateUserDto, @Param() id:string) {
		return {dto, param:id};
	}
}

export function test() {
	const controller = new UserController();

	const req = {
		body: {
			email: "wrong-email",
			password: "123",
		},
	};
	//console.log(Reflect.getOwnMetadataKeys(controller))
	console.log(Reflect.getMetadata(
		"design:paramtypes",
		controller,
		"create"
	));

	// console.log(
	// 	"decorator",
	// 	Reflect.getMetadata(
	// 		"design:paramtypes",
	// 		UserController.prototype,
	// 		"create"
	// 	)
	// )

	// console.log(
	// 	Reflect.getMetadata(
	// 		"design:paramtypes",
	// 		Object.getPrototypeOf(controller),
	// 		"create"
	// 	)
	// )
	// console.log(Reflect.getMetadataKeys(Object.getPrototypeOf(controller)))
	// console.log(Reflect.getOwnMetadataKeys(UserController.prototype,"create"))
	//console.log("controller", Reflect.getMetadata("design:paramtypes", controller))
	//runRoute(controller, "create", req);
}