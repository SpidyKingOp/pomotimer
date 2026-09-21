// Browser Native Push Notifications Manager

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'default' | 'granted' | 'denied'
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Notification permission request failed', err);
    return 'denied';
  }
}

export function sendPushNotification(title, body) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  try {
    const notification = new Notification(title, {
      body,
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'pomotimer-notification',
      renotify: true,
      silent: false
    });

    // Auto close after 6 seconds
    setTimeout(() => {
      notification.close();
    }, 6000);

    // Focus window when user clicks notification
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (err) {
    console.warn('Failed to send notification:', err);
  }
}
