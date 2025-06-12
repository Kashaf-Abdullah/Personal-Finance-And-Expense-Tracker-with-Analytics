// const API = import.meta.env.VITE_API_URL;

// export function exportTransactionsCSV(token) {
//   window.open(`${API}/api/export/transactions/csv?token=${token}`, '_blank');
// }

// export function exportBudgetsCSV(token) {
//   window.open(`${API}/api/export/budgets/csv?token=${token}`, '_blank');
// }



const API = import.meta.env.VITE_API_URL;

export async function exportTransactionsCSV(token) {
  const res = await fetch(`${API}/api/export/transactions/csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    alert('Export failed!');
    return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function exportBudgetsCSV(token) {
  const res = await fetch(`${API}/api/export/budgets/csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    alert('Export failed!');
    return;
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'budgets.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
