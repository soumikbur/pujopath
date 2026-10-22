import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppState, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import {
  NotificationPreferences,
  CustomReminder,
  InAppNotificationItem,
  NotificationCategory,
} from '@/types/notification';
import {
  setupNotificationChannels,
  requestNotificationPermissions,
  checkNotificationPermissions,
  scheduleLocalNotification,
  scheduleDailyMorningNotification,
  scheduleVerifiedPujaRituals,
  scheduleSavedPandalReminder,
  sendInstantTestNotification,
  sendDelayedTestNotification,
  dismissAllShadeNotifications,
  reconcileActiveReminders,
  isChannelEnabled,
  cancelNotification,
  cancelAllScheduledNotifications,
  getAllScheduledNotifications,
} from '@/services/notificationService';
import { useLanguage } from '@/context/LanguageContext';

const PREFS_STORAGE_KEY = '@pujopath_notification_prefs';
const REMINDERS_STORAGE_KEY = '@pujopath_custom_reminders';
const HISTORY_STORAGE_KEY = '@pujopath_notification_history';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  pujaTimings: true,
  dailySchedule: true,
  dailyScheduleTime: '07:30',
  savedPandals: true,
  customReminders: true,
  events: true,
};

interface NotificationContextType {
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  openSettings: () => Promise<void>;
  preferences: NotificationPreferences;
  updatePreferences: (patch: Partial<NotificationPreferences>) => Promise<void>;
  reminders: CustomReminder[];
  addCustomReminder: (
    item: Omit<CustomReminder, 'id' | 'createdAt'>
  ) => Promise<string | null>;
  updateCustomReminder: (
    id: string,
    item: Partial<Omit<CustomReminder, 'id' | 'createdAt'>>
  ) => Promise<boolean>;
  removeReminder: (id: string) => Promise<void>;
  history: InAppNotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  sendTestNotification: (category?: NotificationCategory) => Promise<void>;
  sendDelayedTest: (seconds?: number, category?: NotificationCategory) => Promise<void>;
  clearShadeAlerts: () => Promise<void>;
  activeScheduledCount: number;
  refreshScheduledCount: () => Promise<void>;
  checkChannelState: (category: NotificationCategory) => Promise<boolean>;
  pendingNavigation: { screen: string; params?: any } | null;
  clearPendingNavigation: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [reminders, setReminders] = useState<CustomReminder[]>([]);
  const [history, setHistory] = useState<InAppNotificationItem[]>([]);
  const [activeScheduledCount, setActiveScheduledCount] = useState<number>(0);
  const [pendingNavigation, setPendingNavigation] = useState<{ screen: string; params?: any } | null>(null);

  // Refresh active scheduled count from OS
  const refreshScheduledCount = useCallback(async () => {
    try {
      const scheduled = await getAllScheduledNotifications();
      setActiveScheduledCount(scheduled.length);
    } catch {
      setActiveScheduledCount(0);
    }
  }, []);

  // Listen for AppState transition back to active (e.g. from Android Settings)
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'active') {
        const granted = await checkNotificationPermissions();
        setPermissionGranted(granted);
        await refreshScheduledCount();
      }
    });

    return () => sub.remove();
  }, [refreshScheduledCount]);

  // Initialize Notification Channels, Permissions, Cold-Start Check & Reconciliation
  useEffect(() => {
    let isMounted = true;

    async function init() {
      await setupNotificationChannels();

      const granted = await checkNotificationPermissions();
      if (isMounted) {
        setPermissionGranted(granted);
      }

      // 1. Cold start notification tap handling
      try {
        const lastResponse = await Notifications.getLastNotificationResponseAsync();
        if (lastResponse?.notification?.request?.content?.data?.targetScreen && isMounted) {
          const data = lastResponse.notification.request.content.data;
          setPendingNavigation({
            screen: String(data.targetScreen),
            params: {
              pandalId: (data.pandalId || data.targetId) ? String(data.pandalId || data.targetId) : undefined,
              ritualId: data.ritualId ? String(data.ritualId) : undefined,
            },
          });
        }
      } catch (err) {
        console.warn('[NotificationContext] Error checking cold start response:', err);
      }

      // 2. Load stored preferences
      try {
        const storedPrefs = await AsyncStorage.getItem(PREFS_STORAGE_KEY);
        if (storedPrefs && isMounted) {
          const parsed = JSON.parse(storedPrefs);
          setPreferences((prev) => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.warn('[NotificationContext] Error loading preferences:', err);
      }

      // 3. Load custom reminders & reconcile missing OS alarms after phone reboot
      try {
        const storedReminders = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
        if (storedReminders) {
          const parsed: CustomReminder[] = JSON.parse(storedReminders);
          if (granted) {
            const reconciled = await reconcileActiveReminders(parsed);
            if (isMounted) {
              setReminders(reconciled);
            }
            AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reconciled)).catch(() => {});
          } else if (isMounted) {
            setReminders(parsed);
          }
        }
      } catch (err) {
        console.warn('[NotificationContext] Error loading reminders:', err);
      }

      // 4. Load notification history
      try {
        const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistory && isMounted) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (err) {
        console.warn('[NotificationContext] Error loading history:', err);
      }

      await refreshScheduledCount();
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [refreshScheduledCount]);

  // Handle incoming notifications (adds to history)
  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      const content = notification.request.content;
      const newItem: InAppNotificationItem = {
        id: notification.request.identifier || `notif-${Date.now()}`,
        title: content.title || 'PujoPath Alert',
        body: content.body || '',
        category: (content.data?.category as NotificationCategory) || 'puja-timings',
        timestamp: new Date().toISOString(),
        targetScreen: content.data?.targetScreen ? String(content.data.targetScreen) : undefined,
        targetId: content.data?.targetId ? String(content.data.targetId) : (content.data?.pandalId ? String(content.data.pandalId) : undefined),
        read: false,
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev.filter((i) => i.id !== newItem.id)].slice(0, 50);
        AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
        return updated;
      });

      refreshScheduledCount();
    });

    // Handle user tapping on notification banner
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.targetScreen) {
        setPendingNavigation({
          screen: String(data.targetScreen),
          params: {
            pandalId: (data.pandalId || data.targetId) ? String(data.pandalId || data.targetId) : undefined,
            ritualId: data.ritualId ? String(data.ritualId) : undefined,
          },
        });
      }
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [refreshScheduledCount]);

  // Open phone system settings
  const openSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch (err) {
      console.warn('[NotificationContext] Error opening settings:', err);
    }
  }, []);

  // Check if a specific Android channel is enabled or muted in settings
  const checkChannelState = useCallback(async (category: NotificationCategory): Promise<boolean> => {
    return await isChannelEnabled(category);
  }, []);

  // Request runtime permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status: existingStatus, canAskAgain } = await Notifications.getPermissionsAsync();
      if (existingStatus === 'granted') {
        setPermissionGranted(true);
        return true;
      }

      if (!canAskAgain && existingStatus === 'denied') {
        // Notification permission permanently denied or disabled in OS settings
        Alert.alert(
          isBn ? 'বিজ্ঞপ্তির অনুমতি প্রয়োজন' : 'Notifications Blocked',
          isBn
            ? 'আপনার অ্যান্ড্রয়েড সিস্টেম সেটিংস থেকে পূজাপাথ-এর নোটিফিকেশন সক্রিয় করুন।'
            : 'Notifications are disabled in system settings. Please enable them to receive ritual and pandal alerts.',
          [
            { text: isBn ? 'বাতিল' : 'Cancel', style: 'cancel' },
            { text: isBn ? 'সেটিংস খুলুন' : 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }

      const granted = await requestNotificationPermissions();
      setPermissionGranted(granted);
      if (granted) {
        // Re-evaluate daily schedule & ritual schedules
        if (preferences.dailySchedule) {
          const [h, m] = preferences.dailyScheduleTime.split(':').map((s) => parseInt(s, 10));
          await scheduleDailyMorningNotification(h || 7, m || 30, isBn);
        }
        if (preferences.pujaTimings) {
          await scheduleVerifiedPujaRituals(isBn);
        }
        await refreshScheduledCount();
      }
      return granted;
    } catch (err) {
      console.warn('[NotificationContext] Error in requestPermission:', err);
      return false;
    }
  }, [preferences, isBn, refreshScheduledCount]);

  // Update notification preferences
  const updatePreferences = useCallback(
    async (patch: Partial<NotificationPreferences>) => {
      const updated = { ...preferences, ...patch };
      setPreferences(updated);

      try {
        await AsyncStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('[NotificationContext] Error saving preferences:', err);
      }

      if (permissionGranted) {
        if (patch.dailySchedule !== undefined || patch.dailyScheduleTime !== undefined) {
          if (updated.dailySchedule) {
            const [h, m] = updated.dailyScheduleTime.split(':').map((s) => parseInt(s, 10));
            await scheduleDailyMorningNotification(h || 7, m || 30, isBn);
          } else {
            // Cancel daily schedule
            await cancelNotification('daily-morning-puja-schedule');
          }
        }

        if (patch.pujaTimings === true) {
          await scheduleVerifiedPujaRituals(isBn);
        }
      }

      await refreshScheduledCount();
    },
    [preferences, permissionGranted, isBn, refreshScheduledCount]
  );

  // Add custom reminder (with explicit identifier to prevent duplicates)
  const addCustomReminder = useCallback(
    async (item: Omit<CustomReminder, 'id' | 'createdAt'>): Promise<string | null> => {
      const targetDate = new Date(item.scheduledTime);
      const reminderId = `reminder-${Date.now()}`;

      let notifId: string | null = null;
      if (permissionGranted) {
        notifId = await scheduleLocalNotification({
          identifier: reminderId,
          title: item.title,
          body: item.body || '',
          triggerDate: targetDate,
          channelId: item.category,
          data: {
            customReminderId: reminderId,
            targetScreen: item.targetScreen,
            targetId: item.targetId,
          },
        });
      }

      const newReminder: CustomReminder = {
        ...item,
        id: reminderId,
        notificationId: notifId || undefined,
        createdAt: new Date().toISOString(),
      };

      setReminders((prev) => {
        const next = [newReminder, ...prev];
        AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });

      await refreshScheduledCount();
      return reminderId;
    },
    [permissionGranted, refreshScheduledCount]
  );

  // Edit / Update an existing custom reminder
  const updateCustomReminder = useCallback(
    async (
      id: string,
      item: Partial<Omit<CustomReminder, 'id' | 'createdAt'>>
    ): Promise<boolean> => {
      const existing = reminders.find((r) => r.id === id);
      if (!existing) return false;

      // Cancel previous scheduled notification if it existed
      if (existing.notificationId) {
        await cancelNotification(existing.notificationId);
      }

      const updatedTime = item.scheduledTime || existing.scheduledTime;
      const targetDate = new Date(updatedTime);
      let notifId: string | null = null;

      if (permissionGranted && targetDate > new Date()) {
        notifId = await scheduleLocalNotification({
          identifier: id,
          title: item.title || existing.title,
          body: (item.body !== undefined ? item.body : existing.body) || '',
          triggerDate: targetDate,
          channelId: item.category || existing.category,
          data: {
            customReminderId: id,
            targetScreen: item.targetScreen || existing.targetScreen,
            targetId: item.targetId || existing.targetId,
          },
        });
      }

      const updatedReminder: CustomReminder = {
        ...existing,
        ...item,
        notificationId: notifId || undefined,
      };

      setReminders((prev) => {
        const next = prev.map((r) => (r.id === id ? updatedReminder : r));
        AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });

      await refreshScheduledCount();
      return true;
    },
    [reminders, permissionGranted, refreshScheduledCount]
  );

  // Remove a reminder
  const removeReminder = useCallback(
    async (id: string) => {
      const existing = reminders.find((r) => r.id === id);
      if (existing?.notificationId) {
        await cancelNotification(existing.notificationId);
      }

      setReminders((prev) => {
        const next = prev.filter((r) => r.id !== id);
        AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });

      await refreshScheduledCount();
    },
    [reminders, refreshScheduledCount]
  );

  // Mark notification read
  const markNotificationRead = useCallback(async (id: string) => {
    setHistory((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, read: true } : item));
      AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  // Clear notification history
  const clearHistory = useCallback(async () => {
    setHistory([]);
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {}
  }, []);

  // Fire instant test notification
  const sendTestNotification = useCallback(
    async (category: NotificationCategory = 'puja-timings') => {
      await sendInstantTestNotification(category, isBn);
      await refreshScheduledCount();
    },
    [isBn, refreshScheduledCount]
  );

  // Fire delayed test notification (e.g. 5 seconds) to test backgrounded app
  const sendDelayedTest = useCallback(
    async (seconds: number = 5, category: NotificationCategory = 'puja-timings') => {
      await sendDelayedTestNotification(seconds, category, isBn);
      await refreshScheduledCount();
    },
    [isBn, refreshScheduledCount]
  );

  // Clear all notifications from system shade
  const clearShadeAlerts = useCallback(async () => {
    await dismissAllShadeNotifications();
  }, []);

  const clearPendingNavigation = useCallback(() => {
    setPendingNavigation(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        permissionGranted,
        requestPermission,
        openSettings,
        preferences,
        updatePreferences,
        reminders,
        addCustomReminder,
        updateCustomReminder,
        removeReminder,
        history,
        markNotificationRead,
        clearHistory,
        sendTestNotification,
        sendDelayedTest,
        clearShadeAlerts,
        activeScheduledCount,
        refreshScheduledCount,
        checkChannelState,
        pendingNavigation,
        clearPendingNavigation,
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
