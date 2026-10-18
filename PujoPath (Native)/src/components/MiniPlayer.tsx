import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudio } from '@/context/AudioContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const MiniPlayer: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { currentTrack, isPlaying, positionMs, durationMs, togglePlayPause, stopAudio } = useAudio();
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const reduceMotion = useReducedMotion();

  const entranceAnim = useRef(new Animated.Value(0)).current;
  const playScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentTrack) {
      if (reduceMotion) {
        entranceAnim.setValue(1);
      } else {
        Animated.timing(entranceAnim, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    }
  }, [Boolean(currentTrack), reduceMotion]);

  if (!currentTrack) return null;

  const handleTogglePlay = () => {
    if (!reduceMotion) {
      playScale.setValue(0.84);
      Animated.spring(playScale, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }).start();
    }
    togglePlayPause();
  };

  const handleStop = () => {
    if (reduceMotion) {
      stopAudio();
    } else {
      Animated.timing(entranceAnim, {
        toValue: 0,
        duration: 160,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        stopAudio();
      });
    }
  };

  const floatingBottom = 56 + Math.max(insets.bottom, 8) + 8;

  const translateY = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  const opacity = entranceAnim;

  const trackTitle = language === 'bn' ? (currentTrack.titleBn || currentTrack.title) : currentTrack.title;
  const artistName = language === 'bn'
    ? (currentTrack.artistBn || currentTrack.artist || 'শারদীয়া সুর ও চণ্ডীপাঠ')
    : (currentTrack.artist || 'Traditional Soundscape');

  const formatSeconds = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = durationMs > 0 ? Math.min(100, Math.max(0, (positionMs / durationMs) * 100)) : 0;

  return (
    <View style={[styles.floatingWrapper, { bottom: floatingBottom }]} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? 'rgba(26, 22, 19, 0.95)' : 'rgba(255, 250, 244, 0.95)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.70)',
            opacity: opacity,
            transform: [{ translateY: translateY }],
          },
        ]}
      >
        {/* Top-edge integrated progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)' }]}>
          <View style={[styles.progressBar, { width: `${progressPercent}%`, backgroundColor: '#D52F2F' }]} />
        </View>

        <View style={styles.innerRow}>
          {/* 1. Album Artwork 44x44 */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation?.navigate('Music')}
            style={[
              styles.artworkContainer,
              { borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.45)' },
            ]}
          >
            <Image
              source={require('../../assets/images/durga-miniplayer.jpg')}
              style={styles.artworkImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* 2. Track Title, Artist & Time */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation?.navigate('Music')}
            style={styles.infoContainer}
          >
            <Text
              style={[styles.title, { color: isDark ? '#EDE5DC' : '#292525' }]}
              numberOfLines={1}
            >
              {trackTitle}
            </Text>
            <Text
              style={[styles.artist, { color: isDark ? 'rgba(237,229,220,0.60)' : 'rgba(41,37,37,0.58)' }]}
              numberOfLines={1}
            >
              {artistName}
            </Text>
            <Text
              style={[styles.timeText, { color: isDark ? 'rgba(237,229,220,0.50)' : 'rgba(41,37,37,0.48)' }]}
            >
              {formatSeconds(positionMs)} / {formatSeconds(durationMs || 100000)}
            </Text>
          </TouchableOpacity>

          {/* 3. Action Controls */}
          <View style={styles.controlsRow}>
            {/* Red Circular Play / Pause Button with tactile spring bounce */}
            <TouchableOpacity
              onPress={handleTogglePlay}
              activeOpacity={0.8}
              accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
            >
              <Animated.View
                style={[
                  styles.playButton,
                  { transform: [{ scale: playScale }] },
                ]}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={16}
                  color="#FFFFFF"
                  style={{ marginLeft: isPlaying ? 0 : 2 }}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Playlist navigation icon */}
            <TouchableOpacity
              onPress={() => navigation?.navigate('Music')}
              activeOpacity={0.7}
              style={styles.actionIconBtn}
              accessibilityLabel="View music library"
            >
              <Ionicons
                name="list"
                size={16}
                color={isDark ? '#EDE5DC' : 'rgba(41,37,37,0.60)'}
              />
            </TouchableOpacity>

            {/* Close button with slide out */}
            <TouchableOpacity
              onPress={handleStop}
              activeOpacity={0.7}
              style={styles.actionIconBtn}
              accessibilityLabel="Close media player"
            >
              <Ionicons
                name="close"
                size={16}
                color={isDark ? '#EDE5DC' : 'rgba(41,37,37,0.60)'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 1000,
  },
  container: {
    height: 72,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  progressTrack: {
    height: 3,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  innerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  artworkContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  artworkImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 15,
  },
  artist: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
    lineHeight: 13,
  },
  timeText: {
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D52F2F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D52F2F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconBtn: {
    padding: 6,
    borderRadius: 12,
  },
});
