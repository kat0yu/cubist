import Face from "./face.js";
import Cell from "./cell.js";

export default class Sticker {
  #face; #cell;
  constructor ({face, cell}) {
    if (!(face instanceof Face)) {throw TypeError();}
    if (!(cell instanceof Cell)) {throw TypeError();}

    this.#face = face;
    this.#cell = cell;
  }

  getFace () {
    return this.#face;
  }

  getName () {
    const secondThird = [
      [this.#face.getSecond().toString(), "", this.#face.getSecond().getOpposite().toString()][this.#cell.getColumn()],
      [this.#face.getThird().toString(), "", this.#face.getThird().getOpposite().toString()][this.#cell.getRow()]
    ].filter(name => name != "");

    if (this.#cell.getColumn() != 1 && this.#cell.getRow() != 1) {
      if (this.#cell.getColumn() == this.#cell.getRow()){
        return this.#face.toString() + secondThird.join("");
      } else {
        return this.#face.toString() + secondThird.reverse().join("")
      }
    } else {
      return this.#face.toString() + secondThird.join("");
    }
  }
  getCordinates () {
    return this.#cell.getCordinates().map(cordinate => this.#face.convert(cordinate));
  }

  static getStickerByName (name) {
    const list = name.split("");

    if (list.length == 1) {
      return new Sticker({
        face: Face.getFaceByName(list[0]),
        cell: new Cell({column: 1, row: 1})
      });
    } else if (list.length == 2) {
      return Sticker.getStickerByTwoFaces(
        Face.getFaceByName(list[0]),
        Face.getFaceByName(list[1]), 0,
        Face.getThirdByTwoFaces(Face.getFaceByName(list[0]), Face.getFaceByName(list[1])), 1
      );
    } else {
      return Sticker.getStickerByTwoFaces(
        Face.getFaceByName(list[0]),
        Face.getFaceByName(list[1]), 0,
        Face.getFaceByName(list[2]), 0
      );
    }
  }
  static getStickerByTwoFaces (onFace, aFace, aDistance, bFace, bDistance) {
    if (!(onFace instanceof Face)) {throw TypeError();}
    if (!(aFace instanceof Face)) {throw TypeError();}
    if (!(bFace instanceof Face)) {throw TypeError();}
    if (!(Face.isNext(onFace, aFace))) {throw Error();}
    if (!(Face.isNext(onFace, bFace))) {throw Error();}
    if (!(Face.isNext(aFace, bFace))) {throw Error();}
    if (!(0 <= aDistance && aDistance < 3)) {throw Error();}
    if (!(0 <= bDistance && bDistance < 3)) {throw Error();}

    const sideFaces = onFace.getSides();
    const aSide = sideFaces.map(face => face.toString()).indexOf(aFace.toString());
    const bSide = sideFaces.map(face => face.toString()).indexOf(bFace.toString());

    let column;
    let row;
    for (let [side, distance] of [[aSide, aDistance], [bSide, bDistance]]) {
      if (side % 2 == 0) {
        column = side < 2? distance: 2 - distance;
      } else {
        row = side < 2? distance: 2 - distance;
      }
    }

    return new Sticker({
      face: onFace,
      cell: new Cell({column, row})
    });
  }

  static *allStickersOnFace (face) {
    for (let cell of Cell.allCells()) {
      yield new Sticker({face, cell});
    }
  }
  static *allStickersNextFace (face) {
    for (let nextFace of face.getSides()) {
      const lastFace = Face.getThirdByTwoFaces(nextFace, face);

      for (let i = 0; i < 3; i++) {
        yield Sticker.getStickerByTwoFaces(
          nextFace,
          face, 0,
          lastFace, i
        );
    } }
  }
  static *allStickersBetweenFaces (face, oppositeFace = face.getOpposite()) {
    for (let nextFace of face.getSides()) {
      const lastFace = Face.getThirdByTwoFaces(nextFace, face);

      for (let i = 0; i < 3; i++) {
        yield Sticker.getStickerByTwoFaces(
          nextFace,
          face, 1,
          lastFace, i
        );
    } }
  }
  static *allStickers () {
    for (let face of Face.allFaces()) {
      for (let cell of Cell.allCells()) {
        yield new Sticker({face, cell});
    } }
  }
}