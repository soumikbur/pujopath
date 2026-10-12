'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { MusicTrack } from '@/types';
import { PUJA_MUSIC_DATA } from '@/data/music';

export type PlaybackState = 'IDLE' | 'LOADING' | 'PLAYING' | 'PAUSED' | 'ENDED' | 'ERROR';
export type PlaybackType = 'direct' | 'embed' | null;

interface AudioContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  playbackState: PlaybackState;
  playbackType: PlaybackType;
  playbackError: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  toggleMute: () => void;
  queue: MusicTrack[];
  isFullScreenOpen: boolean;
  isStreamExpanded: boolean;
  setIsStreamExpanded: (expanded: boolean) => void;
  playTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  setIsFullScreenOpen: (open: boolean) => void;
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (trackId: string) => void;
  playQueue: (tracks: MusicTrack[]) => void;
  userPlaylistIds: string[];
  addToPlaylist: (trackId: string) => void;
  removeFromPlaylist: (trackId: string) => void;
  togglePlaylistTrack: (trackId: string) => void;
  isInPlaylist: (trackId: string) => boolean;
  clearError: () => void;
  isPlayerDismissed: boolean;
  closePlayer: () => void;
  resumePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const USER_PLAYLIST_STORAGE_KEY = 'pujopath_user_playlist';

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(PUJA_MUSIC_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('IDLE');
  const [playbackType, setPlaybackType] = useState<PlaybackType>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(PUJA_MUSIC_DATA[0]?.durationSeconds || 99);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [queue, setQueue] = useState<MusicTrack[]>(PUJA_MUSIC_DATA);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);
  const [isStreamExpanded, setIsStreamExpanded] = useState<boolean>(false);
  const [userPlaylistIds, setUserPlaylistIds] = useState<string[]>([]);
  const [isPlayerDismissed, setIsPlayerDismissed] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const embedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hydrate user playlist from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(USER_PLAYLIST_STORAGE_KEY);
      if (stored) {
        setUserPlaylistIds(JSON.parse(stored));
      }
    } catch {
      // safe fallback
    }
  }, []);

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
      setPlaybackState('LOADING');
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setPlaybackState('PLAYING');
    };

    const handlePause = () => {
      setIsPlaying(false);
      setPlaybackState('PAUSED');
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setPlaybackState('ENDED');
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
      setPlaybackState('ERROR');
      if (audio.src && audio.src !== window.location.href) {
        setPlaybackError(
          'Audio stream could not be loaded directly. Please check your connection and retry.'
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
  }, [currentTrack?.id, queue]);

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

  // Internal playback handler enforcing ONE active session
  const playTrackInternal = useCallback(
    (track: MusicTrack) => {
      setIsPlayerDismissed(false);
      setPlaybackError(null);
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(track.durationSeconds || 60);

      const audio = audioRef.current;

      // Handle Direct HTML5 Audio playback
      if (track.playbackMethod === 'direct_audio' && track.audioUrl) {
        setPlaybackType('direct');
        setIsStreamExpanded(false);

        if (audio) {
          audio.pause();
          setIsLoading(true);
          setPlaybackState('LOADING');
          audio.src = track.audioUrl;
          audio.volume = isMuted ? 0 : volume;
          audio.currentTime = 0;

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setIsLoading(false);
                setPlaybackState('PLAYING');
              })
              .catch((err) => {
                setIsLoading(false);
                setIsPlaying(false);
                setPlaybackState('ERROR');
                if (err.name === 'NotAllowedError') {
                  setPlaybackError('Browser autoplay blocked. Click play to listen.');
                } else {
                  setPlaybackError('Could not load audio. Click play to retry.');
                }
              });
          }
        }
        return;
      }

      // Handle Authorized In-Page Stream (e.g. YouTube oEmbed/iFrame)
      if (track.playbackMethod === 'authorized_stream' || track.embedUrl) {
        // STRICT ENFORCEMENT: Stop any currently playing HTML5 direct audio immediately!
        if (audio) {
          audio.pause();
          audio.src = '';
        }

        setPlaybackType('embed');
        setIsStreamExpanded(true);
        setIsLoading(false);
        setIsPlaying(true);
        setPlaybackState('PLAYING');
        return;
      }

      // Fallback for non-direct or external link tracks
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      setIsPlaying(false);
      setIsLoading(false);
      setPlaybackState('IDLE');
    },
    [isMuted, volume]
  );

  // Virtual playback timer for authorized embed streams so progress & duration are displayed
  useEffect(() => {
    if (embedTimerRef.current) {
      clearInterval(embedTimerRef.current);
      embedTimerRef.current = null;
    }

    if (playbackType === 'embed' && isPlaying) {
      embedTimerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            setPlaybackState('ENDED');
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (embedTimerRef.current) {
        clearInterval(embedTimerRef.current);
      }
    };
  }, [playbackType, isPlaying, duration]);

  const playTrack = (track: MusicTrack) => {
    playTrackInternal(track);
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    const audio = audioRef.current;

    if (playbackType === 'direct') {
      if (!audio) return;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        setPlaybackState('PAUSED');
      } else {
        setIsPlayerDismissed(false);
        setPlaybackError(null);
        if (!audio.src || audio.src === window.location.href) {
          audio.src = currentTrack.audioUrl || '';
        }
        audio.volume = isMuted ? 0 : volume;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setPlaybackState('PLAYING');
          })
          .catch((err) => {
            if (err.name !== 'AbortError') {
              setPlaybackError('Playback blocked by browser. Click play to start.');
            }
          });
      }
    } else if (playbackType === 'embed') {
      if (isPlaying) {
        setIsPlaying(false);
        setPlaybackState('PAUSED');
      } else {
        setIsPlayerDismissed(false);
        setPlaybackError(null);
        setIsPlaying(true);
        setPlaybackState('PLAYING');
        setIsStreamExpanded(true);
      }
    } else {
      // Track selected but not yet started
      playTrackInternal(currentTrack);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setPlaybackState('PAUSED');
  };

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setPlaybackState('PAUSED');
    setIsPlayerDismissed(true);
    setIsStreamExpanded(false);
  }, []);

  const resumePlayer = useCallback(() => {
    setIsPlayerDismissed(false);
    if (currentTrack) {
      togglePlay();
    }
  }, [currentTrack]);

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
    if (!isFinite(seconds)) return;
    const clamped = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(clamped);
    if (playbackType === 'direct' && audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  };

  // Keyboard navigation shortcuts for media playback
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in forms or search boxes
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Space') {
        if (!isPlayerDismissed && currentTrack) {
          e.preventDefault();
          togglePlay();
        }
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        if (!isPlayerDismissed && currentTrack) {
          e.preventDefault();
          nextTrack();
        }
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        if (!isPlayerDismissed && currentTrack) {
          e.preventDefault();
          prevTrack();
        }
      } else if (e.code === 'KeyM') {
        if (!isPlayerDismissed) {
          e.preventDefault();
          toggleMute();
        }
      } else if (e.code === 'Escape') {
        if (isStreamExpanded) {
          e.preventDefault();
          setIsStreamExpanded(false);
        } else if (!isPlayerDismissed && isPlaying) {
          e.preventDefault();
          closePlayer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerDismissed, currentTrack, isPlaying, isStreamExpanded, togglePlay, nextTrack, prevTrack, toggleMute, closePlayer]);

  const addToQueue = (track: MusicTrack) => {
    setQueue((prev) => (prev.some((t) => t.id === track.id) ? prev : [...prev, track]));
  };

  const removeFromQueue = (trackId: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== trackId));
  };

  const playQueue = (tracks: MusicTrack[]) => {
    if (tracks.length === 0) return;
    setQueue(tracks);
    playTrackInternal(tracks[0]);
  };

  const addToPlaylist = (trackId: string) => {
    setUserPlaylistIds((prev) => {
      if (prev.includes(trackId)) return prev;
      const updated = [...prev, trackId];
      try {
        localStorage.setItem(USER_PLAYLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // safe
      }
      return updated;
    });
  };

  const removeFromPlaylist = (trackId: string) => {
    setUserPlaylistIds((prev) => {
      const updated = prev.filter((id) => id !== trackId);
      try {
        localStorage.setItem(USER_PLAYLIST_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // safe
      }
      return updated;
    });
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

  const clearError = () => {
    setPlaybackError(null);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        playbackState,
        playbackType,
        playbackError,
        currentTime,
        duration,
        volume,
        isMuted,
        toggleMute,
        queue,
        isFullScreenOpen,
        isStreamExpanded,
        setIsStreamExpanded,
        playTrack,
        togglePlay,
        pause,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        setIsFullScreenOpen,
        addToQueue,
        removeFromQueue,
        playQueue,
        userPlaylistIds,
        addToPlaylist,
        removeFromPlaylist,
        togglePlaylistTrack,
        isInPlaylist,
        clearError,
        isPlayerDismissed,
        closePlayer,
        resumePlayer,
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

