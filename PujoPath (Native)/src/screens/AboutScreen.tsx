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

interface AboutScreenProps {
  navigation: any;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, stackScrollBottomPadding } = useResponsive();

  const helplines = [
    {
      label: isBn ? 'কলকাতা পুলিশ কন্ট্রোল রুম' : 'Kolkata Police Emergency',
      number: '100 / 112',
      desc: isBn ? 'কেন্দ্রীয় জরুরি কন্ট্রোল রুম' : 'Central emergency response',
      dial: '100',
    },
    {
      label: isBn ? 'কলকাতা ট্রাফিক পুলিশ হেল্পলাইন' : 'Kolkata Traffic Police Helpline',
      number: '1073 / 033-2214-3644',
      desc: isBn ? 'রাস্তা ও ট্রাফিক আপডেট' : 'Traffic & road advisories',
      dial: '1073',
    },
    {
      label: isBn ? 'মহিলা সুরক্ষা হেল্পলাইন' : 'Women Helpline',
      number: '1091 / 181',
      desc: isBn ? '২৪x৭ মহিলা সহায়তা ও নিরাপত্তা' : '24x7 special assistance for women',
      dial: '1091',
    },
    {
      label: isBn ? 'অ্যাম্বুলেন্স ও জরুরি স্বাস্থ্য পরিষেবা' : 'Ambulance Emergency Services',
      number: '102 / 108',
      desc: isBn ? 'তাৎক্ষণিক জরুরি চিকিৎসা' : 'Immediate medical ambulance',
      dial: '102',
    },
    {
      label: isBn ? 'দমকল ও উদ্ধারকারী দল' : 'Fire & Rescue Services',
      number: '101',
      desc: isBn ? 'অগ্নি নির্বাপক ও উদ্ধার বিভাগ' : 'Fire rescue department',
      dial: '101',
    },
    {
      label: isBn ? 'মেট্রো রেলওয়ে হেল্পডেস্ক' : 'Kolkata Metro Rail Helpdesk',
      number: '033-2226-7285',
      desc: isBn ? 'মেট্রো যাতায়াত সহায়তা' : 'Metro transit helpline',
      dial: '03322267285',
    },
  ];

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
            <Ionicons name="information-circle-outline" size={13} color="#B42323" />
            <Text style={styles.badgeText}>
              {isBn ? 'তথ্য ও জরুরি হেল্পলাইন' : 'SAFETY & ASSISTANCE'}
            </Text>
          </View>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
            {isBn ? 'জরুরি হেল্পলাইন ও সুরক্ষা নির্দেশিকা' : 'Emergency Helplines & Safety Guide'}
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
            {isBn
              ? 'পুজো পরিক্রমার সময় যেকোনো প্রয়োজনে কলকাতা পুলিশ ও জরুরি সহায়তা নম্বরসমূহ।'
              : 'Official 24x7 emergency contacts and essential guidance for safe and smooth pandal hopping.'}
          </Text>
        </View>

        {/* Helplines Directory */}
        <View style={[styles.directoryGrid, isLandscape && { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }]}>
          {helplines.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.helplineCard,
                {
                  backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                  borderColor: colors.border,
                },
                isLandscape && { width: '49.1%' },
              ]}
            >
              <View style={styles.helplineInfo}>
                <Text style={[styles.helplineLabel, { color: colors.textPrimary }]} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={[styles.helplineDesc, { color: colors.textMuted }]} numberOfLines={1}>
                  {item.desc}
                </Text>
                <Text style={[styles.helplineNumber, { color: '#B42323' }]}>
                  {item.number}
                </Text>
              </View>

              <AnimatedPressable
                preset="icon"
                scaleTo={0.88}
                onPress={() => Linking.openURL(`tel:${item.dial}`)}
                style={[
                  styles.callButton,
                  {
                    backgroundColor: isDark ? '#341B18' : '#FDEEEE',
                    borderColor: isDark ? '#4D221E' : '#F6CECA',
                  },
                ]}
                accessibilityLabel={`Call ${item.label}`}
              >
                <Ionicons name="call" size={16} color="#B42323" />
              </AnimatedPressable>
            </View>
          ))}
        </View>

        {/* Tribute & About Sections */}
        <View style={[isLandscape && { flexDirection: 'row', gap: 14 }]}>
          {/* UNESCO Heritage Tribute Card */}
          <View
            style={[
              styles.unescoCard,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: colors.border,
              },
              isLandscape && { flex: 1 },
            ]}
          >
            <View style={styles.unescoIconBox}>
              <Ionicons name="sparkles" size={20} color="#D97706" />
            </View>
            <View style={styles.unescoContent}>
              <Text style={[styles.unescoTitle, { color: colors.textPrimary }]}>
                {isBn ? 'ইউনেস্কো মানবতার অমূল্য সাংস্কৃতিক ঐতিহ্য' : 'UNESCO Cultural Heritage of Humanity'}
              </Text>
              <Text style={[styles.unescoDesc, { color: colors.textMuted }]}>
                {isBn
                  ? '২০২১ সালে কলকাতার দুর্গাপূজা ইউনেস্কোর ইনট্যানজিবল কালচারাল হেরিটেজ অফ হিউম্যানিটি হিসেবে বিশ্বস্বীকৃতি লাভ করে। এটি শুধু ধর্মীয় অনুষ্ঠান নয়, বাংলার অনুপম শিল্পকলা ও সর্বজনীন মিলনোৎসব।'
                  : "In 2021, Durga Puja in Kolkata was inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity, celebrating its community-driven art, public celebrations, and secular inclusivity."}
              </Text>
            </View>
          </View>

          {/* About Initiative */}
          <View
            style={[
              styles.aboutCard,
              {
                backgroundColor: isDark ? '#1C1511' : '#FFF9F6',
                borderColor: isDark ? 'rgba(180, 35, 35, 0.4)' : 'rgba(180, 35, 35, 0.3)',
              },
              isLandscape && { flex: 1 },
            ]}
          >
            <Text style={[styles.aboutTitle, { color: colors.textPrimary }]}>
              {isBn ? 'পুজোপথ উদ্যোগের কথা' : 'About the PujoPath Initiative'}
            </Text>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
              {isBn
                ? 'পুজোপথ হলো কলকাতার দুর্গাপূজাকে সবার কাছে সহজ, আনন্দদায়ক এবং সুন্দরভাবে পৌঁছে দেওয়ার জন্য একটি অলাভজনক ও নিরপেক্ষ ডিজিটাল উদ্যোগ। এতে কলকাতার ৭৭৪টি প্রধান মণ্ডপ, নিখুঁত সন্ধিপূজা নির্ঘণ্ট, অফলাইন মেট্রো গাইড ও রুট প্ল্যানার সংযুক্ত করা হয়েছে।'
                : 'PujoPath is an independent community initiative designed to bring digital precision, cultural authenticity, and route clarity to Kolkata’s grandest festival. Featuring 774 curated pandals, astronomy-backed panjika timings, and transit guides.'}
            </Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
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
  directoryGrid: {
    gap: 10,
  },
  helplineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  helplineInfo: {
    flex: 1,
    gap: 2,
  },
  helplineLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  helplineDesc: {
    fontSize: 11,
  },
  helplineNumber: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  callButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unescoCard: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  unescoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unescoContent: {
    flex: 1,
    gap: 4,
  },
  unescoTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  unescoDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  aboutCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    gap: 8,
  },
  aboutTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  aboutText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
