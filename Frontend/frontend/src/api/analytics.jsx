const API = import.meta.env.VITE_API_URL;

export async function getSummary(token) {
  const res = await fetch(`${API}/api/analytics/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getCategoryAnalytics(token) {
  const res = await fetch(`${API}/api/analytics/category`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getTrends(token) {
  const res = await fetch(`${API}/api/analytics/trends`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getIncomeVsExpense(token) {
  const res = await fetch(`${API}/api/analytics/income-vs-expense`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
