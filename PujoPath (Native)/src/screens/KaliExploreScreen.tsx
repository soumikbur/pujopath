import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';
import { KALI_TEMPLES_DATA, KaliTemple } from '@/data/pandals/kaliTemples';

interface KaliExploreScreenProps {
  navigation: any;
}

export const KaliExploreScreen: React.FC<KaliExploreScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, tabScrollBottomPadding } = useResponsive();

  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = useMemo(
    () => [
      { id: 'All', label: isBn ? 'সকল তীর্থক্ষেত্র' : 'All Sacred Sites' },
      { id: 'Historic Shaktipeeth', label: isBn ? 'মহাপীঠ' : 'Shaktipeeths' },
      { id: 'Heritage Mandir', label: isBn ? 'বনেদি মন্দির' : 'Heritage Mandirs' },
      { id: 'Riverside Shrine', label: isBn ? 'গঙ্গাতীরবর্তী' : 'Riverside Shrines' },
      { id: 'Celebrated Pandal', label: isBn ? 'বিখ্যাত সর্বজনীন' : 'Celebrated Pandals' },
    ],
    [isBn]
  );

  const filteredTemples = useMemo(() => {
    let list = [...KALI_TEMPLES_DATA];
    if (selectedFilter !== 'All') {
      list = list.filter((t) => t.category === selectedFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.nameBn.includes(q) ||
          t.zone.toLowerCase().includes(q) ||
          t.zoneBn.includes(q) ||
          t.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedFilter, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
            paddingBottom: tabScrollBottomPadding + 28,
            maxWidth: isLandscape ? 980 : undefined,
            alignSelf: isLandscape ? 'center' : undefined,
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header intro */}
        <View style={styles.headerSection}>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
            {isBn ? 'ঐতিহাসিক কালীক্ষেত্র ও পুণ্যতীর্থ' : 'Historic Kali Shrines & Pandals'}
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
            {isBn
              ? 'কালীঘাট মহাপীঠ থেকে রানী রাসমণির দক্ষিণেশ্বর ও বারাসাতের বিশ্বখ্যাত আলোকসজ্জা — বঙ্গভূমির জাগ্রত কালী সাধনার পূর্ণ বিবরণ।'
              : 'Discover revered 51 Shaktipeeths, centuries-old heritage shrines, and celebrated community Kali Pandals across Bengal.'}
          </Text>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color={isDark ? '#A89E95' : '#665A54'}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder={isBn ? 'মন্দির বা এলাকার নাম খুঁজুন...' : 'Search sacred temples or zones...'}
            placeholderTextColor={isDark ? '#8A827A' : '#998D85'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {filterOptions.map((opt) => {
            const isSelected = selectedFilter === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setSelectedFilter(opt.id)}
                activeOpacity={0.8}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                      ? colors.surface
                      : '#FFFFFF',
                    borderColor: isSelected
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : isDark
                        ? colors.textSecondary
                        : colors.textPrimary,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Temples List */}
        <View style={styles.templesList}>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {isBn
              ? `${filteredTemples.length}টি ঐতিহাসিক ক্ষেত্র প্রদর্শিত`
              : `Showing ${filteredTemples.length} verified sacred sites`}
          </Text>

          {filteredTemples.map((temple) => (
            <View
              key={temple.id}
              style={[
                styles.templeCard,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Card Image Banner */}
              <View style={styles.cardImageContainer}>
                <Image source={temple.image} style={styles.cardImage} resizeMode="cover" />
                <View style={styles.cardImageOverlay} />
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {isBn ? temple.categoryBn : temple.category}
                  </Text>
                </View>
                <View style={styles.zoneBadge}>
                  <Text style={styles.zoneBadgeText}>
                    {isBn ? temple.zoneBn : temple.zone}
                  </Text>
                </View>
              </View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                <Text style={[styles.templeName, { color: colors.textPrimary }]}>
                  {isBn ? temple.nameBn : temple.name}
                </Text>

                <View style={styles.deityRow}>
                  <Ionicons name="sparkles" size={13} color="#9333EA" />
                  <Text style={styles.deityText} numberOfLines={1}>
                    {isBn ? temple.deityFormBn : temple.deityForm}
                  </Text>
                </View>

                {/* History Paragraph */}
                <Text
                  style={[styles.historyText, { color: colors.textSecondary }]}
                  numberOfLines={4}
                >
                  {isBn ? temple.historyBn : temple.history}
                </Text>

                {/* Dipanwita Rituals Box */}
                <View
                  style={[
                    styles.ritualsBox,
                    {
                      backgroundColor: isDark ? '#2D1236' : '#FAF5FF',
                      borderColor: isDark ? '#4C1D58' : '#F3E8FF',
                    },
                  ]}
                >
                  <View style={styles.ritualsHeader}>
                    <Ionicons name="flame" size={12} color="#FBBF24" />
                    <Text style={styles.ritualsTitle}>
                      {isBn ? 'দীপান্বিতা অমাবস্যা রীতিনীতি' : 'Dipanwita Amavasya Rituals'}
                    </Text>
                  </View>
                  <Text style={styles.ritualsDesc}>
                    {isBn ? temple.dipanwitaRitualsBn : temple.dipanwitaRituals}
                  </Text>
                </View>

                {/* Metro Connectivity & Address */}
                {temple.nearestMetro && (
                  <View style={styles.metroRow}>
                    <Ionicons name="subway-outline" size={13} color="#2563EB" />
                    <Text style={[styles.metroText, { color: colors.textPrimary }]}>
                      {isBn ? temple.nearestMetroBn : temple.nearestMetro}
                    </Text>
                  </View>
                )}

                <View style={styles.timingRow}>
                  <Ionicons name="time-outline" size={13} color="#D97706" />
                  <Text style={[styles.timingText, { color: colors.textSecondary }]}>
                    {isBn ? temple.specialTimingBn : temple.specialTiming}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
    paddingTop: 12,
  },
  headerSection: {
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  filterScroll: {
    marginBottom: 14,
  },
  filterContainer: {
    gap: 8,
    paddingRight: 10,
  },
  filterPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
  },
  templesList: {
    gap: 14,
  },
  resultsCount: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  templeCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(28, 16, 38, 0.35)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(45, 18, 54, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  categoryBadgeText: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '800',
  },
  zoneBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  zoneBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardContent: {
    padding: 14,
  },
  templeName: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  deityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  deityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9333EA',
  },
  historyText: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 10,
  },
  ritualsBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  ritualsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  ritualsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  ritualsDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#7C3AED',
  },
  metroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metroText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timingText: {
    fontSize: 11,
  },
});
