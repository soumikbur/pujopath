import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pandal } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getPandalImageSource } from '@/lib/utils/pandalImages';
import { formatDistance, toBengaliDigits } from '@/lib/geo';
import { motion } from '@/theme/motion';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface PandalCardProps {
  pandal: Pandal;
  onPress: () => void;
  style?: any;
}

const PandalCardComponent: React.FC<PandalCardProps> = ({ pandal, onPress, style }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isPandalInRoute, addStop, removeStop, isFavorite, toggleFavorite } = useRoute();
  const reduceMotion = useReducedMotion();

  const favScale = useRef(new Animated.Value(1)).current;
  const routeScale = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const inPlan = isPandalInRoute(pandal.id);
  const favorited = isFavorite(pandal.id);

  const handleToggleFav = () => {
    if (!reduceMotion) {
      Animated.sequence([
        Animated.spring(favScale, {
          toValue: 1.28,
          tension: 320,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.spring(favScale, {
          toValue: 1,
          tension: 260,
          friction: 18,
          useNativeDriver: true,
        }),
      ]).start();
    }
    toggleFavorite(pandal.id);
  };

  const handleToggleRoute = () => {
    if (!reduceMotion) {
      Animated.sequence([
        Animated.spring(routeScale, {
          toValue: 0.88,
          tension: 320,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.spring(routeScale, {
          toValue: 1,
          tension: 260,
          friction: 20,
          useNativeDriver: true,
        }),
      ]).start();
    }
    if (inPlan) {
      removeStop(pandal.id);
    } else {
      addStop(pandal);
    }
  };

  const displayName = isBn ? (pandal.nameBn || pandal.name) : pandal.name;
  const secondaryName = isBn ? pandal.name : pandal.nameBn;
  const locality = isBn ? (pandal.localityBn || pandal.locality) : pandal.locality;
  const primaryMetro = pandal.metroLinks?.[0];
  const displayMetroName = isBn
    ? (primaryMetro?.stationNameBn || primaryMetro?.stationName)
    : primaryMetro?.stationName;

  const displayRating =
    typeof pandal.rating === 'number' && pandal.rating > 0
      ? isBn
        ? toBengaliDigits(pandal.rating.toFixed(1))
        : pandal.rating.toFixed(1)
      : null;

  const imageSource = getPandalImageSource(pandal.imageUrl, pandal.id);
  const hasPhoto = Boolean(imageSource);

  return (
    <AnimatedPressable
      preset="card"
      scaleTo={0.975}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
          borderColor: isDark ? '#2F2720' : '#EEE8E1',
        },
        style,
      ]}
    >
      {/* 16:9 Hero Image or Honest Unavailable Banner */}
      <View style={styles.heroContainer}>
        {hasPhoto ? (
          <>
            <Animated.Image
              source={imageSource!}
              style={[styles.heroImage, { opacity: imageOpacity }]}
              resizeMode="cover"
              onLoad={() => {
                if (reduceMotion) {
                  imageOpacity.setValue(1);
                } else {
                  Animated.timing(imageOpacity, {
                    toValue: 1,
                    duration: motion.duration.quick,
                    useNativeDriver: true,
                  }).start();
                }
              }}
            />
            <View style={styles.imageDarkOverlay} />

            {/* Verified 2025 Photo Badge on Bottom-Left of Photo */}
            <View style={styles.photoYearBadge}>
              <Ionicons name="camera" size={11} color="#FFFFFF" />
              <Text style={styles.photoYearText}>
                {isBn ? '২০২৫ ছবি' : '2025 Photo'}
              </Text>
            </View>

            {/* Title Overlaid on Photo */}
            <View style={styles.titleOverlay}>
              <Text style={styles.titleOnImage} numberOfLines={1}>
                {displayName}
              </Text>
            </View>
          </>
        ) : (
          <View
            style={[
              styles.unavailableContainer,
              { backgroundColor: isDark ? '#201A14' : '#F7F2EB' },
            ]}
          >
            <View style={styles.watermarkIconBox}>
              <Ionicons
                name="business"
                size={68}
                color={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
              />
            </View>

            <View style={styles.unavailableInfo}>
              <View
                style={[
                  styles.cameraOffCircle,
                  { backgroundColor: isDark ? '#2D241C' : '#E8DED2' },
                ]}
              >
                <Ionicons
                  name="camera-outline"
                  size={15}
                  color={isDark ? '#A5998D' : '#7D7165'}
                />
              </View>
              <Text
                style={[
                  styles.unavailableTitle,
                  { color: isDark ? '#B3A699' : '#63574C' },
                ]}
              >
                {isBn ? '২০২৫ ছবি অপ্রাপ্য' : '2025 PHOTO UNAVAILABLE'}
              </Text>
              <Text
                style={[
                  styles.unavailableSubtitle,
                  { color: isDark ? '#8F8275' : '#85796F' },
                ]}
              >
                {isBn ? 'যাচাইকৃত তালিকা • গবেষণা চলছে' : 'Verified Listing • Research Ongoing'}
              </Text>
            </View>

            <View style={styles.unavailableTitleRow}>
              <Text
                style={[styles.titleWithoutImage, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {displayName}
              </Text>
            </View>
          </View>
        )}

        {/* Top-Left Category & Zone Badges */}
        <View style={styles.topLeftBadges}>
          <View
            style={[
              styles.zonePill,
              {
                backgroundColor: isDark ? 'rgba(26, 22, 19, 0.92)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
              },
            ]}
          >
            <Text style={[styles.zonePillText, { color: colors.textPrimary }]}>
              {pandal.zone}
            </Text>
          </View>

          {Boolean(pandal.isBonediBari || pandal.category === 'Bonedi Bari') && (
            <View style={styles.bonediBadge}>
              <Text style={styles.bonediBadgeText}>
                {isBn ? 'বনেদি বাড়ি' : 'Bonedi Bari'}
              </Text>
            </View>
          )}

          {pandal.isHeritage && !pandal.isBonediBari && (
            <View style={styles.heritageBadge}>
              <Text style={styles.heritageBadgeText}>
                {isBn ? 'সাবেকি' : 'Heritage'}
              </Text>
            </View>
          )}
        </View>

        {/* Top-Right Favorite Heart Button */}
        <AnimatedPressable
          preset="icon"
          scaleTo={0.88}
          onPress={handleToggleFav}
          style={[
            styles.favButton,
            {
              backgroundColor: favorited
                ? '#B42323'
                : isDark
                ? 'rgba(0,0,0,0.65)'
                : 'rgba(255,255,255,0.92)',
              borderColor: favorited ? '#B42323' : isDark ? '#3D332A' : '#EEE8E1',
            },
          ]}
          accessibilityLabel={favorited ? 'Remove from saved' : 'Save pandal'}
        >
          <Animated.View style={{ transform: [{ scale: favScale }] }}>
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={16}
              color={favorited ? '#FFFFFF' : isDark ? '#EDE5DC' : '#625B55'}
            />
          </Animated.View>
        </AnimatedPressable>
      </View>

      {/* Info Content Section */}
      <View style={styles.contentSection}>
        {/* Locality & Rating Row */}
        <View style={styles.localityRatingRow}>
          <View style={styles.localityGroup}>
            <Ionicons name="location" size={14} color="#B42323" style={{ marginRight: 4 }} />
            <Text
              style={[styles.localityText, { color: isDark ? '#C4B9AE' : '#4A423D' }]}
              numberOfLines={1}
            >
              {locality}
            </Text>
          </View>

          {displayRating ? (
            <View style={styles.ratingGroup}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingText}>{displayRating}</Text>
            </View>
          ) : (
            (pandal.coordinateConfidence === 'Needs verification' ||
              pandal.hasUnresolvedCoordinates) && (
              <View
                style={[
                  styles.unverifiedBadge,
                  {
                    backgroundColor: isDark ? 'rgba(77, 34, 30, 0.4)' : '#FFFBEB',
                    borderColor: isDark ? '#4D221E' : '#FDE68A',
                  },
                ]}
              >
                <Text style={styles.unverifiedText}>
                  {isBn ? 'যাচাই প্রয়োজন' : 'Unverified'}
                </Text>
              </View>
            )
          )}
        </View>

        {/* Nearest Metro Station */}
        {primaryMetro && (
          <View style={styles.metroRow}>
            <Ionicons name="subway" size={13} color="#0284C7" style={{ marginRight: 5 }} />
            <Text
              style={[styles.metroText, { color: isDark ? '#A89E95' : '#776D65' }]}
              numberOfLines={1}
            >
              {displayMetroName} {isBn ? 'মেট্রো' : 'Metro'} (
              {formatDistance(primaryMetro.walkingDistanceMeters / 1000, language)})
            </Text>
          </View>
        )}

        {/* Bonedi Bari Ancestral Info */}
        {pandal.bonediBariInfo && (
          <View style={styles.bonediRow}>
            <Text
              style={[styles.ancestralName, { color: isDark ? '#FDE68A' : '#78350F' }]}
              numberOfLines={1}
            >
              {isBn
                ? pandal.bonediBariInfo.ancestralHouseNameBn ||
                  pandal.bonediBariInfo.ancestralHouseName
                : pandal.bonediBariInfo.ancestralHouseName}
            </Text>
            <View
              style={[
                styles.accessBadge,
                pandal.bonediBariInfo.visitorAccessStatus === 'Visitor access confirmed'
                  ? {
                      backgroundColor: isDark ? 'rgba(6, 78, 59, 0.4)' : '#ECFDF5',
                      borderColor: isDark ? '#065F46' : '#A7F3D0',
                    }
                  : {
                      backgroundColor: isDark ? 'rgba(120, 53, 15, 0.4)' : '#FFFBEB',
                      borderColor: isDark ? '#92400E' : '#FDE68A',
                    },
              ]}
            >
              <Text
                style={[
                  styles.accessText,
                  {
                    color:
                      pandal.bonediBariInfo.visitorAccessStatus === 'Visitor access confirmed'
                        ? '#059669'
                        : '#D97706',
                  },
                ]}
              >
                {isBn
                  ? pandal.bonediBariInfo.visitorAccessStatusBn
                  : pandal.bonediBariInfo.visitorAccessStatus}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Card Action Footer */}
      <View style={[styles.cardFooter, { borderTopColor: isDark ? '#2F2720' : '#EEE8E1' }]}>
        <AnimatedPressable preset="button" scaleTo={0.96} onPress={onPress}>
          <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
            {isBn ? 'বিস্তারিত দেখুন →' : 'View Details →'}
          </Text>
        </AnimatedPressable>

        <AnimatedPressable
          preset="button"
          scaleTo={0.92}
          onPress={handleToggleRoute}
        >
          <Animated.View
            style={[
              styles.routeBtn,
              { transform: [{ scale: routeScale }] },
              inPlan
                ? {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  }
                : {
                    backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                    borderColor: isDark ? '#2F2720' : '#EEE8E1',
                  },
            ]}
          >
            <Ionicons
              name={inPlan ? 'checkmark' : 'navigate'}
              size={13}
              color={inPlan ? '#FFFFFF' : colors.primary}
            />
            <Text
              style={[
                styles.routeBtnText,
                { color: inPlan ? '#FFFFFF' : (isDark ? '#A89E95' : '#625B55') },
              ]}
            >
              {inPlan
                ? isBn
                  ? 'যোগ হয়েছে'
                  : 'Added'
                : isBn
                ? 'রুট যোগ'
                : 'Add Route'}
            </Text>
          </Animated.View>
        </AnimatedPressable>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  heroContainer: {
    width: '100%',
    height: 175,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageDarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  photoYearBadge: {
    position: 'absolute',
    left: 12,
    bottom: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 78, 59, 0.85)',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  photoYearText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  titleOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 8,
  },
  titleOnImage: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  unavailableContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    padding: 12,
    position: 'relative',
  },
  watermarkIconBox: {
    position: 'absolute',
    right: 16,
    bottom: 10,
  },
  unavailableInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  cameraOffCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  unavailableTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  unavailableSubtitle: {
    fontSize: 9,
    marginTop: 1,
  },
  unavailableTitleRow: {
    marginTop: 8,
  },
  titleWithoutImage: {
    fontSize: 16,
    fontWeight: '900',
  },
  topLeftBadges: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    maxWidth: '75%',
  },
  zonePill: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
  },
  zonePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  bonediBadge: {
    backgroundColor: '#800020',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  bonediBadgeText: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '900',
  },
  heritageBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  heritageBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  favButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  localityRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  localityGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  localityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '800',
  },
  unverifiedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  unverifiedText: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '700',
  },
  metroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metroText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bonediRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  ancestralName: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  accessBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  accessText: {
    fontSize: 9,
    fontWeight: '800',
  },
  cardFooter: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '800',
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  routeBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});

export const PandalCard = React.memo(PandalCardComponent);
