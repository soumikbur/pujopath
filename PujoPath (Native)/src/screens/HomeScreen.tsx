import React from 'react';
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

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const isBn = language === 'bn';

  const quickAccessItems = [
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
  ];

  const highlights = [
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
  ];

  const featurePills = [
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
      onPress: () => setLanguage(language === 'en' ? 'bn' : 'en'),
    },
    {
      icon: 'heart' as const,
      title: isBn ? 'প্রিয় প্যান্ডেল' : 'Saved Trails',
      desc: isBn ? 'পছন্দের তালিকা' : 'Saved favorites',
      onPress: () => navigation.navigate('Saved'),
    },
  ];

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {/* Background layer with Durga watercolor & radial vignette */}
      <PujoBackground isHomepage={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* 1. HERO SHOWCASE WITH BADGE, TITLE & DUAL CTA BUTTONS     */}
        {/* ========================================================= */}
        <View
          style={[
            styles.heroSection,
            {
              backgroundColor: isDark ? 'rgba(26, 22, 19, 0.92)' : 'rgba(255, 255, 255, 0.92)',
              borderColor: colors.border,
            },
          ]}
        >
          {/* "Puja is live" Badge */}
          <View
            style={[
              styles.liveBadge,
              {
                backgroundColor: isDark ? '#341B18' : '#FBE8E6',
                borderColor: isDark ? '#4D221E' : '#F5C6C2',
              },
            ]}
          >
            <Ionicons name="calendar-outline" size={13} color={isDark ? '#FF8787' : '#A61C1C'} />
            <Text style={[styles.liveBadgeText, { color: isDark ? '#FF8787' : '#A61C1C' }]}>
              {isBn ? 'পুজো চলছে' : 'Puja is live'}
            </Text>
          </View>

          {/* Heading */}
          <Text style={[styles.heroHeading, { color: isDark ? '#FAF6F0' : '#1A1715' }]}>
            {isBn ? 'আপনার পুজো, সহজভাবে।' : 'Your Puja, made simple.'}
          </Text>

          {/* Subtitle */}
          <Text style={[styles.heroSubheading, { color: isDark ? '#CDC1B5' : '#4A4039' }]}>
            {isBn
              ? 'পছন্দের প্যান্ডেল খুঁজুন, রুট বানান, আর নিশ্চিন্তে বেরিয়ে পড়ুন।'
              : 'Find the pandals you love, build a route, and head out with confidence.'}
          </Text>

          {/* CTA Buttons */}
          <View style={styles.heroButtonRow}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Explore')}
              style={styles.heroPrimaryBtn}
            >
              <Ionicons name="search" size={15} color="#FFFFFF" />
              <Text style={styles.heroPrimaryBtnText}>
                {isBn ? 'প্যান্ডেল খুঁজুন' : 'Find pandals'}
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Planner')}
              style={[
                styles.heroSecondaryBtn,
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
        {/* 2. QUICK ACCESS 6-ITEM GRID                               */}
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
                    backgroundColor: isDark ? 'rgba(26, 22, 19, 0.90)' : 'rgba(255, 255, 255, 0.90)',
                    borderColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.quickIconBox,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>

                <View style={styles.quickTextContainer}>
                  <Text style={[styles.quickCardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Text style={[styles.quickCardDesc, { color: colors.textMuted }]} numberOfLines={1}>
                    {item.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ========================================================= */}
        {/* 3. PUJA HIGHLIGHTS (TRADITIONS, ALMANAC, ROUTES)          */}
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

          <View style={styles.highlightsList}>
            {highlights.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(item.screen)}
                style={[
                  styles.highlightCard,
                  {
                    backgroundColor: isDark ? 'rgba(26, 22, 19, 0.90)' : 'rgba(255, 255, 255, 0.90)',
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Left Image with Badge */}
                <View style={styles.highlightImgWrapper}>
                  <Image source={item.image} style={styles.highlightImg} resizeMode="cover" />
                  <View style={styles.highlightBadge}>
                    <Text style={styles.highlightBadgeText}>{item.badge}</Text>
                  </View>
                </View>

                {/* Right Content */}
                <View style={styles.highlightContent}>
                  <Text style={[styles.highlightTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.highlightDesc, { color: colors.textMuted }]} numberOfLines={2}>
                    {item.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ========================================================= */}
        {/* 4. FEATURE FOOTER PILLS (ULTRA SIMPLE, LIGHTNING FAST...)  */}
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
    gap: 10,
  },
  quickCard: {
    width: '48.3%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 13,
    justifyContent: 'space-between',
    minHeight: 100,
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
    fontSize: 13,
    fontWeight: '800',
  },
  quickCardDesc: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  highlightsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
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
    gap: 10,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
    gap: 12,
  },
  highlightImgWrapper: {
    width: 90,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  highlightImg: {
    width: '100%',
    height: '100%',
  },
  highlightBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  highlightBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  highlightContent: {
    flex: 1,
    gap: 2,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  highlightDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  pillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  pillCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 9,
    gap: 8,
  },
  pillIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(213, 47, 47, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTextContainer: {
    flex: 1,
  },
  pillTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  pillDesc: {
    fontSize: 9,
    marginTop: 1,
  },
  footerContainer: {
    paddingVertical: 14,
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
