export default class CubistFace {
  #isFront; #rotate;
  constructor ({isFront, rotate}) {
    if (!([true,false].includes(isFront))) {throw TypeError();}
    if (!(0 <= rotate && rotate < 3)) {throw TypeError();}

    this.#isFront = isFront;
    this.#rotate = rotate;
  }

  isFront () {
    return this.#isFront;
  }
  getRotate () {
    return this.#rotate;
  }

  getOpposite () {
    return new CubistFace({
      isFront: !this.#isFront,
      rotate: this.#rotate
    });
  }
  getSecond () {
    return new CubistFace({
      isFront: this.#isFront,
      rotate: (this.#rotate + 1)%3
    });
  }
  getThird () {
    return new CubistFace({
      isFront: this.#isFront,
      rotate: (this.#rotate + 2)%3
    });
  }
  getSides () {
    return [
      this.getSecond(),
      this.getThird(),
      this.getSecond().getOpposite(),
      this.getThird().getOpposite(),
    ];
  }
  getArounds (on) {
    if (!(on instanceof CubistFace)) {throw TypeError();}
    return [
      this,
      CubistFace.getThirdByTwoFaces(this, on),
      this.getOpposite(),
      CubistFace.getThirdByTwoFaces(this, on).getOpposite(),
    ];
  }
  static isNext (a, b) {
    if (!(a instanceof CubistFace)) {throw TypeError();}
    if (!(b instanceof CubistFace)) {throw TypeError();}

    return a.getRotate() != b.getRotate();
  }
  static getThirdByTwoFaces (a, b) {
    if (!(a instanceof CubistFace)) {throw TypeError();}
    if (!(b instanceof CubistFace)) {throw TypeError();}
    if (!(CubistFace.isNext(a, b))) {throw Error();}

    return new CubistFace({
      isFront: ((a.isFront()? 1: -1) * (b.isFront()? 1: -1) * ((a.getRotate() - b.getRotate() + 3)%3 == 2? 1: -1) == 1),
      rotate: 3 - a.getRotate() - b.getRotate()
    });
  }

  convert (cordinate) {
    if (this.#isFront) {
      return [
        cordinate[(-this.#rotate+3)%3],
        cordinate[(-this.#rotate+1+3)%3],
        cordinate[(-this.#rotate+2+3)%3],
      ];
    } else {
      return [
        1 - cordinate[(-this.#rotate+3)%3],
        1 - cordinate[(-this.#rotate+1+3)%3],
        1 - cordinate[(-this.#rotate+2+3)%3],
      ];
    }
  }
  
  static getFaceByName (name) {
    if (!(new RegExp("^[FRUBLD]$").test(name))) {throw TypeError();}

    return new CubistFace({
      isFront: new RegExp("^[FRU]$").test(name),
      rotate: new RegExp("^[FRU]$").test(name)? ["F","R","U"].indexOf(name): ["B","L","D"].indexOf(name)
    });
  }
  toString () {
    return this.#isFront? ["F","R","U"][this.#rotate]: ["B","L","D"][this.#rotate];
  }

  static *allFaces () {
    for (let isFront of [true, false]) {
      for (let rotate = 0; rotate < 3; rotate++) {
        yield new CubistFace({isFront, rotate});
    } }
  }
}