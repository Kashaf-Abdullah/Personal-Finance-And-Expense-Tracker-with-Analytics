import Sidebar from './Sidebar';
import SummaryWidget from './SummaryWidget';
import CategoryChart from './CategoryChart';
import TrendsChart from '../pages/TrendsChart';
import BudgetStatus from './BudgetStatus';
import TransactionsList from './TransactionsList';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <SummaryWidget />
        <div style={{ display: 'flex', gap: '2rem' }}>
          <CategoryChart />
          <TrendsChart />
        </div>
        <BudgetStatus />
        <TransactionsList />
      </main>
    </div>
  );
}
