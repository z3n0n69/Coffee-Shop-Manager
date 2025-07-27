// Open Forgot Password Modal
function openResetModal() {
    document.getElementById("resetModal").style.display = "block";
}

// Close Forgot Password Modal
function closeResetModal() {
    document.getElementById("resetModal").style.display = "none";
}

// Simulate sending reset link
function sendResetLink() {
    const email = document.getElementById("reset-email").value;
    if (email) {
        document.getElementById("resetMessage").style.display = "block";
        setTimeout(() => {
            closeResetModal();
            document.getElementById("resetMessage").style.display = "none";
        }, 2000);
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    const user = users.find(u => u.username === username && u.password === password);
    if (!username || !password) {
        alert("Please fill in username and password.");
        return;
    }

    if (user) {
        // Only show success modal after validation passes
        document.getElementById("loginUsername").textContent = username;
        document.getElementById("loginModal").style.display = "flex";

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = user.role === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
        }, 2000);
    } else {
        // Invalid credentials
        alert("Invalid username or password.");
    }
}


// Close login modal manually (optional)
function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
}