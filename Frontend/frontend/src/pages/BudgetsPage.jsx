import Sidebar from '../components/Sidebar';
import BudgetList from '../components/BudgetList';
import BudgetForm from '../components/BudgetForm';
import ExportButtons from '../components/ExportButtons';
import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function BudgetsPage() {
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
        <h2>Budgets</h2>
        <BudgetForm editing={editing} setEditing={setEditing} />
        <ExportButtons type="budgets" />
        <BudgetList setEditing={setEditing} />
        </div>
      </main>
    </div>
  );
}
