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
import { useTranslation } from 'react-i18next';

const COLORS = ['#1d243c', '#2a314e', '#5a5f7a', '#898da5', '#3739fb', '#324480', '#05174f', '#0b216b', '#0a278a', '#424652'];

export default function CategoryChart() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const { t, i18n } = useTranslation();

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
      <h5>{t('TopExpenseCategories')}</h5>
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
