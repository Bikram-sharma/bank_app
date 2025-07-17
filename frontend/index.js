const accountsButton = document.getElementById("accounts_button");
const transactionsButton = document.getElementById("transactions_button");
const accounts = document.getElementById("accounts");
const transactions = document.getElementById("transactions");

// to switch between the tables
accountsButton.onclick = () => {
  transactionsButton.classList.remove("border-green-500");
  accountsButton.classList.add("border-green-500");
  transactions.classList.add("hidden");
  accounts.classList.remove("hidden");
};

transactionsButton.onclick = () => {
  accountsButton.classList.remove("border-green-500");
  transactionsButton.classList.add("border-green-500");
  accounts.classList.add("hidden");
  transactions.classList.remove("hidden");
};

axios.get("http://localhost:4000/accounts").then((response) => {
  console.log(response.data);
  const orderKey = [
    "id",
    "number",
    "pin_code",
    "balance",
    "created_at",
    "updated_at",
  ];

  response.data.forEach((account) => {
    const cell = document.createElement("div");
    cell.classList =
      "text-base w-full h-15 bg-[#F9F3EF] p-2 grid grid-cols-6 gap-2";
    const orderedValues = orderKey.map((key) => account[key]);
    orderedValues.forEach((value) => {
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.readOnly = true;
      input.classList = "focus:outline-none text-center border";
      input.value = value;
      cell.appendChild(input);
    });
    accounts.appendChild(cell);
  });
});

axios.get("http://localhost:4000/transactions").then((response) => {
  console.log(response.data);
  const orderKey = [
    "id",
    "amount",
    "from_account_id",
    "to_account_id",
    "transacted_at",
  ];

  response.data.forEach((transaction) => {
    const cell = document.createElement("div");
    cell.classList =
      "text-base w-full h-15 bg-[#F9F3EF] p-2 grid grid-cols-5 gap-2";
    const orderedValues = orderKey.map((key) => transaction[key]);
    orderedValues.forEach((value) => {
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.readOnly = true;
      input.classList = "focus:outline-none text-center border";
      input.value = value;
      cell.appendChild(input);
    });
    transactions.appendChild(cell);
  });
});
