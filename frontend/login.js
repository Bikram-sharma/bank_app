const adminButton = document.getElementById("adminButton");
const adminForm = document.getElementById("adminForm");
const userForm = document.getElementById("userForm");

const number = sessionStorage.getItem("number");
if (number) {
  window.location.href = "./dashboard.html";
}

adminButton.onclick = () => {
  const text = adminButton.innerText;

  if (text === "Login as Admin") {
    adminButton.innerText = "Login as Client";
  } else {
    adminButton.innerText = "Login as Admin";
  }
  userForm.classList.toggle("hidden");
  adminForm.classList.toggle("hidden");
};

adminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fromData = new FormData(adminForm);
  const body = Object.fromEntries(fromData);
  if (body.password == "Admin") {
    window.location.href = "./index.html";
  }
});

userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fromData = new FormData(userForm);
  const body = Object.fromEntries(fromData);

  axios
    .post("http://localhost:4000/login", body)
    .then((response) => {
      let number = response.data.number;
      sessionStorage.setItem("number", number);
      window.location.href = "./dashboard.html";
    })
    .catch((error) => {
      console.log(error.response.data.message);
      Swal.fire({
        title: "Failed",
        text:
          error.response.data.message ||
          `transaction failed!. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
});
