import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface DeveloperScreenProps {
  navigation: any;
}

export const DeveloperScreen: React.FC<DeveloperScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const moumitaResponsibilities = isBn
    ? [
        'ইউজার ইন্টারফেস ডিজাইন',
        'ফ্রন্টএন্ড আর্কিটেকচার',
        'রেসপনসিভ লেআউট',
        'ইউজার এক্সপেরিয়েন্স (UX)',
        'ভিজ্যুয়াল নান্দনিকতা',
        'সাংস্কৃতিক কিউরেশন',
        'ইন্টারঅ্যাকশন ডিজাইন',
      ]
    : [
        'User Interface Design',
        'Frontend Architecture',
        'Responsive Layouts',
        'User Experience (UX)',
        'Visual Consistency',
        'Cultural Curation',
        'Interaction Design',
      ];

  const soumikResponsibilities = isBn
    ? [
        'ব্যাকএন্ড আর্কিটেকচার',
        'কোর অ্যাপ্লিকেশন লজিক',
        'সিস্টেম আর্কিটেকচার',
        'রুট অপ্টিমাইজেশন অ্যালগরিদম',
        'অফলাইন ট্রানজিট সিস্টেম',
        'ব্যাকএন্ড ইন্টিগ্রেশন',
        'পারফরম্যান্স ও নির্ভরযোগ্যতা',
      ]
    : [
        'Backend Architecture',
        'Core Application Logic',
        'System Architecture',
        'Route Optimization Algorithms',
        'Offline-First Transit',
        'Backend Integrations',
        'Performance & Reliability',
      ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Ionicons name="people" size={16} color={colors.primary} />
          <Text style={[styles.badgeText, { color: colors.primary }]}>
            {isBn ? 'প্রকল্পের সহ-নির্মাতা' : 'Project Co-Creators'}
          </Text>
        </View>
        <Text style={[styles.pageTitle, { color: colors.text }]}>
          {isBn ? 'পুজোপথ ডেভেলপার ও নির্মাতা' : 'Meet the Developers'}
        </Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          {isBn
            ? 'পুজোপথ হলো সৌমিক ও মৌমিতার একটি যৌথ সৃষ্টি, যা মানুষকে কলকাতার দুর্গোৎসবের মণ্ডপ আবিষ্কার ও সুষ্ঠু পরিকল্পনা করতে সাহায্য করে।'
            : "PujoPath is a collaborative project co-created by Soumik and Moumita to help people discover Kolkata's Durga Puja pandals and plan their festive experiences."}
        </Text>
      </View>

      {/* Card 1: Moumita */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.profileTopRow}>
          <Image
            source={require('../../assets/developers/moumita.jpg')}
            style={[styles.avatar, { borderColor: colors.primary }]}
            resizeMode="cover"
          />
          <View style={styles.titleColumn}>
            <View style={[styles.coCreatorBadge, { backgroundColor: colors.badge }]}>
              <Ionicons name="sparkles" size={12} color={colors.primary} />
              <Text style={[styles.coCreatorBadgeText, { color: colors.primary }]}>
                {isBn ? 'সহ-নির্মাতা' : 'Co-Creator'}
              </Text>
            </View>
            <Text style={[styles.devName, { color: colors.text }]}>
              {isBn ? 'মৌমিতা' : 'Moumita'}
            </Text>
            <Text style={[styles.devRole, { color: colors.primary }]}>
              {isBn ? 'ইউআই ও ফ্রন্টএন্ড লিড' : 'UI & Frontend Lead'}
            </Text>
          </View>
        </View>

        <Text style={[styles.bioText, { color: colors.textSecondary }]}>
          {isBn
            ? 'ইউজার ইন্টারফেস ডিজাইন, ফ্রন্টএন্ড আর্কিটেকচার, রেসপনসিভ লেআউট, ইউজার এক্সপেরিয়েন্স, ভিজ্যুয়াল নান্দনিকতা ও ইন্টারঅ্যাকশন ডিজাইনের পাশাপাশি কলকাতার শতাব্দীপ্রাচীন বনেদি বাড়ি ও ঐতিহ্যবাহী মণ্ডপের সাংস্কৃতিক তথ্য কিউরেশনে নেতৃত্ব দিচ্ছেন।'
            : "Directs user interface design, frontend architecture, responsive layouts, user experience, visual consistency, and interaction design, alongside research and curation of Kolkata's historic Bonedi Bari traditions and cultural festival narratives."}
        </Text>

        <View style={styles.chipsSection}>
          <Text style={[styles.chipsLabel, { color: colors.textMuted }]}>
            {isBn ? 'দায়িত্বসমূহ' : 'Key Responsibilities'}
          </Text>
          <View style={styles.chipsWrap}>
            {moumitaResponsibilities.map((resp, i) => (
              <View
                key={i}
                style={[
                  styles.chip,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.chipText, { color: colors.text }]}>{resp}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <Text style={[styles.profileLabel, { color: colors.textMuted }]}>
            {isBn ? 'পেশাদার প্রোফাইল' : 'Professional Profile'}
          </Text>
          <TouchableOpacity
            style={styles.linkedInBtn}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/moumita-shee-798505226/')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Moumita LinkedIn Profile"
          >
            <Ionicons name="logo-linkedin" size={15} color="#FFFFFF" />
            <Text style={styles.linkedInText}>{isBn ? 'লিঙ্কডইন' : 'LinkedIn'}</Text>
            <Ionicons name="open-outline" size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card 2: Soumik */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.profileTopRow}>
          <Image
            source={require('../../assets/developers/soumik.jpg')}
            style={[styles.avatar, { borderColor: colors.primary }]}
            resizeMode="cover"
          />
          <View style={styles.titleColumn}>
            <View style={[styles.coCreatorBadge, { backgroundColor: colors.badge }]}>
              <Ionicons name="sparkles" size={12} color={colors.primary} />
              <Text style={[styles.coCreatorBadgeText, { color: colors.primary }]}>
                {isBn ? 'সহ-নির্মাতা' : 'Co-Creator'}
              </Text>
            </View>
            <Text style={[styles.devName, { color: colors.text }]}>
              {isBn ? 'সৌমিক' : 'Soumik'}
            </Text>
            <Text style={[styles.devRole, { color: colors.primary }]}>
              {isBn ? 'ব্যাকএন্ড ও সিস্টেমস লিড' : 'Backend & Systems Lead'}
            </Text>
          </View>
        </View>

        <Text style={[styles.bioText, { color: colors.textSecondary }]}>
          {isBn
            ? 'পুজোপথের ব্যাকএন্ড আর্কিটেকচার, কোর অ্যাপ্লিকেশন লজিক, রুট অপ্টিমাইজেশন অ্যালগরিদম, অফলাইন-ফার্স্ট ট্রানজিট সিস্টেম, ব্যাকএন্ড ইন্টিগ্রেশন এবং অ্যাপ্লিকেশনের পারফরম্যান্স ও নির্ভরযোগ্যতা পরিচালনায় নেতৃত্ব দিচ্ছেন।'
            : 'Directs backend & systems architecture, core application logic, route optimization algorithms, offline-first transit functionality, backend integrations, and platform performance & reliability.'}
        </Text>

        <View style={styles.chipsSection}>
          <Text style={[styles.chipsLabel, { color: colors.textMuted }]}>
            {isBn ? 'দায়িত্বসমূহ' : 'Key Responsibilities'}
          </Text>
          <View style={styles.chipsWrap}>
            {soumikResponsibilities.map((resp, i) => (
              <View
                key={i}
                style={[
                  styles.chip,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.chipText, { color: colors.text }]}>{resp}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <Text style={[styles.profileLabel, { color: colors.textMuted }]}>
            {isBn ? 'পেশাদার প্রোফাইল' : 'Professional Profile'}
          </Text>
          <TouchableOpacity
            style={styles.linkedInBtn}
            onPress={() => Linking.openURL('https://www.linkedin.com/in/soumik-ghosh-883a1a22b/')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Soumik LinkedIn Profile"
          >
            <Ionicons name="logo-linkedin" size={15} color="#FFFFFF" />
            <Text style={styles.linkedInText}>{isBn ? 'লিঙ্কডইন' : 'LinkedIn'}</Text>
            <Ionicons name="open-outline" size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feedback CTA Card */}
      <View
        style={[
          styles.feedbackCard,
          {
            backgroundColor: isDark ? '#14202d' : '#f0f7ff',
            borderColor: '#0a66c2',
          },
        ]}
      >
        <View style={styles.feedbackInfo}>
          <View style={styles.feedbackBadge}>
            <Ionicons name="chatbubbles" size={14} color="#0a66c2" />
            <Text style={styles.feedbackBadgeText}>
              {isBn ? 'মতামত ও প্রতিক্রিয়া' : 'Feedback & Suggestions'}
            </Text>
          </View>
          <Text style={[styles.feedbackTitle, { color: colors.text }]}>
            {isBn ? 'ডেভেলপারদের মতামত জানাতে চান?' : 'Have feedback or suggestions?'}
          </Text>
          <Text style={[styles.feedbackSubtitle, { color: colors.textSecondary }]}>
            {isBn
              ? 'যেকোনো প্রযুক্তিগত পরামর্শ, ফিচার অনুরোধ বা বাগ রিপোর্ট পাঠাতে আমাদের ফিডব্যাক পেজ ব্যবহার করুন।'
              : 'Share ideas, report bugs, or request features directly via our feedback channel.'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.shareFeedbackBtn}
          onPress={() => navigation.navigate('Feedback')}
          activeOpacity={0.85}
        >
          <Ionicons name="mail" size={16} color="#FFFFFF" />
          <Text style={styles.shareFeedbackText}>
            {isBn ? 'মতামত দিন' : 'Share Feedback'}
          </Text>
        </TouchableOpacity>
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
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 2,
    marginRight: 14,
  },
  titleColumn: {
    flex: 1,
  },
  coCreatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  coCreatorBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  devName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  devRole: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  bioText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  chipsSection: {
    marginBottom: 14,
  },
  chipsLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  profileLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  linkedInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0a66c2',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  linkedInText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  feedbackCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 18,
    marginTop: 6,
  },
  feedbackInfo: {
    marginBottom: 14,
  },
  feedbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  feedbackBadgeText: {
    color: '#0a66c2',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  feedbackSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  shareFeedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0a66c2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  shareFeedbackText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
