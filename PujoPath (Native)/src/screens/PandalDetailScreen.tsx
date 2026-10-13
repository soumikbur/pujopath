import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Share,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { PANDALS_DATA } from '@/data/pandals';

interface PandalDetailScreenProps {
  route: any;
  navigation: any;
}

export const PandalDetailScreen: React.FC<PandalDetailScreenProps> = ({ route, navigation }) => {
  const { pandalId } = route.params || {};
  const { colors } = useTheme();
  const { language, t } = useLanguage();
  const { isPandalInRoute, addStop, removeStop, isFavorite, toggleFavorite, customStops } = useRoute();

  const allPandals = [...PANDALS_DATA, ...customStops];
  const pandal = allPandals.find((p) => p.id === pandalId) || allPandals[0];

  const inPlan = isPandalInRoute(pandal.id);
  const favorited = isFavorite(pandal.id);

  const displayName = language === 'bn' ? (pandal.nameBn || pandal.name) : pandal.name;
  const secondaryName = language === 'bn' ? pandal.name : pandal.nameBn;
  const description = language === 'bn' ? (pandal.descriptionBn || pandal.description) : pandal.description;
  const address = language === 'bn' ? (pandal.addressBn || pandal.address) : pandal.address;
  const theme = language === 'bn' ? (pandal.themeBn || pandal.theme) : pandal.theme;

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
        {/* Top Header Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.badgeRow}>
            <View style={[styles.zoneBadge, { backgroundColor: colors.badge }]}>
              <Text style={[styles.zoneText, { color: colors.primary }]}>{pandal.zone}</Text>
            </View>
            {pandal.category && (
              <View style={[styles.catBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.catText, { color: colors.textMuted }]}>{pandal.category}</Text>
              </View>
            )}
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{displayName}</Text>
          {secondaryName && (
            <Text style={[styles.secondaryTitle, { color: colors.textMuted }]}>{secondaryName}</Text>
          )}

          {theme && (
            <View style={[styles.themeBox, { backgroundColor: colors.background }]}>
              <Ionicons name="sparkles" size={14} color={colors.gold} />
              <Text style={[styles.themeText, { color: colors.textSecondary }]}>{theme}</Text>
            </View>
          )}

          {/* Quick Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={() => {
                if (inPlan) removeStop(pandal.id);
                else addStop(pandal);
              }}
              style={[
                styles.actionBtn,
                { backgroundColor: inPlan ? colors.background : colors.primary, borderColor: colors.primary },
              ]}
            >
              <Ionicons
                name={inPlan ? 'checkmark-circle' : 'add-circle'}
                size={18}
                color={inPlan ? colors.primary : '#FFFFFF'}
              />
              <Text style={[styles.actionBtnText, { color: inPlan ? colors.primary : '#FFFFFF' }]}>
                {inPlan ? t('inPlan') : t('addToPlan')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenMaps}
              style={[styles.outlineBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <Ionicons name="map-outline" size={18} color={colors.primary} />
              <Text style={[styles.outlineBtnText, { color: colors.primary }]}>
                {language === 'bn' ? 'ম্যাপে দেখুন' : 'Open in Maps'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleFavorite(pandal.id)}
              style={[styles.iconOnlyBtn, { borderColor: colors.border }]}
            >
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={20}
                color={favorited ? '#E11D48' : colors.textMuted}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={[styles.iconOnlyBtn, { borderColor: colors.border }]}>
              <Ionicons name="share-social-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location & Address Section */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            {language === 'bn' ? 'ঠিকানা ও যোগাযোগ' : 'Address & Location'}
          </Text>

          <View style={styles.infoLine}>
            <Ionicons name="location" size={18} color={colors.primary} />
            <Text style={[styles.infoLineText, { color: colors.textSecondary }]}>{address}</Text>
          </View>

          {pandal.metroLinks && pandal.metroLinks.length > 0 && (
            <View style={[styles.metroCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={[styles.metroIconBox, { backgroundColor: colors.primary }]}>
                <Ionicons name="subway" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.metroInfo}>
                <Text style={[styles.metroStation, { color: colors.text }]}>
                  {pandal.metroLinks[0].stationName}
                </Text>
                <Text style={[styles.metroDistance, { color: colors.textMuted }]}>
                  {(pandal.metroLinks[0].walkingDistanceMeters / 1000).toFixed(1)} km • ~{pandal.metroLinks[0].walkingDurationMinutes} min walk
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Cultural Description Section */}
        {description && (
          <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              {language === 'bn' ? 'ঐতিহ্য ও বিবরণ' : 'Heritage & History'}
            </Text>
            <Text style={[styles.descText, { color: colors.textSecondary }]}>{description}</Text>
          </View>
        )}

        {/* Visiting Guidelines */}
        <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            {language === 'bn' ? 'দর্শন নির্দেশিকা' : 'Visiting Guidelines'}
          </Text>

          {pandal.openingTime && pandal.closingTime && (
            <View style={styles.guidelineRow}>
              <Ionicons name="time-outline" size={16} color={colors.secondary} />
              <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>
                Timings: {pandal.openingTime} – {pandal.closingTime}
              </Text>
            </View>
          )}

          {pandal.crowdLevel && (
            <View style={styles.guidelineRow}>
              <Ionicons name="people-outline" size={16} color={colors.primary} />
              <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>
                Expected Crowd: {pandal.crowdLevel}
              </Text>
            </View>
          )}

          {pandal.facilities?.wheelchairAccessible && (
            <View style={styles.guidelineRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.gold} />
              <Text style={[styles.guidelineText, { color: colors.textSecondary }]}>
                Wheelchair Accessible Entrance
              </Text>
            </View>
          )}
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
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  zoneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  zoneText: {
    fontSize: 11,
    fontWeight: '700',
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catText: {
    fontSize: 11,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  secondaryTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  themeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    marginBottom: 14,
  },
  themeText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  outlineBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  outlineBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  iconOnlyBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoLine: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  infoLineText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  metroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
  },
  metroIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metroInfo: {
    flex: 1,
  },
  metroStation: {
    fontSize: 13,
    fontWeight: '700',
  },
  metroDistance: {
    fontSize: 11,
    marginTop: 2,
  },
  descText: {
    fontSize: 13,
    lineHeight: 20,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  guidelineText: {
    fontSize: 13,
  },
});
