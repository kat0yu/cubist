import Movunit from "../utils/movunit.js";
import Ibracket from "../utils/ibracket.js";
import Vbracket from "../utils/vbracket.js";
import Nbracket from "../utils/nbracket.js";
import MoveArray from "../utils/movearray.js";

export default class Movist {
  constructor (text) {
    function recursion (text, {original = text, relative = 0} = {}) {
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
            lines: [
              recursion(left),
              recursion(right)
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

          movrackets.push(new Vbracket({
            lines: [
              recursion(left),
              recursion(right)
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

          movrackets.push(new Ibracket({
            lines: [recursion(line)],
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

    this.original = recursion(text);
  }
}