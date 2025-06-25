

import Sidebar from '../components/Sidebar';
import SummaryWidget from '../components/SummaryWidget';
import CategoryChart from '../components/CategoryChart';
import TrendsChart from '../components/TrendsChart';
import IncomeVsExpenseChart from '../components/IncomeVsExpense';
import BudgetStatus from '../components/BudgetStatus';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  return (
    
    <div className="d-flex">
      <Sidebar />
      <main className="container-fluid ">
      <Navbar/>
      <div className="" style={{padding:"14px"}}>
        <SummaryWidget />
        <div className="row">
          <div className="col-md-6"><CategoryChart /></div>
          <div className="col-md-6"><TrendsChart /></div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6"><IncomeVsExpenseChart /></div>
          <div className="col-md-6"><BudgetStatus /></div>
        </div>
        </div>
      </main>
    </div>
  );
}
