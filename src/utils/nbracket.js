import Ibracket from "./ibracket.js";
import MoveArray from "./movearray.js";

export default class Nbracket {
  #left; #right; #exponent;
  constructor ({left, right, exponent}) {
    if (!(left instanceof MoveArray)) {throw TypeError();}
    if (!(right instanceof MoveArray)) {throw TypeError();}
    this.#left = left;
    this.#right = right;
    this.#exponent = exponent;
  }

  repeat (count) {
    return new Nbracket({left: this.#left, right: this.#right, exponent: this.#exponent * count});
  }

  toIbracket () {
    return new Ibracket({
      line: new MoveArray(
        new Ibracket({line: this.#left, exponent: 1}),
        new Ibracket({line: this.#right, exponent: 1}),
        new Ibracket({line: this.#left, exponent: -1}),
        new Ibracket({line: this.#right, exponent: -1})
      ),
      exponent: this.#exponent
    });
  }

  innerMinusExponent () {
    if (this.#exponent < 0) {
      return new Nbracket({left: this.#right.repeat(-1), right: this.#left.repeat(-1), exponent: this.#exponent * -1});
    } else {
      return new Nbracket({left: this.#left, right: this.#right, exponent: this.#exponent});
    }
  }
  linise ({depth = 0} = {}) {
    return this.toIbracket().linise({depth});
  }
  
  applyFunctionToMovracket (func) {
    return new Nbracket({left: func(this.#left), right: func(this.#right) , exponent: this.#exponent});
  }

  toString () {
    return `[${this.#left.toString()}, ${this.#right.toString()}]${this.#exponent<0? "'": ""}${Math.abs(this.#exponent)!=1? Math.abs(this.#exponent): ""}`;
  }
}