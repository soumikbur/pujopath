'use client';

import React, { useEffect, useState } from 'react';
import {
  Download,
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Apple,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { NATIVE_APK_DOWNLOAD_URL } from '@/lib/config';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils/cn';

interface InstallNativeAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DevicePlatform = 'android' | 'ios' | 'desktop';

export function InstallNativeAppModal({ isOpen, onClose }: InstallNativeAppModalProps) {
  const { locale } = useI18n();
  const isBn = locale === 'bn';
  const [platform, setPlatform] = useState<DevicePlatform>('android');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroidDevice = /android/i.test(ua);

    if (isAndroidDevice) {
      setPlatform('android');
    } else if (isIOSDevice) {
      setPlatform('ios');
    } else {
      setPlatform('desktop');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-modal-title"
      className="fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#181411] border border-[#eee8e1] dark:border-[#2a241f] shadow-2xl p-5 sm:p-7 text-[#242424] dark:text-[#ede5dc] space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={isBn ? 'বন্ধ করুন' : 'Close modal'}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#776d65] dark:text-[#a89e95] hover:bg-[#f5f1ec] dark:hover:bg-[#221c17] hover:text-[#242424] dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ========================================================= */}
        {/* 1. ANDROID DEVICE VIEW                                    */}
        {/* ========================================================= */}
        {platform === 'android' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isBn ? 'নেটিভ অ্যান্ড্রয়েড অ্যাপ' : 'Native Android App'}</span>
              </span>
              <span className="text-xs text-[#776d65] dark:text-[#a89e95] font-semibold">
                v0.1.0 (APK)
              </span>
            </div>

            <div>
              <h3
                id="install-modal-title"
                className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight"
              >
                {isBn ? 'পূজাপাথ অ্যান্ড্রয়েড অ্যাপ ইনস্টল' : 'Install PujoPath on Android'}
              </h3>
              <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] mt-1 leading-relaxed">
                {isBn
                  ? 'এটি রিঅ্যাক্ট নেটিভে নির্মিত অফিশিয়াল পিওর নেটিভ অ্যান্ড্রয়েড অ্যাপ (app.pujopath.mobile)। ডাউনলোড করে সহজেই ইনস্টল করুন।'
                  : 'Official standalone React Native Android package (app.pujopath.mobile). Follow these quick steps to install:'}
              </p>
            </div>

            {/* Step by step installation guidance */}
            <div className="space-y-2.5 rounded-2xl bg-[#fcfaf7] dark:bg-[#1f1a16] border border-[#eee8e1] dark:border-[#2a241f] p-3.5 sm:p-4 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pujo-red text-white text-[11px] font-bold">
                  1
                </span>
                <div>
                  <p className="font-bold text-[#242424] dark:text-[#ede5dc]">
                    {isBn ? 'APK ফাইল ডাউনলোড করুন' : 'Download the Native APK'}
                  </p>
                  <p className="text-[11px] text-[#776d65] dark:text-[#a89e95] mt-0.5">
                    {isBn
                      ? 'নিচের বাটনে ট্যাপ করে PujoPath-Native.apk ডাউনলোড শুরু করুন।'
                      : 'Tap the download button below. File size is ~107 MB.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pujo-red text-white text-[11px] font-bold">
                  2
                </span>
                <div>
                  <p className="font-bold text-[#242424] dark:text-[#ede5dc]">
                    {isBn ? 'ডাউনলোড সম্পন্ন হলে ফাইলটিতে ট্যাপ করুন' : 'Open the Downloaded File'}
                  </p>
                  <p className="text-[11px] text-[#776d65] dark:text-[#a89e95] mt-0.5">
                    {isBn
                      ? 'নোটিফিকেশন বার অথবা ফাইলের Downloads ফোল্ডার থেকে PujoPath-Native.apk খুলুন।'
                      : 'Tap the finished download notification or open it from your phone’s Files / Downloads app.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pujo-red text-white text-[11px] font-bold">
                  3
                </span>
                <div>
                  <p className="font-bold text-[#242424] dark:text-[#ede5dc]">
                    {isBn ? 'ব্রাউজার থেকে ইনস্টলেশনের অনুমতি দিন' : 'Allow Installation from Browser'}
                  </p>
                  <p className="text-[11px] text-[#776d65] dark:text-[#a89e95] mt-0.5">
                    {isBn
                      ? 'যদি অ্যান্ড্রয়েড "Install unknown apps" সতর্কবার্তা দেখায়, Settings-এ গিয়ে "Allow from this source" অন করুন।'
                      : 'If prompted by Android security, tap Settings and enable "Allow from this source" for your browser.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Download Button */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <a
                href={NATIVE_APK_DOWNLOAD_URL}
                download="PujoPath-Native.apk"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pujo-red hover:bg-[#991b1b] text-white font-bold text-sm shadow-md transition-all active:scale-95 text-center"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'ডাউনলোড PujoPath-Native.apk (১০৭ MB)' : 'Download PujoPath-Native.apk (107 MB)'}</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-[#eee8e1] dark:border-[#332b24] text-xs font-bold text-[#665a54] dark:text-[#a89e95] hover:bg-[#f5f1ec] dark:hover:bg-[#201c18]"
              >
                {isBn ? 'বন্ধ করুন' : 'Dismiss'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. DESKTOP VIEW                                           */}
        {/* ========================================================= */}
        {platform === 'desktop' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <Laptop className="w-3.5 h-3.5" />
                <span>{isBn ? 'অ্যান্ড্রয়েড নেটিভ প্যাকেজ' : 'Android APK Package'}</span>
              </span>
            </div>

            <div>
              <h3
                id="install-modal-title"
                className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight"
              >
                {isBn ? 'পূজাপাথ নেটিভ অ্যান্ড্রয়েড সংস্করণ' : 'PujoPath Native Android App'}
              </h3>
              <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] mt-1 leading-relaxed">
                {isBn
                  ? 'এই প্যাকেজটি (PujoPath-Native.apk) সরাসরি অ্যান্ড্রয়েড স্মার্টফোনের জন্য কম্পাইল করা হয়েছে। এটি উইন্ডোজ, ম্যাক বা লিনাক্সে সরাসরি রান করবে না।'
                  : 'This standalone APK is built specifically for Android phones (app.pujopath.mobile). It does not run directly on desktop operating systems (Windows, macOS, or Linux).'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fcfaf7] dark:bg-[#1f1a16] border border-[#eee8e1] dark:border-[#2a241f] p-4 text-xs space-y-2">
              <p className="font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'আপনার অ্যান্ড্রয়েড ফোনে কীভাবে চালাবেন?' : 'How to test on your Android device:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#665a54] dark:text-[#a89e95] leading-relaxed">
                <li>
                  {isBn
                    ? 'আপনার ফোনে Chrome খুলে pujopath-five.vercel.app ভিজিট করে Install App-এ ট্যাপ করুন।'
                    : 'Open Chrome on your Android phone, visit pujopath-five.vercel.app, and tap Install App.'}
                </li>
                <li>
                  {isBn
                    ? 'অথবা নিচের লিংক থেকে APK ডাউনলোড করে USB / Google Drive দিয়ে ফোনে পাঠিয়ে ইনস্টল করুন।'
                    : 'Or download the APK below and transfer it to your phone via USB cable or cloud storage.'}
                </li>
              </ul>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <a
                href={NATIVE_APK_DOWNLOAD_URL}
                download="PujoPath-Native.apk"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pujo-red hover:bg-[#991b1b] text-white font-bold text-sm shadow-md transition-all active:scale-95 text-center"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isBn ? 'ফোনের জন্য APK ডাউনলোড করুন (১০৭ MB)' : 'Download APK for Phone (107 MB)'}</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl border border-[#eee8e1] dark:border-[#332b24] text-xs font-bold text-[#665a54] dark:text-[#a89e95] hover:bg-[#f5f1ec] dark:hover:bg-[#201c18]"
              >
                {isBn ? 'ঠিক আছে' : 'Got it'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. IOS DEVICE VIEW                                        */}
        {/* ========================================================= */}
        {platform === 'ios' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                <Apple className="w-3.5 h-3.5" />
                <span>{isBn ? 'iOS ডিভাইস তথ্য' : 'Apple iOS Notice'}</span>
              </span>
            </div>

            <div>
              <h3
                id="install-modal-title"
                className="text-xl sm:text-2xl font-black text-[#242424] dark:text-[#ede5dc] tracking-tight"
              >
                {isBn ? 'অ্যাপল ডিভাইসে পূজাপাথ' : 'PujoPath on Apple iOS'}
              </h3>
              <p className="text-xs sm:text-sm text-[#665a54] dark:text-[#a89e95] mt-1 leading-relaxed">
                {isBn
                  ? 'বর্তমান APK প্যাকেজটি বিশেষভাবে অ্যান্ড্রয়েড ফোনের জন্য তৈরি। অ্যাপলের জন্য নেটিভ iOS সংস্করণ প্রস্তুত করা হচ্ছে।'
                  : 'The standalone APK package is exclusively for Android phones. A native iOS edition is currently in active preparation.'}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fcfaf7] dark:bg-[#1f1a16] border border-[#eee8e1] dark:border-[#2a241f] p-4 text-xs space-y-2">
              <p className="font-bold text-[#242424] dark:text-[#ede5dc]">
                {isBn ? 'আইফোনে সেরা অভিজ্ঞতা:' : 'Recommended iOS Experience:'}
              </p>
              <p className="text-[#665a54] dark:text-[#a89e95] leading-relaxed">
                {isBn
                  ? 'সাফারি ব্রাউজারে পূজাপাথের সম্পূর্ণ সুবিধা উপভোগ করুন। দ্রুত অ্যাক্সেসের জন্য সাফারির Share বাটনে ট্যাপ করে "Add to Home Screen" নির্বাচন করুন।'
                  : 'Enjoy the complete PujoPath experience right here in Safari. For 1-tap access from your home screen, tap the Share icon below and select "Add to Home Screen".'}
              </p>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-pujo-red hover:bg-[#991b1b] text-white font-bold text-sm shadow-md transition-all active:scale-95 text-center"
              >
                {isBn ? 'সাফারিতে চালিয়ে যান' : 'Continue in Safari'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
