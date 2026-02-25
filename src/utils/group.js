export default class Group {
  constructor ({lines, exponent}) {
    if (lines.length != 1) {throw Error();}

    this.lines = lines;
    this.exponent = exponent;
  }

  isMovunit () {return false;}
  isBracket () {return true;}
  isGroup () {return true;}
  isConjugator () {return false;}
  isCommutator () {return false;}

  copy () {
    return new Group({
      lines: this.lines.map(line => line.copy()),
      exponent: this.exponent
    });
  }

  toGroup () {return this;}

  repeat (count) {
    this.exponent *= count;
    return this;
  }
  reverse (bool = true) {
    return !bool? this: this.repeat(-1);
  }

  conjugate () {
    this.lines[0] = this.lines[0].reverse();
    this.exponent *= -1;
    return this;
  }
  normalize () {
    return this.exponent >= 0? this: this.conjugate();
  }

  linise ({depth = 0} = {}) {
    if (this.exponent == 1) {return this.lines[0].linise();}
    return this.lines[0].repeat(this.exponent).linise({depth});
  }

  isMinimum () {
    return this.lines[0].length == 1;
  }
  
  apply (func) {
    this.lines = this.lines.map(line => func(line));
    return this;
  }
}