export const toKebabCase = (title) => {
  return title.split(" ").join("-").toLowerCase();
};

export const toOneDecimal = (str) => {
  const number = Number(str);
  return number.toFixed(1);
};

export const toTwoDecimals = (str) => {
  const number = Number(str);
  return number.toFixed(2);
};

export const arrayToString = (arr) => {
  const newArr = Array.from(arr)
    .map((item) => item.english_name || item.name)
    .join(", ");
  return newArr;
};
