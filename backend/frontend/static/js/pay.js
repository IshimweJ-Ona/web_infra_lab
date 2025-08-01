document.addEventListener("DOMContentLoaded", () => {
  const paymentForm = document.getElementById("paymentForm");
  const payResponse = document.getElementById("payResponse");

  // Check login status
  fetch("/status")
    .then(res => res.json())
    .then(data => {
      if (!data.loggedIn) {
        window.location.href = "/login";
      }
    });

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payType = document.getElementById("payType")?.value.trim();
    const target = document.getElementById("target")?.value.trim();
    const amount = parseFloat(document.getElementById("amount")?.value);
    const userPhone = document.getElementById("userPhone")?.value.trim();
    const currency = document.getElementById("currency")?.value.trim();

    if (!payType || !target || isNaN(amount) || amount <= 0 || !userPhone || !currency) {
      payResponse.innerText = "Please fill in all required fields correctly.";
      return;
    }

    try {
      const res = await fetch("/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentType: payType,
          paidTo: target,
          amount,
          phone: userPhone,
          currency
        })
      });

      const result = await res.json();

      if (result.success) {
        payResponse.innerText = "Payment successful!";
        paymentForm.reset();
      } else {
        payResponse.innerText = result.error || "Payment failed. Please try again.";
      }
    } catch (err) {
      payResponse.innerText = "Network error during payment.";
      console.error("Payment error:", err);
    }
  });
});
