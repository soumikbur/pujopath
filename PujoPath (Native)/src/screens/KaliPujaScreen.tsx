import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';
import {
  AVAILABLE_KALI_PUJA_YEARS,
  getKaliPujaSchedule,
  KALI_PUJA_TRADITIONS,
  KALI_PRANAM_MANTRA,
} from '@/data/calendar/kaliPuja';

interface KaliPujaScreenProps {
  navigation: any;
}

export const KaliPujaScreen: React.FC<KaliPujaScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, stackScrollBottomPadding } = useResponsive();

  // Selected year state (defaulting to 2026, matching PujoPath's active festive calendar)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const schedule = getKaliPujaSchedule(selectedYear);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
            paddingBottom: stackScrollBottomPadding + 28,
            maxWidth: isLandscape ? 860 : undefined,
            alignSelf: isLandscape ? 'center' : undefined,
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* 1. HERO BANNER: KALI PUJA MAHATMYA                        */}
        {/* ========================================================= */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: isDark ? '#140C24' : '#FAF5FF',
              borderColor: isDark ? '#3D244F' : '#E9D5FF',
            },
          ]}
        >
          {/* Top Badge */}
          <View style={styles.heroTopRow}>
            <View style={[styles.heroBadge, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.15)' : '#FEF3C7', borderColor: isDark ? 'rgba(251, 191, 36, 0.4)' : '#FCD34D' }]}>
              <Ionicons name="flame" size={14} color={isDark ? '#FBBF24' : '#D97706'} />
              <Text style={[styles.heroBadgeText, { color: isDark ? '#FDE68A' : '#92400E' }]}>
                {isBn ? 'দীপান্বিতা অমাবস্যা' : 'DIPANWITA AMAVASYA'}
              </Text>
            </View>
            <View style={[styles.heroYearBadge, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#EDE9FE' }]}>
              <Text style={[styles.heroYearBadgeText, { color: isDark ? '#FFFFFF' : '#6B21A8' }]}>{selectedYear}</Text>
            </View>
          </View>

          {/* Title and Bengali Subtitle */}
          <Text style={[styles.heroTitle, { color: isDark ? '#FFFFFF' : '#2E1065' }]}>
            {isBn ? 'মা শ্যামা পূজা ও দীপাবলি' : 'Sacred Kali Puja'}
          </Text>
          <Text style={[styles.heroBengaliTitle, { color: isDark ? '#E9D5FF' : '#7E22CE' }]}>
            {isBn ? 'অন্ধকার বিনাশিনী আদ্যাশক্তি মহামায়ার আরাধনা' : 'Shyama Puja • Adoration of Adya Shakti'}
          </Text>

          {/* Significance Paragraph */}
          <Text style={[styles.heroDescription, { color: isDark ? '#DDD2E8' : '#4C3565' }]}>
            {isBn
              ? 'কার্তিক মাসের অমাবস্যার পুণ্য মহানিশায় অনুষ্ঠিত হয় দেবী কালিকার আরাধনা। অশুভ শক্তি ও অন্ধকার বিনাশ করে জ্ঞান ও আলোর প্রতিষ্ঠায় মা শ্যামার পূজা বাঙালির অন্যতম প্রধান পরম পূত উৎসব।'
              : 'Celebrated on the sacred new moon night of the Kartik month (Mahanisha), Kali Puja honors Goddess Shyama, the fierce protector against evil and ignorance. Coinciding with Diwali, Bengal lights up with millions of earthen lamps (pradips) celebrating the triumph of divine righteousness.'}
          </Text>

          {/* Location & Timezone Indicator */}
          <View style={styles.locationTagRow}>
            <Ionicons name="location-outline" size={13} color={isDark ? '#E9D5FF' : '#7E22CE'} />
            <Text style={[styles.locationTagText, { color: isDark ? '#E9D5FF' : '#7E22CE' }]}>
              {isBn ? schedule.locationBn : schedule.location}
            </Text>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2. YEAR SELECTOR CHIPS                                    */}
        {/* ========================================================= */}
        <View
          style={[
            styles.yearSelectorCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <View style={styles.yearSelectorHeader}>
            <View style={styles.yearLabelRow}>
              <Feather name="calendar" size={14} color={colors.textSecondary} />
              <Text style={[styles.yearSelectorLabel, { color: colors.textPrimary }]}>
                {isBn ? 'বছর নির্বাচন করুন:' : 'Select Festival Year:'}
              </Text>
            </View>
            <View
              style={[
                styles.verifiedTag,
                {
                  backgroundColor: schedule.verified
                    ? isDark
                      ? 'rgba(16, 185, 129, 0.15)'
                      : '#ECFDF5'
                    : isDark
                    ? 'rgba(245, 158, 11, 0.15)'
                    : '#FFFBEB',
                  borderColor: schedule.verified ? '#10B981' : '#F59E0B',
                },
              ]}
            >
              <Ionicons
                name={schedule.verified ? 'checkmark-circle' : 'time-outline'}
                size={12}
                color={schedule.verified ? '#10B981' : '#F59E0B'}
              />
              <Text
                style={[
                  styles.verifiedTagText,
                  { color: schedule.verified ? '#10B981' : '#D97706' },
                ]}
              >
                {schedule.verified
                  ? isBn
                    ? 'বিশুদ্ধ পঞ্জিকা নির্ঘণ্ট'
                    : 'Verified Panjika'
                  : isBn
                  ? 'সাময়িক সময়সূচী'
                  : 'Provisional'}
              </Text>
            </View>
          </View>

          <View style={styles.yearChipsRow}>
            {AVAILABLE_KALI_PUJA_YEARS.map((yr) => {
              const isSelected = yr === selectedYear;
              return (
                <TouchableOpacity
                  key={yr}
                  style={[
                    styles.yearChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : isDark
                        ? '#1C1438'
                        : '#FAF5FF',
                      borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    },
                  ]}
                  onPress={() => setSelectedYear(yr)}
                  activeOpacity={0.8}
                  accessibilityLabel={`Select year ${yr}`}
                >
                  <Text
                    style={[
                      styles.yearChipText,
                      { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    {yr}
                  </Text>
                  {yr === 2026 && (
                    <View
                      style={[
                        styles.yearDotBadge,
                        { backgroundColor: isSelected ? '#FBBF24' : colors.primary },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ========================================================= */}
        {/* 3. DEDICATED NISHITA KAAL & PUJA TIMINGS CARD             */}
        {/* ========================================================= */}
        <View
          style={[
            styles.timingCard,
            {
              backgroundColor: isDark ? '#1C1510' : '#FFF9F5',
              borderColor: isDark ? 'rgba(217, 119, 6, 0.45)' : 'rgba(217, 119, 6, 0.35)',
            },
          ]}
        >
          <View style={[styles.timingHeader, { borderBottomColor: isDark ? '#332317' : '#FDE8D7' }]}>
            <View style={styles.timingIconWrap}>
              <Ionicons name="moon" size={20} color="#F59E0B" />
            </View>
            <View style={styles.timingTitleWrap}>
              <View style={styles.timingBadgeRow}>
                <View style={styles.muhuratBadge}>
                  <Text style={styles.muhuratBadgeText}>
                    {isBn ? 'প্রধান নিশীথ লগ্ন' : 'PRIMARY PUJA MUHURAT'}
                  </Text>
                </View>
                <Text style={[styles.applicableNightText, { color: colors.textSecondary }]}>
                  {isBn ? schedule.nishitaKaalPuja.applicableNightBn : schedule.nishitaKaalPuja.applicableNight}
                </Text>
              </View>
              <Text style={[styles.timingCardTitle, { color: colors.textPrimary }]}>
                {isBn ? 'মহানিশা ও নিশীথ কাল পূজা সময়' : 'Mahanisha & Nishita Kaal Timing'}
              </Text>
            </View>
          </View>

          {/* Primary Timing Highlight Box */}
          <View
            style={[
              styles.highlightTimeBox,
              {
                backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : '#FEF3C7',
                borderColor: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
              },
            ]}
          >
            <View style={styles.timeMainRow}>
              <View>
                <Text style={styles.timeLabel}>
                  {isBn ? 'পূজার পুণ্য সময়সীমা (কলকাতা):' : 'Auspicious Window (Kolkata):'}
                </Text>
                <Text style={styles.timeValueText}>
                  {isBn ? schedule.nishitaKaalPuja.windowStringBn : schedule.nishitaKaalPuja.windowString}
                </Text>
              </View>
              {schedule.nishitaKaalPuja.durationMinutes > 0 && (
                <View style={styles.durationPill}>
                  <Feather name="clock" size={12} color="#78350F" />
                  <Text style={styles.durationPillText}>
                    {isBn
                      ? `${schedule.nishitaKaalPuja.durationMinutes} মিনিট`
                      : `${schedule.nishitaKaalPuja.durationMinutes} mins`}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.timeDesc, { color: isDark ? '#D1B89D' : '#78350F' }]}>
              {isBn ? schedule.nishitaKaalPuja.descriptionBn : schedule.nishitaKaalPuja.description}
            </Text>
          </View>

          {/* Amavasya Tithi Details */}
          <View style={styles.tithiRow}>
            <View style={[styles.tithiCol, { borderColor: colors.borderSubtle }]}>
              <Text style={[styles.tithiLabel, { color: colors.textSecondary }]}>
                {isBn ? 'অমাবস্যা তিথি আরম্ভ' : 'Amavasya Begins'}
              </Text>
              <Text style={[styles.tithiTime, { color: colors.textPrimary }]}>
                {isBn ? schedule.amavasyaTithi.beginsBn : schedule.amavasyaTithi.begins}
              </Text>
            </View>

            <View style={[styles.tithiCol, { borderColor: colors.borderSubtle }]}>
              <Text style={[styles.tithiLabel, { color: colors.textSecondary }]}>
                {isBn ? 'অমাবস্যা তিথি সমাপ্তি' : 'Amavasya Ends'}
              </Text>
              <Text style={[styles.tithiTime, { color: colors.textPrimary }]}>
                {isBn ? schedule.amavasyaTithi.endsBn : schedule.amavasyaTithi.ends}
              </Text>
            </View>
          </View>

          {/* Panjika Authority Source Note */}
          <View style={styles.sourceRow}>
            <Feather name="info" size={12} color={colors.textMuted} />
            <Text style={[styles.sourceText, { color: colors.textMuted }]}>
              {isBn
                ? `উৎস: ${schedule.sourceBn} • পঞ্জিকাভেদে মিনিটে সামান্য পার্থক্য হতে পারে।`
                : `Source: ${schedule.source}. Minor minute variations may occur between panjika traditions.`}
            </Text>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 4. CALENDAR DATE & BANGABDA TITHI CARD                    */}
        {/* ========================================================= */}
        <View
          style={[
            styles.dateDetailsCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <View style={styles.dateRow}>
            <View style={styles.dateIconCircle}>
              <Feather name="calendar" size={18} color={colors.primary} />
            </View>
            <View style={styles.dateTextCol}>
              <Text style={[styles.dateHeading, { color: colors.textPrimary }]}>
                {isBn ? schedule.dateStringBn : schedule.dateString}
              </Text>
              <Text style={[styles.bangabdaText, { color: colors.textSecondary }]}>
                {isBn ? schedule.bangabdaYear : schedule.bangabdaYearEn}
              </Text>
            </View>
          </View>

          {/* Bhoot Chaturdashi Preceding Day Note */}
          <View
            style={[
              styles.chaturdashiBox,
              {
                backgroundColor: isDark ? '#231B16' : '#FAF6F0',
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            <View style={styles.chaturdashiHeader}>
              <Ionicons name="flame-outline" size={15} color="#D97706" />
              <Text style={[styles.chaturdashiTitle, { color: colors.textPrimary }]}>
                {isBn ? 'ভূত চতুর্দশী (কালীপূজার পূর্বদিন)' : 'Bhoot Chaturdashi (Preceding Eve)'}
              </Text>
            </View>
            <Text style={[styles.chaturdashiDate, { color: colors.textSecondary }]}>
              {isBn ? schedule.bhootChaturdashi.dateStringBn : schedule.bhootChaturdashi.dateString}
            </Text>
            <Text style={[styles.chaturdashiRituals, { color: colors.textMuted }]}>
              {isBn ? schedule.bhootChaturdashi.ritualsBn : schedule.bhootChaturdashi.rituals}
            </Text>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 5. SACRED KALI PRANAM MANTRA SHLOKA CARD                  */}
        {/* ========================================================= */}
        <View
          style={[
            styles.mantraCard,
            {
              backgroundColor: isDark ? '#1F1426' : '#FAF5FF',
              borderColor: isDark ? 'rgba(147, 51, 234, 0.35)' : 'rgba(147, 51, 234, 0.25)',
            },
          ]}
        >
          <View style={styles.mantraHeader}>
            <MaterialCommunityIcons name="om" size={22} color="#9333EA" />
            <Text style={[styles.mantraHeading, { color: isDark ? '#E9D5FF' : '#581C87' }]}>
              {isBn ? 'শ্রী শ্রী কালী প্রণাম মন্ত্র' : 'Sacred Kali Pranam Mantra'}
            </Text>
          </View>

          <View
            style={[
              styles.shlokaBox,
              {
                backgroundColor: isDark ? '#140D1C' : '#FFFFFF',
                borderColor: isDark ? 'rgba(147, 51, 234, 0.3)' : '#E9D5FF',
              },
            ]}
          >
            <Text style={[styles.shlokaScript, { color: isDark ? '#F5D0FE' : '#6B21A8' }]}>
              {KALI_PRANAM_MANTRA.sanskrit}
            </Text>
            <Text style={[styles.shlokaTranslit, { color: colors.textMuted }]}>
              {KALI_PRANAM_MANTRA.transliteration}
            </Text>
          </View>

          <Text style={[styles.shlokaMeaning, { color: colors.textSecondary }]}>
            {isBn ? KALI_PRANAM_MANTRA.meaningBn : KALI_PRANAM_MANTRA.meaningEn}
          </Text>
        </View>

        {/* ========================================================= */}
        {/* 6. FOUR PILLARS OF KALI PUJA CELEBRATION                  */}
        {/* ========================================================= */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {isBn ? 'কালীপূজার ঐতিহ্য ও রীতি' : 'Traditions & Sacred Rituals'}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            {isBn
              ? 'চৌদ্দ প্রদীপ থেকে মহানিশার সাধনা—বাঙালির চিরায়ত ভক্তি ও আলোক উৎসব'
              : 'From 14 ancestral lamps to midnight Mahanisha worship and citywide illumination'}
          </Text>
        </View>

        <View style={styles.traditionsGrid}>
          {KALI_PUJA_TRADITIONS.map((tradition) => (
            <View
              key={tradition.id}
              style={[
                styles.traditionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.borderSubtle,
                  width: isLandscape ? '48.8%' : '100%',
                },
              ]}
            >
              <View style={styles.traditionHeaderRow}>
                <View
                  style={[
                    styles.traditionIconCircle,
                    { backgroundColor: `${tradition.color}15` },
                  ]}
                >
                  <Ionicons name={tradition.icon} size={18} color={tradition.color} />
                </View>
                <Text style={[styles.traditionTitle, { color: colors.textPrimary }]}>
                  {isBn ? tradition.titleBn : tradition.title}
                </Text>
              </View>
              <Text style={[styles.traditionDesc, { color: colors.textSecondary }]}>
                {isBn ? tradition.descBn : tradition.desc}
              </Text>
            </View>
          ))}
        </View>

        {/* ========================================================= */}
        {/* 7. NOTABLE PILGRIMAGE SHRINES IN KOLKATA                  */}
        {/* ========================================================= */}
        <View
          style={[
            styles.templeCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <View style={styles.templeHeader}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Text style={[styles.templeCardTitle, { color: colors.textPrimary }]}>
              {isBn ? 'কলকাতার প্রধান কালী মন্দির ও তীর্থস্থান' : 'Renowned Kali Pilgrimage Shrines'}
            </Text>
          </View>
          <Text style={[styles.templeCardSubtitle, { color: colors.textSecondary }]}>
            {isBn
              ? 'কালীপূজার রাতে বিশেষ পূজা ও ভক্ত সমাগমের ঐতিহাসিক কেন্দ্রসমূহ:'
              : 'Historical pilgrimage centers attracting thousands on Kali Puja night:'}
          </Text>

          <View style={styles.shrineList}>
            {[
              {
                name: isBn ? 'কালীঘাট সতীপীঠ' : 'Kalighat Kali Temple',
                detail: isBn ? '৫১ পীঠের অন্যতম মহাপীঠ (দক্ষিণ চরণাঙ্গুলি)' : 'One of 51 Shaktipeeths (Right toes of Sati)',
              },
              {
                name: isBn ? 'দক্ষিণেশ্বর ভবতারিণী মন্দির' : 'Dakshineswar Kali Temple',
                detail: isBn ? 'রানি রাসমণি প্রতিষ্ঠিত ও শ্রীরামকৃষ্ণের সাধনাপীঠ' : 'Founded by Rani Rashmoni & seat of Sri Ramakrishna',
              },
              {
                name: isBn ? 'ঠনঠনিয়া সিদ্ধেশ্বরী কালীবাড়ি' : 'Thanthania Kalibari',
                detail: isBn ? '১৭০৩ সালে প্রতিষ্ঠিত উত্তর কলকাতার ঐতিহাসিক মন্দির' : 'Historical North Kolkata shrine established in 1703',
              },
              {
                name: isBn ? 'বারাসাত ও নৈহাটি পূজা পরিক্রমা' : 'Barasat & Naihati Highlights',
                detail: isBn ? 'সুবিশাল আলোকসজ্জা, থিম মণ্ডপ ও বড়মা আরাধনা' : 'Spectacular theme pandals, illumination & Boro Maa',
              },
            ].map((shrine, idx) => (
              <View key={idx} style={[styles.shrineItem, { borderBottomColor: colors.borderSubtle }]}>
                <View style={styles.shrineBullet}>
                  <Text style={styles.shrineBulletText}>•</Text>
                </View>
                <View style={styles.shrineTextWrap}>
                  <Text style={[styles.shrineName, { color: colors.textPrimary }]}>
                    {shrine.name}
                  </Text>
                  <Text style={[styles.shrineDetail, { color: colors.textMuted }]}>
                    {shrine.detail}
                  </Text>
                </View>
              </View>
            ))}
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
    gap: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroBadgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  heroYearBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  heroYearBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroBengaliTitle: {
    color: '#E9D5FF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  heroDescription: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  locationTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    paddingTop: 12,
  },
  locationTagText: {
    color: '#E9D5FF',
    fontSize: 11.5,
    fontWeight: '600',
  },
  yearSelectorCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    elevation: 2,
  },
  yearSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  yearLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  yearSelectorLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  yearChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  yearChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  yearChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  yearDotBadge: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  timingCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    elevation: 3,
  },
  timingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  timingIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timingTitleWrap: {
    flex: 1,
  },
  timingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  muhuratBadge: {
    backgroundColor: '#7E22CE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  muhuratBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  applicableNightText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timingCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  highlightTimeBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  timeMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#78350F',
    marginBottom: 2,
  },
  timeValueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: -0.2,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(120, 53, 15, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350F',
  },
  timeDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  tithiRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  tithiCol: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  tithiLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  tithiTime: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceText: {
    fontSize: 10.5,
    lineHeight: 14,
    flex: 1,
  },
  dateDetailsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  dateIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(180, 35, 35, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTextCol: {
    flex: 1,
  },
  dateHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  bangabdaText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  chaturdashiBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  chaturdashiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  chaturdashiTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  chaturdashiDate: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  chaturdashiRituals: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  mantraCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
  },
  mantraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mantraHeading: {
    fontSize: 16,
    fontWeight: '800',
  },
  shlokaBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  shlokaScript: {
    fontSize: 14.5,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  shlokaTranslit: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 16,
  },
  shlokaMeaning: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  traditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  traditionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    elevation: 2,
  },
  traditionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  traditionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  traditionTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  traditionDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  templeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
  },
  templeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  templeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  templeCardSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  shrineList: {
    gap: 8,
  },
  shrineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  shrineBullet: {
    marginTop: -2,
  },
  shrineBulletText: {
    color: '#7E22CE',
    fontSize: 18,
    fontWeight: '800',
  },
  shrineTextWrap: {
    flex: 1,
  },
  shrineName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  shrineDetail: {
    fontSize: 11.5,
  },
});
