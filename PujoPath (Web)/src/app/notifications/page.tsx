'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink,
  Plus,
  Send,
  AlertCircle,
  Check,
  Flame,
  Volume2,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useNotifications } from '@/lib/context/NotificationContext';
import { NotificationCategory, CustomReminder } from '@/types/notification';

export default function NotificationsPage() {
  const { locale } = useI18n();
  const isBn = locale === 'bn';

  const {
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
    removeReminder,
    sendTestNotification,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'inbox' | 'preferences' | 'reminders'>('inbox');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('puja-timings');
  const [isTestSending, setIsTestSending] = useState(false);
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);

  // New Reminder Form State
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('2026-10-19'); // Maha Ashtami default
  const [reminderTime, setReminderTime] = useState('08:30');
  const [reminderNotes, setReminderNotes] = useState('');
  const [reminderCategory, setReminderCategory] = useState<NotificationCategory>('custom-reminders');

  const handleTestNotification = async () => {
    setIsTestSending(true);
    await sendTestNotification(selectedCategory);
    setIsTestSending(false);
    setTestSentMessage(
      isBn ? 'টেস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!' : 'Test alert dispatched successfully!'
    );
    setTimeout(() => setTestSentMessage(null), 3500);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    const scheduledTime = new Date(`${reminderDate}T${reminderTime}:00`).toISOString();
    addCustomReminder({
      title: reminderTitle.trim(),
      body: reminderNotes.trim() || undefined,
      scheduledTime,
      category: reminderCategory,
      targetScreen: '/calendar',
    });

    setReminderTitle('');
    setReminderNotes('');
    setShowAddReminderModal(false);
  };

  const categories = [
    {
      id: 'puja-timings' as NotificationCategory,
      label: isBn ? 'পূজা সময় ও সন্ধিপূজা' : 'Puja Timings & Muhurat',
      desc: isBn
        ? 'মহাষ্টমী পুষ্পাঞ্জলি, সন্ধিপূজা বলিদান ও তিথির শুভক্ষণ শুরু হওয়ার পূর্বে তাৎক্ষণিক অ্যালার্ট।'
        : 'Timely reminders before Sandhi Puja, Pushpanjali muhurats, and tithi transitions.',
      key: 'pujaTimings' as const,
    },
    {
      id: 'daily-schedule' as NotificationCategory,
      label: isBn ? 'প্রতিদিনের উৎসব সংক্ষেপ' : 'Daily Festive Morning Brief',
      desc: isBn
        ? 'প্রতিটি উৎসবের দিনে সকালবেলা সারাদিনের প্রধান আচার ও ট্রানজিট বিবরণী।'
        : 'Morning overview of rituals, auspicious timings, and transit notes for each festival day.',
      key: 'dailySchedule' as const,
    },
    {
      id: 'saved-pandals' as NotificationCategory,
      label: isBn ? 'সংরক্ষিত মণ্ডপ ও ভিড় আপডেট' : 'Saved Pandals & Crowd Status',
      desc: isBn
        ? 'আপনার পছন্দের মণ্ডপসমূহের ভিড় হ্রাস ও বিশেষ আরতির সময়সূচী।'
        : 'Smart alerts when your saved pandals experience low crowd density.',
      key: 'savedPandals' as const,
    },
    {
      id: 'custom-reminders' as NotificationCategory,
      label: isBn ? 'ব্যক্তিগত অনুস্মারক' : 'Personal Custom Reminders',
      desc: isBn
        ? 'বন্ধুদের সাথে প্যান্ডেল হপিং বা পরিবারের সাথে নির্দিষ্ট অঞ্জলির সময় নির্ধারণ।'
        : 'Custom user-created alarms and reminders for pandal hopping itineraries.',
      key: 'customReminders' as const,
    },
    {
      id: 'events' as NotificationCategory,
      label: isBn ? 'উৎসব ইভেন্ট ও বারাসাত আলো' : 'Festival Events & Barasat Guide',
      desc: isBn
        ? 'বারাসাত আলোকসজ্জা, কার্নিভাল এবং বিশেষ মেট্রো ট্রেনের আপডেট।'
        : 'Live updates regarding Chandannagar illumination gates and overnight metro schedules.',
      key: 'events' as const,
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 px-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#b42323] dark:text-[#e05656] text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>{isBn ? 'বিজ্ঞপ্তি ও অ্যালার্ট কেন্দ্র' : 'Notification Center'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#242424] dark:text-[#ede5dc] mt-1 tracking-tight">
            {isBn ? 'উৎসব বিজ্ঞপ্তি ও সময়সূচী' : 'Festive Alerts & Reminders'}
          </h1>
          <p className="text-sm sm:text-base text-[#665a54] dark:text-[#a89e95] mt-1.5 leading-relaxed max-w-2xl">
            {isBn
              ? 'পূজার অঞ্জলি, সন্ধিপূজা ও ব্যক্তিগত প্যান্ডেল হপিং সময়সূচীর তাৎক্ষণিক নোটিফিকেশন পান।'
              : 'Never miss Sandhi Puja, morning Pushpanjali, or your planned hopping routes.'}
          </p>
        </div>

        {/* Permission Request Badge */}
        {!permissionGranted && (
          <button
            onClick={requestPermission}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#b42323] hover:bg-[#901c1c] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 self-start sm:self-auto"
          >
            <BellRing className="w-4 h-4" />
            <span>{isBn ? 'নোটিফিকেশন চালু করুন' : 'Enable Notifications'}</span>
          </button>
        )}

        {permissionGranted && (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold shrink-0 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isBn ? 'ব্রাউজার অ্যালার্ট সক্রিয়' : 'Browser Alerts Enabled'}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#eee8e1] dark:border-[#2f2720] pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'inbox'
              ? 'bg-[#b42323] text-white shadow-xs'
              : 'bg-transparent text-[#665a54] dark:text-[#a89e95] hover:bg-[#faf7f2] dark:hover:bg-[#251e18]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{isBn ? 'অ্যালার্ট ইনবক্স' : 'Alert Inbox'}</span>
          {unreadCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'inbox' ? 'bg-white text-[#b42323]' : 'bg-[#b42323] text-white'
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'preferences'
              ? 'bg-[#b42323] text-white shadow-xs'
              : 'bg-transparent text-[#665a54] dark:text-[#a89e95] hover:bg-[#faf7f2] dark:hover:bg-[#251e18]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isBn ? 'পছন্দ ও ক্যাটাগরি' : 'Alert Preferences'}</span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'reminders'
              ? 'bg-[#b42323] text-white shadow-xs'
              : 'bg-transparent text-[#665a54] dark:text-[#a89e95] hover:bg-[#faf7f2] dark:hover:bg-[#251e18]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{isBn ? 'ব্যক্তিগত রিমাইন্ডার' : 'Custom Reminders'}</span>
          {reminders.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#eee8e1] dark:bg-[#382e25] text-[#242424] dark:text-[#ede5dc]">
              {reminders.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: INBOX */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-[#8a7f76] dark:text-[#7f746b]">
              {isBn ? `মোট ${history.length}টি নোটিফিকেশন` : `Total ${history.length} notifications`}
            </span>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="font-bold text-[#b42323] dark:text-[#e05656] hover:underline"
                >
                  {isBn ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark all as read'}
                </button>
              )}
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="font-bold text-[#8a7f76] dark:text-[#7f746b] hover:text-red-600 transition-colors"
                >
                  {isBn ? 'ইনবক্স মুছুন' : 'Clear history'}
                </button>
              )}
            </div>
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#faf7f2] dark:bg-[#251e18] flex items-center justify-center mx-auto text-[#8a7f76]">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'কোনো নোটিফিকেশন নেই' : 'No Notifications Yet'}
              </h3>
              <p className="text-xs text-[#665a54] dark:text-[#a89e95] max-w-sm mx-auto">
                {isBn
                  ? 'পূজা শুরু হলে ও আপনার সংরক্ষিত মণ্ডপের ভিড় কমে গেলে এখানে নোটিফিকেশন জমা হবে।'
                  : 'Festive updates, Sandhi Puja alerts, and custom reminders will appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markNotificationRead(item.id)}
                  className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                    item.read
                      ? 'bg-white dark:bg-[#1a1613] border-[#eee8e1] dark:border-[#2f2720] opacity-85'
                      : 'bg-gradient-to-r from-[#fff9f5] to-white dark:from-[#21160e] dark:to-[#1a1613] border-[#f0cbb0] dark:border-[#52331f] shadow-xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#faf7f2] dark:bg-[#251e18] text-[#8a7f76] dark:text-[#a89e95] border border-[#ded4c8] dark:border-[#382e25]">
                        {item.category}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#b42323] shrink-0" />
                      )}
                      <span className="text-[11px] text-[#8a7f76] dark:text-[#7f746b]">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#242424] dark:text-[#ede5dc]">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#665a54] dark:text-[#a89e95] leading-relaxed">
                      {item.body}
                    </p>
                  </div>

                  {item.targetScreen && (
                    <Link
                      href={item.targetScreen}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#faf7f2] dark:bg-[#251e18] border border-[#ded4c8] dark:border-[#382e25] text-xs font-bold text-[#b42323] dark:text-[#e05656] hover:bg-[#b42323] hover:text-white transition-all shrink-0"
                    >
                      <span>{isBn ? 'দেখুন' : 'Open'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card space-y-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'বিজ্ঞপ্তি গ্রহণের ক্যাটাগরি' : 'Alert Categories'}
              </h2>
              <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] mt-1">
                {isBn
                  ? 'যেসব উৎসবের তথ্যের অ্যালার্ট পেতে চান তা সক্রিয় বা নিষ্ক্রিয় করুন।'
                  : 'Choose which festive notifications you would like to receive.'}
              </p>
            </div>

            <div className="space-y-4 divide-y divide-[#eee8e1] dark:divide-[#2f2720]">
              {categories.map((cat) => {
                const isEnabled = preferences[cat.key];
                return (
                  <div
                    key={cat.id}
                    className="pt-4 first:pt-0 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#242424] dark:text-[#ede5dc]">
                        {cat.label}
                      </h4>
                      <p className="text-xs text-[#665a54] dark:text-[#a89e95] leading-relaxed max-w-lg">
                        {cat.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => updatePreferences({ [cat.key]: !isEnabled })}
                      aria-label={`Toggle ${cat.label}`}
                      className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 focus:outline-none ${
                        isEnabled ? 'bg-[#b42323]' : 'bg-[#ded4c8] dark:bg-[#382e25]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Notification Action Box */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#faf7f2] dark:bg-[#1f1a16] border border-[#eee8e1] dark:border-[#2f2720] shadow-card space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'টেস্ট অ্যালার্ট পাঠান' : 'Test Alert Delivery'}
              </h3>
              <p className="text-xs text-[#665a54] dark:text-[#a89e95] mt-1">
                {isBn
                  ? 'আপনার ডিভাইসে ব্রাউজার ও ইন-অ্যাপ নোটিফিকেশন সঠিকভাবে কাজ করছে কিনা পরীক্ষা করুন।'
                  : 'Trigger a simulated festive alert to verify sound and popups on this browser.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as NotificationCategory)}
                className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#251e18] border border-[#ded4c8] dark:border-[#382e25] text-xs font-bold text-[#242424] dark:text-[#ede5dc] focus:outline-none"
              >
                <option value="puja-timings">Puja Timings & Muhurat</option>
                <option value="daily-schedule">Daily Festive Brief</option>
                <option value="saved-pandals">Saved Pandals</option>
                <option value="custom-reminders">Personal Reminder</option>
                <option value="events">Barasat Light Corridor</option>
              </select>

              <button
                onClick={handleTestNotification}
                disabled={isTestSending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#b42323] hover:bg-[#901c1c] text-white font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isBn ? 'টেস্ট অ্যালার্ট ট্রিগার করুন' : 'Dispatch Test Alert'}</span>
              </button>
            </div>

            {testSentMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{testSentMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'আপনার ব্যক্তিগত পূজা রিমাইন্ডার' : 'Your Custom Puja Reminders'}
              </h2>
              <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] mt-0.5">
                {isBn
                  ? 'পুজোয় কোনো নির্দিষ্ট মণ্ডপে যাওয়া বা আরতি দেখার জন্য রিমাইন্ডার সেট করুন।'
                  : 'Schedule customized reminders for specific rituals, anjali, or friend meetups.'}
              </p>
            </div>

            <button
              onClick={() => setShowAddReminderModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#b42323] hover:bg-[#901c1c] text-white font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>{isBn ? 'নতুন রিমাইন্ডার' : 'New Reminder'}</span>
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#faf7f2] dark:bg-[#251e18] flex items-center justify-center mx-auto text-[#8a7f76]">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'কোনো ব্যক্তিগত রিমাইন্ডার তৈরি করা হয়নি' : 'No Custom Reminders Created'}
              </h3>
              <p className="text-xs text-[#665a54] dark:text-[#a89e95] max-w-sm mx-auto">
                {isBn
                  ? 'মহাষ্টমীর অঞ্জলি বা সন্ধিপূজা দেখার জন্য নিজস্ব সময়সূচী নির্ধারণ করতে "নতুন রিমাইন্ডার" বোতামে চাপ দিন।'
                  : 'Click "New Reminder" to set specific alerts for anjali or meeting friends.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-card flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-900/40">
                        {rem.category}
                      </span>
                      <button
                        onClick={() => removeReminder(rem.id)}
                        className="text-[#8a7f76] hover:text-red-600 transition-colors"
                        aria-label="Delete Reminder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-[#242424] dark:text-[#ede5dc]">
                      {rem.title}
                    </h4>

                    {rem.body && (
                      <p className="text-xs text-[#665a54] dark:text-[#a89e95] leading-relaxed">
                        {rem.body}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#f2ece4] dark:border-[#27211c] flex items-center justify-between text-xs text-[#8a7f76] dark:text-[#7f746b]">
                    <span className="flex items-center gap-1 font-semibold text-[#b42323] dark:text-[#e05656]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(rem.scheduledTime).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(rem.scheduledTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD CUSTOM REMINDER */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1a1613] border border-[#eee8e1] dark:border-[#2f2720] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'নতুন রিমাইন্ডার যোগ করুন' : 'Schedule Custom Reminder'}
              </h3>
              <button
                onClick={() => setShowAddReminderModal(false)}
                className="text-xs font-bold text-[#8a7f76] hover:text-[#242424] dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7f76] dark:text-[#7f746b] mb-1.5">
                  {isBn ? 'অনুস্মারকের শিরোনাম *' : 'Reminder Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  placeholder={
                    isBn
                      ? 'উদা: বাগবাজার পুষ্পাঞ্জলি বা বন্ধুদের সাথে মিলন'
                      : 'e.g. Bagbazar Morning Anjali'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#faf7f2] dark:bg-[#251e18] border border-[#ded4c8] dark:border-[#382e25] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-none focus:border-[#b42323]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7f76] dark:text-[#7f746b] mb-1.5">
                    {isBn ? 'তারিখ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#faf7f2] dark:bg-[#251e18] border border-[#ded4c8] dark:border-[#382e25] text-xs text-[#242424] dark:text-[#ede5dc] focus:outline-none focus:border-[#b42323]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7f76] dark:text-[#7f746b] mb-1.5">
                    {isBn ? 'সময়' : 'Time'}
                  </label>
                  <input
                    type="time"
                    required
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#faf7f2] dark:bg-[#251e18] border border-[#ded4c8] dark:border-[#382e25] text-xs text-[#242424] dark:text-[#ede5dc] focus:outline-none focus:border-[#b42323]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8a7f76] dark:text-[#7f746b] mb-1.5">
                  {isBn ? 'সংক্ষিপ্ত বিবরণ বা নোট' : 'Optional Notes'}
                </label>
                <textarea
                  rows={2}
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                  placeholder={
                    isBn
                      ? 'অঞ্জলির ফুল বা বন্ধুদের সাথে নির্দিষ্ট এক্সিট গেটে দেখা...'
                      : 'Bring sacred flowers or meet at Station Platform 1 gate...'
                  }
                  className="w-full px-4 py-2 rounded-xl bg-[#faf7f2] dark:bg-[#251e18] border border-[#ded4c8] dark:border-[#382e25] text-xs sm:text-sm text-[#242424] dark:text-[#ede5dc] focus:outline-none focus:border-[#b42323] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#8a7f76] hover:bg-[#faf7f2] dark:hover:bg-[#251e18]"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#b42323] hover:bg-[#901c1c] text-white font-bold text-xs shadow-xs"
                >
                  {isBn ? 'সংরক্ষণ করুন' : 'Save Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
