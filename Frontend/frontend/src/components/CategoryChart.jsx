// import { useEffect, useState } from 'react';
// import { getCategoryAnalytics } from '../api/analytics';
// import { useAuth } from '../utils/useAuth';

// export default function CategoryChart() {
//   const { token } = useAuth();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     getCategoryAnalytics(token).then(res => setData(res.data));
//   }, [token]);

//   if (!data) return <div className="alert alert-info">Loading categories...</div>;

//   return (
//     <div className="card p-3 mb-3">
//       <h5>Top Categories</h5>
//       <ul>
//         {data.labels.map((cat, i) => (
//           <li key={cat}>{cat}: {data.values[i]}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { getCategoryAnalytics } from '../api/analytics';
import { useAuth } from '../utils/useAuth';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

export default function CategoryChart() {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    getCategoryAnalytics(token).then(res => {
      if (res.data) {
        setData(res.data.labels.map((label, i) => ({
          name: label,
          value: res.data.values[i]
        })));
      }
    });
  }, [token]);

  if (!data.length) return <div className="alert alert-info">Loading categories...</div>;

  return (
    <div className="card p-3 mb-3">
      <h5>Top Expense Categories</h5>
      <PieChart width={330} height={250}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
          {data.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
