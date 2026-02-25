import Group from "./group.js";
import MoveArray from "./movearray.js";

export default class Conjugator {
  constructor ({lines, exponent}) {
    if (lines.length != 2) {throw Error();}

    this.lines = lines;
    this.exponent = exponent;
  }

  isMovunit () {return false;}
  isBracket () {return true;}
  isGroup () {return false;}
  isConjugator () {return true;}
  isCommutator () {return false;}

  copy () {
    return new Conjugator({
      lines: this.lines.map(line => line.copy()),
      exponent: this.exponent
    });
  }

  repeat (count) {
    this.exponent *= count;
    return this;
  }
  reverse (bool = true) {
    return !bool? this: this.repeat(-1);
  }

  toGroup () {
    return new Group({
      lines: [new MoveArray(
        new Group({lines: [this.lines[0]], exponent: 1}),
        new Group({lines: [this.lines[1]], exponent: 1}),
        new Group({lines: [this.lines[0].copy()], exponent: -1})
      )],
      exponent: this.exponent
    });
  }

  conjugate () {
    this.lines[1] = this.lines[1].reverse();
    this.exponent *= -1;
    return this;
  }
  normalize () {
    return this.exponent >= 0? this: this.conjugate();
  }
  linise ({depth = 0} = {}) {
    return this.toGroup().linise({depth});
  }
  
  apply (func) {
    this.lines = this.lines.map(line => func(line));
    return this;
  }
}