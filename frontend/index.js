const accountsButton = document.getElementById("accounts_button");
const transactionsButton = document.getElementById("transactions_button");
const accounts = document.getElementById("accounts");
const transactions = document.getElementById("transactions");

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
