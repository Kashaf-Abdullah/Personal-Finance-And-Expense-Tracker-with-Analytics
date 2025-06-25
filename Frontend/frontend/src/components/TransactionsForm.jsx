import { useState, useEffect } from 'react';
import { addTransaction, updateTransaction } from '../api/transactions';
import { useAuth } from '../utils/useAuth';

export default function TransactionForm({ editing, setEditing }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ amount: '', type: 'expense', category: '', date: '', description: '' });

  useEffect(() => {
    if (editing) setForm(editing);
    else setForm({ amount: '', type: 'expense', category: '', date: '', description: '' });
  }, [editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await updateTransaction(token, editing._id, form);
    else await addTransaction(token, form);
    setEditing(null);
    window.location.reload();
  };

  return (
    <form className="row g-2 mb-3" onSubmit={handleSubmit}>
      <div className="col">
        <input className="form-control" name="amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="Amount" required />
      </div>
      <div className="col">
        <select className="form-select" name="type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="col">
        <input className="form-control" name="category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" required />
      </div>
      <div className="col">
        <input className="form-control" name="date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
      </div>
      <div className="col">
        <input className="form-control" name="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
      </div>
      <div className="col-auto">
        <button className="btn"  style={{backgroundColor:'var(--color-primary)',color:'white'}} type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button className="btn ms-2"  style={{backgroundColor:'var(--color-primary)',color:'white'}} type="button" onClick={() => setEditing(null)}>Cancel</button>}
      </div>
    </form>
  );
}
