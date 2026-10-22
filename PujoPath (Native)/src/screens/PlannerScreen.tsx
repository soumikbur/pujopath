import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  LayoutAnimation,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRoute } from '@/context/RouteContext';
import { useFestival } from '@/context/FestivalContext';
import { PANDALS_DATA } from '@/data/pandals';
import { KALI_PANDALS_DATA } from '@/data/pandals/kaliPandals';
import { METRO_STATIONS_DATA } from '@/data/metro';
import {
  formatDistance,
  toBengaliDigits,
  calculateHaversineDistance,
  estimateWalkingMinutes,
} from '@/lib/geo';
import { CustomStopModal } from '@/components/CustomStopModal';
import { Pandal } from '@/types';
import { useResponsive } from '@/hooks/useResponsive';

interface PlannerScreenProps {
  navigation: any;
}

export const PlannerScreen: React.FC<PlannerScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { activeFestival } = useFestival();
  const isKali = activeFestival === 'kali';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, tabScrollBottomPadding } = useResponsive();
  const {
    stops,
    addStop,
    removeStop,
    clearRoute,
    optimizeRoute,
    reorderStops,
    lastOptimizationResult,
    saveCurrentRoute,
    customStops,
  } = useRoute();

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [optimizedSuccess, setOptimizedSuccess] = useState(false);

  // Navigation settings & states
  const [originMode, setOriginMode] = useState<'app_default' | 'current_location' | 'custom_station' | 'first_pandal'>('app_default');
  const [provider, setProvider] = useState<'google' | 'apple'>(Platform.OS === 'ios' ? 'apple' : 'google');
  const [selectedStationId, setSelectedStationId] = useState<string>(
    METRO_STATIONS_DATA[0]?.id || 'shobhabazar-sutanuti'
  );

  // Quick Add category filter state
  const [quickAddCategory, setQuickAddCategory] = useState<string>('all');
  const [quickAddSearch, setQuickAddSearch] = useState<string>('');

  const handleReorder = (fromIndex: number, toIndex: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    reorderStops(fromIndex, toIndex);
  };

  const handleRemove = (pandalId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    removeStop(pandalId);
  };

  const handleClear = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    clearRoute();
  };

  // Total sequential distance
  const totalDistance = stops.reduce((acc, stop, idx) => {
    if (idx === 0) return 0;
    const prev = stops[idx - 1];
    return (
      acc +
      calculateHaversineDistance(
        prev.pandal.latitude,
        prev.pandal.longitude,
        stop.pandal.latitude,
        stop.pandal.longitude
      )
    );
  }, 0);

  const totalWalkingMins =
    stops.length > 0
      ? Math.round(estimateWalkingMinutes(totalDistance) + stops.length * 20)
      : 0;

  const handleOptimize = () => {
    if (stops.length <= 1) return;
    const res = optimizeRoute();
    if (res) {
      setOptimizedSuccess(true);
      setTimeout(() => setOptimizedSuccess(false), 2500);
    }
  };

  const handleSave = () => {
    const res = saveCurrentRoute();
    if (res) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleStartNavigation = async () => {
    if (stops.length === 0) return;

    if (stops.length === 1) {
      const s = stops[0].pandal;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`;
      await Linking.openURL(url);
      return;
    }

    const origin = stops[0].pandal;
    const destination = stops[stops.length - 1].pandal;
    const waypoints = stops
      .slice(1, stops.length - 1)
      .map((s) => `${s.pandal.latitude},${s.pandal.longitude}`)
      .join('|');

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&waypoints=${encodeURIComponent(waypoints)}&travelmode=walking`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Notice', 'Unable to launch navigation app.');
    }
  };

  // Filter available pandals for Quick Add section
  const availablePandals = useMemo(() => {
    const basePandals = isKali ? KALI_PANDALS_DATA : PANDALS_DATA;
    const all = [...basePandals, ...customStops];
    let list = all.filter((p) => !stops.some((s) => s.pandalId === p.id));

    if (isKali) {
      if (quickAddCategory === 'barasat') {
        list = list.filter((p) => p.zone === 'Barasat');
      } else if (quickAddCategory === 'madhyamgram') {
        list = list.filter((p) => p.zone === 'Madhyamgram');
      } else if (quickAddCategory === 'north24') {
        list = list.filter((p) => p.zone === 'North 24 Parganas');
      } else if (quickAddCategory === 'north') {
        list = list.filter((p) => p.zone === 'North Kolkata');
      } else if (quickAddCategory === 'south') {
        list = list.filter((p) => p.zone === 'South Kolkata');
      }
    } else {
      if (quickAddCategory === 'bonedi-bari') {
        list = list.filter((p) => p.isBonediBari || p.category === 'Bonedi Bari');
      } else if (quickAddCategory === 'north') {
        list = list.filter((p) => p.zone === 'North Kolkata');
      } else if (quickAddCategory === 'south') {
        list = list.filter((p) => p.zone === 'South Kolkata');
      } else if (quickAddCategory === 'central') {
        list = list.filter((p) => p.zone === 'Central Kolkata');
      } else if (quickAddCategory === 'east') {
        list = list.filter((p) => p.zone === 'Salt Lake' || p.zone === 'New Town');
      }
    }

    if (quickAddSearch.trim()) {
      const q = quickAddSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameBn && p.nameBn.includes(q)) ||
          p.locality.toLowerCase().includes(q)
      );
    }

    return list.slice(0, 15);
  }, [stops, customStops, quickAddCategory, quickAddSearch, isKali]);

  const quickCategories = useMemo(() => {
    if (isKali) {
      return [
        { id: 'all', label: isBn ? 'সকল মণ্ডপ' : 'All Pandals' },
        { id: 'barasat', label: isBn ? 'বারাসাত' : 'Barasat' },
        { id: 'madhyamgram', label: isBn ? 'মধ্যমগ্রাম' : 'Madhyamgram' },
        { id: 'north24', label: isBn ? 'উত্তর ২৪ পরগনা' : 'North 24 Pgs' },
        { id: 'north', label: isBn ? 'উত্তর কলকাতা' : 'North Kolkata' },
        { id: 'south', label: isBn ? 'দক্ষিণ কলকাতা' : 'South Kolkata' },
      ];
    }
    return [
      { id: 'all', label: isBn ? 'সকল মণ্ডপ' : 'All Pandals' },
      { id: 'bonedi-bari', label: isBn ? '🏛️ বনেদি বাড়ি' : '🏛️ Bonedi Bari' },
      { id: 'north', label: isBn ? 'উত্তর কলকাতা' : 'North Kolkata' },
      { id: 'south', label: isBn ? 'দক্ষিণ কলকাতা' : 'South Kolkata' },
      { id: 'central', label: isBn ? 'মধ্য কলকাতা' : 'Central' },
      { id: 'east', label: isBn ? 'সল্টলেক / নিউ টাউন' : 'Salt Lake / East' },
    ];
  }, [isKali, isBn]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
            paddingBottom: tabScrollBottomPadding + 24,
            maxWidth: isLandscape ? 860 : undefined,
            alignSelf: isLandscape ? 'center' : undefined,
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View style={styles.headerSection}>
          <View style={styles.badgeRow}>
            <Ionicons name="git-network-outline" size={14} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {isKali
                ? (isBn ? 'কালীপূজা রুট প্ল্যানার' : 'KALI PUJA ROUTE PLANNER')
                : (isBn ? 'রুট প্ল্যানার' : 'ROUTE PLANNER')}
            </Text>
          </View>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
            {isKali
              ? (isBn ? 'কালীপূজা পরিক্রমা রুট প্ল্যানার' : 'Kali Puja Pandal Route Planner')
              : (isBn ? 'প্যান্ডেল হপিং রুট প্ল্যানার' : 'Pandal Hopping Route Planner')}
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
            {isKali
              ? (isBn
                ? 'কালীপূজার পছন্দের মণ্ডপগুলো নির্বাচন করে সবচেয়ে সুবিধাজনক ও কম হাঁটার পরিক্রমা রুট তৈরি করুন।'
                : 'Plan your customized Kali Puja hopping trail with smart nearest-neighbor optimization.')
              : (isBn
                ? 'পছন্দের মণ্ডপগুলো নির্বাচন করুন এবং স্মার্ট অপটিমাইজার দিয়ে সবচেয়ে কম হাঁটা ও সুবিধাজনক পরিক্রমা রুট তৈরি করুন।'
                : 'Plan your customized pandal hopping route across Kolkata with smart nearest-neighbor optimization.')}
          </Text>
        </View>

        {/* 4-Box Metrics Bar (Always present) */}
        <View
          style={[
            styles.metricsCard,
            {
              backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
              borderColor: isDark ? '#2F2720' : '#EEE8E1',
            },
            isLandscape && { justifyContent: 'space-between', flexWrap: 'nowrap' },
          ]}
        >
          <View style={[styles.metricItem, isLandscape && { width: '23%' }]}>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>
              {isBn ? 'মোট প্যান্ডেল' : 'TOTAL STOPS'}
            </Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {isBn ? `${toBengaliDigits(stops.length)}টি মণ্ডপ` : `${stops.length} Pandals`}
            </Text>
          </View>

          <View style={[styles.metricItem, isLandscape && { width: '23%' }]}>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>
              {isBn ? 'হাঁটার দূরত্ব' : 'WALKING DISTANCE'}
            </Text>
            <Text style={[styles.metricValue, { color: colors.primary }]}>
              {formatDistance(totalDistance, language)}
            </Text>
          </View>

          <View style={[styles.metricItem, isLandscape && { width: '23%' }]}>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>
              {isBn ? 'আনুমানিক সময়' : 'EST. DURATION'}
            </Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              ~{isBn ? toBengaliDigits(totalWalkingMins) : totalWalkingMins} {isBn ? 'মিনিট' : 'mins'}
            </Text>
          </View>

          <View style={[styles.metricItemAction, isLandscape && { width: '23%' }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOptimize}
              disabled={stops.length <= 1}
              style={[
                styles.optimizeBtn,
                optimizedSuccess
                  ? { backgroundColor: '#059669' }
                  : stops.length <= 1
                  ? { backgroundColor: colors.primary, opacity: 0.4 }
                  : { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons
                name={optimizedSuccess ? 'checkmark' : 'sparkles'}
                size={14}
                color="#FFFFFF"
              />
              <Text style={styles.optimizeBtnText}>
                {optimizedSuccess
                  ? (isBn ? 'সাজানো হয়েছে!' : 'Optimized!')
                  : (isBn ? 'স্মার্ট সাজান' : 'Optimize Trail')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2-Opt Optimization Feedback Banner */}
        {lastOptimizationResult && (
          <View
            style={[
              styles.optBanner,
              {
                backgroundColor: isDark ? 'rgba(6, 78, 59, 0.3)' : '#ECFDF5',
                borderColor: isDark ? '#065F46' : '#6EE7B7',
              },
            ]}
          >
            <View style={styles.optBannerHeader}>
              <Ionicons name="sparkles" size={15} color="#059669" />
              <Text style={[styles.optBannerTitle, { color: isDark ? '#A7F3D0' : '#065F46' }]}>
                {isBn
                  ? `রুট স্মার্ট অপ্টিমাইজ হয়েছে! নিকটবর্তী মণ্ডপগুলো পরপর সাজানো হয়েছে (${lastOptimizationResult.savingsPercent.toFixed(0)}% দূরত্ব সাশ্রয়, ~${lastOptimizationResult.savingsKm.toFixed(1)} কিমি)।`
                  : `Trail optimized! Consecutive visits to nearby pandals saved ~${lastOptimizationResult.savingsKm.toFixed(1)} km (${lastOptimizationResult.savingsPercent.toFixed(0)}% reduction).`}
              </Text>
            </View>
            <Text style={[styles.optBannerSubtitle, { color: isDark ? '#6EE7B7' : '#047857' }]}>
              {isBn
                ? '* সরলরেখা দূরত্বের অনুমান; বাস্তব সড়ক পথের অবস্থা ও ট্র্যাফিকের ওপর নির্ভর করে পরিবর্তন হতে পারে।'
                : '* Straight-line distance estimate; actual road travel may vary.'}
            </Text>
          </View>
        )}

        {/* Save, Add Custom Pandal & Clear Controls (When stops > 0) */}
        {stops.length > 0 && (
          <View style={styles.controlsRow}>
            <View style={styles.controlsLeft}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSave}
                style={[
                  styles.saveBtn,
                  {
                    backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                    borderColor: isDark ? '#2F2720' : '#EEE8E1',
                  },
                ]}
              >
                <Ionicons
                  name={savedSuccess ? 'checkmark' : 'save-outline'}
                  size={15}
                  color={savedSuccess ? '#059669' : colors.primary}
                />
                <Text style={[styles.saveBtnText, { color: colors.textPrimary }]}>
                  {savedSuccess
                    ? (isBn ? 'সংরক্ষিত হয়েছে!' : 'Saved to Itineraries!')
                    : (isBn ? 'রুট সংরক্ষণ করুন' : 'Save Itinerary')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowCustomModal(true)}
                style={[
                  styles.addCustomBtn,
                  {
                    backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                  },
                ]}
              >
                <Ionicons name="add" size={15} color={colors.primary} />
                <Text style={[styles.addCustomBtnText, { color: colors.primary }]}>
                  {isBn ? '+ নিজস্ব মণ্ডপ যোগ করুন' : '+ Add Custom Pandal'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>
                {isBn ? 'সম্পূর্ণ রুট পরিষ্কার করুন' : 'Clear Route'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trail Navigation Hub (When stops > 0) */}
        {stops.length > 0 && (
          <View
            style={[
              styles.navHubCard,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.navHubHeader}>
              <View>
                <View style={styles.navHubBadge}>
                  <Ionicons name="compass" size={13} color={colors.primary} />
                  <Text style={[styles.navHubBadgeText, { color: colors.primary }]}>
                    {isBn ? 'পরিক্রমা ন্যাভিগেশন কন্ট্রোল' : 'TRAIL NAVIGATION HUB'}
                  </Text>
                </View>
                <Text style={[styles.navHubTitle, { color: colors.textPrimary }]}>
                  {isBn ? 'ম্যাপিং অ্যাপে পরিক্রমা শুরু করুন' : 'Launch Route in Maps'}
                </Text>
              </View>
            </View>

            {/* Launch Action Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleStartNavigation}
              style={[styles.launchBtn, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="navigate" size={18} color="#FFFFFF" />
              <Text style={styles.launchBtnText}>
                {isBn ? 'পুজো পরিক্রমা শুরু করুন' : 'Start Pandal Hopping'}
              </Text>
              <Ionicons name="open-outline" size={15} color="#FFFFFF" style={{ opacity: 0.8 }} />
            </TouchableOpacity>

            <Text style={[styles.navHubFootnote, { color: colors.textMuted }]}>
              {provider === 'google' ? 'Google Maps Walking Trail' : 'Apple Maps Walking Trail'} • {stops.length} stops
            </Text>
          </View>
        )}

        {/* Empty State vs Planned Stops List */}
        {stops.length === 0 ? (
          <View
            style={[
              styles.emptyStateCard,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: isDark ? '#2F2720' : '#EEE8E1',
              },
            ]}
          >
            <Ionicons name="navigate-outline" size={40} color={colors.primary} style={{ opacity: 0.8, marginBottom: 8 }} />
            <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
              {isBn ? 'আপনার পুজো পরিক্রমা তালিকা খালি' : 'Your Puja Trail is Empty'}
            </Text>
            <Text style={[styles.emptyStateDesc, { color: colors.textMuted }]}>
              {isBn
                ? 'প্যান্ডেল তালিকায় গিয়ে যেকোনো মণ্ডপে "রুট যোগ করুন" বাটনে ক্লিক করে নিজের পছন্দমতো পরিক্রমা তৈরি করুন অথবা সরাসরি যেকোনো নতুন মণ্ডপ যোগ করুন।'
                : 'Browse pandals in the directory and click "Add Route" to build your personalized walking trail, or add your own custom pandal.'}
            </Text>

            <View style={styles.emptyActionRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('ExploreTab')}
                style={[styles.emptyExploreBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="search" size={15} color="#FFFFFF" />
                <Text style={styles.emptyExploreBtnText}>
                  {isBn ? 'প্যান্ডেল সন্ধান করুন' : 'Explore Pandals'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowCustomModal(true)}
                style={[
                  styles.emptyAddBtn,
                  {
                    backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Ionicons name="add" size={15} color={colors.primary} />
                <Text style={[styles.emptyAddBtnText, { color: colors.primary }]}>
                  {isBn ? '+ নতুন মণ্ডপ যোগ করুন' : '+ Add New Pandal'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.stopsSection}>
            <View style={styles.stopsSectionHeader}>
              <Text style={[styles.stopsSectionTitle, { color: colors.textMuted }]}>
                {isBn ? 'পরিক্রমা গন্তব্য তালিকা (ক্রমানুসারে)' : 'PLANNED STOPS (IN ORDER)'}
              </Text>
              <Text style={[styles.stopsSectionHelp, { color: colors.textMuted }]}>
                {isBn ? 'তীর চিহ্নে ক্লিক করে ক্রম পরিবর্তন করুন' : 'Use arrows to reorder stops'}
              </Text>
            </View>

            <View style={styles.stopsList}>
              {stops.map((stop, idx) => (
                <View
                  key={stop.pandalId}
                  style={[
                    styles.stopItemCard,
                    {
                      backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                      borderColor: isDark ? '#2F2720' : '#EEE8E1',
                    },
                  ]}
                >
                  <View style={styles.stopLeftCol}>
                    <View style={styles.stopNumberBadge}>
                      <Text style={styles.stopNumberText}>
                        {isBn ? toBengaliDigits(idx + 1) : idx + 1}
                      </Text>
                    </View>
                    <View style={styles.stopInfo}>
                      <Text style={[styles.stopName, { color: colors.textPrimary }]} numberOfLines={1}>
                        {isBn && stop.pandal.nameBn ? stop.pandal.nameBn : stop.pandal.name}
                      </Text>
                      <Text style={[styles.stopLocality, { color: colors.textMuted }]} numberOfLines={1}>
                        {isBn && stop.pandal.localityBn ? stop.pandal.localityBn : stop.pandal.locality} • {stop.pandal.zone}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.stopActions}>
                    {idx > 0 && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleReorder(idx, idx - 1)}
                        style={[
                          styles.reorderBtn,
                          {
                            borderColor: isDark ? '#2F2720' : '#EEE8E1',
                          },
                        ]}
                      >
                        <Ionicons name="arrow-up" size={14} color={colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                    {idx < stops.length - 1 && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleReorder(idx, idx + 1)}
                        style={[
                          styles.reorderBtn,
                          {
                            borderColor: isDark ? '#2F2720' : '#EEE8E1',
                          },
                        ]}
                      >
                        <Ionicons name="arrow-down" size={14} color={colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleRemove(stop.pandalId)}
                      style={styles.deleteStopBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color="#F43F5E" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Route Pandal Explorer & Quick Add Section */}
        <View
          style={[
            styles.quickAddSection,
            {
              backgroundColor: isDark ? '#14110E' : '#FCFAF7',
              borderColor: isDark ? '#2F2720' : '#EEE8E1',
            },
          ]}
        >
          <View style={styles.quickAddHeader}>
            <View style={styles.quickAddTitleRow}>
              <Ionicons name="sparkles" size={15} color={colors.primary} />
              <Text style={[styles.quickAddTitle, { color: colors.textPrimary }]}>
                {isBn ? 'পরিক্রমায় নতুন মণ্ডপ যোগ করুন' : 'Add Pandals to Your Trail'}
              </Text>
            </View>
            <Text style={[styles.quickAddSubtitle, { color: colors.textMuted }]}>
              {isBn
                ? 'অঞ্চল বা বনেদি বাড়ি বিভাগ নির্বাচন করে সহজে পছন্দের মণ্ডপগুলো যোগ করুন।'
                : 'Filter by locality, heritage houses, or add your own custom pandal.'}
            </Text>
          </View>

          {/* Category Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickCategoryScroll}>
            {quickCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setQuickAddCategory(cat.id)}
                style={[
                  styles.quickCatPill,
                  quickAddCategory === cat.id
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : {
                        backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                        borderColor: isDark ? '#2F2720' : '#EEE8E1',
                      },
                ]}
              >
                <Text
                  style={[
                    styles.quickCatPillText,
                    {
                      color: quickAddCategory === cat.id ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: quickAddCategory === cat.id ? '800' : '600',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Search box for quick add */}
          <View
            style={[
              styles.quickSearchBox,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: isDark ? '#2F2720' : '#EEE8E1',
              },
            ]}
          >
            <Ionicons name="search" size={15} color="#8A8179" style={{ marginRight: 6 }} />
            <TextInput
              style={[styles.quickSearchInput, { color: colors.textPrimary }]}
              placeholder={isBn ? 'মণ্ডপ বা এলাকা খুঁজুন...' : 'Search pandals to add...'}
              placeholderTextColor="#8A8179"
              value={quickAddSearch}
              onChangeText={setQuickAddSearch}
            />
            {quickAddSearch.length > 0 && (
              <TouchableOpacity onPress={() => setQuickAddSearch('')}>
                <Ionicons name="close-circle" size={15} color="#8A8179" />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Add Pandals List */}
          <View style={[styles.quickPandalsList, isLandscape && { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }]}>
            {availablePandals.map((pandal) => (
              <View
                key={pandal.id}
                style={[
                  styles.quickPandalItem,
                  {
                    backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                    borderColor: isDark ? '#2F2720' : '#EEE8E1',
                  },
                  isLandscape && { width: '48.8%' },
                ]}
              >
                <View style={styles.quickPandalInfo}>
                  <Text style={[styles.quickPandalName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {isBn && pandal.nameBn ? pandal.nameBn : pandal.name}
                  </Text>
                  <Text style={[styles.quickPandalZone, { color: colors.textMuted }]} numberOfLines={1}>
                    {pandal.locality} • {pandal.zone}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => addStop(pandal)}
                  style={styles.quickAddBtn}
                >
                  <Ionicons name="add" size={14} color={colors.primary} />
                  <Text style={[styles.quickAddBtnText, { color: colors.primary }]}>
                    {isBn ? 'যোগ করুন' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <CustomStopModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
      />
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
    marginBottom: 16,
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
  metricsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricItem: {
    width: '46%',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  metricItemAction: {
    width: '46%',
    justifyContent: 'center',
  },
  optimizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optimizeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  optBanner: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  optBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  optBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  optBannerSubtitle: {
    fontSize: 11,
    paddingLeft: 21,
  },
  controlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  controlsLeft: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#B42323',
  },
  addCustomBtnText: {
    color: '#B42323',
    fontSize: 12,
    fontWeight: '900',
  },
  clearBtn: {
    paddingVertical: 6,
  },
  clearBtnText: {
    color: '#E11D48',
    fontSize: 12,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  navHubCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    gap: 12,
    marginBottom: 16,
  },
  navHubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navHubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  navHubBadgeText: {
    color: '#B42323',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  navHubTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B42323',
    paddingVertical: 12,
    borderRadius: 12,
  },
  launchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  navHubFootnote: {
    fontSize: 11,
    textAlign: 'center',
  },
  emptyStateCard: {
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyStateDesc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 16,
  },
  emptyActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  emptyExploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#B42323',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyExploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: '#B42323',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyAddBtnText: {
    color: '#B42323',
    fontSize: 13,
    fontWeight: '900',
  },
  stopsSection: {
    marginBottom: 20,
  },
  stopsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopsSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stopsSectionHelp: {
    fontSize: 11,
  },
  stopsList: {
    gap: 8,
  },
  stopItemCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  stopNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#B42323',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '800',
  },
  stopLocality: {
    fontSize: 11,
    marginTop: 2,
  },
  stopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reorderBtn: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  deleteStopBtn: {
    padding: 6,
    borderRadius: 8,
  },
  quickAddSection: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  quickAddHeader: {
    gap: 2,
  },
  quickAddTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickAddTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  quickAddSubtitle: {
    fontSize: 12,
  },
  quickCategoryScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  quickCatPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  quickCatPillText: {
    fontSize: 11,
  },
  quickSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickSearchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 2,
  },
  quickPandalsList: {
    gap: 8,
  },
  quickPandalItem: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickPandalInfo: {
    flex: 1,
    marginRight: 8,
  },
  quickPandalName: {
    fontSize: 13,
    fontWeight: '800',
  },
  quickPandalZone: {
    fontSize: 11,
    marginTop: 2,
  },
  quickAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B42323',
  },
  quickAddBtnText: {
    color: '#B42323',
    fontSize: 11,
    fontWeight: '800',
  },
});
