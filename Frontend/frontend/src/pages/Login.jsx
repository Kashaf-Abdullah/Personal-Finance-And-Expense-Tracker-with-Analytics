

import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { login } from '../api/auth';
import { useAuth } from '../utils/useAuth';

const demoAccounts = [
  { label: 'Demo user', email: 'demo.user@finance-tracker.test', password: 'UserDemo123!' },
  { label: 'Demo admin', email: 'demo.admin@finance-tracker.test', password: 'AdminDemo123!' }
];

export default function Login() {
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  const handleLogin = async ({ email, password }) => {
    const res = await login(email, password);
    if (res.token) {
      saveToken(res.token);
      navigate('/dashboard');
    } else {
      alert(res.message || 'Login failed');
    }
  };

  return (
    <AuthForm
      onSubmit={handleLogin}
      isRegister={false}
      demoAccounts={demoAccounts}
      toggleLink={
        <span>
          Don't have an account?{' '}
          <Link className="auth-toggle-link" to="/register">Register</Link>
        </span>
      }
    />
  );
}
