import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../api/transactions';
import { useAuth } from '../utils/useAuth';

export default function TransactionsList({ setEditing }) {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions(token).then(res => setTransactions(res.data || []));
  }, [token]);

  const handleDelete = async (id) => {
    await deleteTransaction(token, id);
    setTransactions(transactions.filter(tx => tx._id !== id));
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Amount</th>
          <th>Type</th>
          <th>Category</th>
          <th>Date</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx._id}>
            <td>{tx.amount}</td>
            <td>{tx.type}</td>
            <td>{tx.category}</td>
            <td>{new Date(tx.date).toLocaleDateString()}</td>
            <td>{tx.description}</td>
            <td>
              <button className="btn btn-sm btn-secondary me-1" onClick={() => setEditing(tx)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tx._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
