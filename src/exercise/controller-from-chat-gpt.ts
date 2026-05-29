function Controller(): ClassDecorator {
	return () => { };
}

const VALIDATION_KEY = Symbol("validation");

function IsEmail() {
	return function (target: any, propertyKey: string) {
		const existing = Reflect.getMetadata(VALIDATION_KEY, target) || [];
		existing.push({
			property: propertyKey,
			type: "isEmail",
		});
		Reflect.defineMetadata(VALIDATION_KEY, existing, target);
	};
}

function MinLength(length: number) {
	return function (target: any, propertyKey: string) {
		const existing = Reflect.getMetadata(VALIDATION_KEY, target) || [];
		existing.push({
			property: propertyKey,
			type: "minLength",
			value: length,
		});
		Reflect.defineMetadata(VALIDATION_KEY, existing, target);
	};
}

class CreateUserDto {
	@IsEmail()
	email!: string;

	@MinLength(6)
	password!: string;
}

const PARAM_KEY = Symbol("params");

function Body() {
	return function (target: any, methodName: string, index: number) {
		//console.log(methodName, index, Object.getPrototypeOf(target))
		const existing = Reflect.getMetadata(PARAM_KEY, target, methodName) || [];
		existing.push({
			index,
			type: "body",
		});
		return Reflect.defineMetadata(PARAM_KEY, existing, target, methodName);
	};
}

function Post(): MethodDecorator {
	return () => { };
}

function validate(dto: any) {
	const rules = Reflect.getMetadata(VALIDATION_KEY, dto) || [];
	const errors = [];
	for (const rule of rules) {
		const value = dto[rule.property];
		if (rule.type === "isEmail") {
			const valid = /\S+@\S+\.\S+/.test(value);
			if (!valid) {
				errors.push(`${rule.property} must be an email`);
			}
		}
		if (rule.type === "minLength") {
			if (value.length < rule.value) {
				errors.push(
					`${rule.property} must be at least ${rule.value} chars`
				);
			}
		}
	}

	if (errors.length) {
		throw new Error("Validation failed: " + errors.join(", "));
	}
}


function runRoute(controller: any, methodName: string, req: any) {

	const paramMeta = Reflect.getMetadata(PARAM_KEY, controller, methodName) || [];

	const paramTypes = Reflect.getMetadata(
		"design:paramtypes",
		controller,
		methodName
	) || [];

	const args = [];
	for (const param of paramMeta) {
		if (param.type === "body") {
			const DTOClass = paramTypes[param.index];
			// Convert plain object → class instance
			const instance = Object.assign(
				new DTOClass(),
				req.body
			);
			// Validate
			validate(instance);
			args[param.index] = instance;
		}
	}
	return controller[methodName](...args);
}

class UserController {
	@Post()
	create(@Body() dto: CreateUserDto,) {
		return {dto,};
	}
}