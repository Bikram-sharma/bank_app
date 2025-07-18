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

// insert accounts data in document
function getaccounts() {
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
}
getaccounts();

// insert transactions data in document

function getTransactions() {
  axios.get("http://localhost:4000/transactions").then((response) => {
    while (transactions.children.length > 2) {
      transactions.removeChild(transactions.lastChild);
    }
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
}
getTransactions();

// initiate transaction

const initiate_button = document.getElementById("initiate_transaction");

initiate_button.onclick = () => {
  const form = document.createElement("form");
  form.id = "transaction_from";
  form.classList =
    "text-base w-full h-15 bg-[#F9F3EF] p-2 grid grid-cols-5 gap-2 bg-green-100 justify-center";
  const enterDetails = document.createElement("div");
  enterDetails.innerText = "Fill the Details:";
  enterDetails.classList = "grid place-items-center text-xl";
  form.appendChild(enterDetails);

  const inputs = ["amount", "from_account_id", "to_account_id"];
  inputs.forEach((name) => {
    const input = document.createElement("input");
    input.name = name;
    input.placeholder = name;
    input.required = true;
    input.classList = "px-2 border rounded appearance-none";
    input.type = "number";
    form.appendChild(input);
  });
  const submitButton = document.createElement("button");
  submitButton.classList =
    " text-white text-xl text-center bg-green-600 hover:bg-green-700  rounded-xl cursor-pointer";
  submitButton.innerText = "Submit";
  submitButton.type = "submit";
  form.appendChild(submitButton);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitTransaction(form);
  });
  transactions.appendChild(form);
};

function submitTransaction(form) {
  const formData = new FormData(form);
  const body = Object.fromEntries(formData);
  console.log(body);
  axios.post("http://localhost:4000/addtransaction", body).then((response) => {
    console.log(response.data.message);
    getTransactions();
  });

  form.remove();
}
