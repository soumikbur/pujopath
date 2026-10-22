import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAudio } from '@/context/AudioContext';
import { useResponsive } from '@/hooks/useResponsive';
import { KALI_MUSIC_DATA, KALI_MUSIC_CATEGORIES } from '@/data/music/kaliMusic';
import { MusicTrack } from '@/types';

interface KaliMusicScreenProps {
  navigation: any;
}

export const KaliMusicScreen: React.FC<KaliMusicScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, stackScrollBottomPadding } = useResponsive();
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
  } = useAudio();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredTracks = useMemo(() => {
    let list = [...KALI_MUSIC_DATA];
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Mahanisha & Dhyana') {
        list = list.filter((t) => t.id.includes('malkauns') || t.id.includes('ahir'));
      } else if (selectedCategory === 'Mantras & Stotrams') {
        list = list.filter((t) => t.id.includes('stotram'));
      } else if (selectedCategory === 'Temple Ambience & Aarati') {
        list = list.filter((t) => t.id.includes('bell') || t.id.includes('shankha'));
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.titleBn && t.titleBn.includes(q)) ||
          t.artist.toLowerCase().includes(q) ||
          (t.artistBn && t.artistBn.includes(q))
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: screenPaddingLeft,
            paddingRight: screenPaddingRight,
            paddingBottom: stackScrollBottomPadding + 28,
            maxWidth: isLandscape ? 860 : undefined,
            alignSelf: isLandscape ? 'center' : undefined,
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* 1. HERO BANNER                                            */}
        {/* ========================================================= */}
        <View
          style={[
            styles.heroSection,
            {
              backgroundColor: isDark ? '#1C1026' : '#FAF5FF',
              borderColor: isDark ? '#3D244F' : '#E9D5FF',
            },
          ]}
        >
          <View style={styles.heroRow}>
            <Image
              source={require('../../assets/images/kali-miniplayer.jpg')}
              style={styles.heroArtwork}
              resizeMode="cover"
            />
            <View style={styles.heroTextCol}>
              <View
                style={[
                  styles.heroBadge,
                  {
                    backgroundColor: isDark ? 'rgba(251, 191, 36, 0.18)' : '#FEF3C7',
                    borderColor: isDark ? 'rgba(251, 191, 36, 0.4)' : '#FCD34D',
                    borderWidth: 1,
                  },
                ]}
              >
                <Ionicons name="flame" size={12} color={isDark ? '#FBBF24' : '#D97706'} />
                <Text
                  style={[
                    styles.heroBadgeText,
                    { color: isDark ? '#FDE68A' : '#92400E' },
                  ]}
                >
                  {isBn ? 'শ্যামাসঙ্গীত ও ধ্যান' : 'SHYAMA SANGEET'}
                </Text>
              </View>
              <Text style={[styles.heroTitle, { color: isDark ? '#FFFFFF' : '#2E1065' }]}>
                {isBn ? 'মা শ্যামার পরম ভক্তিসুর' : 'Sacred Kali Music'}
              </Text>
              <Text
                style={[styles.heroDesc, { color: isDark ? '#E9D5FF' : '#6B21A8' }]}
                numberOfLines={2}
              >
                {isBn
                  ? 'কার্তিক অমাবস্যার নিশুতি রাতে মা কালীর বোধন, গভীর মালকোষ ধ্যানরাগ ও মঙ্গল শঙ্খধ্বনি।'
                  : 'Authentic meditative ragas, sacred Sanskrit stotrams, and ceremonial temple bells for Dipanwita Amavasya.'}
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* 2. SEARCH BAR                                             */}
        {/* ========================================================= */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color={isDark ? '#A89E95' : '#665A54'}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder={isBn ? 'গান বা শিল্পীর নাম খুঁজুন...' : 'Search sacred tracks or ragas...'}
            placeholderTextColor={isDark ? '#8A827A' : '#998D85'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ========================================================= */}
        {/* 3. CATEGORY PILLS                                         */}
        {/* ========================================================= */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {KALI_MUSIC_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : isDark
                      ? colors.surface
                      : '#FFFFFF',
                    borderColor: isSelected
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : isDark
                        ? colors.textSecondary
                        : colors.textPrimary,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {isBn ? cat.nameBn : cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ========================================================= */}
        {/* 4. TRACKS LIST                                            */}
        {/* ========================================================= */}
        <View style={styles.tracksSection}>
          <Text style={[styles.tracksCount, { color: colors.textSecondary }]}>
            {isBn
              ? `${filteredTracks.length}টি পবিত্র ভক্তিগীতি উপলব্ধ`
              : `${filteredTracks.length} sacred tracks available`}
          </Text>

          {filteredTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            const isThisSelected = currentTrack?.id === track.id;

            return (
              <View
                key={track.id}
                style={[
                  styles.trackCard,
                  {
                    backgroundColor: isDark ? colors.surface : '#FFFFFF',
                    borderColor: isThisSelected
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <View style={styles.trackCardTop}>
                  <TouchableOpacity
                    onPress={() => {
                      if (isThisSelected) {
                        togglePlayPause();
                      } else {
                        playTrack(track);
                      }
                    }}
                    style={styles.playIconBtn}
                    activeOpacity={0.8}
                    accessibilityLabel={isThisPlaying ? 'Pause' : 'Play'}
                  >
                    <Ionicons
                      name={isThisPlaying ? 'pause-circle' : 'play-circle'}
                      size={44}
                      color={colors.primary}
                    />
                  </TouchableOpacity>

                  <View style={styles.trackInfo}>
                    <Text
                      style={[
                        styles.trackTitle,
                        { color: isThisSelected ? colors.primary : colors.textPrimary },
                      ]}
                      numberOfLines={1}
                    >
                      {isBn ? track.titleBn : track.title}
                    </Text>
                    <Text
                      style={[styles.trackArtist, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {isBn ? track.artistBn : track.artist}
                    </Text>
                    <View style={styles.trackMetaRow}>
                      <View style={styles.durationBadge}>
                        <Ionicons name="time-outline" size={11} color="#9333EA" />
                        <Text style={styles.durationText}>
                          {formatSeconds(track.durationSeconds)}
                        </Text>
                      </View>
                      <View style={styles.licenseBadge}>
                        <Text style={styles.licenseBadgeText}>{track.licenseType}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Cultural Description Snippet */}
                <Text
                  style={[styles.trackDesc, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {isBn ? track.descriptionBn : track.description}
                </Text>
              </View>
            );
          })}
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
  heroSection: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 14,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroArtwork: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  heroTextCol: {
    flex: 1,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251, 191, 36, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  heroBadgeText: {
    color: '#FDE68A',
    fontSize: 9.5,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 3,
  },
  heroDesc: {
    color: '#E9D5FF',
    fontSize: 11.5,
    lineHeight: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  categoryScroll: {
    marginBottom: 14,
  },
  categoryContainer: {
    gap: 8,
    paddingRight: 10,
  },
  categoryPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
  },
  tracksSection: {
    gap: 10,
  },
  tracksCount: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  trackCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trackCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  playIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 11.5,
    marginBottom: 4,
  },
  trackMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#9333EA',
  },
  licenseBadge: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  licenseBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#9333EA',
  },
  trackDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    paddingTop: 6,
  },
});
