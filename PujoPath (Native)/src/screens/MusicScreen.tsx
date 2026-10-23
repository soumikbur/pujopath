import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAudio } from '@/context/AudioContext';
import { useResponsive } from '@/hooks/useResponsive';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { motion } from '@/theme/motion';
import { MUSIC_TRACKS_DATA, PUJA_MOODS_LIST, MUSIC_CATEGORIES_META } from '@/data/music';
import { MusicTrack } from '@/types';

interface MusicScreenProps {
  navigation: any;
}

export const MusicScreen: React.FC<MusicScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { isLandscape, screenPaddingLeft, screenPaddingRight, stackScrollBottomPadding } = useResponsive();
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    userPlaylistIds,
    togglePlaylistTrack,
    isInPlaylist,
    playQueue,
  } = useAudio();

  const [viewTab, setViewTab] = useState<'all' | 'playlist'>('all');
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(10);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const userPlaylistTracks = useMemo(() => {
    return MUSIC_TRACKS_DATA.filter((t) => userPlaylistIds.includes(t.id));
  }, [userPlaylistIds]);

  const filteredTracks = useMemo(() => {
    let list = viewTab === 'playlist' ? [...userPlaylistTracks] : [...MUSIC_TRACKS_DATA];
    if (selectedMood !== 'All') {
      list = list.filter((t) => t.mood === selectedMood);
    }
    if (selectedCategory !== 'All') {
      list = list.filter((t) => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.titleBn && t.titleBn.includes(q)) ||
          t.artist.toLowerCase().includes(q) ||
          (t.artistBn && t.artistBn.includes(q)) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [viewTab, userPlaylistTracks, selectedMood, selectedCategory, searchQuery]);

  const visibleTracks = useMemo(() => {
    return filteredTracks.slice(0, displayLimit);
  }, [filteredTracks, displayLimit]);

  const handlePlayUserPlaylist = () => {
    if (userPlaylistTracks.length > 0) {
      playQueue(userPlaylistTracks);
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
            paddingBottom: stackScrollBottomPadding + 28,
            maxWidth: isLandscape ? 860 : undefined,
            alignSelf: isLandscape ? 'center' : undefined,
            width: '100%',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View style={styles.headerSection}>
          <View style={styles.badgeRow}>
            <Ionicons name="musical-notes" size={14} color="#B42323" />
            <Text style={styles.badgeText}>
              {isBn ? 'শারদীয়া সুর, ঢাক ও লোকঐতিহ্য' : 'Sharodiya Soundscape & Heritage'}
            </Text>
          </View>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
            {isBn ? 'শারদীয়া সঙ্গীত ও ঐতিহ্যবাহী সুর' : 'Festive Puja Music Traditions'}
          </Text>
          <Text style={[styles.pageSubtitle, { color: colors.textMuted }]}>
            {isBn
              ? 'পূজা আচারের গম্ভীর শঙ্খনাদ, মণ্ডপের ঐতিহ্যবাহী ঢাকের বোল, প্যান্ডেল হপিং-এর উদ্দীপনা থেকে বিজয়ার অশ্রুসজল বিসর্জন।'
              : 'Explore Bengal’s rich Durga Puja music culture — traditional Dhak beats, Agomoni hymns, pandal-hopping anthems, and immersion chants.'}
          </Text>

          {/* View switcher: All Soundscapes vs My Playlist */}
          <View
            style={[
              styles.viewSwitcher,
              {
                backgroundColor: isDark ? '#201C18' : '#F4EDE4',
                borderColor: isDark ? '#2F2720' : '#EEE8E1',
              },
            ]}
          >
            <AnimatedPressable
              scaleTo={motion.scale.button}
              onPress={() => setViewTab('all')}
              style={[
                styles.switcherTab,
                viewTab === 'all' && [
                  styles.switcherTabActive,
                  { backgroundColor: isDark ? '#1A1613' : '#FFFFFF' },
                ],
              ]}
              accessibilityRole="button"
              accessibilityLabel="View all soundscapes"
            >
              <Text
                style={[
                  styles.switcherTabText,
                  {
                    color: viewTab === 'all' ? '#B42323' : (isDark ? '#A89E95' : '#665A54'),
                    fontWeight: viewTab === 'all' ? '800' : '600',
                  },
                ]}
              >
                {isBn ? 'সব গান ও বোল' : 'All Soundscapes'}
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              scaleTo={motion.scale.button}
              onPress={() => setViewTab('playlist')}
              style={[
                styles.switcherTab,
                styles.playlistTabBtn,
                viewTab === 'playlist' && [
                  styles.switcherTabActive,
                  { backgroundColor: isDark ? '#1A1613' : '#FFFFFF' },
                ],
              ]}
              accessibilityRole="button"
              accessibilityLabel="View my playlist"
            >
              <Ionicons
                name="bookmark"
                size={13}
                color={viewTab === 'playlist' ? '#B42323' : (isDark ? '#A89E95' : '#665A54')}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.switcherTabText,
                  {
                    color: viewTab === 'playlist' ? '#B42323' : (isDark ? '#A89E95' : '#665A54'),
                    fontWeight: viewTab === 'playlist' ? '800' : '600',
                  },
                ]}
              >
                {isBn ? 'আমার প্লেলিস্ট' : 'My Playlist'}
              </Text>
              <View style={styles.playlistBadge}>
                <Text style={styles.playlistBadgeText}>{userPlaylistIds.length}</Text>
              </View>
            </AnimatedPressable>
          </View>
        </View>

        {/* Mood Selector: Choose your Puja mood */}
        <View
          style={[
            styles.moodCard,
            {
              backgroundColor: isDark ? '#15120F' : '#FCFAF7',
              borderColor: isDark ? '#2F2720' : '#EEE8E1',
            },
          ]}
        >
          <View style={styles.moodHeaderRow}>
            <View style={styles.moodHeaderLeft}>
              <Ionicons name="sparkles" size={14} color="#B42323" />
              <Text style={[styles.moodHeading, { color: colors.textPrimary }]}>
                {isBn ? 'আপনার পুজোর মুড বেছে নিন' : 'Choose Your Puja Mood'}
              </Text>
            </View>
            {selectedMood !== 'All' && (
              <AnimatedPressable
                scaleTo={motion.scale.chip}
                onPress={() => setSelectedMood('All')}
                accessibilityRole="button"
                accessibilityLabel="Clear mood filter"
              >
                <Text style={styles.clearMoodText}>
                  {isBn ? 'সব মুড দেখুন' : 'Clear Mood Filter'}
                </Text>
              </AnimatedPressable>
            )}
          </View>

          <View style={styles.moodPillsRow}>
            <AnimatedPressable
              scaleTo={motion.scale.chip}
              onPress={() => setSelectedMood('All')}
              style={[
                styles.moodChip,
                {
                  backgroundColor: selectedMood === 'All' ? '#B42323' : (isDark ? '#1A1613' : '#FFFFFF'),
                  borderColor: selectedMood === 'All' ? '#B42323' : (isDark ? '#2F2720' : '#EEE8E1'),
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select all moods"
            >
              <Text
                style={[
                  styles.moodChipText,
                  { color: selectedMood === 'All' ? '#FFFFFF' : (isDark ? '#A89E95' : '#665A54') },
                  selectedMood === 'All' && { fontWeight: '800' },
                ]}
              >
                {isBn ? 'সকল মুড' : 'All Moods'}
              </Text>
            </AnimatedPressable>

            {PUJA_MOODS_LIST.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <AnimatedPressable
                  key={m.id}
                  scaleTo={motion.scale.chip}
                  onPress={() => setSelectedMood(m.id)}
                  style={[
                    styles.moodChip,
                    {
                      backgroundColor: isSelected ? '#B42323' : (isDark ? '#1A1613' : '#FFFFFF'),
                      borderColor: isSelected ? '#B42323' : (isDark ? '#2F2720' : '#EEE8E1'),
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select mood ${m.label}`}
                >
                  <Text
                    style={[
                      styles.moodChipText,
                      { color: isSelected ? '#FFFFFF' : (isDark ? '#A89E95' : '#665A54') },
                      isSelected && { fontWeight: '800' },
                    ]}
                  >
                    {isBn ? m.labelBn : m.label}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        {/* Search Bar & Play Full Playlist Action */}
        <View style={styles.filterSection}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: isDark ? '#1A1613' : '#FFFFFF',
                borderColor: isDark ? '#2F2720' : '#EEE8E1',
              },
            ]}
          >
            <Ionicons name="search" size={16} color="#776D65" style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder={isBn ? 'গান, শিল্পী বা বোল খুঁজুন...' : 'Search tracks, artists, rhythms...'}
              placeholderTextColor="#776D65"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <AnimatedPressable
                scaleTo={motion.scale.icon}
                onPress={() => setSearchQuery('')}
                accessibilityLabel="Clear music search"
              >
                <Ionicons name="close-circle" size={16} color="#776D65" />
              </AnimatedPressable>
            )}
          </View>

          {viewTab === 'playlist' && userPlaylistTracks.length > 0 && (
            <AnimatedPressable
              scaleTo={motion.scale.button}
              onPress={handlePlayUserPlaylist}
              style={styles.playFullPlaylistBtn}
              accessibilityRole="button"
              accessibilityLabel="Play entire playlist"
            >
              <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.playFullPlaylistText}>
                {isBn ? 'পুরো প্লেলিস্ট চালান' : 'Play Full Playlist'}
              </Text>
            </AnimatedPressable>
          )}

          {/* Horizontal Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            <AnimatedPressable
              scaleTo={motion.scale.chip}
              onPress={() => setSelectedCategory('All')}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === 'All'
                      ? (isDark ? '#EDE5DC' : '#242424')
                      : (isDark ? '#1A1613' : '#FFFFFF'),
                  borderColor:
                    selectedCategory === 'All'
                      ? (isDark ? '#EDE5DC' : '#242424')
                      : (isDark ? '#2F2720' : '#EEE8E1'),
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Select all categories"
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color:
                      selectedCategory === 'All'
                        ? (isDark ? '#1A1613' : '#FFFFFF')
                        : (isDark ? '#A89E95' : '#665A54'),
                    fontWeight: selectedCategory === 'All' ? '800' : '600',
                  },
                ]}
              >
                {isBn ? 'সকল ক্যাটেগরি' : 'All Categories'}
              </Text>
            </AnimatedPressable>

            {MUSIC_CATEGORIES_META.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <AnimatedPressable
                  key={cat.id}
                  scaleTo={motion.scale.chip}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected
                        ? (isDark ? '#EDE5DC' : '#242424')
                        : (isDark ? '#1A1613' : '#FFFFFF'),
                      borderColor: isSelected
                        ? (isDark ? '#EDE5DC' : '#242424')
                        : (isDark ? '#2F2720' : '#EEE8E1'),
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select category ${cat.name}`}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      {
                        color: isSelected
                          ? (isDark ? '#1A1613' : '#FFFFFF')
                          : (isDark ? '#A89E95' : '#665A54'),
                        fontWeight: isSelected ? '800' : '600',
                      },
                    ]}
                  >
                    {isBn ? cat.nameBn : cat.name}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Tracks List */}
        <View style={styles.tracksSection}>
          <View style={styles.tracksHeaderRow}>
            <Text style={[styles.tracksHeading, { color: colors.textPrimary }]}>
              {viewTab === 'playlist'
                ? (isBn ? `আমার সংরক্ষিত প্লেলিস্ট (${filteredTracks.length} টি)` : `My Curated Playlist (${filteredTracks.length})`)
                : (isBn ? `শারদীয়া সুরের সম্ভার (${filteredTracks.length} টি)` : `Curated Audio Library (${filteredTracks.length})`)}
            </Text>
            <Text style={[styles.verifiedBadge, { color: colors.textMuted }]}>
              {isBn ? 'যাচাইকৃত লাইসেন্স ও সোর্স' : 'Verified Licences & Authorized Streams'}
            </Text>
          </View>

          {filteredTracks.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: isDark ? '#15120F' : '#FCFAF7',
                  borderColor: isDark ? '#2F2720' : '#EEE8E1',
                },
              ]}
            >
              <Ionicons name="musical-notes-outline" size={38} color="#776D65" style={{ opacity: 0.35 }} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {viewTab === 'playlist'
                  ? (isBn ? 'আপনার প্লেলিস্টে কোনো গান নেই।' : 'No tracks saved in your playlist yet.')
                  : (isBn ? 'কোনো গান বা বোল পাওয়া যায়নি।' : 'No matching tracks found.')}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                {viewTab === 'playlist'
                  ? (isBn ? 'যেকোনো গানের পাশের বুকমার্ক আইকনটিতে ক্লিক করে আপনার নিজস্ব শারদীয়া প্লেলিস্ট তৈরি করুন।' : 'Click the bookmark icon on any track to assemble your custom Puja hopping playlist.')
                  : (isBn ? 'অন্য ক্যাটেগরি বা মুড নির্বাচন করে অনুসন্ধান করুন।' : 'Try resetting your mood filter or search query.')}
              </Text>
            </View>
          ) : (
            <View style={[styles.tracksGrid, isLandscape && { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }]}>
              {visibleTracks.map((track: MusicTrack) => {
                const isSelected = currentTrack?.id === track.id;
                const isThisPlaying = isSelected && isPlaying;
                const inPlaylist = isInPlaylist(track.id);
                const title = isBn ? (track.titleBn || track.title) : track.title;
                const artist = isBn ? (track.artistBn || track.artist) : track.artist;
                const desc = isBn ? track.descriptionBn : track.description;

                return (
                  <AnimatedPressable
                    key={track.id}
                    scaleTo={0.98}
                    onPress={() => {
                      if (isSelected) {
                        togglePlayPause();
                      } else {
                        playTrack(track);
                      }
                    }}
                    style={[
                      styles.trackCard,
                      {
                        backgroundColor: isSelected && isPlaying
                          ? (isDark ? 'rgba(52, 27, 24, 0.6)' : 'rgba(253, 238, 238, 0.6)')
                          : (isSelected
                            ? (isDark ? '#1F1B17' : '#FBF7F3')
                            : (isDark ? '#1A1613' : '#FFFFFF')),
                        borderColor: isSelected && isPlaying
                          ? (isDark ? '#4A2420' : '#F6CECA')
                          : (isSelected
                            ? (isDark ? '#382F27' : '#EADCCE')
                            : (isDark ? '#2F2720' : '#EEE8E1')),
                      },
                      isLandscape && { width: '48.8%' },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Track ${title} by ${artist}`}
                  >
                  <View style={styles.trackTopRow}>
                    {/* 48px Cover Image */}
                    <View style={[styles.coverBox, { borderColor: isDark ? '#2F2720' : '#EEE8E1' }]}>
                      <Image
                        source={require('../../assets/images/durga-miniplayer.jpg')}
                        style={styles.coverImg}
                        resizeMode="cover"
                      />
                    </View>

                    {/* Play/Pause Button */}
                    <AnimatedPressable
                      scaleTo={motion.scale.button}
                      onPress={() => {
                        if (isSelected) {
                          togglePlayPause();
                        } else {
                          playTrack(track);
                        }
                      }}
                      style={[
                        styles.playBtn,
                        {
                          backgroundColor: isThisPlaying ? '#D52F2F' : (isDark ? '#201C18' : '#FFFFFF'),
                          borderColor: isThisPlaying ? '#D52F2F' : (isDark ? '#2F2720' : '#EEE8E1'),
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={isThisPlaying ? 'Pause track' : 'Play track'}
                    >
                      <Ionicons
                        name={isThisPlaying ? 'pause' : 'play'}
                        size={16}
                        color={isThisPlaying ? '#FFFFFF' : '#D52F2F'}
                        style={{ marginLeft: isThisPlaying ? 0 : 2 }}
                      />
                    </AnimatedPressable>

                    {/* Metadata */}
                    <View style={styles.trackInfo}>
                      <Text style={[styles.trackTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                        {title}
                      </Text>
                      <Text style={[styles.trackArtist, { color: colors.textMuted }]} numberOfLines={1}>
                        {artist} • <Text style={{ color: '#B42323', fontWeight: '700' }}>{track.category}</Text>
                      </Text>
                      {desc && (
                        <Text style={[styles.trackDesc, { color: isDark ? '#7D736A' : '#8D8278' }]} numberOfLines={2}>
                          {desc}
                        </Text>
                      )}
                    </View>

                    {/* Right duration & playlist bookmark */}
                    <View style={styles.trackRightCol}>
                      <Text style={styles.durationText}>{formatSeconds(track.durationSeconds)}</Text>
                      <AnimatedPressable
                        scaleTo={motion.scale.icon}
                        onPress={() => {
                          togglePlaylistTrack(track.id);
                        }}
                        style={styles.bookmarkBtn}
                        accessibilityRole="button"
                        accessibilityLabel={inPlaylist ? 'Remove from playlist' : 'Save to playlist'}
                      >
                        <Ionicons
                          name={inPlaylist ? 'bookmark' : 'bookmark-outline'}
                          size={18}
                          color={inPlaylist ? '#B42323' : '#776D65'}
                        />
                      </AnimatedPressable>
                    </View>
                  </View>

                  {/* Cultural Context / License Details Footer */}
                  <View
                    style={[
                      styles.trackFooterRow,
                      { borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                    ]}
                  >
                    <Text style={[styles.licenseText, { color: colors.textMuted }]} numberOfLines={1}>
                      {track.licenseType}
                    </Text>
                    <View style={styles.footerRightBadges}>
                      <View
                        style={[
                          styles.methodBadge,
                          {
                            backgroundColor:
                              track.playbackMethod === 'direct_audio'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'rgba(180, 35, 35, 0.1)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.methodBadgeText,
                            {
                              color:
                                track.playbackMethod === 'direct_audio'
                                  ? (isDark ? '#6EE7B7' : '#047857')
                                  : '#B42323',
                            },
                          ]}
                        >
                          {track.playbackMethod === 'direct_audio'
                            ? (isBn ? 'সরাসরি অডিও' : 'Direct Audio')
                            : (isBn ? 'অনুমোদিত স্ট্রিম' : 'Authorized Stream')}
                        </Text>
                      </View>
                      {track.sourceUrl && (
                        <AnimatedPressable
                          preset="chip"
                          scaleTo={0.92}
                          onPress={() => Linking.openURL(track.sourceUrl).catch(() => {})}
                          style={styles.sourceLink}
                        >
                          <Text style={[styles.sourceLinkText, { color: colors.textMuted }]}>
                            {isBn ? 'সোর্স' : 'Source'}
                          </Text>
                          <Ionicons name="open-outline" size={11} color={colors.textMuted} />
                        </AnimatedPressable>
                      )}
                    </View>
                  </View>
                </AnimatedPressable>
              );
            })}

            {filteredTracks.length > displayLimit && (
              <AnimatedPressable
                scaleTo={0.96}
                onPress={() => setDisplayLimit((prev) => prev + 10)}
                style={[
                  styles.loadMoreBtn,
                  {
                    backgroundColor: isDark ? '#201C18' : '#F6F3EF',
                    borderColor: isDark ? '#2F2720' : '#EEE8E1',
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Load more tracks"
              >
                <Ionicons name="chevron-down" size={16} color={colors.primary} />
                <Text style={[styles.loadMoreText, { color: colors.primary }]}>
                  {isBn
                    ? `আরো গান দেখুন (+১০টি, বাকি ${filteredTracks.length - displayLimit}টি)`
                    : `Show More Tracks (+10, ${filteredTracks.length - displayLimit} remaining)`}
                </Text>
              </AnimatedPressable>
            )}
            </View>
          )}
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
    paddingTop: 16,
    gap: 16,
  },
  headerSection: {
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B42323',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  viewSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  switcherTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  playlistTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switcherTabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  switcherTabText: {
    fontSize: 12,
  },
  playlistBadge: {
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(180, 35, 35, 0.12)',
  },
  playlistBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B42323',
  },
  moodCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
  },
  moodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  clearMoodText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B42323',
  },
  moodPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  moodChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  moodChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  filterSection: {
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  playFullPlaylistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B42323',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  playFullPlaylistText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 11,
  },
  tracksSection: {
    gap: 10,
  },
  tracksHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  tracksHeading: {
    fontSize: 15,
    fontWeight: '900',
  },
  verifiedBadge: {
    fontSize: 10,
  },
  emptyCard: {
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280,
  },
  trackCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  trackTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  coverBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: '#F8F0E8',
  },
  coverImg: {
    width: '100%',
    height: '100%',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  trackInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  trackTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  trackArtist: {
    fontSize: 11,
  },
  trackDesc: {
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
  tracksGrid: {
    gap: 10,
  },
  trackRightCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B42323',
  },
  bookmarkBtn: {
    padding: 4,
  },
  trackFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  licenseText: {
    fontSize: 9,
    flex: 1,
  },
  footerRightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  methodBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sourceLinkText: {
    fontSize: 9,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
