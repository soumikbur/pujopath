import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useFestival } from '@/context/FestivalContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useResponsive } from '@/hooks/useResponsive';

export const FestivalSelectScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const isBn = language === 'bn';
  const { selectFestival } = useFestival();
  const reduceMotion = useReducedMotion();
  const { isLandscape, screenPaddingLeft, screenPaddingRight } = useResponsive();

  const entranceAnim = useRef(new Animated.Value(0)).current;
  const durgaScaleAnim = useRef(new Animated.Value(1)).current;
  const kaliScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      entranceAnim.setValue(1);
    } else {
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [reduceMotion]);

  const handleSelect = (festival: 'durga' | 'kali') => {
    const scaleAnim = festival === 'durga' ? durgaScaleAnim : kaliScaleAnim;
    if (!reduceMotion) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.96,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        selectFestival(festival);
      });
    } else {
      selectFestival(festival);
    }
  };

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 16
  );
  const bottomInset = Math.max(insets.bottom, 16);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={true}
      />

      {/* Top Welcome Header Bar (No festival bottom navigation!) */}
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: topInset + 6,
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.brandGroup}>
          <Text style={[styles.brandTitle, { color: '#B42323' }]}>PujoPath</Text>
          <View style={styles.platformBadge}>
            <Text style={styles.platformBadgeText}>
              {isBn ? 'উৎসব সংকলন' : 'FESTIVAL EDITION'}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {/* Light / Dark Mode Toggle */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={toggleTheme}
            style={[
              styles.iconBtn,
              {
                borderColor: colors.border,
                backgroundColor: isDark ? colors.surface : 'transparent',
              },
            ]}
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={17}
              color={isDark ? '#FBBF24' : '#625B55'}
            />
          </TouchableOpacity>

          {/* Language Toggle [ EN | বাংলা ] */}
          <View
            style={[
              styles.langPill,
              {
                borderColor: colors.border,
                backgroundColor: isDark ? colors.surface : 'transparent',
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setLanguage('en')}
              style={[
                styles.langOption,
                language === 'en' && styles.langOptionActive,
              ]}
              accessibilityLabel="English"
            >
              <Text
                style={[
                  styles.langText,
                  { color: language === 'en' ? '#FFFFFF' : colors.textSecondary },
                  language === 'en' && styles.langTextActive,
                ]}
              >
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setLanguage('bn')}
              style={[
                styles.langOption,
                language === 'bn' && styles.langOptionActive,
              ]}
              accessibilityLabel="Bengali"
            >
              <Text
                style={[
                  styles.langText,
                  { color: language === 'bn' ? '#FFFFFF' : colors.textSecondary },
                  language === 'bn' && styles.langTextActive,
                ]}
              >
                বাংলা
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
            paddingBottom: bottomInset + 24,
            maxWidth: isLandscape ? 1080 : 540,
            alignSelf: 'center',
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Welcome Text */}
        <Animated.View
          style={[
            styles.welcomeIntro,
            {
              opacity: entranceAnim,
              transform: [
                {
                  translateY: entranceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.welcomeHeadline, { color: colors.textPrimary }]}>
            {isBn ? 'উৎসব নির্বাচন করুন' : 'Choose Your Festival'}
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
            {isBn
              ? 'বাঙালির প্রাণের শারদীয়া দুর্গাপূজা অথবা ভক্তিগম্ভীর দীপান্বিতা কালীপূজা — আপনার পছন্দের উৎসবে প্রবেশ করুন।'
              : "Immerse in Bengal's sacred celebrations. Select an experience below to enter its dedicated world of pandals, rituals, and music."}
          </Text>
        </Animated.View>

        {/* Festival Cards Container: Stacked in portrait, side-by-side in landscape */}
        <View style={[styles.cardsLayout, isLandscape && styles.cardsLayoutLandscape]}>
          {/* ============================================================ */}
          {/* 1. DURGA PUJA OPTION (Appears First)                         */}
          {/* ============================================================ */}
          <Animated.View
            style={[
              styles.cardWrapper,
              isLandscape && styles.cardWrapperLandscape,
              { transform: [{ scale: durgaScaleAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => handleSelect('durga')}
              style={[
                styles.festivalCard,
                {
                  backgroundColor: isDark ? '#231512' : '#FFF9F5',
                  borderColor: isDark ? '#4A231C' : '#FCD5CF',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select Durga Puja"
            >
              {/* Artwork Banner */}
              <View style={[styles.imageContainer, isLandscape && styles.imageContainerLandscape]}>
                <Image
                  source={require('../../assets/images/hero-durga.jpg')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlayDurga} />
                <View style={styles.seasonBadgeDurga}>
                  <Text style={styles.seasonBadgeText}>
                    {isBn ? '🍁 শারদোৎসব ২০২৬' : '🍁 SHARODOTSAV 2026'}
                  </Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                <View style={styles.titleRow}>
                  <Text style={[styles.festivalTitle, { color: colors.textPrimary }]}>
                    {isBn ? 'শ্রী শ্রী দুর্গাপূজা' : 'Durga Puja'}
                  </Text>
                  <View style={styles.iconCircleDurga}>
                    <Ionicons name="sparkles" size={16} color="#B42323" />
                  </View>
                </View>

                <Text style={styles.festivalTaglineDurga}>
                  {isBn ? 'মায়ের আগমনী ও ঐতিহ্যময় শারদোৎসব' : 'Grand Autumn Heritage Carnival'}
                </Text>

                <Text
                  style={[styles.festivalDescription, { color: colors.textSecondary }]}
                  numberOfLines={3}
                >
                  {isBn
                    ? 'কলকাতার শ্রেষ্ঠ ৪৫০+ মণ্ডপ পরিক্রমা, থিম শিল্পকলা, বনেদি বাড়ির ইতিহাস, মহালয়ার চণ্ডীপাঠ ও ঢাকের উৎসব।'
                    : "Explore 450+ iconic pandals across Kolkata, heritage Bonedi Bari traditions, smart hopping routes, and authentic festive dhak rhythms."}
                </Text>

                {/* Key Feature Pills */}
                <View style={styles.featurePillsRow}>
                  <View style={[styles.pill, { backgroundColor: isDark ? '#381C18' : '#FEE2E2' }]}>
                    <Ionicons name="location-outline" size={11} color="#B42323" />
                    <Text style={[styles.pillText, { color: '#B42323' }]}>
                      {isBn ? '৪৫০+ মণ্ডপ' : '450+ Pandals'}
                    </Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: isDark ? '#381C18' : '#FEE2E2' }]}>
                    <Ionicons name="git-network-outline" size={11} color="#B42323" />
                    <Text style={[styles.pillText, { color: '#B42323' }]}>
                      {isBn ? 'রুট প্ল্যানার' : 'Hopping Trails'}
                    </Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: isDark ? '#381C18' : '#FEE2E2' }]}>
                    <Ionicons name="calendar-outline" size={11} color="#B42323" />
                    <Text style={[styles.pillText, { color: '#B42323' }]}>
                      {isBn ? 'পঞ্জিকা ও সন্ধিপূজা' : 'Almanac'}
                    </Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: isDark ? '#381C18' : '#FEE2E2' }]}>
                    <Ionicons name="musical-notes-outline" size={11} color="#B42323" />
                    <Text style={[styles.pillText, { color: '#B42323' }]}>
                      {isBn ? 'শারদীয়া সঙ্গীত' : 'Puja Music'}
                    </Text>
                  </View>
                </View>

                {/* Clear Tap Target Action Button */}
                <View style={styles.enterButtonDurga}>
                  <Text style={styles.enterButtonText}>
                    {isBn ? 'দুর্গোৎসবে প্রবেশ করুন' : 'Enter Durga Puja Experience'}
                  </Text>
                  <Feather name="arrow-right" size={16} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* ============================================================ */}
          {/* 2. KALI PUJA OPTION (Appears Second)                         */}
          {/* ============================================================ */}
          <Animated.View
            style={[
              styles.cardWrapper,
              isLandscape && styles.cardWrapperLandscape,
              { transform: [{ scale: kaliScaleAnim }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => handleSelect('kali')}
              style={[
                styles.festivalCard,
                {
                  backgroundColor: isDark ? '#140C24' : '#FAF5FF',
                  borderColor: isDark ? '#3E1C58' : '#E9D5FF',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select Kali Puja"
            >
              {/* Artwork Banner */}
              <View style={[styles.imageContainer, isLandscape && styles.imageContainerLandscape]}>
                <Image
                  source={require('../../assets/images/kali-hero.jpg')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlayKali} />
                <View style={styles.seasonBadgeKali}>
                  <Text style={styles.seasonBadgeTextKali}>
                    {isBn ? '🪔 দীপান্বিতা অমাবস্যা ২০২৬' : '🪔 DIPANWITA AMAVASYA 2026'}
                  </Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                <View style={styles.titleRow}>
                  <Text style={[styles.festivalTitle, { color: colors.textPrimary }]}>
                    {isBn ? 'মা শ্যামা পূজা ও দীপাবলি' : 'Kali Puja'}
                  </Text>
                  <View style={styles.iconCircleKali}>
                    <Ionicons name="flame" size={16} color="#FBBF24" />
                  </View>
                </View>

                <Text style={styles.festivalTaglineKali}>
                  {isBn ? 'অন্ধকার বিনাশিনী আদ্যাশক্তির আরাধনা' : 'Devotion, Illumination & Shaktipeeths'}
                </Text>

                <Text
                  style={[styles.festivalDescription, { color: colors.textSecondary }]}
                  numberOfLines={3}
                >
                  {isBn
                    ? 'কালীঘাট ও দক্ষিণেশ্বর সহ ঐতিহাসিক কালীক্ষেত্র দর্শন, নিশীথ অমাবস্যার মহানির্ঘণ্ট, ১৪ প্রদীপ ও ভক্তিগম্ভীর শ্যামাসঙ্গীত।'
                    : "Journey through revered Shaktipeeths, authentic Dipanwita Amavasya midnight timings, sacred pradip rituals, and soulful devotional music."}
                </Text>

                {/* Key Feature Pills */}
                <View style={styles.featurePillsRow}>
                  <View style={[styles.pill, { backgroundColor: isDark ? '#2B1445' : '#F3E8FF' }]}>
                    <Ionicons name="business-outline" size={11} color={isDark ? '#C084FC' : '#7E22CE'} />
                    <Text style={[styles.pillText, { color: isDark ? '#E9D5FF' : '#7E22CE' }]}>
                      {isBn ? 'ঐতিহাসিক কালীক্ষেত্র' : 'Sacred Temples'}
                    </Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: isDark ? '#2B1445' : '#F3E8FF' }]}>
                    <Ionicons name="time-outline" size={11} color={isDark ? '#C084FC' : '#7E22CE'} />
                    <Text style={[styles.pillText, { color: isDark ? '#E9D5FF' : '#7E22CE' }]}>
                      {isBn ? 'নিশীথ কাল নির্ঘণ্ট' : 'Midnight Tithi'}
                    </Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: isDark ? '#2B1445' : '#F3E8FF' }]}>
                    <Ionicons name="flame-outline" size={11} color={isDark ? '#C084FC' : '#7E22CE'} />
                    <Text style={[styles.pillText, { color: isDark ? '#E9D5FF' : '#7E22CE' }]}>
                      {isBn ? '১৪ প্রদীপ ও রীতি' : '14 Diyas'}
                    </Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: isDark ? '#2B1445' : '#F3E8FF' }]}>
                    <Ionicons name="musical-notes-outline" size={11} color={isDark ? '#C084FC' : '#7E22CE'} />
                    <Text style={[styles.pillText, { color: isDark ? '#E9D5FF' : '#7E22CE' }]}>
                      {isBn ? 'শ্যামাসঙ্গীত' : 'Shyama Sangeet'}
                    </Text>
                  </View>
                </View>

                {/* Clear Tap Target Action Button */}
                <View style={[styles.enterButtonKali, { backgroundColor: isDark ? '#7E22CE' : '#6B21A8' }]}>
                  <Text style={styles.enterButtonText}>
                    {isBn ? 'কালীপূজায় প্রবেশ করুন' : 'Enter Kali Puja Experience'}
                  </Text>
                  <Feather name="arrow-right" size={16} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  platformBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(180, 35, 35, 0.12)',
  },
  platformBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B42323',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langPill: {
    flexDirection: 'row',
    borderRadius: 9,
    borderWidth: 1,
    padding: 2,
  },
  langOption: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
  },
  langOptionActive: {
    backgroundColor: '#B42323',
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
  },
  langTextActive: {
    fontWeight: '800',
  },
  scrollContent: {
    paddingTop: 16,
  },
  welcomeIntro: {
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  welcomeHeadline: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 460,
  },
  cardsLayout: {
    gap: 18,
  },
  cardsLayoutLandscape: {
    flexDirection: 'row',
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  cardWrapperLandscape: {
    flex: 1,
  },
  festivalCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 165,
    position: 'relative',
  },
  imageContainerLandscape: {
    height: 135,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayDurga: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(180, 35, 35, 0.28)',
  },
  imageOverlayKali: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(28, 16, 38, 0.40)',
  },
  seasonBadgeDurga: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(180, 35, 35, 0.90)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  seasonBadgeKali: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(45, 18, 54, 0.92)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  seasonBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  seasonBadgeTextKali: {
    color: '#FDE68A',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  cardBody: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  festivalTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  iconCircleDurga: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleKali: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3B174F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  festivalTaglineDurga: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#B42323',
    marginBottom: 8,
  },
  festivalTaglineKali: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 8,
  },
  festivalDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 12,
  },
  featurePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  enterButtonDurga: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#B42323',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#B42323',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  enterButtonKali: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7E22CE',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#7E22CE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
