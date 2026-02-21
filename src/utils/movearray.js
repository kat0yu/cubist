import Movunit from "./movunit.js";
import Nbracket from "./nbracket.js";
import Vbracket from "./vbracket.js";
import Ibracket from "./ibracket.js";

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
      .innerMinusExponent()
      .spliceMinimumIbracket()
      .spliceMostOutsideIbracket()
      .linise({depth: 1});
  }

  spliceMostOutsideIbracket () {
    if (this.length == 1 && (this[0] instanceof Ibracket)) {
      return this[0].outerLine();
    } else {
      return this;
    }
  }
  spliceMinimumIbracket () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket instanceof Nbracket || movracket instanceof Vbracket) {
        movrackets.push(movracket.applyFunctionToMovracket(MoveArray.spliceMinimumIbracket));
      }
      else if (movracket instanceof Ibracket && movracket.isMinimum()) {
        movrackets.concat(movracket.applyFunctionToMovracket(MoveArray.spliceMinimumIbracket).outerLine());
      }
      else if (movracket instanceof Ibracket) {
        movrackets.push(movracket.applyFunctionToMovracket(MoveArray.spliceMinimumIbracket));
      }
      else if (movracket instanceof Movunit) {
        movrackets.push(movracket);
      }
    }
    return movrackets;
  }
  static spliceMinimumIbracket (argumentMovrackets) {
    return argumentMovrackets.spliceMinimumIbracket();
  }
  innerMinusExponent () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket instanceof Nbracket || movracket instanceof Vbracket || movracket instanceof Ibracket) {
        movrackets.push(movracket.innerMinusExponent().applyFunctionToMovracket(MoveArray.innerMinusExponent));
      }
      else if (movracket instanceof Movunit) {
        movrackets.push(movracket);
      }
    }
    return movrackets;
  }
  static innerMinusExponent (argumentMovrackets) {
    return argumentMovrackets.innerMinusExponent();
  }
  iriseNVbrackets () {
    let movrackets = new MoveArray();
    for (let movracket of this) {
      if (movracket instanceof Nbracket || movracket instanceof Vbracket) {
        movrackets.push(movracket.applyFunctionToMovracket(MoveArray.iriseNVbrackets).toIbracket());
      }
      else if (movracket instanceof Ibracket) {
        movrackets.push(movracket.applyFunctionToMovracket(MoveArray.iriseNVbrackets));
      }
      else if (movracket instanceof Movunit) {
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
        if (movracket instanceof Nbracket || movracket instanceof Vbracket || movracket instanceof Ibracket) {
          movrackets = movrackets.concat(movracket.linise({depth: depth - 1}));
        }
        else if (movracket instanceof Movunit) {
          movrackets.push(movracket);
        }
      }
      return movrackets;
    }
  }

  static makeMovracketsFromText (text, {original = text, relative = 0} = {}) {
    let characters = text.split("");
    let movrackets = new MoveArray();
    let i = 0;

    const mark = (text, indexs) => {
      let result = text;
      for (let i in indexs) {
        result = result.slice(0,indexs[i]+Number(i)) + "^" + result.slice(indexs[i]+Number(i),indexs[i]+Number(i)+1) + "^" + result.slice(indexs[i]+Number(i)+1);
      }
      return result;
    };

    while (i < characters.length) {
      if (new RegExp("[FRUBLD]").test(characters[i])) {
        let movunit = characters[i];

        i++;
        if (new RegExp("w").test(characters[i])) {
          movunit += characters[i];
          i++;
        }
        if (new RegExp("'").test(characters[i])) {
          movunit += characters[i];
          i++;
        }
        if (new RegExp("2").test(characters[i])) {
          movunit += characters[i];
          i++;
        }

        movrackets.push(Movunit.makeMovunitFromText(movunit));
      }
      else if (new RegExp("[SMExyz]").test(characters[i])) {
        let movunit = characters[i];

        i++;
        if (new RegExp("'").test(characters[i])) {
          movunit += characters[i];
          i++;
        }
        if (new RegExp("2").test(characters[i])) {
          movunit += characters[i];
          i++;
        }

        movrackets.push(Movunit.makeMovunitFromText(movunit));
      }
      else if (new RegExp("[\[]").test(characters[i])) {
        const leftIndex = i;
        let left = "";
        let right = "";
        let depth = 0;

        i++
        while (true) {
          if (depth == 0 && new RegExp(",").test(characters[i])) {
            i++;
            break;
          }
          else if (new RegExp("[[{(]").test(characters[i])) {
            depth += 1;
          }
          else if (new RegExp("[\\]})]").test(characters[i])) {
            depth -= 1;
          }

          left += characters[i];
          i++;
          if (i >= characters.length) {
            throw SyntaxError(`same depth "," is not found after "[". (full text = "${mark(original, [relative+leftIndex])}")`);
          }
        }
        const midIndex = i;
        while (true) {
          if (depth == 0 && new RegExp("]").test(characters[i])) {
            i++;
            break;
          }
          else if (new RegExp("[[{(]").test(characters[i])) {
            depth += 1;
          }
          else if (new RegExp("[\\]})]").test(characters[i])) {
            depth -= 1;
          }

          right += characters[i];
          i++;
          if (i >= characters.length) {
            throw SyntaxError(`same depth "]" is not found after "[" & ",". (full text = "${mark(original, [relative+leftIndex, relative+midIndex])}")`);
          }
        }

        let exponent = 1;
        if (new RegExp("'").test(characters[i])) {
          exponent = -1;
          i++;
        }
        if (new RegExp("[2-9]").test(characters[i])) {
          exponent = exponent * characters[i]
          i++;
          while (new RegExp("[0-9]").test(characters[i])) {
            exponent = 10 * exponent + characters[i]
            i++;
          }
        }

        movrackets.push(new Nbracket({
          left: this.makeMovracketsFromText(left),
          right: this.makeMovracketsFromText(right),
          exponent
        }));
      }
      else if (new RegExp("{").test(characters[i])) {
        const leftIndex = i;
        let left = "";
        let right = "";
        let depth = 0;

        i++
        while (true) {
          if (depth == 0 && new RegExp(",").test(characters[i])) {
            i++;
            break;
          }
          else if (new RegExp("[[{(]").test(characters[i])) {
            depth += 1;
          }
          else if (new RegExp("[\\]})]").test(characters[i])) {
            depth -= 1;
          }

          left += characters[i];
          i++;
          if (i >= characters.length) {
            throw SyntaxError(`same depth "," is not found after "{". (full text = "${mark(original, [relative+leftIndex])}")`);
          }
        }
        const midIndex = i;
        while (true) {
          if (depth == 0 && new RegExp("}").test(characters[i])) {
            i++;
            break;
          }
          else if (new RegExp("[[{(]").test(characters[i])) {
            depth += 1;
          }
          else if (new RegExp("[\\]})]").test(characters[i])) {
            depth -= 1;
          }

          right += characters[i];
          i++;
          if (i >= characters.length) {
            throw SyntaxError(`same depth "}" is not found after "{" & ",". (full text = "${mark(original, [relative+leftIndex, relative+midIndex])}")`);
          }
        }

        let exponent = 1;
        if (new RegExp("'").test(characters[i])) {
          exponent = -1;
          i++;
        }
        if (new RegExp("[2-9]").test(characters[i])) {
          exponent = exponent * characters[i]
          i++;
          while (new RegExp("[0-9]").test(characters[i])) {
            exponent = 10 * exponent + characters[i]
            i++;
          }
        }

        movrackets.push(new Vbracket({
          left: this.makeMovracketsFromText(left),
          right: this.makeMovracketsFromText(right),
          exponent
        }));
      }
      else if (new RegExp("\\(").test(characters[i])) {
        const leftIndex = i;
        let line = "";
        let depth = 0;

        i++
        while (true) {
          if (depth == 0 && new RegExp("\\)").test(characters[i])) {
            i++;
            break;
          }
          else if (new RegExp("[[{(]").test(characters[i])) {
            depth += 1;
          }
          else if (new RegExp("[\\]})]").test(characters[i])) {
            depth -= 1;
          }

          line += characters[i];
          i++;
          if (i >= characters.length) {
            throw SyntaxError(`same depth "," is not found after "{". (full text = "${mark(original, [relative+leftIndex])}")`);
          }
        }

        let exponent = 1;
        if (new RegExp("'").test(characters[i])) {
          exponent = -1;
          i++;
        }
        if (new RegExp("[2-9]").test(characters[i])) {
          exponent = exponent * characters[i]
          i++;
          while (new RegExp("[0-9]").test(characters[i])) {
            exponent = 10 * exponent + characters[i]
            i++;
          }
        }

        movrackets.push(new Ibracket({
          line: this.makeMovracketsFromText(line),
          exponent
        }));
      }
      // space
      else if (characters[i] == " ") {
        i++;
      }
      // erroring
      else if (new RegExp("w").test(characters[i])) {
        throw SyntaxError(`syntax "${characters[i]}" position is wrong. restricted [FRUBLD]w?. (full text = "${mark(original, [relative+i])}")`);
      }
      else if (new RegExp("['2]").test(characters[i])) {
        throw SyntaxError(`syntax "${characters[i]}" position is wrong. restricted ([FRUBLD]w?|[SMExyz])'?2?. (full text = "${mark(original, [relative+i])}")`);
      }
      else if (new RegExp("[0-9]").test(characters[i])) {
        throw SyntaxError(`syntax "${characters[i]}" position is wrong. restricted ([~]|{~}|(~))'?([2-9][0-9]*)?. (full text = "${mark(original, [relative+i])}")`);
      }
      else if (new RegExp("[,\\]})]").test(characters[i])) {
        throw SyntaxError(`syntax "${characters[i]}" is declared before "${{"]": "[", "}": "{", ")": "("}[characters[i]]}". (full text = "${mark(original, [relative+i])}")`);
      }
      else {
        throw SyntaxError(`syntax "${characters[i]}" is ANACCEPTABLE. (full text = "${mark(original, [relative+i])}")`);
      }
    }

    return movrackets;
  }
  toString () {
    let text = "";
    for (let movracket of this) {
      text += ` ${movracket.toString()}`;
    }

    return text.slice(1);
  }
}