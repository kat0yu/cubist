export default class Cell {
  #column; #row;
  constructor ({column, row}) {
    if (!(0 <= column && column < 3)) {throw TypeError();}
    if (!(0 <= row && row < 3)) {throw TypeError();}

    this.#column = column;
    this.#row = row;
  }

  getColumn () {
    return this.#column;
  }
  getRow () {
    return this.#row;
  }

  getCordinates () {
    return [
      [0, this.#column/3, this.#row/3],
      [0, (this.#column+1)/3, this.#row/3],
      [0, (this.#column+1)/3, (this.#row+1)/3],
      [0, this.#column/3, (this.#row+1)/3],
    ];
  }

  static *allCells () {
    for (let column = 0; column < 3; column++) {
      for (let row = 0; row < 3; row++) {
        yield new Cell({column, row});
    } }
  }
}