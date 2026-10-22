import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNotifications } from '@/context/NotificationContext';
import { useResponsive } from '@/hooks/useResponsive';
import { NotificationCategory, CustomReminder, InAppNotificationItem } from '@/types/notification';

interface NotificationsScreenProps {
  navigation: any;
}

const DAILY_TIME_OPTIONS = ['06:30', '07:00', '07:30', '08:00', '08:30'];

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const {
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
    checkChannelState,
  } = useNotifications();

  const { isLandscape, screenPaddingLeft, screenPaddingRight, stackScrollBottomPadding } = useResponsive();

  const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings');
  const [selectedTestCategory, setSelectedTestCategory] = useState<NotificationCategory>('puja-timings');
  const [testSending, setTestSending] = useState<boolean>(false);
  const [delayedCountdown, setDelayedCountdown] = useState<number | null>(null);
  const [blockedChannels, setBlockedChannels] = useState<NotificationCategory[]>([]);

  // Modal State for adding/editing custom reminder
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);
  const [reminderTitle, setReminderTitle] = useState<string>('');
  const [reminderNotes, setReminderNotes] = useState<string>('');
  const [reminderCategory, setReminderCategory] = useState<NotificationCategory>('custom-reminders');
  const [reminderDay, setReminderDay] = useState<string>('2026-10-19'); // Ashtami default
  const [reminderTime, setReminderTime] = useState<string>('07:00');

  // Verify Android Notification Channel health
  React.useEffect(() => {
    async function verifyChannels() {
      const categories: NotificationCategory[] = [
        'puja-timings',
        'daily-schedule',
        'custom-reminders',
        'saved-pandals',
        'events',
      ];
      const blocked: NotificationCategory[] = [];
      for (const cat of categories) {
        const enabled = await checkChannelState(cat);
        if (!enabled) {
          blocked.push(cat);
        }
      }
      setBlockedChannels(blocked);
    }
    verifyChannels();
  }, [checkChannelState]);

  const handleTogglePreference = async (key: keyof typeof preferences, value: any) => {
    if (!permissionGranted && value === true) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          isBn ? 'বিজ্ঞপ্তির অনুমতি প্রয়োজন' : 'Permission Required',
          isBn
            ? 'সঠিক সময়ে অ্যালার্ট পাওয়ার জন্য অনুগ্রহ করে নোটিফিকেশনের অনুমতি দিন।'
            : 'Please grant notification permissions in your phone settings to receive alerts.'
        );
        return;
      }
    }
    await updatePreferences({ [key]: value });
  };

  const handleSendTest = async () => {
    if (!permissionGranted) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          isBn ? 'বিজ্ঞপ্তির অনুমতি দিন' : 'Permission Required',
          isBn
            ? 'টেস্ট নোটিফিকেশন পাঠাতে বিজ্ঞপ্তির অনুমতি প্রয়োজন।'
            : 'Notification permission is required to send test alerts.'
        );
        return;
      }
    }

    setTestSending(true);
    await sendTestNotification(selectedTestCategory);
    setTimeout(() => {
      setTestSending(false);
      Alert.alert(
        isBn ? 'টেস্ট নোটিফিকেশন প্রেরিত' : 'Test Alert Sent',
        isBn
          ? 'কয়েক সেকেন্ডের মধ্যে স্ক্রিনের উপরে নোটিফিকেশন ব্যানার প্রদর্শিত হবে।'
          : 'A test notification banner will appear in your notification shade shortly.'
      );
    }, 400);
  };

  const handleSendDelayedTest = async () => {
    if (!permissionGranted) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    setTestSending(true);
    await sendDelayedTest(5, selectedTestCategory);
    setTestSending(false);
    setDelayedCountdown(5);

    const interval = setInterval(() => {
      setDelayedCountdown((prev) => {
        if (prev !== null && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(interval);
          return null;
        }
      });
    }, 1000);

    Alert.alert(
      isBn ? '৫ সেকেন্ড ব্যাকগ্রাউন্ড টেস্ট শুরু' : '5-Second Test Scheduled',
      isBn
        ? 'এখনই ফোনের হোম (Home) বাটনে স্পর্শ করে অ্যাপটি ব্যাকগ্রাউন্ডে রাখুন বা স্ক্রিন লক করুন। ৫ সেকেন্ড পর নোটিফিকেশন আসবে।'
        : 'Press the Home button to background the app or lock your screen now. The alert will trigger in 5 seconds!'
    );
  };

  const handleClearShade = async () => {
    await clearShadeAlerts();
    Alert.alert(
      isBn ? 'নোটিফিকেশন শেড পরিষ্কার' : 'Notification Shade Cleared',
      isBn
        ? 'সিস্টেম ট্রের সমস্ত টেস্ট নোটিফিকেশন সরিয়ে ফেলা হয়েছে।'
        : 'All PujoPath test notifications have been cleared from the Android notification shade.'
    );
  };

  const handleOpenAddReminder = () => {
    setEditingReminderId(null);
    setReminderTitle('');
    setReminderNotes('');
    setReminderCategory('custom-reminders');
    setReminderDay('2026-10-19');
    setReminderTime('07:00');
    setModalVisible(true);
  };

  const handleEditReminder = (reminder: CustomReminder) => {
    setEditingReminderId(reminder.id);
    setReminderTitle(reminder.title);
    setReminderNotes(reminder.body || '');
    setReminderCategory(reminder.category);
    try {
      const dateObj = new Date(reminder.scheduledTime);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setReminderDay(`${year}-${month}-${day}`);
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      setReminderTime(`${hours}:${minutes}`);
    } catch {
      setReminderDay('2026-10-19');
      setReminderTime('07:00');
    }
    setModalVisible(true);
  };

  const handleSaveReminder = async () => {
    if (!reminderTitle.trim()) {
      Alert.alert(
        isBn ? 'শিরোনাম লিখুন' : 'Title Required',
        isBn ? 'অনুগ্রহ করে রিমাইন্ডারের একটি নাম লিখুন।' : 'Please provide a title for the reminder.'
      );
      return;
    }

    const scheduledDate = new Date(`${reminderDay}T${reminderTime}:00+05:30`);
    if (isNaN(scheduledDate.getTime())) {
      Alert.alert(isBn ? 'ভুল সময়' : 'Invalid Date', isBn ? 'সঠিক তারিখ ও সময় নির্বাচন করুন।' : 'Please check selected date/time.');
      return;
    }

    if (editingReminderId) {
      await updateCustomReminder(editingReminderId, {
        title: reminderTitle.trim(),
        body: reminderNotes.trim() || undefined,
        category: reminderCategory,
        scheduledTime: scheduledDate.toISOString(),
        targetScreen: reminderCategory === 'puja-timings' ? 'Calendar' : 'Planner',
      });
      setModalVisible(false);
      Alert.alert(
        isBn ? 'রিমাইন্ডার আপডেট হয়েছে' : 'Reminder Updated',
        isBn
          ? `সংশোধিত অ্যালার্ট সময়: ${reminderDay} ${reminderTime}`
          : `Updated alert has been rescheduled for ${reminderDay} at ${reminderTime}.`
      );
    } else {
      await addCustomReminder({
        title: reminderTitle.trim(),
        body: reminderNotes.trim() || undefined,
        category: reminderCategory,
        scheduledTime: scheduledDate.toISOString(),
        targetScreen: reminderCategory === 'puja-timings' ? 'Calendar' : 'Planner',
      });
      setModalVisible(false);
      Alert.alert(
        isBn ? 'রিমাইন্ডার সংরক্ষিত' : 'Reminder Scheduled',
        isBn
          ? `নির্ধারিত সময়ে আপনাকে অ্যালার্ট পাঠানো হবে: ${reminderDay} ${reminderTime}`
          : `Your alert has been set for ${reminderDay} at ${reminderTime}.`
      );
    }

    setReminderTitle('');
    setReminderNotes('');
    setEditingReminderId(null);
  };

  const handleHistoryTap = (item: InAppNotificationItem) => {
    markNotificationRead(item.id);
    if (item.targetScreen) {
      navigation.navigate(item.targetScreen, {
        pandalId: item.targetId,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
            paddingBottom: stackScrollBottomPadding + 28,
            maxWidth: isLandscape ? 840 : undefined,
            alignSelf: isLandscape ? 'center' : undefined,
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View style={styles.headerSection}>
          <View style={styles.badgeRow}>
            <Feather name="bell" size={13} color="#B42323" />
            <Text style={styles.badgeText}>
              {isBn ? 'বিজ্ঞপ্তি ও রিমাইন্ডার' : 'NOTIFICATIONS & ALERTS'}
            </Text>
          </View>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
            {isBn ? 'পুজোর নির্ঘণ্ট ও ব্যক্তিগত রিমাইন্ডার' : 'Puja Alerts & Reminders'}
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            {isBn
              ? 'মহা অষ্টমী পুষ্পাঞ্জলি, সন্ধিপূজার লগ্ন ও সংরক্ষিত প্যান্ডেল পরিদর্শনের নির্ভরযোগ্য নোটিফিকেশন।'
              : 'Verified Pushpanjali timings, sacred Sandhi Puja reminders, and personal pandal itineraries.'}
          </Text>
        </View>

        {/* Permission Banner */}
        {!permissionGranted ? (
          <View
            style={[
              styles.permissionBanner,
              {
                backgroundColor: isDark ? '#2D1F16' : '#FFF4ED',
                borderColor: isDark ? '#5C381E' : '#FBD5BC',
              },
            ]}
          >
            <View style={styles.bannerIconWrap}>
              <Ionicons name="notifications-off-outline" size={22} color="#D9531E" />
            </View>
            <View style={styles.bannerTextWrap}>
              <Text style={[styles.bannerTitle, { color: isDark ? '#FED7AA' : '#9A3412' }]}>
                {isBn ? 'বিজ্ঞপ্তি নিষ্ক্রিয় রয়েছে' : 'Notifications Disabled'}
              </Text>
              <Text style={[styles.bannerDesc, { color: isDark ? '#E5D5C5' : '#7C2D12' }]}>
                {isBn
                  ? 'সঠিক সময়ে সন্ধিপূজা ও অঞ্জলির সতর্কবার্তা পেতে নোটিফিকেশন চালু করুন।'
                  : 'Enable notifications to receive Sandhi Puja timings and saved pandal alerts.'}
              </Text>
              <View style={styles.bannerBtnRow}>
                <TouchableOpacity
                  style={styles.enableBtn}
                  onPress={requestPermission}
                  activeOpacity={0.8}
                  accessibilityLabel="Enable Notifications"
                >
                  <Text style={styles.enableBtnText}>
                    {isBn ? 'বিজ্ঞপ্তি সক্রিয় করুন' : 'Enable Notifications'}
                  </Text>
                  <Feather name="arrow-right" size={14} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.settingsBtn,
                    {
                      backgroundColor: isDark ? '#231811' : '#FDF0E7',
                      borderColor: isDark ? '#5C381E' : '#FBD5BC',
                    },
                  ]}
                  onPress={openSettings}
                  activeOpacity={0.8}
                  accessibilityLabel="Open System Settings"
                >
                  <Feather name="settings" size={13} color={isDark ? '#FED7AA' : '#9A3412'} />
                  <Text style={[styles.settingsBtnText, { color: isDark ? '#FED7AA' : '#9A3412' }]}>
                    {isBn ? 'সিস্টেম সেটিংস' : 'System Settings'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.activeBanner,
              {
                backgroundColor: isDark ? '#14251C' : '#EDFDF5',
                borderColor: isDark ? '#1E4632' : '#B8F2D5',
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={18} color="#059669" />
            <Text style={[styles.activeBannerText, { color: isDark ? '#A7F3D0' : '#065F46' }]}>
              {isBn
                ? `বিজ্ঞপ্তি সক্রিয় রয়েছে (${activeScheduledCount}টি অ্যালার্ট নির্ধারিত)`
                : `Notifications Active (${activeScheduledCount} alerts scheduled)`}
            </Text>
          </View>
        )}

        {/* Blocked Channels Notice */}
        {blockedChannels.length > 0 && (
          <View
            style={[
              styles.blockedChannelBanner,
              {
                backgroundColor: isDark ? '#291E12' : '#FFFBEB',
                borderColor: isDark ? '#573711' : '#FDE68A',
              },
            ]}
          >
            <Ionicons name="warning-outline" size={18} color="#D97706" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.blockedChannelTitle, { color: isDark ? '#FDE68A' : '#92400E' }]}>
                {isBn ? 'কিছু নোটিফিকেশন চ্যানেল নিঃশব্দ করা আছে' : 'Some Notification Channels Blocked'}
              </Text>
              <Text style={[styles.blockedChannelDesc, { color: isDark ? '#FCD34D' : '#B45309' }]}>
                {isBn
                  ? `নিচের চ্যানেলগুলি ফোন সেটিংসে বন্ধ রয়েছে: ${blockedChannels.join(', ')}`
                  : `Muted in system settings: ${blockedChannels.join(', ')}. Open Settings to re-enable.`}
              </Text>
            </View>
            <TouchableOpacity onPress={openSettings} style={styles.channelFixBtn}>
              <Text style={styles.channelFixBtnText}>{isBn ? 'ঠিক করুন' : 'Settings'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tab Controls */}
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: isDark ? '#221C18' : '#F0ECE6',
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === 'settings' && {
                backgroundColor: isDark ? '#B42323' : '#B42323',
              },
            ]}
            onPress={() => setActiveTab('settings')}
            activeOpacity={0.8}
          >
            <Feather
              name="sliders"
              size={15}
              color={activeTab === 'settings' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'settings' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {isBn ? 'পছন্দ ও রিমাইন্ডার' : 'Preferences & Reminders'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabItem,
              activeTab === 'history' && {
                backgroundColor: isDark ? '#B42323' : '#B42323',
              },
            ]}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.8}
          >
            <Feather
              name="clock"
              size={15}
              color={activeTab === 'history' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'history' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {isBn ? `বিজ্ঞপ্তি ইতিহাস (${history.length})` : `Alert History (${history.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'settings' ? (
          <View style={styles.tabContent}>
            {/* Section 1: Sacred Puja Ritual Reminders */}
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconCircle, { backgroundColor: isDark ? '#381C1A' : '#FEE2E2' }]}>
                  <Ionicons name="sparkles" size={16} color="#DC2626" />
                </View>
                <View style={styles.sectionTitleWrap}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    {isBn ? 'পুজোর নির্ঘণ্ট ও অঞ্জলি অ্যালার্ট' : 'Sacred Puja Ritual Timings'}
                  </Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    {isBn
                      ? 'মহা অষ্টমী পুষ্পাঞ্জলি (সকাল ৬:৩০), সন্ধিপূজা (সকাল ৭:২৬) ও বলিদান'
                      : 'Verified Pushpanjali, Sandhi Puja & Kumari Puja alert schedule'}
                  </Text>
                </View>
                <Switch
                  value={preferences.pujaTimings}
                  onValueChange={(val) => handleTogglePreference('pujaTimings', val)}
                  trackColor={{ false: isDark ? '#3D342E' : '#D1D5DB', true: '#B42323' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

              {/* Daily Morning Puja Schedule */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                    {isBn ? 'দৈনিক সকালের সময়সূচী' : 'Daily Morning Puja Schedule'}
                  </Text>
                  <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                    {isBn
                      ? 'প্রতিদিন সকালে দিনটির অঞ্জলি, ভোগ ও তর্পণ নির্ঘণ্টের সংক্ষিপ্ত রূপরেখা'
                      : 'Morning overview of today’s tithi, pushpanjali, and aarti timings'}
                  </Text>
                </View>
                <Switch
                  value={preferences.dailySchedule}
                  onValueChange={(val) => handleTogglePreference('dailySchedule', val)}
                  trackColor={{ false: isDark ? '#3D342E' : '#D1D5DB', true: '#B42323' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {preferences.dailySchedule && (
                <View style={styles.timeSelectorRow}>
                  <Text style={[styles.timeSelectorLabel, { color: colors.textSecondary }]}>
                    {isBn ? 'সকালের অ্যালার্ট সময়:' : 'Preferred morning alert time:'}
                  </Text>
                  <View style={styles.timeChipsContainer}>
                    {DAILY_TIME_OPTIONS.map((time) => {
                      const isSelected = preferences.dailyScheduleTime === time;
                      return (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.timeChip,
                            {
                              backgroundColor: isSelected
                                ? '#B42323'
                                : isDark
                                ? '#2A241F'
                                : '#F3EFEA',
                              borderColor: isSelected ? '#B42323' : colors.borderSubtle,
                            },
                          ]}
                          onPress={() => handleTogglePreference('dailyScheduleTime', time)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.timeChipText,
                              { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                            ]}
                          >
                            {time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

              {/* Saved Pandals */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                    {isBn ? 'সংরক্ষিত প্যান্ডেল স্মরণিকা' : 'Saved Pandal Reminders'}
                  </Text>
                  <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                    {isBn
                      ? 'পছন্দের তালিকায় থাকা প্যান্ডেলগুলো ঘুরে দেখার জন্য সান্ধ্য স্মরণিকা'
                      : 'Evening suggestions and live directions for your bookmarked pandals'}
                  </Text>
                </View>
                <Switch
                  value={preferences.savedPandals}
                  onValueChange={(val) => handleTogglePreference('savedPandals', val)}
                  trackColor={{ false: isDark ? '#3D342E' : '#D1D5DB', true: '#B42323' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

              {/* Events & Celebrations */}
              <View style={styles.settingRow}>
                <View style={styles.settingTextWrap}>
                  <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
                    {isBn ? 'সাংস্কৃতিক অনুষ্ঠান ও ধুনুচি নাচ' : 'Events & Cultural Programmes'}
                  </Text>
                  <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                    {isBn
                      ? 'ধুনুচি নাচ প্রতিযোগিতা, সিঁদুর খেলা ও পাড়ার সান্ধ্য সাংস্কৃতিক অনুষ্ঠান'
                      : 'Dhunuchi dance contests, Sindoor Khela, and community announcements'}
                  </Text>
                </View>
                <Switch
                  value={preferences.events}
                  onValueChange={(val) => handleTogglePreference('events', val)}
                  trackColor={{ false: isDark ? '#3D342E' : '#D1D5DB', true: '#B42323' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Section 2: Custom Reminders Management */}
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.customHeaderRow}>
                <View>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    {isBn ? 'আপনার ব্যক্তিগত রিমাইন্ডার' : 'Your Custom Reminders'}
                  </Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    {isBn
                      ? `${reminders.length}টি ব্যক্তিগত অ্যালার্ট নির্ধারিত রয়েছে`
                      : `${reminders.length} personal alerts currently scheduled`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addReminderBtn}
                  onPress={handleOpenAddReminder}
                  activeOpacity={0.8}
                  accessibilityLabel="Add Reminder"
                >
                  <Feather name="plus" size={14} color="#FFFFFF" />
                  <Text style={styles.addReminderBtnText}>
                    {isBn ? 'নতুন রিমাইন্ডার' : 'Add Reminder'}
                  </Text>
                </TouchableOpacity>
              </View>

              {reminders.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Feather name="bell-off" size={28} color={isDark ? '#5C5046' : '#C4B9AD'} />
                  <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                    {isBn ? 'কোনো রিমাইন্ডার সেট করা নেই' : 'No Custom Reminders Set'}
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    {isBn
                      ? 'নির্দিষ্ট প্যান্ডেলে রওনা হওয়ার বা অঞ্জলি মিস না করার অ্যালার্ট তৈরি করতে "নতুন রিমাইন্ডার" এ ট্যাপ করুন।'
                      : 'Schedule departure times, pandal hopping reminders, or ritual alarms by tapping "Add Reminder".'}
                  </Text>
                </View>
              ) : (
                <View style={styles.remindersList}>
                  {reminders.map((reminder) => {
                    const dateObj = new Date(reminder.scheduledTime);
                    const formattedDate = dateObj.toLocaleDateString(isBn ? 'bn-IN' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short',
                    });
                    const formattedTime = dateObj.toLocaleTimeString(isBn ? 'bn-IN' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <View
                        key={reminder.id}
                        style={[
                          styles.reminderCard,
                          {
                            backgroundColor: isDark ? '#241D19' : '#FAF6F2',
                            borderColor: colors.borderSubtle,
                          },
                        ]}
                      >
                        <View style={styles.reminderCardMain}>
                          <View style={styles.reminderCardHeader}>
                            <View style={styles.categoryBadge}>
                              <Text style={styles.categoryBadgeText}>
                                {reminder.category === 'puja-timings'
                                  ? isBn ? 'পূজা নির্ঘণ্ট' : 'PUJA TIMING'
                                  : reminder.category === 'saved-pandals'
                                  ? isBn ? 'প্যান্ডেল' : 'PANDAL'
                                  : isBn ? 'ব্যক্তিগত' : 'CUSTOM'}
                              </Text>
                            </View>
                            <Text style={[styles.reminderTimeText, { color: '#B42323' }]}>
                              {formattedDate} • {formattedTime}
                            </Text>
                          </View>
                          <Text style={[styles.reminderCardTitle, { color: colors.textPrimary }]}>
                            {reminder.title}
                          </Text>
                          {!!reminder.body && (
                            <Text style={[styles.reminderCardBody, { color: colors.textSecondary }]}>
                              {reminder.body}
                            </Text>
                          )}
                        </View>
                        <View style={styles.reminderActionsRow}>
                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => handleEditReminder(reminder)}
                            activeOpacity={0.7}
                            accessibilityLabel="Edit Reminder"
                          >
                            <Feather name="edit-2" size={15} color={colors.textSecondary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => removeReminder(reminder.id)}
                            activeOpacity={0.7}
                            accessibilityLabel="Delete Reminder"
                          >
                            <Feather name="trash-2" size={15} color={colors.textSecondary} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Section 3: Notification Verification Suite */}
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {isBn ? 'নোটিফিকেশন যাচাই ও পরীক্ষা স্যুট' : 'Notification Verification Suite'}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                {isBn
                  ? 'আপনার ডিভাইসে ব্যানার, সাউন্ড ও ব্যাকগ্রাউন্ড অ্যালার্ট সঠিকভাবে কাজ করছে কিনা পরীক্ষা করুন।'
                  : 'Verify real Android notification delivery in foreground, background, and deep-link routing.'}
              </Text>

              <View style={styles.testCategoryContainer}>
                {(['puja-timings', 'daily-schedule', 'custom-reminders', 'saved-pandals'] as NotificationCategory[]).map(
                  (cat) => {
                    const isSelected = selectedTestCategory === cat;
                    const labels: Record<NotificationCategory, string> = {
                      'puja-timings': isBn ? 'অঞ্জলি ও সন্ধিপূজা' : 'Puja Timing',
                      'daily-schedule': isBn ? 'দৈনিক সময়সূচী' : 'Daily Schedule',
                      'custom-reminders': isBn ? 'প্যান্ডেল স্মরণিকা' : 'Pandal Reminder',
                      'saved-pandals': isBn ? 'সংরক্ষিত প্যান্ডেল' : 'Saved Pandal',
                      events: isBn ? 'অনুষ্ঠান' : 'Event',
                    };

                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.testCatChip,
                          {
                            backgroundColor: isSelected
                              ? '#B42323'
                              : isDark
                              ? '#26201B'
                              : '#F2EDE7',
                            borderColor: isSelected ? '#B42323' : colors.borderSubtle,
                          },
                        ]}
                        onPress={() => setSelectedTestCategory(cat)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.testCatText,
                            { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                          ]}
                        >
                          {labels[cat]}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>

              {/* Action 1: Instant Test Alert */}
              <TouchableOpacity
                style={[styles.testSendBtn, testSending && { opacity: 0.6 }]}
                onPress={handleSendTest}
                disabled={testSending}
                activeOpacity={0.8}
                accessibilityLabel="Send Instant Test Notification"
              >
                <Feather name="bell" size={15} color="#FFFFFF" />
                <Text style={styles.testSendBtnText}>
                  {testSending
                    ? isBn ? 'পাঠানো হচ্ছে...' : 'Sending Test Alert...'
                    : isBn ? 'তাৎক্ষণিক নোটিফিকেশন পাঠান' : 'Send Instant Notification Now'}
                </Text>
              </TouchableOpacity>

              {/* Action 2: Delayed 5s Background Test */}
              <TouchableOpacity
                style={[
                  styles.testDelayBtn,
                  {
                    backgroundColor: isDark ? '#231D19' : '#F6F1EC',
                    borderColor: isDark ? '#3D332A' : '#E2DCD4',
                  },
                ]}
                onPress={handleSendDelayedTest}
                activeOpacity={0.8}
                accessibilityLabel="Send 5-second Delayed Background Notification"
              >
                <Feather name="clock" size={15} color="#B42323" />
                <Text style={[styles.testDelayBtnText, { color: colors.textPrimary }]}>
                  {delayedCountdown !== null
                    ? isBn
                      ? `ব্যাকগ্রাউন্ড কাউন্টডাউন: ${delayedCountdown} সেকেন্ড (স্ক্রিন বন্ধ বা মিনিমাইজ করুন)`
                      : `Fires in ${delayedCountdown}s (Press Home or lock screen!)`
                    : isBn
                    ? '৫ সেকেন্ড ব্যাকগ্রাউন্ড টেস্ট (লক/মিনিমাইজ পরীক্ষা)'
                    : 'Test in Background (5s Delay)'}
                </Text>
              </TouchableOpacity>

              {/* Action 3: Clear Shade Test Alerts */}
              <TouchableOpacity
                style={[
                  styles.clearShadeBtn,
                  {
                    borderColor: isDark ? '#3D332A' : '#E2DCD4',
                  },
                ]}
                onPress={handleClearShade}
                activeOpacity={0.7}
                accessibilityLabel="Dismiss All Test Notifications"
              >
                <Feather name="check-circle" size={14} color={colors.textSecondary} />
                <Text style={[styles.clearShadeBtnText, { color: colors.textSecondary }]}>
                  {isBn ? 'নোটিফিকেশন শেড পরিষ্কার করুন' : 'Dismiss All Shade Alerts'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Tab 2: Notification History */
          <View style={styles.tabContent}>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.customHeaderRow}>
                <View>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    {isBn ? 'বিজ্ঞপ্তির রেকর্ড' : 'In-App Notification Center'}
                  </Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    {isBn
                      ? 'পূর্ববর্তী নোটিফিকেশনসমূহ পর্যালোচনা করতে স্পর্শ করুন'
                      : 'Tap any alert to navigate directly to its associated ritual or pandal'}
                  </Text>
                </View>
                {history.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearHistoryBtn}
                    onPress={clearHistory}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.clearHistoryBtnText}>
                      {isBn ? 'সব মুছুন' : 'Clear All'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {history.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="notifications-outline" size={32} color={isDark ? '#5C5046' : '#C4B9AD'} />
                  <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                    {isBn ? 'কোনো পূর্ববর্তী বিজ্ঞপ্তি নেই' : 'No Recent Alerts'}
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                    {isBn
                      ? 'যখনই কোনো সময়সূচী বা রিমাইন্ডার নির্ধারিত হবে, তার রেকর্ড এখানে সংরক্ষিত হবে।'
                      : 'Received alerts for rituals, pandals, and daily timelines will be listed here.'}
                  </Text>
                </View>
              ) : (
                <View style={styles.historyList}>
                  {history.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.historyItem,
                        {
                          backgroundColor: item.read
                            ? isDark
                              ? '#1E1916'
                              : '#FAF7F3'
                            : isDark
                            ? '#2A201B'
                            : '#FFF7F2',
                          borderColor: item.read ? colors.borderSubtle : '#F6CECA',
                        },
                      ]}
                      onPress={() => handleHistoryTap(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.historyDotWrap}>
                        {!item.read && <View style={styles.unreadDot} />}
                      </View>
                      <View style={styles.historyTextWrap}>
                        <View style={styles.historyMetaRow}>
                          <Text style={[styles.historyCategory, { color: '#B42323' }]}>
                            {item.category.toUpperCase()}
                          </Text>
                          <Text style={[styles.historyTime, { color: colors.textMuted }]}>
                            {new Date(item.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>
                        <Text style={[styles.historyTitle, { color: colors.textPrimary }]}>
                          {item.title}
                        </Text>
                        <Text style={[styles.historyBody, { color: colors.textSecondary }]}>
                          {item.body}
                        </Text>
                        {!!item.targetScreen && (
                          <View style={styles.openScreenRow}>
                            <Text style={styles.openScreenText}>
                              {isBn ? `খুলুন: ${item.targetScreen}` : `Open: ${item.targetScreen}`}
                            </Text>
                            <Feather name="arrow-up-right" size={12} color="#B42323" />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Custom Reminder Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? '#1C1714' : '#FFFFFF',
                borderColor: colors.border,
                maxWidth: isLandscape ? 580 : undefined,
                alignSelf: isLandscape ? 'center' : undefined,
                width: '100%',
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {editingReminderId
                  ? isBn ? 'রিমাইন্ডার সম্পাদনা করুন' : 'Edit Scheduled Reminder'
                  : isBn ? 'নতুন রিমাইন্ডার সেট করুন' : 'Schedule Custom Reminder'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.7}>
                <Feather name="x" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Reminder Title */}
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                {isBn ? 'রিমাইন্ডারের শিরোনাম *' : 'Reminder Title *'}
              </Text>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    backgroundColor: isDark ? '#26201B' : '#F7F3EE',
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder={isBn ? 'উদাঃ অঞ্জলির জন্য বের হওয়া' : 'e.g. Leave for Ashtami Anjali'}
                placeholderTextColor={colors.textMuted}
                value={reminderTitle}
                onChangeText={setReminderTitle}
              />

              {/* Reminder Notes */}
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                {isBn ? 'অতিরিক্ত নোট (ঐচ্ছিক)' : 'Notes / Pandal (Optional)'}
              </Text>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    backgroundColor: isDark ? '#26201B' : '#F7F3EE',
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder={isBn ? 'উদাঃ বাগবাজার সর্বজনীন মণ্ডপ' : 'e.g. Bagbazar Sarbojanin pandal visit'}
                placeholderTextColor={colors.textMuted}
                value={reminderNotes}
                onChangeText={setReminderNotes}
              />

              {/* Day Selection Presets */}
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                {isBn ? 'পুজোর দিন নির্বাচন করুন' : 'Select Puja Day (2026)'}
              </Text>
              <View style={styles.dayPresetsRow}>
                {[
                  { label: isBn ? 'মহাসপ্তমী' : 'Saptami', date: '2026-10-18' },
                  { label: isBn ? 'মহাঅষ্টমী' : 'Ashtami', date: '2026-10-19' },
                  { label: isBn ? 'মহানবমী' : 'Navami', date: '2026-10-20' },
                  { label: isBn ? 'বিজয়াদশমী' : 'Dashami', date: '2026-10-21' },
                ].map((item) => {
                  const isSelected = reminderDay === item.date;
                  return (
                    <TouchableOpacity
                      key={item.date}
                      style={[
                        styles.dayPresetBtn,
                        {
                          backgroundColor: isSelected
                            ? '#B42323'
                            : isDark
                            ? '#2A241F'
                            : '#F0ECE6',
                          borderColor: isSelected ? '#B42323' : colors.borderSubtle,
                        },
                      ]}
                      onPress={() => setReminderDay(item.date)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.dayPresetText,
                          { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Time Presets */}
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                {isBn ? 'সময় নির্বাচন করুন' : 'Select Alert Time'}
              </Text>
              <View style={styles.timePresetsRow}>
                {['06:00', '07:00', '07:30', '11:00', '17:30', '20:00'].map((time) => {
                  const isSelected = reminderTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timePresetBtn,
                        {
                          backgroundColor: isSelected
                            ? '#B42323'
                            : isDark
                            ? '#2A241F'
                            : '#F0ECE6',
                          borderColor: isSelected ? '#B42323' : colors.borderSubtle,
                        },
                      ]}
                      onPress={() => setReminderTime(time)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.timePresetText,
                          { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSubmitBtn}
                  onPress={handleSaveReminder}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalSubmitText}>
                    {editingReminderId
                      ? isBn ? 'আপডেট করুন' : 'Update Alert'
                      : isBn ? 'সংরক্ষণ করুন' : 'Set Reminder'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  headerSection: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#B42323',
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  permissionBanner: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  bannerIconWrap: {
    marginTop: 2,
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  enableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D9531E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  enableBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  activeBannerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabContent: {
    gap: 16,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingTextWrap: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  settingDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  timeSelectorRow: {
    marginTop: 12,
    paddingTop: 10,
  },
  timeSelectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  customHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addReminderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#B42323',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addReminderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  remindersList: {
    gap: 10,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  reminderCardMain: {
    flex: 1,
  },
  reminderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#FDEEEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    color: '#B42323',
    fontSize: 10,
    fontWeight: '800',
  },
  reminderTimeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reminderCardTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  reminderCardBody: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  bannerBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  settingsBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  blockedChannelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  blockedChannelTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  blockedChannelDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  channelFixBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#D97706',
    borderRadius: 8,
  },
  channelFixBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  reminderActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionIconBtn: {
    padding: 6,
  },
  testDelayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  testDelayBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  clearShadeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  clearShadeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteReminderBtn: {
    padding: 8,
  },
  testCategoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 14,
  },
  testCatChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  testCatText: {
    fontSize: 12,
    fontWeight: '600',
  },
  testSendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B42323',
    paddingVertical: 11,
    borderRadius: 10,
  },
  testSendBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  clearHistoryBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearHistoryBtnText: {
    color: '#B42323',
    fontSize: 12,
    fontWeight: '700',
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  historyDotWrap: {
    paddingTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B42323',
  },
  historyTextWrap: {
    flex: 1,
  },
  historyMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyCategory: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  historyTime: {
    fontSize: 11,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  historyBody: {
    fontSize: 12,
    lineHeight: 16,
  },
  openScreenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  openScreenText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B42323',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 12,
  },
  inputField: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  dayPresetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayPresetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  dayPresetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timePresetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timePresetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  timePresetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#B42323',
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
