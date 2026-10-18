import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MusicTrack } from '@/types';
import { MUSIC_TRACKS_DATA } from '@/data/music';

const USER_PLAYLIST_STORAGE_KEY = '@pujopath_user_playlist';

interface AudioContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  playTrack: (track: MusicTrack) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (positionMillis: number) => Promise<void>;
  stopAudio: () => Promise<void>;
  userPlaylistIds: string[];
  addToPlaylist: (trackId: string) => void;
  removeFromPlaylist: (trackId: string) => void;
  togglePlaylistTrack: (trackId: string) => void;
  isInPlaylist: (trackId: string) => boolean;
  playQueue: (tracks: MusicTrack[]) => void;
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
  userPlaylistIds: [],
  addToPlaylist: () => {},
  removeFromPlaylist: () => {},
  togglePlaylistTrack: () => {},
  isInPlaylist: () => false,
  playQueue: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [positionMs, setPositionMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [userPlaylistIds, setUserPlaylistIds] = useState<string[]>([]);

  const playerRef = useRef<AudioPlayer | null>(null);

  // Hydrate user playlist from storage
  useEffect(() => {
    AsyncStorage.getItem(USER_PLAYLIST_STORAGE_KEY)
      .then((data) => {
        if (data) {
          try {
            setUserPlaylistIds(JSON.parse(data));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const savePlaylist = async (ids: string[]) => {
    setUserPlaylistIds(ids);
    try {
      await AsyncStorage.setItem(USER_PLAYLIST_STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  };

  const addToPlaylist = (trackId: string) => {
    if (!userPlaylistIds.includes(trackId)) {
      savePlaylist([...userPlaylistIds, trackId]);
    }
  };

  const removeFromPlaylist = (trackId: string) => {
    savePlaylist(userPlaylistIds.filter((id) => id !== trackId));
  };

  const togglePlaylistTrack = (trackId: string) => {
    if (userPlaylistIds.includes(trackId)) {
      removeFromPlaylist(trackId);
    } else {
      addToPlaylist(trackId);
    }
  };

  const isInPlaylist = (trackId: string) => {
    return userPlaylistIds.includes(trackId);
  };

  const playQueue = (tracks: MusicTrack[]) => {
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  useEffect(() => {
    // Configure audio mode for background & mobile playback
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldRouteThroughEarpiece: false,
    }).catch(() => {});

    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, []);

  const playTrack = async (track: MusicTrack) => {
    try {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }

      setCurrentTrack(track);
      setIsPlaying(true);

      const streamUrl = track.audioUrl || (track as any).directStreamUrl;
      if (!streamUrl) {
        console.warn('No audio URL provided for track:', track.title);
        setIsPlaying(false);
        return;
      }

      const player = createAudioPlayer(streamUrl);
      playerRef.current = player;

      player.addListener('playbackStatusUpdate', (status) => {
        if (status.isLoaded) {
          setPositionMs(Math.round((status.currentTime || 0) * 1000));
          setDurationMs(Math.round((status.duration || 0) * 1000));
          setIsPlaying(status.playing);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPositionMs(0);
          }
        }
      });

      player.play();
    } catch (error) {
      console.warn('Failed to load track:', error);
      setIsPlaying(false);
    }
  };

  const togglePlayPause = async () => {
    if (!playerRef.current) {
      if (currentTrack) {
        await playTrack(currentTrack);
      } else if (MUSIC_TRACKS_DATA.length > 0) {
        await playTrack(MUSIC_TRACKS_DATA[0]);
      }
      return;
    }

    try {
      if (playerRef.current.playing) {
        playerRef.current.pause();
        setIsPlaying(false);
      } else {
        playerRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn('togglePlayPause error:', err);
    }
  };

  const seekTo = async (positionMillis: number) => {
    if (playerRef.current) {
      try {
        await playerRef.current.seekTo(positionMillis / 1000);
      } catch (err) {
        console.warn('seekTo error:', err);
      }
    }
  };

  const stopAudio = async () => {
    if (playerRef.current) {
      try {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
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
        userPlaylistIds,
        addToPlaylist,
        removeFromPlaylist,
        togglePlaylistTrack,
        isInPlaylist,
        playQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);

