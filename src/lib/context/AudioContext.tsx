'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MusicTrack } from '@/types';
import { PUJA_MUSIC_DATA } from '@/data/music';

interface AudioContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(PUJA_MUSIC_DATA[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(PUJA_MUSIC_DATA[0].durationSeconds);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [queue, setQueue] = useState<MusicTrack[]>(PUJA_MUSIC_DATA);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopSynth = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  const startSynth = (track: MusicTrack) => {
    stopSynth();
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      let step = 0;
      synthTimerRef.current = setInterval(() => {
        if (!ctx || ctx.state === 'closed') return;
        const now = ctx.currentTime;
        step = (step + 1) % 16;

        const master = ctx.createGain();
        master.gain.setValueAtTime(volume * 0.15, now);
        master.connect(ctx.destination);

        if (track.category === 'Dhak' || track.category === 'Devotional') {
          if (step === 0 || step === 4 || step === 8 || step === 12) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
            gain.gain.setValueAtTime(1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(master);
            osc.start(now);
            osc.stop(now + 0.25);
          }

          if (step % 2 === 0 || step === 7 || step === 15) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(580, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
            osc.connect(gain);
            gain.connect(master);
            osc.start(now);
            osc.stop(now + 0.1);
          }

          if (step === 0 || step === 8) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1240, now);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            osc.connect(gain);
            gain.connect(master);
            osc.start(now);
            osc.stop(now + 0.6);
          }
        } else {
          if (step % 4 === 0) {
            const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
            const freq = notes[Math.floor(Math.random() * notes.length)];
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
            osc.connect(gain);
            gain.connect(master);
            osc.start(now);
            osc.stop(now + 0.75);
          }
        }
      }, 160);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      stopSynth();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  // Clean unmount
  useEffect(() => {
    return () => {
      stopSynth();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setDuration(track.durationSeconds);
    setCurrentTime(0);
    setIsPlaying(true);
    startSynth(track);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSynth();
    } else {
      if (currentTrack) {
        setIsPlaying(true);
        startSynth(currentTrack);
      }
    }
  };

  const pause = () => {
    setIsPlaying(false);
    stopSynth();
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playTrack(queue[nextIndex]);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[prevIndex]);
  };

  const seek = (seconds: number) => {
    setCurrentTime(Math.min(Math.max(0, seconds), duration));
  };

  const setVolume = (vol: number) => {
    setVolumeState(Math.min(Math.max(0, vol), 1));
  };

  const addToQueue = (track: MusicTrack) => {
    if (!queue.some((t) => t.id === track.id)) {
      setQueue((prev) => [...prev, track]);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
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
