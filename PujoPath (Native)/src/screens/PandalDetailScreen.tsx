import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Share,
  Animated,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { PANDALS_DATA } from '@/data/pandals';
import { VERIFIED_PHOTOS_REGISTRY } from '@/data/pandals/photoRegistry';
import { getPandalImageSource } from '@/lib/utils/pandalImages';
import { formatDistance, toBengaliDigits } from '@/lib/geo';

interface PandalDetailScreenProps {
  route: any;
  navigation: any;
}

export const PandalDetailScreen: React.FC<PandalDetailScreenProps> = ({ route, navigation }) => {
  const { pandalId } = route.params || {};
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isPandalInRoute, addStop, removeStop, isFavorite, toggleFavorite, customStops } = useRoute();
  const allPandals = [...PANDALS_DATA, ...customStops];
  const pandal = allPandals.find((p) => p.id === pandalId) || allPandals[0];

  const inPlan = isPandalInRoute(pandal.id);
  const favorited = isFavorite(pandal.id);

  const reducedMotion = useReducedMotion();
  const favScale = React.useRef(new Animated.Value(1)).current;
  const routeScale = React.useRef(new Animated.Value(1)).current;

  const handleToggleFav = () => {
    if (!reducedMotion) {
      favScale.setValue(0.78);
      Animated.spring(favScale, {
        toValue: 1,
        friction: 4,
        tension: 160,
        useNativeDriver: true,
      }).start();
    }
    toggleFavorite(pandal.id);
  };

  const handleToggleRoute = () => {
    if (!reducedMotion) {
      routeScale.setValue(0.92);
      Animated.spring(routeScale, {
        toValue: 1,
        friction: 5,
        tension: 160,
        useNativeDriver: true,
      }).start();
    }
    if (inPlan) {
      removeStop(pandal.id);
    } else {
      addStop(pandal);
    }
  };

  const displayName = isBn ? (pandal.nameBn || pandal.name) : pandal.name;
  const secondaryName = isBn ? pandal.name : pandal.nameBn;
  const description = isBn ? (pandal.descriptionBn || pandal.description) : pandal.description;
  const address = isBn ? (pandal.addressBn || pandal.address) : pandal.address;
  const theme = isBn ? (pandal.themeBn || pandal.theme) : pandal.theme;
  const primaryMetro = pandal.metroLinks?.[0];
  const displayMetroName = isBn
    ? (primaryMetro?.stationNameBn || primaryMetro?.stationName)
    : primaryMetro?.stationName;

  const imageSource = getPandalImageSource(pandal.imageUrl, pandal.id);
  const photoMeta = VERIFIED_PHOTOS_REGISTRY[pandal.id];
  const hasVerifiedPhoto = Boolean(imageSource);

  const handleOpenMaps = async () => {
    const lat = pandal.latitude;
    const lng = pandal.longitude;
    const label = encodeURIComponent(pandal.name);

    const scheme = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`,
    });
    const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    if (scheme) {
      const supported = await Linking.canOpenURL(scheme);
      if (supported) {
        await Linking.openURL(scheme);
        return;
      }
    }
    await Linking.openURL(webUrl);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Visiting ${pandal.name} (${pandal.locality}, ${pandal.zone}) in Kolkata Durga Puja! Explore routes on PujoPath: https://soumikbur.github.io/pujopath/pandals/${pandal.slug}`,
      });
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Header with 16:9 Image or Unavailable Banner */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
              borderColor: isDark ? '#2F2720' : '#EEE8E1',
            },
          ]}
        >
          <View style={styles.heroMediaContainer}>
            {hasVerifiedPhoto ? (
              <>
                <Image source={imageSource!} style={styles.heroImg} resizeMode="cover" />
                <View style={styles.heroDarkOverlay} />

                {/* Badges on Top-Left */}
                <View style={styles.heroTopBadges}>
                  <View style={styles.heroZoneBadge}>
                    <Text style={styles.heroZoneBadgeText}>{pandal.zone}</Text>
                  </View>
                  <View style={styles.heroSeasonBadge}>
                    <Ionicons name="camera" size={11} color="#FFFFFF" />
                    <Text style={styles.heroSeasonBadgeText}>
                      {isBn ? '২০২৫ মৌসুমের ছবি' : '2025 Season Photo'}
                    </Text>
                  </View>
                  {pandal.isBonediBari && (
                    <View style={styles.heroBonediBadge}>
                      <Text style={styles.heroBonediBadgeText}>
                        {isBn ? '🏛️ বনেদি বাড়ি' : '🏛️ Bonedi Bari'}
                      </Text>
                    </View>
                  )}
                  {pandal.isHeritage && !pandal.isBonediBari && (
                    <View style={styles.heroHeritageBadge}>
                      <Text style={styles.heroHeritageBadgeText}>
                        {isBn ? 'ঐতিহ্যবাহী সাবেকি' : 'Heritage Sabeki'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Title & Address on Photo */}
                <View style={styles.heroBottomContent}>
                  <Text style={styles.heroTitle} numberOfLines={2}>
                    {displayName}
                  </Text>
                  <View style={styles.heroAddressRow}>
                    <Ionicons name="location" size={13} color="#FF6B6B" />
                    <Text style={styles.heroAddressText} numberOfLines={1}>
                      {address}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <View
                style={[
                  styles.heroUnavailableContainer,
                  { backgroundColor: isDark ? '#201A14' : '#F7F2EB' },
                ]}
              >
                <View style={styles.heroWatermark}>
                  <Ionicons
                    name="business"
                    size={84}
                    color={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                  />
                </View>

                <View style={styles.heroTopBadges}>
                  <View style={styles.heroZoneBadge}>
                    <Text style={styles.heroZoneBadgeText}>{pandal.zone}</Text>
                  </View>
                  {pandal.isBonediBari && (
                    <View style={styles.heroBonediBadge}>
                      <Text style={styles.heroBonediBadgeText}>
                        {isBn ? '🏛️ বনেদি বাড়ি' : '🏛️ Bonedi Bari'}
                      </Text>
                    </View>
                  )}
                  {pandal.isHeritage && !pandal.isBonediBari && (
                    <View style={styles.heroHeritageBadge}>
                      <Text style={styles.heroHeritageBadgeText}>
                        {isBn ? 'ঐতিহ্যবাহী সাবেকি' : 'Heritage Sabeki'}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.heroUnavailableCenter}>
                  <View
                    style={[
                      styles.heroCameraOffBox,
                      { backgroundColor: isDark ? '#2D241C' : '#E8DED2' },
                    ]}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={18}
                      color={isDark ? '#A5998D' : '#7D7165'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.heroUnavailableTitle,
                      { color: isDark ? '#B3A699' : '#63574C' },
                    ]}
                  >
                    {isBn ? '২০২৫ ছবি অপ্রাপ্য' : '2025 PHOTO UNAVAILABLE'}
                  </Text>
                  <Text
                    style={[
                      styles.heroUnavailableSub,
                      { color: isDark ? '#8F8275' : '#85796F' },
                    ]}
                  >
                    {isBn ? 'যাচাইকৃত তালিকা • গবেষণা চলছে' : 'Verified Listing • Research Ongoing'}
                  </Text>
                </View>

                <View style={styles.heroUnavailableBottom}>
                  <Text
                    style={[styles.heroTitleWithoutImage, { color: colors.textPrimary }]}
                    numberOfLines={2}
                  >
                    {displayName}
                  </Text>
                  <View style={styles.heroAddressRow}>
                    <Ionicons name="location" size={13} color="#B42323" />
                    <Text
                      style={[styles.heroAddressTextDark, { color: colors.textMuted }]}
                      numberOfLines={1}
                    >
                      {address}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Photographic Attribution Bar */}
          {photoMeta && photoMeta.isAvailable && (
            <View
              style={[
                styles.attributionBar,
                {
                  backgroundColor: isDark ? '#1F1914' : '#F8F5F0',
                  borderTopColor: isDark ? '#2F2720' : '#EEE8E1',
                },
              ]}
            >
              <View style={styles.attribItem}>
                <Ionicons name="camera" size={12} color="#059669" />
                <Text style={[styles.attribLabel, { color: colors.textPrimary }]}>
                  {isBn ? 'যাচাইকৃত ছবি' : 'Verified Photograph'} ({photoMeta.photoYear})
                </Text>
              </View>
              {photoMeta.photographer && (
                <Text style={[styles.attribText, { color: colors.textMuted }]}>
                  • {isBn ? 'আলোকচিত্রী:' : 'Photographer:'} {photoMeta.photographer}
                </Text>
              )}
              {photoMeta.license && (
                <View
                  style={[
                    styles.licenseBadge,
                    { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' },
                  ]}
                >
                  <Text style={[styles.licenseText, { color: colors.textSecondary }]}>
                    {photoMeta.license}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Action Row */}
          <View style={[styles.actionRow, { borderTopColor: isDark ? '#2F2720' : '#EEE8E1' }]}>
            <Animated.View style={{ transform: [{ scale: routeScale }] }}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleToggleRoute}
                style={[
                  styles.primaryActionBtn,
                  inPlan
                    ? {
                        backgroundColor: isDark ? '#341B18' : '#FDEEEE',
                        borderColor: '#B42323',
                      }
                    : {
                        backgroundColor: '#B42323',
                        borderColor: '#B42323',
                      },
                ]}
              >
                <Ionicons
                  name={inPlan ? 'checkmark-circle' : 'add-circle'}
                  size={16}
                  color={inPlan ? '#B42323' : '#FFFFFF'}
                />
                <Text
                  style={[
                    styles.primaryActionText,
                    { color: inPlan ? '#B42323' : '#FFFFFF' },
                  ]}
                >
                  {inPlan
                    ? isBn
                      ? 'রুটে সংরক্ষিত'
                      : 'In Route'
                    : isBn
                    ? '+ রুটে যোগ করুন'
                    : '+ Add to Route'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOpenMaps}
              style={[
                styles.secondaryActionBtn,
                {
                  backgroundColor: isDark ? '#201C18' : '#F5F1EB',
                  borderColor: isDark ? '#3D332A' : '#DED6CE',
                },
              ]}
            >
              <Ionicons name="map-outline" size={16} color="#B42323" />
              <Text style={[styles.secondaryActionText, { color: colors.textPrimary }]}>
                {isBn ? 'ম্যাপে দেখুন' : 'Directions'}
              </Text>
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: favScale }] }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleToggleFav}
                style={[
                  styles.iconActionBtn,
                  {
                    backgroundColor: favorited
                      ? '#B42323'
                      : isDark
                      ? '#201C18'
                      : '#F5F1EB',
                    borderColor: favorited ? '#B42323' : isDark ? '#3D332A' : '#DED6CE',
                  },
                ]}
                accessibilityLabel="Save pandal"
              >
                <Ionicons
                  name={favorited ? 'heart' : 'heart-outline'}
                  size={18}
                  color={favorited ? '#FFFFFF' : isDark ? '#EDE5DC' : '#625B55'}
                />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleShare}
              style={[
                styles.iconActionBtn,
                {
                  backgroundColor: isDark ? '#201C18' : '#F5F1EB',
                  borderColor: isDark ? '#3D332A' : '#DED6CE',
                },
              ]}
              accessibilityLabel="Share pandal"
            >
              <Ionicons name="share-social-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Section */}
        {theme && (
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: isDark ? '#2F2720' : '#EEE8E1',
              },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="sparkles" size={16} color="#D97706" />
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                {isBn ? 'ভাবনা ও শিল্পকলা' : 'Theme & Art Concept'}
              </Text>
            </View>
            <Text style={[styles.sectionBodyText, { color: colors.textSecondary }]}>
              {theme}
            </Text>
          </View>
        )}

        {/* Nearest Metro Station */}
        {primaryMetro && (
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: isDark ? '#2F2720' : '#EEE8E1',
              },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="subway" size={16} color="#0284C7" />
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                {isBn ? 'নিকটবর্তী মেট্রো স্টেশন' : 'Nearest Metro Station'}
              </Text>
            </View>
            <View
              style={[
                styles.metroBox,
                {
                  backgroundColor: isDark ? '#201C18' : '#F5F1EB',
                  borderColor: isDark ? '#3D332A' : '#DED6CE',
                },
              ]}
            >
              <View style={styles.metroIconBg}>
                <Ionicons name="train" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.metroTextCol}>
                <Text style={[styles.metroStationTitle, { color: colors.textPrimary }]}>
                  {displayMetroName} {isBn ? 'মেট্রো স্টেশন' : 'Metro Station'}
                </Text>
                <Text style={[styles.metroWalkText, { color: colors.textMuted }]}>
                  {formatDistance(primaryMetro.walkingDistanceMeters / 1000, language)} • ~
                  {isBn
                    ? toBengaliDigits(primaryMetro.walkingDurationMinutes)
                    : primaryMetro.walkingDurationMinutes}{' '}
                  {isBn ? 'মিনিটের হাঁটা পথ' : 'min walk'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Heritage & Description Section */}
        {description && (
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: isDark ? '#2F2720' : '#EEE8E1',
              },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="book-outline" size={16} color="#B42323" />
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                {isBn ? 'ঐতিহ্য ও বিবরণ' : 'Heritage & History'}
              </Text>
            </View>
            <Text style={[styles.sectionBodyText, { color: colors.textSecondary }]}>
              {description}
            </Text>
          </View>
        )}

        {/* Bonedi Bari Special Details */}
        {pandal.bonediBariInfo && (
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: isDark ? '#2F2720' : '#EEE8E1',
              },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="business" size={16} color="#800020" />
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                {isBn ? 'বনেদি বাড়ির তথ্য' : 'Bonedi Bari Details'}
              </Text>
            </View>
            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                  {isBn ? 'বংশ / পরিবার' : 'Family Lineage'}
                </Text>
                <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
                  {isBn
                    ? pandal.bonediBariInfo.familyLineageBn || pandal.bonediBariInfo.familyLineage
                    : pandal.bonediBariInfo.familyLineage}
                </Text>
              </View>

              {pandal.bonediBariInfo.visitingHours && (
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                    {isBn ? 'দর্শনের সময়' : 'Visiting Hours'}
                  </Text>
                  <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
                    {isBn
                      ? pandal.bonediBariInfo.visitingHoursBn || pandal.bonediBariInfo.visitingHours
                      : pandal.bonediBariInfo.visitingHours}
                  </Text>
                </View>
              )}

              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                  {isBn ? 'দর্শনার্থীদের প্রবেশ' : 'Visitor Access'}
                </Text>
                <Text style={[styles.metaValue, { color: '#059669', fontWeight: '800' }]}>
                  {isBn
                    ? pandal.bonediBariInfo.visitorAccessStatusBn
                    : pandal.bonediBariInfo.visitorAccessStatus}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Visiting Guidelines & Accessibility */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
              borderColor: isDark ? '#2F2720' : '#EEE8E1',
            },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="information-circle-outline" size={16} color="#B42323" />
            <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
              {isBn ? 'দর্শন নির্দেশিকা ও সুবিধা' : 'Visiting Guidelines & Accessibility'}
            </Text>
          </View>

          <View style={styles.guidelinesList}>
            {pandal.openingTime && pandal.closingTime && (
              <View style={styles.guidelineItem}>
                <Ionicons name="time-outline" size={16} color="#D97706" />
                <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>
                  {isBn ? 'সময়সূচি:' : 'Timings:'} {pandal.openingTime} – {pandal.closingTime}
                </Text>
              </View>
            )}

            {pandal.crowdLevel && (
              <View style={styles.guidelineItem}>
                <Ionicons name="people-outline" size={16} color="#B42323" />
                <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>
                  {isBn ? 'ভিড়ের মাত্রা:' : 'Crowd Level:'} {pandal.crowdLevel}
                </Text>
              </View>
            )}

            {pandal.facilities?.wheelchairAccessible && (
              <View style={styles.guidelineItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#059669" />
                <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>
                  {isBn ? 'হুইলচেয়ার সহায়ক প্রবেশপথ উপলব্ধ' : 'Wheelchair Accessible Entrance'}
                </Text>
              </View>
            )}

            {pandal.facilities?.parkingAvailable && (
              <View style={styles.guidelineItem}>
                <Ionicons name="car-outline" size={16} color="#0284C7" />
                <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>
                  {isBn ? 'কাছে পার্কিং সুবিধা রয়েছে' : 'Nearby Parking Available'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
    gap: 16,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  heroMediaContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  heroDarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  heroTopBadges: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    maxWidth: '85%',
    zIndex: 10,
  },
  heroZoneBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  heroZoneBadgeText: {
    color: '#242424',
    fontSize: 11,
    fontWeight: '800',
  },
  heroSeasonBadge: {
    backgroundColor: 'rgba(6, 78, 59, 0.9)',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroSeasonBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  heroBonediBadge: {
    backgroundColor: '#800020',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  heroBonediBadgeText: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '800',
  },
  heroHeritageBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  heroHeritageBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  heroBottomContent: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    gap: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroAddressText: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  heroUnavailableContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 14,
    position: 'relative',
  },
  heroWatermark: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  heroUnavailableCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  heroCameraOffBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroUnavailableTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroUnavailableSub: {
    fontSize: 10,
    marginTop: 2,
  },
  heroUnavailableBottom: {
    marginTop: 10,
    gap: 4,
  },
  heroTitleWithoutImage: {
    fontSize: 22,
    fontWeight: '900',
  },
  heroAddressTextDark: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  attributionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  attribItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attribLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  attribText: {
    fontSize: 11,
  },
  licenseBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  licenseText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  primaryActionText: {
    fontSize: 12,
    fontWeight: '800',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  iconActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionBodyText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
  },
  metroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  metroIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metroTextCol: {
    flex: 1,
  },
  metroStationTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  metroWalkText: {
    fontSize: 12,
    marginTop: 2,
  },
  metaGrid: {
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  guidelinesList: {
    gap: 8,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guidelineText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
