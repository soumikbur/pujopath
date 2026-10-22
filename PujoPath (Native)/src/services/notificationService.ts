import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationCategory, CustomReminder } from '@/types/notification';

// Configure default notification handler for foreground presentation
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

/**
 * Configure Android Notification Channels with appropriate importance and sound
 */
export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync('puja-timings', {
      name: 'Puja Timings & Rituals (পুজোর নির্ঘণ্ট ও অঞ্জলি)',
      description: 'Alerts for Ashtami Pushpanjali, Sandhi Puja, Balidan, and sacred rituals',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#D9531E',
    });

    await Notifications.setNotificationChannelAsync('daily-schedule', {
      name: 'Daily Puja Schedule (দৈনিক পুজোর সময়সূচী)',
      description: 'Morning overview of the current day’s rituals, tithis, and celebrations',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('custom-reminders', {
      name: 'Custom Reminders (ব্যক্তিগত রিমাইন্ডার)',
      description: 'User-configured alerts for pandal visits, departures, and timings',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF9E1B',
    });

    await Notifications.setNotificationChannelAsync('saved-pandals', {
      name: 'Saved Pandals (সংরক্ষিত প্যান্ডেল)',
      description: 'Reminders and evening suggestions for your saved pandals',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('events', {
      name: 'Events & Celebrations (অনুষ্ঠান ও সাংস্কৃতিক কর্মসূচি)',
      description: 'Reminders for cultural programs, Dhunuchi dance, and Sindoor Khela',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  } catch (err) {
    console.warn('[NotificationService] Error setting up notification channels:', err);
  }
}

/**
 * Request notification permissions from the user
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (err) {
    console.warn('[NotificationService] Error requesting permissions:', err);
    return false;
  }
}

/**
 * Check existing notification permission status
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (err) {
    return false;
  }
}

/**
 * Check if a specific Android notification channel is enabled (not blocked by user)
 */
export async function isChannelEnabled(channelId: NotificationCategory): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  try {
    const channel = await Notifications.getNotificationChannelAsync(channelId);
    if (!channel) return false;
    return channel.importance !== Notifications.AndroidImportance.NONE;
  } catch (err) {
    return true;
  }
}

/**
 * Schedule a local notification at an exact date/time
 */
export async function scheduleLocalNotification(options: {
  title: string;
  body: string;
  triggerDate: Date;
  channelId: NotificationCategory;
  identifier?: string;
  data?: Record<string, any>;
}): Promise<string | null> {
  try {
    const now = new Date();
    if (options.triggerDate <= now) {
      // Date is in the past, cannot schedule
      return null;
    }

    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: options.triggerDate,
      channelId: options.channelId,
    };

    const id = await Notifications.scheduleNotificationAsync({
      identifier: options.identifier,
      content: {
        title: options.title,
        body: options.body,
        sound: true,
        data: {
          category: options.channelId,
          ...options.data,
        },
        color: '#D9531E',
      },
      trigger,
    });

    return id;
  } catch (err) {
    console.warn('[NotificationService] Error scheduling notification:', err);
    return null;
  }
}

/**
 * Schedule a daily morning schedule notification at user-chosen hour:minute
 */
export async function scheduleDailyMorningNotification(
  hour: number,
  minute: number,
  isBn: boolean = false
): Promise<string | null> {
  try {
    // First cancel existing daily schedule notification if any
    await cancelNotificationByTag('daily-schedule-notification');

    const title = isBn
      ? 'আজকের পুজোর সময়সূচী ও নির্ঘণ্ট'
      : 'Good morning! Here is today’s Puja schedule';
    const body = isBn
      ? 'আজকের দিনটির বিশেষ অঞ্জলি, ভোগ ও আরতির সময় দেখতে ট্যাপ করুন।'
      : 'Tap to view today’s Pushpanjali, Bhog, and Sandhya Aarti timings.';

    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: 'daily-schedule',
    };

    const id = await Notifications.scheduleNotificationAsync({
      identifier: 'daily-morning-puja-schedule',
      content: {
        title,
        body,
        sound: true,
        data: {
          category: 'daily-schedule',
          targetScreen: 'Calendar',
          tag: 'daily-schedule-notification',
        },
        color: '#D9531E',
      },
      trigger,
    });

    return id;
  } catch (err) {
    console.warn('[NotificationService] Error scheduling daily notification:', err);
    return null;
  }
}

/**
 * Schedule the verified 2026 Puja Ritual Reminders
 */
export async function scheduleVerifiedPujaRituals(isBn: boolean = false): Promise<CustomReminder[]> {
  const scheduled: CustomReminder[] = [];

  // Key Verified 2026 Durga Puja ritual timestamps
  const rituals = [
    {
      id: 'ritual-ashtami-sandhya-2026',
      title: isBn ? 'মহা অষ্টমী আরতি ও সন্ধিপূজা প্রস্তুতি' : 'Maha Ashtami Sandhya Aarti & Celebrations',
      body: isBn
        ? 'সন্ধ্যা ৬:৩০ এ মহা অষ্টমীর মহা আরতি ও আলোকসজ্জা দর্শন করুন।'
        : 'Evening Maha Aarti starts at 06:30 PM. Explore the illuminated pandals tonight!',
      // Oct 19, 2026 at 18:30 PM IST
      date: new Date('2026-10-19T18:30:00+05:30'),
      targetScreen: 'Calendar',
      targetId: 'maha-ashtami-2026',
      category: 'puja-timings' as NotificationCategory,
    },
    {
      id: 'ritual-navami-kumari-2026',
      title: isBn ? 'মহানবমী কুমারী পূজা ও মহাভোজ' : 'Maha Navami Kumari Puja & Mahabhog',
      body: isBn
        ? 'সকাল ৯:০০ এ পবিত্র কুমারী পূজা এবং মধ্যাহ্নে দেবীর বিশেষ ভোগ নিবেদন।'
        : 'Sacred Kumari Puja begins at 09:00 AM with special Navami Bhog at noon.',
      // Oct 20, 2026 at 08:45 AM IST
      date: new Date('2026-10-20T08:45:00+05:30'),
      targetScreen: 'Calendar',
      targetId: 'maha-navami-2026',
      category: 'puja-timings' as NotificationCategory,
    },
    {
      id: 'ritual-navami-dhunuchi-2026',
      title: isBn ? 'মহানবমীর ঐতিহ্যবাহী ধুনুচি নাচ' : 'Maha Navami Dhunuchi Naach & Aarti',
      body: isBn
        ? 'সন্ধ্যায় ঢাকার তালে তালে বিশেষ ধুনুচি নাচ প্রতিযোগিতা ও মহা আরতি।'
        : 'Witness the iconic Dhunuchi dance competition and evening Aarti across top pandals.',
      // Oct 20, 2026 at 18:00 PM IST
      date: new Date('2026-10-20T18:00:00+05:30'),
      targetScreen: 'Calendar',
      targetId: 'maha-navami-2026',
      category: 'events' as NotificationCategory,
    },
    {
      id: 'ritual-dashami-sindoor-2026',
      title: isBn ? 'শুভ বিজয়া ও সিঁদুর খেলা' : 'Subho Bijoya & Sindoor Khela',
      body: isBn
        ? 'আজ শুভ বিজয়া দশমী। দেবীর বরণ, সিঁদুর খেলা এবং মিষ্টি মুখের মাধ্যমে মাতৃবিদায়ের সূচনা।'
        : 'Maha Dashami celebrations have begun! Check Sindoor Khela timings and nearby pandal immersions.',
      // Oct 21, 2026 at 09:30 AM IST
      date: new Date('2026-10-21T09:30:00+05:30'),
      targetScreen: 'Calendar',
      targetId: 'maha-dashami-2026',
      category: 'puja-timings' as NotificationCategory,
    },
  ];

  for (const ritual of rituals) {
    const notifId = await scheduleLocalNotification({
      identifier: ritual.id,
      title: ritual.title,
      body: ritual.body,
      triggerDate: ritual.date,
      channelId: ritual.category,
      data: {
        ritualId: ritual.id,
        targetScreen: ritual.targetScreen,
        targetId: ritual.targetId,
      },
    });

    if (notifId) {
      scheduled.push({
        id: ritual.id,
        notificationId: notifId,
        title: ritual.title,
        body: ritual.body,
        targetScreen: ritual.targetScreen,
        targetId: ritual.targetId,
        scheduledTime: ritual.date.toISOString(),
        category: ritual.category,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return scheduled;
}

/**
 * Schedule a saved pandal evening reminder
 */
export async function scheduleSavedPandalReminder(
  pandalName: string,
  pandalId: string,
  targetDate: Date,
  isBn: boolean = false
): Promise<CustomReminder | null> {
  const title = isBn
    ? `প্যান্ডেল দর্শনের সময়: ${pandalName}`
    : `Time to visit: ${pandalName}`;
  const body = isBn
    ? `আপনার সংরক্ষিত প্যান্ডেল "${pandalName}" আজ সন্ধ্যায় ঘুরে দেখার জন্য প্রস্তুত। দিকনির্দেশ ও ভিড় যাচাই করুন।`
    : `Your saved pandal "${pandalName}" is ready to explore tonight. Check directions and live crowd status.`;

  const notifId = await scheduleLocalNotification({
    title,
    body,
    triggerDate: targetDate,
    channelId: 'saved-pandals',
    data: {
      targetScreen: 'PandalDetail',
      pandalId,
      pandalName,
    },
  });

  if (!notifId) return null;

  return {
    id: `saved-pandal-${pandalId}-${Date.now()}`,
    notificationId: notifId,
    title,
    body,
    targetScreen: 'PandalDetail',
    targetId: pandalId,
    scheduledTime: targetDate.toISOString(),
    category: 'saved-pandals',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Fire an instant test notification (for emulator and physical device verification)
 */
export async function sendInstantTestNotification(
  category: NotificationCategory = 'puja-timings',
  isBn: boolean = false
): Promise<string | null> {
  try {
    const testMessages: Record<NotificationCategory, { title: string; body: string; screen: string }> = {
      'puja-timings': {
        title: isBn ? '🔔 পুষ্পাঞ্জলি স্মরণিকা (পরীক্ষামূলক)' : '🔔 Ashtami Anjali Reminder (Test)',
        body: isBn
          ? 'সন্ধিপূজা ও মহা অষ্টমীর অঞ্জলির সময়সূচী দেখতে এখানে স্পর্শ করুন।'
          : 'Pushpanjali timings are active. Tap to open the sacred Puja Calendar.',
        screen: 'Calendar',
      },
      'daily-schedule': {
        title: isBn ? '🌅 দৈনিক পুজোর সময়সূচী (পরীক্ষামূলক)' : '🌅 Today’s Puja Schedule (Test)',
        body: isBn
          ? 'আজকের দিনটির শুভ লগ্ন ও অনুষ্ঠানসমূহ দেখুন।'
          : 'Good morning! Here is today’s ritual timeline.',
        screen: 'Calendar',
      },
      'custom-reminders': {
        title: isBn ? '📍 প্যান্ডেল রিমাইন্ডার (পরীক্ষামূলক)' : '📍 Pandal Visit Reminder (Test)',
        body: isBn
          ? 'আপনার নির্ধারিত প্যান্ডেল দর্শনের সময় হয়ে এসেছে।'
          : 'Ready for pandal hopping? Tap to open your route planner.',
        screen: 'Planner',
      },
      'saved-pandals': {
        title: isBn ? '❤️ সংরক্ষিত প্যান্ডেল স্মরণিকা' : '❤️ Saved Pandal Alert (Test)',
        body: isBn
          ? 'আপনার পছন্দের তালিকায় রাখা প্যান্ডেলসমূহ ঘুরে দেখার সময় এসেছে।'
          : 'Your saved destination is ready to explore. Tap to view directions.',
        screen: 'Explore',
      },
      events: {
        title: isBn ? '🥁 ধুনুচি নাচ ও আরতি' : '🥁 Dhunuchi Dance & Aarti (Test)',
        body: isBn
          ? 'সন্ধ্যার মহাধুনুচি নাচ শুরু হতে চলেছে। এখনই যোগ দিন!'
          : 'Evening Dhunuchi dance program starting soon. Check event schedule.',
        screen: 'Calendar',
      },
    };

    const item = testMessages[category] || testMessages['puja-timings'];

    // Schedule 1 second into future so native notification banner displays
    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
      channelId: category,
      repeats: false,
    };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: item.title,
        body: item.body,
        sound: true,
        data: {
          category,
          targetScreen: item.screen,
          isTest: true,
        },
        color: '#D9531E',
      },
      trigger,
    });

    return id;
  } catch (err) {
    console.warn('[NotificationService] Error sending test notification:', err);
    return null;
  }
}

/**
 * Fire a delayed test notification (e.g. 5 seconds) to verify delivery when app is backgrounded or device locked
 */
export async function sendDelayedTestNotification(
  seconds: number = 5,
  category: NotificationCategory = 'puja-timings',
  isBn: boolean = false
): Promise<string | null> {
  try {
    const testMessages: Record<NotificationCategory, { title: string; body: string; screen: string }> = {
      'puja-timings': {
        title: isBn ? '🔔 ব্যাকগ্রাউন্ড টেস্ট: অঞ্জলি স্মরণিকা' : '🔔 Background Test: Ashtami Anjali',
        body: isBn
          ? 'অ্যাপটি ব্যাকগ্রাউন্ডে থাকাকালীন নোটিফিকেশন সফলভাবে কাজ করেছে।'
          : 'Background delivery verified! Tap to open the sacred Puja Calendar.',
        screen: 'Calendar',
      },
      'daily-schedule': {
        title: isBn ? '🌅 ব্যাকগ্রাউন্ড টেস্ট: দৈনিক সময়সূচী' : '🌅 Background Test: Daily Puja',
        body: isBn
          ? 'সকালের পুজো নির্ঘণ্ট সফলভাবে পৌঁছেছে।'
          : 'Morning schedule delivered while backgrounded.',
        screen: 'Calendar',
      },
      'custom-reminders': {
        title: isBn ? '📍 ব্যাকগ্রাউন্ড টেস্ট: প্যান্ডেল স্মরণিকা' : '📍 Background Test: Custom Reminder',
        body: isBn
          ? 'প্যান্ডেল দর্শনের জন্য নির্ধারিত অ্যালার্ট।'
          : 'Custom pandal visit reminder delivered on time.',
        screen: 'Planner',
      },
      'saved-pandals': {
        title: isBn ? '❤️ ব্যাকগ্রাউন্ড টেস্ট: সংরক্ষিত প্যান্ডেল' : '❤️ Background Test: Saved Pandal',
        body: isBn
          ? 'আপনার সংরক্ষিত প্যান্ডেল পরিদর্শন করার সময়।'
          : 'Your saved destination reminder has arrived.',
        screen: 'Explore',
      },
      events: {
        title: isBn ? '🥁 ব্যাকগ্রাউন্ড টেস্ট: ধুনুচি নাচ' : '🥁 Background Test: Event Alert',
        body: isBn
          ? 'সন্ধ্যার ধুনুচি নাচের প্রস্তুতি নিন!'
          : 'Dhunuchi dance competition is starting soon.',
        screen: 'Calendar',
      },
    };

    const item = testMessages[category] || testMessages['puja-timings'];

    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, seconds),
      channelId: category,
      repeats: false,
    };

    const id = await Notifications.scheduleNotificationAsync({
      identifier: `test-delay-${Date.now()}`,
      content: {
        title: item.title,
        body: item.body,
        sound: true,
        data: {
          category,
          targetScreen: item.screen,
          isTest: true,
        },
        color: '#D9531E',
      },
      trigger,
    });

    return id;
  } catch (err) {
    console.warn('[NotificationService] Error sending delayed test notification:', err);
    return null;
  }
}

/**
 * Dismiss all active notifications from Android notification shade
 */
export async function dismissAllShadeNotifications(): Promise<void> {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (err) {
    console.warn('[NotificationService] Error dismissing shade notifications:', err);
  }
}

/**
 * Cancel a scheduled notification by identifier
 */
export async function cancelNotification(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (err) {
    console.warn('[NotificationService] Error cancelling notification:', err);
  }
}

/**
 * Cancel notifications by custom data tag
 */
export async function cancelNotificationByTag(tag: string): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.content.data?.tag === tag) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }
  } catch (err) {
    console.warn('[NotificationService] Error cancelling notification by tag:', err);
  }
}

/**
 * Cancel all scheduled notifications across all channels
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (err) {
    console.warn('[NotificationService] Error cancelling all notifications:', err);
  }
}

/**
 * Retrieve all currently scheduled notifications from device OS
 */
export async function getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (err) {
    console.warn('[NotificationService] Error fetching scheduled notifications:', err);
    return [];
  }
}

/**
 * Reconcile & restore missing scheduled notifications after phone reboot or app restart
 */
export async function reconcileActiveReminders(
  savedReminders: CustomReminder[]
): Promise<CustomReminder[]> {
  try {
    const now = new Date();
    const scheduled = await getAllScheduledNotifications();
    const scheduledIds = new Set(scheduled.map((s) => s.identifier));

    const updatedReminders: CustomReminder[] = [];

    for (const rem of savedReminders) {
      const targetDate = new Date(rem.scheduledTime);
      if (targetDate <= now) {
        // Already past; keep in list as past reminder
        updatedReminders.push(rem);
        continue;
      }

      // If missing from OS scheduled list, re-schedule it
      if (!rem.notificationId || !scheduledIds.has(rem.notificationId)) {
        const newNotifId = await scheduleLocalNotification({
          identifier: rem.id,
          title: rem.title,
          body: rem.body || '',
          triggerDate: targetDate,
          channelId: rem.category,
          data: {
            customReminderId: rem.id,
            targetScreen: rem.targetScreen,
            targetId: rem.targetId,
          },
        });

        updatedReminders.push({
          ...rem,
          notificationId: newNotifId || rem.notificationId,
        });
      } else {
        updatedReminders.push(rem);
      }
    }

    return updatedReminders;
  } catch (err) {
    console.warn('[NotificationService] Error reconciling reminders:', err);
    return savedReminders;
  }
}
