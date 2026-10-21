'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  NotificationCategory,
  NotificationPreferences,
  CustomReminder,
  InAppNotificationItem,
} from '@/types/notification';

interface NotificationContextType {
  permission: NotificationPermission;
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  preferences: NotificationPreferences;
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
  history: InAppNotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  clearHistory: () => void;
  reminders: CustomReminder[];
  addCustomReminder: (reminder: Omit<CustomReminder, 'id' | 'createdAt'>) => void;
  updateCustomReminder: (reminder: CustomReminder) => void;
  removeReminder: (id: string) => void;
  sendTestNotification: (category: NotificationCategory) => Promise<boolean>;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  pujaTimings: true,
  dailySchedule: true,
  dailyScheduleTime: '07:30',
  savedPandals: true,
  customReminders: true,
  events: true,
};

const SEED_NOTIFICATIONS: InAppNotificationItem[] = [
  {
    id: 'seed-sandhi-2026',
    title: 'Maha Ashtami Sandhi Puja 2026 Muhurat',
    body: 'Sandhi Puja falls on Monday, Oct 19, 2026 from 09:12 AM to 10:00 AM. Balidan at exactly 09:36 AM.',
    category: 'puja-timings',
    timestamp: new Date().toISOString(),
    targetScreen: '/calendar',
    read: false,
  },
  {
    id: 'seed-barasat-kali',
    title: 'Barasat Kali Puja Illumination Guide Ready',
    body: 'Verified official public pandal map and multi-kilometer Chandannagar light gate corridors now live.',
    category: 'events',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    targetScreen: '/kali-puja',
    read: false,
  },
  {
    id: 'seed-metro-2026',
    title: 'Kolkata Metro Overnight Festive Service',
    body: 'Blue Line (Dakshineswar - Kavi Subhash) and Green Line operate continuous late-night festive specials.',
    category: 'events',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    targetScreen: '/metro',
    read: true,
  },
];

const PREFS_KEY = 'pujopath_notification_prefs';
const HISTORY_KEY = 'pujopath_notification_history';
const REMINDERS_KEY = 'pujopath_notification_reminders';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [history, setHistory] = useState<InAppNotificationItem[]>([]);
  const [reminders, setReminders] = useState<CustomReminder[]>([]);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage and check Web Notifications API support
  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }

    try {
      const savedPrefs = localStorage.getItem(PREFS_KEY);
      if (savedPrefs) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(savedPrefs) });
      }

      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else {
        setHistory(SEED_NOTIFICATIONS);
      }

      const savedReminders = localStorage.getItem(REMINDERS_KEY);
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (e) {
      console.warn('Failed to parse notifications data from localStorage', e);
    }
  }, []);

  // Save changes to localStorage
  const savePreferences = useCallback((newPrefs: NotificationPreferences) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(newPrefs));
    } catch (e) {}
  }, []);

  const saveHistory = useCallback((newHistory: InAppNotificationItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {}
  }, []);

  const saveReminders = useCallback((newReminders: CustomReminder[]) => {
    setReminders(newReminders);
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(newReminders));
    } catch (e) {}
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res === 'granted';
    } catch (e) {
      console.error('Error requesting notification permission', e);
      return false;
    }
  }, []);

  const updatePreferences = useCallback(
    (updates: Partial<NotificationPreferences>) => {
      savePreferences({ ...preferences, ...updates });
    },
    [preferences, savePreferences]
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      const updated = history.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveHistory(updated);
    },
    [history, saveHistory]
  );

  const markAllRead = useCallback(() => {
    const updated = history.map((n) => ({ ...n, read: true }));
    saveHistory(updated);
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  const addCustomReminder = useCallback(
    (item: Omit<CustomReminder, 'id' | 'createdAt'>) => {
      const reminder: CustomReminder = {
        ...item,
        id: `reminder-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [reminder, ...reminders];
      saveReminders(updated);

      // Also dispatch confirmation notice to history
      const notification: InAppNotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Reminder set: ${reminder.title}`,
        body: `Scheduled for ${new Date(reminder.scheduledTime).toLocaleString()}`,
        category: reminder.category,
        timestamp: new Date().toISOString(),
        targetScreen: reminder.targetScreen || '/calendar',
        read: false,
      };
      saveHistory([notification, ...history]);
    },
    [reminders, history, saveReminders, saveHistory]
  );

  const updateCustomReminder = useCallback(
    (reminder: CustomReminder) => {
      const updated = reminders.map((r) => (r.id === reminder.id ? reminder : r));
      saveReminders(updated);
    },
    [reminders, saveReminders]
  );

  const removeReminder = useCallback(
    (id: string) => {
      const updated = reminders.filter((r) => r.id !== id);
      saveReminders(updated);
    },
    [reminders, saveReminders]
  );

  const sendTestNotification = useCallback(
    async (category: NotificationCategory): Promise<boolean> => {
      const testContent: Record<NotificationCategory, { title: string; body: string; url: string }> = {
        'puja-timings': {
          title: 'Pushpanjali Muhurat Alert (Test)',
          body: 'Ashtami morning pushpanjali begins in 15 minutes. Prepare with pure flowers and sacred chants.',
          url: '/calendar',
        },
        'daily-schedule': {
          title: 'Daily Festive Morning Brief (Test)',
          body: 'Subho Maha Saptami! Nabapatrika Snan at dawn, followed by Bodhon and community Anandamela.',
          url: '/calendar',
        },
        'saved-pandals': {
          title: 'Nearby Pandal Darshan Alert (Test)',
          body: 'Bagbazar Sarbojanin crowd level is currently Moderate. Perfect time for darshan!',
          url: '/explore',
        },
        'custom-reminders': {
          title: 'Personal PujoPath Reminder (Test)',
          body: 'Time for evening Sandhya Aarati and pandal hopping route!',
          url: '/notifications',
        },
        events: {
          title: 'Kolkata Festive Event Update (Test)',
          body: 'Barasat Kali Puja carnival gates opened. Check live transit routes on the map.',
          url: '/kali-puja',
        },
      };

      const item = testContent[category] || testContent['puja-timings'];

      // Add to in-app history
      const newNotif: InAppNotificationItem = {
        id: `test-${Date.now()}`,
        title: item.title,
        body: item.body,
        category,
        timestamp: new Date().toISOString(),
        targetScreen: item.url,
        read: false,
      };

      const updatedHistory = [newNotif, ...history];
      saveHistory(updatedHistory);

      // Show browser Web Notification if supported and granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(item.title, {
            body: item.body,
            icon: '/icon.png',
            tag: category,
          });
          return true;
        } catch (e) {
          console.warn('Browser notification popup failed, fallback to in-app notification', e);
        }
      }

      return true;
    },
    [history, saveHistory]
  );

  const unreadCount = mounted ? history.filter((n) => !n.read).length : 0;
  const permissionGranted = mounted && permission === 'granted';

  return (
    <NotificationContext.Provider
      value={{
        permission,
        permissionGranted,
        requestPermission,
        preferences,
        updatePreferences,
        history,
        unreadCount,
        markNotificationRead,
        markAllRead,
        clearHistory,
        reminders,
        addCustomReminder,
        updateCustomReminder,
        removeReminder,
        sendTestNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
