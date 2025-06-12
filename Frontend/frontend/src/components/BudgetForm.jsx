import { useState, useEffect } from 'react';
import { addBudget, updateBudget } from '../api/budgets';
import { useAuth } from '../utils/useAuth';

export default function BudgetForm({ editing, setEditing }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ category: '', limit: '', period: 'monthly' });

  useEffect(() => {
    if (editing) setForm(editing);
    else setForm({ category: '', limit: '', period: 'monthly' });
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await updateBudget(token, editing._id, form);
    else await addBudget(token, form);
    setEditing(null);
    window.location.reload();
  };

  return (
    <form className="row g-2 mb-3" onSubmit={handleSubmit}>
      <div className="col">
        <input className="form-control" name="category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" required />
      </div>
      <div className="col">
        <input className="form-control" name="limit" value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} placeholder="Limit" required />
      </div>
      <div className="col">
        <select className="form-select" name="period" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className="col-auto">
        <button className="btn btn-success" type="submit">{editing ? 'Update' : 'Add'} Budget</button>
        {editing && <button className="btn btn-secondary ms-2" type="button" onClick={() => setEditing(null)}>Cancel</button>}
      </div>
    </form>
  );
}
