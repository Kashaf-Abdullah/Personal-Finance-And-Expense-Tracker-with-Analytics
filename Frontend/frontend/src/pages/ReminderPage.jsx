import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const API = import.meta.env.VITE_API_URL;
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

const ReminderPage = () => {
  const [reminders, setReminders] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    async function subscribeUser() {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission denied');
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        const token = localStorage.getItem('token');

        const res = await fetch(`${API}/api/reminders/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subscription }),
        });

        if (!res.ok) {
          const error = await res.json();
          console.error('Failed to save subscription:', error);
        } else {
          console.log('Subscription saved successfully');
        }
      } catch (error) {
        console.error('Subscription error:', error);
      }
    }

    subscribeUser();
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/reminders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReminders(data);
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
    }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    if (!name || !date) {
      alert('Please enter both name and date');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/reminders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, date }),
      });

      if (res.ok) {
        setName('');
        setDate('');
        fetchReminders();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to add reminder');
      }
    } catch (error) {
      console.error('Add reminder error:', error);
    }
  };



 const deleteReminder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/reminders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchReminders();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete reminder');
      }
    } catch (error) {
      console.error('Delete reminder error:', error);
    }
  };
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      background: '#f9fafb',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '24px',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '32px',
      justifyContent: 'center',
    },
    input: {
      flex: '1 1 200px',
      padding: '10px 14px',
      fontSize: '1rem',
      border: '1.5px solid #ccc',
      borderRadius: '6px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    inputFocus: {
      borderColor: '#3b82f6',
    },
    button: {
      padding: '10px 24px',
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: '600',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      flex: '0 0 auto',
    },
    buttonHover: {
      backgroundColor: '#2563eb',
    },
    list: {
      listStyle: 'none',
      paddingLeft: 0,
      maxHeight: '400px',
      overflowY: 'auto',
      borderTop: '1px solid #ddd',
    },
    listItem: {
      padding: '12px 0',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'space-between',
      color: '#444',
      fontSize: '1rem',
    },
     deleteButton: {
      marginLeft: '10px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      cursor: 'pointer',
    },
  };

  return (
     <div className="d-flex">
          <Sidebar />
          <main className="container-fluid p-4">
    <div >
      <h2 style={styles.heading}>My Reminders</h2>
      <form onSubmit={addReminder} style={styles.form}>
        <input
          type="text"
          placeholder="Reminder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Add Reminder
        </button>
      </form>

      <ul style={styles.list}>
        {reminders.map((reminder) => (
          <li key={reminder._id} style={styles.listItem}>
            <span>{reminder.name}</span>
            <span>{new Date(reminder.date).toLocaleDateString()}</span>
        <button
              onClick={() => deleteReminder(reminder._id)}
              style={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
        </main>
    </div>
  );
};

export default ReminderPage;
