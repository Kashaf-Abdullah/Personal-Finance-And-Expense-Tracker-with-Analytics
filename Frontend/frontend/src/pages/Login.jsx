

import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { login } from '../api/auth';
import { useAuth } from '../utils/useAuth';

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
      toggleLink={
        <span>
          Don't have an account?{' '}
          <Link className="auth-toggle-link" to="/register">Register</Link>
        </span>
      }
    />
  );
}
