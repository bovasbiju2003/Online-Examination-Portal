// ======================================
// Admin Login
// ======================================

// Default Admin Credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// If already logged in, go directly to dashboard
if (sessionStorage.getItem("adminLoggedIn") === "true") {
    window.location.href = "admin-dashboard.html";
}

// Login Button
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", login);

// Allow Enter key to login
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        login();
    }
});

function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const error = document.getElementById("error");

    error.innerHTML = "";

    if (username === "" || password === "") {

        error.innerHTML = "Please enter username and password.";

        return;

    }

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        // Save Login Session
        sessionStorage.setItem("adminLoggedIn", "true");
        sessionStorage.setItem("adminName", username);

        alert("Login Successful!");

        window.location.href = "admin-dashboard.html";

    } else {

        error.innerHTML = "Invalid Username or Password.";

    }

}