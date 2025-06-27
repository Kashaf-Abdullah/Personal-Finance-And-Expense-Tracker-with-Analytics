import Sidebar from '../components/Sidebar';
import TransactionsList from '../components/TransactionsList';
import TransactionForm from '../components/TransactionsForm';
import ExportButtons from '../components/ExportButtons';
import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function TransactionsPage() {
  const [editing, setEditing] = useState(null);
 const [minimized, setMinimized] = useState(false);

  return (
    <div className="d-flex">
     <Sidebar minimized={minimized} setMinimized={setMinimized}  />
          {/* <main className="container-fluid "> */}
             <main
            className="container-fluid"
            style={{
              marginLeft: minimized ? 0 : 18, // Match your sidebar width
              transition: 'margin-left 0.3s'
            }}
          >
          <Navbar minimized={minimized}/>
       
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
