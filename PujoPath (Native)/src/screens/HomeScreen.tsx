import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { PANDALS_DATA } from '@/data/pandals';
import { PandalCard } from '@/components/PandalCard';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language, t } = useLanguage();

  const featuredPandals = PANDALS_DATA.slice(0, 4);

  const quickFeatures = [
    { title: t('explore'), icon: 'compass', screen: 'Explore', color: '#E11D48' },
    { title: t('map'), icon: 'map', screen: 'Map', color: '#2563EB' },
    { title: t('planner'), icon: 'navigate', screen: 'Planner', color: '#059669' },
    { title: t('metro'), icon: 'subway', screen: 'Metro', color: '#7C3AED' },
    { title: t('calendar'), icon: 'calendar', screen: 'Calendar', color: '#D97706' },
    { title: t('music'), icon: 'musical-notes', screen: 'Music', color: '#DC2626' },
    { title: t('mahalaya'), icon: 'radio', screen: 'Mahalaya', color: '#B45309' },
    { title: t('helpline'), icon: 'call', screen: 'Helpline', color: '#DC2626' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Festive Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={14} color="#FBBF24" />
            <Text style={styles.heroBadgeText}>DURGA PUJA 2026</Text>
          </View>
          <Text style={styles.heroTitle}>
            {language === 'bn' ? 'স্বাগতম পূজোপথে' : 'Welcome to PujoPath'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {language === 'bn'
              ? 'কলকাতার ৭৭০টি মণ্ডপ, পঞ্জিকা, মেট্রো এবং রুট প্ল্যানার'
              : 'Kolkata’s premier guide to 770 pandals, metro schedules, and smart hopping routes'}
          </Text>

          {/* Quick Stats Bar */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>770</Text>
              <Text style={styles.statLabel}>{language === 'bn' ? 'মণ্ডপ' : 'Pandals'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>{language === 'bn' ? 'অঞ্চল' : 'Zones'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>{language === 'bn' ? 'মেট্রো লাইন' : 'Metro Lines'}</Text>
            </View>
          </View>
        </View>

        {/* Sandhi Puja Auspicious Window Alert Card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Calendar')}
          activeOpacity={0.88}
          style={[styles.sandhiCard, { backgroundColor: colors.surface, borderColor: colors.gold }]}
        >
          <View style={[styles.sandhiIconBox, { backgroundColor: colors.badge }]}>
            <Ionicons name="flame" size={20} color={colors.primary} />
          </View>
          <View style={styles.sandhiInfo}>
            <Text style={[styles.sandhiTitle, { color: colors.text }]}>{t('sandhiPuja')}</Text>
            <Text style={[styles.sandhiDesc, { color: colors.textMuted }]}>
              {t('sandhiPujaDesc')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Quick Navigation Features Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {language === 'bn' ? 'জরুরি ফিচারসমূহ' : 'Explore Features'}
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {quickFeatures.map((feat) => (
            <TouchableOpacity
              key={feat.screen}
              onPress={() => navigation.navigate(feat.screen)}
              activeOpacity={0.8}
              style={[
                styles.gridTile,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={[styles.tileIconBox, { backgroundColor: `${feat.color}15` }]}>
                <Ionicons name={feat.icon as any} size={22} color={feat.color} />
              </View>
              <Text style={[styles.tileTitle, { color: colors.text }]} numberOfLines={1}>
                {feat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Heritage Pandals */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {language === 'bn' ? 'ঐতিহ্যবাহী সেরা মণ্ডপ' : 'Featured Heritage Pandals'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              {language === 'bn' ? 'সব দেখুন →' : 'See All →'}
            </Text>
          </TouchableOpacity>
        </View>

        {featuredPandals.map((pandal) => (
          <PandalCard
            key={pandal.id}
            pandal={pandal}
            onPress={() => navigation.navigate('PandalDetail', { pandalId: pandal.id })}
          />
        ))}

        {/* Co-Creator Signature Notice */}
        <View style={styles.footerNotice}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            {language === 'bn'
              ? 'পূজোপথ • সৌমিক ও মৌমিতা কর্তৃক শ্রদ্ধা ও নিষ্ঠার সাথে নির্মিত'
              : 'PujoPath • Built with love and devotion by Soumik & Moumita'}
          </Text>
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
    paddingBottom: 40,
  },
  heroCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sandhiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    elevation: 2,
  },
  sandhiIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sandhiInfo: {
    flex: 1,
  },
  sandhiTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  sandhiDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 20,
  },
  gridTile: {
    width: '23%',
    flexGrow: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  tileIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tileTitle: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerNotice: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 11,
    textAlign: 'center',
  },
});
