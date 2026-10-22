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
import { PUJA_CALENDAR_DATA } from '@/data/calendar';
import { SANDHI_PUJA_SCHEDULES, SandhiPujaConvention } from '@/data/calendar/sandhiPuja';

interface CalendarScreenProps {
  navigation: any;
}

const sandhiSchedule = SANDHI_PUJA_SCHEDULES[2026] || {
  conventions: [],
  primaryConventionId: '',
};

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, stackScrollBottomPadding } = useResponsive();

  const [selectedConventionId, setSelectedConventionId] = useState<string>(
    sandhiSchedule.primaryConventionId || (sandhiSchedule.conventions[0]?.id ?? '')
  );

  const activeConvention =
    sandhiSchedule.conventions.find((c) => c.id === selectedConventionId) ||
    sandhiSchedule.conventions[0];

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
            gap: 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* HEADER SECTION                                            */}
        {/* ========================================================= */}
        <View style={styles.headerSection}>
          <View style={styles.almanacBadge}>
            <Ionicons name="calendar-outline" size={13} color="#B42323" />
            <Text style={styles.almanacBadgeText}>
              {isBn ? 'পূজা পঞ্জিকা ও নির্ঘণ্ট' : 'PUJA ALMANAC'}
            </Text>
          </View>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
            {isBn ? 'শারদীয়া দুর্গাপূজা ২০২৬ বিশুদ্ধ নির্ঘণ্ট' : 'Durga Puja 2026 Sacred Calendar'}
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
            {isBn
              ? 'মহালয়া, মহাষষ্ঠী, মহাসপ্তমী, মহাষ্টমী অঞ্জলি, সন্ধিপূজা ও বিজয়া দশমীর নির্ভুল শুভ সময়সূচি।'
              : 'Exact tithi schedules, pushpanjali auspicious timings, and sandhi puja hours.'}
          </Text>
        </View>

        {/* ========================================================= */}
        {/* SANDHI PUJA FEATURED CARD WITH CONVENTION SELECTOR         */}
        {/* ========================================================= */}
        <View
          style={[
            styles.sandhiCard,
            {
              backgroundColor: isDark ? '#1C1511' : '#FFF9F6',
              borderColor: isDark ? 'rgba(180, 35, 35, 0.4)' : 'rgba(180, 35, 35, 0.3)',
            },
          ]}
        >
          {/* Card Title Row */}
          <View style={[styles.sandhiCardHeader, { borderBottomColor: isDark ? '#38261E' : '#F0DED8' }]}>
            <View style={styles.flameRow}>
              <View style={styles.flameBox}>
                <Ionicons name="flame" size={22} color="#FBBF24" />
              </View>
              <View style={styles.sandhiTitleBox}>
                <View style={styles.badgeRow}>
                  <View style={[styles.sandhiTag, { backgroundColor: isDark ? 'rgba(180,35,35,0.25)' : 'rgba(180,35,35,0.1)' }]}>
                    <Text style={styles.sandhiTagText}>
                      {isBn ? 'মহাসন্ধিক্ষণ ২০২৬' : 'SACRED SANDHI WINDOW 2026'}
                    </Text>
                  </View>
                  <View style={[styles.lotusTag, { backgroundColor: isDark ? 'rgba(217,119,6,0.2)' : '#FEF3C7' }]}>
                    <Text style={styles.lotusTagText}>
                      {isBn ? '১০৮ পদ্ম ও প্রদীপ' : '108 Lotuses & Lamps'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.sandhiHeading, { color: colors.textPrimary }]}>
                  {isBn ? 'সন্ধিপূজা বিশেষ নির্ঘণ্ট' : 'Sandhi Puja Auspicious Timings'}
                </Text>
              </View>
            </View>

            <View style={[styles.durationChip, { backgroundColor: isDark ? '#201C18' : '#FFFFFF', borderColor: isDark ? '#38261E' : '#F0DED8' }]}>
              <Text style={styles.durationChipText}>
                {isBn ? activeConvention?.durationDisplayBn : activeConvention?.durationDisplay}
              </Text>
            </View>
          </View>

          {/* Panjika Convention Selector */}
          <View style={styles.conventionSection}>
            <View style={styles.convHeader}>
              <Ionicons name="information-circle-outline" size={14} color="#B42323" />
              <Text style={[styles.convHeaderText, { color: colors.textMuted }]}>
                {isBn ? 'পঞ্জিকা গণনা পদ্ধতি নির্বাচন করুন:' : 'Select Almanac / Panjika Convention:'}
              </Text>
            </View>

            <View style={[styles.convCardsRow, isLandscape && { flexDirection: 'row', gap: 12 }]}>
              {sandhiSchedule.conventions.map((conv) => {
                const isSelected = selectedConventionId === conv.id;
                return (
                  <TouchableOpacity
                    key={conv.id}
                    activeOpacity={0.85}
                    onPress={() => setSelectedConventionId(conv.id)}
                    style={[
                      styles.convButton,
                      {
                        backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                        borderColor: isSelected ? '#B42323' : colors.border,
                        borderWidth: isSelected ? 2 : 1,
                      },
                      isLandscape && { flex: 1 },
                    ]}
                  >
                    <View style={styles.convTitleRow}>
                      <Text style={[styles.convName, { color: colors.textPrimary }]} numberOfLines={2}>
                        {isBn ? conv.nameBn : conv.name}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={16} color="#B42323" style={{ marginLeft: 6 }} />
                      )}
                    </View>
                    <Text style={styles.convTimeText}>
                      {isBn ? conv.startTimeBn : conv.startTime} – {isBn ? conv.endTimeBn : conv.endTime}
                    </Text>
                    <Text style={[styles.convBalidan, { color: colors.textMuted }]}>
                      {isBn ? 'বলিদান: সকাল ০৭:৫০' : 'Sacred Balidan: 07:50 AM'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 3 Auspicious Highlight Boxes */}
          <View style={styles.timingBoxesRow}>
            <View style={[styles.timingBox, { backgroundColor: isDark ? '#201C18' : '#FFFFFF', borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={15} color="#B42323" />
              <Text style={[styles.timingBoxLabel, { color: colors.textMuted }]}>
                {isBn ? 'প্রারম্ভ' : 'Start'}
              </Text>
              <Text style={[styles.timingBoxValue, { color: colors.textPrimary }]}>
                {isBn ? activeConvention?.startTimeBn : activeConvention?.startTime}
              </Text>
            </View>

            <View style={[styles.timingBox, { backgroundColor: isDark ? '#201C18' : '#FFFFFF', borderColor: colors.border }]}>
              <Ionicons name="flame-outline" size={15} color="#D97706" />
              <Text style={[styles.timingBoxLabel, { color: colors.textMuted }]}>
                {isBn ? 'বলিদান' : 'Balidan'}
              </Text>
              <Text style={[styles.timingBoxValue, { color: colors.textPrimary }]}>
                {isBn ? 'সকাল ০৭:৫০' : '07:50 AM'}
              </Text>
            </View>

            <View style={[styles.timingBox, { backgroundColor: isDark ? '#201C18' : '#FFFFFF', borderColor: colors.border }]}>
              <Ionicons name="sparkles-outline" size={15} color="#B42323" />
              <Text style={[styles.timingBoxLabel, { color: colors.textMuted }]}>
                {isBn ? 'সমাপন' : 'End'}
              </Text>
              <Text style={[styles.timingBoxValue, { color: colors.textPrimary }]}>
                {isBn ? activeConvention?.endTimeBn : activeConvention?.endTime}
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* DAILY PUJA TITHIS LIST                                    */}
        {/* ========================================================= */}
        <View style={styles.tithisSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {isBn ? 'দিনভিত্তিক পূজা নির্ঘণ্ট' : 'Daily Puja Schedules & Tithis'}
          </Text>

          <View style={[styles.tithisGrid, isLandscape && { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }]}>
            {PUJA_CALENDAR_DATA.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.tithiCard,
                  {
                    backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                    borderColor: colors.border,
                  },
                  isLandscape && { width: '48.8%' },
                ]}
              >
                <View style={styles.tithiHeader}>
                  <View style={styles.tithiBadge}>
                    <Text style={styles.tithiBadgeText}>
                      {item.tithis && item.tithis[0] ? (isBn ? item.tithis[0].nameBn : item.tithis[0].name) : (isBn ? item.dayNameBn : item.dayName)}
                    </Text>
                  </View>
                  <Text style={[styles.tithiDate, { color: colors.textMuted }]}>
                    {item.dateString}
                  </Text>
                </View>

                <Text style={[styles.tithiTitle, { color: colors.textPrimary }]}>
                  {isBn ? item.dayNameBn : item.dayName}
                </Text>

                {item.pushpanjaliTimings ? (
                  <View style={[styles.timingPill, { backgroundColor: isDark ? '#201C18' : '#F5F1EB' }]}>
                    <Ionicons name="time-outline" size={13} color="#B42323" />
                    <Text style={[styles.timingPillText, { color: colors.textSecondary }]}>
                      {isBn ? item.pushpanjaliTimingsBn : item.pushpanjaliTimings}
                    </Text>
                  </View>
                ) : null}

                <Text style={[styles.tithiDesc, { color: colors.textMuted }]}>
                  {isBn ? item.significanceBn : item.significance}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contextual Link to Kali Puja 2026 Schedule */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('KaliPuja')}
          style={[
            styles.kaliBanner,
            {
              backgroundColor: isDark ? '#1C1026' : '#FAF5FF',
              borderColor: isDark ? 'rgba(147, 51, 234, 0.4)' : '#E9D5FF',
            },
          ]}
          accessibilityLabel="Open Kali Puja 2026 Calendar"
        >
          <View style={styles.kaliBannerIcon}>
            <Ionicons name="flame" size={20} color="#9333EA" />
          </View>
          <View style={styles.kaliBannerTextCol}>
            <Text style={[styles.kaliBannerTitle, { color: isDark ? '#F5D0FE' : '#581C87' }]}>
              {isBn ? 'কালীপূজা ও দীপাবলি ২০২৬ নির্ঘণ্ট' : 'Kali Puja & Deepavali 2026 Calendar'}
            </Text>
            <Text style={[styles.kaliBannerSubtitle, { color: colors.textSecondary }]}>
              {isBn
                ? 'কার্তিক অমাবস্যা তিথি ও মহানিশার নিশীথ কাল পূজার সময়সূচী দেখুন →'
                : 'View Kartik Amavasya tithis and midnight Nishita Kaal muhurat →'}
            </Text>
          </View>
        </TouchableOpacity>
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
    gap: 18,
  },
  headerSection: {
    gap: 4,
  },
  almanacBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  almanacBadgeText: {
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
  sandhiCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 18,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sandhiCardHeader: {
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  flameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  flameBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#B42323',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B42323',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sandhiTitleBox: {
    flex: 1,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sandhiTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sandhiTagText: {
    color: '#B42323',
    fontSize: 9,
    fontWeight: '800',
  },
  lotusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lotusTagText: {
    color: '#B45309',
    fontSize: 9,
    fontWeight: '700',
  },
  sandhiHeading: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  durationChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  durationChipText: {
    color: '#B42323',
    fontSize: 12,
    fontWeight: '800',
  },
  conventionSection: {
    gap: 8,
  },
  convHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  convHeaderText: {
    fontSize: 11,
    fontWeight: '700',
  },
  convCardsRow: {
    gap: 8,
  },
  convButton: {
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  convTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  convName: {
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  convTimeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B42323',
  },
  convBalidan: {
    fontSize: 10,
    fontWeight: '600',
  },
  timingBoxesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timingBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  timingBoxLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  timingBoxValue: {
    fontSize: 12,
    fontWeight: '900',
  },
  tithisSection: {
    gap: 12,
  },
  tithisGrid: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tithiCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  tithiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tithiBadge: {
    backgroundColor: 'rgba(180, 35, 35, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tithiBadgeText: {
    color: '#B42323',
    fontSize: 10,
    fontWeight: '800',
  },
  tithiDate: {
    fontSize: 11,
    fontWeight: '600',
  },
  tithiTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  timingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  timingPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tithiDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  kaliBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginTop: 6,
    elevation: 2,
  },
  kaliBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(147, 51, 234, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kaliBannerTextCol: {
    flex: 1,
  },
  kaliBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  kaliBannerSubtitle: {
    fontSize: 11.5,
    lineHeight: 15,
  },
});
