export default class MoveArray extends Array {
  repeat (count) {
    let movrackets = new MoveArray();
    for (let time = 0; time < Math.abs(count); time++) {
      if (count > 0) {
        for (let mov of this) {
          movrackets.push(mov);
        }
      } else {
        for (let mov of this.reverse()) {
          movrackets.push(mov);
        }
      }
    }
    return movrackets;
  }
  reverse () {
    let movs = new MoveArray();
    for (let i=this.length-1; i>=0; i--) {
      movs.push(this[i].repeat(-1));
    }
    return movs;
  }

  simplize () {
    return this
      .iriseNVbrackets()
      .normalize()
      .spliceMinimumIbracket()
      .spliceMostOutsideIbracket()
      .linise({depth: 1});
  }

  spliceMostOutsideIbracket () {
    if (this.length == 1 && (this[0].isIbracket())) {
      return this[0].outerLine();
    } else {
      return this;
    }
  }
  spliceMinimumIbracket () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket.isBracket()) {
        if (movracket.isNbracket() || movracket.isVbracket()) {
          movrackets.push(movracket.apply(MoveArray.spliceMinimumIbracket));
        }
        else if (movracket.isIbracket() && movracket.isMinimum()) {
          movrackets.concat(movracket.apply(MoveArray.spliceMinimumIbracket).outerLine());
        }
        else if (movracket.isIbracket()) {
          movrackets.push(movracket.apply(MoveArray.spliceMinimumIbracket));
        }
      } else if (movracket.isMovunit()) {
        movrackets.push(movracket);
      }
    }
    return movrackets;
  }
  static spliceMinimumIbracket (argumentMovrackets) {
    return argumentMovrackets.spliceMinimumIbracket();
  }
  normalize () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket.isBracket()) {
        movrackets.push(movracket.normalize().apply(MoveArray.normalize));
      }
      else if (movracket.isMovunit()) {
        movrackets.push(movracket);
      }
    }
    return movrackets;
  }
  static normalize (argumentMovrackets) {
    return argumentMovrackets.normalize();
  }
  iriseNVbrackets () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket.isBracket() && (movracket.isNbracket() || movracket.isVbracket())) {
        movrackets.push(movracket.apply(MoveArray.iriseNVbrackets).toIbracket());
      }
      else if (movracket.isBracket() && movracket.isIbracket()) {
        movrackets.push(movracket.apply(MoveArray.iriseNVbrackets));
      }
      else if (movracket.isMovunit()) {
        movrackets.push(movracket);
      }
    }
    return movrackets;
  }
  static iriseNVbrackets (argumentMovrackets) {
    return argumentMovrackets.iriseNVbrackets();
  }
  linise ({depth = 0} = {}) {
    if (depth > 0) {
      return this;
    }
    else {
      let movrackets = new MoveArray();
      for (let movracket of this) {
        if (movracket.isBracket()) {
          movrackets = movrackets.concat(movracket.linise({depth: depth - 1}));
        }
        else if (movracket.isMovunit()) {
          movrackets.push(movracket);
        }
      }
      return movrackets;
    }
  }

  toString = () => (this.map(mov => mov.toString()).join(" "));
}