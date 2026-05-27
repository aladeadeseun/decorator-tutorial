import "reflect-metadata";
// function first() {
//   console.log("first(): factory evaluated");
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log("first(): called");
//   };
// }
 
// function second() {
//   console.log("second(): factory evaluated");
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log("second(): called");
//   };
// }
 
// class ExampleClass {
//   @first()
//   @second()
//   method() {}
// }

// function printDecoratorData(value: Function, context: ClassDecoratorContext){
//     console.log("value:")
//     console.log(value)
//     console.log("context")
//     console.log(context)
//     // context.addInitializer(() => {
//     //     console.log("Initialized class " + context.name)
//     // })
// }

// // function Logger(target: any) {
// //   console.log(`Registered class: ${target.name}`);
// // }

// // @Logger
// // class UserService {

// //   constructor() {
// //     console.log("UserService started.");
// //   }
// // }

// // new UserService();

// class Person{
//     constructor(private lastname:string, private firstname: string, private age:number){}
//     get fullname(): string{
//         return `${this.lastname} ${this.firstname}`
//     }

//     set setAge(age: number){
//         this.age = age
//     }

//     get getAge(): number{
//         return this.age
//     }
// }

// const p = new Person("Olu", "Ola", 23)

// console.log(p.fullname, p.getAge)

// p.setAge = 45

// console.log(p.getAge)

// abstract class Shape{

//     constructor(protected name:string){}

//     abstract calculateArea():number

//     displayName(){
//         console.log("This is a shape, ", this.name)
//     }
// }

// class Rectangle extends Shape{
    
//     constructor(private _width:number, private _height:number){
//         super("Rectangle")
//     }

//     calculateArea(): number{
//         return this._height * this._width
//     }
// }

// class Circle extends Shape{
//     constructor(private _radius: number){
//         super("Circle")
//     }

//     calculateArea(): number {
//         return (Math.PI * this._radius * this._radius)
//     }
// }

// const rect: Shape = new Rectangle(20, 34)
// console.log(rect.calculateArea())
// rect.displayName()

// const circle: Shape = new Circle(9)
// console.log(circle.calculateArea())
// circle.displayName()



// /**
//  * Class Decorator
//  */
// function addStaticProperty(target: any){
//     console.log(target)
//     target.staticProperty = "I am a static property"
//     console.log(target.name)
// }

// @addStaticProperty
// class MyClass{}

// console.log((MyClass as any).staticProperty)

// function logClassData(constructor: Function){
//     console.log("Logging class data...")
//     console.log(constructor)
// }

// @logClassData
// class Student{
//     name = "Manas"

//     constructor(){
//         console.log(`Creating Student object....`)
//     }
// }

// const std = new Student()

// console.log(`Student has name ${std.name}`)

// function LogSeperator(label: string){
//     return function(target:any){
//         console.log(`---------------------${label}------------------`)
//     }
// }

// /**
//  * End Class Decorator
//  */

// /**
//  * Factory Decorator
//  */
// function color(name: string){
//     return function(target: Function){
//         console.log(`color: ${name} - class: ${target.name}`)
//     }
// }

// function Logger(logString: string){
//     return function(constructor: Function){
//         console.log(logString)
//         console.log(constructor)
//     }
// }

// @color("Green")
// @Logger("hello world")
// @LogSeperator("Factory Decorator")
// class Person2{
//     name = "Rajni"

//     constructor(){
//         console.log(`Creating person object`)
//     }
// }

// const p2 = new Person2()
// console.log(p2)

// /**
//  * End Factory Decorator
//  */


// /**
//  * Property Decorator
//  */
// type Constructor<T = {}> = new (...args: any[]) => T;

// // function MyDecorator<T extends Constructor>(target: T) {

// //   return class extends target {

// //     createdAt = new Date();

// //   };

// // }
// function logProperty(target: Function, propertyKey: string){
//     console.log(`Property decorator applied to property '${propertyKey}' in class '${target.name}'`)
// }

// @LogSeperator("Property Decorator")
// class Example{
//     //@logProperty
//     message: string = "Hello world"
// }

// function accessorDecorator(target: any, memberName: string, descriptor: PropertyDecorator){
//     console.log("Accessor decorator")
//     console.log(target)
//     console.log(memberName)
//     console.log(descriptor)
// }

// class Product{
//     private title: string = ""
//     private _price: number = 90

//     @accessorDecorator
//     get price(){
//         return this._price
//     }
// }


// function sealed(constructor: Function) {
//   Object.seal(constructor);
//   Object.seal(constructor.prototype);
// }

// function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
//   return class extends constructor {
//     private reportingURL: string = "http://www...";
//   };
// }

// @sealed
// @reportableClassDecorator
// class BugReport {
//   type = "report";
//   title: string;
 
//   constructor(t: string) {
//     this.title = t;
//   }
// }

// const b = new BugReport("Bug Report")
// //b.title = ""
// console.log({title:b.title, type:b.type, reportingURL:(b as any).reportingURL})

// function enumerable(value: boolean) {
//     console.log("Hello enumerable")
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     descriptor.enumerable = value;
//   };
// }

// class Greeter {
//   greeting: string;
//   constructor(message: string) {
//     this.greeting = message;
//   }
 
//   @enumerable(false)
//   greet() {
//     return "Hello, " + this.greeting;
//   }
// }

// const g = new Greeter("World")

// console.log(g.greet())

// class Point {
//   private _x: number;
//   private _y: number;
//   constructor(x: number, y: number) {
//     this._x = x;
//     this._y = y;
//   }
 
//   @configurable(false)
//   get x() {
//     return this._x;
//   }
 
//   @configurable(false)
//   get y() {
//     return this._y;
//   }
// }

// function configurable(value: boolean) {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log({ target, propertyKey, descriptor })
//     descriptor.configurable = value;
//   };
// }

// const point:Point = new Point(10, 102)

// console.log(point.x, point.y)



// const formatMetadataKey = Symbol("format");
// function format(formatString: string) {
//     //console.log(formatString, formatMetadataKey)
//   return Reflect.metadata(formatMetadataKey, formatString);
// }

// function getFormat(target: any, propertyKey: string) {
//   return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
// }

// class Greeter1 {
//   @format("Hello, %s")
//   greeting: string;
//   constructor(message: string) {
//     this.greeting = message;
//   }

//   greet() {
//     let formatString = getFormat(this, "greeting");
//     return formatString.replace("%s", this.greeting);
//   }
// }

// const g1 = new Greeter1("This is a message")
// console.log(g1.greet())


// interface CatInstance {
//   name: string;
//   meow(): void;
// }

// interface CatConstructor {
//   new (name: string): CatInstance;
//   prototype: CatInstance;
// }

// const Cat: CatConstructor = function (this: CatInstance, name: string) {
//   this.name = name;
// } as any

// Object.defineProperty(Cat.prototype, "meow", {
//   value: function (this: CatInstance) {
//     console.log(this.name);
//   },
//   enumerable: false,
//   configurable: true,
//   writable: true,
// });

// const cat = new Cat("Jerry");

// cat.meow();

// function readonly(target:any, key: string, descriptor: PropertyDescriptor){
//     console.log({target, key, descriptor})
//     descriptor.writable = false
//     return descriptor
// }

// class Cat{
//     constructor(private name: string){}
//     @readonly
//     meow(){
//         console.log(`Hello ${this.name}`)
//     }
// }

// const tom = new Cat("Tom")
// tom.meow()

// function MinLength(len: number){
//     return function(target: any, propertyKey: string){
//         /**
//          * This mean on the map object creation set key as minLenght,
//          * value as len, and then do target which is object and set property as propertyKey
//          * target[propertyKey] = len
//          * 
//          * store['minLength'] = target 
//          */
//         Reflect.defineMetadata(`minLength`, len, target, propertyKey)
//     }
// }

// class Employee{

//     @MinLength(5)
//     private name: string;

//     constructor(
//         name: string, 
//         role: string
//     ){
//         this.name = name
//         Reflect.defineMetadata("role", role, this)
//         if(!this.validate()){
//             throw new Error(`Invalid length for name`)
//         }
//     }

//     //@Reflect.metadata("role", "admin")
//     getName(){
//         return this.name
//     }

//     getRole(): string{
//         return Reflect.getMetadata("role", this)
//     }

//     removeRole(){
//         return Reflect.deleteMetadata("role", this)
//     }

//     hasRole(): boolean{
//         return Reflect.hasMetadata("role", this)
//     }

//     validate(){
//         const minLenght = Reflect.getMetadata("minLength", this, "name")

//         return this.name.length >= minLenght
//     }
// }

// class EmployeeFactory{
//     static create(role: string, name: string): Employee{
//         const emp = new Employee(name)
//         Reflect.defineMetadata("role", role, emp)
//         return emp
//     }
// }

// function getEmployeeRole(emp: Employee){
//     return Reflect.getMetadata("role", emp)
// }

// const emp = new Employee("Ade")
// console.log(emp.getName())
// //Reflect.defineMetadata("role", "admin", emp,)

// console.log(Reflect.getMetadata("role", emp, "getName"))
// //console.log((emp as any).role)

// const sheldon = new Employee("Sheldon", "admin")
// const leonard = new Employee("Leonard", "moderator")
//const empty = new Employee("", "")

//console.log(sheldon.getName(), sheldon.getRole())
//console.log(leonard.getName(), leonard.getRole())
//console.log("Remove Sheldon role",sheldon.removeRole())
//console.log("Get sheldon role afer removal",sheldon.getRole())
//console.log("Check if sheldon has role afer removal",sheldon.hasRole())
//console.log("Check if leonard has role",leonard.hasRole())

// function Role(role: string): ClassDecorator{
//     return function(target:any){
//         Reflect.defineMetadata("role", role, target)
//     }
// }

// @Role("admin")
// class AdminPanel{
//     getSettings(){
//         return {
//             sendNotification:true
//         }
//     }
// }

// function canAccessAdminPanel(emp: Employee){
//     const empRole = Reflect.getMetadata("role", emp)
//     const panelRole = Reflect.getMetadata("role", AdminPanel)
//     console.log(panelRole)
//     return empRole === panelRole
// }

// console.log(canAccessAdminPanel(sheldon), canAccessAdminPanel(leonard))

//import "./decorator/clazz-decorator"
//import "./decorator/parameter-decorator"
// import { Math } from "./decorator/method-decorator";
// const result1 = Math.add(1,1)
// const result2 = Math.multiply(2,2)
// console.log(Math.multiply(2,2))

//import {main} from "./decorator/dependency-injection"

//main.init()

//import { main } from "./exercise/clazz"

//main()

import {DecoratorMain} from "./exercise/decorator"

DecoratorMain()