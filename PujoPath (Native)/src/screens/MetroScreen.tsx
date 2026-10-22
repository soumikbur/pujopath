import React, { useState } from 'react';
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
import { useResponsive } from '@/hooks/useResponsive';
import { METRO_STATIONS_DATA } from '@/data/metro';
import { FESTIVAL_SPECIAL_METRO_TIMETABLES } from '@/data/metro/timetables';
import { PANDALS_DATA } from '@/data/pandals';

type MetroViewTab = 'special' | 'normal' | 'stations';

interface MetroScreenProps {
  navigation: any;
}

const getLineColor = (lineKeyOrName: string) => {
  if (lineKeyOrName.includes('blue') || lineKeyOrName.includes('Blue')) return '#2563EB';
  if (lineKeyOrName.includes('green') || lineKeyOrName.includes('Green')) return '#059669';
  if (lineKeyOrName.includes('purple') || lineKeyOrName.includes('Purple')) return '#7C3AED';
  return '#EA580C';
};

const pandalsMap = new Map(PANDALS_DATA.map((p) => [p.id, p]));

export const MetroScreen: React.FC<MetroScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, stackScrollBottomPadding } = useResponsive();

  const [activeTab, setActiveTab] = useState<MetroViewTab>('special');
  const [selectedStationLine, setSelectedStationLine] = useState<
    'All' | 'Blue Line (North-South)' | 'Green Line (East-West)'
  >('All');

  const filteredStations =
    selectedStationLine === 'All'
      ? METRO_STATIONS_DATA
      : METRO_STATIONS_DATA.filter((s) => s.line === selectedStationLine);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
            paddingBottom: stackScrollBottomPadding + 24,
            maxWidth: isLandscape ? 860 : undefined,
            alignSelf: isLandscape ? 'center' : undefined,
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.badgeRow}>
            <Ionicons name="subway-outline" size={13} color="#B42323" />
            <Text style={styles.badgeText}>
              {isBn ? 'মেট্রো রেল সময়সূচি' : 'TRANSIT SCHEDULES'}
            </Text>
          </View>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
            {isBn ? 'কলকাতা মেট্রো পুজো পরিক্রমা ও সময়সূচি' : 'Kolkata Metro Timetable & Puja Guide'}
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
            {isBn
              ? 'স্বাভাবিক ট্রেনের সূচি এবং ২০২৬ দুর্গাপূজায় সারারাত মেট্রো পরিষেবার অফিশিয়াল সময়তালিকা।'
              : 'Official Kolkata Metro Railway operating hours, first/last trains, and 2026 Durga Puja all-night special services.'}
          </Text>
        </View>

        {/* Segmented Control 3 Tabs */}
        <View style={[styles.segmentContainer, { backgroundColor: isDark ? '#201C18' : '#F5F1EB', borderColor: colors.border }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('special')}
            style={[
              styles.segmentBtn,
              activeTab === 'special' && {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'special' ? '#B42323' : colors.textMuted },
                activeTab === 'special' && { fontWeight: '800' },
              ]}
              numberOfLines={1}
            >
              {isBn ? '🌙 সারারাত সূচি' : '🌙 Night Special'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('normal')}
            style={[
              styles.segmentBtn,
              activeTab === 'normal' && {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'normal' ? '#B42323' : colors.textMuted },
                activeTab === 'normal' && { fontWeight: '800' },
              ]}
              numberOfLines={1}
            >
              {isBn ? '⏱️ নিয়মিত সূচি' : '⏱️ Timetables'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('stations')}
            style={[
              styles.segmentBtn,
              activeTab === 'stations' && {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: activeTab === 'stations' ? '#B42323' : colors.textMuted },
                activeTab === 'stations' && { fontWeight: '800' },
              ]}
              numberOfLines={1}
            >
              {isBn ? '🚇 স্টেশন ও মণ্ডপ' : '🚇 Stations'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: ALL-NIGHT PUJA SPECIAL TIMETABLE */}
        {activeTab === 'special' && (
          <View style={styles.tabSection}>
            {/* Red Lead Banner */}
            <View style={styles.nightBanner}>
              <View style={styles.bannerTagRow}>
                <View style={styles.bannerPill}>
                  <Ionicons name="moon" size={12} color="#FFFFFF" />
                  <Text style={styles.bannerPillText}>
                    {isBn ? 'সারারাত মেট্রো পরিষেবা' : 'ALL-NIGHT METRO SERVICE'}
                  </Text>
                </View>
                <View style={[styles.bannerPill, { backgroundColor: '#FBBF24' }]}>
                  <Text style={[styles.bannerPillText, { color: '#1C1917' }]}>
                    {isBn ? 'সপ্তমী • অষ্টমী • নবমী' : 'Saptami • Ashtami • Navami'}
                  </Text>
                </View>
              </View>

              <Text style={styles.bannerHeading}>
                {isBn ? 'রাতভর ট্রেন পরিষেবা ২০২৬' : 'All-Night Trains across Kolkata'}
              </Text>
              <Text style={styles.bannerSub}>
                {isBn
                  ? 'সপ্তমী, অষ্টমী ও নবমী উপলক্ষে ব্লু ও গ্রীন লাইনে বিকেল থেকে ভোর ৪টা পর্যন্ত ট্রেন চলবে।'
                  : 'Operating until 4:00 AM on Blue Line & Green Line to facilitate seamless pandal hopping.'}
              </Text>
            </View>

            {/* Special Lines List */}
            <View style={[styles.cardsGrid, isLandscape && { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }]}>
              {FESTIVAL_SPECIAL_METRO_TIMETABLES.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                      borderColor: colors.border,
                    },
                    isLandscape && { width: '48.8%' },
                  ]}
                >
                <View style={styles.cardTopRow}>
                  <View style={[styles.lineDot, { backgroundColor: getLineColor(item.lineKey) }]} />
                  <Text style={[styles.lineName, { color: colors.textPrimary }]}>
                    {isBn ? item.lineNameBn : item.lineName}
                  </Text>
                </View>

                <View style={[styles.badgeContainer, { backgroundColor: isDark ? '#201C18' : '#F5F1EB' }]}>
                  <Text style={[styles.intervalText, { color: colors.textSecondary }]}>
                    {isBn ? 'ট্রেন ব্যবধান: ' : 'Frequency: '}
                    <Text style={{ fontWeight: '800', color: '#B42323' }}>
                      {item.peakFrequencyMinutes ? `${item.peakFrequencyMinutes} mins` : '6–10 mins'}
                    </Text>
                  </Text>
                </View>

                <View style={styles.timingsGrid}>
                  <View style={[styles.timingItem, { borderColor: colors.border }]}>
                    <Text style={[styles.timingLabel, { color: colors.textMuted }]}>
                      {isBn ? 'প্রথম ট্রেন' : 'First Train'}
                    </Text>
                    <Text style={[styles.timingVal, { color: colors.textPrimary }]}>
                      {item.firstTrain}
                    </Text>
                  </View>
                  <View style={[styles.timingItem, { borderColor: colors.border }]}>
                    <Text style={[styles.timingLabel, { color: colors.textMuted }]}>
                      {isBn ? 'শেষ ট্রেন' : 'Last Train'}
                    </Text>
                    <Text style={[styles.timingVal, { color: '#B42323' }]}>
                      {item.lastTrain}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            </View>
          </View>
        )}

        {/* TAB 2: REGULAR TIMETABLES */}
        {activeTab === 'normal' && (
          <View style={[styles.tabSection, isLandscape && { flexDirection: 'row', gap: 12 }]}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                  borderColor: colors.border,
                },
                isLandscape && { flex: 1 },
              ]}
            >
              <Text style={[styles.lineName, { color: colors.textPrimary }]}>
                {isBn ? 'নিয়মিত কাজের দিন (সোমবার–শুক্রবার)' : 'Regular Weekdays (Mon–Fri)'}
              </Text>
              <Text style={[styles.timingLabel, { color: colors.textMuted, marginTop: 4 }]}>
                {isBn
                  ? 'ব্লু লাইন: সকাল ৬:৫৫ থেকে রাত ৯:৪০ পর্যন্ত (প্রতি ৫–৭ মিনিটে)'
                  : 'Blue Line: 06:55 AM – 09:40 PM (Every 5–7 mins)'}
              </Text>
              <Text style={[styles.timingLabel, { color: colors.textMuted, marginTop: 4 }]}>
                {isBn
                  ? 'গ্রীন লাইন: সকাল ৭:০০ থেকে রাত ৯:৩০ পর্যন্ত (প্রতি ১০ মিনিটে)'
                  : 'Green Line: 07:00 AM – 09:30 PM (Every 10 mins)'}
              </Text>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                  borderColor: colors.border,
                },
                isLandscape && { flex: 1 },
              ]}
            >
              <Text style={[styles.lineName, { color: colors.textPrimary }]}>
                {isBn ? 'শনিবার ও রবিবার' : 'Weekend Services'}
              </Text>
              <Text style={[styles.timingLabel, { color: colors.textMuted, marginTop: 4 }]}>
                {isBn
                  ? 'শনিবার: সকাল ৬:৫৫ থেকে রাত ৯:৪০ (৭–১০ মিনিট পর পর)'
                  : 'Saturday: 06:55 AM – 09:40 PM (Every 7–10 mins)'}
              </Text>
              <Text style={[styles.timingLabel, { color: colors.textMuted, marginTop: 4 }]}>
                {isBn
                  ? 'রবিবার: সকাল ৯:০০ থেকে রাত ৯:৪০ (১০–১৫ মিনিট পর পর)'
                  : 'Sunday: 09:00 AM – 09:40 PM (Every 10–15 mins)'}
              </Text>
            </View>
          </View>
        )}

        {/* TAB 3: STATIONS & PANDALS */}
        {activeTab === 'stations' && (
          <View style={styles.tabSection}>
            <View style={[styles.cardsGrid, isLandscape && { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }]}>
              {filteredStations.map((station) => (
                <View
                  key={station.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                      borderColor: colors.border,
                    },
                    isLandscape && { width: '48.8%' },
                  ]}
                >
                <View style={styles.stationHeader}>
                  <View style={[styles.stationDot, { backgroundColor: getLineColor(station.line) }]} />
                  <View style={styles.stationTitleContainer}>
                    <Text style={[styles.stationName, { color: colors.textPrimary }]}>
                      {isBn ? station.nameBn : station.name}
                    </Text>
                    <Text style={[styles.stationLine, { color: colors.textMuted }]}>
                      {station.line}
                    </Text>
                  </View>
                </View>

                {station.nearbyPandalIds && station.nearbyPandalIds.length > 0 && (
                  <View style={styles.pandalsContainer}>
                    <Text style={[styles.pandalsHeading, { color: colors.textMuted }]}>
                      {isBn ? 'নিকটবর্তী মণ্ডপসমূহ:' : 'Nearby Pandals:'}
                    </Text>
                    <View style={styles.pandalChipsRow}>
                      {station.nearbyPandalIds.slice(0, 4).map((pandalId, i) => {
                        const p = pandalsMap.get(pandalId);
                        const pName = p ? (isBn ? (p.nameBn || p.name) : p.name) : pandalId;
                        return (
                          <TouchableOpacity
                            key={i}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('PandalDetail', { pandalId })}
                            style={[
                              styles.pandalChip,
                              { backgroundColor: isDark ? '#201C18' : '#F5F1EB', borderColor: colors.border },
                            ]}
                          >
                            <Ionicons name="business-outline" size={12} color="#B42323" />
                            <Text style={[styles.pandalChipText, { color: colors.textPrimary }]} numberOfLines={1}>
                              {pName}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    gap: 16,
  },
  headerSection: {
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabSection: {
    gap: 12,
  },
  nightBanner: {
    borderRadius: 22,
    backgroundColor: '#B42323',
    padding: 18,
    gap: 8,
    shadowColor: '#B42323',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  bannerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  bannerPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  bannerHeading: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  bannerSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    lineHeight: 17,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  lineName: {
    fontSize: 15,
    fontWeight: '800',
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  intervalText: {
    fontSize: 11,
  },
  timingsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  timingItem: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  timingLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  timingVal: {
    fontSize: 13,
    fontWeight: '900',
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stationTitleContainer: {
    flex: 1,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '800',
  },
  stationLine: {
    fontSize: 10,
    marginTop: 1,
  },
  cardsGrid: {
    gap: 12,
  },
  pandalsContainer: {
    marginTop: 4,
    gap: 6,
  },
  pandalsHeading: {
    fontSize: 11,
    fontWeight: '700',
  },
  pandalChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pandalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
    maxWidth: '48%',
  },
  pandalChipText: {
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
  },
});
