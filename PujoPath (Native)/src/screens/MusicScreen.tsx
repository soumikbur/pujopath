import React, { useState } from 'react';
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
import { MUSIC_TRACKS_DATA, MUSIC_CATEGORIES_META } from '@/data/music';
import { MusicTrack, MusicCategory } from '@/types';

interface MusicScreenProps {
  navigation: any;
}

export const MusicScreen: React.FC<MusicScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { currentTrack, isPlaying, playTrack, togglePlayPause, positionMs, durationMs } = useAudio();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTracks = selectedCategory === 'All'
    ? MUSIC_TRACKS_DATA
    : MUSIC_TRACKS_DATA.filter((t) => t.category === selectedCategory);

  const formatMs = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Category Filter Horizontal Chips */}
      <View style={styles.filterRowContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            onPress={() => setSelectedCategory('All')}
            style={[
              styles.catChip,
              {
                backgroundColor: selectedCategory === 'All' ? colors.primary : colors.surface,
                borderColor: selectedCategory === 'All' ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.catChipText,
                { color: selectedCategory === 'All' ? '#FFFFFF' : colors.textSecondary, fontWeight: selectedCategory === 'All' ? '700' : '500' },
              ]}
            >
              {language === 'bn' ? 'সব গান' : 'All Tracks'}
            </Text>
          </TouchableOpacity>

          {MUSIC_CATEGORIES_META.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catChipText,
                    { color: isSelected ? '#FFFFFF' : colors.textSecondary, fontWeight: isSelected ? '700' : '500' },
                  ]}
                >
                  {language === 'bn' ? cat.nameBn : cat.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Active Player Deck Card if Playing */}
        {currentTrack && (
          <View style={[styles.playerDeck, { backgroundColor: colors.surface, borderColor: colors.gold }]}>
            <View style={styles.playerTopRow}>
              <View style={[styles.deckIconBox, { backgroundColor: colors.primary }]}>
                <Ionicons name="musical-notes" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.deckInfo}>
                <Text style={[styles.deckTitle, { color: colors.text }]} numberOfLines={1}>
                  {language === 'bn' ? (currentTrack.titleBn || currentTrack.title) : currentTrack.title}
                </Text>
                <Text style={[styles.deckArtist, { color: colors.textMuted }]} numberOfLines={1}>
                  {currentTrack.artist} • {currentTrack.category}
                </Text>
              </View>
            </View>

            {/* Playback Progress */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBarTrack, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: colors.primary,
                      width: durationMs > 0 ? `${(positionMs / durationMs) * 100}%` : '0%',
                    },
                  ]}
                />
              </View>
              <View style={styles.progressTimeRow}>
                <Text style={[styles.timeText, { color: colors.textMuted }]}>{formatMs(positionMs)}</Text>
                <Text style={[styles.timeText, { color: colors.textMuted }]}>{formatMs(durationMs)}</Text>
              </View>
            </View>

            {/* Player Controls */}
            <View style={styles.deckControls}>
              <TouchableOpacity
                onPress={togglePlayPause}
                style={[styles.bigPlayBtn, { backgroundColor: colors.primary }]}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={26}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            {/* License & Source Attribution */}
            {currentTrack.attribution && (
              <Text style={[styles.attributionText, { color: colors.textMuted }]}>
                📜 {currentTrack.attribution} ({currentTrack.licenseType})
              </Text>
            )}
          </View>
        )}

        {/* Tracks List */}
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: colors.text }]}>
            {language === 'bn' ? 'পূজার সঙ্গীত সংগ্রহ' : 'Authentic Durga Puja Tracks'}
          </Text>
          <Text style={[styles.listCount, { color: colors.textMuted }]}>
            {filteredTracks.length} {language === 'bn' ? 'টি গান' : 'tracks'}
          </Text>
        </View>

        {filteredTracks.map((track) => {
          const isThisPlaying = currentTrack?.id === track.id && isPlaying;
          const title = language === 'bn' ? (track.titleBn || track.title) : track.title;
          const artist = language === 'bn' ? (track.artistBn || track.artist) : track.artist;

          return (
            <TouchableOpacity
              key={track.id}
              activeOpacity={0.85}
              onPress={() => {
                if (currentTrack?.id === track.id) {
                  togglePlayPause();
                } else {
                  playTrack(track);
                }
              }}
              style={[
                styles.trackCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: currentTrack?.id === track.id ? colors.primary : colors.border,
                },
              ]}
            >
              <View style={[styles.trackPlayBox, { backgroundColor: colors.badge }]}>
                <Ionicons
                  name={isThisPlaying ? 'pause' : 'play'}
                  size={18}
                  color={colors.primary}
                />
              </View>

              <View style={styles.trackDetails}>
                <Text style={[styles.trackTitle, { color: colors.text }]} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={[styles.trackArtist, { color: colors.textMuted }]} numberOfLines={1}>
                  {artist} • {Math.floor(track.durationSeconds / 60)}:{(track.durationSeconds % 60) < 10 ? '0' : ''}{track.durationSeconds % 60}
                </Text>
              </View>

              <View style={[styles.catBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.catBadgeText, { color: colors.textSecondary }]}>
                  {track.category.split(' ')[0]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterRowContainer: {
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  playerDeck: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  playerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deckIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deckInfo: {
    flex: 1,
  },
  deckTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  deckArtist: {
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  progressTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
  },
  deckControls: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bigPlayBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attributionText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  listCount: {
    fontSize: 12,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  trackPlayBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  trackArtist: {
    fontSize: 11,
    marginTop: 2,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
