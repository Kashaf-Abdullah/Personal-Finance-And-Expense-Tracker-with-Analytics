import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './utils/PrivateRoute';
  import AskGemini from './pages/AskGemini';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NotepadPage from './pages/NotepadPage';
import CalculatorPage from './pages/CalculatorPage';
import SendPage from './pages/SendPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/transactions" element={
          <PrivateRoute>
            <TransactionsPage />
          </PrivateRoute>
        } />
        <Route path="/budgets" element={
          <PrivateRoute>
            <BudgetsPage />
          </PrivateRoute>
        } />
        <Route path="/calculator" element={
    <PrivateRoute>
      <CalculatorPage />
    </PrivateRoute>
  } />
  <Route path="/notepad" element={
    <PrivateRoute>
      <NotepadPage />
    </PrivateRoute>
  } />
   <Route path="/send" element={
          <PrivateRoute>
            <SendPage />
          </PrivateRoute>
        } />
<Route path="/ask-gemini" element={
  <PrivateRoute>
    <AskGemini />
  </PrivateRoute>
} />

        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
