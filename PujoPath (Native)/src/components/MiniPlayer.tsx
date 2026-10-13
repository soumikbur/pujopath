import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '@/context/AudioContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface MiniPlayerProps {
  onPress?: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress }) => {
  const { currentTrack, isPlaying, togglePlayPause, stopAudio } = useAudio();
  const { colors } = useTheme();
  const { language } = useLanguage();

  if (!currentTrack) return null;

  const trackTitle = language === 'bn' ? (currentTrack.titleBn || currentTrack.title) : currentTrack.title;
  const artistName = language === 'bn' ? (currentTrack.artistBn || currentTrack.artist) : currentTrack.artist;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.artworkIcon, { backgroundColor: colors.primary }]}>
        <Ionicons name="musical-notes" size={18} color="#FFFFFF" />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {trackTitle}
        </Text>
        <Text style={[styles.artist, { color: colors.textMuted }]} numberOfLines={1}>
          {artistName} • {currentTrack.category}
        </Text>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          onPress={togglePlayPause}
          style={[styles.playBtn, { backgroundColor: colors.primary }]}
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={stopAudio}
          style={styles.closeBtn}
          accessibilityLabel="Stop audio"
        >
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  artworkIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  artist: {
    fontSize: 11,
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    padding: 4,
  },
});
