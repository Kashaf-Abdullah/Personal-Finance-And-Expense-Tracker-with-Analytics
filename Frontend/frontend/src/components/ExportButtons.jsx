// import { exportTransactionsCSV } from '../api/export';
// import { exportBudgetsCSV } from '../api/export';
// import { useAuth } from '../utils/useAuth';

// export default function ExportButtons({ type }) {
//   const { token } = useAuth();
//   return (
//     <div className="mb-3">
//       {type === "transactions" && <button className="btn btn-outline-primary" onClick={() => exportTransactionsCSV(token)}>Export Transactions CSV</button>}
//       {type === "budgets" && <button className="btn btn-outline-primary" onClick={() => exportBudgetsCSV(token)}>Export Budgets CSV</button>}
//     </div>
//   );
// }





// import { exportTransactionsCSV, exportBudgetsCSV } from '../api/export';
// import { useAuth } from '../utils/useAuth';

// export default function ExportButtons({ type }) {
//   const { token } = useAuth();
//   return (
//     <div className="mb-3">
//       {type === "transactions" && (
//         <button
//           className="btn btn-outline-primary"
//           onClick={() => exportTransactionsCSV(token)}
//         >
//           Export Transactions CSV
//         </button>
//       )}
//       {type === "budgets" && (
//         <button
//           className="btn btn-outline-primary"
//           onClick={() => exportBudgetsCSV(token)}
//         >
//           Export Budgets CSV
//         </button>
//       )}
//     </div>
//   );
// }



import { exportTransactionsCSV, exportBudgetsCSV } from '../api/export';
import { useAuth } from '../utils/useAuth';

export default function ExportButtons({ type }) {
  const { token } = useAuth();
  return (
    <div className="mb-3">
      {type === "transactions" && (
        <button className="btn btn-outline-primary" onClick={() => exportTransactionsCSV(token)}>
          Export Transactions CSV
        </button>
      )}
      {type === "budgets" && (
        <button className="btn btn-outline-primary" onClick={() => exportBudgetsCSV(token)}>
          Export Budgets CSV
        </button>
      )}
    </div>
  );
}
