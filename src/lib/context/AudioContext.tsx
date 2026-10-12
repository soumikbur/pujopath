'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { MusicTrack } from '@/types';
import { PUJA_MUSIC_DATA } from '@/data/music';

interface AudioContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  playbackError: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  queue: MusicTrack[];
  isFullScreenOpen: boolean;
  playTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  setIsFullScreenOpen: (open: boolean) => void;
  addToQueue: (track: MusicTrack) => void;
  clearError: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(PUJA_MUSIC_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(PUJA_MUSIC_DATA[0]?.durationSeconds || 100);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [queue, setQueue] = useState<MusicTrack[]>(PUJA_MUSIC_DATA);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize single HTML5 Audio element on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-advance to next track in queue
      const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
      if (currentIndex !== -1 && currentIndex < queue.length - 1) {
        const next = queue[currentIndex + 1];
        playTrackInternal(next);
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      if (audio.src && audio.src !== window.location.href) {
        setPlaybackError(
          'Audio stream could not be loaded directly. Use the official source link to listen.'
        );
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audioRef.current = null;
    };
  }, []);

  // Update MediaSession on supported devices
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator) || !currentTrack) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: 'PujoPath — Durga Puja 2026',
        artwork: [
          {
            src: currentTrack.coverUrl,
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
    } catch {
      // mediaSession safe fallback
    }
  }, [currentTrack]);

  const playTrackInternal = useCallback(
    (track: MusicTrack) => {
      setPlaybackError(null);
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(track.durationSeconds || 60);

      const audio = audioRef.current;
      if (!audio) return;

      if (track.playbackMethod === 'external_listen_link' || !track.audioUrl) {
        audio.pause();
        audio.src = '';
        setIsPlaying(false);
        setIsLoading(false);
        if (track.externalListenUrl && typeof window !== 'undefined') {
          window.open(track.externalListenUrl, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      setIsLoading(true);
      audio.src = track.audioUrl;
      audio.volume = volume;
      audio.currentTime = 0;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          setIsLoading(false);
          setIsPlaying(false);
          if (err.name === 'NotAllowedError') {
            // Autoplay prevented by browser policy; user interaction required
            setPlaybackError('Click play to allow audio playback.');
          } else {
            setPlaybackError('Playback error. Use the source link to listen.');
          }
        });
      }
    },
    [volume]
  );

  const playTrack = (track: MusicTrack) => {
    playTrackInternal(track);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (currentTrack.playbackMethod === 'external_listen_link' || !currentTrack.audioUrl) {
      if (currentTrack.externalListenUrl && typeof window !== 'undefined') {
        window.open(currentTrack.externalListenUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      setPlaybackError(null);
      if (!audio.src || audio.src === window.location.href) {
        audio.src = currentTrack.audioUrl;
      }
      audio.play().catch((err) => {
        if (err.name !== 'AbortError') {
          setPlaybackError('Playback blocked by browser. Click play to start.');
        }
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const nextIdx = (currentIndex + 1) % queue.length;
    playTrackInternal(queue[nextIdx]);
  };

  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
    playTrackInternal(queue[prevIdx]);
  };

  const seek = (seconds: number) => {
    if (audioRef.current && isFinite(seconds)) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const addToQueue = (track: MusicTrack) => {
    setQueue((prev) => (prev.some((t) => t.id === track.id) ? prev : [...prev, track]));
  };

  const clearError = () => {
    setPlaybackError(null);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        playbackError,
        currentTime,
        duration,
        volume,
        queue,
        isFullScreenOpen,
        playTrack,
        togglePlay,
        pause,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        setIsFullScreenOpen,
        addToQueue,
        clearError,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
