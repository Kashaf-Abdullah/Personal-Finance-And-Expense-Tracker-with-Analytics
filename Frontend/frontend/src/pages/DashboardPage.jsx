// import Sidebar from '../components/Sidebar';
// import SummaryWidget from '../components/SummaryWidget';
// import CategoryChart from '../components/CategoryChart';
// import TrendsChart from '../components/TrendsChart';
// import IncomeVsExpenseChart from '../components/IncomeVsExpense';
// import BudgetStatus from '../components/BudgetStatus';
// import Navbar from '../components/Navbar';
// import { useState } from 'react';
// import useWindowWidth from '../hook/ScreenWidth.js'
// export default function DashboardPage() {
//     const [minimized, setMinimized] = useState(false);
//      const width = useWindowWidth();


//   return (
    
//     <div className="d-flex">
//       <Sidebar minimized={minimized} setMinimized={setMinimized} 
      
//         className={width >= 768 ? "container-fluid" : ""}
//       />
//       {/* <main className="container-fluid "> */}
//          <main
//         className="container-fluid"
//         style={{
//           marginLeft: minimized ? 0 : 3, // Match your sidebar width
//           transition: 'margin-left 0.3s'
//         }}
//       >
//       <Navbar minimized={minimized}/>
//       <div className="container" style={{padding:"24px"}}>
//         <SummaryWidget />
//         <div className="row">
//           <div className="col-md-6"><CategoryChart /></div>
//           <div className="col-md-6"><TrendsChart /></div>
//         </div>
//         <div className="row mt-4">
//           <div className="col-md-6"><IncomeVsExpenseChart /></div>
//           <div className="col-md-6"><BudgetStatus /></div>
//         </div>
//         </div>
//       </main>
//     </div>
//   );
// } 


import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { getCategoryAnalytics, getIncomeVsExpense, getTrends, getBudgets } from '../api/analytics'; // Same API
import { useAuth } from '../utils/useAuth'; // Your custom auth hook
import { useTranslation } from 'react-i18next';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [categoryData, setCategoryData] = useState([]);
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = ['#1d243c', '#2a314e', '#5a5f7a', '#898da5', '#3739fb', '#324480', '#05174f', '#0b216b', '#0a278a', '#424652'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, barRes, trendRes, budgetRes] = await Promise.all([
          getCategoryAnalytics(token),
          getIncomeVsExpense(token),
          getTrends(token),
          getBudgets(token),
        ]);

        // Pie Chart
        if (catRes?.labels && catRes?.values) {
          setCategoryData(catRes.labels.map((label, i) => ({
            name: label,
            population: catRes.values[i],
            color: colors[i % colors.length],
            legendFontColor: "#333",
            legendFontSize: 12,
          })));
        }

        // Bar Chart
        if (barRes) {
          setBarData({
            labels: ['Income', 'Expense', 'Savings'],
            datasets: [{ data: [barRes.income, barRes.expense, barRes.savings] }]
          });
        }

        // Line Chart
        if (trendRes) {
          setLineData({
            labels: trendRes.labels,
            datasets: [
              {
                data: trendRes.income,
                color: () => '#2a314e',
                strokeWidth: 2
              },
              {
                data: trendRes.expense,
                color: () => '#5a5f7a',
                strokeWidth: 2
              }
            ],
            legend: ['Income', 'Expense']
          });
        }

        setBudgets(budgetRes?.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Dashboard error:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('TopExpenseCategories')}</Text>
      <PieChart
        data={categoryData}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="10"
        center={[10, 10]}
        absolute
      />

      <Text style={styles.title}>{t('IncomevsExpenseThisYear')}</Text>
      {barData && (
        <BarChart
          data={barData}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
        />
      )}

      <Text style={styles.title}>{t('IncomevsExpenseLast6Months')}</Text>
      {lineData && (
        <LineChart
          data={lineData}
          width={screenWidth - 20}
          height={240}
          chartConfig={chartConfig}
          bezier
        />
      )}

      <Text style={styles.title}>{t('budgets')}</Text>
      {budgets.map(b => (
        <View key={b._id} style={styles.budgetItem}>
          <Text>{b.category}: {b.currentSpent}/{b.limit} ({b.utilization}%)</Text>
          <Text style={[styles.badge, {
            backgroundColor: b.status === 'Exceeded' ? '#dc3545' :
              b.status === 'Warning' ? '#ffc107' : '#28a745'
          }]}>
            {b.status}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#f6f6f6",
  backgroundGradientTo: "#f6f6f6",
  color: (opacity = 1) => `rgba(29, 36, 60, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  budgetItem: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  badge: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12
  }
});
