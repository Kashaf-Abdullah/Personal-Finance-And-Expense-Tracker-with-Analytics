

import { useState } from 'react';
// import './AuthForm.css';

export default function AuthForm({ onSubmit, isRegister, toggleLink, demoAccounts = [] }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <div className="auth-center-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title mb-3">{isRegister ? 'Register' : 'Login'}</h2>
        {isRegister && (
          <div className="form-group mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              className="form-control"
              name="username"
              id="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            className="form-control"
            name="email"
            id="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            className="form-control"
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button  className=" logRegBtn w-100 mb-2" type="submit" disabled={loading}>
          {loading ? 'Please wait...' : (isRegister ? 'Register' : 'Login')}
        </button>
        <div className="text-center mt-2">
          {toggleLink}
        </div>
        {demoAccounts.length > 0 && (
          <section className="demo-accounts mt-4" aria-label="Demo login credentials">
            <h3 className="demo-accounts-title">Try a demo account</h3>
            <p className="mb-2"><small>Run <code>npm run seed</code> in the Backend folder first.</small></p>
            {demoAccounts.map((account) => (
              <div className="demo-account" key={account.email}>
                <div>
                  <strong>{account.label}</strong>
                  <div><small>Email: <code>{account.email}</code></small></div>
                  <div><small>Password: <code>{account.password}</code></small></div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary mt-2"
                  onClick={() => setForm((current) => ({
                    ...current,
                    email: account.email,
                    password: account.password
                  }))}
                >
                  Use account
                </button>
              </div>
            ))}
          </section>
        )}
      </form>
    </div>
  );
}
