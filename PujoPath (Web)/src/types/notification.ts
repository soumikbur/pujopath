export type NotificationCategory =
  | 'puja-timings'
  | 'daily-schedule'
  | 'saved-pandals'
  | 'custom-reminders'
  | 'events';

export interface NotificationPreferences {
  pujaTimings: boolean;
  dailySchedule: boolean;
  dailyScheduleTime: string; // "07:30" (24h format HH:mm)
  savedPandals: boolean;
  customReminders: boolean;
  events: boolean;
}

export interface CustomReminder {
  id: string;
  notificationId?: string;
  title: string;
  body?: string;
  targetScreen?: string;
  targetId?: string;
  scheduledTime: string; // ISO 8601
  category: NotificationCategory;
  createdAt: string;
}

export interface InAppNotificationItem {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  timestamp: string;
  targetScreen?: string;
  targetId?: string;
  read: boolean;
}
