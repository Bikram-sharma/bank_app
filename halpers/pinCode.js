const pinCode = (length = 6) => {
  let number = "";
  for (let i = 0; i < length; i += 1) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
};

export default pinCode;
