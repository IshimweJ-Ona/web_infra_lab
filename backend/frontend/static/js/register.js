document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const regResponse = document.getElementById("regResponse");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;
    const currency = document.getElementById("currency")?.value.trim();

    if (!username || !email || !password || !currency) {
      regResponse.innerText = "Please fill in all fields.";
      return;
    }

    if (password.length < 8) {
      regResponse.innerText = "Password must be at least 8 characters long.";
      return;
    }

    const csrfToken = document.querySelector("meta[name='csrf-token']")?.getAttribute("content");

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken
        },
        body: JSON.stringify({
          username,
          email,
          password,
          currency
        })
      });

      const result = await res.json();

      if (result.success) {
        alert("User registered successfully! Please log in.");
        window.location.href = "/login";
      } else {
        regResponse.innerText = result.error || "Registration failed. Please try again.";
      }
    } catch (err) {
      regResponse.innerText = "Network error during registration.";
      console.error("Registration error:", err);
    }
  });
});