import { useEffect, useRef, useState } from 'react';
import { localDB } from '../services/localDatabase';

export const useOrderNotifications = () => {
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Initialize notification sound
    audioRef.current = new Audio('/notification.mp3');

    // Check notification permission
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }

    // Get initial order count
    const initialOrders = localDB.getOrders();
    setLastOrderCount(initialOrders.length);

    // Check for new orders every 10 seconds
    const interval = setInterval(() => {
      const orders = localDB.getOrders();
      const currentCount = orders.length;

      if (currentCount > lastOrderCount) {
        const newOrders = currentCount - lastOrderCount;
        setNewOrdersCount(newOrders);

        // Play notification sound
        playNotification();

        // Show browser notification
        showBrowserNotification(newOrders);

        // Update count
        setLastOrderCount(currentCount);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [lastOrderCount]);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore errors if sound can't play
      });
    }
  };

  const showBrowserNotification = (count: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nouvelle commande! 🎉', {
        body: `Vous avez ${count} nouvelle${count > 1 ? 's' : ''} commande${count > 1 ? 's' : ''}`,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'new-order',
        requireInteraction: false,
      });
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionGranted(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  };

  const clearNewOrders = () => {
    setNewOrdersCount(0);
  };

  return {
    newOrdersCount,
    permissionGranted,
    requestPermission,
    clearNewOrders,
  };
};
