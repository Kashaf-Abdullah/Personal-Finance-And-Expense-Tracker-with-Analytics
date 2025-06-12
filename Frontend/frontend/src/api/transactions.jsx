const API = import.meta.env.VITE_API_URL;

export async function getTransactions(token) {
  const res = await fetch(`${API}/api/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addTransaction(token, data) {
  const res = await fetch(`${API}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTransaction(token, id, data) {
  const res = await fetch(`${API}/api/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTransaction(token, id) {
  return fetch(`${API}/api/transactions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function exportTransactionsCSV(token) {
  window.open(`${API}/api/export/transactions/csv?token=${token}`, '_blank');
}
