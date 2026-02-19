import Ibracket from "./ibracket.js";
import Movrackets from "./movrackets.js";

export default class Vbracket {
  #left; #right; #exponent;
  constructor ({left, right, exponent}) {
    if (!(left instanceof Movrackets)) {throw TypeError();}
    if (!(right instanceof Movrackets)) {throw TypeError();}
    this.#left = left;
    this.#right = right;
    this.#exponent = exponent;
  }

  exponent (exponent) {
    return new Vbracket({left: this.#left, right: this.#right, exponent: this.#exponent * exponent});
  }

  toIbracket () {
    return new Ibracket({
      line: new Movrackets({movrackets: [new Ibracket({line: this.#left, exponent: 1}), new Ibracket({line: this.#right, exponent: 1}), new Ibracket({line: this.#left, exponent: -1})]}),
      exponent: this.#exponent
    });
  }

  innerMinusExponent () {
    if (this.#exponent < 0) {
      return new Vbracket({left: this.#left, right: this.#right.exponent(-1), exponent: this.#exponent * -1});
    } else {
      return new Vbracket({left: this.#left, right: this.#right, exponent: this.#exponent});
    }
  }
  linise ({depth = 0} = {}) {
    return this.toIbracket().linise({depth});
  }
  
  applyFunctionToMovracket (func) {
    return new Vbracket({left: func(this.#left), right: func(this.#right) , exponent: this.#exponent});
  }

  toString () {
    return `{${this.#left.toString()}, ${this.#right.toString()}}${this.#exponent<0? "'": ""}${Math.abs(this.#exponent)!=1? Math.abs(this.#exponent): ""}`;
  }
}