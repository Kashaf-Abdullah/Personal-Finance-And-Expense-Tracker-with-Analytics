const API = import.meta.env.VITE_API_URL;

export async function getBudgets(token) {
  const res = await fetch(`${API}/api/budgets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getBudgetStatus(token) {
  const res = await fetch(`${API}/api/budgets/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addBudget(token, data) {
  const res = await fetch(`${API}/api/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBudget(token, id, data) {
  const res = await fetch(`${API}/api/budgets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBudget(token, id) {
  return fetch(`${API}/api/budgets/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function exportBudgetsCSV(token) {
  window.open(`${API}/api/export/budgets/csv?token=${token}`, '_blank');
}
