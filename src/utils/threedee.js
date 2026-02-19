import Vector from "./vector.js";

export default class Threedee {
  static rotate (xyz, rotateTime = 0) {
    if (typeof xyz != 'object') {throw Error(`1st argument should be object. now set type ${typeof xyz} (xyz = ${xyz})`);}
    if (xyz.length != 3) {throw Error(`1st argument length should be 3. now xyz.length = ${typeof xyz.length}`);}
    if (typeof rotateTime != 'number') {throw Error(`2nd argument should be number. now set type ${typeof rotateTime} (time = ${rotateTime})`);}
    
    if (rotateTime % 3 < 1) {
      return xyz;
    } else if (rotateTime % 3 == 1) {
      return [xyz[2], xyz[0], xyz[1]];
    } else if (rotateTime % 3 == 2) {
      return [xyz[1], xyz[2], xyz[0]];
    } else {
      return this.rotate([xyz[2], xyz[0], xyz[1]], rotateTime - 1);
    }
  }
  static backWards (xyz, back = true) {
    if (typeof xyz != 'object') {throw Error(`1st argument should be object. now set type ${typeof xyz} (xyz = ${xyz})`);}
    if (xyz.length != 3) {throw Error(`1st argument length should be 3. now xyz.length = ${typeof xyz.length}`);}
    
    if (back) {
      return Vector.add(1, Vector.multi(-1, xyz));
    } else {
      return xyz;
    };
  }
  static spin (originxyz, centerxyz, direction, degree) {
    if (typeof originxyz != 'object') {throw Error(`1st argument should be object. now set type ${typeof originxyz} (originxyz = ${originxyz})`);}
    if (originxyz.length != 3) {throw Error(`1st argument length should be 3. now originxyz.length = ${typeof originxyz.length}`);}
    if (typeof centerxyz != 'object') {throw Error(`2nd argument should be object. now set type ${typeof centerxyz} (centerxyz = ${centerxyz})`);}
    if (centerxyz.length != 3) {throw Error(`2nd argument length should be 3. now centerxyz.length = ${typeof centerxyz.length}`);}
    if (typeof direction != 'object') {throw Error(`3rd argument should be object. now set type ${typeof direction} (direction = ${direction})`);}
    if (direction.length != 3) {throw Error(`3rd argument length should be 3. now direction.length = ${typeof direction.length}`);}
    if (typeof degree != 'number') {throw Error(`4th argument should be number. now set type ${typeof degree} (degree = ${degree})`);}
    
    const radian = degree/180*Math.PI
    return Vector.sum([
      Vector.pi([centerxyz, 1 - Math.cos(radian), Vector.add(1, Vector.multi(-1, direction))]),
      Vector.multi(originxyz, Vector.add(Math.cos(radian), Vector.multi(1 - Math.cos(radian), direction))),
      Vector.outer(Vector.add(originxyz, Vector.multi(-1, centerxyz)), Vector.multi(Math.sin(radian), direction))
    ]);
  }
  static strain (xyz, strainConstant) {
    if (typeof strainConstant != 'number') {throw Error(`2nd argument should be number. now set type ${typeof strainConstant} (strainConstant = ${strainConstant})`);}
    
    return (Vector.pi([
      xyz,
      Vector.add(1, Vector.multi(- strainConstant, Threedee.rotate(xyz, 1))),
      Vector.add(1, Vector.multi(- strainConstant, Threedee.rotate(xyz, 2)))
    ]));
    // 簡略化前は / (1-(xyz[0]*xyz[1]+xyz[1]*xyz[2]+xyz[2]*xyz[0])*strainConstant**2+2*xyz[0]*xyz[1]*xyz[2]*strainConstant**3),
  }
  static linear (xyz, bases) {
    if (typeof xyz != 'object') {throw Error(`1st argument should be object. now set type ${typeof xyz} (xyz = ${xyz})`);}
    if (xyz.length != 3) {throw Error(`1st argument length should be 3. now xyz.length = ${typeof xyz.length}`);}
    if (typeof bases != 'object') {throw Error(`2nd argument should be object. now set type ${typeof bases} (bases = ${bases})`);}
    if (bases.length != 3) {throw Error(`2nd argument length should be 3. now bases.length = ${typeof bases.length}`);}
    if (bases.map(base => base.length) == [2, 2, 2]) {throw Error(`2nd argument item length should be 2. now bases[0~2].length = ${typeof bases.map(base => base.length)}`);}

    return [
      bases[0][0] * xyz[0] + bases[1][0] * xyz[1] + bases[2][0] * xyz[2],
      bases[0][1] * xyz[0] + bases[1][1] * xyz[1] + bases[2][1] * xyz[2]
    ];
  }
}