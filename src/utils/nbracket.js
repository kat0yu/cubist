import Ibracket from "./ibracket.js";
import Vbracket from "./vbracket.js";
import MoveArray from "./movearray.js";

export default class Nbracket extends Vbracket {
  isVbracket () {return false;}
  isNbracket () {return true;}

  toIbracket () {
    return new Ibracket({
      lines: [new MoveArray(
        new Ibracket({lines: [this.lines[0]], exponent: 1}),
        new Ibracket({lines: [this.lines[1]], exponent: 1}),
        new Ibracket({lines: [this.lines[0]], exponent: -1}),
        new Ibracket({lines: [this.lines[1]], exponent: -1})
      )],
      exponent: this.exponent
    });
  }

  conjugate () {
    this.lines[0] = this.lines[0].reverse();
    this.lines[1] = this.lines[1].reverse();
    this.exponent *= -1;
    return this;
  }
}