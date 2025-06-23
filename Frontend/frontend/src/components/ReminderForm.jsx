// import React, { useState } from 'react';

// // Helper function: Convert VAPID key to Uint8Array
// function urlBase64ToUint8Array(base64String) {
//   const padding = '='.repeat((4 - base64String.length % 4) % 4);
//   const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
//   const rawData = window.atob(base64);
//   return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
// }

// export default function ReminderForm() {
//   const [name, setName] = useState('');
//   const [date, setDate] = useState('');
//   const [status, setStatus] = useState('');

// //   const VAPID_PUBLIC_KEY = 'YOUR_PUBLIC_VAPID_KEY'; // Backend se generate ki hui key yahan dalein
// const VAPID_PUBLIC_KEY = 'BFQvtCmscob5Up5u1kENBzBztYdJXiWmPfkESkEZp3uffk4mHUKWR1VXYtO3dj9N9PZ0_DDHTHZnaK-s92V5gM0';
//   // Register service worker and subscribe user for push notifications
//   async function subscribeUser() {
//     if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
//       alert('Push notifications are not supported by your browser.');
//       return null;
//     }

//     const registration = await navigator.serviceWorker.register('/service-worker.js');
//     let subscription = await registration.pushManager.getSubscription();

//     if (!subscription) {
//       subscription = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
//       });
//     }

//     // Send subscription to backend
//     await fetch('/api/reminders/subscribe', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ subscription }),
//     });

//     return subscription;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!name || !date) {
//       alert('Please enter both name and date');
//       return;
//     }

//     setStatus('Requesting notification permission...');
//     const permission = await Notification.requestPermission();
//     if (permission !== 'granted') {
//       setStatus('Notification permission denied');
//       return;
//     }

//     setStatus('Subscribing to push notifications...');
//     const subscription = await subscribeUser();
//     if (!subscription) {
//       setStatus('Failed to subscribe for notifications');
//       return;
//     }

//     setStatus('Saving reminder...');
//     const reminder = {
//       id: Date.now(),
//       name,
//       date,
//     };

//     const response = await fetch('/api/reminders', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ reminder, subscription }),
//     });

//     const data = await response.json();
//     if (data.success) {
//       setStatus('Reminder set successfully!');
//       setName('');
//       setDate('');
//     } else {
//       setStatus('Failed to set reminder');
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
//       <h2>Set Reminder</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: 12 }}>
//           <label>Reminder Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={e => setName(e.target.value)}
//             required
//             style={{ width: '100%', padding: 8 }}
//           />
//         </div>
//         <div style={{ marginBottom: 12 }}>
//           <label>Reminder Date</label>
//           <input
//             type="date"
//             value={date}
//             onChange={e => setDate(e.target.value)}
//             required
//             style={{ width: '100%', padding: 8 }}
//           />
//         </div>
//         <button type="submit" style={{ padding: 10, width: '100%' }}>
//           Set Reminder
//         </button>
//       </form>
//       <p>{status}</p>
//     </div>
//   );
// }
