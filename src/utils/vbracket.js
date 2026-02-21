import Bracket from "./bracket.js";
import Ibracket from "./ibracket.js";
import MoveArray from "./movearray.js";

export default class Vbracket extends Bracket {
  constructor ({lines, exponent}) {
    if (lines.length != 2) {throw Error();}

    super({lines, exponent});
  }

  isVbracket () {return true;}

  toIbracket () {
    return new Ibracket({
      lines: [new MoveArray(
        new Ibracket({lines: [this.lines[0]], exponent: 1}),
        new Ibracket({lines: [this.lines[1]], exponent: 1}),
        new Ibracket({lines: [this.lines[0]], exponent: -1})
      )],
      exponent: this.exponent
    });
  }

  conjugate () {
    this.lines[1] = this.lines[1].reverse();
    this.exponent *= -1;
    return this;
  }
  linise ({depth = 0} = {}) {
    return this.toIbracket().linise({depth});
  }

  toString () {
    const left = this.lines[0].toString();
    const right = this.lines[1].toString();
    const prime = this.exponent < 0? "'": "";
    const abs = Math.abs(this.exponent);
    return `{${left}, ${right}}${prime}${abs}`;
  }
}