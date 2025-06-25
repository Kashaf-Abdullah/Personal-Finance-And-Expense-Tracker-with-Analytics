import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api/profile';
import { useAuth } from '../utils/useAuth';

export default function ProfileForm() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ username: '', email: '' });

  useEffect(() => {
    getProfile(token).then(res => {
      setProfile(res);
      setForm({ username: res.username, email: res.email });
    });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(token, form);
    alert('Profile updated!');
  };

  if (!profile) return <div className="alert alert-info">Loading...</div>;

  return (
    <form className="card p-4" onSubmit={handleSubmit}>
      <input className="form-control mb-2" name="username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
      <input className="form-control mb-2" name="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      <button className="btn" type="submit" style={{backgroundColor:'var(--color-primary)',color:'white'}}>Update Profile</button>
    </form>
  );
}
