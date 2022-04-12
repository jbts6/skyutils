function* asyncGenerator(obj = []) {
  let i = 0;
  let len;
  if (Array.isArray(obj)) {
    len = obj.length;
    while (i < len) {
      yield [obj[i], i++, obj];
    }
  } else {
    const keys = Object.keys(obj);
    len = keys.length;
    while (i < len) {
      const key = keys[i++];
      yield [obj[key], key, obj];
    }
  }
}
export default asyncGenerator;