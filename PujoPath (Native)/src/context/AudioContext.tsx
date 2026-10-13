import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { MusicTrack } from '@/types';
import { MUSIC_TRACKS_DATA } from '@/data/music';

interface AudioContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  playTrack: (track: MusicTrack) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (positionMillis: number) => Promise<void>;
  stopAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType>({
  currentTrack: null,
  isPlaying: false,
  positionMs: 0,
  durationMs: 0,
  playTrack: async () => {},
  togglePlayPause: async () => {},
  seekTo: async () => {},
  stopAudio: async () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [positionMs, setPositionMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Configure audio mode for mobile playback
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPositionMs(status.positionMillis);
      setDurationMs(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPositionMs(0);
      }
    } else if (status.error) {
      console.warn('Playback error:', status.error);
      setIsPlaying(false);
    }
  };

  const playTrack = async (track: MusicTrack) => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      setCurrentTrack(track);
      setIsPlaying(true);

      const streamUrl = track.audioUrl || (track as any).directStreamUrl;
      if (!streamUrl) {
        console.warn('No audio URL provided for track:', track.title);
        setIsPlaying(false);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: streamUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
    } catch (error) {
      console.warn('Failed to load track:', error);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) {
      if (currentTrack) {
        await playTrack(currentTrack);
      } else if (MUSIC_TRACKS_DATA.length > 0) {
        await playTrack(MUSIC_TRACKS_DATA[0]);
      }
      return;
    }

    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (err) {
      console.warn('togglePlayPause error:', err);
    }
  };

  const seekTo = async (positionMillis: number) => {
    if (soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(positionMillis);
      } catch (err) {
        console.warn('seekTo error:', err);
      }
    }
  };

  const stopAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      } catch {}
      setIsPlaying(false);
      setCurrentTrack(null);
      setPositionMs(0);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        positionMs,
        durationMs,
        playTrack,
        togglePlayPause,
        seekTo,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
