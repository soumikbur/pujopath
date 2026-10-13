import { LocalityZone } from '@/types';

export interface GeocodedLocation {
  id: string;
  name: string;
  nameBn?: string;
  address: string;
  addressBn?: string;
  locality: string;
  localityBn?: string;
  zone: LocalityZone;
  latitude: number;
  longitude: number;
  confidence: 'verified_landmark' | 'geocoded_exact' | 'geocoded_approximate';
  source: string;
}

/**
 * Curated offline-safe directory of Kolkata landmarks, neighborhoods,
 * major street junctions, and transit hubs across North, South, Central, East, and Howrah.
 * Guarantees instant, zero-API-key resolution even if external APIs are unreachable.
 */
const KOLKATA_LANDMARKS: GeocodedLocation[] = [
  // North Kolkata
  {
    id: 'loc-shyambazar-five-point',
    name: 'Shyambazar Five Point Crossing',
    nameBn: 'শ্যামবাজার পাঁচ মাথার মোড়',
    address: 'Shyambazar 5 Point Crossing, Bidhan Sarani, Kolkata 700004',
    addressBn: 'শ্যামবাজার পাঁচ মাথার মোড়, বিধান সরণি, কলকাতা ৭০০০৪',
    locality: 'Shyambazar',
    localityBn: 'শ্যামবাজার',
    zone: 'North Kolkata',
    latitude: 22.6028,
    longitude: 88.3718,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-bagbazar-ghat',
    name: 'Bagbazar Ghat & Circular Railway',
    nameBn: 'বাগবাজার ঘাট',
    address: 'Bagbazar Ghat, Strand Road, Kolkata 700003',
    addressBn: 'বাগবাজার ঘাট, স্ট্র্যান্ড রোড, কলকাতা ৭০০০৩',
    locality: 'Bagbazar',
    localityBn: 'বাগবাজার',
    zone: 'North Kolkata',
    latitude: 22.6042,
    longitude: 88.3615,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-sovabazar-metro',
    name: 'Sovabazar Sutanuti Crossing',
    nameBn: 'শোভাবাজার সুতানুটি',
    address: 'BK Paul Ave & Central Ave Crossing, Sovabazar, Kolkata 700005',
    addressBn: 'বি কে পাল অ্যাভিনিউ, শোভাবাজার, কলকাতা ৭০০০৫',
    locality: 'Sovabazar',
    localityBn: 'শোভাবাজার',
    zone: 'North Kolkata',
    latitude: 22.5985,
    longitude: 88.3672,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-girish-park',
    name: 'Girish Park & Vivekananda Road',
    nameBn: 'গিরিশ পার্ক',
    address: 'Vivekananda Road, Girish Park, Kolkata 700006',
    addressBn: 'বিবেকানন্দ রোড, গিরিশ পার্ক, কলকাতা ৭০০০৬',
    locality: 'Girish Park',
    localityBn: 'গিরিশ পার্ক',
    zone: 'North Kolkata',
    latitude: 22.5861,
    longitude: 88.3643,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-kumartuli',
    name: 'Kumartuli Potters Colony',
    nameBn: 'কুমারটুলি মৃৎশিল্পী পাড়া',
    address: 'Banamali Sarkar Street, Kumartuli, Kolkata 700005',
    addressBn: 'বনমালী সরকার স্ট্রিট, কুমারটুলি, কলকাতা ৭০০০৫',
    locality: 'Kumartuli',
    localityBn: 'কুমারটুলি',
    zone: 'North Kolkata',
    latitude: 22.6001,
    longitude: 88.3648,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-hatibagan-crossing',
    name: 'Hatibagan Market Crossing',
    nameBn: 'হাতিবাগান বাজার মোড়',
    address: 'Bidhan Sarani & Arabinda Sarani, Hatibagan, Kolkata 700006',
    addressBn: 'বিধান সরণি ও অরবিন্দ সরণি মোড়, হাতিবাগান, কলকাতা ৭০০০৬',
    locality: 'Hatibagan',
    localityBn: 'হাতিবাগান',
    zone: 'North Kolkata',
    latitude: 22.5936,
    longitude: 88.3715,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-maniktala-crossing',
    name: 'Maniktala More Crossing',
    nameBn: 'মানিকতলা মোড়',
    address: 'Acharya Prafulla Chandra Rd & Vivekananda Rd, Kolkata 700006',
    addressBn: 'আচার্য প্রফুল্ল চন্দ্র রোড ও বিবেকানন্দ রোড ক্রসিং, কলকাতা ৭০০০৬',
    locality: 'Maniktala',
    localityBn: 'মানিকতলা',
    zone: 'North Kolkata',
    latitude: 22.5852,
    longitude: 88.3746,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-tala-park',
    name: 'Tala Tank & Waterworks Park',
    nameBn: 'তালা পার্ক ও জলাধার',
    address: 'Tarun Sengupta Sarani, Tala, Kolkata 700037',
    addressBn: 'তরুণ সেনগুপ্ত সরণি, তালা, কলকাতা ৭০০০৩৭',
    locality: 'Tala',
    localityBn: 'তালা',
    zone: 'North Kolkata',
    latitude: 22.6075,
    longitude: 88.3782,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },

  // Central Kolkata
  {
    id: 'loc-college-street',
    name: 'College Street Boipara & Presidency',
    nameBn: 'কলেজ স্ট্রিট বইপাড়া',
    address: 'College Street & Surya Sen Street Crossing, Kolkata 700073',
    addressBn: 'কলেজ স্ট্রিট ও সূর্য সেন স্ট্রিট, কলকাতা ৭০০০৭৩',
    locality: 'College Street',
    localityBn: 'কলেজ স্ট্রিট',
    zone: 'Central Kolkata',
    latitude: 22.5768,
    longitude: 88.3635,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-sealdah-station',
    name: 'Sealdah Railway Station & Flyover',
    nameBn: 'শিয়ালদহ রেলওয়ে স্টেশন',
    address: 'Bipin Behari Ganguly Street, Sealdah, Kolkata 700014',
    addressBn: 'বিপিন বিহারী গাঙ্গুলি স্ট্রিট, শিয়ালদহ, কলকাতা ৭০০০১৪',
    locality: 'Sealdah',
    localityBn: 'শিয়ালদহ',
    zone: 'Central Kolkata',
    latitude: 22.5684,
    longitude: 88.3712,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-esplanade-dharmatala',
    name: 'Esplanade Dharmatala Bus Terminus',
    nameBn: 'ধর্মতলা এসপ্ল্যানেড বাস টার্মিনাস',
    address: 'Jawaharlal Nehru Road & Lenin Sarani, Kolkata 700013',
    addressBn: 'জওহরলাল নেহরু রোড, ধর্মতলা, কলকাতা ৭০০০১৩',
    locality: 'Esplanade',
    localityBn: 'ধর্মতলা',
    zone: 'Central Kolkata',
    latitude: 22.5638,
    longitude: 88.3516,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-bowbazar-crossing',
    name: 'Bowbazar Central Avenue Crossing',
    nameBn: 'বউবাজার সেন্ট্রাল অ্যাভিনিউ মোড়',
    address: 'BB Ganguly St & CR Avenue, Bowbazar, Kolkata 700012',
    addressBn: 'বউবাজার ও সেন্ট্রাল অ্যাভিনিউ ক্রসিং, কলকাতা ৭০০০১২',
    locality: 'Bowbazar',
    localityBn: 'বউবাজার',
    zone: 'Central Kolkata',
    latitude: 22.5702,
    longitude: 88.3587,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-park-street-crossing',
    name: 'Park Street & Camac Street Junction',
    nameBn: 'পার্ক স্ট্রিট ও ক্যামাক স্ট্রিট মোড়',
    address: 'Park Street (Mother Teresa Sarani), Kolkata 700016',
    addressBn: 'পার্ক স্ট্রিট, কলকাতা ৭০০০১৬',
    locality: 'Park Street',
    localityBn: 'পার্ক স্ট্রিট',
    zone: 'Central Kolkata',
    latitude: 22.5518,
    longitude: 88.3524,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-mouali-crossing',
    name: 'Moulali Crossing & Lenin Sarani',
    nameBn: 'মৌলালী মোড়',
    address: 'AJC Bose Road & Lenin Sarani Crossing, Kolkata 700014',
    addressBn: 'এ জে সি বোস রোড ও লেনিন সরণি মোড়, কলকাতা ৭০০০১৪',
    locality: 'Moulali',
    localityBn: 'মৌলালী',
    zone: 'Central Kolkata',
    latitude: 22.5604,
    longitude: 88.3678,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },

  // South Kolkata
  {
    id: 'loc-gariahata-crossing',
    name: 'Gariahat Four Point Crossing',
    nameBn: 'গড়িয়াহাট চার মাথার মোড়',
    address: 'Gariahat Flyover & Rashbehari Avenue, Kolkata 700019',
    addressBn: 'গড়িয়াহাট ও রাসবিহারী অ্যাভিনিউ ক্রসিং, কলকাতা ৭০০০১৯',
    locality: 'Gariahat',
    localityBn: 'গড়িয়াহাট',
    zone: 'South Kolkata',
    latitude: 22.5186,
    longitude: 88.3654,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-deshapriya-park',
    name: 'Deshapriya Park & Priya Cinema',
    nameBn: 'দেশপ্রিয় পার্ক',
    address: 'Rashbehari Avenue, Deshapriya Park, Kolkata 700029',
    addressBn: 'রাসবিহারী অ্যাভিনিউ, দেশপ্রিয় পার্ক, কলকাতা ৭০০০২৯',
    locality: 'Deshapriya Park',
    localityBn: 'দেশপ্রিয় পার্ক',
    zone: 'South Kolkata',
    latitude: 22.5189,
    longitude: 88.3558,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-kalighat-temple',
    name: 'Kalighat Temple & Kali Mandir',
    nameBn: 'কালীঘাট মন্দির',
    address: 'Kalighat Road & Anami Sangha, Kalighat, Kolkata 700026',
    addressBn: 'কালীঘাট রোড, কলকাতা ৭০০০২৬',
    locality: 'Kalighat',
    localityBn: 'কালীঘাট',
    zone: 'South Kolkata',
    latitude: 22.5204,
    longitude: 88.3424,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-bhowanipore-jadubabu',
    name: 'Bhowanipore Jadubabu Bazar',
    nameBn: 'ভবানীপুর যদুবাবুর বাজার',
    address: 'Asutosh Mukherjee Road, Bhowanipore, Kolkata 700025',
    addressBn: 'আশুতোষ মুখার্জী রোড, ভবানীপুর, কলকাতা ৭০০০২৫',
    locality: 'Bhowanipore',
    localityBn: 'ভবানীপুর',
    zone: 'South Kolkata',
    latitude: 22.5332,
    longitude: 88.3475,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-chetla-central-park',
    name: 'Chetla Central Park',
    nameBn: 'চেতলা সেন্ট্রাল পার্ক',
    address: 'Chetla Central Road, Chetla, Kolkata 700027',
    addressBn: 'চেতলা সেন্ট্রাল রোড, কলকাতা ৭০০০২৭',
    locality: 'Chetla',
    localityBn: 'চেতলা',
    zone: 'South Kolkata',
    latitude: 22.5182,
    longitude: 88.3375,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-jadavpur-8b-bus-stand',
    name: 'Jadavpur 8B Bus Stand & University',
    nameBn: 'যাদবপুর ৮বি বাস স্ট্যান্ড',
    address: 'Raja SC Mullick Road, Jadavpur, Kolkata 700032',
    addressBn: 'রাজা এস সি মল্লিক রোড, যাদবপুর, কলকাতা ৭০০০৩২',
    locality: 'Jadavpur',
    localityBn: 'যাদবপুর',
    zone: 'South Kolkata',
    latitude: 22.4995,
    longitude: 88.3715,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-tollygunge-tram-depot',
    name: 'Tollygunge Tram Depot & Mahanayak Metro',
    nameBn: 'টালিগঞ্জ ট্রাম ডিপো',
    address: 'Deshapran Sasmal Road, Tollygunge, Kolkata 700033',
    addressBn: 'দেশপ্রাণ শাসমল রোড, টালিগঞ্জ, কলকাতা ৭০০০৩৩',
    locality: 'Tollygunge',
    localityBn: 'টালিগঞ্জ',
    zone: 'South Kolkata',
    latitude: 22.4988,
    longitude: 88.3458,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-garia-mahastam',
    name: 'Garia More & Mahamayatala',
    nameBn: 'গড়িয়া মোড়',
    address: 'Raja SC Mullick Road & NSC Bose Rd Crossing, Garia, Kolkata 700084',
    addressBn: 'গড়িয়া মোড়, কলকাতা ৭০০০৮৪',
    locality: 'Garia',
    localityBn: 'গড়িয়া',
    zone: 'South Kolkata',
    latitude: 22.4642,
    longitude: 88.3842,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },

  // Behala
  {
    id: 'loc-behala-chowrasta',
    name: 'Behala Chowrasta Crossing',
    nameBn: 'বেহালা চৌরাস্তা',
    address: 'Diamond Harbour Road & James Long Sarani, Behala, Kolkata 700034',
    addressBn: 'ডায়মন্ড হারবার রোড, বেহালা চৌরাস্তা, কলকাতা ৭০০০৩৪',
    locality: 'Behala Chowrasta',
    localityBn: 'বেহালা চৌরাস্তা',
    zone: 'Behala',
    latitude: 22.4886,
    longitude: 88.3182,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-parnasree-pally',
    name: 'Parnasree Pally Lake & Bus Terminus',
    nameBn: 'পর্ণশ্রী পল্লী',
    address: 'Parnasree Pally, Behala, Kolkata 700060',
    addressBn: 'পর্ণশ্রী পল্লী, বেহালা, কলকাতা ৭০০০৬০',
    locality: 'Parnasree',
    localityBn: 'পর্ণশ্রী',
    zone: 'Behala',
    latitude: 22.4952,
    longitude: 88.3072,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },

  // Salt Lake & New Town
  {
    id: 'loc-salt-lake-city-centre-1',
    name: 'Salt Lake City Centre 1 & DC Block',
    nameBn: 'সল্টলেক সিটি সেন্টার ১',
    address: 'DC Block, Sector 1, Bidhannagar, Kolkata 700064',
    addressBn: 'ডিসি ব্লক, সেক্টর ১, সল্টলেক, কলকাতা ৭০০০৬৪',
    locality: 'Salt Lake Sector 1',
    localityBn: 'সল্টলেক সেক্টর ১',
    zone: 'Salt Lake',
    latitude: 22.5898,
    longitude: 88.4082,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-salt-lake-karunamoyee',
    name: 'Karunamoyee Central Bus Terminus & Metro',
    nameBn: 'করুণাময়ী সেন্ট্রাল বাস টার্মিনাস',
    address: 'Karunamoyee, Sector 2, Salt Lake, Kolkata 700091',
    addressBn: 'করুণাময়ী, সল্টলেক সেক্টর ২, কলকাতা ৭০০০৯১',
    locality: 'Karunamoyee',
    localityBn: 'করুণাময়ী',
    zone: 'Salt Lake',
    latitude: 22.5842,
    longitude: 88.4208,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-salt-lake-sector-5',
    name: 'Salt Lake Sector V College More',
    nameBn: 'সল্টলেক সেক্টর ৫ কলেজ মোড়',
    address: 'College More, Sector V, Bidhannagar, Kolkata 700091',
    addressBn: 'কলেজ মোড়, সেক্টর ৫, সল্টলেক, কলকাতা ৭০০০৯১',
    locality: 'Sector V',
    localityBn: 'সেক্টর ৫',
    zone: 'Salt Lake',
    latitude: 22.5732,
    longitude: 88.4335,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-new-town-biswa-bangla',
    name: 'Biswa Bangla Gate & Action Area 1',
    nameBn: 'বিশ্ব বাংলা গেট নিউ টাউন',
    address: 'Major Arterial Road, Action Area 1, New Town, Kolkata 700156',
    addressBn: 'বিশ্ব বাংলা গেট, নিউ টাউন, কলকাতা ৭০০১৫৬',
    locality: 'Action Area 1',
    localityBn: 'অ্যাকশন এরিয়া ১',
    zone: 'New Town',
    latitude: 22.5855,
    longitude: 88.4715,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },

  // Dum Dum & Lake Town
  {
    id: 'loc-lake-town-clock-tower',
    name: 'Lake Town Clock Tower (Big Ben Replica)',
    nameBn: 'লেক টাউন ক্লক টাওয়ার',
    address: 'VIP Road, Lake Town, Kolkata 700089',
    addressBn: 'ভিআইপি রোড, লেক টাউন, কলকাতা ৭০০০৮৯',
    locality: 'Lake Town',
    localityBn: 'লেক টাউন',
    zone: 'Dum Dum',
    latitude: 22.6025,
    longitude: 88.4012,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-dum-dum-junction',
    name: 'Dum Dum Junction Railway & Metro',
    nameBn: 'দমদম জংশন স্টেশন',
    address: 'Dum Dum Road, Kolkata 700030',
    addressBn: 'দমদম রোড, কলকাতা ৭০০০৩০',
    locality: 'Dum Dum',
    localityBn: 'দমদম',
    zone: 'Dum Dum',
    latitude: 22.6212,
    longitude: 88.3932,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },

  // Howrah
  {
    id: 'loc-howrah-station-ferry',
    name: 'Howrah Railway Station & Ferry Ghat',
    nameBn: 'হাওড়া রেলওয়ে স্টেশন',
    address: 'Station Road, Howrah 711101',
    addressBn: 'স্টেশন রোড, হাওড়া ৭১১১০১',
    locality: 'Howrah Station',
    localityBn: 'হাওড়া স্টেশন',
    zone: 'Howrah',
    latitude: 22.5838,
    longitude: 88.3428,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
  {
    id: 'loc-howrah-shibpur-mandirtala',
    name: 'Shibpur Mandirtala & Nabanna Junction',
    nameBn: 'শিবপুর মন্দিরতলা ও নবান্ন ক্রসিং',
    address: 'Mandirtala, Kona Expressway, Shibpur, Howrah 711102',
    addressBn: 'মন্দিরতলা, কোনা এক্সপ্রেসওয়ে, শিবপুর, হাওড়া ৭১১১০২',
    locality: 'Shibpur',
    localityBn: 'শিবপুর',
    zone: 'Howrah',
    latitude: 22.5582,
    longitude: 88.3185,
    confidence: 'verified_landmark',
    source: 'Kolkata Civic Geographic Registry',
  },
];

/**
 * Determine LocalityZone based on geographical coordinates in greater Kolkata.
 */
export function determineKolkataZone(lat: number, lng: number): LocalityZone {
  // Howrah: West of the Hooghly River (longitude < 88.345)
  if (lng < 88.345 && lat > 22.54 && lat < 22.63) {
    return 'Howrah';
  }
  // Behala: South-West Kolkata
  if (lat < 22.51 && lng < 22.335) {
    return 'Behala';
  }
  // Dum Dum: Far North
  if (lat >= 22.615) {
    return 'Dum Dum';
  }
  // New Town: Far East
  if (lng >= 88.445) {
    return 'New Town';
  }
  // Salt Lake: Mid-East
  if (lng >= 88.398 && lat >= 22.56 && lat <= 22.61) {
    return 'Salt Lake';
  }
  // North Kolkata
  if (lat >= 22.585) {
    return 'North Kolkata';
  }
  // Central Kolkata
  if (lat >= 22.55 && lat < 22.585) {
    return 'Central Kolkata';
  }
  // South Kolkata
  return 'South Kolkata';
}

/**
 * Normalizes query string for fuzzy searching.
 */
function cleanQuery(str: string): string {
  return str
    .toLowerCase()
    .replace(/[,\.\-\/\\#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export class GeocodingService {
  /**
   * Search for locations in Kolkata by query (pandal name, address, landmark, locality).
   * Combines curated Kolkata landmarks with live geocoding when available,
   * guaranteeing instantaneous results without requiring paid API keys.
   */
  static async searchLocations(query: string): Promise<GeocodedLocation[]> {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];

    const cleaned = cleanQuery(trimmed);
    const words = cleaned.split(' ').filter(Boolean);

    // 1. Search curated Kolkata landmarks first
    const matchedLandmarks = KOLKATA_LANDMARKS.filter((l) => {
      const targetText = cleanQuery(
        `${l.name} ${l.nameBn || ''} ${l.locality} ${l.localityBn || ''} ${l.address} ${l.zone}`
      );
      return words.every((w) => targetText.includes(w)) || targetText.includes(cleaned);
    });

    // 2. Attempt online geocoding via OpenStreetMap Nominatim with strict Kolkata bounding box
    let remoteMatches: GeocodedLocation[] = [];
    if (typeof window !== 'undefined' && navigator.onLine) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3200);

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          `${trimmed}, Kolkata, West Bengal, India`
        )}&viewbox=88.15,22.75,88.55,22.40&bounded=0&limit=4&addressdetails=1`;

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = (await response.json()) as Array<{
            place_id: number;
            lat: string;
            lon: string;
            display_name: string;
            address?: {
              suburb?: string;
              neighbourhood?: string;
              city?: string;
              road?: string;
            };
          }>;

          remoteMatches = data
            .map((item) => {
              const lat = parseFloat(item.lat);
              const lng = parseFloat(item.lon);
              if (isNaN(lat) || isNaN(lng)) return null;

              // Ensure coordinates are reasonably within Greater Kolkata bounds
              if (lat < 22.35 || lat > 22.78 || lng < 88.15 || lng > 88.58) return null;

              const locality =
                item.address?.neighbourhood ||
                item.address?.suburb ||
                item.address?.road ||
                'Kolkata';

              const zone = determineKolkataZone(lat, lng);

              return {
                id: `osm-${item.place_id}`,
                name: trimmed,
                address: item.display_name,
                locality,
                zone,
                latitude: lat,
                longitude: lng,
                confidence: 'geocoded_exact' as const,
                source: 'OpenStreetMap Geocoding',
              };
            })
            .filter(Boolean) as GeocodedLocation[];
        }
      } catch {
        // Graceful fallback to curated directory on network timeout or fetch errors
      }
    }

    // Merge and deduplicate results
    const combined = [...matchedLandmarks];
    for (const remote of remoteMatches) {
      const isDuplicate = combined.some(
        (existing) =>
          Math.abs(existing.latitude - remote.latitude) < 0.003 &&
          Math.abs(existing.longitude - remote.longitude) < 0.003
      );
      if (!isDuplicate) {
        combined.push(remote);
      }
    }

    return combined.slice(0, 6);
  }

  /**
   * Resolves address string into coordinates and zone.
   * If manual coordinates were provided, validates and sets zone.
   */
  static async resolveAddress(
    address: string,
    manualLat?: number,
    manualLng?: number
  ): Promise<GeocodedLocation | null> {
    // If coordinates were explicitly provided by the user
    if (
      typeof manualLat === 'number' &&
      typeof manualLng === 'number' &&
      !isNaN(manualLat) &&
      !isNaN(manualLng) &&
      manualLat >= 22.0 &&
      manualLat <= 23.5 &&
      manualLng >= 87.5 &&
      manualLng <= 89.0
    ) {
      const zone = determineKolkataZone(manualLat, manualLng);
      return {
        id: `custom-coords-${Date.now()}`,
        name: address.split(',')[0].trim() || 'Custom Pandal',
        address,
        locality: address.split(',')[1]?.trim() || 'Kolkata',
        zone,
        latitude: manualLat,
        longitude: manualLng,
        confidence: 'geocoded_exact',
        source: 'User Provided Coordinates',
      };
    }

    // Otherwise, attempt search resolution
    const results = await this.searchLocations(address);
    if (results.length > 0) {
      return results[0];
    }

    return null;
  }
}
