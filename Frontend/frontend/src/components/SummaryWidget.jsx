// import { useEffect, useState } from 'react';
// import { getSummary } from '../api/analytics';
// import { useAuth } from '../utils/useAuth';

// export default function SummaryWidget() {
//   const { token } = useAuth();
//   const [summary, setSummary] = useState(null);

//   useEffect(() => {
//     getSummary(token).then(res => setSummary(res.data));
//   }, [token]);

//   if (!summary) return <div className="alert alert-info">Loading summary...</div>;

//   return (
//     <div className="card p-3 mb-3">
//       <h5>Summary</h5>
//       <div className="row">
//         <div className="col"><strong>Income:</strong> {summary.totalIncome}</div>
//         <div className="col"><strong>Expense:</strong> {summary.totalExpense}</div>
//         <div className="col"><strong>Balance:</strong> {summary.balance}</div>
//       </div>
//       <div className="row mt-2">
//         <div className="col">Income Trend: {summary.incomeTrend}%</div>
//         <div className="col">Expense Trend: {summary.expenseTrend}%</div>
//         <div className="col">Balance Trend: {summary.balanceTrend}%</div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { getSummary } from '../api/analytics';
import { useAuth } from '../utils/useAuth';

export default function SummaryWidget() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getSummary(token).then(res => setSummary(res.data));
  }, [token]);

  if (!summary) return <div className="alert alert-info">Loading summary...</div>;

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card text-white bg-success mb-3">
          <div className="card-body">
            <h5 className="card-title">Income</h5>
            <p className="card-text">{summary.totalIncome}</p>
            <small>Trend: {summary.incomeTrend}%</small>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-danger mb-3">
          <div className="card-body">
            <h5 className="card-title">Expense</h5>
            <p className="card-text">{summary.totalExpense}</p>
            <small>Trend: {summary.expenseTrend}%</small>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-primary mb-3">
          <div className="card-body">
            <h5 className="card-title">Balance</h5>
            <p className="card-text">{summary.balance}</p>
            <small>Trend: {summary.balanceTrend}%</small>
          </div>
        </div>
      </div>
    </div>
  );
}

