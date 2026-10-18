import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Easing,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PandalService } from '@/lib/services/PandalService';
import { PandalCard } from '@/components/PandalCard';
import { ZoneFilterBar } from '@/components/ZoneFilterBar';
import { CustomStopModal } from '@/components/CustomStopModal';
import { SelectedPandalsBar } from '@/components/SelectedPandalsBar';
import { Pandal, FilterOptions } from '@/types';
import { toBengaliDigits } from '@/lib/geo';

interface AnimatedToggleSwitchProps {
  value: boolean;
  onValueChange: () => void;
  isDark: boolean;
  label: string;
  reduceMotion: boolean;
}

const AnimatedToggleSwitch: React.FC<AnimatedToggleSwitchProps> = ({
  value,
  onValueChange,
  isDark,
  label,
  reduceMotion,
}) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      anim.setValue(value ? 1 : 0);
    } else {
      Animated.timing(anim, {
        toValue: value ? 1 : 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [value, reduceMotion]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onValueChange}
      style={styles.switchRow}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.switchTrack,
          {
            backgroundColor: value
              ? '#B42323'
              : isDark
              ? '#3D332A'
              : '#DED6CE',
            borderColor: value
              ? '#961B1B'
              : isDark
              ? '#524438'
              : '#C7BCAF',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.switchThumb,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
      <Text
        style={[
          styles.switchLabel,
          value
            ? { color: '#B42323', fontWeight: '800' }
            : { color: isDark ? '#C4B9AE' : '#4A423D' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface ExploreScreenProps {
  navigation: any;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { customStops } = useRoute();
  const reduceMotion = useReducedMotion();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('recommended');

  // 5 Feature Filter Switches matching Capacitor PandalFilters
  const [isFeatureFiltersOpen, setIsFeatureFiltersOpen] = useState(true);
  const [bonediBariOnly, setBonediBariOnly] = useState(false);
  const [metroOnly, setMetroOnly] = useState(false);
  const [heritageOnly, setHeritageOnly] = useState(false);
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const isFiltered =
    Boolean(searchQuery.trim()) ||
    selectedZone !== 'All' ||
    bonediBariOnly ||
    metroOnly ||
    heritageOnly ||
    wheelchairOnly ||
    featuredOnly ||
    sortBy !== 'recommended';

  const handleToggleFeatureFilters = () => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setIsFeatureFiltersOpen((prev) => !prev);
  };

  const handleResetFilters = () => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setSearchQuery('');
    setSelectedZone('All');
    setBonediBariOnly(false);
    setMetroOnly(false);
    setHeritageOnly(false);
    setWheelchairOnly(false);
    setFeaturedOnly(false);
    setSortBy('recommended');
  };

  const handleSelectSort = (optId: FilterOptions['sortBy']) => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setSortBy(optId);
    setShowSortModal(false);
  };

  const filteredPandals = useMemo(() => {
    return PandalService.filterPandals(
      {
        searchQuery,
        zone: selectedZone === 'All' ? undefined : (selectedZone as any),
        bonediBariOnly,
        metroAccessibleOnly: metroOnly,
        heritageOnly,
        wheelchairAccessibleOnly: wheelchairOnly,
        featuredOnly,
        sortBy,
      },
      undefined,
      undefined,
      customStops
    );
  }, [
    searchQuery,
    selectedZone,
    bonediBariOnly,
    metroOnly,
    heritageOnly,
    wheelchairOnly,
    featuredOnly,
    sortBy,
    customStops,
  ]);

  const sortOptions = [
    { id: 'recommended', label: isBn ? 'সুপারিশকৃত' : 'Recommended' },
    { id: 'popularity', label: isBn ? 'জনপ্রিয়তা' : 'Most Popular' },
    { id: 'name', label: isBn ? 'নাম অনুযায়ী' : 'Alphabetical' },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.id === sortBy)?.label || (isBn ? 'সুপারিশকৃত' : 'Recommended');

  const renderItem = ({ item }: { item: Pandal }) => (
    <PandalCard
      pandal={item}
      onPress={() => navigation.navigate('PandalDetail', { pandalId: item.id })}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredPandals}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <View style={styles.directoryBadge}>
                <Ionicons name="search" size={13} color="#B42323" />
                <Text style={styles.directoryBadgeText}>
                  {isBn ? 'প্যান্ডেল সন্ধান' : 'PANDAL DIRECTORY'}
                </Text>
              </View>
              <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
                {isBn ? 'প্যান্ডেল খুঁজুন' : 'Explore Kolkata Pandals'}
              </Text>
              <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
                {isBn
                  ? 'নাম, এলাকা, থিম বা নিকটতম মেট্রো স্টেশন দিয়ে কলকাতার সেরা পূজামণ্ডপ খুঁজুন।'
                  : "Find Kolkata's best puja pandals by name, area, theme, or nearest metro station."}
              </Text>
            </View>

            {/* Filter Box Wrapper */}
            <View
              style={[
                styles.filterCard,
                {
                  backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                  borderColor: isDark ? '#2F2720' : '#EEE8E1',
                },
              ]}
            >
              {/* Search Input Bar */}
              <View
                style={[
                  styles.searchBox,
                  {
                    backgroundColor: isDark ? '#14110E' : '#FCFAF7',
                    borderColor: isDark ? '#2F2720' : '#EEE8E1',
                  },
                ]}
              >
                <Ionicons name="search" size={18} color="#8A8179" style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { color: colors.textPrimary }]}
                  placeholder={
                    isBn
                      ? 'প্যান্ডেলের নাম, বনেদি বাড়ি, এলাকা, থিম বা মেট্রো...'
                      : 'Search pandals by name, Bonedi Bari, theme, locality or metro...'
                  }
                  placeholderTextColor="#8A8179"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                    <Ionicons name="close-circle" size={18} color="#8A8179" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Zone Filter Horizontal Scroll */}
              <ZoneFilterBar selectedZone={selectedZone} onSelectZone={setSelectedZone} />

              {/* Interactive Feature Switches Grid (5 switches) */}
              <View style={[styles.featureFilterSection, { borderTopColor: isDark ? '#2F2720' : '#EEE8E1' }]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleToggleFeatureFilters}
                  style={styles.featureHeaderRow}
                >
                  <Text style={[styles.featureSectionTitle, { color: isDark ? '#A89E95' : '#776D65' }]}>
                    {isBn ? 'সুবিধা ও বৈশিষ্ট্য ফিল্টার' : 'FEATURE FILTERS'}
                  </Text>
                  <View
                    style={[
                      styles.chevronBox,
                      {
                        backgroundColor: isDark ? '#251E18' : '#F2ECE4',
                        borderColor: isDark ? '#382F26' : '#DED5CB',
                      },
                    ]}
                  >
                    <Ionicons
                      name={isFeatureFiltersOpen ? 'chevron-down' : 'chevron-forward'}
                      size={15}
                      color={isDark ? '#C4B9AE' : '#524942'}
                    />
                  </View>
                </TouchableOpacity>

                {isFeatureFiltersOpen && (
                  <View style={styles.switchesGrid}>
                    {/* Switch 1: Bonedi Bari */}
                    <AnimatedToggleSwitch
                      value={bonediBariOnly}
                      onValueChange={() => setBonediBariOnly(!bonediBariOnly)}
                      isDark={isDark}
                      label={isBn ? 'বনেদি বাড়ির পুজো' : 'Bonedi Bari'}
                      reduceMotion={reduceMotion}
                    />

                    {/* Switch 2: Near Metro */}
                    <AnimatedToggleSwitch
                      value={metroOnly}
                      onValueChange={() => setMetroOnly(!metroOnly)}
                      isDark={isDark}
                      label={isBn ? 'মেট্রোর কাছে' : 'Near Metro'}
                      reduceMotion={reduceMotion}
                    />

                    {/* Switch 3: Heritage Sabeki */}
                    <AnimatedToggleSwitch
                      value={heritageOnly}
                      onValueChange={() => setHeritageOnly(!heritageOnly)}
                      isDark={isDark}
                      label={isBn ? 'ঐতিহ্যবাহী সাবেকি' : 'Heritage Sabeki'}
                      reduceMotion={reduceMotion}
                    />

                    {/* Switch 4: Wheelchair Access */}
                    <AnimatedToggleSwitch
                      value={wheelchairOnly}
                      onValueChange={() => setWheelchairOnly(!wheelchairOnly)}
                      isDark={isDark}
                      label={isBn ? 'হুইলচেয়ার সুবিধা' : 'Wheelchair Access'}
                      reduceMotion={reduceMotion}
                    />

                    {/* Switch 5: Featured Only */}
                    <AnimatedToggleSwitch
                      value={featuredOnly}
                      onValueChange={() => setFeaturedOnly(!featuredOnly)}
                      isDark={isDark}
                      label={isBn ? 'বিশেষ সেরা মণ্ডপ' : 'Featured Only'}
                      reduceMotion={reduceMotion}
                    />
                  </View>
                )}
              </View>

              {/* Summary Bar: Results Count + Sort Dropdown + Reset Button */}
              <View style={[styles.resultsBar, { borderTopColor: isDark ? '#2F2720' : '#EEE8E1' }]}>
                <View style={styles.counterGroup}>
                  <Text style={[styles.countText, { color: isDark ? '#A89E95' : '#776D65' }]}>
                    {isBn ? 'মোট ' : 'Showing '}
                    <Text style={styles.boldRedCount}>
                      {isBn
                        ? toBengaliDigits(filteredPandals.length)
                        : filteredPandals.length}
                    </Text>
                    {isBn ? ' টি প্যান্ডেল' : ' pandals'}
                  </Text>
                </View>

                <View style={styles.sortResetGroup}>
                  {/* Sort Trigger Button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowSortModal(true)}
                    style={[
                      styles.sortBtn,
                      {
                        backgroundColor: isDark ? '#14110E' : '#FCFAF7',
                        borderColor: isDark ? '#2F2720' : '#EEE8E1',
                      },
                    ]}
                  >
                    <Ionicons name="options-outline" size={13} color={colors.textSecondary} />
                    <Text
                      style={[styles.sortBtnText, { color: colors.textPrimary }]}
                      numberOfLines={1}
                    >
                      {currentSortLabel}
                    </Text>
                    <Ionicons name="chevron-down" size={12} color={colors.textMuted} />
                  </TouchableOpacity>

                  {/* Reset All Filters Button */}
                  {isFiltered && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleResetFilters}
                      style={styles.resetBtn}
                    >
                      <Ionicons name="reload-outline" size={13} color="#B42323" />
                      <Text style={styles.resetBtnText}>
                        {isBn ? 'রিসেট' : 'Reset All'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* Custom Stop Action Banner */}
            <View style={styles.customStopBar}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowCustomModal(true)}
                style={[
                  styles.addCustomBtn,
                  {
                    backgroundColor: isDark ? '#341B18' : '#FDEEEE',
                    borderColor: isDark ? '#4D221E' : '#F6CECA',
                  },
                ]}
              >
                <Ionicons name="add-circle" size={16} color="#B42323" />
                <Text style={styles.addCustomText}>
                  {isBn ? '+ নিজস্ব কাস্টম স্টপ যোগ করুন' : '+ Add Custom Pandal Stop'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />

      {/* Sort Options Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSortModal(false)}>
          <View
            style={[
              styles.sortModalContent,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.sortModalTitle, { color: colors.textPrimary }]}>
              {isBn ? 'প্যান্ডেল সাজান (Sort By)' : 'Sort Pandals By'}
            </Text>
            {sortOptions.map((opt) => {
              const isSelected = sortBy === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    handleSelectSort(opt.id as any);
                  }}
                  style={[
                    styles.sortModalOption,
                    isSelected && {
                      backgroundColor: isDark ? '#341B18' : '#FDEEEE',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sortModalOptionText,
                      { color: isSelected ? '#B42323' : colors.textPrimary },
                      isSelected && { fontWeight: '800' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={18} color="#B42323" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* Custom Stop Modal */}
      <CustomStopModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
      />

      {/* Docked / Floating Selected Pandals Bar */}
      <SelectedPandalsBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  headerContainer: {
    paddingTop: 16,
    gap: 12,
    marginBottom: 12,
  },
  titleSection: {
    gap: 4,
  },
  directoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  directoryBadgeText: {
    color: '#B42323',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  filterCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  zoneSection: {
    gap: 6,
  },
  filterSubheading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  featureFilterSection: {
    borderTopWidth: 1,
    paddingTop: 10,
    gap: 8,
  },
  featureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  featureSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  chevronBox: {
    padding: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  switchesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 4,
  },
  switchRow: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  switchTrack: {
    width: 38,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  switchThumbChecked: {
    alignSelf: 'flex-end',
  },
  switchThumbUnchecked: {
    alignSelf: 'flex-start',
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  resultsBar: {
    borderTopWidth: 1,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  counterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  boldRedCount: {
    color: '#B42323',
    fontWeight: '900',
    fontSize: 13,
  },
  sortResetGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  sortBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  resetBtnText: {
    color: '#B42323',
    fontSize: 11,
    fontWeight: '800',
  },
  customStopBar: {
    marginTop: 2,
  },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  addCustomText: {
    color: '#B42323',
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sortModalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  sortModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  sortModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sortModalOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
