import { useEffect, useState } from 'react';
import { getBudgetStatus } from '../api/budgets';
import { useAuth } from '../utils/useAuth';

export default function BudgetStatus() {
  const { token } = useAuth();
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    getBudgetStatus(token).then(res => setBudgets(res.data));
  }, [token]);

  if (!budgets.length) return <div className="alert alert-info">No Budgets</div>;

  return (
    <div className="card p-3 mb-3">
      <h5>Budgets</h5>
      <ul>
        {budgets.map(b => (
          <li key={b._id}>
            {b.category}: {b.currentSpent}/{b.limit} ({b.utilization}%)
            <span className={`ms-2 badge bg-${b.status === 'Exceeded' ? 'danger' : b.status === 'Warning' ? 'warning' : 'success'}`}>
              {b.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
