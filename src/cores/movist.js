import Movunit from "../utils/movunit.js";
import Group from "../utils/group.js";
import Conjugator from "../utils/conjugator.js";
import Commutator from "../utils/commutator.js";
import MoveArray from "../utils/movearray.js";

export default class Movist {
  #original;
  #normal;
  #simple;
  #line;
  constructor (text) {
    this.#original = Movist.#makeMoveArrayFromText(text);
    this.#normal = this.#original.copy().normalize();
    this.#simple = this.#original.copy().simplize();
    this.#line = this.#original.copy().linise();
  }

  get original () {return Movist.#stringify(this.#original);}
  get normal () {return Movist.#stringify(this.#normal);}
  get simple () {return Movist.#stringify(this.#simple);}
  get line () {return Movist.#stringify(this.#line);}
  get array () {return this.#line;}

  static #makeMoveArrayFromText (text, {original = text, relative = 0} = {}) {
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

        movrackets.push(Movist.#makeMovunitFromText(movunit));
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

        movrackets.push(Movist.#makeMovunitFromText(movunit));
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

        movrackets.push(new Commutator({
          lines: [
            Movist.#makeMoveArrayFromText(left),
            Movist.#makeMoveArrayFromText(right)
          ],
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

        movrackets.push(new Conjugator({
          lines: [
            Movist.#makeMoveArrayFromText(left),
            Movist.#makeMoveArrayFromText(right)
          ],
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

        movrackets.push(new Group({
          lines: [Movist.#makeMoveArrayFromText(line)],
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
  static #makeMovunitFromText (text) {
    return new Movunit({
      axis: (new RegExp("[FBSz]").test(text))? 0: ((new RegExp("[RLMx]").test(text))? 1: 2),
      width: (new RegExp("[xyz]").test(text))? 3: ((new RegExp("w").test(text))? 2: 1),
      start: (new RegExp("[FRUxyz]").test(text))? 0: ((new RegExp("([BLD]w|[SME])").test(text))? 1: 2),
      times: ((new RegExp("[BLDSM]").test(text))? -1: 1) * (new RegExp("'").test(text)? -1: 1) * (new RegExp("2").test(text)? 2: 1)
    });
  }

  static #stringify (moves) {
    return moves.map(move => Movist.#stringifyMove(move)).join(" ");
  }
  static #stringifyMove (move) {
    if (move.isMovunit()) {return Movist.#stringifyMovunit(move);}
    else if (move.isBracket() && move.isGroup()) {return Movist.#stringifyGroup(move);}
    else if (move.isBracket() && move.isConjugator()) {return Movist.#stringifyConjugator(move);}
    else if (move.isBracket() && move.isCommutator()) {return Movist.#stringifyCommutator(move);}
  }
  static #stringifyMovunit (movunit) {
    const character = [
      ,
      [["F","S","B"], ["R","M","L"], ["U","E","D"]],
      [["Fw","Bw"], ["Rw","Lw"], ["Uw","Dw"]],
      [["z"],["x"],["y"]]
    ][movunit.width][movunit.axis][movunit.start];

    const xor = (bool1, bool2) => (bool1 != bool2);
    const isReversed = (character) => (["B","Bw","L","Lw","D","Dw","S","M"].includes(character));
    const prime = xor(movunit.times<0, isReversed(character))? "'": "";

    const abs = Math.abs(movunit.times);
    const exp = abs != 1? abs: "";
    
    return `${character}${prime}${exp}`;
  }
  static #stringifyBracket (bracket, stringify) {
    const lines = bracket.lines.map(line => Movist.#stringify(line));
    const prime = bracket.exponent<0? "'": "";
    const abs = Math.abs(bracket.exponent);
    const exp = abs!=1? abs: "";
    return stringify({lines, prime, exp});
  }
  static #stringifyGroup (group) {
    return Movist.#stringifyBracket(group, ({lines, prime, exp}) => `(${lines[0]})${prime}${exp}`);
  }
  static #stringifyConjugator (Conjugator) {
    return Movist.#stringifyBracket(Conjugator, ({lines, prime, exp}) => `{${lines[0]}, ${lines[1]}}${prime}${exp}`);
  }
  static #stringifyCommutator (commutator) {
    return Movist.#stringifyBracket(commutator, ({lines, prime, exp}) => `[${lines[0]}, ${lines[1]}]${prime}${exp}`);
  }
}