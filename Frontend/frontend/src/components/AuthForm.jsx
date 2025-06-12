import { useState } from 'react';

export default function AuthForm({ onSubmit, isRegister }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form className="card p-4" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      {isRegister && (
        <input className="form-control mb-2" name="username" placeholder="Username" onChange={handleChange} required />
      )}
      <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} required />
      <input className="form-control mb-2" name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button className="btn btn-primary w-100" type="submit">{isRegister ? 'Register' : 'Login'}</button>
    </form>
  );
}
