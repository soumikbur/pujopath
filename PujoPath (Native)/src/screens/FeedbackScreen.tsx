import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface FeedbackScreenProps {
  navigation: any;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, stackScrollBottomPadding } = useResponsive();

  const topics = [
    {
      icon: 'bug',
      title: isBn ? 'তথ্য সংশোধন বা বাগ রিপোর্ট' : 'Report an Issue / Bug',
      desc: isBn
        ? 'কোনো মণ্ডপের সময়সূচী, অবস্থান বা তথ্যে ত্রুটি থাকলে আমাদের জানান।'
        : 'Spotted an incorrect timing, location issue, or broken feature? Let us know so we can fix it.',
    },
    {
      icon: 'bulb',
      title: isBn ? 'নতুন সুবিধার প্রস্তাব' : 'Feature Suggestions',
      desc: isBn
        ? 'পুজোপথকে আরও উপযোগী করতে আপনার নতুন ধারণা বা পরামর্শ শেয়ার করুন।'
        : 'Have ideas for new filters, transit enhancements, or interactive tools for pandal hoppers?',
    },
    {
      icon: 'people',
      title: isBn ? 'সহযোগিতা ও তথ্য সংযোজন' : 'Community Collaboration',
      desc: isBn
        ? 'আপনার এলাকার পুজো বা নিজস্ব আলোকচিত্র যুক্ত করার জন্য যোগাযোগ করুন।'
        : 'Want to contribute photographs, club details, or community itineraries? Connect with us.',
    },
  ];

  const handleSendEmail = () => {
    Linking.openURL('mailto:contact@pujopath.app?subject=PujoPath%20Feedback%20%26%20Suggestions');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
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
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Ionicons name="chatbubbles" size={16} color="#0a66c2" />
          <Text style={[styles.badgeText, { color: '#0a66c2' }]}>
            {isBn ? 'মতামত ও পরামর্শ' : 'Feedback & Suggestions'}
          </Text>
        </View>
        <Text style={[styles.pageTitle, { color: colors.text }]}>
          {isBn ? 'আপনার মূল্যবান মতামত জানান' : 'Share Your Feedback'}
        </Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          {isBn
            ? 'পুজোপথকে আরও সমৃদ্ধ ও নিখুঁত করতে আপনার যেকোনো পরামর্শ বা প্রতিক্রিয়া সরাসরি ইমেলের মাধ্যমে আমাদের পাঠাতে পারেন।'
            : 'Have suggestions, corrections, or new features to suggest? Send your feedback directly via email.'}
        </Text>
      </View>

      {/* Main Email Action Card */}
      <View
        style={[
          styles.actionCard,
          {
            backgroundColor: isDark ? '#14202d' : '#f0f7ff',
            borderColor: '#0a66c2',
          },
        ]}
      >
        <View style={styles.emailBadge}>
          <Ionicons name="mail" size={14} color="#0a66c2" />
          <Text style={styles.emailBadgeText}>
            {isBn ? 'সরাসরি ইমেল' : 'Direct Email'}
          </Text>
        </View>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {isBn ? 'ইমেলের মাধ্যমে মতামত পাঠান' : 'Send Feedback via Email'}
        </Text>
        <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
          {isBn
            ? 'আমরা নিয়মিত প্রতিটি ইমেল পর্যালোচনা করি। বোতামে চাপ দিলে আপনার ডিভাইসে সরাসরি soumik.bur@gmail.com ঠিকানায় ইমেল কম্পোজ উইন্ডো খুলবে।'
            : 'Messages go directly to soumik.bur@gmail.com. We review all feedback, pandal updates, and community suggestions promptly.'}
        </Text>

        <AnimatedPressable
          preset="button"
          scaleTo={0.95}
          style={styles.emailBtn}
          onPress={handleSendEmail}
          accessibilityRole="button"
          accessibilityLabel="Send Feedback Email"
        >
          <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
          <Text style={styles.emailBtnText}>
            {isBn ? 'ইমেল পাঠান (Send Email)' : 'Send Feedback Email'}
          </Text>
        </AnimatedPressable>
      </View>

      {/* Topics Header */}
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
        {isBn ? 'মতামতের বিষয়সমূহ' : 'What You Can Share'}
      </Text>

      {/* Topics List */}
      <View style={[styles.topicsGrid, isLandscape && { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }]}>
        {topics.map((t, idx) => (
          <View
            key={idx}
            style={[
              styles.topicCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              isLandscape && { width: '31.5%', marginBottom: 0 },
            ]}
          >
            <View style={[styles.topicIconBox, { backgroundColor: colors.badge }]}>
              <Ionicons name={t.icon as any} size={20} color={colors.primary} />
            </View>
            <Text style={[styles.topicTitle, { color: colors.text }]}>{t.title}</Text>
            <Text style={[styles.topicDesc, { color: colors.textSecondary }]}>
              {t.desc}
            </Text>
          </View>
        ))}
      </View>

      {/* Meet Developers Cross-Link */}
      <View
        style={[
          styles.devLinkCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.devLinkContent}>
          <View style={styles.devLinkBadge}>
            <Ionicons name="people" size={14} color={colors.primary} />
            <Text style={[styles.devLinkBadgeText, { color: colors.primary }]}>
              {isBn ? 'প্রকল্পের দল' : 'Project Creators'}
            </Text>
          </View>
          <Text style={[styles.devLinkTitle, { color: colors.text }]}>
            {isBn ? 'পুজোপথ ডেভেলপারদের পরিচয় জানতে চান?' : 'Want to meet the creators?'}
          </Text>
          <Text style={[styles.devLinkDesc, { color: colors.textSecondary }]}>
            {isBn
              ? 'আমাদের ডেডিকেটেড ডেভেলপার পেজে গিয়ে সৌমিক ও মৌমিতার প্রোফাইল দেখুন।'
              : 'Learn more about Soumik and Moumita and explore their professional profiles.'}
          </Text>
        </View>

        <AnimatedPressable
          preset="button"
          scaleTo={0.95}
          style={[styles.meetDevBtn, { borderColor: colors.primary }]}
          onPress={() => navigation.navigate('Developer')}
        >
          <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
          <Text style={[styles.meetDevBtnText, { color: colors.primary }]}>
            {isBn ? 'ডেভেলপার পেজ দেখুন' : 'Meet Developers'}
          </Text>
        </AnimatedPressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  actionCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  emailBadgeText: {
    color: '#0a66c2',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0a66c2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  emailBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  topicsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  topicCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  topicIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  topicDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  devLinkCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  devLinkContent: {
    marginBottom: 14,
  },
  devLinkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  devLinkBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  devLinkTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  devLinkDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  meetDevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  meetDevBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
