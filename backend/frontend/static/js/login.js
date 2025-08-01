document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginResponse = document.getElementById("loginResponse");

  // Check login status on load
  fetch("/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.loggedIn) {
        window.location.href = "/"; // Redirect if already logged in
      }
    })
    .catch((err) => console.error("Status check failed:", err));

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!username || !password) {
      loginResponse.innerText = "Please enter both username and password.";
      return;
    }

    if (password.length < 8) {
      loginResponse.innerText = "Password must be at least 8 characters.";
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const result = await res.json();

      if (result.success) {
        loginResponse.innerText = "Login successful!";
        window.location.href = "/";
      } else {
        loginResponse.innerText = result.error || "Login failed. Try again.";
      }
    } catch (err) {
      loginResponse.innerText = "Network error during login.";
      console.error("Login error:", err);
    }
  });
});
