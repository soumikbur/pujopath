import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';

interface HelplineScreenProps {
  navigation: any;
}

interface HelplineItem {
  name: string;
  nameBn: string;
  phone: string;
  desc: string;
  descBn: string;
  icon: string;
  color: string;
}

export const HelplineScreen: React.FC<HelplineScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { isLandscape, screenPaddingLeft, screenPaddingRight, stackScrollBottomPadding } = useResponsive();

  const helplines: HelplineItem[] = [
    {
      name: 'Kolkata Police Emergency',
      nameBn: 'কলকাতা পুলিশ কন্ট্রোল রুম',
      phone: '100',
      desc: '24/7 Police emergency assistance',
      descBn: '২৪ ঘণ্টা পুলিশ জরুরি সহায়তা',
      icon: 'shield',
      color: '#DC2626',
    },
    {
      name: 'National Emergency Number',
      nameBn: 'জাতীয় জরুরি নম্বর',
      phone: '112',
      desc: 'All-in-one emergency dispatch (Police, Fire, Ambulance)',
      descBn: 'একক জাতীয় জরুরি সেবা',
      icon: 'alert-circle',
      color: '#E11D48',
    },
    {
      name: 'Ambulance & Medical Emergency',
      nameBn: 'অ্যাম্বুলেন্স ও স্বাস্থ্য জরুরি সেবা',
      phone: '102',
      desc: 'Urgent medical aid & hospital transport',
      descBn: 'জরুরি চিকিৎসা ও হাসপাতাল পরিবহন',
      icon: 'medkit',
      color: '#059669',
    },
    {
      name: 'Fire Brigade Service',
      nameBn: 'দমকল ও অগ্নিনির্বাপক বাহিনী',
      phone: '101',
      desc: 'Fire fighting & rescue operations',
      descBn: 'অগ্নিনির্বাপণ ও উদ্ধার কাজ',
      icon: 'flame',
      color: '#EA580C',
    },
    {
      name: 'Women Helpline',
      nameBn: 'মহিলা হেল্পলাইন',
      phone: '1090',
      desc: 'Women safety and rapid police intervention',
      descBn: 'নারী নিরাপত্তা ও দ্রুত পুলিশি সহায়তা',
      icon: 'woman',
      color: '#9333EA',
    },
    {
      name: 'Disaster Management Helpline',
      nameBn: 'দুর্যোগ মোকাবিলা দপ্তর',
      phone: '1070',
      desc: 'Severe weather, crowd control & civil rescue',
      descBn: 'প্রাকৃতিক দুর্যোগ ও ভিড় নিয়ন্ত্রণ',
      icon: 'warning',
      color: '#D97706',
    },
    {
      name: 'Childline Support',
      nameBn: 'চাইল্ডলাইন সহায়তা',
      phone: '1098',
      desc: 'Protection for lost children during pandal hopping',
      descBn: 'পূজায় হারিয়ে যাওয়া শিশুদের দ্রুত উদ্ধার',
      icon: 'people',
      color: '#2563EB',
    },
  ];

  const handleCall = async (phone: string, name: string) => {
    const url = `tel:${phone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Call', `Please dial ${phone} for ${name}.`);
    }
  };

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
        {/* Banner Card */}
        <View style={[styles.headerBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.bannerIconBox, { backgroundColor: colors.badge }]}>
            <Ionicons name="call" size={24} color={colors.primary} />
          </View>
          <View style={styles.bannerInfo}>
            <Text style={[styles.bannerTitle, { color: colors.text }]}>
              {language === 'bn' ? 'জরুরি পূজা হেল্পলাইন' : 'Official Emergency Helplines'}
            </Text>
            <Text style={[styles.bannerSub, { color: colors.textMuted }]}>
              {language === 'bn'
                ? 'কলকাতায় যেকোনো জরুরি প্রয়োজনে সরাসরি এক ট্যাপে কল করুন'
                : 'Direct one-tap dialing for all emergency and citizen safety services'}
            </Text>
          </View>
        </View>

        {/* Directory List */}
        <View style={[isLandscape && { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }]}>
          {helplines.map((item, idx) => {
            const name = language === 'bn' ? item.nameBn : item.name;
            const desc = language === 'bn' ? item.descBn : item.desc;

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.85}
                onPress={() => handleCall(item.phone, name)}
                style={[
                  styles.itemCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isLandscape && { width: '49.1%', marginBottom: 0 },
                ]}
              >
                <View style={[styles.itemIconBox, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>

                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>{name}</Text>
                  <Text style={[styles.itemDesc, { color: colors.textMuted }]} numberOfLines={1}>{desc}</Text>
                </View>

                <View style={[styles.callBtn, { backgroundColor: colors.primary }]}>
                  <Ionicons name="call" size={16} color="#FFFFFF" />
                  <Text style={styles.callNumberText}>{item.phone}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom Safety & Feedback Cards */}
        <View style={[isLandscape && { flexDirection: 'row', gap: 14, marginTop: 10 }]}>
          {/* Safety Guidelines Advice Card */}
          <View
            style={[
              styles.safetyCard,
              { backgroundColor: colors.surface, borderColor: colors.gold },
              isLandscape && { flex: 1, marginTop: 0 },
            ]}
          >
            <Text style={[styles.safetyTitle, { color: colors.text }]}>
              {language === 'bn' ? 'পূজা দর্শনে বিশেষ নিরাপত্তা পরামর্শ' : 'Puja Safety Guidelines'}
            </Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
              {language === 'bn'
                ? '• শিশুদের পকেটে অভিভাবকের ফোন নম্বর লিখে রাখা ব্যাজ সাথে রাখুন।\n• ভিড় এড়াতে মধ্যরাত ও ভোরের সময় ব্যবহার করুন।\n• মেট্রোর বিশেষ সারারাত সার্ভিস ব্যবহার করুন।'
                : '• Keep an ID card or contact number tag in children’s pockets in heavy pandal crowds.\n• Take advantage of early morning or midnight hopping to avoid rush hours.\n• Use Kolkata Metro’s dedicated overnight festive train network.'}
            </Text>
          </View>

          {/* Feedback & Suggestions Card */}
          <View
            style={[
              styles.safetyCard,
              { backgroundColor: colors.surface, borderColor: '#0A66C2' },
              isLandscape ? { flex: 1, marginTop: 0 } : { marginTop: 12 },
            ]}
          >
            <Text style={[styles.safetyTitle, { color: colors.text }]}>
              {language === 'bn' ? 'মতামত ও পরামর্শ (Feedback)' : 'Feedback & Suggestions'}
            </Text>
            <Text style={[styles.safetyText, { color: colors.textSecondary, marginBottom: 12 }]}>
              {language === 'bn'
                ? 'পুজোপথকে আরও সমৃদ্ধ করতে আপনার মূল্যবান পরামর্শ বা প্রতিক্রিয়া সরাসরি লিঙ্কডইনে বার্তা পাঠিয়ে জানান।'
                : 'Have suggestions, corrections, or new features to suggest? Send your feedback directly via LinkedIn messaging.'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <TouchableOpacity
                style={[styles.callBtn, { backgroundColor: '#0A66C2', alignSelf: 'flex-start', paddingHorizontal: 16 }]}
                onPress={() => navigation?.navigate?.('Feedback')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={language === 'bn' ? 'মতামত জানান' : 'Send feedback'}
              >
                <Ionicons name="mail" size={16} color="#FFFFFF" />
                <Text style={styles.callNumberText}>
                  {language === 'bn' ? 'মতামত দিন (Feedback)' : 'Feedback'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.callBtn, { backgroundColor: '#004182', alignSelf: 'flex-start', paddingHorizontal: 16 }]}
                onPress={() => Linking.openURL('https://www.linkedin.com/in/soumik-ghosh-883a1a22b/')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={language === 'bn' ? 'লিঙ্কডইনে বার্তা পাঠান' : 'Message on LinkedIn'}
              >
                <Ionicons name="logo-linkedin" size={16} color="#FFFFFF" />
                <Text style={styles.callNumberText}>LinkedIn</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 40,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  bannerSub: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    elevation: 1,
  },
  itemIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  callNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  safetyCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    marginTop: 10,
  },
  safetyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
