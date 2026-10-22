export interface KaliTemple {
  id: string;
  name: string;
  nameBn: string;
  zone: string;
  zoneBn: string;
  category: 'Historic Shaktipeeth' | 'Heritage Mandir' | 'Celebrated Pandal' | 'Riverside Shrine';
  categoryBn: string;
  history: string;
  historyBn: string;
  address: string;
  addressBn: string;
  deityForm: string;
  deityFormBn: string;
  dipanwitaRituals: string;
  dipanwitaRitualsBn: string;
  nearestMetro?: string;
  nearestMetroBn?: string;
  establishedYear?: string;
  specialTiming: string;
  specialTimingBn: string;
  image: any;
  tags: string[];
}

export const KALI_TEMPLES_DATA: KaliTemple[] = [
  {
    id: 'kali-kalighat',
    name: 'Kalighat Kali Temple',
    nameBn: 'কালীঘাট কালী মন্দির',
    zone: 'South Kolkata',
    zoneBn: 'দক্ষিণ কলকাতা',
    category: 'Historic Shaktipeeth',
    categoryBn: 'ঐতিহাসিক মহাপীঠ',
    history:
      'One of the supreme 51 Shaktipeeths of the subcontinent where the four toes of Devi Sati’s right foot fell. Situated along the holy Adi Ganga canal, the sanctum features the iconic touchstone idol with three large eyes, four golden arms, and protruding golden tongue.',
    historyBn:
      'ভারতীয় উপমহাদেশের পরম পবিত্র ৫১ সতীপীঠের অন্যতম প্রধান মহাপীঠ। কথিত আছে এখানে দেবীর ডান চরণের চারটি অঙ্গুলি পতিত হয়েছিল। কষ্টিপাথরের ত্রিনয়না দেবীমূর্তি, স্বর্ণজিহ্বা ও আদি গঙ্গার তীরে শত শত বছরের ভক্তিঐতিহ্য।',
    address: 'Anami Sangha, Kalighat Road, Kalighat, Kolkata 700026',
    addressBn: 'আদি গঙ্গার তীর, কালীঘাট রোড, কলকাতা ৭০০০২৬',
    deityForm: 'Dakshina Kali (Touchstone Murti with Golden Tongue & Trinetra)',
    deityFormBn: 'দক্ষিণা কালিকা (স্বর্ণজিহ্বা ও ত্রিনয়ন বিশিষ্ট কষ্টিপাথরের বিগ্রহ)',
    dipanwitaRituals:
      'Midnight Mangal Aarati, continuous Dipanwita Amavasya pradip illumination, sacred snan yatra, and nocturnal Mahapuja with thousands of red hibiscus flowers.',
    dipanwitaRitualsBn:
      'নিশীথ মঙ্গল আরতি, সহস্র প্রদীপ প্রজ্বলন, রক্তজবা অঞ্জলি এবং রাতভর মহানির্ঘণ্ট পূজা।',
    nearestMetro: 'Kalighat Metro Station (Blue Line) - 800m walk',
    nearestMetroBn: 'কালীঘাট মেট্রো স্টেশন (ব্লু লাইন) - ৮০০ মিটার',
    establishedYear: 'Ancient (Reconstructed 1809 by Sabarna Roy Choudhury family)',
    specialTiming: 'Temple open throughout Dipanwita Amavasya night (04:00 AM - next morning)',
    specialTimingBn: 'দীপান্বিতা অমাবস্যার রাতভর মন্দির খোলা থাকে (ভোর ৪টা থেকে পরদিন পর্যন্ত)',
    image: require('../../../assets/images/kali-hero.jpg'),
    tags: ['Shaktipeeth', 'Ancient', 'Adi Ganga', 'Heritage', 'South Kolkata'],
  },
  {
    id: 'kali-dakshineswar',
    name: 'Dakshineswar Bhavatarini Kali Temple',
    nameBn: 'দক্ষিণেশ্বর ভবতারিণী কালী মন্দির',
    zone: 'North Kolkata & Suburbs',
    zoneBn: 'উত্তর কলকাতা ও শহরতলি',
    category: 'Riverside Shrine',
    categoryBn: 'গঙ্গাতীরবর্তী তীর্থক্ষেত্র',
    history:
      'Founded in 1855 by the visionary philanthropist Rani Rashmoni along the Hooghly river. The 9-spire Navaratna temple is universally revered worldwide as the sacred spiritual hermitage where Sri Ramakrishna Paramahamsa attained supreme divine realization of Mother Kali.',
    historyBn:
      '১৮৫৫ খ্রিস্টাব্দে পুণ্যশ্লোকা রানী রাসমণি কর্তৃক হুগলি নদীর তীরে প্রতিষ্ঠিত নবরত্ন মন্দির। শ্রী রামকৃষ্ণ পরমহংসদেবের পরম সাধনক্ষেত্র ও মা ভবতারিণীর চিরন্তন লীলাভূমি। বিশ্বজুড়ে আধ্যাত্মিক ভক্তদের পরম তীর্থ।',
    address: 'Mayadibya Ghat, Dakshineswar, Kolkata 700076',
    addressBn: 'মায়াদিব্য ঘাট, দক্ষিণেশ্বর, কলকাতা ৭০০৭৬',
    deityForm: 'Maa Bhavatarini (Adya Shakti standing on Lord Shiva’s chest upon silver lotus)',
    deityFormBn: 'মা ভবতারিণী (রৌপ্য পদ্মে শায়িত মহাদেবের বক্ষে দণ্ডায়মানা আদ্যাশক্তি)',
    dipanwitaRituals:
      'Massive midnight Amavasya gathering, special 56-bhog offering, sacred Panchavati meditation, and illumination of 12 Shiva temples along the riverbanks with oil lamps.',
    dipanwitaRitualsBn:
      'মহানিশায় রাজকীয় ভোগ আরতি, পঞ্চবটীতে ধ্যান, গঙ্গার ঘাটে হাজার হাজার মাটির প্রদীপের আলোকমালা ও দ্বাদশ শিবমন্দিরে বিশেষ পূজা।',
    nearestMetro: 'Dakshineswar Metro Station (Blue Line Terminal) - 300m direct footbridge',
    nearestMetroBn: 'দক্ষিণেশ্বর মেট্রো স্টেশন (ব্লু লাইন প্রান্তিক) - ৩০০ মিটার ফুটব্রিজ',
    establishedYear: '1855 AD by Rani Rashmoni',
    specialTiming: 'Dipanwita Amavasya: Open all night from 05:00 AM to 03:00 AM',
    specialTimingBn: 'দীপান্বিতা অমাবস্যা: ভোর ৫টা থেকে গভীর রাত পর্যন্ত অখণ্ড দর্শন',
    image: require('../../../assets/images/kali-miniplayer.jpg'),
    tags: ['Ramakrishna', 'Rani Rashmoni', 'Ganges', 'Navaratna', 'North Kolkata'],
  },
  {
    id: 'kali-thanthania',
    name: 'Thanthania Kalibari (Siddheswari Kali)',
    nameBn: 'ঠনঠনিয়া কালীবাড়ি (সিদ্ধেশ্বরী কালী)',
    zone: 'Central Kolkata',
    zoneBn: 'মধ্য কলকাতা',
    category: 'Heritage Mandir',
    categoryBn: 'ঐতিহাসিক বনেদি মন্দির',
    history:
      'A legendary tantric shrine established in 1703 by Udiyana Brahmachari. The clay murti of Goddess Siddheswari is unique: traditionally sculpted anew over the sacred wooden frame every single year immediately preceding Kali Puja with deep ritual sanctity.',
    historyBn:
      '১৭০৩ খ্রিস্টাব্দে উদয়নারায়ন ব্রহ্মচারী প্রতিষ্ঠিত মধ্য কলকাতার অন্যতম প্রাচীন জাগ্রত পীঠ। প্রতি বছর কালীপূজার পূর্বে মৃন্ময়ী প্রতিমা নতুন করে নির্মাণ করা হয় যা শতাব্দীর প্রাচীন প্রথা।',
    address: 'College Street & Bidhan Sarani Crossing, Kolkata 700006',
    addressBn: 'কলেজ স্ট্রিট ও বিধান সরণি ক্রসিং, কলকাতা ৭০০০০৬',
    deityForm: 'Maa Siddheswari (Seated Tantric Kali with silver crescent moon)',
    deityFormBn: 'মা সিদ্ধেশ্বরী (রৌপ্য মুকুট ও অর্ধচন্দ্র শোভিতা উপবিষ্টা দেবীমূর্তি)',
    dipanwitaRituals:
      'Annual pratima nirman sanctification, midnight pushpanjali, traditional animal sacrifice replacement with chalkumro and sugarcane, and continuous incense smoke.',
    dipanwitaRitualsBn:
      'বার্ষিক প্রতিমা প্রতিষ্ঠা, নিশীথ পুষ্পাঞ্জলি, আখ ও চালকুমড়ো বলি এবং অবিরাম ধূপ-ধুনোর সুবাসে ভাবগম্ভীর পূজা।',
    nearestMetro: 'Central / Mahatma Gandhi Road Metro - 550m walk',
    nearestMetroBn: 'সেন্ট্রাল অথবা মহাত্মা গান্ধী রোড মেট্রো - ৫৫০ মিটার',
    establishedYear: '1703 AD (Over 320 years old)',
    specialTiming: 'Dipanwita Night: Open until 02:00 AM midnight',
    specialTimingBn: 'দীপান্বিতা রাত: রাত ২টা পর্যন্ত খোলা',
    image: require('../../../assets/images/kali-hero.jpg'),
    tags: ['1703 AD', 'College Street', 'Heritage', 'Tantric', 'Central Kolkata'],
  },
  {
    id: 'kali-lake-kalibari',
    name: 'Lake Kalibari (Sree Sree Karunamoyee Kali)',
    nameBn: 'লেক কালীবাড়ি (শ্রী শ্রী করুণাময়ী কালী)',
    zone: 'South Kolkata',
    zoneBn: 'দক্ষিণ কলকাতা',
    category: 'Heritage Mandir',
    categoryBn: 'দক্ষিণ কলকাতার জাগ্রত তীর্থ',
    history:
      'Founded in 1949 by the devout spiritual seeker Haripada Chakraborty. Known as the shrine of Maa Karunamoyee, this temple near Rabindra Sarobar lakes is widely respected for strict scriptural adherence, soulful devotional atmosphere, and community service.',
    historyBn:
      '১৯৪৯ খ্রিস্টাব্দে পরম ভক্ত হরিপদ চক্রবর্তী কর্তৃক প্রতিষ্ঠিত। রবীন্দ্র সরোবরের মনোরম পরিবেশে মা করুণাময়ীর মন্দিরটি নিষ্ঠাবান তান্ত্রিক ও বৈদিক পূজার জন্য দক্ষিণ কলকাতায় সুবিখ্যাত।',
    address: '107/1 Southern Avenue, Lake Market area, Kolkata 700029',
    addressBn: '১০৭/১ সাদার্ন অ্যাভিনিউ, লেক মার্কেট অঞ্চল, কলকাতা ৭০০০২৯',
    deityForm: 'Maa Karunamoyee (Compassionate Shyama with Panchamundi Asana)',
    deityFormBn: 'মা করুণাময়ী (পঞ্চমুণ্ডির আসনে অধিষ্ঠিতা পরম করুণাময়ী শ্যামা)',
    dipanwitaRituals:
      'Sacred midnight Mahapuja, distribution of traditional khichuri and labra bhog, lighting of 108 ghee lamps, and evening Shyama Sangeet recitals.',
    dipanwitaRitualsBn:
      '১০৮ ঘৃতপ্রদীপ প্রজ্বলন, মহানিশায় অমাবস্যা পূজা, ঐতিহ্যবাহী খিচুড়ি ভোগ বিতরণ ও শ্যামাসঙ্গীতানুষ্ঠান।',
    nearestMetro: 'Rabindra Sarobar / Kalighat Metro - 700m walk',
    nearestMetroBn: 'রবীন্দ্র সরোবর অথবা কালীঘাট মেট্রো - ৭০০ মিটার',
    establishedYear: '1949 AD',
    specialTiming: 'Dipanwita Night: Open until 03:00 AM',
    specialTimingBn: 'দীপান্বিতা রাত: রাত ৩টা পর্যন্ত দর্শনার্থীদের জন্য উন্মুক্ত',
    image: require('../../../assets/images/kali-miniplayer.jpg'),
    tags: ['Southern Avenue', 'Karunamoyee', 'Peaceful', 'South Kolkata'],
  },
  {
    id: 'kali-firinghi',
    name: 'Firinghi Kalibari (Bowbazar)',
    nameBn: 'ফিরিঙ্গি কালীবাড়ি (বউবাজার)',
    zone: 'Central Kolkata',
    zoneBn: 'মধ্য কলকাতা',
    category: 'Heritage Mandir',
    categoryBn: 'ঐতিহাসিক মিলনপীঠ',
    history:
      'Over 500-year-old historic shrine in Bowbazar. Deeply entwined with folk lore and literature through Portuguese kabiwala Hensman Anthony (Anthony Firinghi), who embraced Bengali culture and composed timeless devotional songs to Maa Kali.',
    historyBn:
      'বউবাজারের ৫০০ বছরেরও প্রাচীন মন্দির। পর্তুগিজ কবিগান রচয়িতা অ্যান্টনি ফিরিঙ্গির নামানুসারে খ্যাত, যিনি বিদেশি হয়েও দেবী কালিকার পরম ভক্ত ও কালজয়ী শ্যামাসঙ্গীত রচয়িতা ছিলেন।',
    address: '244 Bepin Behari Ganguly Street, Bowbazar, Kolkata 700012',
    addressBn: '২৪৪ বিপিন বিহারী গাঙ্গুলী স্ট্রিট, বউবাজার, কলকাতা ৭০০০১২',
    deityForm: 'Maa Siddheswari Kali',
    deityFormBn: 'মা সিদ্ধেশ্বরী কালী',
    dipanwitaRituals:
      'Deepavali evening aarati, continuous musical performances of Anthony Firinghi and Ramprasad compositions, and traditional floral offerings.',
    dipanwitaRitualsBn:
      'দীপাবলি আরতি, অ্যান্টনি ফিরিঙ্গি ও রামপ্রসাদী শ্যামাসঙ্গীত পরিবেশন এবং রক্তজবার অঞ্জলি।',
    nearestMetro: 'Central Metro Station (Blue Line) - 350m walk',
    nearestMetroBn: 'সেন্ট্রাল মেট্রো স্টেশন (ব্লু লাইন) - ৩৫০ মিটার',
    establishedYear: 'Circa 16th Century',
    specialTiming: 'Dipanwita Night: Open until 01:30 AM',
    specialTimingBn: 'দীপান্বিতা রাত: রাত ১:৩০ পর্যন্ত উন্মুক্ত',
    image: require('../../../assets/images/kali-hero.jpg'),
    tags: ['Anthony Firinghi', 'Bowbazar', 'Historic', 'Central Kolkata'],
  },
  {
    id: 'kali-barasat',
    name: 'Barasat Celebrated Community Kali Puja Festival',
    nameBn: 'বারাসাত ঐতিহাসিক সর্বজনীন কালীপূজা মহোৎসব',
    zone: 'North 24 Parganas Hub',
    zoneBn: 'উত্তর ২৪ পরগনা',
    category: 'Celebrated Pandal',
    categoryBn: 'বিখ্যাত সর্বজনীন মণ্ডপ ও আলোকসজ্জা',
    history:
      'Barasat is universally acclaimed across Eastern India as the grandest epicenter of community Kali Puja. Iconic clubs including Pioneer Park, Nabapally Byam Samity, Sandhani Club, and KNC Regiment create monumental architectural theme pandals and multi-kilometer dynamic LED light corridors.',
    historyBn:
      'পূর্ব ভারতের সর্বশ্রেষ্ঠ কালীপূজা উৎসবক্ষেত্র। পাইওনিয়ার পার্ক, নবপল্লী ব্যায়াম সমিতি, সন্ধানী ক্লাব ও কেএনসি রেজিমেন্ট সহ বহু শতবর্ষী ক্লাবের চোখধাঁধানো থিম মণ্ডপ ও বিশ্বখ্যাত চন্দননগরের আলোকসজ্জা।',
    address: 'Pioneer Park & Nabapally Circuits, Barasat, Kolkata 700126',
    addressBn: 'পাইওনিয়ার পার্ক ও নবপল্লী চত্বর, বারাসাত, কলকাতা ৭০০১২৬',
    deityForm: 'Grand Theme Murti & Classical Kali Pratimas',
    deityFormBn: 'বিশালকার থিম প্রতিমা ও ঐতিহ্যবাহী রূপ',
    dipanwitaRituals:
      'Grand 5-day carnival extending through Bhai Phonta, colossal lighting gates, continuous cultural concerts, and carnival stalls attracting millions of visitors.',
    dipanwitaRitualsBn:
      'ভাইফোঁটা পর্যন্ত ৫ দিনব্যাপী মহা উৎসব, কিলোমিটারব্যাপী আলোর গেট ও সাংস্কৃতিক অনুষ্ঠান।',
    nearestMetro: 'Noapara / Dum Dum Junction + local train/bus or NH12 commute',
    nearestMetroBn: 'দমদম জংশন থেকে সরাসরি লোকাল ট্রেন বা এনএইচ ১২ বাস',
    establishedYear: '1960s onward',
    specialTiming: 'Pujas remain illuminated & open 24 hours across 5 festival days',
    specialTimingBn: 'উৎসবের ৫ দিন ২৪ ঘণ্টাই মণ্ডপ ও আলো সচল থাকে',
    image: require('../../../assets/images/kali-hero.jpg'),
    tags: ['Grand Carnival', 'Pioneer Park', 'Barasat', 'Illumination', 'Theme Pandal'],
  },
  {
    id: 'kali-naihati-boro-maa',
    name: 'Naihati Boro Maa Kali Puja',
    nameBn: 'নৈহাটি বড় মা কালীপূজা',
    zone: 'North 24 Parganas Heritage',
    zoneBn: 'উত্তর ২৪ পরগনা ঐতিহ্য',
    category: 'Celebrated Pandal',
    categoryBn: 'ঐতিহাসিক সুবিশাল রূপ',
    history:
      'Celebrated for over 100 years, Naihati’s Boro Maa features a majestic 21-foot tall idol adorned with hundreds of kilograms of gold and silver jewelry gifted by devotees across Bengal. Millions queue from midnight to offer pure ghee lamps and red dhotis.',
    historyBn:
      'শতবর্ষের ঐতিহ্যবাহী নৈহাটির ২১ ফুট উচ্চতার সুবিশাল বড় মা। ভক্তদের দেওয়া শত শত ভরি সোনা-রুপোর গহনায় সাজানো হয় দেবীকে। নিষ্ঠাভরে মানত পূরণ ও লাখো মানুষের ভক্তির মহাসঙ্গম।',
    address: 'Arbinda Road, Naihati, North 24 Parganas 743165',
    addressBn: 'অরবিন্দ রোড, নৈহাটি, উত্তর ২৪ পরগনা ৭৪৩১৬৫',
    deityForm: '21-Foot Colossal Murti of Maa Shyama adorned in solid gold ornaments',
    deityFormBn: '২১ ফুট উচ্চতার বিশালকার রূপ ও ভক্তদত্ত স্বর্ণালঙ্কারে ভূষিতা মা শ্যামা',
    dipanwitaRituals:
      'Continuous 72-hour darshan, millions of earthen lamps glowing along the queue, and historic immersion procession with thousands of torchbearers.',
    dipanwitaRitualsBn:
      '৭২ ঘণ্টার অখণ্ড দর্শন, লাখ লাখ মাটির প্রদীপের আলো এবং ঐতিহাসিক বিসর্জন শোভাযাত্রা।',
    nearestMetro: 'Naihati Railway Junction (Sealdah Main Line) - 600m walk',
    nearestMetroBn: 'নৈহাটি রেলওয়ে জংশন (শিয়ালদহ মেন লাইন) - ৬০০ মিটার',
    establishedYear: 'Over 100 years ago',
    specialTiming: 'Open 24 hours continuously throughout Kali Puja days',
    specialTimingBn: 'কালীপূজার দিনগুলিতে ২৪ ঘণ্টাই অখণ্ড দর্শন চালু থাকে',
    image: require('../../../assets/images/kali-miniplayer.jpg'),
    tags: ['21 Feet Tall', 'Boro Maa', 'Naihati', 'Famous', 'Gold Ornaments'],
  },
];
