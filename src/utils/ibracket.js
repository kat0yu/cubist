import Movrackets from "./movrackets.js";

export default class Ibracket {
  #line; #exponent;
  constructor ({line, exponent}) {
    if (!(line instanceof Movrackets)) {throw TypeError();}
    this.#line = line;
    this.#exponent = exponent;
  }

  repeat (count) {
    return new Ibracket({line: this.#line, exponent: this.#exponent * count});
  }

  isMinimum () {
    return this.#line.length == 1;
  }
  outerLine () {
    return this.#line.repeat(this.#exponent);
  }

  innerMinusExponent () {
    if (this.#exponent < 0) {
      return new Ibracket({line: this.#line.repeat(-1), exponent: this.#exponent * -1});
    } else {
      return new Ibracket({line: this.#line, exponent: this.#exponent});
    }
  }
  linise ({depth = 0} = {}) {
    return this.#line.repeat(this.#exponent).linise({depth});
  }

  applyFunctionToMovracket (func) {
    return new Ibracket({line: func(this.#line), exponent: this.#exponent});
  }

  toString () {
    return `(${this.#line.toString()})${this.#exponent<0? "'": ""}${Math.abs(this.#exponent)!=1? Math.abs(this.#exponent): ""}`;
  }
}