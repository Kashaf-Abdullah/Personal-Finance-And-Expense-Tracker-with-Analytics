import { useEffect, useState } from 'react';
import { getBudgets, deleteBudget } from '../api/budgets';
import { useAuth } from '../utils/useAuth';

export default function BudgetList({ setEditing }) {
  const { token } = useAuth();
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    getBudgets(token).then(res => setBudgets(res.data || []));
  }, [token]);

  const handleDelete = async (id) => {
    await deleteBudget(token, id);
    setBudgets(budgets.filter(b => b._id !== id));
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Category</th>
          <th>Limit</th>
          <th>Current Spent</th>
          <th>Period</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {budgets.map(b => (
          <tr key={b._id}>
            <td>{b.category}</td>
            <td>{b.limit}</td>
            <td>{b.currentSpent}</td>
            <td>{b.period}</td>
            <td>
              <button className="btn btn-sm btn-secondary me-1" onClick={() => setEditing(b)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
