// import { useEffect, useState } from 'react';
// import { getIncomeVsExpense } from '../api/analytics';
// import { useAuth } from '../utils/useAuth';

// export default function IncomeVsExpense() {
//   const { token } = useAuth();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     getIncomeVsExpense(token).then(res => setData(res.data));
//   }, [token]);

//   if (!data) return <div className="alert alert-info">Loading income vs expense...</div>;

//   return (
//     <div className="card p-3 mb-3">
//       <h5>Income vs Expense (This Year)</h5>
//       <ul>
//         <li>Income: {data.income}</li>
//         <li>Expense: {data.expense}</li>
//         <li>Savings: {data.savings} ({data.savingsPercentage}%)</li>
//         <li>Expense Percentage: {data.expensePercentage}%</li>
//       </ul>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { getIncomeVsExpense } from '../api/analytics';
import { useAuth } from '../utils/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function IncomeVsExpenseChart() {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    getIncomeVsExpense(token).then(res => {
      if (res.data) {
        setData([
          { name: 'Income', value: res.data.income },
          { name: 'Expense', value: res.data.expense },
          { name: 'Savings', value: res.data.savings }
        ]);
      }
    });
  }, [token]);

  if (!data.length) return <div className="alert alert-info">Loading income vs expense...</div>;

  return (
    <div className="card p-3 mb-3">
      <h5>Income vs Expense (This Year)</h5>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
