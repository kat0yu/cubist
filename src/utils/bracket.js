import MoveArray from "./movearray.js";

export default class Bracket {
  constructor ({lines, exponent}) {
    if (!(lines.every(line => line instanceof MoveArray))) {throw TypeError();}

    this.lines = lines;
    this.exponent = exponent;
  }

  repeat (count) {
    this.exponent *= count;
    return this;
  }
  reverse = (bool = true) => (!bool? this: this.repeat(-1));

  conjugate () {}
  normalize = () => (this.exponent >= 0? this: this.conjugate());
  linise ({depth = 0} = {}) {}
  
  apply (func) {
    this.lines = this.lines.map(line => func(line));
    return this;
  }
  
  toString () {}
}