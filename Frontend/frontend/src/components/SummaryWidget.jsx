
import { useEffect, useState } from 'react';
import { getSummary } from '../api/analytics';
import { useAuth } from '../utils/useAuth';
import { useTranslation } from 'react-i18next';

export default function SummaryWidget() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getSummary(token).then(res => setSummary(res.data));
  }, [token]);

  if (!summary) return <div className="alert alert-info">Loading summary...</div>;

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <div className="card text-white  mb-3" style={{backgroundColor:'var(--color-primary-light)'}}>
          <div className="card-body">
            <h5 className="card-title">{t('Income')}</h5>
            <p className="card-text">{summary.totalIncome}</p>
            <small>Trend: {summary.incomeTrend}%</small>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white  mb-3"  style={{backgroundColor:'var(--color-secondary)'}}>
          <div className="card-body">
            <h5 className="card-title">{t('expense')}</h5>
            <p className="card-text">{summary.totalExpense}</p>
            <small>Trend: {summary.expenseTrend}%</small>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white mb-3"  style={{backgroundColor:'var(--color-secondary-light)'}}>
          <div className="card-body">
            <h5 className="card-title">{t('balance')}</h5>
            <p className="card-text">{summary.balance}</p>
            <small>Trend: {summary.balanceTrend}%</small>
          </div>
        </div>
      </div>
    </div>
  );
}

