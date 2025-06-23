const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
self.addEventListener('push', event => {
  let payload = {
    title: 'New Reminder',
    body: 'You have a new reminder',
    icon: '/logo192.png',
    badge: '/logo192.png',
  };

  try {
    if (event.data) {
      const data = event.data.json();
      payload = {
        ...payload,
        ...data
      };
    }
  } catch (err) {
    // fallback to default payload
    console.log(err)
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      vibrate: [200, 100, 200],
    })
  );
});


// Add this pushsubscriptionchange event listener below
self.addEventListener('pushsubscriptionchange', async event => {
  console.log('[Service Worker] Push Subscription change event fired.');
  const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    }).then(newSubscription => {
      // Send newSubscription to your backend to update the saved subscription
      return fetch('http://localhost:5000/api/reminders/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: newSubscription }),
      });
    })
  );
});

// Helper function to convert base64 key (if not already defined)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
