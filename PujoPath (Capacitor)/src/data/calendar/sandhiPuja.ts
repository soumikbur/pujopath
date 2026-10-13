export interface SandhiPujaConvention {
  id: string;
  name: string;
  nameBn: string;
  panjikaSystem: 'Drik Siddhanta' | 'Surya Siddhanta' | 'Bisuddha Siddhanta';
  panjikaSystemBn: string;
  sourceName: string;
  sourceUrl: string;
  year: number;
  location: string;
  locationBn: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  festival: string;
  festivalBn: string;
  dateString: string;
  dateStringBn: string;
  gregorianDate: string;
  startTime: string;
  endTime: string;
  startTimeBn: string;
  endTimeBn: string;
  durationMinutes: number;
  durationDisplay: string;
  durationDisplayBn: string;
  ashtamiEndTransition: string;
  navamiStartTransition: string;
  significance: string;
  significanceBn: string;
  calculationNote: string;
  calculationNoteBn: string;
  isPrimaryConvention: boolean;
}

export interface SandhiPujaAnnualSchedule {
  year: number;
  location: string;
  timezone: string;
  primaryConventionId: string;
  conventions: SandhiPujaConvention[];
  ritualSignificance: {
    title: string;
    titleBn: string;
    summary: string;
    summaryBn: string;
    items: string[];
    itemsBn: string[];
  };
}

export const SANDHI_PUJA_SCHEDULES: Record<number, SandhiPujaAnnualSchedule> = {
  2026: {
    year: 2026,
    location: 'Kolkata, West Bengal',
    timezone: 'Asia/Kolkata (IST)',
    primaryConventionId: 'drik-panchang-2026',
    conventions: [
      {
        id: 'drik-panchang-2026',
        name: 'Drik Panchang (Drik Siddhanta / Modern Ephemeris)',
        nameBn: 'দৃক সিদ্ধান্ত (দৃক পঞ্চাঙ্গ বিশুদ্ধ গণনা)',
        panjikaSystem: 'Drik Siddhanta',
        panjikaSystemBn: 'দৃক সিদ্ধান্ত',
        sourceName: 'Drik Panchang Kolkata (Geoname ID: 1275004)',
        sourceUrl: 'https://www.drikpanchang.com/navratri/shardiya-navratri-sandhipuja.html?geoname-id=1275004&year=2026',
        year: 2026,
        location: 'Kolkata, West Bengal (22.5726° N, 88.3639° E)',
        locationBn: 'কলকাতা, পশ্চিমবঙ্গ (২২.৫৭২৬° উ, ৮৮.৩৬৩৯° পূ)',
        coordinates: { lat: 22.5726, lng: 88.3639 },
        festival: 'Sandhi Puja',
        festivalBn: 'সন্ধিপূজা',
        dateString: 'Monday, 19 October 2026',
        dateStringBn: 'সোমবার, ১৯ অক্টোবর ২০২৬',
        gregorianDate: '2026-10-19',
        startTime: '10:27 AM IST',
        endTime: '11:15 AM IST',
        startTimeBn: 'সকাল ১০:২৭ (IST)',
        endTimeBn: 'সকাল ১১:১৫ (IST)',
        durationMinutes: 48,
        durationDisplay: '48 minutes (2 Dandas)',
        durationDisplayBn: '৪৮ মিনিট (২ দণ্ড)',
        ashtamiEndTransition: 'Last 24 minutes of Maha Ashtami Tithi',
        navamiStartTransition: 'First 24 minutes of Maha Navami Tithi',
        significance:
          'Sandhi Puja commemorates the supreme cosmic moment when Goddess Durga assumed the fiery form of Chamunda to slay demons Chanda and Munda. It bridges the transition of Ashtami into Navami and is celebrated with the sacred lighting of 108 earthen lamps and the offering of 108 blue lotuses.',
        significanceBn:
          'অষ্টমী তিথির শেষ ২৪ মিনিট এবং নবমী তিথির প্রথম ২৪ মিনিট—এই ৪৮ মিনিটের মহামিলন ক্ষণই সন্ধিপূজা। চণ্ড ও মুণ্ড বধের উদ্দেশ্যে দেবী দুর্গা এই মহালগ্নেই রণচণ্ডী চামুণ্ডা রূপে আবির্ভূত হয়েছিলেন। ১০৮টি মাটির প্রদীপ ও ১০৮টি নীলপদ্ম নিবেদনের মাধ্যমে দেবীর মহাশক্তির উপাসনা করা হয়।',
        calculationNote:
          'Calculated explicitly for Kolkata geographical coordinates (Asia/Kolkata timezone) using modern planetary positions (Drik astronomical algorithms). Followed by Ramakrishna Math & Mission (Belur Math) and modern astronomical institutes.',
        calculationNoteBn:
          'কলকাতার ভৌগোলিক স্থানাঙ্ক (এশিয়া/কলকাতা সময় অঞ্চল) এবং আধুনিক জ্যোতির্বিজ্ঞানের গ্রহগতির সূক্ষ্ম গণনা অনুযায়ী নির্ধারিত। বেলুড় মঠ ও বিশুদ্ধ সিদ্ধান্ত অনুগামীরা এই পঞ্জিকা অনুসরণ করেন।',
        isPrimaryConvention: true,
      },
      {
        id: 'surya-siddhanta-2026',
        name: 'Gupta Press / Traditional Surya Siddhanta',
        nameBn: 'গুপ্তপ্রেস পঞ্জিকা (চিরাচরিত সূর্য সিদ্ধান্ত)',
        panjikaSystem: 'Surya Siddhanta',
        panjikaSystemBn: 'সূর্য সিদ্ধান্ত',
        sourceName: 'Traditional Bengali Almanac (Gupta Press Panjika)',
        sourceUrl: 'https://www.kolkatatourguide.com/durga-puja-calendar-2026/',
        year: 2026,
        location: 'Kolkata, West Bengal',
        locationBn: 'কলকাতা, পশ্চিমবঙ্গ',
        coordinates: { lat: 22.5726, lng: 88.3639 },
        festival: 'Sandhi Puja (Traditional Almanac Timing)',
        festivalBn: 'সন্ধিপূজা (ঐতিহ্যবাহী পঞ্জিকা নির্ঘণ্ট)',
        dateString: 'Sunday/Monday Festival Window (Oct 18-19, 2026)',
        dateStringBn: 'রবিবার/সোমবার তিথি সন্ধিক্ষণ (১৮-১৯ অক্টোবর ২০২৬)',
        gregorianDate: '2026-10-18',
        startTime: '06:21 PM IST (Preceding Evening)',
        endTime: '07:09 PM IST',
        startTimeBn: 'সন্ধ্যা ০৬:২১ (IST)',
        endTimeBn: 'সন্ধ্যা ০৭:০৯ (IST)',
        durationMinutes: 48,
        durationDisplay: '48 minutes (2 Dandas)',
        durationDisplayBn: '৪৮ মিনিট (২ দণ্ড)',
        ashtamiEndTransition: 'Last 24 minutes of Ashtami (Surya Siddhanta Table)',
        navamiStartTransition: 'First 24 minutes of Navami (Surya Siddhanta Table)',
        significance:
          'Traditional family Bonedi Baris and ancestral community pujas frequently reference traditional Surya Siddhanta almanacs where tithi constants derive from classical Sanskrit texts.',
        significanceBn:
          'বহু প্রাচীন বনেদি বাড়ি ও সাবেকি পুজো সমিতি শতাব্দীর ঐতিহ্য মেনে গুপ্তপ্রেস ও সনাতন সূর্য সিদ্ধান্ত গণনা অনুসরণ করে সন্ধিপূজার লগ্ন নির্ধারণ করে।',
        calculationNote:
          'Based on classical Surya Siddhanta planetary equations. Note that different Bengali almanacs can yield different tithi cutoff timings; local pandals follow the specific Panjika mandated by their hereditary priest or committee.',
        calculationNoteBn:
          'সনাতন সূর্যসিদ্ধান্তীয় সূত্রের ভিত্তিতে রচিত। বাংলায় বিভিন্ন পঞ্জিকায় তিথির সামান্য সময়ের ব্যবধান থাকে, তাই স্থানীয় মন্দির বা মণ্ডপের পুরোহিত যে পঞ্জিকা অনুসরণ করেন, সেটাই মান্য।',
        isPrimaryConvention: false,
      },
    ],
    ritualSignificance: {
      title: 'Significance of Sandhi Puja (সন্ধিপূজার মাহাত্ম্য)',
      titleBn: 'সন্ধিপূজার আধ্যাত্মিক ও পৌরাণিক মাহাত্ম্য',
      summary:
        'Sandhi Puja is the climax and the most intensely sacred 48 minutes of Durga Puja. It represents the exact junction when Ashtami merges into Navami.',
      summaryBn:
        'শারদীয়া দুর্গোৎসবের সবচেয়ে উদ্দীপনাময় ও জাগ্রত ৪৮ মিনিট হলো সন্ধিপূজা। মহাষ্টমীর সমাপ্তি ও মহানবমীর প্রারম্ভের পুণ্য সন্ধিলগ্নে এটি অনুষ্ঠিত হয়।',
      items: [
        'Appearance of Devi Chamunda: Born from the divine forehead of Devi Ambika to vanquish demons Chanda and Munda.',
        '108 Blue Lotuses (Neel Padma): Offered with devotion, echoing Lord Rama’s worship during Akalbodhon.',
        '108 Pradips (Earthen Oil Lamps): Lit in radiant rows to dispel spiritual and cosmic darkness.',
        'Sacred Oblation / Balidaan: Symbolic sacrifice of sugarcane, white gourd (Chalkumro), or banana representing destruction of ego.',
      ],
      itemsBn: [
        'দেবী চামুণ্ডার আবির্ভাব: চণ্ড ও মুণ্ডকে সংহার করতে দেবী অম্বিকার ললাটদেশ থেকে কালিকা রূপিণী চামুণ্ডার উদয়।',
        '১০৮ নীলপদ্ম নিবেদন: শ্রীরামচন্দ্রের অকালবোধনের ন্যায় ১০৮টি নীলপদ্ম দিয়ে দেবীর শ্রীচরণে অঞ্জলি প্রদান।',
        '১০৮ মাটির প্রদীপ প্রজ্বালন: অজ্ঞানতার অন্ধকার দূর করে আলোকবর্তিকা প্রজ্বালন।',
        'প্রতীকী বলিদান: অহংকার ও আসুরিক বৃত্তির বিনাশের প্রতীক হিসেবে আখ ও চালকুমড়ো বলি প্রদান।',
      ],
    },
  },
};

export function getSandhiPujaSchedule(year: number = 2026): SandhiPujaAnnualSchedule {
  return SANDHI_PUJA_SCHEDULES[year] || SANDHI_PUJA_SCHEDULES[2026];
}
