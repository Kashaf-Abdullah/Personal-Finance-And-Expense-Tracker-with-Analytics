import { useState } from 'react';
import Sidebar from '../components/Sidebar';
const API = import.meta.env.VITE_API_URL;

export default function SendPage() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email || !file) return alert('Email and file required!');
    setSending(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('message', message);
    formData.append('file', file);

    const res = await fetch(`${API}/api/user/send-email`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setSending(false);
    if (data.success) {
      alert('Email sent successfully!');
      setEmail('');
      setFile(null);
      setMessage('');
    } else {
      alert(data.error || 'Failed to send email');
    }
  };

  return (
     <div className="d-flex">
          <Sidebar />
          <main className="container p-4">
            <h2>Calculator</h2>

    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4" style={{ maxWidth: 400, width: '100%' }}>
        <h4 className="mb-3 text-center">Send File via Email</h4>
        <form onSubmit={handleSend}>
          <div className="mb-3">
            <label className="form-label">Recipient Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Message (optional)</label>
            <textarea
              className="form-control"
              placeholder="Your message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={2}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Select File</label>
            <input
              type="file"
              className="form-control"
              onChange={e => setFile(e.target.files[0])}
              accept=".csv,.xlsx,.xls"
              required
            />
          </div>
          <button className="btn btn-success w-100" type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </form>
      </div>
    </div>
    </main>
    </div>
  );
}
