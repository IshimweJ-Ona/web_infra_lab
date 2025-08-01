document.addEventListener('DOMContentLoaded', async () => {
  const historyTable = document.getElementById('historyTable').querySelector('tbody');

  if (!historyTable) {
    console.error("Element #historyTable tbody not found.");
    return;
  }

  // Check login status
  try {
    const statusRes = await fetch("/status");
    const status = await statusRes.json();
    if (!status.loggedIn) {
      window.location.href = "/login";
      return;
    }
  } catch (err) {
    console.error("Status check failed", err);
    window.location.href = "/login";
    return;
  }

  historyTable.innerHTML = '<tr><td colspan="4">Loading transactions...</td></tr>';

  try {
    const res = await fetch("/history", {
      headers: { "Accept": "application/json" }
    });

    const data = await res.json();

    historyTable.innerHTML = '';

    if (!Array.isArray(data.transactions) || data.transactions.length === 0) {
      historyTable.innerHTML = '<tr><td colspan="4">No transactions found.</td></tr>';
      return;
    }

    data.transactions.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${tx.type ?? 'N/A'}</td>
        <td>${tx.amount ?? '-'}</td>
        <td>${tx.paid_to ?? "Unknown"}</td>
        <td>${tx.date ?? "-"}</td>
      `;
      historyTable.appendChild(row);
    });
  } catch (err) {
    historyTable.innerHTML = '<tr><td colspan="4">Failed to load history.</td></tr>';
    console.error("Error loading transaction history:", err);
  }
});
