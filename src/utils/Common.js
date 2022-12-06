function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromArray(array) {
  return array[randomNumber(0, array.length - 1)];
}

export { randomFromArray, randomNumber };
