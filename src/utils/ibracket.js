import Bracket from "./bracket.js";
import MoveArray from "./movearray.js";

export default class Ibracket extends Bracket {
  constructor ({lines, exponent}) {
    if (lines.length != 1) {throw Error();}

    super({lines, exponent});
  }

  conjugate () {
    this.lines[0] = this.lines[0].reverse();
    this.exponent *= -1;
    return this;
  }

  linise ({depth = 0} = {}) {
    return this.lines[0].repeat(this.exponent).linise({depth});
  }

  isMinimum () {
    return this.lines[0].length == 1;
  }
  outerLine () {
    return this.lines[0].repeat(this.exponent);
  }

  toString () {
    const line = this.lines[0].toString();
    const prime = this.exponent < 0? "'": "";
    const abs = Math.abs(this.exponent);
    return `(${line})${prime}${abs}`;
  }
}