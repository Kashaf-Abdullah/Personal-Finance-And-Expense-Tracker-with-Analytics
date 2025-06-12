import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <nav className="sidebar bg-dark text-white p-3">
      <ul className="nav flex-column">
        <li className="nav-item"><Link className="nav-link text-white" to="/dashboard">Dashboard</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/transactions">Transactions</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/budgets">Budgets</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/profile">Profile</Link></li>
        <li className="nav-item">
          <button className="btn btn-danger mt-2" onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}
