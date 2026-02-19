export default class Vector {
  static add (a, b) {
    if (!['object', 'number'].includes(typeof a)) {throw Error(`1st argument should be object or number. now set type ${typeof a} (a = ${a})`)}
    if (!['object', 'number'].includes(typeof b)) {throw Error(`2nd argument should be object or number. now set type ${typeof b} (b = ${b})`)}

    if (typeof a == 'object' && typeof b == 'object') {
      if (a.length != b.length) {throw Error(`arguments length should be matched. now a.length = ${a.length} and b.length = ${b.length}`);}
      return a.map((value, index) => a[index] + b[index]);
    } else if (typeof a == 'number' && typeof b == 'object') {
      return b.map(value => a + value);
    } else if (typeof a == 'object' && typeof b == 'number') {
      return a.map(value => b + value);
    } else {
      return a + b;
    }
  }
  static sum (al) {
    if (typeof al != 'object') {throw Error(`argument should be object. now set type ${typeof al} (al = ${al})`)}

    if (al.length == 1) {
      return al[0];
    } else if (al.length == 2) {
      return Vector.add(al[0], al[1]);
    } else {
      return Vector.sum([Vector.add(al[0], al[1])].concat(al.slice(2)));
    }
  }
  static multi (a, b) {
    if (!['object', 'number'].includes(typeof a)) {throw Error(`1st argument should be object or number. now set type ${typeof a} (a = ${a})`)}
    if (!['object', 'number'].includes(typeof b)) {throw Error(`2nd argument should be object or number. now set type ${typeof b} (b = ${b})`)}

    if (typeof a == 'object' && typeof b == 'object') {
      if (a.length != b.length) {throw Error(`arguments length should be matched. now a.length = ${a.length} and b.length = ${b.length}`);}
      return a.map((value, index) => a[index]*b[index]);
    } else if (typeof a == 'number' && typeof b == 'object') {
      return b.map(value => a*value);
    } else if (typeof a == 'object' && typeof b == 'number') {
      return a.map(value => b*value);
    } else {
      return a*b;
    }
  }
  static pi (al) {
    if (typeof al != 'object') {throw Error(`argument should be object. now set type ${typeof al} (al = ${al})`)}

    if (al.length == 1) {
      return al[0];
    } else if (al.length == 2) {
      return Vector.multi(al[0], al[1]);
    } else {
      return Vector.pi([Vector.multi(al[0], al[1])].concat(al.slice(2)));
    }
  }
  static outer (a, b) {
    if (typeof a != 'object') {throw Error(`1st argument should be object. now set type ${typeof a} (a = ${a})`)}
    if (typeof b != 'object') {throw Error(`2nd argument should be object. now set type ${typeof b} (b = ${b})`)}
    if (a.length != 3 || b.length != 3) {throw Error(`argument length should be 3. now a.length = ${a.length} and b.length = ${b.length}`);}
    
    return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
  }
}