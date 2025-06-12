// import { useEffect, useState } from 'react';
// import { getTrends } from '../api/analytics';
// import { useAuth } from '../utils/useAuth';

// export default function TrendsChart() {
//   const { token } = useAuth();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     getTrends(token).then(res => setData(res.data));
//   }, [token]);

//   if (!data) return <div className="alert alert-info">Loading trends...</div>;

//   return (
//     <div className="card p-3 mb-3">
//       <h5>Trends (Last 6 Months)</h5>
//       <ul>
//         {data.labels.map((month, i) => (
//           <li key={month}>
//             {month}: Income {data.income[i]}, Expense {data.expense[i]}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { getTrends } from '../api/analytics';
import { useAuth } from '../utils/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrendsChart() {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    getTrends(token).then(res => {
      if (res.data) {
        setData(res.data.labels.map((label, i) => ({
          month: label,
          Income: res.data.income[i],
          Expense: res.data.expense[i]
        })));
      }
    });
  }, [token]);

  if (!data.length) return <div className="alert alert-info">Loading trends...</div>;

  return (
    <div className="card p-3 mb-3">
      <h5>Income vs Expense (Last 6 Months)</h5>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Income" stroke="#28a745" />
          <Line type="monotone" dataKey="Expense" stroke="#dc3545" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
