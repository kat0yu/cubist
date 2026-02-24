import Face from "./face.js";
import Sticker from "./sticker.js";

export default class Movunit {
  #axis; #width; #start; #times;
  constructor ({axis, width, start, times}) {
    if (times == undefined) {throw TypeError()}
    this.#axis = axis;
    this.#width = width;
    this.#start = start;
    this.#times = times;
  }

  isMovunit () {return true;}
  isBracket () {return false;}

  get axis () {return this.#axis;}
  get width () {return this.#width;}
  get start () {return this.#start;}
  get times () {return this.#times;}

  repeat (count) {
    return new Movunit({
      axis: this.#axis,
      width: this.#width,
      start: this.#start,
      times: (this.#times*count<0? -1: 1) * ({0: 0, 1: 1, 2: 2, 3: -1}[Math.abs(this.#times*count)%4])
    });
  }

  *getAffectedStickers () {
    const on = new Face({isFront: true, rotate: this.#axis});
    const off = new Face({isFront: false, rotate: this.#axis});
    
    for (let depth = this.#start; depth < this.#start + this.#width; depth++) {

      if (depth == 0) {
        yield* Sticker.allStickersOnFace(on);
        yield* Sticker.allStickersNextFace(on);
      }

      else if (depth == 1) {
        yield* Sticker.allStickersBetweenFaces(on, off);
      }

      else {
        yield* Sticker.allStickersOnFace(off);
        yield* Sticker.allStickersNextFace(off);
      }
    }
  }
  getStickersShift () {
    const on = {
      true: new Face({isFront: true, rotate: this.#axis}),
      false: new Face({isFront: false, rotate: this.#axis})
    };
    let shift = {};

    for (let depth = 0; depth < 3; depth++) {
      if (depth == 0 || depth == 2) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            shift[Sticker.getStickerByTwoFaces(
              on[depth == 0],
              on[depth == 0].getSides()[0], i,
              on[depth == 0].getSides()[1], j,
            ).getName()] = Sticker.getStickerByTwoFaces(
              on[depth == 0],
              on[depth == 0].getSides()[(this.#times+4)%4], i,
              on[depth == 0].getSides()[(this.#times+1+4)%4], j,
            ).getName();
        } } 
      }

      for (let g = 0; g < 4; g++) {
        for (let k = 0; k < 3; k++) {
          shift[Sticker.getStickerByTwoFaces(
            on[true].getSides()[g],
            on[true], depth,
            on[true].getSides()[(g+1)%4], k,
          ).getName()] = Sticker.getStickerByTwoFaces(
            on[true].getSides()[(g+this.#times+4)%4],
            on[true], depth,
            on[true].getSides()[(g+this.#times+1+4)%4], k,
          ).getName();
      } }
    }

    return shift;
  }
}