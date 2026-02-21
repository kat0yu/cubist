export default class Bracket {
  constructor ({lines, exponent}) {
    // if (!(lines.every(line => line instanceof MoveArray))) {throw TypeError();}

    this.lines = lines;
    this.exponent = exponent;
  }

  isMovunit () {return false;}
  isBracket () {return true;}
  isIbracket () {return false;}
  isVbracket () {return false;}
  isNbracket () {return false;}

  repeat (count) {
    this.exponent *= count;
    return this;
  }
  reverse (bool = true) {
    return !bool? this: this.repeat(-1);
  }

  conjugate () {}
  normalize = () => {
    return this.exponent >= 0? this: this.conjugate();
  }
  linise ({depth = 0} = {}) {}
  
  apply (func) {
    this.lines = this.lines.map(line => func(line));
    return this;
  }
  
  toString () {}
}