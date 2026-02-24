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
    if (this.length == 1 && this[0].isBracket() && this[0].isIbracket() && this[0].exponent == 1) {
      return this[0].lines[0];
    } else {
      return this;
    }
  }
  spliceMinimumIbracket () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket.isBracket()) {
        if (movracket.isCommutator() || movracket.isConjugator()) {
          movrackets.push(movracket.apply((line) => line.spliceMinimumIbracket()));
        }
        else if (movracket.isIbracket() && movracket.isMinimum()) {
          movrackets = movrackets.concat(movracket.apply((line) => line.spliceMinimumIbracket()).linise());
        }
        else if (movracket.isIbracket()) {
          movrackets.push(movracket.apply((line) => line.spliceMinimumIbracket()));
        }
      } else if (movracket.isMovunit()) {
        movrackets.push(movracket);
      }
    }
    return movrackets;
  }
  normalize () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket.isBracket()) {
        movrackets.push(movracket.normalize().apply((line) => line.normalize()));
      }
      else if (movracket.isMovunit()) {
        movrackets.push(movracket);
      }
    }
    return movrackets;
  }
  iriseNVbrackets () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket.isBracket() && (movracket.isCommutator() || movracket.isConjugator())) {
        movrackets.push(movracket.apply((line) => line.iriseNVbrackets()).toIbracket());
      }
      else if (movracket.isBracket() && movracket.isIbracket()) {
        movrackets.push(movracket.apply((line) => line.iriseNVbrackets()));
      }
      else if (movracket.isMovunit()) {
        movrackets.push(movracket);
      }
    }
    return movrackets;
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
}