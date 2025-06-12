import Sidebar from '../components/Sidebar';
import BudgetList from '../components/BudgetList';
import BudgetForm from '../components/BudgetForm';
import ExportButtons from '../components/ExportButtons';
import { useState } from 'react';

export default function BudgetsPage() {
  const [editing, setEditing] = useState(null);

  return (
    <div className="d-flex">
      <Sidebar />
      <main className="container-fluid p-4">
        <h2>Budgets</h2>
        <BudgetForm editing={editing} setEditing={setEditing} />
        <ExportButtons type="budgets" />
        <BudgetList setEditing={setEditing} />
      </main>
    </div>
  );
}
