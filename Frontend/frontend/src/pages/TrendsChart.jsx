import { useEffect, useState } from 'react';
import { getTrends } from '../api/analytics';
import { useAuth } from '../utils/useAuth';

export default function TrendsChart() {
  const { token } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    getTrends(token).then(res => setData(res.data));
  }, [token]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h3>Trends (Last 6 Months)</h3>
      <ul>
        {data.labels.map((month, i) => (
          <li key={month}>
            {month}: Income {data.income[i]}, Expense {data.expense[i]}
          </li>
        ))}
      </ul>
    </div>
  );
}
