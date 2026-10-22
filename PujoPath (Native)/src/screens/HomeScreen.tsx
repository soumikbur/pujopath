import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { PujoBackground } from '@/components/PujoBackground';

import { useResponsive } from '@/hooks/useResponsive';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const isBn = language === 'bn';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, tabScrollBottomPadding, width } = useResponsive();

  const quickAccessItems = useMemo(
    () => [
      {
        screen: 'Map',
        label: isBn ? 'মানচিত্র' : 'Map',
        desc: isBn ? 'সব প্যান্ডেল একসঙ্গে দেখুন' : 'See all pandals at a glance',
        icon: 'location' as const,
        color: '#B42323',
      },
      {
        screen: 'Planner',
        label: isBn ? 'রুট প্ল্যানার' : 'Route Planner',
        desc: isBn ? 'স্মার্ট পরিক্রমা তৈরি করুন' : 'Optimize your hopping trail',
        icon: 'git-network' as const,
        color: '#0D9488',
      },
      {
        screen: 'Metro',
        label: isBn ? 'মেট্রো গাইড' : 'Metro Guide',
        desc: isBn ? 'কাছের স্টেশন খুঁজুন' : 'Find nearest metro stations',
        icon: 'subway' as const,
        color: '#2563EB',
      },
      {
        screen: 'Calendar',
        label: isBn ? 'পঞ্জিকা' : 'Calendar',
        desc: isBn ? 'পুজোর তিথি ও শুভ সময়' : 'Auspicious tithis and hours',
        icon: 'calendar' as const,
        color: '#EA580C',
      },
      {
        screen: 'Music',
        label: isBn ? 'শারদীয়া সঙ্গীত' : 'Puja Music',
        desc: isBn ? 'চণ্ডীপাঠ ও ঢাকের বোল' : 'Chandi Path & Dhak beats',
        icon: 'musical-notes' as const,
        color: '#7C3AED',
      },
      {
        screen: 'Mahalaya',
        label: isBn ? 'মহালয়া' : 'Mahalaya',
        desc: isBn ? 'বীরেন্দ্রকৃষ্ণ ভদ্রের চণ্ডীপাঠ' : 'Timeless dawn broadcast',
        icon: 'sparkles' as const,
        color: '#D97706',
      },
    ],
    [isBn]
  );

  const highlights = useMemo(
    () => [
      {
        title: isBn ? 'ঐতিহ্য ও মণ্ডপ শিল্পকলা' : 'Traditions & Pandal Art',
        desc: isBn
          ? 'শতবর্ষের বনেদি বাড়ির পুজো ও কলকাতার সেরা সৃজনশীল শিল্পকর্ম।'
          : "Discover Bengal's timeless heritage celebrations and creative installations.",
        image: require('../../assets/images/pandals/sovabazar-rajbari.webp'),
        screen: 'Explore',
        badge: isBn ? 'ঐতিহ্য ও শিল্প' : 'Traditions & Art',
      },
      {
        title: isBn ? 'পুজোর নির্ঘণ্ট ও পঞ্জিকা' : 'Sacred Almanac & Timings',
        desc: isBn
          ? 'মহাষ্টমীর সন্ধিপূজা, পুষ্পাঞ্জলি ও তিথির সঠিক সময়সূচি।'
          : 'Accurate Ashtami Sandhi Puja, Pushpanjali, and tithi timings.',
        image: require('../../assets/images/pandals/bagbazar-sarbojanin.webp'),
        screen: 'Calendar',
        badge: isBn ? 'পঞ্জিকা' : 'Almanac',
      },
      {
        title: isBn ? 'সন্ধ্যায় পুজো পরিক্রমা' : 'Pujo Evenings & Routes',
        desc: isBn
          ? 'আলোকসজ্জা ও রাতের মণ্ডপ দর্শন সহজে পরিকল্পনা করুন।'
          : 'Plan your route for the best evening hopping and illumination.',
        image: require('../../assets/images/pandals/college-square.webp'),
        screen: 'Planner',
        badge: isBn ? 'পরিক্রমা' : 'Routes',
      },
    ],
    [isBn]
  );

  const toggleLanguageCallback = useCallback(() => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  }, [language, setLanguage]);

  const navigateSavedCallback = useCallback(() => {
    navigation.navigate('Saved');
  }, [navigation]);

  const featurePills = useMemo(
    () => [
      {
        icon: 'sparkles' as const,
        title: isBn ? 'অতি সহজ' : 'Ultra Simple',
        desc: isBn ? 'শুধু প্রয়োজনীয় জিনিস' : 'Only what you need',
        onPress: undefined,
      },
      {
        icon: 'flash' as const,
        title: isBn ? 'দ্রুত ও মসৃণ' : 'Lightning Fast',
        desc: isBn ? 'মসৃণ অভিজ্ঞতা' : 'Smooth experience',
        onPress: undefined,
      },
      {
        icon: 'phone-portrait' as const,
        title: isBn ? 'সব ডিভাইসে উপযোগী' : 'Fully Responsive',
        desc: isBn ? 'সব ডিভাইসে' : 'All devices',
        onPress: undefined,
      },
      {
        icon: isDark ? ('sunny' as const) : ('moon' as const),
        title: isDark ? (isBn ? 'লাইট মোড' : 'Light Mode') : (isBn ? 'ডার্ক মোড' : 'Dark Mode'),
        desc: isBn ? 'ক্লিক করে বদলান' : 'Click to toggle',
        onPress: toggleTheme,
      },
      {
        icon: 'language' as const,
        title: isBn ? 'বাংলা ও ইংরেজি' : 'Bengali & English',
        desc: isBn ? 'ভাষা পরিবর্তন করুন' : 'Click to toggle',
        onPress: toggleLanguageCallback,
      },
      {
        icon: 'heart' as const,
        title: isBn ? 'প্রিয় প্যান্ডেল' : 'Saved Trails',
        desc: isBn ? 'পছন্দের তালিকা' : 'Saved favorites',
        onPress: navigateSavedCallback,
      },
    ],
    [isBn, isDark, toggleTheme, toggleLanguageCallback, navigateSavedCallback]
  );

  const availableContentWidth = width - screenPaddingLeft - screenPaddingRight;
  const portraitTwoColWidth = Math.floor((availableContentWidth - 12) / 2);

  const quickCardWidth = isLandscape
    ? (width >= 960 ? '15.4%' : '31.8%')
    : portraitTwoColWidth;

  const pillCardWidth = isLandscape
    ? (width >= 960 ? '15.5%' : '31.8%')
    : portraitTwoColWidth;

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {/* Background layer with Durga watercolor & radial vignette */}
      <PujoBackground isHomepage={true} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
            paddingTop: isLandscape ? 12 : 16,
            paddingBottom: tabScrollBottomPadding,
            gap: isLandscape ? 16 : 24,
            maxWidth: isLandscape ? 920 : undefined,
            alignSelf: isLandscape ? 'center' : undefined,
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* 1. HERO SHOWCASE WITH COMPACT HORIZONTAL LAYOUT IN LANDSCAPE */}
        {/* ========================================================= */}
        <View
          style={[
            styles.heroSection,
            isLandscape && styles.heroSectionLandscape,
            {
              backgroundColor: isDark ? 'rgba(26, 22, 19, 0.92)' : 'rgba(255, 255, 255, 0.92)',
              borderColor: colors.border,
            },
          ]}
        >
          {/* Left Text Column */}
          <View style={isLandscape ? styles.heroTextColLandscape : undefined}>
            {/* "Puja is live" Badge */}
            <View
              style={[
                styles.liveBadge,
                isLandscape && { marginBottom: 6, paddingVertical: 3, paddingHorizontal: 9 },
                {
                  backgroundColor: isDark ? '#341B18' : '#FBE8E6',
                  borderColor: isDark ? '#4D221E' : '#F5C6C2',
                },
              ]}
            >
              <Ionicons name="calendar-outline" size={12} color={isDark ? '#FF8787' : '#A61C1C'} />
              <Text style={[styles.liveBadgeText, { color: isDark ? '#FF8787' : '#A61C1C' }, isLandscape && { fontSize: 10 }]}>
                {isBn ? 'পুজো চলছে' : 'Puja is live'}
              </Text>
            </View>

            {/* Heading */}
            <Text
              style={[
                styles.heroHeading,
                { color: isDark ? '#FAF6F0' : '#1A1715' },
                isLandscape && { fontSize: 20, lineHeight: 25 },
              ]}
            >
              {isBn ? 'আপনার পুজো, সহজভাবে।' : 'Your Puja, made simple.'}
            </Text>

            {/* Subtitle */}
            <Text
              style={[
                styles.heroSubheading,
                { color: isDark ? '#CDC1B5' : '#4A4039' },
                isLandscape && { fontSize: 12.5, lineHeight: 17, marginTop: 4 },
              ]}
            >
              {isBn
                ? 'পছন্দের প্যান্ডেল খুঁজুন, রুট বানান, আর নিশ্চিন্তে বেরিয়ে পড়ুন।'
                : 'Find the pandals you love, build a route, and head out with confidence.'}
            </Text>
          </View>

          {/* CTA Buttons */}
          <View style={[styles.heroButtonRow, isLandscape && styles.heroButtonRowLandscape]}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Explore')}
              style={[styles.heroPrimaryBtn, isLandscape && styles.heroBtnLandscape]}
            >
              <Ionicons name="search" size={14} color="#FFFFFF" />
              <Text style={styles.heroPrimaryBtnText}>
                {isBn ? 'প্যান্ডেল খুঁজুন' : 'Find pandals'}
              </Text>
              <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Planner')}
              style={[
                styles.heroSecondaryBtn,
                isLandscape && styles.heroBtnLandscape,
                {
                  backgroundColor: isDark ? '#201B17' : '#FFFFFF',
                  borderColor: isDark ? '#3C342C' : '#D2C7BC',
                },
              ]}
            >
              <Ionicons name="navigate" size={14} color="#B42323" />
              <Text style={[styles.heroSecondaryBtnText, { color: isDark ? '#FAF6F0' : '#1C1917' }]}>
                {isBn ? 'রুট তৈরি করুন' : 'Build a route'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2. QUICK ACCESS MULTI-COLUMN GRID (3 COLS IN LANDSCAPE)   */}
        {/* ========================================================= */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            {isBn ? 'দ্রুত প্রবেশ' : 'Quick Access'}
          </Text>

          <View style={styles.quickAccessGrid}>
            {quickAccessItems.map((item) => (
              <TouchableOpacity
                key={item.screen}
                activeOpacity={0.82}
                onPress={() => navigation.navigate(item.screen)}
                style={[
                  styles.quickCard,
                  {
                    width: quickCardWidth,
                    backgroundColor: isDark ? 'rgba(26, 22, 19, 0.90)' : 'rgba(255, 255, 255, 0.90)',
                    borderColor: colors.border,
                  },
                  isLandscape && { minHeight: 88, padding: 11 },
                ]}
              >
                <View
                  style={[
                    styles.quickIconBox,
                    { backgroundColor: `${item.color}15` },
                    isLandscape && { width: 34, height: 34, borderRadius: 10 },
                  ]}
                >
                  <Ionicons name={item.icon} size={isLandscape ? 18 : 20} color={item.color} />
                </View>

                <View style={[styles.quickTextContainer, isLandscape && { marginTop: 6 }]}>
                  <Text
                    style={[
                      styles.quickCardTitle,
                      { color: colors.textPrimary },
                      isLandscape && { fontSize: 12.5 },
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.quickCardDesc,
                      { color: colors.textMuted },
                      isLandscape && { fontSize: 9.5 },
                    ]}
                    numberOfLines={1}
                  >
                    {item.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2.5 KALI PUJA SPECIAL FESTIVAL CARD                       */}
        {/* ========================================================= */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('KaliPuja')}
          style={[
            styles.kaliPujaCard,
            isLandscape && styles.kaliPujaCardLandscape,
            {
              backgroundColor: isDark ? '#1C1026' : '#2D1236',
              borderColor: isDark ? '#3D244F' : '#4C1D58',
            },
          ]}
          accessibilityLabel="Open Kali Puja Special"
        >
          {isLandscape ? (
            <View style={styles.kaliLandscapeRow}>
              <View style={styles.kaliLandscapeLeft}>
                <View style={styles.kaliCardHeaderRow}>
                  <View style={styles.kaliBadge}>
                    <Ionicons name="flame" size={13} color="#FBBF24" />
                    <Text style={styles.kaliBadgeText}>
                      {isBn ? 'আসন্ন উৎসব ২০২৬' : 'UPCOMING FESTIVAL 2026'}
                    </Text>
                  </View>
                  <View style={styles.kaliDatePill}>
                    <Text style={styles.kaliDatePillText}>
                      {isBn ? 'রবিবার, ৮ নভেম্বর' : 'Sun, Nov 8'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.kaliCardTitle, { fontSize: 16, marginBottom: 2 }]}>
                  {isBn ? 'কালীপূজা ও দীপাবলি ২০২৬' : 'Kali Puja & Deepavali 2026'}
                </Text>

                <Text style={[styles.kaliCardDesc, { marginBottom: 0, fontSize: 11.5, lineHeight: 16 }]} numberOfLines={2}>
                  {isBn
                    ? 'কার্তিক অমাবস্যার পুণ্য তিথি, মহানিশার নিশীথ কাল পূজা লগ্ন এবং ঐতিহ্যবাহী রীতিসমূহ জানুন।'
                    : 'Explore Kartik Amavasya tithis, verified midnight Nishita Kaal muhurat & sacred traditions.'}
                </Text>
              </View>

              <View style={styles.kaliLandscapeRight}>
                <View style={styles.kaliActionBtn}>
                  <Text style={styles.kaliActionText}>
                    {isBn ? 'নির্ঘণ্ট দেখুন' : 'Explore Timings'}
                  </Text>
                  <Ionicons name="arrow-forward" size={13} color="#FBBF24" />
                </View>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.kaliCardHeaderRow}>
                <View style={styles.kaliBadge}>
                  <Ionicons name="flame" size={13} color="#FBBF24" />
                  <Text style={styles.kaliBadgeText}>
                    {isBn ? 'আসন্ন উৎসব ২০২৬' : 'UPCOMING FESTIVAL 2026'}
                  </Text>
                </View>
                <View style={styles.kaliDatePill}>
                  <Text style={styles.kaliDatePillText}>
                    {isBn ? 'রবিবার, ৮ নভেম্বর' : 'Sun, Nov 8'}
                  </Text>
                </View>
              </View>

              <Text style={styles.kaliCardTitle}>
                {isBn ? 'কালীপূজা ও দীপাবলি ২০২৬' : 'Kali Puja & Deepavali 2026'}
              </Text>

              <Text style={styles.kaliCardDesc}>
                {isBn
                  ? 'কার্তিক অমাবস্যার পুণ্য তিথি, মহানিশার নিশীথ কাল পূজা লগ্ন এবং ঐতিহ্যবাহী রীতিসমূহ জানুন।'
                  : 'Explore Kartik Amavasya tithis, verified midnight Nishita Kaal muhurat & sacred traditions.'}
              </Text>

              <View style={styles.kaliActionRow}>
                <Text style={styles.kaliActionText}>
                  {isBn ? 'নির্ঘণ্ট ও সময়সূচী দেখুন' : 'Explore Dates & Timings'}
                </Text>
                <Ionicons name="arrow-forward" size={13} color="#FBBF24" />
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* ========================================================= */}
        {/* 3. PUJA HIGHLIGHTS (3 COLUMNS IN LANDSCAPE)               */}
        {/* ========================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.highlightsHeaderRow}>
            <View>
              <View style={styles.sparkleRow}>
                <Text style={styles.sparkleIcon}>✣</Text>
                <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                  {isBn ? 'পূজার বিশেষ আকর্ষণ' : 'Puja Highlights'}
                </Text>
              </View>
              <Text style={[styles.sectionSubtext, { color: colors.textMuted }]}>
                {isBn ? 'বাংলার দুর্গাপূজা সংস্কৃতির একটি ঝলক' : "A glimpse of Bengal's Durga Puja culture"}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Explore')}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>{isBn ? 'সব দেখুন' : 'View all'}</Text>
              <Ionicons name="arrow-forward" size={13} color="#B42323" />
            </TouchableOpacity>
          </View>

          <View style={[styles.highlightsList, isLandscape && styles.highlightsListLandscape]}>
            {highlights.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(item.screen)}
                style={[
                  styles.highlightCard,
                  isLandscape && styles.highlightCardLandscape,
                  {
                    backgroundColor: isDark ? 'rgba(26, 22, 19, 0.90)' : 'rgba(255, 255, 255, 0.90)',
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Image with Badge */}
                <View style={[styles.highlightImgWrapper, isLandscape && styles.highlightImgWrapperLandscape]}>
                  <Image source={item.image} style={styles.highlightImg} resizeMode="cover" />
                  <View style={styles.highlightBadge}>
                    <Text style={styles.highlightBadgeText}>{item.badge}</Text>
                  </View>
                </View>

                {/* Content */}
                <View style={[styles.highlightContent, isLandscape && { marginTop: 6 }]}>
                  <Text
                    style={[
                      styles.highlightTitle,
                      { color: colors.textPrimary },
                      isLandscape && { fontSize: 12 },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.highlightDesc,
                      { color: colors.textMuted },
                      isLandscape && { fontSize: 10, lineHeight: 14 },
                    ]}
                    numberOfLines={2}
                  >
                    {item.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ========================================================= */}
        {/* 4. FEATURE FOOTER PILLS (3 OR 6 COLUMNS IN LANDSCAPE)     */}
        {/* ========================================================= */}
        <View style={styles.pillsGrid}>
          {featurePills.map((pill, idx) => {
            const isClickable = Boolean(pill.onPress);
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={isClickable ? 0.8 : 1}
                onPress={pill.onPress}
                disabled={!isClickable}
                style={[
                  styles.pillCard,
                  {
                    width: pillCardWidth,
                    backgroundColor: isDark ? 'rgba(26, 22, 19, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.pillIconBox}>
                  <Ionicons name={pill.icon} size={14} color="#D52F2F" />
                </View>
                <View style={styles.pillTextContainer}>
                  <Text style={[styles.pillTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {pill.title}
                  </Text>
                  <Text style={[styles.pillDesc, { color: colors.textMuted }]} numberOfLines={1}>
                    {pill.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ========================================================= */}
        {/* 5. FOOTER CREDIT LINE                                     */}
        {/* ========================================================= */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Developer')}
          style={styles.footerContainer}
        >
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            {isBn ? 'নির্মাণে সৌমিক ও মৌমিতা with ' : 'Made by Soumik & Moumita with '}
            <Text style={{ color: '#E02424' }}>❤️</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
    gap: 20,
  },
  heroSection: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroSectionLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  heroTextColLandscape: {
    flex: 1,
  },
  heroButtonRowLandscape: {
    flexDirection: 'column',
    width: 190,
    marginTop: 0,
    gap: 8,
  },
  heroBtnLandscape: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  liveBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroHeading: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 33,
  },
  heroSubheading: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    lineHeight: 20,
  },
  heroButtonRow: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
    marginTop: 20,
    width: '100%',
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B42323',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 7,
    shadowColor: '#B42323',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  heroPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  heroSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 7,
  },
  heroSecondaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  sectionContainer: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSubtext: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 104,
  },
  quickIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTextContainer: {
    marginTop: 10,
  },
  quickCardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  quickCardDesc: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
    lineHeight: 15,
  },
  highlightsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sparkleIcon: {
    color: '#B42323',
    fontSize: 17,
    fontWeight: '900',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#B42323',
    fontSize: 12,
    fontWeight: '800',
  },
  highlightsList: {
    gap: 12,
  },
  highlightsListLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  highlightCardLandscape: {
    width: '31.8%',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,
  },
  highlightImgWrapper: {
    width: 96,
    height: 74,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  highlightImgWrapperLandscape: {
    width: '100%',
    height: 90,
  },
  highlightImg: {
    width: '100%',
    height: '100%',
  },
  highlightBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  highlightBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  highlightContent: {
    flex: 1,
    gap: 3,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  highlightDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  pillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  pillIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(213, 47, 47, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTextContainer: {
    flex: 1,
  },
  pillTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  pillDesc: {
    fontSize: 10,
    marginTop: 2,
  },
  kaliPujaCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  kaliCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  kaliBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  kaliBadgeText: {
    color: '#FBBF24',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  kaliDatePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  kaliDatePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  kaliCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  kaliCardDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 12,
  },
  kaliActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  kaliActionText: {
    color: '#FBBF24',
    fontSize: 12.5,
    fontWeight: '700',
  },
  kaliPujaCardLandscape: {
    padding: 14,
  },
  kaliLandscapeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  kaliLandscapeLeft: {
    flex: 1,
  },
  kaliLandscapeRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  kaliActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  footerContainer: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(238, 232, 225, 0.6)',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
