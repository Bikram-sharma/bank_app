const fundTransferButton = document.getElementById("fundTransfer");
const number = sessionStorage.getItem("number");
const logoutButton = document.getElementById("logout");

if (!number) {
  window.location.href = "./login.html";
}

function getUserDetails(accountNumber) {
  axios
    .get(`http://localhost:4000/user/account/${accountNumber}`)
    .then((response) => {
      console.log(response);
      document.getElementById("accountNumber").innerText = response.data.number;
      document.getElementById("balance").innerText = response.data.balance;
    })
    .catch((error) => {
      console.log(error);
    });
}
getUserDetails(number);

fundTransferButton.onclick = () => {
  Swal.fire({
    title: "Fund Transfer",
    html: ` <input id="input1" class="h-12 w-full border rounded-lg mb-5 px-2" placeholder="Beneficiary Account Number">
            <input id="input2" class="h-12 w-full border rounded-lg px-2" placeholder="Amount" type="number"> `,
    confirmButtonText: "Transfer",
    showCancelButton: true,
    focusConfirm: false,
    preConfirm: () => {
      const account = document.getElementById("input1").value;
      const amount = document.getElementById("input2").value;

      if (!account || !amount) {
        Swal.showValidationMessage("Both fields are required");
        return false;
      }

      return { account, amount };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("Account:", result.value.account);
      console.log("Amount:", result.value.amount);
      // You can now send this data to the server or handle it however you like
    }
  });
};

// logout

logoutButton.onclick = () => {
  sessionStorage.removeItem("number");
  window.location.href = "./login.html";
};
