const adminButton = document.getElementById("adminButton");
const adminForm = document.getElementById("adminForm");
const userForm = document.getElementById("userForm");

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
  window.location.href = "./dashboard.html";
});
