import accountNumber from "../halpers/accountNumber.js";
import pinCode from "../halpers/pinCode.js";

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
  axios
    .get("http://localhost:4000/accounts")
    .then((response) => {
      while (accounts.children.length > 2) {
        accounts.removeChild(accounts.lastChild);
      }
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
        cell.classList = "text-base w-full h-15  p-2 grid grid-cols-6 gap-2";
        const orderedValues = orderKey.map((key) => account[key]);
        orderedValues.forEach((value, index) => {
          const record = document.createElement("div");

          if (index === 3) {
            record.classList = "flex justify-between border items-center px-2";
            const depositButton = document.createElement("button");
            depositButton.title = "Deposit";
            depositButton.onclick = () => deposit(orderedValues[1]);
            depositButton.className =
              "w-6 h-6 bg-[url('./images/deposit.png')] bg-contain bg-no-repeat bg-center cursor-pointer";
            record.appendChild(depositButton);
            const span = document.createElement("span");
            span.innerText = value;
            record.appendChild(span);
            const withdrawalButton = document.createElement("div");
            withdrawalButton.title = "Withdrawal";
            withdrawalButton.onclick = () => withdraw(orderedValues[1]);
            withdrawalButton.classList =
              "w-6 h-6 bg-[url('./images/withdrawal.png')] bg-contain bg-no-repeat bg-center cursor-pointer";
            record.appendChild(withdrawalButton);
          } else {
            record.classList =
              "border border-[#1B3C53] grid place-items-center";
            record.innerText = value;
          }
          cell.appendChild(record);
        });
        accounts.appendChild(cell);
      });
    })
    .catch((error) => {
      console.error("Failed to fetch accounts", error);
    });
}
getaccounts();

// insert transactions data in document

function getTransactions() {
  axios
    .get("http://localhost:4000/transactions")
    .then((response) => {
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
        cell.classList = "text-base w-full h-15 p-2 grid grid-cols-5 gap-2";
        const orderedValues = orderKey.map((key) => transaction[key]);
        orderedValues.forEach((value) => {
          const record = document.createElement("div");
          record.classList = "border border-[#1B3C53] grid place-items-center";
          record.innerText = value;
          cell.appendChild(record);
        });
        transactions.appendChild(cell);
      });
    })
    .catch((error) => {
      console.error("Failed to fetch transactions", error);
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
  transactions.scrollTop = transactions.scrollHeight;
};

function submitTransaction(form) {
  const formData = new FormData(form);
  const body = Object.fromEntries(formData);
  console.log(body);
  axios
    .post("http://localhost:4000/createtransaction", body)
    .then((response) => {
      console.log(response.data.message);
      Swal.fire({
        title: "Success!",
        text: `successfully transfered $${body.amount} from Account ID ${body.from_account_id} to ${body.to_account_id}`,
        icon: "success",
        confirmButtonText: "OK",
      });
      getTransactions();
      getaccounts();
    })
    .catch((error) => {
      console.error("transaction Failed", error);
      Swal.fire({
        title: "Failed!",
        text:
          error.response.data.error || `Transaction Failed!. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    });

  form.remove();
}

// create Account

const createButton = document.getElementById("add_button");
createButton.onclick = () => {
  let number = accountNumber();
  let pin_code = pinCode();
  let balance = 0;

  axios
    .post("http://localhost:4000/createaccount", {
      number,
      pin_code,
      balance,
    })
    .then((response) => {
      console.log(response.data.message);
      Swal.fire({
        title: "Success!",
        text: `Your account has been successfully created. Please note your account number: ${number}`,
        icon: "success",
        confirmButtonText: "OK",
      });
      getaccounts();
    })
    .catch((error) => {
      Swal.fire({
        title: "Failed!",
        text: "Filed to create Account",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.log(error);
    });
};

// delete account

const deleteButton = document.getElementById("delete_button");

deleteButton.onclick = () => {
  Swal.fire({
    title: "Enter Account to Delete",
    input: "number",
    inputLabel: "Account Number",
    inputPlaceholder: "account number...",
    showCancelButton: true,
    confirmButtonText: "Delete",
    confirmButtonColor: "#d33",
    didOpen: () => {
      const input = Swal.getInput();
      input.style.border = "2px solid red";
      input.style.outline = "none";
    },
  }).then((result) => {
    if (!result.value) return;
    axios
      .delete(`http://localhost:4000/${result.value}`)
      .then((response) => {
        console.log(response.data.message);

        Swal.fire({
          title: "Success!",
          text: `Account #${result.value} deleted Successfully`,
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          result.isConfirmed ? getaccounts() : "";
        });
      })
      .catch((error) => {
        console.log(error.response.data.message);
        Swal.fire({
          title: "Failed",
          text: error.response.data.message ||`Unable to delete account #${result.value}. Please try again.`,
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          result.isConfirmed ? location.reload() : "";
        });
      });
  });
};

// deposit

function deposit(number) {
  Swal.fire({
    title: "Enter Account",
    input: "number",
    inputLabel: "Amount you want to deposit",
    inputPlaceholder: "amount...",
    showCancelButton: true,
    confirmButtonText: "Deposit",
    confirmButtonColor: "green",
  }).then((result) => {
    if (result.value) {
      const amount = Number(result.value);
      axios
        .post("http://localhost:4000/deposit", { number, amount })
        .then((response) => {
          Swal.fire({
            title: "Success!",
            text: `Successfully deposited $${amount} to the account #${number}`,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            result.isConfirmed ? getaccounts() : "";
          });
        })
        .catch((error) => {
          console.log(error.message);
          Swal.fire({
            title: "Failed",
            text: `Unable to Deposit. Please try again.`,
            icon: "error",
            confirmButtonText: "OK",
          }).then((result) => {
            result.isConfirmed ? location.reload() : "";
          });
        });
    }
  });
}

// withdraw

function withdraw(number) {
  Swal.fire({
    title: "Enter Account",
    input: "number",
    inputLabel: "Amount you want to withdraw",
    inputPlaceholder: "amount...",
    showCancelButton: true,
    confirmButtonText: "withdraw",
    confirmButtonColor: "green",
  }).then((result) => {
    if (result.value) {
      const amount = Number(result.value);
      axios
        .post("http://localhost:4000/withdraw", { number, amount })
        .then((response) => {
          Swal.fire({
            title: "Success!",
            text: `$${amount} has been withdrawn from account #${number}`,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            result.isConfirmed ? getaccounts() : "";
          });
        })
        .catch((error) => {
          console.log(error.message);
          Swal.fire({
            title: "Failed",
            text:
              error.response.data.message ||
              `Unable to withdraw. Please try again.`,
            icon: "error",
            confirmButtonText: "OK",
          }).then((result) => {
            result.isConfirmed ? location.reload() : "";
          });
        });
    }
  });
}
