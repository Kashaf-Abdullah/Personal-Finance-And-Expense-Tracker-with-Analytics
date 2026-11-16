import { useState, useEffect } from 'react';
import { addTransaction, updateTransaction } from '../api/transactions';
import { getBudgets } from '../api/budgets';
import { useAuth } from '../utils/useAuth';

const OTHER_CATEGORY = '__other__';

export default function TransactionForm({ editing, setEditing }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ amount: '', type: 'expense', category: '', date: '', description: '' });
  const [categories, setCategories] = useState([]);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    if (editing) {
      setForm(editing);
    } else {
      setForm({ amount: '', type: 'expense', category: '', date: '', description: '' });
      setIsOtherCategory(false);
    }
  }, [editing]);

  useEffect(() => {
    if (editing && form.category === editing.category) {
      setIsOtherCategory(!categories.includes(editing.category));
    }
  }, [editing, categories, form.category]);

  useEffect(() => {
    getBudgets(token)
      .then(response => {
        if (!response.success) {
          throw new Error(response.error || 'Unable to load budget categories');
        }
        setCategories([...new Set((response.data || []).map(budget => budget.category).filter(Boolean))]);
      })
      .catch(error => {
        console.error('Failed to load budget categories:', error);
        setCategoryError('Unable to load budget categories. You can still enter one using Other.');
      });
  }, [token]);

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
        <select
          className="form-select"
          name="category"
          value={isOtherCategory ? OTHER_CATEGORY : form.category}
          onChange={e => {
            const isOther = e.target.value === OTHER_CATEGORY;
            setIsOtherCategory(isOther);
            setForm({ ...form, category: isOther ? '' : e.target.value });
          }}
          required={!isOtherCategory}
        >
          <option value="">Select category</option>
          {categories.map(category => <option key={category} value={category}>{category}</option>)}
          <option value={OTHER_CATEGORY}>Other</option>
        </select>
        {isOtherCategory && (
          <input
            className="form-control mt-2"
            name="otherCategory"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            placeholder="Type a category"
            required
          />
        )}
        {categoryError && <small className="text-danger">{categoryError}</small>}
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
