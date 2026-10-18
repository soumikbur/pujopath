import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { PANDALS_DATA } from '@/data/pandals';
import { PandalCard } from '@/components/PandalCard';
import { toBengaliDigits } from '@/lib/geo';
import { RouteItinerary } from '@/types';

interface SavedScreenProps {
  navigation: any;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { favorites, customStops, savedRoutes, deleteSavedRoute, loadSavedRoute } = useRoute();

  const allPandals = [...PANDALS_DATA, ...customStops];
  const savedPandals = allPandals.filter((p) => favorites.includes(p.id));

  const handleLoadRoute = (route: RouteItinerary) => {
    loadSavedRoute(route);
    navigation.navigate('Planner');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Page Header */}
        <View style={styles.headerSection}>
          <View style={styles.badgeRow}>
            <Ionicons name="heart" size={13} color="#B42323" />
            <Text style={styles.badgeText}>
              {isBn ? 'সংরক্ষিত তালিকা' : 'MY SAVED COLLECTION'}
            </Text>
          </View>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
            {isBn ? 'সংরক্ষিত প্যান্ডেল ও কাস্টম রুট' : 'Saved Pandals & Custom Routes'}
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
            {isBn
              ? 'আপনার পছন্দের বুকমার্ক করা পূজামণ্ডপ ও তৈরিকৃত পরিক্রমা রুটসমূহ এখানে সংরক্ষিত থাকে।'
              : 'Access your bookmarked pandals and saved route itineraries anytime.'}
          </Text>
        </View>

        {/* =========================================================================
            SECTION 1: SAVED PANDALS
           ========================================================================= */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {isBn
              ? `সংরক্ষিত প্যান্ডেল (${toBengaliDigits(savedPandals.length)})`
              : `Saved Pandals (${savedPandals.length})`}
          </Text>

          {savedPandals.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                  borderColor: isDark ? '#2F2720' : '#EEE8E1',
                },
              ]}
            >
              <Ionicons name="heart" size={32} color="#B42323" style={{ opacity: 0.7, marginBottom: 4 }} />
              <Text style={[styles.emptyCardTitle, { color: colors.textPrimary }]}>
                {isBn ? 'কোনো প্যান্ডেল সংরক্ষিত নেই' : 'No Saved Pandals Yet'}
              </Text>
              <Text style={[styles.emptyCardDesc, { color: colors.textMuted }]}>
                {isBn
                  ? 'প্যান্ডেল কার্ডের হার্ট আইকনে ট্যাপ করে আপনার পছন্দের তালিকা তৈরি করুন।'
                  : 'Tap the heart icon on any pandal card to bookmark your must-visit collection.'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Explore')}
                style={styles.primaryActionBtn}
              >
                <Ionicons name="search" size={15} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>
                  {isBn ? 'প্যান্ডেল দেখুন' : 'Explore Pandals'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardsList}>
              {savedPandals.map((pandal) => (
                <PandalCard
                  key={pandal.id}
                  pandal={pandal}
                  onPress={() => navigation.navigate('PandalDetail', { pandalId: pandal.id })}
                />
              ))}
            </View>
          )}
        </View>

        {/* =========================================================================
            SECTION 2: SAVED ROUTE ITINERARIES
           ========================================================================= */}
        <View style={[styles.sectionContainer, styles.routesSection, { borderTopColor: isDark ? '#2F2720' : '#EEE8E1' }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {isBn
              ? `সংরক্ষিত পরিক্রমা রুট (${toBengaliDigits(savedRoutes.length)})`
              : `Saved Route Itineraries (${savedRoutes.length})`}
          </Text>

          {savedRoutes.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                  borderColor: isDark ? '#2F2720' : '#EEE8E1',
                },
              ]}
            >
              <Ionicons name="navigate" size={32} color="#B42323" style={{ opacity: 0.7, marginBottom: 4 }} />
              <Text style={[styles.emptyCardTitle, { color: colors.textPrimary }]}>
                {isBn ? 'কোনো সংরক্ষিত রুট নেই' : 'No Saved Routes'}
              </Text>
              <Text style={[styles.emptyCardDesc, { color: colors.textMuted }]}>
                {isBn
                  ? 'রুট প্ল্যানারে গিয়ে নতুন পরিক্রমা তৈরি করুন এবং "রুট সংরক্ষণ করুন" ক্লিক করুন।'
                  : 'Create an itinerary in the Route Planner and click "Save Itinerary".'}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Planner')}
                style={[
                  styles.secondaryActionBtn,
                  {
                    backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                    borderColor: isDark ? '#2F2720' : '#EEE8E1',
                  },
                ]}
              >
                <Text style={[styles.secondaryActionBtnText, { color: colors.textPrimary }]}>
                  {isBn ? 'রুট প্ল্যানারে যান' : 'Go to Route Planner'}
                </Text>
                <Ionicons name="arrow-forward" size={15} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.routesList}>
              {savedRoutes.map((route) => (
                <View
                  key={route.id}
                  style={[
                    styles.routeCard,
                    {
                      backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                      borderColor: isDark ? '#2F2720' : '#EEE8E1',
                    },
                  ]}
                >
                  <View style={styles.routeCardInfo}>
                    <Text style={[styles.routeCardName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {isBn && route.nameBn ? route.nameBn : route.name}
                    </Text>
                    <Text style={[styles.routeCardMeta, { color: colors.textMuted }]}>
                      {isBn
                        ? `${toBengaliDigits(route.stops.length)}টি মণ্ডপ • ~${toBengaliDigits(route.estimatedDurationMinutes)} মিনিট`
                        : `${route.stops.length} Pandals • ~${route.estimatedDurationMinutes} mins`}
                    </Text>
                  </View>

                  <View style={styles.routeCardActions}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => handleLoadRoute(route)}
                      style={[
                        styles.loadBtn,
                        {
                          backgroundColor: isDark ? '#341B18' : '#F9E9E7',
                          borderColor: isDark ? '#4A2420' : '#F6CECA',
                        },
                      ]}
                    >
                      <Text style={styles.loadBtnText}>
                        {isBn ? 'লোড করে দেখুন' : 'Load Trail'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => deleteSavedRoute(route.id)}
                      style={styles.deleteBtn}
                      accessibilityLabel="Delete route"
                    >
                      <Ionicons name="trash-outline" size={16} color="#F43F5E" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
  },
  headerSection: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  badgeText: {
    color: '#B42323',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  routesSection: {
    paddingTop: 24,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  cardsList: {
    gap: 12,
  },
  emptyCard: {
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyCardDesc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 16,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#B42323',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#B42323',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  routesList: {
    gap: 12,
  },
  routeCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  routeCardInfo: {
    flex: 1,
  },
  routeCardName: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  routeCardMeta: {
    fontSize: 12,
  },
  routeCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  loadBtnText: {
    color: '#B42323',
    fontSize: 12,
    fontWeight: '800',
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 10,
  },
});
