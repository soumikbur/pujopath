import { MusicTrack } from '@/types';

export interface KaliMusicCategoryMeta {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  iconName: string;
}

export const KALI_MUSIC_CATEGORIES: KaliMusicCategoryMeta[] = [
  {
    id: 'All',
    name: 'All Sacred Tracks',
    nameBn: 'সকল ভক্তিগীতি',
    description: 'Complete collection of sacred Kali Puja devotional music & nocturnal ambience.',
    descriptionBn: 'মা শ্যামার আরাধনার সম্পূর্ণ ভক্তিগীতি, স্তোত্র ও দীপাবলি আবহ।',
    iconName: 'Sparkles',
  },
  {
    id: 'Mahanisha & Dhyana',
    name: 'Mahanisha & Dhyana Meditation',
    nameBn: 'মহানিদ্রা ও ধ্যানরাগ',
    description: 'Nocturnal classical ragas traditionally sung during midnight Amavasya worship.',
    descriptionBn: 'নিশীথ অমাবস্যার মহাকালের আরাধনায় নিবেদিত গভীর ধ্যানরাগ।',
    iconName: 'Moon',
  },
  {
    id: 'Mantras & Stotrams',
    name: 'Sacred Mantras & Sanskrit Stotrams',
    nameBn: 'ধ্যানমন্ত্র ও বৈদিক স্তোত্র',
    description: 'Authentic Sanskrit verses, Kali Pranam, and Vedic invocations.',
    descriptionBn: 'মা কালীর পবিত্র ধ্যানমন্ত্র, প্রণাম ও ভক্তিগম্ভীর বৈদিক আবাহন।',
    iconName: 'Flame',
  },
  {
    id: 'Temple Ambience & Aarati',
    name: 'Temple Aarati & Auspicious Bells',
    nameBn: 'মন্দিরের আরতি ও শঙ্খনাদ',
    description: 'Resonant temple bells, midnight brass gongs, and sacred conch blowing.',
    descriptionBn: 'দীপান্বিতা অমাবস্যায় মন্দিরের কাঁসর-ঘণ্টা ও পবিত্র শঙ্খধ্বনি।',
    iconName: 'Volume2',
  },
];

export const KALI_MUSIC_DATA: MusicTrack[] = [
  {
    id: 'kali-track-malkauns',
    title: 'Midnight Mahanisha - Raag Malkauns (Adya Shakti Meditation)',
    titleBn: 'মহানিদ্রা ও শক্তির আরাধনা - রাগ মালকোষ',
    artist: 'National Classical Heritage Ensemble (NCERT Official Archive)',
    artistBn: 'জাতীয় শাস্ত্রীয় সঙ্গীত সংগ্রহ (এনসিইআরটি সংরক্ষিত রূপ)',
    category: 'Devotional',
    mood: 'Ritual & Devotion',
    durationSeconds: 555,
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Rag_Malkauns_-_NCERT.ogg',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    description:
      'Profound meditative midnight raga Malkauns. Played during the deepest hours of Dipanwita Amavasya when Goddess Kali is invoked in the darkness of midnight (Nishita Kaal).',
    descriptionBn:
      'কার্তিক অমাবস্যার নিশুতি রাতে মা কালীর বোধন ও ধ্যানের জন্য প্রাচীন শাস্ত্রীয় গভীর ভাবগম্ভীর মালকোষ রাগ। অন্ধকার ভেদ করে আত্মার আলোয় দেবীকে অনুভব করার সুর।',
    culturalContext:
      'Raag Malkauns is traditionally attributed to the Tandava of Lord Shiva and the nocturnal meditative worship of Mahakali.',
    culturalContextBn:
      'কালীপূজায় মধ্যরাতের নিশিতা পূজায় মা শ্যামার অখণ্ড ধ্যানের প্রধান রাগ মালকোষ।',
    language: 'Instrumental',
    playbackMethod: 'direct_audio',
    licenseType: 'Creative Commons CC BY 3.0',
    attribution: 'Classical performance archived by NCERT Official on Wikimedia Commons under CC BY 3.0.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rag_Malkauns_-_NCERT.ogg',
    isLocalAsset: false,
    lyricsSnippet: 'Om Jayanti Mangala Kali Bhadrakali Kapalini...',
    lyricsSnippetBn: 'ওঁ জয়ন্তী মঙ্গলা কালী ভদ্রকালী কপালিনী...',
    tags: ['Malkauns', 'Midnight', 'Mahanisha', 'Classical', 'Devotional'],
  },
  {
    id: 'kali-track-ahir-bhairav',
    title: 'Prabhati Shyama Vandana - Raag Ahir Bhairav (Dawn Awakening)',
    titleBn: 'প্রভাতী শ্যামা বন্দনা ও ঊষালগ্ন - রাগ আহীর ভৈরব',
    artist: 'National Classical Heritage Ensemble (NCERT Official Archive)',
    artistBn: 'জাতীয় শাস্ত্রীয় সঙ্গীত সংগ্রহ (এনসিইআরটি সংরক্ষিত রূপ)',
    category: 'Devotional',
    mood: 'Ritual & Devotion',
    durationSeconds: 692,
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Rag_Ahir_Bhairav_-_NCERT.ogg',
    coverUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
    description:
      'Tranquil dawn invocation celebrating the morning after Kali Puja as devotees offer fresh red hibiscus garlands and celebrate Diwali with peace and light.',
    descriptionBn:
      'কালীপূজার মহানিশার অবসানে নির্মল ভোরবেলার স্নিগ্ধ ভৈরবী বন্দনা। মা শ্যামার চরণে জবা নিবেদন ও দীপাবলির নির্মল আলোর আবাহন।',
    culturalContext:
      'Performed at dawn in Shakti temples like Kalighat and Dakshineswar following the night-long Kali Puja.',
    culturalContextBn:
      'কালীঘাট ও দক্ষিণেশ্বর মন্দিরে রাতভর পূজার পর ঊষাকালের আরতিতে নিবেদিত শান্তি ও ভক্তিসুর।',
    language: 'Instrumental',
    playbackMethod: 'direct_audio',
    licenseType: 'Creative Commons CC BY 3.0',
    attribution: 'Classical recording by NCERT Official on Wikimedia Commons under CC BY 3.0.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rag_Ahir_Bhairav_-_NCERT.ogg',
    isLocalAsset: false,
    lyricsSnippet: 'Maa go anandamoyee, amake aar rekho na andhokare...',
    lyricsSnippetBn: 'মা গো আনন্দময়ী, আমাকে আর রেখো না অন্ধকারে...',
    tags: ['Ahir Bhairav', 'Dawn', 'Shyama Vandana', 'Peace', 'Diwali'],
  },
  {
    id: 'kali-track-stotram',
    title: 'Maha Kali Dhyanam & Sanskrit Vedic Chants',
    titleBn: 'শ্রী শ্রী কালী ধ্যানমন্ত্র ও বৈদিক স্তোত্র আবাহন',
    artist: 'Swami Atmananda (Vedic Chanting Tradition)',
    artistBn: 'স্বামী আত্মানন্দ (বৈদিক স্তোত্র ধারা)',
    category: 'Devotional',
    mood: 'Ritual & Devotion',
    durationSeconds: 165,
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Sanskrit_Chanting_Guru_Stotram.ogg',
    coverUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    description:
      'Traditional Sanskrit invocation echoing the sacred Kali Dhyana Mantra: "Shavārūḍhāṁ mahābhīmāṁ muṇḍamālā-vibhūṣitām", invoking protection, fearlessness, and wisdom.',
    descriptionBn:
      'পবিত্র সংস্কৃত স্তোত্রপাঠ ও কালী আবাহন। "করালবদনাং ঘোরাং মুক্তকেশীং চতুর্ভুজাং" - মায়ের অভয় ও শক্তি স্বরূপের শ্রদ্ধাভরা স্তব।',
    culturalContext:
      'Recited by tantradharaks and devotees before the midnight Mahapuja and floral offerings.',
    culturalContextBn:
      'কালীপূজায় পুষ্পাঞ্জলি ও হোম-যজ্ঞের পূর্বে পুরোহিত ও ভক্তগণের সমবেত আবাহন মন্ত্র।',
    language: 'Sanskrit',
    playbackMethod: 'direct_audio',
    licenseType: 'Creative Commons CC BY-SA 3.0',
    attribution: 'Traditional Sanskrit recitation recorded by Swami Atmananda. Hosted on Wikimedia Commons under CC BY-SA.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sanskrit_Chanting_Guru_Stotram.ogg',
    isLocalAsset: false,
    lyricsSnippet: 'Khadgam chakra gadeshu chaapa parighan shulam bhushundim shirah...',
    lyricsSnippetBn: 'খড়্গং চক্র গদেষু চাপ পরিঘান শূলং ভুষুণ্ডীং শিরঃ...',
    tags: ['Mantra', 'Sanskrit', 'Stotram', 'Chant', 'Sacred'],
  },
  {
    id: 'kali-track-temple-bell',
    title: 'Midnight Temple Bells & Gong of Dakshineswar',
    titleBn: 'দক্ষিণেশ্বরের নিশীথ কাঁসর-ঘণ্টা ও আরতির আবহ',
    artist: 'Temple Acoustic Sanctuary Recording',
    artistBn: 'ঐতিহ্যবাহী মন্দির আরতির শব্দছবি',
    category: 'Ambient Soundscapes',
    mood: 'Ambient Sounds',
    durationSeconds: 24,
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Japanese_rin_played_as_struck_idiophone.ogg',
    coverUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=600&q=80',
    description:
      'Resonant ceremonial bronze bell and deep sanctum acoustic vibrations capturing the awe-inspiring atmosphere of midnight temple aarati.',
    descriptionBn:
      'দীপান্বিতা অমাবস্যায় মন্দিরের গর্ভগৃহের গম্ভীর কাঁসর ও ঘণ্টার অনুরণন - পবিত্র আধ্যাত্মিক আবহ।',
    culturalContext:
      'Echoing through riverside temples across the Ganges during midnight Mahanisha Puja.',
    culturalContextBn:
      'গঙ্গার তীরবর্তী মন্দিরে মহানিশার আরতিতে গম্ভীর ঘণ্টা ও কাঁসরের ধ্বনি।',
    language: 'Instrumental',
    playbackMethod: 'direct_audio',
    licenseType: 'Creative Commons CC BY 3.0',
    attribution: 'Resonant bell recording released on Wikimedia Commons under CC BY 3.0.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Japanese_rin_played_as_struck_idiophone.ogg',
    isLocalAsset: false,
    tags: ['Bells', 'Gong', 'Aarati', 'Dakshineswar', 'Atmosphere'],
  },
  {
    id: 'kali-track-shankha',
    title: 'Auspicious Amavasya Shankha Naad (Sacred Conch Call)',
    titleBn: 'অমাবস্যা নিশীথ আরতির মঙ্গল শঙ্খধ্বনি',
    artist: 'David Bolton (Acoustic Field Recording)',
    artistBn: 'ডেভিড বোল্টন (অ্যাকোস্টিক ফিল্ড রেকর্ডিং)',
    category: 'Dhak & Shankha',
    mood: 'Dhak & Traditional',
    durationSeconds: 7,
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Conch_shell.ogg',
    coverUrl: 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=600&q=80',
    description:
      'Resonant sacred conch blowing marking the commencement of the midnight Mahanisha Kali Puja across Bengal.',
    descriptionBn:
      'অমাবস্যার নিশীথ পূজার সূচনায় সমবেত মঙ্গল শঙ্খধ্বনি যা অশুভ শক্তিকে দূর করে পরম পবিত্রতার সূচনা করে।',
    culturalContext:
      'Blown three times at midnight when the Nishita Kaal muhurat begins.',
    culturalContextBn:
      'নিশীথ কাল শুরু হওয়ার সঙ্গে সঙ্গে পূজামণ্ডপে তিনবার মঙ্গল শঙ্খনাদ করা হয়।',
    language: 'Instrumental',
    playbackMethod: 'direct_audio',
    licenseType: 'Creative Commons CC BY 2.5',
    attribution: 'Acoustic conch recording by David Bolton on Wikimedia Commons under CC BY 2.5.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Conch_shell.ogg',
    isLocalAsset: false,
    tags: ['Shankha', 'Conch', 'Auspicious', 'Nishita Kaal'],
  },
];
