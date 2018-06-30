function isUuid(str) {
  const condition = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
  if (str.toString().match(condition)) {
    return true;
  } else {
    return false;
  }
}

// console.log(isUuid('b4acc9c6-5b7a-4b4c-9600-93b836fc3747'));

module.exports = { isUuid };
