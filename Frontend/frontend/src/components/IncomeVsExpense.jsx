

import { useEffect, useState } from 'react';
import { getIncomeVsExpense } from '../api/analytics';
import { useAuth } from '../utils/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

export default function IncomeVsExpenseChart() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const { t, i18n } = useTranslation();
  

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
      <h5>{t('IncomevsExpenseThisYear')}</h5>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#1d243c" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
