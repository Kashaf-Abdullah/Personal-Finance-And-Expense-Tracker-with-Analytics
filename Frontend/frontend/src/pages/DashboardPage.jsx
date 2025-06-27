import Sidebar from '../components/Sidebar';
import SummaryWidget from '../components/SummaryWidget';
import CategoryChart from '../components/CategoryChart';
import TrendsChart from '../components/TrendsChart';
import IncomeVsExpenseChart from '../components/IncomeVsExpense';
import BudgetStatus from '../components/BudgetStatus';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import useWindowWidth from '../hook/ScreenWidth.js'
export default function DashboardPage() {
    const [minimized, setMinimized] = useState(false);
     const width = useWindowWidth();


  return (
    
    <div className="d-flex">
      <Sidebar minimized={minimized} setMinimized={setMinimized} 
      
        className={width >= 768 ? "container-fluid" : ""}
      />
      {/* <main className="container-fluid "> */}
         <main
        className="container-fluid"
        style={{
          marginLeft: minimized ? 0 : 3, // Match your sidebar width
          transition: 'margin-left 0.3s'
        }}
      >
      <Navbar minimized={minimized}/>
      <div className="container" style={{padding:"24px"}}>
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