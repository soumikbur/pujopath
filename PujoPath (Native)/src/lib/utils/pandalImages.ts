import { ImageSourcePropType } from 'react-native';

const PANDAL_IMAGES: Record<string, ImageSourcePropType> = {
  'ahiritola-sarbojanin.webp': require('../../../assets/images/pandals/ahiritola-sarbojanin.webp'),
  'art-craft-terracotta.jpg': require('../../../assets/images/pandals/art-craft-terracotta.jpg'),
  'babu-bagan-club.webp': require('../../../assets/images/pandals/babu-bagan-club.webp'),
  'bagbazar-sarbojanin.webp': require('../../../assets/images/pandals/bagbazar-sarbojanin.webp'),
  'behala-friends-club-2025.jpg': require('../../../assets/images/pandals/behala-friends-club-2025.jpg'),
  'behala-natun-dal.webp': require('../../../assets/images/pandals/behala-natun-dal.webp'),
  'bj-block-salt-lake.webp': require('../../../assets/images/pandals/bj-block-salt-lake.webp'),
  'chetla-agrani.webp': require('../../../assets/images/pandals/chetla-agrani.webp'),
  'college-square-water.jpg': require('../../../assets/images/pandals/college-square-water.jpg'),
  'college-square.webp': require('../../../assets/images/pandals/college-square.webp'),
  'ekchala-traditional.jpg': require('../../../assets/images/pandals/ekchala-traditional.jpg'),
  'ekdalia-evergreen.webp': require('../../../assets/images/pandals/ekdalia-evergreen.webp'),
  'fd-block-salt-lake.webp': require('../../../assets/images/pandals/fd-block-salt-lake.webp'),
  'hindustan-park.webp': require('../../../assets/images/pandals/hindustan-park.webp'),
  'howrah-shibpur-mandir-tala.webp': require('../../../assets/images/pandals/howrah-shibpur-mandir-tala.webp'),
  'kumartuli-park.webp': require('../../../assets/images/pandals/kumartuli-park.webp'),
  'maddox-square.webp': require('../../../assets/images/pandals/maddox-square.webp'),
  'mudiali-club.webp': require('../../../assets/images/pandals/mudiali-club.webp'),
  'naktala-udayan-sangha.webp': require('../../../assets/images/pandals/naktala-udayan-sangha.webp'),
  'new-town-sarbojanin.webp': require('../../../assets/images/pandals/new-town-sarbojanin.webp'),
  'pandal-fallback.webp': require('../../../assets/images/pandals/pandal-fallback.webp'),
  'santosh-mitra-square.webp': require('../../../assets/images/pandals/santosh-mitra-square.webp'),
  'shiv-mandir-sarbojanin.webp': require('../../../assets/images/pandals/shiv-mandir-sarbojanin.webp'),
  'singhi-park.webp': require('../../../assets/images/pandals/singhi-park.webp'),
  'sixty-six-pally-2025.jpg': require('../../../assets/images/pandals/sixty-six-pally-2025.jpg'),
  'south-temple-replica.jpg': require('../../../assets/images/pandals/south-temple-replica.jpg'),
  'sovabazar-rajbari.webp': require('../../../assets/images/pandals/sovabazar-rajbari.webp'),
  'sreebhumi-sporting-club.webp': require('../../../assets/images/pandals/sreebhumi-sporting-club.webp'),
  'suruchi-sangha.webp': require('../../../assets/images/pandals/suruchi-sangha.webp'),
  'tala-pratyay-2025.jpg': require('../../../assets/images/pandals/tala-pratyay-2025.jpg'),
  'tridhara-sammilani.webp': require('../../../assets/images/pandals/tridhara-sammilani.webp'),
};

export function getPandalImageSource(imageUrl?: string, pandalId?: string): ImageSourcePropType | null {
  if (!imageUrl && !pandalId) return null;

  if (imageUrl) {
    const filename = imageUrl.split('/').pop()?.split('?')[0];
    if (filename && PANDAL_IMAGES[filename]) {
      return PANDAL_IMAGES[filename];
    }
  }

  if (pandalId) {
    const directWebp = `${pandalId}.webp`;
    if (PANDAL_IMAGES[directWebp]) return PANDAL_IMAGES[directWebp];
    const directJpg = `${pandalId}.jpg`;
    if (PANDAL_IMAGES[directJpg]) return PANDAL_IMAGES[directJpg];
  }

  return null;
}
