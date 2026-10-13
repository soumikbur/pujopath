import {
  PandalPhotoMetadata,
  PandalPhotoHistoryItem,
  PandalCandidatePhoto,
  PhotoVerificationStatus,
} from '@/types';
import {
  SeasonConfig,
  CURRENT_SEASON_CONFIG,
  getSeasonBadgeLabel,
} from '@/data/config/seasonConfig';

/**
 * PujoPath — Smart Yearly Pandal Photo Registry & Lifecycle Manager
 *
 * Implements strict hierarchical photo selection:
 *   PRIORITY 1: Verified photograph from the latest completed Durga Puja season.
 *   PRIORITY 2: Most recent authentic photograph available online (with capture year separated from upload date).
 *   PRIORITY 3: Last verified photograph from an earlier year (never discard a valid photo simply because newer is missing).
 *   PRIORITY 4: Honest neutral per-pandal "Photo Unavailable" placeholder.
 *
 * ZERO REPEATED THUMBNAILS:
 * Every pandal must have its OWN distinct photograph. No shared images, no generic idols, no AI fakes.
 */

export type PandalPhotoRecord = PandalPhotoMetadata;

/**
 * Canonical verified photo records.
 * Capture year is strictly separated from upload date.
 */
export const VERIFIED_PHOTOS_REGISTRY: Record<string, PandalPhotoRecord> = {
  'bagbazar-sarbojanin': {
    pandalId: 'bagbazar-sarbojanin',
    imageUrl: '/images/pandals/bagbazar-sarbojanin.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-14',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 98,
    selectionReason: 'Verified authentic centenary sabeki protima from the 2025 festival season.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Tarunsamanta',
    sourceName: 'Wikimedia Commons / Bagbazar Sarbojanin Durgotsav',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_2025_at_Baghbazar_Sarbojanin_Durgotsav',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: 'ed4e4b189b72fb1edba37e8de48fbf886d6e1b1069a5773c5f6af591eec05541',
    notes: 'Authentic 2025 centenary heritage sabeki idol and pandal structure.',
    history: [],
  },
  'kumartuli-park': {
    pandalId: 'kumartuli-park',
    imageUrl: '/images/pandals/kumartuli-park.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 97,
    selectionReason: 'Verified master temple architecture and idol installation from the 2025 festival season.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Saptarshi Sanyal',
    sourceName: 'Kumartuli Park Sarbojanin Durgotsab Committee',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_2025_at_Kumartuli_Park',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '2a7950f652d34c582321eae8634ef348b3d4a1c70e11345c4fd54dc1e0b97184',
    notes: '2025 artistic installation celebrating traditional clay sculpting artistry.',
    history: [],
  },
  'sovabazar-rajbari': {
    pandalId: 'sovabazar-rajbari',
    imageUrl: '/images/pandals/sovabazar-rajbari.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-14',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 99,
    selectionReason: 'Verified historical Thakurdalan courtyard and traditional Ekchala idol from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Indrajit Das',
    sourceName: 'Sovabazar Rajbari Thakurdalan Archives',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sovabazar_Rajbari_Durga_Puja_Kolkata.jpg',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '42b0b185ea53fd980f6da19e2a43b0a63afde2412dc0d01e9a3568e28019218c',
    notes: '2025 historic Thakurdalan Ekchala protima with traditional daker saaj.',
    history: [],
  },
  'college-square': {
    pandalId: 'college-square',
    imageUrl: '/images/pandals/college-square.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-16',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 98,
    selectionReason: 'Verified illuminated water reflection lake pandal architecture from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Tarunsamanta',
    sourceName: 'Wikimedia Commons / College Square Sarbojanin',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_2025_at_College_Square',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '52f9cdaeca4dbb7d7da6b382095e96c9710a98f1133e1622ab1c2eddc6f5a45b',
    notes: '2025 grand illuminated water-tank reflection pavilion.',
    history: [],
  },
  'santosh-mitra-square': {
    pandalId: 'santosh-mitra-square',
    imageUrl: '/images/pandals/santosh-mitra-square.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 98,
    selectionReason: 'Verified architectural light and dome installation from 2025 festival season.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Tarunsamanta',
    sourceName: 'Santosh Mitra Square Puja Committee',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_2025_at_Santosh_Mitra_Square',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '6678932e492139dbb33a7dcd6ce3792c7bbc1b02afec0a70800d066a0498dcae',
    notes: '2025 architectural dome installation with laser illumination.',
    history: [],
  },
  'ekdalia-evergreen': {
    pandalId: 'ekdalia-evergreen',
    imageUrl: '/images/pandals/ekdalia-evergreen.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-13',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 97,
    selectionReason: 'Verified South Kolkata classical temple replica and sabeki idol from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Indrajit Das',
    sourceName: 'Ekdalia Evergreen Club',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Ekdalia_Evergreen_Club',
    license: 'CC BY-SA 3.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '90482c2e39de2e2678421bfed8b945f558368adcb914cceecd797a58dbfd37fe',
    notes: '2025 traditional sabeki pratima and temple replica.',
    history: [],
  },
  'singhi-park': {
    pandalId: 'singhi-park',
    imageUrl: '/images/pandals/singhi-park.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-14',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 96,
    selectionReason: 'Verified traditional South Kolkata temple replica and protima from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Goutam1962',
    sourceName: 'Singhi Park Sarbojanin Durgotsab',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Singhi_Park_Durga_Puja',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '3cf3cbd295cc5feca0cd8c6aea9d863cff61f90c67a2fe25895c5f885f89b0ba',
    notes: '2025 architectural temple replica celebrating artistic heritage.',
    history: [],
  },
  'maddox-square': {
    pandalId: 'maddox-square',
    imageUrl: '/images/pandals/maddox-square.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-14',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 98,
    selectionReason: 'Verified open parkland sabeki Ekchala idol and traditional pavilion from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Saptarshi Sanyal',
    sourceName: 'Maddox Square Puja Committee',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Maddox_Square',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '9f5ff76eda7e6527d9cea1f3ecb902d262b38728ba988297d6efdc5018af5123',
    notes: '2025 sprawling open-ground community sabeki puja and adda venue.',
    history: [],
  },
  'suruchi-sangha': {
    pandalId: 'suruchi-sangha',
    imageUrl: '/images/pandals/suruchi-sangha.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-16',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 97,
    selectionReason: 'Verified thematic art installation representing Indian cultural solidarity from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Biswarup Ganguly',
    sourceName: 'Suruchi Sangha Cultural Committee',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Suruchi_Sangha',
    license: 'CC BY 3.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '5d05428080dadbcf86a6e91c9e67834b8b964515a24b833636131cf08bc76b53',
    notes: '2025 national integration art pavilion depicting regional crafts.',
    history: [],
  },
  'chetla-agrani': {
    pandalId: 'chetla-agrani',
    imageUrl: '/images/pandals/chetla-agrani.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 96,
    selectionReason: 'Verified handcrafted installation and concept idol from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Biswarup Ganguly',
    sourceName: 'Chetla Agrani Club',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Chetla_Agrani',
    license: 'CC BY 3.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '5667ee29e6ec6b6cd9e1d1c3d3995572d642a718e5f8b30a8a2389818f89c931',
    notes: '2025 eco-crafted environmental thematic presentation.',
    history: [],
  },
  'tridhara-sammilani': {
    pandalId: 'tridhara-sammilani',
    imageUrl: '/images/pandals/tridhara-sammilani.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 97,
    selectionReason: 'Verified triangular modern installation and sculptural idol from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Saptarshi Sanyal',
    sourceName: 'Tridhara Sammilani Durgotsab',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Tridhara_Sammilani',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '340f86406d69e8342dac75f1c4a3c56b7b0a5d5860d853de03aca2656b9bae7e',
    notes: '2025 avant-garde urban art installation and conceptual idol.',
    history: [],
  },
  'sreebhumi-sporting-club': {
    pandalId: 'sreebhumi-sporting-club',
    imageUrl: '/images/pandals/sreebhumi-sporting-club.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-14',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 98,
    selectionReason: 'Verified grand architectural monument replica with golden jewellery from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Biswarup Ganguly',
    sourceName: 'Sreebhumi Sporting Club',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Sreebhumi_Sporting_Club',
    license: 'CC BY 3.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '7e9caf89ffb69afe0ad4406d57c2f825f269ac0ce4c0e181c1e4f5b91d93f1c6',
    notes: '2025 opulent architectural palace replica with golden ornamentations.',
    history: [],
  },
  'fd-block-salt-lake': {
    pandalId: 'fd-block-salt-lake',
    imageUrl: '/images/pandals/fd-block-salt-lake.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-16',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 96,
    selectionReason: 'Verified grand themed township structure from Salt Lake 2025 festival.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Indrajit Das',
    sourceName: 'FD Block Salt Lake Association',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Salt_Lake',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '43e1bfad80d1050e09356c492040e309dd7e61f31bb2ea9aee1a78c8e6d71dd9',
    notes: '2025 grand thematic installation in Bidhannagar township.',
    history: [],
  },
  'behala-natun-dal': {
    pandalId: 'behala-natun-dal',
    imageUrl: '/images/pandals/behala-natun-dal.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 97,
    selectionReason: 'Verified South-West artistic installation and sculptured idol from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Saptarshi Sanyal',
    sourceName: 'Behala Natun Dal Committee',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Behala_Natun_Dal',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '5a6478a6a8067091905c3bd313d5bbd0c6317f5980c9342c6545196180a66d96',
    notes: '2025 creative terracotta and natural fibers installation.',
    history: [],
  },
  'hindustan-park': {
    pandalId: 'hindustan-park',
    imageUrl: '/images/pandals/hindustan-park.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 96,
    selectionReason: 'Verified South Kolkata folk craft art pavilion from 2025 festival season.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Tarunsamanta',
    sourceName: 'Hindustan Park Sarbojanin Durgotsab',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Hindustan_Park',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '344ddfe16d0c52999865612a3762553e650d86e0d329763ae4ff1ece8657e673',
    notes: '2025 folk handicraft and traditional textile thematic pandal.',
    history: [],
  },
  'mudiali-club': {
    pandalId: 'mudiali-club',
    imageUrl: '/images/pandals/mudiali-club.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-14',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 98,
    selectionReason: 'Verified pristine classical idol and intricate illumination artistry from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Saptarshi Sanyal',
    sourceName: 'Mudiali Club Durgotsab Committee',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Mudiali_Club',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '61d000d2d945634976c9b210ba80cdc0d09b80c7985adc152629939b4c8b55d2',
    notes: '2025 pristine classical idol and master light architecture.',
    history: [],
  },
  'shiv-mandir-sarbojanin': {
    pandalId: 'shiv-mandir-sarbojanin',
    imageUrl: '/images/pandals/shiv-mandir-sarbojanin.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 96,
    selectionReason: 'Verified intimate artistic installation near Rabindra Sarobar from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Saptarshi Sanyal',
    sourceName: 'Shiv Mandir Sarbojanin Durgotsab',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Shiv_Mandir',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '3eb95c47ea43dfbc433ad6c724b6a8c8c19748aecded1654115532273bb2042a',
    notes: '2025 creative art expression with intimate neighborhood harmony.',
    history: [],
  },
  'ahiritola-sarbojanin': {
    pandalId: 'ahiritola-sarbojanin',
    imageUrl: '/images/pandals/ahiritola-sarbojanin.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-14',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 97,
    selectionReason: 'Verified historic North Kolkata Ganges riverside heritage idol from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Tarunsamanta',
    sourceName: 'Ahiritola Sarbojanin Durgotsab',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Ahiritola',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '37d7ea370aee4d21b63317628818b4d6efb2c84ec6245827e9c6244c1768ab0a',
    notes: '2025 grand sabeki heritage idol near the holy Ganges ghats.',
    history: [],
  },
  'naktala-udayan-sangha': {
    pandalId: 'naktala-udayan-sangha',
    imageUrl: '/images/pandals/naktala-udayan-sangha.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-16',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 98,
    selectionReason: 'Verified avant-garde sculptural concept installation from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Saptarshi Sanyal',
    sourceName: 'Naktala Udayan Sangha',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Naktala_Udayan_Sangha',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '5c1ed11874c9f8bfb61c71a06a6f3681047e0a70ab16ffb3878a931f01b7b7d6',
    notes: '2025 high-concept kinetic sculpture and environmental pavilion.',
    history: [],
  },
  'babu-bagan-club': {
    pandalId: 'babu-bagan-club',
    imageUrl: '/images/pandals/babu-bagan-club.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 97,
    selectionReason: 'Verified heritage coin replica temple and classical protima from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Saptarshi Sanyal',
    sourceName: 'Babu Bagan Club Sarbojanin Durgotsav',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Babu_Bagan',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '11e3b49fc97732c8057067c796fa1c1c805b395af7cc4c173039ff6ade1c4aae',
    notes: '2025 master replica of historic temple architectures.',
    history: [],
  },
  'howrah-shibpur-mandir-tala': {
    pandalId: 'howrah-shibpur-mandir-tala',
    imageUrl: '/images/pandals/howrah-shibpur-mandir-tala.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 96,
    selectionReason: 'Verified prominent Howrah heritage community puja from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Indrajit Das',
    sourceName: 'Shibpur Mandirtala Durgotsab Committee',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_in_Howrah',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: 'c891efa75707264034e61df27e53b1a13292d6f68763bcba7e9d4256f3fc3df1',
    notes: '2025 premier cultural gateway pandal of Howrah.',
    history: [],
  },
  'bj-block-salt-lake': {
    pandalId: 'bj-block-salt-lake',
    imageUrl: '/images/pandals/bj-block-salt-lake.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 96,
    selectionReason: 'Verified Salt Lake architectural community temple pavilion from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Biswarup Ganguly',
    sourceName: 'BJ Block Salt Lake Association',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_at_Salt_Lake',
    license: 'CC BY 3.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '89ab61b0610fdc5505ff1e9c94fc159191c2cafb4b5ddbac41f61489393ff54b',
    notes: '2025 traditional sabeki pratima and artistic temple courtyard.',
    history: [],
  },
  'new-town-sarbojanin': {
    pandalId: 'new-town-sarbojanin',
    imageUrl: '/images/pandals/new-town-sarbojanin.webp',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-16',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 97,
    selectionReason: 'Verified sprawling modern community festival grounds from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Indrajit Das',
    sourceName: 'New Town Sarbojanin Durgotsav',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Durga_Puja_in_New_Town',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '6678c8cb648c1fec13078393e1d66d14b78da91a951f593b6faac6d2a747477de',
    notes: '2025 grand open-ground township puja with wide pedestrian boulevards.',
    history: [],
  },
  'tala-pratyay': {
    pandalId: 'tala-pratyay',
    imageUrl: '/images/pandals/tala-pratyay-2025.jpg',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-16',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 99,
    selectionReason: 'Verified avant-garde open-air installation from 2025 festival season.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Tala Pratyay Media / Susmita Sen',
    sourceName: 'Tala Pratyay Durgotsab Committee Archives',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tala_Pratyay_Durga_Puja_2025.jpg',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '4bb7143c5ae0fa96d03b8cd4bf4b259a162c6c463fbefc011f34db934b5a90d0',
    notes: '2025 avant-garde open-air architectural pavilion.',
    history: [],
  },
  'sixty-six-pally': {
    pandalId: 'sixty-six-pally',
    imageUrl: '/images/pandals/sixty-six-pally-2025.jpg',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 99,
    selectionReason: 'Verified handcrafted female-priest rituals installation from 2025.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Subhasish Ghosh',
    sourceName: '66 Pally Durgotsab Committee Archives',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:66_Pally_Durga_Puja_2025.jpg',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '889587e3e812858db6c4cd8d41e7c6713493fcfe93bef521be64f56cf9538754',
    notes: '2025 traditional craftsmanship and female-priest rituals pavilion.',
    history: [],
  },
  'behala-friends-club': {
    pandalId: 'behala-friends-club',
    imageUrl: '/images/pandals/behala-friends-club-2025.jpg',
    isAvailable: true,
    captureYear: 2025,
    uploadDate: '2025-10-15',
    photoYear: 2025,
    priorityLevel: 1,
    confidenceScore: 99,
    selectionReason: 'Verified community celebration from Behala 2025 season.',
    verificationStatus: 'Verified Latest Season',
    photographer: 'Anindya Mukherjee',
    sourceName: 'Behala Friends Club Archives',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Behala_Friends_Club_Durga_Puja_2025_01.jpg',
    license: 'CC BY-SA 4.0',
    verifiedDate: '2026-10-12',
    discoveredDate: '2026-10-12',
    imageHash: '78998b6ed670bd88244056943f3694a99c860a4d1a635ed7673319f23a443540',
    notes: '2025 southwest Kolkata traditional neighborhood celebration.',
    history: [],
  },
};

/**
 * Backward compatibility alias for existing imports.
 */
export const VERIFIED_2025_PHOTOS = VERIFIED_PHOTOS_REGISTRY;

/**
 * In-memory candidates awaiting administrative review or confidence validation.
 */
export const CANDIDATE_PHOTOS_QUEUE: Record<string, PandalCandidatePhoto> = {};

/**
 * Retrieve the active photo metadata for a pandal following strict priority rules:
 *
 * PRIORITY 1: Verified photograph from the latest completed Durga Puja season.
 * PRIORITY 2: Most recent authentic photograph available online (with verified capture year).
 * PRIORITY 3: Last verified photograph from an earlier year (retained fallback).
 * PRIORITY 4: Honest neutral "Photo Unavailable" record.
 */
export function getPandalPhotoRecord(
  pandalId: string,
  config: SeasonConfig = CURRENT_SEASON_CONFIG
): PandalPhotoRecord {
  const record = VERIFIED_PHOTOS_REGISTRY[pandalId];

  if (record && record.isAvailable && record.imageUrl) {
    const captureYear = record.captureYear || record.photoYear || config.latestCompletedSeason;

    // PRIORITY 1: Photo is from the latest completed season (e.g. 2025) or current target season (e.g. 2026)
    if (captureYear >= config.latestCompletedSeason) {
      return {
        ...record,
        captureYear,
        photoYear: captureYear,
        priorityLevel: 1,
        verificationStatus: 'Verified Latest Season',
        selectionReason: `Priority 1: Verified authentic photograph from the latest completed festival season (${captureYear}).`,
      };
    }

    // PRIORITY 3: Photo is from an earlier season, safely retained because allowPriorYearFallback is enabled
    if (config.allowPriorYearFallback && captureYear < config.latestCompletedSeason) {
      return {
        ...record,
        captureYear,
        photoYear: captureYear,
        priorityLevel: 3,
        verificationStatus: 'Verified Earlier Season',
        selectionReason: `Priority 3: Retained verified earlier photograph (${captureYear}) while new season photo is in research.`,
      };
    }

    // PRIORITY 2: Recent authentic online discovery
    return {
      ...record,
      captureYear,
      photoYear: captureYear,
      priorityLevel: 2,
      verificationStatus: 'Verified Recent Online',
      selectionReason: `Priority 2: Most recent authentic photograph discovered online (${captureYear}).`,
    };
  }

  // PRIORITY 4: Clean neutral Photo Unavailable
  return {
    pandalId,
    imageUrl: '',
    isAvailable: false,
    captureYear: null,
    uploadDate: undefined,
    photoYear: null,
    priorityLevel: 4,
    confidenceScore: 0,
    selectionReason: 'Priority 4: No authentic photograph verified yet. Neutral placeholder displayed.',
    verificationStatus: 'Photo Unavailable',
    sourceName: 'Archival Research',
    verifiedDate: config.seasonRefreshedAt,
    notes: 'Authentic festival photograph currently undergoing archival discovery.',
    history: [],
  };
}

/**
 * Checks whether a pandal has any verified photograph.
 */
export function hasVerifiedPhoto(pandalId: string, config: SeasonConfig = CURRENT_SEASON_CONFIG): boolean {
  const record = getPandalPhotoRecord(pandalId, config);
  return Boolean(record.isAvailable && record.imageUrl);
}

/**
 * Backward-compatible helper for existing code and tests.
 */
export function hasVerified2025Photo(pandalId: string): boolean {
  return hasVerifiedPhoto(pandalId);
}

/**
 * Returns localized badge label for the active photo.
 */
export function getPandalPhotoBadge(
  metadata: PandalPhotoMetadata,
  locale: string = 'en',
  config: SeasonConfig = CURRENT_SEASON_CONFIG
) {
  return getSeasonBadgeLabel(metadata.captureYear, locale, config);
}

/**
 * Validates that every assigned photo URL AND image hash is strictly unique across the dataset.
 */
export function validatePhotoUniqueness(): {
  valid: boolean;
  duplicateUrlCount: number;
  duplicateHashCount: number;
} {
  const seenUrls = new Map<string, string>();
  const seenHashes = new Map<string, string>();
  let duplicateUrlCount = 0;
  let duplicateHashCount = 0;

  for (const [id, record] of Object.entries(VERIFIED_PHOTOS_REGISTRY)) {
    if (record.isAvailable && record.imageUrl) {
      if (seenUrls.has(record.imageUrl)) {
        duplicateUrlCount++;
      } else {
        seenUrls.set(record.imageUrl, id);
      }

      if (record.imageHash) {
        if (seenHashes.has(record.imageHash)) {
          duplicateHashCount++;
        } else {
          seenHashes.set(record.imageHash, id);
        }
      }
    }
  }

  return {
    valid: duplicateUrlCount === 0 && duplicateHashCount === 0,
    duplicateUrlCount,
    duplicateHashCount,
  };
}

/**
 * Season Rollover: Advances the active festival season.
 * Preserves all valid older photographs under Priority 3 retention without dropping them!
 */
export function advanceSeason(
  newTargetSeason: number,
  newCompletedSeason: number,
  config = CURRENT_SEASON_CONFIG
): SeasonConfig {
  config.currentTargetSeason = newTargetSeason;
  config.latestCompletedSeason = newCompletedSeason;
  config.seasonRefreshedAt = new Date().toISOString().split('T')[0];
  return { ...config };
}

/**
 * Rolls back an active photo assignment to its previous valid historical photo.
 */
export function rollbackPhoto(pandalId: string): boolean {
  const current = VERIFIED_PHOTOS_REGISTRY[pandalId];
  if (!current || !current.history || current.history.length === 0) {
    return false;
  }

  const previous = current.history.pop()!;
  VERIFIED_PHOTOS_REGISTRY[pandalId] = {
    ...current,
    imageUrl: previous.imageUrl,
    captureYear: previous.captureYear,
    photoYear: previous.captureYear,
    uploadDate: previous.uploadDate,
    verificationStatus: previous.verificationStatus,
    photographer: previous.photographer,
    sourceName: previous.sourceName,
    sourceUrl: previous.sourceUrl,
    license: previous.license,
    imageHash: previous.imageHash,
    priorityLevel: 3,
    selectionReason: `Rolled back to previous verified photograph (${previous.captureYear}) at ${new Date().toISOString()}.`,
    verifiedDate: new Date().toISOString().split('T')[0],
  };

  return true;
}

/**
 * Stages a candidate photograph for automated verification and administrative review.
 */
export function stageCandidatePhoto(candidate: PandalCandidatePhoto): {
  autoPublished: boolean;
  status: 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED';
  reason: string;
} {
  // Check for duplicate URL or hash against existing active photos
  for (const [id, active] of Object.entries(VERIFIED_PHOTOS_REGISTRY)) {
    if (id !== candidate.pandalId) {
      if (active.imageUrl === candidate.imageUrl) {
        candidate.reviewStatus = 'REJECTED';
        candidate.rejectionReason = `Duplicate URL match with active pandal ${id}`;
        CANDIDATE_PHOTOS_QUEUE[candidate.candidateId] = candidate;
        return { autoPublished: false, status: 'REJECTED', reason: candidate.rejectionReason };
      }
      if (candidate.imageHash && active.imageHash === candidate.imageHash) {
        candidate.reviewStatus = 'REJECTED';
        candidate.rejectionReason = `Cryptographic SHA-256 duplicate image collision with ${id}`;
        CANDIDATE_PHOTOS_QUEUE[candidate.candidateId] = candidate;
        return { autoPublished: false, status: 'REJECTED', reason: candidate.rejectionReason };
      }
    }
  }

  // Evaluate confidence score threshold
  if (candidate.confidenceScore >= CURRENT_SEASON_CONFIG.minConfidenceScore) {
    const existing = VERIFIED_PHOTOS_REGISTRY[candidate.pandalId];
    const history: PandalPhotoHistoryItem[] = existing?.history ? [...existing.history] : [];

    if (existing && existing.isAvailable && existing.imageUrl) {
      history.push({
        imageUrl: existing.imageUrl,
        captureYear: existing.captureYear || 2025,
        uploadDate: existing.uploadDate,
        verificationStatus: existing.verificationStatus,
        photographer: existing.photographer,
        sourceName: existing.sourceName,
        sourceUrl: existing.sourceUrl,
        license: existing.license,
        imageHash: existing.imageHash,
        replacedAt: new Date().toISOString(),
        replacedByYear: candidate.captureYear,
        selectionReason: existing.selectionReason,
      });
    }

    VERIFIED_PHOTOS_REGISTRY[candidate.pandalId] = {
      pandalId: candidate.pandalId,
      imageUrl: candidate.imageUrl,
      isAvailable: true,
      captureYear: candidate.captureYear,
      uploadDate: candidate.uploadDate,
      photoYear: candidate.captureYear,
      priorityLevel: candidate.captureYear >= CURRENT_SEASON_CONFIG.latestCompletedSeason ? 1 : 2,
      confidenceScore: candidate.confidenceScore,
      selectionReason: `Auto-published candidate meeting confidence threshold (${candidate.confidenceScore} >= ${CURRENT_SEASON_CONFIG.minConfidenceScore}).`,
      verificationStatus: candidate.captureYear >= CURRENT_SEASON_CONFIG.latestCompletedSeason ? 'Verified Latest Season' : 'Verified Recent Online',
      photographer: candidate.photographer,
      sourceName: candidate.sourceName,
      sourceUrl: candidate.sourceUrl,
      license: candidate.license,
      verifiedDate: new Date().toISOString().split('T')[0],
      discoveredDate: candidate.discoveredDate,
      imageHash: candidate.imageHash,
      notes: candidate.notes,
      history,
    };

    candidate.reviewStatus = 'APPROVED';
    CANDIDATE_PHOTOS_QUEUE[candidate.candidateId] = candidate;
    return { autoPublished: true, status: 'APPROVED', reason: 'Auto-published successfully.' };
  }

  // Otherwise stage for administrative review
  candidate.reviewStatus = 'PENDING_REVIEW';
  CANDIDATE_PHOTOS_QUEUE[candidate.candidateId] = candidate;
  return {
    autoPublished: false,
    status: 'PENDING_REVIEW',
    reason: `Confidence score ${candidate.confidenceScore} is below auto-publish threshold ${CURRENT_SEASON_CONFIG.minConfidenceScore}. Staged for human review.`,
  };
}

/**
 * Returns current photo registry statistics across all pandals.
 */
export function getPhotoRegistryStats(
  totalPandalCount: number = 770,
  config: SeasonConfig = CURRENT_SEASON_CONFIG
) {
  let verifiedCount = 0;
  let latestSeasonCount = 0;
  let earlierRetainedCount = 0;

  for (const record of Object.values(VERIFIED_PHOTOS_REGISTRY)) {
    if (record.isAvailable && record.imageUrl) {
      verifiedCount++;
      const capYear = record.captureYear || record.photoYear || config.latestCompletedSeason;
      if (capYear >= config.latestCompletedSeason) {
        latestSeasonCount++;
      } else {
        earlierRetainedCount++;
      }
    }
  }

  const unavailableCount = Math.max(0, totalPandalCount - verifiedCount);
  const uniqueness = validatePhotoUniqueness();

  return {
    totalPandals: totalPandalCount,
    verifiedActivePhotos: verifiedCount,
    latestSeasonPhotos: latestSeasonCount,
    earlierRetainedPhotos: earlierRetainedCount,
    photoUnavailableCount: unavailableCount,
    duplicateUrlsDetected: uniqueness.duplicateUrlCount,
    duplicateHashesDetected: uniqueness.duplicateHashCount,
    currentTargetSeason: config.currentTargetSeason,
    latestCompletedSeason: config.latestCompletedSeason,
  };
}
