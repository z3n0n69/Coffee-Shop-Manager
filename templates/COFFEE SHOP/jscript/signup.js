// Create and inject success modal into the DOM
const modalHTML = `
  <div id="signupSuccessModal" style="
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 9999;">
    <div style="
      background: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);">
      <h2>Signup Successful!</h2>
      <p>Redirecting to LogIn page...</p>
      <button onclick="closeSignupModal()" style="margin-top: 15px; padding: 10px 20px;">OK</button>
    </div>
  </div>
`;
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML('beforeend', modalHTML);
});

// Close modal manually
function closeSignupModal() {
  document.getElementById('signupSuccessModal').style.display = 'none';
  window.location.href = 'login.html';
}

// Handle form submission
function handleSignup(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check for duplicate username
  if (users.some(user => user.username === username)) {
    alert("Username already exists. Please choose another.");
    return;
  }

  // Check for duplicate email
  if (users.some(user => user.email === email)) {
    alert("Email already registered. Try logging in or use a different email.");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Save user
  const newUser = { username, fullname, email, password, role: "user" };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Show modal
  const modal = document.getElementById("signupSuccessModal");
  modal.style.display = "flex";

  // Redirect after delay
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2500);
}