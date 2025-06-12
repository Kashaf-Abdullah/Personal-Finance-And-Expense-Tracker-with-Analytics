import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { register } from '../api/auth';
import { useAuth } from '../utils/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  const handleRegister = async ({ username, email, password }) => {
    const res = await register(username, email, password);
    if (res.token) {
      saveToken(res.token);
      navigate('/dashboard');
    } else {
      alert(res.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <AuthForm onSubmit={handleRegister} isRegister={true} />
    </div>
  );
}
