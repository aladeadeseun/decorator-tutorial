function Cat(this: any, name: string) {
    this.name = name;
    Object.assign(this, Cat.prototype)
}

Object.defineProperty(Cat, "meow", {
    value: function () {
        console.log("Meow");
    },
});

Object.defineProperty(Cat, "sleep",{
    value:function () {
        console.log("Sleep")
    }
})

Cat.prototype.sayHello = function(){
    console.log("Hello world", this.name)
}

function bind(func:Function, thisVal:any){
    return function(...args:any[]){
        func.apply(thisVal, args)
    }
}

interface Card {
  suit: string;
  card: number;
}
 
interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  // NOTE: The function now explicitly specifies that its callee must be of type Deck
  createCardPicker: function (this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);
 
      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  },
};

class User{
    
    constructor(private _name: string){
        /**
         * The main difference is that Object.freeze() makes an object completely immutable 
         * (no changes allowed), whereas Object.seal() only prevents adding or removing properties, 
         * still allowing you to change the values of existing ones
         */
        /**
         * To make an object created from a class immutable, call Object.freeze(this) 
         * inside the class constructor. This ensures that once an instance is created, 
         * its properties cannot be changed, added, or deleted.
         */
        Object.freeze(this)

        /**
         * You can also freeze the class itself to prevent anyone from adding new 
         * static methods or properties to it after it is defined.
         */
        Object.freeze(User)

        /**
         * The Object.seal() static method seals an object. Sealing an object prevents extensions and makes 
         * existing properties non-configurable. A sealed object has a fixed set of properties: new properties 
         * cannot be added, existing properties cannot be removed, their enumerability and configurability 
         * cannot be changed, and its prototype cannot be re-assigned. Values of existing properties can 
         * still be changed as long as they are writable. seal() returns the same object that was passed in.
         */
        Object.seal(User)
        Object.seal(User.prototype)
    }

    // Getter only
    get name() {
        return this._name;
    }

    login(){}
    logout(){}
}

export function main(){
    (Cat as any).meow();
    (Cat as any).sleep();
    
    const cat:any = {}
    
    Cat.call(cat, "Tom")
    console.log(cat)

    //console.log((cat as any).sayHello())

    //for(const g in Object.getOwnPropertyDescriptor) console.log(g)
    console.log(Object.getOwnPropertyDescriptor(Cat, "sleep"))
    console.log(Object.getOwnPropertyNames(Cat))
    
    cat.sayHello()
    //(cat as any).sayHello()

    let cardPicker = deck.createCardPicker();
    let pickedCard = cardPicker();
    
    console.log("card: " + pickedCard.card + " of " + pickedCard.suit);

    const user = new User("Akin")
    console.log(user.name)
}
