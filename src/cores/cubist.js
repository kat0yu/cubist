import Threedee from "../utils/threedee.js";

import Face from "../utils/face.js";
import Sticker from "../utils/sticker.js";

import Movrackets from "../utils/movrackets.js";

export default class Cubist {
  static SVGURL = "http://www.w3.org/2000/svg";
  static strainConstant = 1/10;
  static box = "-270 -240 500 500";
  static bases = [[190, -105], [-210, -105], [0, 245]];
  static opacity = 0.2;

  #cube; #groups; #pathes; #convert; #isAnimating
  constructor (element, {sides: [firstFace, secondFace] = []} = {}) {
    if (!(element instanceof Element)) {throw TypeError();}
    if (!(firstFace instanceof Face)) {throw TypeError();}
    if (!(secondFace instanceof Face)) {throw TypeError();}
    const thirdFace = Face.getThirdByTwoFaces(firstFace, secondFace);

    this.#convert = (cordinate) => [
      firstFace.isFront()? cordinate[firstFace.getRotate()]: 1 - cordinate[firstFace.getRotate()],
      secondFace.isFront()? cordinate[secondFace.getRotate()]: 1 - cordinate[secondFace.getRotate()],
      thirdFace.isFront()? cordinate[thirdFace.getRotate()]: 1 - cordinate[thirdFace.getRotate()]
    ];
    
    this.#cube = document.createElementNS(Cubist.SVGURL, "svg");
    this.#cube.setAttribute("viewBox", Cubist.box);

    if (element.getAttribute("id") != null) {
      this.#cube.setAttribute("id", element.getAttribute("id"));
    }
    if (element.getAttribute("class") != null) {
      this.#cube.setAttribute("class", [
        element.getAttribute("class"),
        "cube",
        `cube-${firstFace.toString()}${secondFace.toString()}${thirdFace.toString()}`
      ].join(" "));
    } else {
      this.#cube.setAttribute("class", [
        "cube",
        `cube-${firstFace.toString()}${secondFace.toString()}${thirdFace.toString()}`
      ].join(" "));
    }

    this.#cube.style.fill = "dimgray";
    this.#cube.style.stroke = "black";
    this.#cube.style['stroke-width'] = 4;
    this.#cube.style['stroke-linejoin'] = "round";
    this.#cube.style.transition = 500;
    
    element.parentNode.insertBefore(this.#cube, element);
    element.remove();


    this.#groups = {};
    for (let isFront of [false, true]) {
      this.#groups[isFront] = this.#cube.appendChild(document.createElementNS(Cubist.SVGURL, "g"));
      this.#groups[isFront].setAttribute("class", ["group", `group-${isFront? "front": "back"}`].join(" "));
      if (!isFront) {this.#groups[isFront].style.stroke = "white";}
    }

    this.#pathes = {};
    for (let sticker of Sticker.allStickers()) {
      const path = this.#groups[sticker.getFace().isFront()].appendChild(document.createElementNS(Cubist.SVGURL, "path"));
      // ↑誤り。
      this.#pathes[sticker.getName()] = path;

      const d = Cubist.digitize(
        sticker.getCordinates()
          .map(cordinate => this.#convert(cordinate))
          .map(cordinate => Threedee.strain(cordinate, Cubist.strainConstant))
          .map(cordinate => Threedee.linear(cordinate, Cubist.bases)
            .map(value => Math.round(value))
          )
      );
      path.setAttribute("d", d);

      path.setAttribute("class", `sticker sticker-${sticker.getName()}`);
    }
  }

  getColors () {
    let colors = {};
    for (let sticker of Sticker.allStickers()) {
      colors[sticker.getName()] = this.#pathes[sticker.getName()].style.fill;
    }
    return colors;
  }
  setColors (colors) {
    for (let stickerId in colors) {
      this.#pathes[stickerId].style.fill = colors[stickerId];
    }
    return this;
  }
  moveColors (move) {
    let colors = {};
    const shift = move.getStickersShift();
    for (let sticker of move.getAffectedStickers()) {
      if (!(Object.keys(this.#pathes).includes(shift[sticker.getName()]))) {
        console.warn("stickerの名前" + sticker.getName() + "に対応したpathが見つかりません。");
        continue;
      }
      colors[sticker.getName()] = this.#pathes[shift[sticker.getName()]].style.fill;
    }
    console.groupEnd();
    return this.setColors(colors);
  }
  blackOut (stickers) {
    let colors = {};
    for (let sticker of stickers) {
      colors[sticker.getName()] = "inherit";
    }
    return this.setColors(colors);
  }

  getAnimation (moves, {begin = 50, end = 200, duration = 20, gap = 30, repeatCount = 1, fill = "remove"} = {}) {

    const intro = ({count = 0, origin = null, repeat = (repeatCount == "indefinite"? repeatCount: repeatCount - 1)} = {}) => {
      if (count == 0) {
        if (this.#isAnimating) {
          console.error("stop init animate because another animation is moving.");
          return;
        }
        else {
          this.#isAnimating = true;
        }
      }
      if (origin == null) {
        origin = this.getColors();
      }

      if (count < begin) {
        requestAnimationFrame(() => intro({count: count + 1, origin, repeat}))
      }
      else {
        if (moves.length != 0) {
          requestAnimationFrame(() => step({phase: 0, origin, repeat}));
        } else {
          requestAnimationFrame(() => outro({origin, repeat}));
        }
      }

    };

    const step = ({count = 0, phase = 0, prev = null, origin = null, repeat} = {}) => {
      if (prev == null) {
        prev = this.getColors();
      }

      if (count < ((Math.abs(moves[phase].getTimes()) < 2)? duration: duration*2)) {
        this.spin(moves[phase], count/duration*90);
        
        requestAnimationFrame(() => step({count: count + 1, phase, prev, origin, repeat}));
      }
      else {
        this.spin(moves[phase], 0);
        this.moveColors(moves[phase]);
        
        requestAnimationFrame(() => wait({phase, origin, repeat}));
      }
    };

    const wait = ({count = 0, phase, origin = null, repeat} = {}) => {
      if (count < gap) {
        requestAnimationFrame(() => wait({phase: phase, count: count + 1, origin, repeat}));
      } else {
        if ((phase + 1) < moves.length) {
          requestAnimationFrame(() => step({phase: phase + 1, origin, repeat}));
        }
        else {
          requestAnimationFrame(() => outro({origin, repeat}));
        }
      }
    };

    const outro = ({count = 0, origin = null, repeat} = {}) => {
      if (count < end) {
        requestAnimationFrame(() => outro({count: count + 1, origin, repeat}));
      }
      else {
        this.#isAnimating = false;
        if (repeat == "indefinite" || repeat > 0) {
          this.setColors(origin);
          requestAnimationFrame(() => intro({count: 0, repeat: ((repeat == "indefinite")? repeat: repeat - 1)}));
        }
        else {
          if (fill == "remove") {
            this.setColors(origin);
          }
        }
      }
    };

    return intro;
  }
  spin (move, degree) {
    const direction = Threedee.rotate([1, 0, 0], move.getAxis());

    for (let sticker of move.getAffectedStickers()) {
      const path = this.#pathes[sticker.getName()];

      const d = Cubist.digitize(
        sticker.getCordinates()
          .map(cordinate => Threedee.spin(
            cordinate,
            [1/2, 1/2, 1/2],
            direction,
            degree*(move.getTimes() > 0? 1: -1)
          ))
          .map(cordinate => this.#convert(cordinate))
          .map(cordinate => Threedee.strain(cordinate, Cubist.strainConstant))
          .map(cordinate => Threedee.linear(cordinate, Cubist.bases)
            .map(value => Math.round(value))
          )
      );
      path.setAttribute("d", d);
    }
  }


  static makeCube (element, {sides: [firstFace = "f", secondFace = "r"] = []} = {}) {
    if (typeof firstFace == "function") {firstFace = firstFace(element);}
    if (typeof secondFace == "function") {secondFace = secondFace(element);}

    return new Cubist(element, {
      sides: [
        Face.getFaceByName(firstFace),
        Face.getFaceByName(secondFace)
      ]
    });
  }
  static makeCubeById (id, option = {}) {
    const preElement = document.getElementById(id);
    if (preElement == null) {throw Error();}
    return Cubist.makeCube(preElement, option);
  }
  static *makeCubesByClassName (className, option = {}) {
    const preElements = document.getElementsByClassName(className);
    if (preElements == null) {throw Error();}
    for (let preElement of preElements) {
      yield Cubist.makeCube(preElement, option);
    }
  }

  setColorsByDictionary (colorDictionary) {
    let colors = {};
    for (let [stikcerName, color] of Object.entries(colorDictionary)) {
      colors[Sticker.getStickerByName(stikcerName).getName()] = color;
    }
    return this.setColors(colors);
  }
  fullColors () {
    return this.fullColorsByDictionary({"f": "red", "r": "limegreen", "u": "yellow" ,"b": "orange", "l": "blue", "d": "white"});
  }
  fullColorsByDictionary (faceColors) {
    let colors = {};
    for (let [faceName, color] of Object.entries(faceColors)) {
      for (let sticker of Sticker.allStickersOnFace(Face.getFaceByName(faceName))) {
        colors[sticker.getName()] = color;
    } }
    return this.setColors(colors);
  }
  blackOutByFace (...faceNames) {
    for (let faceName of faceNames) {
      this.blackOut([...Sticker.allStickersOnFace(Face.getFaceByName(faceName))]);
    }
    return this;
  }
  blackOutBySticker (...stickerNames) {
    let stickers = [];
    for (let stickerName of stickerNames) {
      stickers.push(Sticker.getStickerByName(stickerName));
    }
    return this.blackOut(stickers);
  }
  blackOutByMove (...movetexts) {
    for (let move of Movrackets.makeMovracketsFromText(movetexts.join("")).linise().toArray()) {
      this.blackOut([...move.getAffectedStickers()]);
    }
    return this;
  }
  moveColorsByMovetext (movetext, reversed = false) {
    let moves = Movrackets.makeMovracketsFromText(movetext);
    if (reversed) {moves = moves.exponent(-1);}
    moves = moves.linise().toArray();
    for (let move of moves) {
      this.moveColors(move);
    }
  }
  setClear (clear = true) {
    if (clear) {this.#groups[true].style.opacity = Cubist.opacity;}
    else {this.#groups[true].style.opacity = 1;}
    return this;
  }
  getAnimationByMovetext (movetext, option = {}) {
    return this.getAnimation([...Movrackets.makeMovracketsFromText(movetext).linise().toArray()], option);
  }

  static digitize (cordinates) {
    return 'M' + cordinates.map(cordinate => cordinate.join(',')).join(' L') + ' Z';
  }
  asElement () {
    return this.#cube;
  }
}