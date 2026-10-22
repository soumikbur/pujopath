import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useFestival } from '@/context/FestivalContext';
import { useResponsive } from '@/hooks/useResponsive';
import { getKaliPujaSchedule } from '@/data/calendar/kaliPuja';

interface KaliHomeScreenProps {
  navigation: any;
}

export const KaliHomeScreen: React.FC<KaliHomeScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { resetFestival } = useFestival();
  const { isLandscape, screenPaddingLeft, screenPaddingRight, tabScrollBottomPadding, width } = useResponsive();

  const schedule2026 = useMemo(() => getKaliPujaSchedule(2026), []);

  const quickAccessItems = useMemo(
    () => [
      {
        screen: 'ExploreTab',
        label: isBn ? 'কালীপূজা মণ্ডপ' : 'Kali Puja Pandals',
        desc: isBn ? 'যাচাইকৃত সর্বজনীন ও ঐতিহাসিক মণ্ডপ' : 'Verified public pandals & heritage shrines',
        icon: 'business' as const,
        color: '#9333EA',
      },
      {
        screen: 'MapTab',
        label: isBn ? 'কালীপূজা মানচিত্র' : 'Kali Puja Map',
        desc: isBn ? 'যাচাইকৃত অবস্থান ও রুট পিন' : 'GPS navigation & pandal pins',
        icon: 'map' as const,
        color: '#2563EB',
      },
      {
        screen: 'KaliPuja',
        label: isBn ? 'পূজার নির্ঘণ্ট ও তিথি' : 'Almanac & Timings',
        desc: isBn ? 'নিশীথ কাল ও শুভ লগ্ন' : 'Nishita Kaal midnight muhurat',
        icon: 'calendar' as const,
        color: '#F59E0B',
      },
      {
        screen: 'KaliMusic',
        label: isBn ? 'শ্যামাসঙ্গীত ও স্তোত্র' : 'Shyama Sangeet',
        desc: isBn ? 'ধ্যানরাগ, আরতি ও ভক্তিগীতি' : 'Sacred raga & temple chants',
        icon: 'musical-notes' as const,
        color: '#DC2626',
      },
      {
        screen: 'KaliExplore',
        label: isBn ? 'ঐতিহাসিক সতীপীঠ' : 'Shaktipeeths',
        desc: isBn ? 'কালীঘাট, দক্ষিণেশ্বর ও বনেদি বাড়ি' : 'Kalighat, Dakshineswar & more',
        icon: 'sparkles' as const,
        color: '#7C3AED',
      },
      {
        action: 'switch_festival',
        label: isBn ? 'উৎসব পরিবর্তন' : 'Switch Festival',
        desc: isBn ? 'শারদীয়া দুর্গাপূজায় ফিরে যান' : 'Return to Durga Puja',
        icon: 'swap-horizontal' as const,
        color: '#7E22CE',
      },
    ],
    [isBn]
  );

  const highlights = useMemo(
    () => [
      {
        title: isBn ? 'কালীপূজা মণ্ডপ পরিক্রমা' : 'Kali Puja Pandal Guide',
        desc: isBn
          ? 'পাইওনিয়ার, নবপল্লী, রেজিমেন্ট, সন্ধানী ও বিখ্যাত সর্বজনীন শ্যামাপূজা পরিক্রমা।'
          : 'Pioneer Park, Nabapally, Regiment, Sandhani and top public Kali Puja pandals.',
        image: require('../../assets/images/kali-hero.jpg'),
        screen: 'ExploreTab',
        badge: isBn ? 'মণ্ডপ পরিক্রমা' : 'Pandal Guide',
      },
      {
        title: isBn ? 'নিশীথ কাল মহানির্ঘণ্ট ২০২৬' : 'Sacred Midnight Muhurat 2026',
        desc: isBn
          ? `অমাবস্যা তিথি: ${schedule2026.amavasyaTithi.durationBn}। নিশীথ কাল পূজা মুহুর্ত: ${schedule2026.nishitaKaalPuja.windowStringBn}।`
          : `Amavasya Tithi: ${schedule2026.amavasyaTithi.duration}. Auspicious Midnight Nishita Kaal: ${schedule2026.nishitaKaalPuja.windowString}.`,
        image: require('../../assets/images/kali-miniplayer.jpg'),
        screen: 'KaliPuja',
        badge: isBn ? 'পঞ্জিকা' : 'Almanac',
      },
      {
        title: isBn ? 'ঐতিহাসিক কালীক্ষেত্র ও সতীপীঠ' : 'Revered Shaktipeeths & Shrines',
        desc: isBn
          ? 'শত শত বছরের পবিত্র কালীঘাট মহাপীঠ, রানী রাসমণির দক্ষিণেশ্বর ও ঠনঠনিয়ার জাগ্রত সিদ্ধেশ্বরী কালী।'
          : 'Experience the divine atmosphere of Kalighat Shaktipeeth, Rani Rashmoni’s Dakshineswar, and 300-year-old Thanthania.',
        image: require('../../assets/images/kali-hero.jpg'),
        screen: 'KaliExplore',
        badge: isBn ? 'ঐতিহাসিক তীর্থ' : 'Heritage Shrines',
      },
      {
        title: isBn ? '১৪ প্রদীপ ও আলোকমালা' : '14 Diyas & Sacred Traditions',
        desc: isBn
          ? 'কার্তিক চতুর্দশীর সন্ধ্যায় ১৪ প্রদীপ প্রজ্বলন ও চৌদ্দ শাক ভক্ষণের শতাব্দীপ্রাচীন বঙ্গীয় প্রথা।'
          : 'The timeless Bengal custom of lighting 14 earthen lamps on Bhoot Chaturdashi to welcome ancestral light and ward off darkness.',
        image: require('../../assets/images/kali-hero.jpg'),
        screen: 'KaliPuja',
        badge: isBn ? 'রীতিনীতি' : 'Traditions',
      },
    ],
    [isBn, schedule2026]
  );

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
        {/* ========================================================= */}
        {/* 1. KALI PUJA HERO BANNER                                 */}
        {/* ========================================================= */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: isDark ? '#140C24' : '#FAF5FF',
              borderColor: isDark ? '#3E1C58' : '#E9D5FF',
            },
          ]}
        >
          {/* Background Artwork */}
          <View style={styles.heroArtworkContainer}>
            <Image
              source={require('../../assets/images/kali-hero.jpg')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={[styles.heroVignette, { backgroundColor: isDark ? 'rgba(18, 10, 32, 0.45)' : 'rgba(250, 245, 255, 0.20)' }]} />
          </View>

          {/* Hero Content Overlay */}
          <View style={styles.heroContent}>
            <View style={styles.heroTopRow}>
              <View style={[styles.heroBadge, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.18)' : '#FEF3C7', borderColor: isDark ? 'rgba(251, 191, 36, 0.4)' : '#FCD34D' }]}>
                <Ionicons name="flame" size={13} color={isDark ? '#FBBF24' : '#D97706'} />
                <Text style={[styles.heroBadgeText, { color: isDark ? '#FDE68A' : '#92400E' }]}>
                  {isBn ? 'দীপান্বিতা অমাবস্যা ২০২৬' : 'DIPANWITA AMAVASYA 2026'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={resetFestival}
                style={[styles.switchPillBtn, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(126, 34, 206, 0.12)' }]}
                activeOpacity={0.8}
                accessibilityLabel="Switch festival"
              >
                <Ionicons name="swap-horizontal" size={12} color={isDark ? '#E9D5FF' : '#7E22CE'} />
                <Text style={[styles.switchPillText, { color: isDark ? '#E9D5FF' : '#7E22CE' }]}>
                  {isBn ? 'উৎসব বদল' : 'Switch'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.heroTitle, { color: isDark ? '#FFFFFF' : '#2E1065' }]}>
              {isBn ? 'মা শ্যামা পূজা ও দীপাবলি' : 'Sacred Kali Puja'}
            </Text>

            <Text style={[styles.heroSubtitle, { color: isDark ? '#E9D5FF' : '#6B21A8' }]}>
              {isBn
                ? 'কার্তিক অমাবস্যার পুণ্য মহানিশায় আদ্যাশক্তির আরাধনা'
                : 'Adoration of Divine Mother Adya Shakti • Festival of Lights'}
            </Text>

            {/* Midnight Muhurat Highlights Strip */}
            <View
              style={[
                styles.muhuratStrip,
                {
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(243, 232, 255, 0.85)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : '#D8B4FE',
                },
              ]}
            >
              <View style={styles.muhuratCol}>
                <Text style={[styles.muhuratLabel, { color: isDark ? '#FDE68A' : '#7E22CE' }]}>
                  {isBn ? 'পূজার দিন' : 'Puja Date'}
                </Text>
                <Text style={[styles.muhuratVal, { color: isDark ? '#FFFFFF' : '#1E152A' }]}>
                  {isBn ? schedule2026.dateStringBn : schedule2026.dateString}
                </Text>
              </View>
              <View style={[styles.muhuratDivider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#D8B4FE' }]} />
              <View style={styles.muhuratCol}>
                <Text style={[styles.muhuratLabel, { color: isDark ? '#FDE68A' : '#7E22CE' }]}>
                  {isBn ? 'নিশীথ কাল (মধ্যরাত)' : 'Nishita Kaal'}
                </Text>
                <Text style={[styles.muhuratVal, { color: isDark ? '#FFFFFF' : '#1E152A' }]}>
                  {isBn ? schedule2026.nishitaKaalPuja.windowStringBn : schedule2026.nishitaKaalPuja.windowString}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2. QUICK ACCESS GRID (6 Responsive Cards)                */}
        {/* ========================================================= */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {isBn ? 'কালীপূজা বিশেষ সূচি' : 'Kali Puja Features'}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            {isBn ? 'আরাধনা ও তথ্য' : 'Devotion & Guide'}
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {quickAccessItems.map((item, idx) => {
            const isSwitch = (item as any).action === 'switch_festival';
            const handlePress = () => {
              if (isSwitch) {
                resetFestival();
              } else if (item.screen) {
                navigation.navigate(item.screen);
              }
            };

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.85}
                onPress={handlePress}
                style={[
                  styles.quickCard,
                  {
                    backgroundColor: isDark ? colors.surface : '#FFFFFF',
                    borderColor: isDark ? colors.border : '#EDE5DC',
                    width: isLandscape ? '31.5%' : '48%',
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <View style={[styles.iconCircle, { backgroundColor: `${item.color}18` }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text
                  style={[styles.quickCardTitle, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                <Text
                  style={[styles.quickCardDesc, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {item.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ========================================================= */}
        {/* 3. SACRED KALI PUJA HIGHLIGHTS                           */}
        {/* ========================================================= */}
        <View style={[styles.sectionHeaderRow, { marginTop: 20 }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {isBn ? 'ঐতিহ্য ও মহিমা' : 'Sacred Highlights'}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            {isBn ? 'শতবর্ষের আরাধনা' : 'Tradition & Lore'}
          </Text>
        </View>

        <View style={[styles.highlightsContainer, isLandscape && styles.highlightsLandscape]}>
          {highlights.map((h, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.9}
              onPress={() => navigation.navigate(h.screen)}
              style={[
                styles.highlightCard,
                isLandscape && styles.highlightCardLandscape,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? colors.border : '#EDE5DC',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={h.title}
            >
              <Image source={h.image} style={styles.highlightImage} resizeMode="cover" />
              <View style={styles.highlightBadge}>
                <Text style={styles.highlightBadgeText}>{h.badge}</Text>
              </View>
              <View style={styles.highlightContent}>
                <Text
                  style={[styles.highlightTitle, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {h.title}
                </Text>
                <Text
                  style={[styles.highlightDesc, { color: colors.textSecondary }]}
                  numberOfLines={3}
                >
                  {h.desc}
                </Text>
                <View style={styles.learnMoreRow}>
                  <Text style={styles.learnMoreText}>
                    {isBn ? 'বিস্তারিত জানুন' : 'Explore Guide'}
                  </Text>
                  <Feather name="arrow-right" size={13} color="#9333EA" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========================================================= */}
        {/* 4. FESTIVAL SWITCH CALLOUT BANNER                        */}
        {/* ========================================================= */}
        <View
          style={[
            styles.switchBanner,
            {
              backgroundColor: isDark ? '#160F2B' : '#FAF5FF',
              borderColor: isDark ? '#372061' : '#E9D5FF',
            },
          ]}
        >
          <View style={styles.switchBannerTextCol}>
            <View style={styles.switchHeaderRow}>
              <Ionicons name="sparkles" size={14} color={isDark ? '#C084FC' : '#7E22CE'} />
              <Text style={[styles.switchBannerTitle, { color: isDark ? '#E9D5FF' : '#6B21A8' }]}>
                {isBn ? 'দুর্গাপূজা উৎসবে যেতে চান?' : 'Want to explore Durga Puja?'}
              </Text>
            </View>
            <Text style={[styles.switchBannerDesc, { color: colors.textSecondary }]}>
              {isBn
                ? '৪৫০+ প্যান্ডেল, রুট প্ল্যানার ও শারদীয়া ঢাকের উৎসবে প্রবেশ করতে ক্লিক করুন।'
                : 'Switch back to the Durga Puja experience with 450+ pandals, routes & music.'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={resetFestival}
            activeOpacity={0.85}
            style={[styles.switchActionBtn, { backgroundColor: isDark ? '#7E22CE' : '#6B21A8' }]}
            accessibilityLabel="Switch to Durga Puja"
          >
            <Text style={styles.switchActionBtnText}>
              {isBn ? 'দুর্গাপূজা' : 'Durga Puja'}
            </Text>
            <Feather name="arrow-right" size={14} color="#FFFFFF" />
          </TouchableOpacity>
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
  heroCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  heroArtworkContainer: {
    width: '100%',
    height: 170,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroVignette: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(28, 16, 38, 0.45)',
  },
  heroContent: {
    padding: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(251, 191, 36, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  heroBadgeText: {
    color: '#FDE68A',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  switchPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  switchPillText: {
    color: '#E9D5FF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#E9D5FF',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 12,
  },
  muhuratStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  muhuratCol: {
    flex: 1,
  },
  muhuratDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 10,
  },
  muhuratLabel: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  muhuratVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  quickCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3,
  },
  quickCardDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  highlightsContainer: {
    gap: 12,
  },
  highlightsLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  highlightCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  highlightCardLandscape: {
    flex: 1,
    minWidth: 260,
  },
  highlightImage: {
    width: '100%',
    height: 120,
  },
  highlightBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(45, 18, 54, 0.9)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  highlightBadgeText: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '800',
  },
  highlightContent: {
    padding: 12,
  },
  highlightTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  highlightDesc: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  learnMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  learnMoreText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#9333EA',
  },
  switchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 18,
    gap: 12,
  },
  switchBannerTextCol: {
    flex: 1,
  },
  switchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  switchBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#7E22CE',
  },
  switchBannerDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  switchActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#7E22CE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
  },
  switchActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
