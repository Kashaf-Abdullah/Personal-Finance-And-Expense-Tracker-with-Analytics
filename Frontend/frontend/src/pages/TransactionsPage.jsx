import Sidebar from '../components/Sidebar';
import TransactionsList from '../components/TransactionsList';
import TransactionForm from '../components/TransactionsForm';
import ExportButtons from '../components/ExportButtons';
import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function TransactionsPage() {
  const [editing, setEditing] = useState(null);

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="container-fluid">
       <Navbar/>
         <div className="" style={{padding:"14px"}}>
        <h2>Transactions</h2>
        <TransactionForm editing={editing} setEditing={setEditing} />
        <ExportButtons type="transactions" />
        <TransactionsList setEditing={setEditing} />
        </div>
      </main>
    </div>
  );
}
