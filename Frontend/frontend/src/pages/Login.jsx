import { useNavigate } from 'react-router-dom';
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
    <div className="container mt-5">
      <h2>Login</h2>
      <AuthForm onSubmit={handleLogin} isRegister={false} />
      
    </div>
  );
}
