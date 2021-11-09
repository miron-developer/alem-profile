export const RandomKey = () =>
  Math.round(Math.random() * Math.random() * 100000000);

// return two digit string
export const To2Digit = (data) =>
  parseInt(data) < 10 ? "0".concat(data) : data;

// from 1000000 to 100k for ex
export const ReadableCount = (count = 0, accuracy = 2) => {
  const letters = ["", "K", "M", "B", "T"];
  count = parseFloat(count);
  let index = 0;
  while (count >= 1000) {
    count /= 1000;
    index++;
  }

  return (
    Math.round(count * Math.pow(10, accuracy)) / Math.pow(10, accuracy) +
    letters[index]
  );
  // return count.toFixed(accuracy) + letters[index];
};
