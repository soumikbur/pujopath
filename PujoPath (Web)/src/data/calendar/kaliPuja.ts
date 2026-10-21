/**
 * Kali Puja (Shyama Puja) verified festival calendar and astronomical panjika timings.
 * Location: Kolkata, West Bengal, India (IST, UTC+5:30).
 * Sources: Bisuddha Siddhanta Panjika, Drik Siddhanta Panchang & Gupta Press calculations.
 */

export interface KaliPujaYearSchedule {
  year: number;
  bangabdaYear: string;
  bangabdaYearEn: string;
  dateString: string;
  dateStringBn: string;
  gregorianDate: string;
  dayOfWeek: string;
  dayOfWeekBn: string;
  location: string;
  locationBn: string;
  verified: boolean;
  source: string;
  sourceBn: string;
  amavasyaTithi: {
    begins: string;
    beginsBn: string;
    ends: string;
    endsBn: string;
    duration: string;
    durationBn: string;
  };
  nishitaKaalPuja: {
    startTime: string;
    endTime: string;
    windowString: string;
    windowStringBn: string;
    durationMinutes: number;
    applicableNight: string;
    applicableNightBn: string;
    description: string;
    descriptionBn: string;
  };
  bhootChaturdashi: {
    dateString: string;
    dateStringBn: string;
    rituals: string;
    ritualsBn: string;
  };
}

export const KALI_PUJA_SCHEDULES: Record<number, KaliPujaYearSchedule> = {
  2024: {
    year: 2024,
    bangabdaYear: '১৪৩১ বঙ্গাব্দ (১৫ কার্তিক)',
    bangabdaYearEn: '1431 Bangabda (15 Kartik)',
    dateString: 'Thursday, October 31, 2024',
    dateStringBn: 'বৃহস্পতিবার, ৩১ অক্টোবর ২০২৪',
    gregorianDate: '2024-10-31',
    dayOfWeek: 'Thursday',
    dayOfWeekBn: 'বৃহস্পতিবার',
    location: 'Kolkata, West Bengal (IST, UTC+5:30)',
    locationBn: 'কলকাতা, পশ্চিমবঙ্গ (ভারতীয় প্রমাণ সময়)',
    verified: true,
    source: 'Bisuddha Siddhanta & Drik Panchang Kolkata calculations',
    sourceBn: 'বিশুদ্ধ সিদ্ধান্ত ও দৃক সিদ্ধান্ত পঞ্জিকা (কলকাতা)',
    amavasyaTithi: {
      begins: 'Oct 31, 2024, 03:52 PM',
      beginsBn: '৩১ অক্টোবর, দুপুর ৩:৫২',
      ends: 'Nov 01, 2024, 06:16 PM',
      endsBn: '১ নভেম্বর, সন্ধ্যা ৬:১৬',
      duration: '26 hrs 24 mins',
      durationBn: '২৬ ঘণ্টা ২৪ মিনিট',
    },
    nishitaKaalPuja: {
      startTime: '11:15 PM',
      endTime: '12:07 AM',
      windowString: '11:15 PM – 12:07 AM (Midnight)',
      windowStringBn: 'রাত ১১:১৫ – রাত ১২:০৭ (মহানিশা)',
      durationMinutes: 52,
      applicableNight: 'Night of Thursday, October 31, 2024',
      applicableNightBn: 'বৃহস্পতিবার রাত্রি (৩১ অক্টোবর ২০২৪)',
      description: 'The sacred midnight Mahanisha muhurat for Shyama Kali Puja',
      descriptionBn: 'মা শ্যামা কালীর মহানিশার প্রধান পূজা ও বলিদান লগ্ন',
    },
    bhootChaturdashi: {
      dateString: 'Wednesday, October 30, 2024',
      dateStringBn: 'বুধবার, ৩০ অক্টোবর ২০২৪',
      rituals: 'Lighting of 14 earthen lamps (Choddo Pradip) and eating 14 greens (Choddo Shaak)',
      ritualsBn: 'চৌদ্দ প্রদীপ প্রজ্জ্বলন ও চৌদ্দ শাক ভক্ষণ',
    },
  },

  2025: {
    year: 2025,
    bangabdaYear: '১৪৩২ বঙ্গাব্দ (৩ কার্তিক)',
    bangabdaYearEn: '1432 Bangabda (3 Kartik)',
    dateString: 'Monday, October 20, 2025',
    dateStringBn: 'সোমবার, ২০ অক্টোবর ২০২৫',
    gregorianDate: '2025-10-20',
    dayOfWeek: 'Monday',
    dayOfWeekBn: 'সোমবার',
    location: 'Kolkata, West Bengal (IST, UTC+5:30)',
    locationBn: 'কলকাতা, পশ্চিমবঙ্গ (ভারতীয় প্রমাণ সময়)',
    verified: true,
    source: 'Bisuddha Siddhanta & Drik Panchang Kolkata calculations',
    sourceBn: 'বিশুদ্ধ সিদ্ধান্ত ও দৃক সিদ্ধান্ত পঞ্জিকা (কলকাতা)',
    amavasyaTithi: {
      begins: 'Oct 20, 2025, 03:44 PM',
      beginsBn: '২০ অক্টোবর, দুপুর ৩:৪৪',
      ends: 'Oct 21, 2025, 05:54 PM',
      endsBn: '২১ অক্টোবর, বিকেল ৫:৫৪',
      duration: '26 hrs 10 mins',
      durationBn: '২৬ ঘণ্টা ১০ মিনিট',
    },
    nishitaKaalPuja: {
      startTime: '11:41 PM',
      endTime: '12:31 AM',
      windowString: '11:41 PM – 12:31 AM (Midnight)',
      windowStringBn: 'রাত ১১:৪১ – রাত ১২:৩১ (মহানিশা)',
      durationMinutes: 50,
      applicableNight: 'Night of Monday, October 20, 2025',
      applicableNightBn: 'সোমবার রাত্রি (২০ অক্টোবর ২০২৫)',
      description: 'Auspicious Nishita Kaal window for Kali Puja and deepavali rituals',
      descriptionBn: 'মা শ্যামা কালীর আরাধনা ও দীপান্বিতা অমাবস্যার পবিত্র ক্ষণ',
    },
    bhootChaturdashi: {
      dateString: 'Sunday, October 19, 2025',
      dateStringBn: 'রবিবার, ১৯ অক্টোবর ২০২৫',
      rituals: 'Lighting of 14 earthen lamps (Choddo Pradip) and eating 14 greens (Choddo Shaak)',
      ritualsBn: 'চৌদ্দ প্রদীপ প্রজ্জ্বলন ও চৌদ্দ শাক ভক্ষণ',
    },
  },

  2026: {
    year: 2026,
    bangabdaYear: '১৪৩৩ বঙ্গাব্দ (২২ কার্তিক)',
    bangabdaYearEn: '1433 Bangabda (22 Kartik)',
    dateString: 'Sunday, November 8, 2026',
    dateStringBn: 'রবিবার, ৮ নভেম্বর ২০২৬',
    gregorianDate: '2026-11-08',
    dayOfWeek: 'Sunday',
    dayOfWeekBn: 'রবিবার',
    location: 'Kolkata, West Bengal (IST, UTC+5:30)',
    locationBn: 'কলকাতা, পশ্চিমবঙ্গ (ভারতীয় প্রমাণ সময়)',
    verified: true,
    source: 'Bisuddha Siddhanta & Drik Siddhanta Astronomical Panjika (Kolkata)',
    sourceBn: 'বিশুদ্ধ সিদ্ধান্ত ও দৃক সিদ্ধান্ত পঞ্জিকা মান মন্দির (কলকাতা)',
    amavasyaTithi: {
      begins: 'Nov 08, 2026, 11:29 AM',
      beginsBn: '৮ নভেম্বর, সকাল ১১:২৯',
      ends: 'Nov 09, 2026, 12:31 PM',
      endsBn: '৯ নভেম্বর, দুপুর ১২:৩১',
      duration: '25 hrs 02 mins',
      durationBn: '২৫ ঘণ্টা ০২ মিনিট',
    },
    nishitaKaalPuja: {
      startTime: '10:54 PM',
      endTime: '11:46 PM',
      windowString: '10:54 PM – 11:46 PM (Midnight)',
      windowStringBn: 'রাত ১০:৫৪ – রাত ১১:৪৬ (মহানিশা)',
      durationMinutes: 52,
      applicableNight: 'Night of Sunday, November 8, 2026',
      applicableNightBn: 'রবিবার রাত্রি (৮ নভেম্বর ২০২৬)',
      description: 'The principal sacred Mahanisha Nishita Kaal window for Shyama Kali Puja in Kolkata',
      descriptionBn: 'কলকাতায় মা শ্যামা পূজার প্রধান পুণ্য মহানিশা নিশীথ কাল লগ্ন',
    },
    bhootChaturdashi: {
      dateString: 'Saturday, November 7, 2026',
      dateStringBn: 'শনিবার, ৭ নভেম্বর ২০২৬',
      rituals: 'Lighting of 14 earthen lamps (Choddo Pradip) and cooking 14 seasonal leafy greens (Choddo Shaak)',
      ritualsBn: 'চৌদ্দ প্রদীপ প্রজ্জ্বলন ও চৌদ্দ শাক ভক্ষণ',
    },
  },

  2027: {
    year: 2027,
    bangabdaYear: '১৪৩৪ বঙ্গাব্দ (১১ কার্তিক)',
    bangabdaYearEn: '1434 Bangabda (11 Kartik)',
    dateString: 'Thursday, October 28, 2027',
    dateStringBn: 'বৃহস্পতিবার, ২৮ অক্টোবর ২০২৭',
    gregorianDate: '2027-10-28',
    dayOfWeek: 'Thursday',
    dayOfWeekBn: 'বৃহস্পতিবার',
    location: 'Kolkata, West Bengal (IST, UTC+5:30)',
    locationBn: 'কলকাতা, পশ্চিমবঙ্গ (ভারতীয় প্রমাণ সময়)',
    verified: true,
    source: 'Bisuddha Siddhanta & Drik Panchang Kolkata calculations',
    sourceBn: 'বিশুদ্ধ সিদ্ধান্ত ও দৃক সিদ্ধান্ত পঞ্জিকা (কলকাতা)',
    amavasyaTithi: {
      begins: 'Oct 28, 2027, 03:12 PM',
      beginsBn: '২৮ অক্টোবর, দুপুর ৩:১২',
      ends: 'Oct 29, 2027, 05:22 PM',
      endsBn: '২৯ অক্টোবর, বিকেল ৫:২২',
      duration: '26 hrs 10 mins',
      durationBn: '২৬ ঘণ্টা ১০ মিনিট',
    },
    nishitaKaalPuja: {
      startTime: '10:56 PM',
      endTime: '11:44 PM',
      windowString: '10:56 PM – 11:44 PM (Midnight)',
      windowStringBn: 'রাত ১০:৫৬ – রাত ১১:৪৪ (মহানিশা)',
      durationMinutes: 48,
      applicableNight: 'Night of Thursday, October 28, 2027',
      applicableNightBn: 'বৃহস্পতিবার রাত্রি (২৮ অক্টোবর ২০২৭)',
      description: 'Auspicious midnight window for Kali Puja and deepavali celebrations',
      descriptionBn: 'মা শ্যামা কালীর মহানিশার প্রধান পূজা ও দীপাবলির পুণ্য ক্ষণ',
    },
    bhootChaturdashi: {
      dateString: 'Wednesday, October 27, 2027',
      dateStringBn: 'বুধবার, ২৭ অক্টোবর ২০২৭',
      rituals: 'Lighting of 14 earthen lamps (Choddo Pradip) and eating 14 greens (Choddo Shaak)',
      ritualsBn: 'চৌদ্দ প্রদীপ প্রজ্জ্বলন ও চৌদ্দ শাক ভক্ষণ',
    },
  },
};

export const AVAILABLE_KALI_PUJA_YEARS = [2024, 2025, 2026, 2027];

/**
 * Returns Kali Puja schedule for the requested year, or generates an unverified provisional fallback.
 */
export function getKaliPujaSchedule(year: number): KaliPujaYearSchedule {
  if (KALI_PUJA_SCHEDULES[year]) {
    return KALI_PUJA_SCHEDULES[year];
  }

  // Fallback for years without verified astronomical panjika data
  return {
    year,
    bangabdaYear: `১৪${year - 593} বঙ্গাব্দ (কার্তিক)`,
    bangabdaYearEn: `${year - 593} Bangabda (Kartik)`,
    dateString: `Kartik Amavasya ${year} (Date to be announced)`,
    dateStringBn: `কার্তিক অমাবস্যা ${year} (তারিখ শীঘ্রই ঘোষিত হবে)`,
    gregorianDate: `${year}-10-25`,
    dayOfWeek: 'To be announced',
    dayOfWeekBn: 'ঘোষিত হবে',
    location: 'Kolkata, West Bengal (IST, UTC+5:30)',
    locationBn: 'কলকাতা, পশ্চিমবঙ্গ (ভারতীয় প্রমাণ সময়)',
    verified: false,
    source: 'Provisional (Official Panjika timings to be confirmed for this year)',
    sourceBn: 'সাময়িক (এই বছরের বিশুদ্ধ পঞ্জিকা নির্ঘণ্ট পরবর্তীতে নিশ্চিত করা হবে)',
    amavasyaTithi: {
      begins: 'Timings to be announced',
      beginsBn: 'সময়সূচী শীঘ্রই প্রকাশিত হবে',
      ends: 'Timings to be announced',
      endsBn: 'সময়সূচী শীঘ্রই প্রকাশিত হবে',
      duration: 'To be confirmed',
      durationBn: 'নিশ্চিত করা হবে',
    },
    nishitaKaalPuja: {
      startTime: '--:--',
      endTime: '--:--',
      windowString: 'Timings to be announced',
      windowStringBn: 'সময়সূচী শীঘ্রই প্রকাশিত হবে',
      durationMinutes: 0,
      applicableNight: `Night of Kartik Amavasya ${year}`,
      applicableNightBn: `কার্তিক অমাবস্যা রাত্রি ${year}`,
      description: 'Official Nishita Kaal muhurat will be updated once the regional panjika is published.',
      descriptionBn: 'এই বছরের আঞ্চলিক পঞ্জিকা প্রকাশের পর নিশীথ কাল লগ্ন হালনাগাদ করা হবে।',
    },
    bhootChaturdashi: {
      dateString: `Preceding day of Kali Puja ${year}`,
      dateStringBn: `কালীপূজার পূর্ববর্তী দিন ${year}`,
      rituals: 'Lighting of 14 earthen lamps (Choddo Pradip)',
      ritualsBn: 'চৌদ্দ প্রদীপ প্রজ্জ্বলন',
    },
  };
}

export const KALI_PUJA_TRADITIONS = [
  {
    id: 'bhoot-chaturdashi',
    title: 'Bhoot Chaturdashi & 14 Lamps',
    titleBn: 'চৌদ্দ প্রদীপ ও চৌদ্দ শাক',
    icon: 'flame-outline' as const,
    color: '#D97706',
    desc: 'Observed on the 14th day of Krishna Paksha preceding Kali Puja. Families light 14 clay diyas across every entrance and window to dispel darkness, evil spirits, and illuminate the spiritual return path for 14 generations of ancestors.',
    descBn: 'কালীপূজার ঠিক আগের দিন কার্তিক মাসের চতুর্দশী তিথিতে ১৪টি মাটির প্রদীপ জ্বালিয়ে বাড়ি আলোকিত করা হয়। ১৪ পুরুষের স্মৃতি ও অতৃপ্ত আত্মাদের পথপ্রদর্শন এবং অন্ধকার দূর করতে ১৪ শাক খাওয়ার প্রাচীন রেওয়াজ পালন করা হয়।',
  },
  {
    id: 'nishita-kaal',
    title: 'Mahanisha & Midnight Puja',
    titleBn: 'মহানিশা ও মধ্যরাত্রের আরাধনা',
    icon: 'moon-outline' as const,
    color: '#7C3AED',
    desc: 'Unlike most daytime Vedic rituals, Maa Kali is worshipped during Nishita Kaal (the darkest midnight hour). She is propitiated with intense devotion, 108 red hibiscus garlands (Raktajaba), fragrant incense, and sacred mantras.',
    descBn: 'দিনের বেলার পরিবর্তে মা কালীর মূল পূজা অনুষ্ঠিত হয় অমাবস্যার নিশীথ রাতে বা মহানিশায়। ১০৮টি রক্তজবার মালা, আতপ চাল, ফলমূল, খিচুড়ি এবং হোম-যজ্ঞের মাধ্যমে দেবীর শক্তিস্বরূপা রূপের বন্দনা করা হয়।',
  },
  {
    id: 'temple-pilgrimage',
    title: 'Historic Shaktipeeths of Bengal',
    titleBn: 'বাংলার ঐতিহাসিক শক্তিপীঠ ও কালীঘাট',
    icon: 'business-outline' as const,
    color: '#B42323',
    desc: 'Kolkata hosts some of India’s most revered Kali temples: Kalighat (where Sati’s right toes fell), Dakshineswar Kali Temple (founded by Rani Rashmoni & consecrated by Sri Ramakrishna), and the 300-year-old Thanthania Kalibari.',
    descBn: 'কালীঘাট সতীপীঠ, রানি রাসমণি প্রতিষ্ঠিত দক্ষিণেশ্বর মা ভবতারিণী মন্দির, এবং ১৭০৩ সালের প্রাচীন ঠনঠনিয়া কালীবাড়িতে এই রাতে লক্ষাধিক ভক্ত সমবেত হন। বারাসাত ও নৈহাটির সুবিশাল আলোকসজ্জা ও প্রতিমা দর্শনে নামে জনতার ঢল।',
  },
  {
    id: 'deepavali-lights',
    title: 'Festival of Deepavali & Diyas',
    titleBn: 'দীপান্বিতা দীপাবলি ও আলোক উৎসব',
    icon: 'sparkles-outline' as const,
    color: '#EA580C',
    desc: 'In Bengal, Kali Puja coincides with Diwali. The entire city of Kolkata sparkles with thousands of earthen pradips, clay lamps, vibrant rangolis (Alpona), and joyous fireworks celebrating the victory of divine righteousness.',
    descBn: 'বাঙালির দীপাবলি ও কালীপূজা একই সুতোয় গাঁথা। প্রতিটি ঘরে ঘরে মাটির প্রদীপ, মঙ্গল আলোর দীপশিখা এবং উঠোনে রঙিন আলপনা দিয়ে দেবী লক্ষ্মী ও মা কালী উভয়কেই বরণ করে নেওয়া হয়।',
  },
];

export const KALI_PRANAM_MANTRA = {
  sanskrit: 'ওঁ জয়ন্তী মঙ্গলা কালী ভদ্রকালী কপালিনী।\nদুর্গা শিবা ক্ষমা ধাত্রী স্বাহা স্বধা নমোঽস্তু তে॥',
  transliteration: 'Oṃ Jayantī Maṅgalā Kālī Bhadrakālī Kapālinī ।\nDurgā Śivā Kṣamā Dhātrī Svāhā Svadhā Namo\'stu Te ॥',
  meaningEn: 'Salutations to the Divine Mother Jayanti (Victorious), Mangala (Auspicious), Kali (Dispeller of Darkness), Bhadrakali, Kapalini, Durga, Shiva, Kshama (Forgiving), and Dhatri (Mother of the Universe). Reverence to Thee!',
  meaningBn: 'হে সর্বজয়ী, মঙ্গলদায়িনী, অন্ধকারবিনাশিনী দেবী কালী, ভদ্রকালী, কপালিনী, দুর্গা, শিবা, ক্ষমা ও ধরিত্রীমাতা ধাত্রী—তোমাকে বারবার ভক্তিভরে প্রণাম জানাই।',
};
