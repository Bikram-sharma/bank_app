const accountNumber = (length = 9) => {
  let number = "";
  for (let i = 0; i < length; i += 1) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
};

export default accountNumber;
