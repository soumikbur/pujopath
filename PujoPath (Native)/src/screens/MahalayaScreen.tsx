import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAudio } from '@/context/AudioContext';
import { MUSIC_TRACKS_DATA } from '@/data/music';

interface MahalayaScreenProps {
  navigation: any;
}

export const MahalayaScreen: React.FC<MahalayaScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = useAudio();

  const mahalayaTrack = MUSIC_TRACKS_DATA.find((t) => t.category === 'Mahalaya' || t.title.toLowerCase().includes('mahalaya')) || MUSIC_TRACKS_DATA[0];
  const isThisPlaying = currentTrack?.id === mahalayaTrack.id && isPlaying;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sacred Dawn Hero Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={14} color="#FBBF24" />
            <Text style={styles.heroBadgeText}>AGOMONI DAWN</Text>
          </View>
          <Text style={styles.heroTitle}>
            {language === 'bn' ? 'বীরেন্দ্রকৃষ্ণ ভদ্রের মহিষাসুরমর্দিনী' : 'Mahishasuramardini Tribute'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {language === 'bn'
              ? 'ভোর ৪টের কালজয়ী স্তোত্রপাঠ, চণ্ডীপাঠ ও দেবী দুর্গার পূত আগমনী বার্তা'
              : 'The sacred 4:00 AM dawn broadcast reciting the invocation of Goddess Durga since 1931.'}
          </Text>

          {/* Audio Player Action Button */}
          <TouchableOpacity
            onPress={() => {
              if (currentTrack?.id === mahalayaTrack.id) {
                togglePlayPause();
              } else {
                playTrack(mahalayaTrack);
              }
            }}
            style={[styles.audioActionBtn, { backgroundColor: colors.gold }]}
          >
            <Ionicons name={isThisPlaying ? 'pause' : 'play'} size={20} color="#000" />
            <Text style={styles.audioActionText}>
              {isThisPlaying
                ? (language === 'bn' ? 'স্থগিত রাখুন' : 'Pause Broadcast')
                : (language === 'bn' ? 'মহিষাসুরমর্দিনী শ্রবণ করুন' : 'Listen to Recitation')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Historic Heritage Story Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardHeading, { color: colors.text }]}>
            {language === 'bn' ? 'ঐতিহাসিক পটভূমি ও মাহাত্ম্য' : 'The Legacy of Mahalaya'}
          </Text>
          <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
            {language === 'bn'
              ? '১৯৩১ সাল থেকে আকাশবাণী কলকাতা কেন্দ্রে বীরেন্দ্রকৃষ্ণ ভদ্রের কণ্ঠে মহিষাসুরমর্দিনী প্রচারিত হয়ে আসছে। পঙ্কজ কুমার মল্লিকের সুরে এবং বাণীকুমারের রচনায় এই অনুষ্ঠান বাঙালির দুর্গাপূজার অবিচ্ছেদ্য প্রারম্ভিক সুর।'
              : 'Broadcast since 1931 over All India Radio Kolkata, composed by Bani Kumar, set to music by Pankaj Kumar Mullick, and narrated by the inimitable Birendra Krishna Bhadra, this broadcast remains the definitive sacred herald of Bengal’s autumn.'}
          </Text>
        </View>

        {/* Sacred Sanskrit Invocations */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardHeading, { color: colors.text }]}>
            {language === 'bn' ? 'দেবী স্তুতি ও চণ্ডীপাঠ' : 'Sacred Devi Stotram'}
          </Text>
          <View style={[styles.shlokaBox, { backgroundColor: colors.background, borderColor: colors.gold }]}>
            <Text style={[styles.shlokaText, { color: colors.primary }]}>
              "যা দেবী সর্বভূতেষু শক্তিরূপেণ সংস্থিতা।{'\n'}নমস্তস্যৈ নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ॥"
            </Text>
            <Text style={[styles.shlokaMeaning, { color: colors.textMuted }]}>
              "Salutations again and again to the divine Goddess who abides in all beings in the form of divine energy and power."
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
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
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
    marginBottom: 12,
  },
  heroBadgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  audioActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  audioActionText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 20,
  },
  shlokaBox: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
  },
  shlokaText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  shlokaMeaning: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 16,
  },
});
