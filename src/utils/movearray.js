export default class MoveArray extends Array {
  concat (movearray) {
    for (let move of movearray) {
      this.push(move.copy());
    }
    return this;
  }

  repeat (count) {
    if (count < 0) {return this.inverse().repeat(count * -1);}
    const copied = this.copy();
    for (let i = 1; i < count; i++) {
      this.concat(copied);
    }
    return this;
  }
  inverse (bool = true) {
    return this.reverse().map(move => move.inverse(bool));
  }

  copy () {
    return new MoveArray(...(this.map(move => move.copy())));
  }

  simplize () {
    return this
      .iriseNVbrackets()
      .normalize()
      .spliceMinimumGroup()
      .spliceMostOutsideGroup()
      .linise({depth: 1});
  }

  spliceMostOutsideGroup () {
    if (this.length == 1 && this[0].isBracket() && this[0].isGroup() && this[0].exponent == 1) {
      return this[0].lines[0];
    } else {
      return this;
    }
  }
  spliceMinimumGroup () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket.isBracket()) {
        if (movracket.isCommutator() || movracket.isConjugator()) {
          movrackets.push(movracket.apply((line) => line.spliceMinimumGroup()));
        }
        else if (movracket.isGroup() && movracket.isMinimum()) {
          movrackets = movrackets.concat(movracket.apply((line) => line.spliceMinimumGroup()).linise());
        }
        else if (movracket.isGroup()) {
          movrackets.push(movracket.apply((line) => line.spliceMinimumGroup()));
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
        movrackets.push(movracket.apply((line) => line.iriseNVbrackets()).toGroup());
      }
      else if (movracket.isBracket() && movracket.isGroup()) {
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