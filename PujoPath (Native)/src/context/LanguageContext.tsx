import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'bn';

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const DICTIONARY: Translations = {
  appName: { en: 'PujoPath', bn: 'পূজোপথ' },
  tagline: { en: 'Discover. Plan. Experience Pujo.', bn: 'খুঁজুন। সাজান। পূজার আনন্দ উপভোগ করুন।' },
  home: { en: 'Home', bn: 'হোম' },
  explore: { en: 'Explore', bn: 'মণ্ডপ দর্শন' },
  map: { en: 'Map', bn: 'ম্যাপ' },
  planner: { en: 'Planner', bn: 'রুট প্ল্যানার' },
  more: { en: 'More', bn: 'আরও' },
  metro: { en: 'Metro Guide', bn: 'মেট্রো গাইড' },
  calendar: { en: 'Calendar', bn: 'পঞ্জিকা ও নির্ঘণ্ট' },
  music: { en: 'Puja Music', bn: 'পূজার গান ও ঢাক' },
  mahalaya: { en: 'Mahalaya', bn: 'মহালয়া' },
  helpline: { en: 'Helpline', bn: 'জরুরি হেল্পলাইন' },
  saved: { en: 'Favorites', bn: 'পছন্দের তালিকা' },
  searchPlaceholder: { en: 'Search pandals, locality, theme...', bn: 'মণ্ডপ, এলাকা বা থিম খুঁজুন...' },
  allZones: { en: 'All Zones', bn: 'সব অঞ্চল' },
  totalPandals: { en: '770 Pandals', bn: '৭৭০ মণ্ডপ' },
  verifiedPandals: { en: 'Verified Pandals', bn: 'যাচাইকৃত মণ্ডপ' },
  nearestMetro: { en: 'Nearest Metro', bn: 'নিকটতম মেট্রো' },
  addToPlan: { en: 'Add to Plan', bn: 'রুটে যোগ করুন' },
  inPlan: { en: 'In Plan', bn: 'রুটে আছে' },
  optimizeRoute: { en: 'Smart Optimize Route', bn: 'স্মার্ট রুট সাজান' },
  startNavigation: { en: 'Start Navigation', bn: 'ন্যাভিগেশন শুরু করুন' },
  totalDistance: { en: 'Total Distance', bn: 'মোট দূরত্ব' },
  stopsCount: { en: 'stops', bn: 'টি স্টপ' },
  emptyRouteTitle: { en: 'Your Itinerary is Empty', bn: 'আপনার রুট এখনো খালি' },
  emptyRouteDesc: { en: 'Explore pandals and tap "Add to Plan" to build your custom pandal hopping trail.', bn: 'পছন্দের মণ্ডপ খুঁজুন এবং "রুটে যোগ করুন" ট্যাপ করে আপনার পরিক্রমা তৈরি করুন।' },
  sandhiPuja: { en: 'Sandhi Puja Timing', bn: 'সন্ধিপূজার শুভ মুহূর্ত' },
  sandhiPujaDesc: { en: '19 Oct 2026, 10:27 AM – 11:15 AM IST (48 Mins)', bn: '১৯ অক্টোবর ২০২৬, সকাল ১০:২৭ – ১১:১৫ (৪৮ মিনিট)' },
  emergencyCalls: { en: 'Emergency Police & Medical Services', bn: 'জরুরি পুলিশ ও স্বাস্থ্য পরিষেবা' },
  customStopDisclaimer: { en: 'Personal custom stops are saved privately on your device only.', bn: 'ব্যক্তিগত কাস্টম স্টপগুলি কেবল আপনার ডিভাইসেই সংরক্ষিত থাকে।' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

const LANGUAGE_STORAGE_KEY = '@pujopath_app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((stored) => {
      if (stored === 'bn' || stored === 'en') {
        setLanguageState(stored);
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    const next: Language = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
  };

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
